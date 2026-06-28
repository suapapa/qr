import asyncio
import functools
import io
import os
import urllib.parse
from typing import Optional

import qrcode
from PIL import Image, ImageChops, ImageDraw
from fastapi import FastAPI, File, Form, HTTPException, Response, UploadFile
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="QR Code Generator API")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MAX_CLEAR_LINEAR_FRACTION = 0.25
MIN_QUIET_ZONE = 4
# 고정 마스크 패턴: best_mask_pattern() 8회 탐색 비용 제거
FIXED_MASK_PATTERN = 0


@functools.lru_cache(maxsize=32)
def _alpha_threshold_table(threshold: int):
    return [255 if value > threshold else 0 for value in range(256)]


@functools.lru_cache(maxsize=1)
def _default_logo_path() -> Optional[str]:
    for path in ("logo.png", "/app/logo.png", "../logo.png"):
        if os.path.exists(path):
            return path
    return None


def _hex_to_rgb(color):
    if isinstance(color, str) and color.startswith("#") and len(color) == 7:
        return tuple(int(color[i : i + 2], 16) for i in (1, 3, 5))
    return color


def _render_matrix(matrix, box_size, border, fill_color="black", back_color="white"):
    """QR 모듈 행렬을 PIL 이미지로 렌더링합니다."""
    module_count = len(matrix)
    grid = module_count + border * 2
    fill_rgb = _hex_to_rgb(fill_color)
    back_rgb = _hex_to_rgb(back_color)
    img = Image.new("RGB", (grid, grid), back_rgb)
    pixels = img.load()
    offset = border

    for row_idx, row in enumerate(matrix):
        y = row_idx + offset
        for col_idx, is_dark in enumerate(row):
            if is_dark:
                pixels[col_idx + offset, y] = fill_rgb

    if box_size == 1:
        return img
    return img.resize((grid * box_size, grid * box_size), Image.Resampling.NEAREST)


def _clear_center_circle(matrix, diameter_modules):
    """중앙 원형 영역의 QR 모듈을 비웁니다."""
    module_count = len(matrix)
    if diameter_modules >= module_count:
        raise ValueError("로고 영역이 QR 코드보다 큽니다.")

    center = module_count / 2.0
    radius_sq = (diameter_modules / 2.0) ** 2

    for row_idx, row in enumerate(matrix):
        module_center_r = row_idx + 0.5
        dr = module_center_r - center
        dr_sq = dr * dr
        for col_idx in range(module_count):
            module_center_c = col_idx + 0.5
            dc = module_center_c - center
            if dr_sq + dc * dc <= radius_sq:
                row[col_idx] = False

    return matrix


def _draw_center_circle(img, center_px, radius_px, fill="white"):
    draw = ImageDraw.Draw(img)
    x, y = center_px
    draw.ellipse(
        [x - radius_px, y - radius_px, x + radius_px, y + radius_px],
        fill=fill,
    )


def _trim_logo(logo, alpha_threshold=10):
    """로고 이미지 주변의 투명/균일 여백을 제거합니다."""
    logo = logo.convert("RGBA")
    alpha = logo.split()[3]
    bbox = alpha.point(_alpha_threshold_table(alpha_threshold)).getbbox()
    if bbox:
        return logo.crop(bbox)

    rgb = logo.convert("RGB")
    bg = Image.new("RGB", rgb.size, rgb.getpixel((0, 0)))
    bbox = ImageChops.difference(rgb, bg).getbbox()
    if bbox:
        return logo.crop(bbox)
    return logo


def _fit_logo_size(logo, max_width, max_height):
    """로고를 지정된 영역 안에 맞게 비율을 유지하며 리사이즈합니다."""
    aspect_ratio = logo.size[0] / logo.size[1]
    if aspect_ratio > max_width / max_height:
        new_width = max_width
        new_height = int(new_width / aspect_ratio)
    else:
        new_height = max_height
        new_width = int(new_height * aspect_ratio)
    return logo.resize((new_width, new_height), Image.Resampling.LANCZOS)


def _make_odd(value):
    return value if value % 2 == 1 else value + 1


def _compute_logo_layout(module_count, logo_fraction, padding_modules):
    """로고/여백 크기를 모듈 단위로 계산합니다."""
    max_clear = max(5, int(module_count * MAX_CLEAR_LINEAR_FRACTION))
    max_clear = _make_odd(max_clear)

    requested_logo = max(3, int(module_count * logo_fraction))
    requested_logo = _make_odd(requested_logo)
    requested_clear = _make_odd(requested_logo + padding_modules * 2)

    clear_modules = min(requested_clear, max_clear)
    logo_modules = clear_modules - padding_modules * 2
    if logo_modules < 3:
        logo_modules = 3
        clear_modules = _make_odd(logo_modules + padding_modules * 2)
        if clear_modules > max_clear:
            padding_modules = max(0, (max_clear - logo_modules) // 2)
            clear_modules = _make_odd(logo_modules + padding_modules * 2)

    clamped = clear_modules < requested_clear
    return logo_modules, clear_modules, padding_modules, clamped


def _escape_wifi_field(value):
    """WiFi QR 문자열에서 특수문자를 이스케이프합니다."""
    return (
        value.replace("\\", "\\\\")
        .replace(";", "\\;")
        .replace(",", "\\,")
        .replace('"', '\\"')
    )


def build_wifi_payload(ssid, password="", security="WPA"):
    """WiFi QR 코드용 페이로드 문자열을 생성합니다."""
    escaped_ssid = _escape_wifi_field(ssid)
    if security == "nopass" or not password:
        return f"WIFI:T:nopass;S:{escaped_ssid};;"
    escaped_pass = _escape_wifi_field(password)
    return f"WIFI:T:{security};S:{escaped_ssid};P:{escaped_pass};;"


def _build_qr_matrix(data, version_bump=0):
    """QR 버전 관리 및 행렬 생성"""
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=1,
        border=MIN_QUIET_ZONE,
        mask_pattern=FIXED_MASK_PATTERN,
    )
    qr.add_data(data)
    qr.make(fit=True)
    min_version = qr.version

    target_version = min(min_version + version_bump, 40)
    if target_version == min_version:
        return qr.get_matrix(), min_version

    for version in range(target_version, min_version, -1):
        candidate = qrcode.QRCode(
            version=version,
            error_correction=qrcode.constants.ERROR_CORRECT_H,
            box_size=1,
            border=MIN_QUIET_ZONE,
            mask_pattern=FIXED_MASK_PATTERN,
        )
        candidate.add_data(data)
        try:
            candidate.make(fit=False)
            return candidate.get_matrix(), version
        except qrcode.exceptions.DataOverflowError:
            continue

    raise ValueError("데이터가 너무 깁니다. 더 높은 QR 버전이 필요합니다.")


def build_payload(
    qr_type: str,
    url: Optional[str] = None,
    text: Optional[str] = None,
    wifi_ssid: Optional[str] = None,
    wifi_pass: Optional[str] = None,
    wifi_security: Optional[str] = "WPA",
    phone: Optional[str] = None,
    email_to: Optional[str] = None,
    email_subject: Optional[str] = None,
    email_body: Optional[str] = None,
    sms_phone: Optional[str] = None,
    sms_message: Optional[str] = None,
) -> str:
    """타입별로 QR 데이터 페이로드를 생성합니다."""
    if qr_type == "url":
        if not url:
            raise HTTPException(
                status_code=400, detail="URL을 입력해주세요."
            )
        if not (
            url.startswith("http://")
            or url.startswith("https://")
            or url.startswith("mailto:")
            or url.startswith("tel:")
        ):
            url = "https://" + url
        return url
    elif qr_type == "wifi":
        if not wifi_ssid:
            raise HTTPException(
                status_code=400, detail="WiFi SSID(이름)을 입력해주세요."
            )
        return build_wifi_payload(wifi_ssid, wifi_pass or "", wifi_security or "WPA")
    elif qr_type == "phone":
        if not phone:
            raise HTTPException(
                status_code=400, detail="전화번호를 입력해주세요."
            )
        return f"tel:{phone}"
    elif qr_type == "sms":
        if not sms_phone:
            raise HTTPException(
                status_code=400, detail="수신 전화번호를 입력해주세요."
            )
        msg = sms_message or ""
        return f"SMSTO:{sms_phone}:{msg}"
    elif qr_type == "email":
        if not email_to:
            raise HTTPException(
                status_code=400, detail="수신 이메일 주소를 입력해주세요."
            )
        subject = email_subject or ""
        body = email_body or ""
        query = urllib.parse.urlencode({"subject": subject, "body": body})
        return f"mailto:{email_to}?{query}"
    elif qr_type == "text":
        if not text:
            raise HTTPException(
                status_code=400, detail="텍스트 내용을 입력해주세요."
            )
        return text
    else:
        raise HTTPException(
            status_code=400, detail=f"지원하지 않는 QR 타입입니다: {qr_type}"
        )


@app.get("/api/health")
async def health_check():
    return {"status": "ok"}


def _generate_qr_image(
    data: str,
    *,
    logo_bytes: Optional[bytes],
    use_default_logo: bool,
    logo_fraction: float,
    box_size: int,
    border: int,
    version_bump: int,
    trim_logo: bool,
    fill_color: str,
    back_color: str,
) -> bytes:
    logo_img = None
    if logo_bytes:
        logo_img = Image.open(io.BytesIO(logo_bytes))
    elif use_default_logo:
        default_path = _default_logo_path()
        if default_path:
            logo_img = Image.open(default_path)

    matrix, _version = _build_qr_matrix(data, version_bump=version_bump)
    module_count = len(matrix)

    if logo_img:
        logo_modules, clear_modules, _padding_modules, _clamped = _compute_logo_layout(
            module_count, logo_fraction, padding_modules=1
        )
        render_matrix = _clear_center_circle(matrix, clear_modules)
        qr_img = _render_matrix(
            render_matrix,
            box_size,
            border,
            fill_color=fill_color,
            back_color=back_color,
        )

        center_px = (
            (module_count / 2.0 + border) * box_size,
            (module_count / 2.0 + border) * box_size,
        )
        outer_radius_px = (clear_modules / 2.0) * box_size
        inner_radius_px = (logo_modules / 2.0) * box_size

        _draw_center_circle(qr_img, center_px, outer_radius_px, fill="white")

        logo_max_px = int(inner_radius_px * 2 * 0.92)
        if trim_logo:
            logo_img = _trim_logo(logo_img)
        logo_resized = _fit_logo_size(logo_img, logo_max_px, logo_max_px).convert("RGBA")
        logo_pos = (
            int(center_px[0] - logo_resized.size[0] / 2),
            int(center_px[1] - logo_resized.size[1] / 2),
        )
        qr_img.paste(logo_resized, logo_pos, mask=logo_resized)
    else:
        qr_img = _render_matrix(
            matrix,
            box_size,
            border,
            fill_color=fill_color,
            back_color=back_color,
        )

    img_byte_arr = io.BytesIO()
    qr_img.save(img_byte_arr, format="PNG", compress_level=3)
    return img_byte_arr.getvalue()


@app.post("/api/generate")
async def generate_qr(
    qr_type: str = Form("url"),
    url: Optional[str] = Form(None),
    text: Optional[str] = Form(None),
    wifi_ssid: Optional[str] = Form(None),
    wifi_pass: Optional[str] = Form(None),
    wifi_security: Optional[str] = Form("WPA"),
    phone: Optional[str] = Form(None),
    email_to: Optional[str] = Form(None),
    email_subject: Optional[str] = Form(None),
    email_body: Optional[str] = Form(None),
    sms_phone: Optional[str] = Form(None),
    sms_message: Optional[str] = Form(None),
    # Configs
    logo_fraction: float = Form(0.20),
    box_size: int = Form(12),
    border: int = Form(4),
    version_bump: int = Form(0),
    trim_logo: bool = Form(True),
    use_default_logo: bool = Form(False),
    # Styling colors (Hex)
    fill_color: str = Form("#000000"),
    back_color: str = Form("#ffffff"),
    # File
    logo_file: Optional[UploadFile] = File(None),
):
    try:
        data = build_payload(
            qr_type=qr_type,
            url=url,
            text=text,
            wifi_ssid=wifi_ssid,
            wifi_pass=wifi_pass,
            wifi_security=wifi_security,
            phone=phone,
            email_to=email_to,
            email_subject=email_subject,
            email_body=email_body,
            sms_phone=sms_phone,
            sms_message=sms_message,
        )

        logo_bytes = None
        if logo_file and logo_file.filename:
            logo_bytes = await logo_file.read()

        png_bytes = await asyncio.to_thread(
            _generate_qr_image,
            data,
            logo_bytes=logo_bytes,
            use_default_logo=use_default_logo,
            logo_fraction=logo_fraction,
            box_size=box_size,
            border=border,
            version_bump=version_bump,
            trim_logo=trim_logo,
            fill_color=fill_color,
            back_color=back_color,
        )

        return Response(content=png_bytes, media_type="image/png")

    except ValueError as val_err:
        raise HTTPException(status_code=400, detail=str(val_err))
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"QR Code 생성 중 서버 오류 발생: {str(e)}"
        )

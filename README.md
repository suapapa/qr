# QR Code Studio

중앙에 맞춤 로고를 삽입하고 실시간 디자인 테마를 조합할 수 있는 프리미엄 QR 코드 생성 스튜디오입니다.

빠르고 안전한 **Rust WebAssembly (WASM)** 기반 이미지 처리 엔진과 모던 **Vanilla JS** 프론트엔드로 구성되어 있어 **백엔드 서버 없이 브라우저 내에서 100% 동작**합니다.

---

## 🚀 빠른 시작 (Quick Start)

별도의 백엔드 없이 정적 웹 호스팅 환경에서 바로 실행할 수 있습니다.

### 1. 로컬 개발 및 실행 (Python 이용)
파이썬이 설치되어 있다면 내장 웹 서버를 사용하여 가장 빠르게 실행해볼 수 있습니다.
```bash
# 저장소 클론 후 frontend 디렉터리로 이동
cd frontend

# 정적 파일 서버 실행
python -m http.server 8081
```
브라우저에서 [http://localhost:8081](http://localhost:8081)에 접속합니다.

### 2. Docker Compose 배포
도커를 선호하거나 프로덕션 환경에 Nginx 컨테이너로 배포하고자 할 경우 아래 명령어를 사용합니다.
```bash
docker compose up -d --build
```
컨테이너 구동이 완료되면 브라우저에서 [http://localhost:8081](http://localhost:8081)로 접속합니다.

---

## 🌍 GitHub Pages 자동 배포

이 프로젝트는 `.github/workflows/gh-pages.yml`을 통해 **GitHub Pages**에 자동으로 배포될 수 있도록 구성되어 있습니다.

1. 저장소를 자신의 계정으로 Fork 하거나 Clone 합니다.
2. GitHub 저장소의 **Settings > Pages** 메뉴로 이동합니다.
3. **Build and deployment** 섹션의 Source를 **"GitHub Actions"**로 변경합니다.
4. 코드를 `main` 브랜치에 푸시하면 자동으로 Rust 코드가 WebAssembly로 빌드되어 페이지로 배포됩니다.

---

## ⚙️ 커스터마이징 (Configuration)

### 시스템 기본 로고 교체
QR 생성기에서 기본적으로 노출되는 중앙 로고 이미지(`logo.png`)를 교체하고 싶다면 `frontend/logo.png` 파일을 원하는 이미지 파일로 덮어씌우면 됩니다. 배경이 투명한 PNG를 권장합니다.

### WASM 모듈 수정 및 빌드
이미지 처리 로직을 수정하려면 `wasm_qr` 디렉터리의 Rust 코드를 수정해야 합니다. (로컬에 Rust와 `wasm-pack`이 설치되어 있어야 합니다.)
```bash
cd wasm_qr
wasm-pack build --target web

# 빌드된 결과물 적용
cp -r pkg/* ../frontend/wasm/
```

---

## ⚠️ 트러블슈팅 (Troubleshooting)

*   **QR 생성이 동작하지 않고 멈춥니다.**
    브라우저 콘솔(F12)을 열어 WASM 모듈 로딩 시 에러가 발생하지 않았는지 확인합니다. 최신 브라우저가 아닐 경우 WebAssembly가 지원되지 않을 수 있습니다.
*   **WASM 파일을 찾을 수 없다는(404) 에러가 발생합니다.**
    빌드된 WASM 파일이 `frontend/wasm/` 디렉터리에 올바르게 위치해 있는지 확인하세요. 만약 빌드 결과물이 없다면 위의 **WASM 모듈 수정 및 빌드** 과정을 진행해주세요.

---

## License

This project is licensed under the [MIT License](LICENSE).

Copyright (c) 2026 Homin Lee

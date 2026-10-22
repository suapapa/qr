# QR Studio

> [English](README.md)

**바로 사용하기: [qr.homin.dev](https://qr.homin.dev/)**

중앙에 맞춤 로고를 삽입하고 실시간 디자인 테마를 조합할 수 있는 프리미엄 QR 코드 생성 스튜디오입니다.

빠르고 안전한 **Rust WebAssembly (WASM)** 기반 이미지 처리 엔진과 모던 **Vanilla JS** 프론트엔드로 구성되어 있어 **백엔드 서버 없이 브라우저 내에서 100% 동작**합니다. 입력값이 서버로 전송되지 않습니다.

---

## ✨ 기능

- **URL, Wi-Fi, 텍스트, 전화, SMS, 이메일** QR 코드 생성
- QR 코드 **중앙에 맞춤 로고** 삽입 및 크기 조절 (로고 삽입 시 오류 복구 수준 H 자동 적용으로 스캔 인식 유지)
- 완성된 QR을 **PNG로 다운로드**하거나 클립보드에 복사
- **무료 · 회원가입 없음 · 설치 없음** — 최신 브라우저에서 바로 사용
- 한국어, English, 日本語, 中文, Polski 지원

## 🚀 빠른 시작

설치 없이 [qr.homin.dev](https://qr.homin.dev/)를 열면 바로 사용할 수 있습니다.

로컬에서 실행하려면:

```bash
cd frontend
python -m http.server 8081
```

브라우저에서 [http://localhost:8081](http://localhost:8081)에 접속합니다.

## 🔗 URL 쿼리 파라미터로 미리 채우기

주소줄에 쿼리 파라미터를 붙이면 폼이 자동으로 채워지고 QR 코드가 생성됩니다. 예: `?type=txt&content=hello`, `?type=wifi&ssid=my-router&pass=1234`

전체 파라미터 목록, 타입 별칭, 인코딩 방법은 [docs/url-query-params.md](docs/url-query-params.md)를 참고하세요.

---

## 🛠 기여자를 위한 안내

배포(GitHub Pages / Docker), WASM 재빌드, OG 이미지 생성, SEO/GEO 유지보수 방법은 [AGENTS.md](AGENTS.md)에 정리되어 있습니다.

## License

This project is licensed under the [MIT License](LICENSE).

Copyright (c) 2026 Homin Lee

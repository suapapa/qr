# QR Studio

> [한국어](README.ko.md)

**Live: [qr.homin.dev](https://qr.homin.dev/)**

A premium QR code generator studio that lets you embed a custom logo in the center and combine live design themes.

Built with a fast, secure **Rust WebAssembly (WASM)** image processing engine and a modern **Vanilla JS** frontend, it runs **entirely in the browser with no backend server** — your input is never sent to a server.

---

## ✨ Features

- QR codes for **URL, Wi-Fi, text, phone, SMS, and email**
- Custom **logo in the center** of the QR code, with adjustable size (ECC level H applied automatically so it stays scannable)
- Download the result as **PNG**, or copy it to the clipboard
- **Free, no sign-up, no installation** — works in any modern browser
- Available in 한국어, English, 日本語, 中文, and Polski

## 🚀 Quick Start

Just open [qr.homin.dev](https://qr.homin.dev/) — nothing to install.

To run it locally:

```bash
cd frontend
python -m http.server 8081
```

Then open [http://localhost:8081](http://localhost:8081) in your browser.

## 🔗 Pre-fill via URL query parameters

You can open QR Studio with form fields already filled and a QR code generated—for example, `?type=txt&content=hello` or `?type=wifi&ssid=my-router&pass=1234`.

See [docs/url-query-params.md](docs/url-query-params.md) for the full parameter reference, type aliases, and encoding notes.

---

## 🛠 For contributors

Deployment (GitHub Pages / Docker), WASM rebuilds, OG image generation, and SEO/GEO maintenance are documented in [AGENTS.md](AGENTS.md).

## License

This project is licensed under the [MIT License](LICENSE).

Copyright (c) 2026 Homin Lee

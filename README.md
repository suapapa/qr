# QR Studio

> [한국어](README.ko.md)

A premium QR code generator studio that lets you embed a custom logo in the center and combine live design themes.

Built with a fast, secure **Rust WebAssembly (WASM)** image processing engine and a modern **Vanilla JS** frontend, it runs **entirely in the browser with no backend server**.

---

## 🚀 Quick Start

You can run it immediately in any static web hosting environment—no backend required.

### 1. Local development (Python)
If Python is installed, you can spin up the built-in web server for the fastest local run:
```bash
# Clone the repo, then move into the frontend directory
cd frontend

# Start the static file server
python -m http.server 8081
```
Open [http://localhost:8081](http://localhost:8081) in your browser.

### 2. Docker Compose deployment
If you prefer Docker or want to deploy with an Nginx container in production, use:
```bash
docker compose up -d --build
```
Once the container is running, open [http://localhost:8081](http://localhost:8081) in your browser.

---

## 🌍 GitHub Pages auto-deployment

This project is set up for automatic deployment to **GitHub Pages** via `.github/workflows/gh-pages.yml`.

1. Fork or clone the repository to your account.
2. Go to **Settings > Pages** in the GitHub repository.
3. Under **Build and deployment**, set Source to **"GitHub Actions"**.
4. Push to the `main` branch—the Rust code will be built to WebAssembly and deployed automatically.

---

## 🔗 Pre-fill via URL query parameters

You can open QR Studio with form fields already filled and a QR code generated—for example, `?type=txt&content=hello` or `?type=wifi&ssid=my-router&pass=1234`.

See [docs/url-query-params.md](docs/url-query-params.md) for the full parameter reference, type aliases, and encoding notes.

---

## ⚙️ Configuration

### Replace the default logo
To change the default center logo shown in the QR generator, replace `frontend/logo.png` with your image. A PNG with a transparent background is recommended.

### Modify and build the WASM module
To change the image processing logic, edit the Rust code in the `wasm_qr` directory. (Rust and `wasm-pack` must be installed locally.)
```bash
cd wasm_qr
wasm-pack build --target web

# Copy build artifacts into the frontend
cp -r pkg/* ../frontend/wasm/
```

---

## ⚠️ Troubleshooting

*   **QR generation hangs or does not work.**
    Open the browser console (F12) and check for errors while loading the WASM module. Older browsers may not support WebAssembly.
*   **WASM file not found (404) error.**
    Confirm that the built WASM files are in `frontend/wasm/`. If they are missing, follow the **Modify and build the WASM module** steps above.

---

## License

This project is licensed under the [MIT License](LICENSE).

Copyright (c) 2026 Homin Lee

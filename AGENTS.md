# AGENTS.md — QR Studio Development Guide

This file is for contributors and AI agents. User-facing documentation lives in
[README.md](README.md) / [README.ko.md](README.ko.md) — keep them short; put
implementation, deployment, and maintenance details here instead.

Live site: https://qr.homin.dev/

## Project overview

QR Studio is a fully client-side QR code generator: a Rust **WebAssembly**
image engine plus a **Vanilla JS** frontend. There is **no backend server** —
all QR generation runs in the user's browser, so user input (URLs, Wi-Fi
passwords, …) is never transmitted. Keep it that way: do not add network calls
for QR generation.

Supported QR types: URL, Wi-Fi, text, phone, SMS, email. Users can embed a
custom logo in the QR center, adjust logo size / quiet-zone, pick an ECC level
(logo insertion forces ECC H), and download the result as PNG or copy it.

## Repository layout

```
qr/
├── wasm_qr/                    # Rust WebAssembly source
│   ├── src/lib.rs              # QR generation + logo compositing (generate_qr_wasm)
│   └── Cargo.toml
├── frontend/                   # Everything deployed as static files
│   ├── index.html              # Semantic layout, SEO/OG meta, JSON-LD, visible FAQ/HowTo
│   ├── app.js                  # DOM logic, i18n (ko/en/ja/zh/pl), WASM calls, URL query params
│   ├── style.css               # Vanilla CSS, dark theme (CSS custom properties in :root)
│   ├── logo.png                # Default center logo
│   ├── favicon.svg / apple-touch-icon.png
│   ├── og-image.jpg / og-image.png   # Social share image (1200×630, see OG image below)
│   ├── robots.txt / sitemap.xml / llms.txt / site.webmanifest / CNAME (qr.homin.dev)
│   ├── nginx.conf / Dockerfile # Docker deployment only
│   ├── vendor/                 # Vendored libs (lucide) — no external CDN by design
│   └── wasm/                   # wasm-pack build output copied from wasm_qr/pkg
├── scripts/                    # OG image generation (see below)
├── docs/url-query-params.md    # URL query parameter reference
├── .github/workflows/
│   ├── gh-pages.yml            # Rust → WASM build + GitHub Pages deploy (push to main)
│   └── docker-build.yml        # Multi-arch (amd64/arm64) frontend image → GHCR
└── docker-compose.yml          # Local/production Nginx run (port 8081)
```

## Local development

No bundler is needed:

```bash
cd frontend
python -m http.server 8081   # http://localhost:8081
```

### Rebuilding the WASM module

After editing Rust code in `wasm_qr/` (requires Rust + `wasm-pack`):

```bash
cd wasm_qr
wasm-pack build --target web
cp -r pkg/* ../frontend/wasm/
```

`wasm_qr/pkg/` and `target/` are git-ignored; the copied output in
`frontend/wasm/` is what gets served/deployed. The JS entry point is
`generate_qr_wasm`, imported at the top of `frontend/app.js`.

### Docker

```bash
docker compose up -d --build   # http://localhost:8081
```

## Deployment

### GitHub Pages (primary, serves qr.homin.dev)

`.github/workflows/gh-pages.yml` deploys on push to `main`/`master`: it builds
the WASM module, copies it into `frontend/wasm/`, and uploads `./frontend` as
the Pages artifact.

1. Go to **Settings > Pages** and set Source to **"GitHub Actions"**.
2. Custom domain is declared in `frontend/CNAME` (`qr.homin.dev`); DNS needs a
   `qr.homin.dev CNAME → suapapa.github.io` record.
3. Push to `main` — build and deploy run automatically.

### Docker / GHCR (alternative)

`docker-build.yml` builds the `frontend/Dockerfile` (nginx:alpine) image for
`linux/amd64` + `linux/arm64` and pushes it to GHCR on branch/tag pushes.

## Configuration

- **Default logo:** replace `frontend/logo.png` (transparent-background PNG
  recommended).
- **Default URL prefill:** `DEFAULT_URL` in `frontend/app.js`.

## OG image

`frontend/og-image.jpg` is designed artwork (not an app screenshot): a
generated QR illustration composited with typography. Do not regenerate it by
capturing the site UI.

```bash
node scripts/generate-og-image.mjs   # renders scripts/og-template.html + scripts/og-art.jpg
                                     # → frontend/og-image.png / og-image.jpg (1200×630)
```

Requires ImageMagick (`magick`) and Playwright (local or global install; falls
back to system Chrome). To revise the artwork, replace `scripts/og-art.jpg` or
edit the copy/layout in `scripts/og-template.html`, then re-run the script.

## SEO / GEO maintenance

Canonical domain is **https://qr.homin.dev/** everywhere (meta, JSON-LD,
sitemap, llms.txt). When changing features, copy, or domain, update together:

- `<head>` in `frontend/index.html`: title, description, canonical, OG/Twitter.
- JSON-LD `@graph` in `index.html` (WebSite / WebApplication / HowTo / FAQPage)
  must stay in sync with the **visible** About/HowTo/FAQ section in the page
  body — search/AI engines compare the two.
- `frontend/llms.txt` (AI-engine summary) and `frontend/sitemap.xml`.
- OG image dimensions stay 1200×630; update `og:image:width/height/alt` if the
  artwork or headline changes.

## i18n rules

- Languages: `ko` (default), `en`, `ja`, `zh`, `pl`, selected in the header and
  persisted to `localStorage`.
- Any new `data-i18n="key"` in `index.html` **must** be added to all five
  language objects in `frontend/app.js` (`translations`), including the
  SEO/GEO section keys. Untranslated keys silently keep the previous language.
- `<html lang>` and static `<head>` meta stay Korean (SEO canonical); only
  body copy is switched at runtime.

## Conventions

- No frontend framework, bundler, or external CDN — vanilla HTML/CSS/JS and
  vendored assets only (`frontend/vendor/`).
- Theme via CSS custom properties in `:root` in `style.css` (primary
  `#0a7d58`, base background `#0a0d12`); keep new UI on those tokens.
- Preserve accessibility patterns already in use: skip link, ARIA
  labels/live regions, focus-visible styles, `prefers-reduced-motion`.

## Troubleshooting

- **QR generation hangs / does nothing:** open the browser console (F12) and
  check for WASM load errors. Older browsers may not support WebAssembly.
- **WASM 404:** confirm build output exists in `frontend/wasm/`; if missing,
  follow “Rebuilding the WASM module” above.

## License

MIT — see [LICENSE](LICENSE). Copyright (c) 2026 Homin Lee.

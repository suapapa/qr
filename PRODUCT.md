# Product

## Register

product

## Users

Designers, marketers, and developers who need branded QR codes with a center logo. They use the tool at a desk or on mobile, often while preparing print assets, event materials, or Wi-Fi onboarding cards. They expect instant preview and export without signing up or uploading data to a server.

## Product Purpose

QR Code Studio generates high-quality QR codes entirely in the browser using Rust WASM. Users configure payload type (URL, Wi‑Fi, text, phone, SMS, email), optional center logo, error correction, and quiet zone, then download PNG or copy to clipboard. Success means a scannable, on-brand QR code in under a minute with no backend dependency.

## Brand Personality

**Capable, quiet, precise.** The interface stays out of the way while exposing enough control for logo placement and ECC. Tone is professional and direct—not playful marketing, not enterprise-heavy.

## Anti-references

- Generic SaaS landing-page aesthetics (cream backgrounds, hero metrics, gradient text)
- Over-decorated “AI tool” cards with glass blur and oversized radii
- Flows that require account creation or server upload for basic QR generation
- Scanner apps with cluttered ad banners or dark patterns

## Design Principles

1. **Local-first trust** — Processing happens in-browser; the UI should feel safe and transparent.
2. **Task over brand theater** — Settings and preview side-by-side; no scroll-driven storytelling.
3. **Predictable controls** — Standard form patterns, familiar tabs/selectors, consistent button hierarchy.
4. **Logo-aware defaults** — When a logo is present, ECC and version adjust automatically; explain why.
5. **Global by default** — Five-language UI with accessible names and error copy in every locale.

## Accessibility & Inclusion

- Target **WCAG 2.1 AA** for text contrast, focus visibility, keyboard navigation, and form labeling.
- Skip link, semantic landmarks, tab keyboard support, and `prefers-reduced-motion` respected.
- Touch targets ≥44px on interactive controls.
- Screen reader announcements limited to toasts and validation errors; preview frame is not a live region.

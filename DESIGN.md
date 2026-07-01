---
name: QR Studio
description: Dark, task-focused QR generator with logo embedding and live preview
colors:
  bg-base: "#0a0d12"
  bg-surface: "#141820"
  bg-input: "#0e1117"
  primary: "#0a7d58"
  primary-hover: "#086b4b"
  link: "#7dd3b0"
  text-main: "#e8ecf1"
  text-muted: "#8b95a5"
  danger: "#dc4f4f"
  border: "rgba(255, 255, 255, 0.09)"
typography:
  ui:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif"
    fontSize: "0.95rem"
    fontWeight: 400
    lineHeight: 1.6
  heading:
    fontFamily: "{typography.ui.fontFamily}"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.01em"
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
spacing:
  touch-min: "44px"
  card-padding: "2rem"
  grid-gap: "2rem"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "0.85rem 1.5rem"
    height: "48px"
  button-secondary:
    backgroundColor: "rgba(255, 255, 255, 0.03)"
    textColor: "{colors.text-main}"
    rounded: "{rounded.md}"
    padding: "0.75rem 1rem"
    height: "48px"
  card:
    backgroundColor: "{colors.bg-surface}"
    textColor: "{colors.text-main}"
    rounded: "{rounded.lg}"
    padding: "{spacing.card-padding}"
---

## Overview

QR Studio uses a **dark, restrained product UI**: near-black surfaces, green primary actions, and a two-column layout (controls left, sticky preview right). Design serves a single workflow—configure, preview, export—with no marketing hero or decorative motion. Typography is a single system-ui stack; hierarchy comes from weight and size, not font pairing.

## Colors

| Role | Token | Hex | Usage |
|------|-------|-----|-------|
| Canvas | `--bg-base` | `#0a0d12` | Page background |
| Surface | `--bg-surface` | `#141820` | Cards, panels |
| Input | `--bg-input` | `#0e1117` | Text fields, selects |
| Primary | `--color-primary` | `#0a7d58` | CTA, focus ring, success |
| Link | `--color-link` | `#7dd3b0` | Footer links (AA on dark bg) |
| Text | `--color-text-main` | `#e8ecf1` | Body, labels |
| Muted | `--color-text-muted` | `#8b95a5` | Secondary copy, placeholders |
| Danger | `--color-danger` | `#dc4f4f` | Errors, destructive hover |

Placeholders use `--color-text-muted` at full opacity (not browser-default fade). Primary green on dark surfaces is for buttons and accents only; inline links use the lighter `--color-link` token.

## Typography

- **Family:** `system-ui` stack (no external webfont).
- **Scale:** Fixed rem steps—h1 1.75rem, section titles 1.25rem, body 0.95rem, helper text 0.7–0.8rem.
- **Weights:** 400 body, 500 labels, 600 headings and buttons.
- **Line length:** Form copy stays within panel width; no wide prose blocks.

## Elevation

Depth is communicated with **1px borders** (`--color-border`), not drop shadows. Cards, toasts, and inputs share the same border vocabulary. Focus states add a 2px ring via `--color-primary-focus-ring`.

## Components

- **Card** — Surface panel with 12px radius, 2rem padding; used for controls and preview.
- **Tabs / select** — Desktop: horizontal tablist with underline active indicator. Mobile (≤768px): native select with visible label.
- **Primary button** — Full-width green CTA, 48px min height, `aria-busy` during generation.
- **Secondary buttons** — Paired download/copy actions, 48px height, disabled at 40% opacity.
- **Toggle switch** — 44×44px hit area; 44×24px visual track.
- **Upload zone** — Dashed border, keyboard activatable (`role="button"`), disabled when default logo is on.
- **ECC card** — Named block (`.ecc-card`) with labelled select and description tied via `aria-describedby`.
- **Toast** — Fixed bottom-right; `role="status"` for success, `role="alert"` for errors.

## Do's and Don'ts

**Do**
- Use CSS custom properties from `:root` for all new UI.
- Keep touch targets at or above 44px.
- Pair every select with a visible heading or label and `aria-describedby` for helper text.
- Respect `prefers-reduced-motion: reduce`.

**Don't**
- Add box-shadow on bordered cards (pick border OR shadow, not both).
- Use external font/icon CDNs in production; vendor Lucide locally.
- Set `aria-live` on the QR preview frame (auto-regen is silent).
- Use primary green for small inline link text on dark backgrounds—use `--color-link` instead.

---
name: plaud-design-system
description: Use this skill to generate well-branded interfaces and assets for Plaud, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

## Design language (argument: `core` | `dev`)

This skill ships **two design languages**. The invocation argument selects which one to use:

- **`core`** (the default brand) — Plaud's marketing identity: Jokker, neutral/ivory palette,
  signal-orange accent, light surfaces. Use for consumer marketing, decks, and the Plaud Note app.
  Files: root `README.md`, `colors_and_type.css`, `preview/`, `ui_kits/`.
- **`dev`** — the developer-platform language: dark surfaces, Jokker **+ Roboto Mono** (for code),
  cyan accent, frosted cards, `reveal-up` motion. Use for the developer portal, API docs, SDK/
  technical marketing. Files: `dev/README.md` + `dev/colors_and_type.css` (Jokker fonts + Roboto
  Mono are shared from `fonts/`).

**Routing:**
- Argument is `core` → read the root `README.md` and link `colors_and_type.css`.
- Argument is `dev` → read `dev/README.md` and link `dev/colors_and_type.css`.
- **No argument given → ASK the user first:** "Which design language — `core` (Plaud marketing
  brand) or `dev` (developer-platform / dark)?" Do not assume; wait for the answer before designing.

Key files:
- `README.md` — `core` brand context, content fundamentals, visual foundations, iconography
- `colors_and_type.css` — `core` CSS vars for color, type, spacing, radius, shadow, motion
- `dev/README.md` — `dev` (developer-platform) design-language rules
- `dev/colors_and_type.css` — `dev` CSS vars (dark palette, Jokker + Roboto Mono, frosted cards, motion)
- `fonts/` — Jokker web fonts (woff) + `RobotoMono-Regular.ttf` (used by `dev`)
- `assets/` — Plaud wordmark + "A-with-dot" brand mark, black and white
- `preview/` — `core` reference cards for type, color, spacing, components, brand
- `ui_kits/plaud-app/` — high-fidelity JSX components recreating the Plaud Note app (`core`)

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. Link `colors_and_type.css` and you'll get all tokens + Jokker font-face declarations for free.

If working on production code, copy the assets and read the rules in README.md to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions about audience/tone/surface/length, then act as an expert designer who outputs HTML artifacts or production code depending on the need.

**Key brand anchors, at a glance (`core`):**
- Single typeface: **Jokker** (400 / 600 only)
- Neutral-first palette: black, ivory (#F5F2EC), graphite greys, metallic silver
- Single hot accent: **Signal orange (#FF4A1C)** — reserved for REC / live states, never generic CTAs
- Tight radii, hairline borders, shadows are rare and ambient
- Voice: calm, declarative, product-first. Periods as design elements. Never emoji.
- Imagery: warm-neutral, cinematic, metallic product photography

**`dev` at a glance** (see `dev/README.md`): same brand recompiled dark — near-black surfaces
(#0F0F0F), **Jokker + Roboto Mono** (mono for code), cyan accent (#00D0FF), frosted translucent
cards, opacity-only hovers, `reveal-up` staggered entrance, 5px radii. No signal orange, no ivory.

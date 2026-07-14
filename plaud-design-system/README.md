# Plaud Design System

A design system for **Plaud** — the AI voice-recorder + transcription brand. This folder contains the visual foundations, typography, color, assets, and UI kits needed to design on-brand Plaud artifacts (web, app, decks, marketing).

---

## Two design languages: `core` vs `dev`

This skill ships **two languages**, selected by the invocation argument (see `SKILL.md`):

- **`core`** — the marketing brand documented in *this* README: Jokker, neutral/ivory palette,
  signal-orange accent, light surfaces. For consumer marketing, decks, and the Plaud Note app.
- **`dev`** — the **developer-platform** language: dark surfaces, Jokker **+ Roboto Mono**, cyan
  accent, frosted cards, `reveal-up` motion. For the developer portal, API docs, and technical
  marketing. Documented in [`dev/README.md`](dev/README.md); tokens in `dev/colors_and_type.css`.

Invoke with `core` or `dev` as the argument. **With no argument, the skill asks which one.** The
rest of this README describes **`core`**.

---

## Brand context

Plaud makes compact, hardware AI voice recorders (Plaud Note, Plaud NotePin) paired with a transcription & summarization app. Their visual identity is **neutral minimalism — futuristic, clean, elegant**. Product photography emphasizes the **metallic texture and material quality** of the hardware (brushed aluminum, precision milling, soft studio light).

The system is intentionally restrained: a single typeface (**Jokker**), a predominantly neutral palette (blacks, ivories, metallic greys), warm + cool hues balanced across imagery, and sparing use of a single hot-signal accent for recording / status states.

### Sources referenced

- `uploads/Plaud Brandbook & VI Application_2026_V1.pdf` — **Note: this file was referenced in the brief but was not actually uploaded to the project.** The system below is derived from the provided fonts + logos, the brief's written notes ("neutral minimalism — futuristic, clean, elegant; metallic material quality"), and general knowledge of Plaud's visual language. **Please re-upload the brandbook PDF if you want the system tightened against official guidelines.**
- `uploads/Jokker-{Regular,Italic,Semibold,SemiboldItalic}.woff` — brand typeface, copied into `/fonts`.
- `uploads/Plaud logo {black,white}.png` — wordmark, copied into `/assets/logo-wordmark-{black,white}.png`.
- `uploads/{Black,white}.png` — the "A-with-dot" brand mark, copied into `/assets/logo-mark-{black,white}.png`.

---

## Index

```
Plaud Design System/
├── README.md                — you are here
├── SKILL.md                 — agent-skill entrypoint (cross-compatible with Agent Skills)
├── colors_and_type.css      — CSS vars for color, type, spacing, radius, shadow, motion (core)
├── dev/                     — the `dev` developer-platform language
│   ├── README.md            — dev design-language rules
│   └── colors_and_type.css  — dev CSS vars (dark, Jokker + Roboto Mono, frosted, motion)
├── fonts/                   — Jokker web fonts (woff) + RobotoMono-Regular.ttf (dev)
├── assets/                  — logos (wordmark + mark, black + white)
├── preview/                 — design-system preview cards (rendered in the Design System tab)
│   ├── type-*.html
│   ├── colors-*.html
│   ├── spacing-*.html
│   ├── components-*.html
│   └── brand-*.html
└── ui_kits/
    └── plaud-app/           — AI note-taking app UI kit
        ├── README.md
        ├── index.html
        └── components/*.jsx
```

---

## Content fundamentals

Plaud's voice is **quiet, confident, product-first**. It reads like a piece of precision hardware describes itself — calm, tactile, minimal adjectives.

**Tone**
- **Calm and declarative.** Short sentences. Periods, not exclamation.
- **Second person ("you"), but sparingly.** Copy often talks about the product in the third person or drops the subject entirely ("Capture every word. Summarize in seconds.").
- **Concrete nouns over abstract benefits.** "Transcripts, summaries, speaker labels" beats "unlock your productivity."
- **No hype words.** Avoid: "revolutionary", "game-changing", "unleash", "supercharge", "magical".
- **Future-facing without being sci-fi.** "Memory, extended." not "AI of tomorrow, today."

**Casing**
- Headlines: **Sentence case.** Never ALL CAPS except for overlines / eyebrows, tiny metadata, and the wordmark itself (PLAUD).
- Overlines: UPPERCASE + wide tracking (`--tracking-overline: 0.14em`).
- Buttons: Sentence case ("Start recording", not "START RECORDING").

**Length**
- Hero headlines: 3–7 words. ("Your words, remembered.")
- Subheads: one sentence, 10–18 words.
- Body paragraphs: 2–4 sentences max per block. Prefer generous whitespace over dense paragraphs.

**Punctuation & style quirks**
- **The period is a design element.** Plaud frequently ends headlines with a period, even fragments — it gives the copy a finality that matches the minimal layouts.
- Em-dashes (—) are used for rhythm pauses. No Oxford comma required.
- Numbers: digits for quantities (3 languages), spelled out for small counts in prose (one-tap).
- Never emoji in product or marketing copy. The only "glyph" allowed is the brand mark itself.

**Voice examples (representative, not lifted)**
- Hero: "Capture every word. Remember everything."
- Subhead: "A pocket-sized AI recorder that turns meetings, lectures, and ideas into structured notes."
- Feature label: "Auto-summary" — not "Smart AI-Powered Auto-Summarization™"
- Button: "Start recording" / "Open transcript" / "Export"
- Empty state: "No recordings yet. Press the button to begin."

---

## Visual foundations

### Color

- **Neutral-first.** Pure black (#000) and warm ivory (#F5F2EC) are the anchors. Most surfaces are white, ivory, or deep graphite.
- **Cool metallic greys** (`--plaud-silver`, `--plaud-graphite-*`) evoke the brushed aluminum of the hardware. Use on product-adjacent surfaces and chrome UI.
- **Warm off-whites** (`--plaud-ivory`, `--plaud-bone`, `--plaud-sand`) for editorial/marketing contexts and paper-feeling cards.
- **One hot accent:** `--plaud-signal` (#FF4A1C) — reserved for the REC dot, live-state indicators, and destructive confirmations. Never for generic CTAs.
- Muted `--plaud-ocean` and `--plaud-ember` exist as secondary accents for data viz or illustration — use ≤5% of surface area.
- **No bluish-purple gradients. No pastels. No neon.**

### Typography

- **Jokker** is the single brand typeface. Geometric sans with rounded terminals and a distinctive circular "O" / "A" bowl that visually rhymes with the logo's dot-in-arch.
- Weights: **Regular (400)** for display, titles, and body — Plaud's headlines are set in **Jokker Regular**, not Semibold. **Semibold (600)** is reserved for UI emphasis (buttons, active states, labels, overlines). No other weights.
- Italics used sparingly — quotes, titles of works, subtle emphasis.
- Display headlines: tight tracking (`-0.02em`), balanced with `text-wrap: balance`.
- Body copy: comfortable 16–18px, `line-height: 1.45–1.6`.
- **Overlines** are the one place uppercase is embraced: small, widely-tracked, often paired with a hairline rule.

### Spacing & layout

- **4px base unit.** Spacing scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128.
- Generous section padding (`--space-16` to `--space-24` top/bottom on marketing).
- Layouts favor **asymmetric editorial** over strict grids: hero text flush-left, product image floating, large negative space.
- Container max-width: 1320px.
- **Fixed elements:** marketing nav is fixed, semi-transparent (frosted), with a hairline bottom border after scroll. App chrome is always fixed with solid surfaces.

### Backgrounds

- Predominantly **solid white or ivory**. The second most common background is **near-black / graphite** for contrast sections (hero dark modes, video cards).
- **Full-bleed product photography** with the hardware centered, lit dramatically against an infinity-gradient studio floor. Product shots are the star — treat them as full-width hero assets.
- **Metallic gradient** (`--grad-metallic`) used on product-adjacent UI and accent surfaces (never as a general page background — it's a material, not a wallpaper).
- **Protection gradients** (`--grad-protect`, a bottom-up black alpha) sit behind overlaid white captions on imagery.
- **No repeating patterns, no textures, no hand-drawn illustrations, no blobs.** Plaud's surface is smooth.

### Borders & dividers

- **Hairline is the default** — 1px with 6–14% black (`--stroke-1`, `--stroke-2`). Borders carry most of the visual separation work since shadows are rare.
- Full-width dividers between marketing sections are also hairline; a heavier rule (2–3px solid black) is reserved for editorial eyebrows and section breaks.

### Shadows & elevation

- **Shadows are rare and ambient, not dramatic.** `--shadow-xs` / `--shadow-sm` for floating cards; `--shadow-md` for modals; `--shadow-lg` only for the highest z-index (dropdowns with depth).
- Prefer `--shadow-hairline` (a 1px inset-looking ring) over drop shadows for cards at rest.
- **No colored shadows** except `--shadow-glow-signal` — a soft orange halo around the live REC indicator.

### Corner radii

- **Tight radii** are the brand default — precision-milled, not rounded-off.
- `--radius-sm` (4px) for inputs and small chips.
- `--radius-md` (8px) for cards, alerts, most panels.
- `--radius-lg` (14px) for large feature cards and modals.
- `--radius-2xl` (28px) only for the largest hero cards / phone screens.
- `--radius-pill` for buttons, filter chips, status pills.
- **Sharp (0px)** is valid too — editorial blocks, table cells, dividers.

### Buttons

- **Primary:** solid black (`--plaud-black`) fill, white text, `--radius-pill`, height 44px (min), medium-padded. Semibold label.
- **Secondary:** white fill, 1px black border, black text, pill.
- **Ghost:** transparent, underlined text on hover.
- **Destructive:** `--plaud-signal` fill, white text. Rare.
- Hover: primary → subtle lift (`translateY(-1px)`) + `--shadow-sm`. Secondary → fill goes to `--plaud-graphite-100`.
- Press: `scale(0.98)` + darken.
- Disabled: 40% opacity, no pointer.

### Cards

- White surface, `--radius-md` or `--radius-lg`, 1px `--stroke-2` border, `--shadow-hairline` at rest. Internal padding `--space-6` to `--space-8`.
- Hover: border strengthens to `--stroke-3`, optional `--shadow-sm` lift.
- Dark-mode cards use `--plaud-graphite-800` surface with `--stroke-inverse` border.

### Motion

- **Quiet, purposeful.** Standard ease: `cubic-bezier(0.22, 0.61, 0.36, 1)`. Duration 120–220ms for UI, up to 720ms for entrance/hero reveals.
- **Fades and short translates, never bounces.** No spring physics. No rotation gimmicks.
- Scroll-linked reveals: 8–16px upward translate + fade-in, staggered 40–80ms.
- Waveform animations (for recording) are the one exception: smooth sine-driven bars with slight asymmetric phasing.

### Hover & press states

- **Hover (buttons):** subtle elevation or fill shift (never scale-up).
- **Hover (links):** opacity 0.6.
- **Hover (cards):** border strengthens, optional soft shadow lift.
- **Press:** `scale(0.98)` + `--dur-fast`. Always returns with `--ease-standard`.
- **Focus:** 2px solid `--plaud-black` outline, 2px offset. On dark surfaces, `--plaud-white`.

### Transparency & blur

- **Used for chrome, not decoration.** Fixed nav bars: `backdrop-filter: blur(16px)` with a 70–80% ivory or white background. Modals: black 60% scrim. Tooltips: solid dark, no blur.
- Never use blur as a "glassmorphism" aesthetic on cards or sections — this reads as trend, not brand.

### Imagery

- Photography is **warm-neutral with a controlled cool highlight** on metal. Skin tones are natural, environments muted (ivory, taupe, charcoal). Never oversaturated.
- **Grain is allowed** in very subtle doses on editorial hero photography — cinematic, not Instagram.
- Black & white is reserved for portraits / editorial; product shots are always in color.
- Studio product photography dominates; lifestyle shots are contextual (desk, meeting, walk) but always composed and calm.

---

## Iconography

- **System:** Plaud uses a **thin-stroke, 1.5–1.75px, rounded-cap line icon** family — reads as engineered, restrained. The closest CDN match is **[Lucide](https://lucide.dev)** (`stroke-width="1.75"`, `stroke-linecap="round"`), which this system substitutes until we have the official glyph set. **Flagged:** please confirm the official Plaud icon library or share glyph SVGs.
- **Usage:** icons are monochrome (`currentColor`), sized in multiples of 4 (16, 20, 24, 32). Always paired with a label in UI — never icon-only in a primary nav.
- **Logos & marks:** the wordmark (`assets/logo-wordmark-*.png`) is the primary identity asset. The "A-with-dot" mark (`assets/logo-mark-*.png`) is the compact variant — use for favicons, app icons, small-scale chrome. Minimum clearspace around the mark = the height of the inner dot.
- **Emoji:** never in product or marketing. Not in headings, not in body copy, not in empty states.
- **Unicode as icon:** avoid. Use Lucide.
- **Built-in icon font:** none shipped. Icons come from CDN (Lucide) or can be inlined as SVG.

---

## Design system cards

See `preview/` — each HTML file is a registered card in the Design System tab. Categories: **Type**, **Colors**, **Spacing**, **Components**, **Brand**.

---

## UI kits

See `ui_kits/plaud-app/` for the AI note-taking app UI kit (the primary surface). A marketing-web kit is not yet built — **flagged as a next step**; please confirm priority.

---

## Caveats / asks for the user

1. **Brandbook PDF not found** — `uploads/Plaud Brandbook & VI Application_2026_V1.pdf` was listed in the brief but not actually uploaded. Please re-upload so the palette, grid, and clearspace rules can be verified against the official guide.
2. **Colors are inferred** — the accent hues (`--plaud-signal`, `--plaud-ember`, `--plaud-ocean`) are educated guesses from product photography. The official brand swatches likely differ; the brandbook will correct this.
3. **Icon library** — substituted with Lucide. Swap for the official Plaud icon set when available.
4. **No product screenshots or codebase** were provided — the app UI kit is a plausible reconstruction based on Plaud's public product (Plaud Note app: recording → transcript → summary → chat). Please share a Figma link, codebase, or screenshots for pixel-accurate UI.

# Plaud Design System — `dev` language

The **developer-platform** design language: the dark, technical surface Plaud uses for its
developer portal, API documentation, and the developer marketing site. It is **the same Plaud
brand as `core`, recompiled for a dark product surface** — same Jokker typeface, same tight 5px
radii, same Clarity-Blue accent. What changes is the canvas (near-black instead of ivory), the
addition of a monospace face for code, and a quieter, opacity-driven interaction style.

> **Source of truth:** `Plaud-AI/dev-platform-frontend` → `apps/landing-page`. The tokens in
> `colors_and_type.css` here are lifted from that app's stylesheet and component conventions.

Use this language when the work is **developer-facing or technical**: API docs, SDK landing
pages, developer dashboards, dark hero sections, code-forward marketing. For consumer marketing,
decks, and the Plaud Note app brand, use **`core`** (the root files) instead.

---

## Relation to `core`

| | `core` (marketing brand) | `dev` (developer platform) |
|---|---|---|
| Canvas | White / warm ivory (`#F5F2EC`) | Near-black (`#0F0F0F`) |
| Typeface | Jokker | Jokker **+ Roboto Mono** (code/technical) |
| Accent | Signal orange `#FF4A1C` (REC/live only) | Cyan `#00D0FF` (= core Clarity Blue) |
| Hover | Subtle lift + shadow | **Opacity only**, no lift |
| Cards | White, hairline border, ambient shadow | **Frosted** — translucent dark + blur |
| Radius | 5px | 5px (unchanged) |
| Signal orange | Yes | **No** — not part of this language |

If you authored markup with the shared semantic classes (`--fg-1`, `--bg-1`, `.btn-primary`,
`.dev-card`, `h1`–`h4`, `.body`, `.overline`), switching the linked stylesheet between
`../colors_and_type.css` and `dev/colors_and_type.css` re-skins it between languages.

---

## Visual foundations

### Color
- **Dark, layered surfaces.** `--dev-surface` `#0F0F0F` is the page. Go darker for the footer
  band (`--dev-surface-footer` `#090909`); raise chrome and inputs with `--dev-surface-input`
  `#1D1D1D`. Cards float on a **frosted** layer `--dev-surface-card` `rgba(29,29,29,0.7)`.
- **A five-step text ramp**, lightest to faintest: `--dev-text-white` → `-light` `#EBEBEB` →
  `-muted` `#ADADAD` → `-dim` `#858585` → `-faint`/`-placeholder` `#5C5C5C`. **Body copy defaults
  to `--dev-text-dim`**; reserve pure white for headings and emphasis.
- **One accent:** `--dev-accent-blue` `#00D0FF` (Clarity Blue) — links, required-field markers,
  inline hints, focus glints. Used sparingly, like core's signal orange but in cyan.
- **Error/destructive:** `--dev-status-error` `#F15042`.
- Borders are hairline `#333` (`--dev-border-subtle`); focus brightens to `#5C5C5C`
  (`--dev-border-focus`).
- **No ivory, no signal orange, no metallic gradients** in this language. The AI feature accents
  (`--plaud-amplify/clarity/victory`, `--grad-ai`) carry over for data-viz/illustration only.

### Typography
- **Jokker** for everything visible — display, headings, body, UI. Weights **400 / 600** only
  (Regular for headlines, Semibold for UI emphasis/buttons/overlines). Headlines use tight
  tracking (`-0.01em`) and balanced wrapping.
- **Roboto Mono** is the second face, reserved for **code, metrics, IDs, endpoints, and technical
  metadata** (`code`, `pre`, `.mono`). This is the one thing `dev` adds that `core` doesn't have.
- Body runs tight: 16px at `line-height: 1.3` (the landing page's rhythm), not the airier 1.5–1.6
  of core marketing copy.

### Surfaces & cards
- The **frosted card** (`.dev-card`) is the signature surface: translucent dark fill +
  `backdrop-filter: blur(10px)` + hairline `#333` border + soft `0 4px 20px rgba(0,0,0,0.05)`
  shadow + 5px radius. Use for content panels, form containers, feature tiles.
- Fixed nav/chrome uses a stronger blur (`--dev-blur-chrome`, ~26px).

### Buttons
- **Primary:** white fill, black text, 5px radius, Semibold. Hover = **opacity 0.8** (no lift, no
  scale).
- **Secondary:** transparent "text" button, white label, hover = opacity 0.7.
- **Destructive:** `--dev-status-error` fill, white text. Rare.
- Disabled: 40% opacity, no pointer.

### Inputs
- Solid `#1D1D1D` field, hairline `#333` border, 5px radius; placeholder at `#5C5C5C`; focus
  brightens the border to `#5C5C5C` (no glow). Error state borders in `#F15042`. Autofilled inputs
  are forced back to the dark field color.

### Radius, spacing, shadows
- **5px everywhere** (`--radius-sm` through `--radius-2xl`), pills only for chips/toggles.
- 4px spacing base (shared with core).
- Shadows are soft and ambient on the dark canvas; the frosted-card shadow is the common one.

### Motion
- **Quiet entrances, opacity hovers.** The signature is **`reveal-up`**: fade in + 24px upward
  translate, `800ms cubic-bezier(0.22, 1, 0.36, 1)`, applied with staggered `.delay-100…500`
  classes so a hero reveals background → heading → subtitle → buttons → visual in sequence.
- All hovers are opacity shifts (primary 0.8 / secondary 0.7 / links 0.6). No bounce, no scale-up.
- Always honor `prefers-reduced-motion` (the stylesheet disables `reveal` under it).

### Iconography
- Same as `core`: thin-stroke (1.5–1.75px), rounded-cap line icons (Lucide as the stand-in),
  monochrome `currentColor`, sized in multiples of 4. Never emoji.

---

## Using this language

Link the stylesheet and write with the shared classes:

```html
<link rel="stylesheet" href="dev/colors_and_type.css" />

<section class="reveal delay-100">
  <h1>Build with the Plaud API.</h1>
  <p>Transcripts, summaries, and speaker labels — straight from your code.</p>
  <button class="btn btn-primary">Get started</button>
  <code>curl https://platform.plaud.ai/developer/api/...</code>
</section>
```

Fonts resolve from the skill's shared `../fonts/` (Jokker woff + vendored `RobotoMono-Regular.ttf`);
Roboto Mono also has a Google Fonts fallback so standalone previews render without the local file.

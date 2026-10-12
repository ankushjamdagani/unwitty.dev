# Studio background — design

Status: approved in brainstorming, 2026-10-12. Scope: `apps/studio` home page background only.
Mockups: `.superpowers/brainstorm/90056-1791795619/content/` (`background-texture`, `background-combined`, `dot-scope`).

## Goal

Lift the flat `#FAFAFA` canvas to a premium, tactile surface without competing with the products. Two ideas combined:

1. **Quiet texture** for the studio itself (grain, vignette, dot field).
2. **Product-led ambience**: the only colour in the background comes from the active product, as a glow behind the reel stage.

Strength is "Whisper": you can barely see it, but the page no longer feels flat. Light theme only. Nothing reacts to the cursor or to scrolling.

## Layers

Every layer is `aria-hidden`, `pointer-events: none`, and painted behind content. Text always sits on the solid canvas, stage or surface colours, so contrast is unchanged.

| # | Layer | Extent | Implementation | Strength |
|---|---|---|---|---|
| 1 | Grain | Whole viewport, fixed (does not scroll) | `body::before`, `position: fixed; inset: 0; z-index: -1`, inline SVG `feTurbulence` noise as a data URI, 160px tile | opacity `0.3` |
| 2 | Vignette | Top of page, about one viewport tall, scrolls with the page | `body::after`, `position: absolute`, top-anchored radial gradient darkening the edges | `rgb(0 0 0 / 0.03)` |
| 3 | Dot field | Behind Hero and behind About only | `DotField` component, full-bleed, radial mask fade | 1px dots, 16px pitch, `rgb(0 0 0 / 0.10)` |
| 4 | Product glow | Behind the reel stage | One radial gradient per product, `color-mix(in srgb, <brand.accent> 8%, transparent)` | 8% |

The dot field is deliberately kept off Activity, because the heatmap is itself a grid of cells and dots behind it would clash. It is also kept off the reel, where the glow carries the mood.

## Tokens (`src/app/_styles/theme.css`)

```css
--bg-grain-opacity: 0.3;
--bg-vignette: 0.03;
--bg-dot-alpha: 0.1;
--bg-dot-size: 16px;
--bg-glow: 8%;
```

Every strength comes from these tokens, and no component hardcodes them. To tune the background later, change a token.

## Components

### `DotField` (`src/app/_components/DotField.tsx`, new, server component)

- Props: `fade: "top" | "center"`. Hero uses `top` (the ellipse is anchored near the top and fades out before the reel). About uses `center`.
- It renders a single `div` with `aria-hidden`. That div is absolutely positioned and full-bleed: `left-1/2 w-screen -translate-x-1/2`, so it escapes `.container-content`, with `inset-y-0` and `-z-10`.
- `background-image: radial-gradient(rgb(0 0 0 / var(--bg-dot-alpha)) 1px, transparent 1.2px)` and `background-size: var(--bg-dot-size)`.
- Fade uses `mask-image` (with the `-webkit-` prefix) set to a radial gradient. On screens of 640px or less, the ellipse is tighter so dots don't crowd the text.
- `Hero` and `About` each get a `relative isolate` wrapper so the field stacks behind their content.

### Product glow (`ProjectsReel.tsx`)

- Behind the stage, render one glow `div` per product, absolutely positioned and bleeding about 40px past the stage on every side. All of them get `aria-hidden`.
- Each glow uses `radial-gradient(60% 70% at 50% 55%, color-mix(in srgb, <accent> var(--bg-glow), transparent), transparent 70%)`.
- The active product's glow has `opacity: 1`; the others have `0`. Switching uses `transition: opacity 800ms ease`. This works as a crossfade because gradients themselves cannot be transitioned.
- Under `prefers-reduced-motion: reduce`, there is no transition.
- With a single product, only one glow renders and nothing changes.

### Global (`globals.css`)

- Add `body::before` (grain) and `body::after` (vignette) in `@layer base`.
- Add `position: relative` (anchors the vignette) and `overflow-x: clip` on `body` so the full-bleed dot field never causes horizontal scroll.
- Add `@media print` rules that hide the grain, vignette, dot fields and glows.

## Non-goals

- No dark theme.
- No cursor- or scroll-reactive effects.
- No animated grain.
- No background on product zones (`/<slug>`). Those keep their own brand.
- No changes to `apps/web`.

## Risks

- **Fixed pseudo-element over a long page.** This is cheap because there is a single compositing layer. If scrolling janks on low-end mobile, switch the grain to `position: absolute` on `html`.
- **`color-mix` support.** All browsers in the current Next/browserslist targets support it. Where it is missing, the declaration is simply invalid and no glow renders, which is acceptable.
- **Banding in the glow at 8%.** The grain sits on top and dithers it, so no extra fix is needed.

## Verification

- `pnpm --filter @app/studio typecheck lint test build` must pass, with zero lint warnings.
- Screenshots at 1440 and 375 wide: the dots are visible behind the Hero and About and absent behind the Activity section, and there is no horizontal scroll.
- Reel advance (with two products from a temporary config): the glow crossfades. With reduced motion emulated, it switches instantly.
- Print preview shows no background layers.

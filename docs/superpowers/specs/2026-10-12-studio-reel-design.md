# Studio projects reel — design

Status: approved in brainstorming, 2026-10-12. Scope: `apps/studio` projects reel (`src/app/_components/ProjectsReel/`).
Related specs: `2026-10-12-studio-background-design.md` (product glow behind the stage), `2026-10-12-studio-hero-design.md` (`#projects/<slug>` deep links).
Mockup: `.superpowers/brainstorm/90056-1791795619/content/reel-cinematic.html`, option B.

## Goal

Make the demo the star of the stage, and make advancing between products feel crafted. Two changes:
1. A **cinematic demo frame**: larger, bleeding off the stage edge, and settling from a tilt as it scrolls in.
2. **Product transitions**: brand colours morph, the tagline swaps, and the demo slides.

Out of scope: build log redesign, product facts row, and new reel navigation. Tabs and progress stay as they are.

## Stage layout (B: demo bleeds right)

**Desktop (> 640px):**
- Stage grid `grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.4fr)`, with columns vertically centred.
- The stage has no right padding and `overflow: hidden`, so the demo is clipped by the stage's right edge.
- Left column: the existing content (icon, name, status·version pill, tagline, description, Open and Full build log buttons), unchanged.
- Right column: `DemoFrame` with `margin-right: -60px`, and its right corners square (`rounded-r-none`).
- The build log spans both columns as a full-width row below them, with the stage's normal right padding restored on that row.

**Phone (≤ 640px):**
- Single column: text, then demo, then log.
- The demo is `width: calc(100% + var(--stage-pad))` and bleeds off the right edge the same way.
- The stage's `overflow: hidden` prevents horizontal page scroll.

## Demo frame

**Frame:**
- `rounded-xl`, white, hairline ring.
- Deeper shadow: `0 30px 60px -30px rgb(0 0 0 / .35)` plus `0 12px 24px -12px color-mix(in srgb, var(--product-accent) 40%, transparent)`.

**Chrome bar (30px):** traffic dots, centred `unwitty.dev/<slug>`, timestamp, and a play/pause button.
- Timestamp:
  - With a video: `m:ss / m:ss`, current over total, updated from `timeupdate`.
  - Without a video: `demo.duration` as today, or nothing.
- Play/pause button:
  - Only rendered when `demo.video` exists.
  - `aria-label="Pause demo"` / `"Play demo"` with `aria-pressed`.
  - Pausing also holds the reel's auto-advance. Playing releases the hold, unless hover or focus is still holding it.
  - Hit target at least 24px, using the existing focus-visible ring.

**Screen:** the existing `aspect-[16/10]`, with the 2px progress bar at the bottom in `--product-accent`.

## Scroll tilt (`useScrollTilt.ts`, new)

- Hook: `useScrollTilt(ref, { maxDeg = 14, minScale = 0.94 })`.
- `t = clamp((innerHeight - rect.top) / (innerHeight * 0.6), 0, 1)`.
- Applies `transform: rotateX(${maxDeg * (1 - t)}deg) scale(${minScale + (1 - minScale) * t})` straight to the element, with no React state per frame.
- The parent gets `perspective: 1400px`, and the element `transform-origin: 50% 100%`.
- It only runs while the frame is near the viewport: an `IntersectionObserver` with a `rootMargin` of 20% starts and stops a scroll listener throttled with rAF.
- Under `prefers-reduced-motion: reduce` it applies nothing, so the frame is flat.
- `will-change: transform` is set only while the frame is moving.

## Product transition

This only happens when there are two or more products. With one product, nothing animates. When the index changes:

| Element | Animation | Duration / easing |
|---|---|---|
| Stage `--product-bg/fg/accent/ink` | Existing CSS transition on `background-color` and `color`, extended to the accent-coloured elements | 700ms `cubic-bezier(.4,0,.2,1)` |
| Product glow (background spec) | Opacity crossfade between the per-product layers | 800ms ease |
| Tagline | `TaglineSwap`: the old tagline clips up (`translateY(-105%)`, opacity 0); the new one clips up from below (`translateY(105%)` to 0). Each keeps its own `taglineFont` and `taglineWeight`. The wrapper has `overflow: hidden` and reserves the larger of the two heights during the swap | 350ms out (`cubic-bezier(.4,0,1,1)`), then 550ms in (`cubic-bezier(.2,.7,.2,1)`) |
| Name, status pill, description | Fade out, swap, fade in | 200ms |
| Demo screen | A track of every product's screen; `translateX(-index × 100%)` | 700ms `cubic-bezier(.65,0,.35,1)` |
| Video | Only the active slide holds a `<video>`, mounted when its slide becomes active. `play()` runs on `transitionend`; the previous video is paused and unmounted | — |

Under `prefers-reduced-motion: reduce`, every transition above has a duration of 0, so swaps are instant.

**Accessibility:**
- Off-screen slides are `aria-hidden` and `inert`.
- The tagline keeps a single accessible `h3`: the outgoing copy is `aria-hidden` during the swap.
- The existing tablist and tabpanel semantics stay unchanged.

## Components

| File | Change |
|---|---|
| `ProjectsReel/ProjectsReel.tsx` | Grid layout B, previous-index tracking, holding auto-advance while paused, `#projects/<slug>` hash handling (hero spec), the glow layers (background spec) |
| `ProjectsReel/DemoFrame.tsx` | Receives all `products` and `index`; slide track; new chrome bar with timestamp and play/pause; uses `useScrollTilt` |
| `ProjectsReel/useScrollTilt.ts` | New hook (above) |
| `ProjectsReel/TaglineSwap.tsx` | New, client; renders the tagline and animates changes |
| `ProjectsReel/BuildLog.tsx` | Unchanged; placed in the full-width row |
| `src/lib/format.ts` | `formatClock(seconds)` gives `m:ss` |

## Risks

- **Several posters in the slide track:** load only the active poster with `priority`; the rest use `loading="lazy"`.
- **Tilt and sticky or overflow ancestors:** the stage has `overflow: hidden`, so the tilted frame is clipped at the edges. This is intended, because the top edge is never clipped at a tilt of 14° or less with the bottom origin. Verify with screenshots.
- **Layout shift during the tagline swap** is avoided by reserving the larger height for the duration of the swap.

## Verification

- Unit tests: `formatClock` (0, 59, 60, 3599).
- `pnpm --filter @app/studio typecheck lint test build`, with zero warnings.
- Screenshots at 1440 and 375: the demo is clipped at the right edge of the stage, and the page never scrolls horizontally.
- Scroll the reel into view: the frame settles flat before it is centred.
- Temporarily add a second product to config and check:
  - colours morph
  - the tagline swaps with no layout jump
  - the screen slides
  - progress, auto-advance and hover-hold still work
  - tabs still work with arrow keys
  - (revert the extra product afterwards)
- With reduced motion emulated: no tilt and instant swaps.
- Play/pause: the reel stays paused while the demo is paused, and the button is reachable by keyboard and labelled correctly.

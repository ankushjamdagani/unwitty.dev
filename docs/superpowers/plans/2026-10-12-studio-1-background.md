# Studio background Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the studio home page a whisper-strength textured background: grain, a top vignette, dot fields behind the Hero and About, and a product-coloured glow behind the reel stage.

**Architecture:** The background is mostly CSS. Grain and vignette are `body::before`/`::after`. Dot fields come from one `DotField` component that renders a masked, full-bleed `div`. The product glow is one absolutely positioned layer per product inside `ProjectsReel`, with only the active layer visible. Every strength is a CSS variable in `theme.css`.

**Tech Stack:** Next.js 15 App Router, React 19, Tailwind CSS 3, TypeScript.

**Spec:** `docs/superpowers/specs/2026-10-12-studio-background-design.md`

**Order:** This is plan 1 of 5 (background → about → hero → activity → reel). Work on a branch `studio/next-level` created from `studio/background-spec`.

## Global Constraints

- App: `apps/studio` only. Do not touch `apps/web`.
- Light theme only. Colours come from CSS variables in `src/app/_styles/theme.css`. Product colours come only from `src/config/products.ts`.
- Named exports only, no default exports on components (Next `page`/`layout` excepted). `@/` maps to `apps/studio/src/`.
- ESLint runs with `--max-warnings 0`. Fix every warning.
- `pnpm` only.
- Respect `prefers-reduced-motion`. `globals.css` already forces transition and animation durations to 0.01ms under reduced motion.
- Every commit message ends with the line `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Strength tokens, exact values: `--bg-grain-opacity: 0.3`, `--bg-vignette: 0.03`, `--bg-dot-alpha: 0.1`, `--bg-dot-size: 16px`, `--bg-glow: 8%`.

## File Structure

| File | Responsibility |
|---|---|
| `apps/studio/src/app/_styles/theme.css` | Background strength tokens |
| `apps/studio/src/app/_styles/globals.css` | Grain, vignette, `.dot-field*` classes, `body` overflow clip, print rules |
| `apps/studio/src/app/_components/DotField.tsx` (new) | Decorative dot field, `fade: "top" \| "center"` |
| `apps/studio/src/app/_components/Hero.tsx` | Hosts `<DotField fade="top" />` |
| `apps/studio/src/app/_components/About.tsx` | Hosts `<DotField fade="center" />` |
| `apps/studio/src/app/_components/ProjectsReel/ProjectsReel.tsx` | Per-product glow layers behind the stage |

---

### Task 1: Tokens, grain, vignette and print rules

**Files:**
- Modify: `apps/studio/src/app/_styles/theme.css`
- Modify: `apps/studio/src/app/_styles/globals.css`

**Interfaces:**
- Produces: the CSS variables `--bg-grain-opacity`, `--bg-vignette`, `--bg-dot-alpha`, `--bg-dot-size` and `--bg-glow`, and the global classes `.dot-field`, `.dot-field-top`, `.dot-field-center` and `.product-glow`, which later tasks rely on.

- [ ] **Step 1: Add the tokens.** In `theme.css`, inside the first `:root` block, add these lines after `--product-ink: #ffffff;`:

```css

  /* Background, "whisper" strength. See docs/superpowers/specs/2026-10-12-studio-background-design.md */
  --bg-grain-opacity: 0.3;
  --bg-vignette: 0.03;
  --bg-dot-alpha: 0.1;
  --bg-dot-size: 16px;
  --bg-glow: 8%;
```

- [ ] **Step 2: Replace the `body` rule and add the grain and vignette.** In `globals.css`, replace:

```css
  body {
    @apply bg-canvas font-sans text-[14px] leading-[1.55] text-fg antialiased;
  }
```

with:

```css
  body {
    @apply relative bg-canvas font-sans text-[14px] leading-[1.55] text-fg antialiased;
    /* Full-bleed decorations (dot fields, glows) must never cause horizontal scroll. */
    overflow-x: clip;
  }
  /* Paper grain over the whole viewport. */
  body::before {
    content: "";
    position: fixed;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    opacity: var(--bg-grain-opacity);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .09 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 160px 160px;
  }
  /* Soft darkening at the top edge, about one viewport tall. */
  body::after {
    content: "";
    position: absolute;
    inset: 0 0 auto;
    height: 100vh;
    z-index: -1;
    pointer-events: none;
    background: radial-gradient(120% 80% at 50% 0%, transparent 55%, rgb(0 0 0 / var(--bg-vignette)));
  }
```

- [ ] **Step 3: Add the dot-field classes.** In `globals.css`, inside `@layer components { ... }`, after the `.section-title` rule, add:

```css
  /* Decorative dot grid, full-bleed behind a section. Use via <DotField />. */
  .dot-field {
    @apply pointer-events-none absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2;
    background-image: radial-gradient(rgb(0 0 0 / var(--bg-dot-alpha)) 1px, transparent 1.2px);
    background-size: var(--bg-dot-size) var(--bg-dot-size);
    -webkit-mask-image: var(--dot-mask);
    mask-image: var(--dot-mask);
  }
  .dot-field-top {
    --dot-mask: radial-gradient(60% 75% at 50% 30%, #000 30%, transparent 80%);
  }
  .dot-field-center {
    --dot-mask: radial-gradient(55% 60% at 50% 50%, #000 25%, transparent 80%);
  }
  @media (max-width: 640px) {
    .dot-field-top {
      --dot-mask: radial-gradient(90% 55% at 50% 30%, #000 15%, transparent 70%);
    }
    .dot-field-center {
      --dot-mask: radial-gradient(90% 50% at 50% 50%, #000 15%, transparent 70%);
    }
  }
```

- [ ] **Step 4: Add the print rule.** At the end of `globals.css`, after the reduced-motion block, add:

```css
@media print {
  body::before,
  body::after,
  .dot-field,
  .product-glow {
    display: none;
  }
}
```

- [ ] **Step 5: Build-check.** Run from the repo root:

```bash
pnpm --filter @app/studio lint && pnpm --filter @app/studio build
```

Expected: lint passes with 0 warnings, and the build ends with `✓ Generating static pages`.

- [ ] **Step 6: Commit**

```bash
git add apps/studio/src/app/_styles/theme.css apps/studio/src/app/_styles/globals.css
git commit -m "feat(studio): background tokens, grain and vignette

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: DotField behind Hero and About

**Files:**
- Create: `apps/studio/src/app/_components/DotField.tsx`
- Modify: `apps/studio/src/app/_components/Hero.tsx`
- Modify: `apps/studio/src/app/_components/About.tsx:15`

**Interfaces:**
- Consumes: `.dot-field`, `.dot-field-top` and `.dot-field-center` (Task 1).
- Produces: `export function DotField({ fade }: { fade: "top" | "center" })`. The hero plan and the about plan both keep using it.

- [ ] **Step 1: Create `DotField.tsx`.**

```tsx
type Props = {
  /** "top": fades out below the hero. "center": a soft field around the middle of the section. */
  fade: "top" | "center";
};

// Literal class names so Tailwind keeps them (dynamic names would be purged).
const FADE: Record<Props["fade"], string> = {
  top: "dot-field-top",
  center: "dot-field-center",
};

/** Decorative dot grid. The parent must be `relative isolate`. */
export function DotField({ fade }: Props) {
  return <div aria-hidden className={`dot-field ${FADE[fade]}`} />;
}
```

- [ ] **Step 2: Add the field to the Hero.** Replace the entire contents of `Hero.tsx` with:

```tsx
import { profile } from "@/config/profile";

import { DotField } from "./DotField";

export function Hero() {
  return (
    <section
      aria-labelledby="intro"
      className="relative isolate flex flex-wrap items-end justify-between gap-x-12 gap-y-4 pb-14 pt-16 sm:pt-24"
    >
      <DotField fade="top" />
      <h1
        id="intro"
        className="m-0 flex-[1_1_600px] text-[clamp(44px,5.6vw,76px)] font-medium leading-none tracking-[-0.045em]"
      >
        {profile.headline}
      </h1>
      <p className="m-0 font-mono text-[13px] text-fg-subtle">by {profile.name}</p>
    </section>
  );
}
```

- [ ] **Step 3: Add the field to About.** In `About.tsx`, add the import after the existing `@/` imports:

```tsx
import { DotField } from "./DotField";
```

Then change the opening `<section ...>` (line 15) to the following, and make `<DotField fade="center" />` its first child:

```tsx
    <section
      id="about"
      aria-labelledby="about-title"
      className="relative isolate flex flex-wrap gap-x-16 gap-y-6 pt-section"
    >
      <DotField fade="center" />
```

- [ ] **Step 4: Check.**

```bash
pnpm --filter @app/studio typecheck && pnpm --filter @app/studio lint
```

Expected: both pass, with 0 warnings.

- [ ] **Step 5: Commit**

```bash
git add apps/studio/src/app/_components/DotField.tsx apps/studio/src/app/_components/Hero.tsx apps/studio/src/app/_components/About.tsx
git commit -m "feat(studio): dot field behind hero and about

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Product glow behind the reel stage

**Files:**
- Modify: `apps/studio/src/app/_components/ProjectsReel/ProjectsReel.tsx:111-168`

**Interfaces:**
- Consumes: `--bg-glow` and `.product-glow` for print (Task 1).
- Produces: a `relative isolate` wrapper `div` around `<article id="project-stage">` that contains the glow layers. The reel plan keeps this wrapper.

- [ ] **Step 1: Wrap the stage.** In `ProjectsReel.tsx`, directly before `<article` (line 111), insert:

```tsx
      <div className="relative isolate">
        {products.map((product) => (
          <div
            key={product.slug}
            aria-hidden
            className="product-glow pointer-events-none absolute -inset-10 -z-10 transition-opacity duration-[800ms] ease-out"
            style={{
              opacity: product.slug === current.slug ? 1 : 0,
              background: `radial-gradient(60% 70% at 50% 55%, color-mix(in srgb, ${product.brand.accent} var(--bg-glow), transparent), transparent 70%)`,
            }}
          />
        ))}
```

Then, directly after the closing `</article>` (line 168), insert:

```tsx
      </div>
```

Re-indent the `article` block by two spaces, or run `pnpm format` from the repo root.

- [ ] **Step 2: Check.**

```bash
pnpm --filter @app/studio typecheck && pnpm --filter @app/studio lint && pnpm --filter @app/studio test
```

Expected: all pass, and the existing 10 vitest tests pass.

- [ ] **Step 3: Commit**

```bash
git add apps/studio/src/app/_components/ProjectsReel/ProjectsReel.tsx
git commit -m "feat(studio): product glow behind the reel stage

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Verify in the browser

**Files:** none.

- [ ] **Step 1: Build and start.**

```bash
pnpm --filter @app/studio build
```

Then start the `studio` configuration from `.claude/launch.json` (`pnpm --filter @app/studio start`, port 3100). If a stale server is already on 3100, stop it first: `lsof -ti tcp:3100 | xargs kill`.

- [ ] **Step 2: Check at desktop width (1440).** Open `http://localhost:3100/` and take a screenshot. Expected:
  - faint grain everywhere
  - dots behind the headline, fading out before the reel
  - a soft teal glow around the Canvas One stage
  - dots behind About
  - no dots behind Activity

- [ ] **Step 3: Check at phone width (375).** Expected: no horizontal scroll. Run `document.documentElement.scrollWidth === innerWidth` in the console; it should return `true`.

- [ ] **Step 4: Check print.** Emulate print media in devtools (Rendering → Emulate CSS media type → print). Expected: no grain, dots or glow.

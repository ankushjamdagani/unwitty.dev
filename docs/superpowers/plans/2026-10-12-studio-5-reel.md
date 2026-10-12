# Studio projects reel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the demo the star of the stage and make moving between products feel crafted:
- The demo bleeds off the stage's right edge.
- It settles from a scroll tilt.
- Its chrome gains a timestamp and play/pause.
- When the reel advances, the brand colours morph, the tagline swaps, and the demo slides.

**Architecture:** `ProjectsReel` keeps the reel state: index, progress, held, paused, slide-done and clock. It lays out stage B as a CSS grid with `overflow: hidden`. Three new pieces:
- `DemoFrame` renders every product's screen in one sliding track; only the active slide holds a `<video>`.
- `useScrollTilt` writes the transform directly to the DOM.
- `TaglineSwap` keeps the outgoing tagline long enough to animate it out.

**Tech Stack:** Next.js 15, React 19, Tailwind CSS 3, TypeScript, Vitest.

**Spec:** `docs/superpowers/specs/2026-10-12-studio-reel-design.md`

**Order:** This is plan 5 of 5 and the last one. It needs:
- plan 1: the glow wrapper
- plan 3: `usePrefersReducedMotion` in `src/lib/` and the `#projects/<slug>` deep links

The `ProjectsReel.tsx` replacement below already includes both. Keep them.

## Global Constraints

- Only touch `apps/studio`. Leave `apps/web` alone.
- Light theme only. Use named exports. `@/` resolves to `apps/studio/src/`.
- ESLint runs with `--max-warnings 0`. Use `pnpm` only.
- Layout B: the stage grid is `minmax(0,0.8fr) minmax(0,1.4fr)` from `sm` up. The demo has `margin-right: -60px` (`-24px` on phones) and its right corners are square. The build log spans the full width below.
- Tilt: `rotateX(14deg) scale(.94)` easing to flat over 60% of the viewport height, with `perspective: 1400px` and `transform-origin: 50% 100%`.
- Transitions:
  - stage colours: 700ms `cubic-bezier(.4,0,.2,1)`
  - tagline: out 350ms `cubic-bezier(.4,0,1,1)`, then in 550ms `cubic-bezier(.2,.7,.2,1)`
  - name, status and description: fade 200ms
  - demo track: 700ms `cubic-bezier(.65,0,.35,1)`
- Reduced motion: no tilt, and every swap is instant.
- With a single product, nothing animates between products.
- Every commit message ends with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## File Structure

| File | Responsibility |
|---|---|
| `src/lib/format.ts` | `formatClock(seconds)` |
| `src/lib/format.test.ts` | Tests for `formatClock` |
| `src/app/_styles/globals.css` | `.tagline-in` / `.tagline-out` and the `fade-in` keyframes |
| `src/app/_components/ProjectsReel/useScrollTilt.ts` (new) | Scroll-driven tilt |
| `src/app/_components/ProjectsReel/TaglineSwap.tsx` (new) | Animated tagline swap |
| `src/app/_components/ProjectsReel/DemoFrame.tsx` | Rewritten: slide track, chrome bar with clock and play/pause, tilt |
| `src/app/_components/ProjectsReel/ProjectsReel.tsx` | Rewritten: layout B, pause and slide state, wiring |

All paths below are relative to `apps/studio/`.

---

### Task 1: `formatClock` (TDD)

**Files:**
- Modify: `src/lib/format.test.ts`
- Modify: `src/lib/format.ts`

**Interfaces:**
- Produces: `export function formatClock(seconds: number): string`, which returns `m:ss`.

- [ ] **Step 1: Write the failing test.** In `src/lib/format.test.ts`, add `formatClock` to the import from `./format` and append:

```ts

describe("formatClock", () => {
  it.each([
    [0, "0:00"],
    [59.9, "0:59"],
    [60, "1:00"],
    [3599, "59:59"],
    [Number.NaN, "0:00"],
  ])("%s → %s", (seconds, expected) => {
    expect(formatClock(seconds)).toBe(expected);
  });
});
```

- [ ] **Step 2: Run it and confirm it fails.** Run `pnpm --filter @app/studio test -- format`. Expected: FAIL, because `formatClock` is not exported.

- [ ] **Step 3: Implement.** Append to `src/lib/format.ts`:

```ts

/** Video time: 75 → "1:15". Invalid or negative input → "0:00". */
export function formatClock(seconds: number): string {
  const s = Number.isFinite(seconds) && seconds > 0 ? Math.floor(seconds) : 0;
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
```

- [ ] **Step 4: Run the tests and confirm they pass.** Run `pnpm --filter @app/studio test`. Expected: every test passes.

- [ ] **Step 5: Commit**

```bash
git add apps/studio/src/lib/format.ts apps/studio/src/lib/format.test.ts
git commit -m "feat(studio): formatClock helper

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: `useScrollTilt`, `TaglineSwap` and their CSS

**Files:**
- Create: `src/app/_components/ProjectsReel/useScrollTilt.ts`
- Create: `src/app/_components/ProjectsReel/TaglineSwap.tsx`
- Modify: `src/app/_styles/globals.css`

**Interfaces:**
- Produces:
  - `useScrollTilt(ref: RefObject<HTMLElement | null>, options?: { maxDeg?: number; minScale?: number }): void`
  - `export type Tagline = { key: string; text: string; font: string; weight: number }`
  - `TaglineSwap({ tagline }: { tagline: Tagline })`

- [ ] **Step 1: Add the CSS.**
  - Inside `@layer components` in `globals.css`, add:

```css
  /* Reel tagline swap: the old line clips up, then the new one rises in. */
  .tagline-out {
    animation: tagline-out 350ms cubic-bezier(0.4, 0, 1, 1) both;
  }
  .tagline-in {
    animation: tagline-in 550ms cubic-bezier(0.2, 0.7, 0.2, 1) 350ms both;
  }
```

  - Outside the layer, next to `@keyframes hero-rise`, add:

```css
@keyframes tagline-out {
  to {
    transform: translateY(-105%);
    opacity: 0;
  }
}

@keyframes tagline-in {
  from {
    transform: translateY(105%);
    opacity: 0;
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
}
```

  - In the existing `@media (prefers-reduced-motion: reduce)` block that contains `.hero-word`, add:

```css
  .tagline-in {
    animation: none;
  }
  .tagline-out {
    display: none;
  }
```

- [ ] **Step 2: Create `useScrollTilt.ts`.**

```ts
import { useEffect, type RefObject } from "react";

type Options = { maxDeg?: number; minScale?: number };

/**
 * Tilts the element back as it enters the viewport and settles it flat once it
 * has travelled 60% of the viewport height. Writes the transform directly to the
 * DOM, only while the element is near the viewport. Does nothing under reduced motion.
 */
export function useScrollTilt(ref: RefObject<HTMLElement | null>, { maxDeg = 14, minScale = 0.94 }: Options = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const apply = () => {
      frame = 0;
      const top = el.getBoundingClientRect().top;
      const t = Math.min(1, Math.max(0, (window.innerHeight - top) / (window.innerHeight * 0.6)));
      el.style.transform = t >= 1 ? "" : `rotateX(${maxDeg * (1 - t)}deg) scale(${minScale + (1 - minScale) * t})`;
      el.style.willChange = t >= 1 ? "" : "transform";
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const listen = (on: boolean) => {
      if (on) {
        window.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", schedule);
      } else {
        window.removeEventListener("scroll", schedule);
        window.removeEventListener("resize", schedule);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        listen(Boolean(entry?.isIntersecting));
        if (entry?.isIntersecting) schedule();
      },
      { rootMargin: "20% 0px" },
    );
    observer.observe(el);
    apply();

    return () => {
      observer.disconnect();
      listen(false);
      cancelAnimationFrame(frame);
      el.style.transform = "";
      el.style.willChange = "";
    };
  }, [ref, maxDeg, minScale]);
}
```

- [ ] **Step 3: Create `TaglineSwap.tsx`.**

```tsx
"use client";

import { useEffect, useState } from "react";

export type Tagline = { key: string; text: string; font: string; weight: number };

const TEXT = "m-0 pb-[0.08em] text-[clamp(32px,3.4vw,46px)] leading-[1.04] tracking-[-0.02em] [grid-area:1/1]";
const OUT_MS = 350;

/**
 * The product tagline. When `tagline.key` changes, the old line animates out
 * while the new one animates in; both share one grid cell, so the height of the
 * taller one is reserved and nothing jumps. Only the incoming line is the heading.
 */
export function TaglineSwap({ tagline }: { tagline: Tagline }) {
  const [current, setCurrent] = useState(tagline);
  const [leaving, setLeaving] = useState<Tagline | null>(null);
  const [swapped, setSwapped] = useState(false);

  if (tagline.key !== current.key) {
    setLeaving(current);
    setCurrent(tagline);
    setSwapped(true);
  }

  useEffect(() => {
    if (!leaving) return;
    const id = window.setTimeout(() => setLeaving(null), OUT_MS);
    return () => window.clearTimeout(id);
  }, [leaving]);

  const style = (t: Tagline) => ({ fontFamily: t.font, fontWeight: t.weight });

  return (
    <div className="grid overflow-hidden">
      {leaving && (
        <p key={`out-${leaving.key}`} aria-hidden className={`${TEXT} tagline-out`} style={style(leaving)}>
          {leaving.text}
        </p>
      )}
      <h3 key={current.key} className={swapped ? `${TEXT} tagline-in` : TEXT} style={style(current)}>
        {current.text}
      </h3>
    </div>
  );
}
```

- [ ] **Step 4: Check.** Run `pnpm --filter @app/studio typecheck && pnpm --filter @app/studio lint`. Expected: both pass.

- [ ] **Step 5: Commit**

```bash
git add apps/studio/src/app/_components/ProjectsReel/useScrollTilt.ts apps/studio/src/app/_components/ProjectsReel/TaglineSwap.tsx apps/studio/src/app/_styles/globals.css
git commit -m "feat(studio): scroll tilt and tagline swap for the reel

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Rewrite `DemoFrame` and `ProjectsReel`

**Files:**
- Modify: `src/app/_components/ProjectsReel/DemoFrame.tsx` (full replacement)
- Modify: `src/app/_components/ProjectsReel/ProjectsReel.tsx` (full replacement)

**Interfaces:**
- Consumes:
  - `formatClock` (Task 1)
  - `useScrollTilt` and `TaglineSwap` (Task 2)
  - `usePrefersReducedMotion` (plan 3)
  - `BuildLog` and `ProductIcon` (unchanged)
- Produces:
  - `export type DemoClock = { current: number; total: number }`
  - `DemoFrame(props)`, with the props listed below
  - `ProjectsReel({ products })`, which keeps the same external API

- [ ] **Step 1: Replace `DemoFrame.tsx`.**

```tsx
"use client";

import Image from "next/image";
import { useRef, type RefObject } from "react";

import type { Product } from "@/config/types";
import { formatClock } from "@/lib/format";

import { useScrollTilt } from "./useScrollTilt";

export type DemoClock = { current: number; total: number };

type Props = {
  products: Product[];
  index: number;
  /** 0–1, or null to hide the bar. */
  progress: number | null;
  videoRef: RefObject<HTMLVideoElement | null>;
  loop: boolean;
  clock: DemoClock | null;
  paused: boolean;
  onTogglePause: () => void;
  onTime: () => void;
  onEnded: () => void;
  /** Fires when the slide track finishes moving to `index`. */
  onSlideEnd: () => void;
};

const FRAME_SHADOW =
  "0 0 0 1px rgb(0 0 0 / 0.08), 0 30px 60px -30px rgb(0 0 0 / 0.35), 0 12px 24px -12px color-mix(in srgb, var(--product-accent) 40%, transparent)";

export function DemoFrame({
  products,
  index,
  progress,
  videoRef,
  loop,
  clock,
  paused,
  onTogglePause,
  onTime,
  onEnded,
  onSlideEnd,
}: Props) {
  const frameRef = useRef<HTMLElement>(null);
  useScrollTilt(frameRef);

  const current = products[index] ?? products[0];
  if (!current) return null;

  return (
    <div className="[perspective:1400px]">
      <figure
        ref={frameRef}
        aria-label={`${current.name} demo`}
        className="m-0 origin-bottom overflow-hidden rounded-xl rounded-r-none bg-white"
        style={{ boxShadow: FRAME_SHADOW }}
      >
        <div className="flex h-[30px] items-center gap-3 border-b border-line/[0.06] bg-canvas px-3">
          <span aria-hidden className="inline-flex gap-1.5">
            <span className="size-2 rounded-full bg-well" />
            <span className="size-2 rounded-full bg-well" />
            <span className="size-2 rounded-full bg-well" />
          </span>
          <span className="min-w-0 flex-1 truncate text-center font-mono text-[11px] text-fg-subtle">
            unwitty.dev/{current.slug}
          </span>
          <span className="font-mono text-[11px] tabular-nums text-fg-subtle">
            {clock ? `${formatClock(clock.current)} / ${formatClock(clock.total)}` : (current.demo.duration ?? "")}
          </span>
          {current.demo.video && (
            <button
              type="button"
              aria-label="Pause demo"
              aria-pressed={paused}
              onClick={onTogglePause}
              className="grid size-6 place-items-center rounded-md text-[9px] text-fg-muted shadow-[0_0_0_1px_rgb(0_0_0/0.1)] hover:text-fg"
            >
              <span aria-hidden>{paused ? "▶" : "❚❚"}</span>
            </button>
          )}
        </div>

        <div className="relative aspect-[16/10] overflow-hidden bg-[#F4F4F4]">
          <div
            className="flex h-full transition-transform duration-700 ease-[cubic-bezier(.65,0,.35,1)]"
            style={{ transform: `translateX(-${index * 100}%)` }}
            onTransitionEnd={(e) => {
              if (e.target === e.currentTarget) onSlideEnd();
            }}
          >
            {products.map((product, i) => {
              const active = i === index;
              return (
                <div key={product.slug} aria-hidden={!active} inert={!active} className="relative h-full w-full shrink-0">
                  {active && product.demo.video ? (
                    <video
                      key={product.demo.video}
                      ref={videoRef}
                      src={product.demo.video}
                      poster={product.demo.poster}
                      className="absolute inset-0 size-full object-cover object-left-top"
                      muted
                      playsInline
                      loop={loop}
                      preload="metadata"
                      onTimeUpdate={onTime}
                      onLoadedMetadata={onTime}
                      onEnded={onEnded}
                    />
                  ) : (
                    <Image
                      src={product.demo.poster}
                      alt={active ? `${product.name} screenshot` : ""}
                      fill
                      sizes="(min-width: 1120px) 760px, 100vw"
                      className="object-cover object-left-top"
                      priority={i === 0}
                    />
                  )}
                </div>
              );
            })}
          </div>
          {progress !== null && (
            <span aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 bg-black/[0.06]">
              <span
                className="block h-full transition-colors duration-700"
                style={{ width: `${progress * 100}%`, background: current.brand.accent }}
              />
            </span>
          )}
        </div>
      </figure>
    </div>
  );
}
```

- [ ] **Step 2: Replace `ProjectsReel.tsx`.**

```tsx
"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";

import type { ProductWithLog } from "@/lib/data";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

import { BuildLog } from "./BuildLog";
import { DemoFrame, type DemoClock } from "./DemoFrame";
import { ProductIcon } from "./ProductIcon";
import { TaglineSwap } from "./TaglineSwap";

/** How long a product without a demo video stays on stage. */
const SLIDE_MS = 8000;

export function ProjectsReel({ products }: { products: ProductWithLog[] }) {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [held, setHeld] = useState(false);
  const [paused, setPaused] = useState(false);
  const [slideDone, setSlideDone] = useState(true);
  const [clock, setClock] = useState<DemoClock | null>(null);
  const reduced = usePrefersReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const multi = products.length > 1;
  const current = products[index] ?? products[0];
  const autoAdvance = multi && !reduced;
  const hasVideo = Boolean(current?.demo.video);
  const holding = held || paused;

  const go = useCallback(
    (next: number) => {
      const target = (next + products.length) % products.length;
      if (target === index) return;
      setIndex(target);
      setProgress(0);
      setClock(null);
      // Without motion the track jumps; there is no transitionend to wait for.
      setSlideDone(reduced);
    },
    [products.length, index, reduced],
  );
  const goRef = useRef(go);
  useEffect(() => {
    goRef.current = go;
  });

  // Poster-only products advance on a timer.
  useEffect(() => {
    if (!autoAdvance || hasVideo || holding) return;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const delta = (now - last) / SLIDE_MS;
      last = now;
      setProgress((p) => Math.min(1, p + delta));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [autoAdvance, hasVideo, holding, index]);

  useEffect(() => {
    if (progress >= 1 && autoAdvance && !hasVideo) go(index + 1);
  }, [progress, autoAdvance, hasVideo, go, index]);

  // Videos play once their slide has landed, and pause while held, paused or under reduced motion.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (holding || reduced || !slideDone) video.pause();
    else void video.play().catch(() => undefined);
  }, [holding, reduced, slideDone, index]);

  // Deep links from the hero (#projects/<slug>) select that product and hold the reel.
  // Runs once on mount (plus hashchange), not when `reduced` or `go` change.
  useEffect(() => {
    const select = () => {
      const match = /^#projects\/(.+)$/.exec(window.location.hash);
      if (!match) return;
      let slug: string;
      try {
        slug = decodeURIComponent(match[1] ?? "");
      } catch {
        return;
      }
      const i = products.findIndex((p) => p.slug === slug);
      if (i < 0) return;
      goRef.current(i);
      setHeld(true);
      const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      document.getElementById("projects")?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
    };
    select();
    window.addEventListener("hashchange", select);
    return () => window.removeEventListener("hashchange", select);
  }, [products]);

  if (!current) return null;

  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const delta = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
    if (!delta) return;
    event.preventDefault();
    const next = (i + delta + products.length) % products.length;
    go(next);
    tabRefs.current[next]?.focus();
  };

  const onTime = () => {
    const v = videoRef.current;
    if (!v?.duration) return;
    setProgress(v.currentTime / v.duration);
    setClock({ current: v.currentTime, total: v.duration });
  };

  const stageVars = {
    "--product-bg": current.brand.bg,
    "--product-fg": current.brand.fg,
    "--product-accent": current.brand.accent,
    "--product-ink": current.brand.accentInk,
  } as CSSProperties;

  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      aria-roledescription={multi ? "carousel" : undefined}
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setHeld(false);
      }}
    >
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="projects-title" className="section-title">
          Projects <span className="font-normal text-fg-subtle">{String(products.length).padStart(2, "0")}</span>
        </h2>
        <span className="font-mono text-[12px] text-fg-subtle">newest first</span>
      </div>

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

        <article
          id="project-stage"
          role={multi ? "tabpanel" : undefined}
          aria-labelledby={multi ? `project-tab-${current.slug}` : undefined}
          style={stageVars}
          className="grid grid-cols-1 items-center gap-x-[18px] gap-y-6 overflow-hidden rounded-3xl bg-product-bg py-5 pl-5 text-product-fg shadow-[0_0_0_1px_rgb(0_0_0/0.05),0_1px_2px_rgb(0_0_0/0.04)] transition-[background-color,color] duration-700 ease-[cubic-bezier(.4,0,.2,1)] sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)] sm:py-8 sm:pl-8"
        >
          <div className="flex min-w-0 flex-col gap-[18px] p-2 pr-7 sm:pr-2">
            <div key={`meta-${current.slug}`} className="flex animate-[fade-in_200ms_ease-out] items-center gap-2.5">
              <ProductIcon {...current} />
              <span className="text-[15px] font-semibold">{current.name}</span>
              <span className="rounded-full bg-white/70 px-2 py-0.5 font-mono text-[11px] shadow-[0_0_0_1px_rgb(0_0_0/0.06)]">
                {current.status}
                {current.version ? ` · v${current.version}` : ""}
              </span>
            </div>
            <TaglineSwap
              tagline={{
                key: current.slug,
                text: current.tagline,
                font: current.brand.taglineFont,
                weight: current.brand.taglineWeight ?? 400,
              }}
            />
            <p
              key={`desc-${current.slug}`}
              className="m-0 max-w-[400px] animate-[fade-in_200ms_ease-out] text-[15px] leading-relaxed opacity-80"
            >
              {current.description}
            </p>
            <div className="mt-auto flex flex-wrap gap-2">
              <a
                href={`/${current.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn bg-product-accent text-product-ink shadow-[inset_0_1px_0_rgb(255_255_255/0.2),0_1px_2px_rgb(0_0_0/0.15)] transition-colors duration-700 hover:opacity-90"
              >
                Open {current.name} <span aria-hidden>↗</span>
                <span className="sr-only">(opens in a new tab)</span>
              </a>
              <a
                href={current.changelogUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn bg-white/70 shadow-[0_0_0_1px_rgb(0_0_0/0.08)] hover:bg-white"
              >
                Full build log
              </a>
            </div>
          </div>

          <div className="-mr-6 min-w-0 sm:-mr-[60px]">
            <DemoFrame
              products={products}
              index={index}
              videoRef={videoRef}
              loop={!autoAdvance}
              progress={hasVideo || autoAdvance ? progress : null}
              clock={clock}
              paused={paused}
              onTogglePause={() => setPaused((p) => !p)}
              onTime={onTime}
              onEnded={() => {
                if (autoAdvance) go(index + 1);
              }}
              onSlideEnd={() => setSlideDone(true)}
            />
          </div>

          <div className="min-w-0 pr-5 sm:col-span-2 sm:pr-8">
            <BuildLog product={current} />
          </div>
        </article>
      </div>

      {multi ? (
        <div role="tablist" aria-label="Choose a project" className="mt-3 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-2">
          {products.map((product, i) => {
            const selected = i === index;
            return (
              <button
                key={product.slug}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                id={`project-tab-${product.slug}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls="project-stage"
                tabIndex={selected ? 0 : -1}
                onClick={() => go(i)}
                onKeyDown={(e) => onTabKey(e, i)}
                className={`rounded-xl p-3.5 text-left transition-[background-color,box-shadow] duration-200 ${
                  selected ? "bg-surface shadow-hairline" : "shadow-[0_0_0_1px_rgb(0_0_0/0.04)] hover:bg-surface/60"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <ProductIcon {...product} size={24} />
                  <span>
                    <span className="block font-medium">{product.name}</span>
                    <span className="block text-[12px] text-fg-subtle">{product.category}</span>
                  </span>
                </span>
                <span aria-hidden className="mt-3 block h-0.5 overflow-hidden rounded-[1px] bg-black/[0.06]">
                  <span
                    className="block h-full"
                    style={{ width: `${(selected ? progress : 0) * 100}%`, background: product.brand.accent }}
                  />
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <p className="mt-3.5 flex items-center gap-2.5 text-[13px] text-fg-subtle">
          <span aria-hidden className="size-[18px] rounded-[5px] border border-dashed border-[#C4C4C4]" />
          The next project is in the workshop.
        </p>
      )}
    </section>
  );
}
```

- [ ] **Step 3: Check.**

```bash
pnpm --filter @app/studio typecheck && pnpm --filter @app/studio lint && pnpm --filter @app/studio test && pnpm --filter @app/studio build
```

Expected: all pass, with 0 warnings.

- [ ] **Step 4: Commit**

```bash
git add apps/studio/src/app/_components/ProjectsReel/DemoFrame.tsx apps/studio/src/app/_components/ProjectsReel/ProjectsReel.tsx
git commit -m "feat(studio): bleeding demo frame, scroll tilt and product transitions

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Verify in the browser, including a temporary second product

**Files:**
- Temporary: `src/config/products.ts`. Revert this file before finishing.

- [ ] **Step 1: Check a single product at 1440.** Restart the `studio` server and scroll slowly to the reel. Expected:
  - The demo frame starts tilted back and is flat before it reaches the middle of the viewport.
  - The demo is cut off by the stage's right edge.
  - The build log spans the full width below.
  - Nothing animates on its own: one product, no video yet.
- [ ] **Step 2: Check 375 wide.** Expected: text, then the demo bleeding off the right edge, then the log. `document.documentElement.scrollWidth === innerWidth` returns `true`.
- [ ] **Step 3: Add a temporary second product.** In `src/config/products.ts`, append to the array:

```ts
  {
    ...products[0]!,
    slug: "ledger-test",
    name: "Ledger",
    tagline: "Money, plainly written.",
    description: "Temporary product to test reel transitions. Remove before committing.",
    brand: { bg: "#F6EFE8", fg: "#2A1A10", accent: "#C45422", accentInk: "#FFFFFF", taglineFont: "var(--font-geist)", taglineWeight: 600 },
  },
```

If `products` cannot reference itself inside its own initialiser, copy the Canvas One object literal instead and change the fields shown above. Then rebuild and restart.
- [ ] **Step 4: Check the transitions.** Expected:
  - After 8s, or after clicking the Ledger tab:
    - the stage colours fade from mint to warm
    - the glow crossfades
    - the tagline clips out and back in with no jump in height
    - the demo slides left
    - the name, status and description fade in
  - Hover holds the progress.
  - Arrow keys on the tabs switch products.
- [ ] **Step 5: Check reduced motion.** Emulate `prefers-reduced-motion: reduce` and reload. Expected: no tilt, and clicking a tab swaps instantly.
- [ ] **Step 6: Revert the temporary product.**

```bash
git checkout -- apps/studio/src/config/products.ts && git status --short
```

Expected: `products.ts` no longer appears as modified.
- [ ] **Step 7: Check play/pause.** Play/pause only appears once a product has `demo.video`. When the Canvas One video arrives, check:
  - the button is keyboard reachable
  - `aria-pressed` toggles
  - the reel stays paused while the demo is paused

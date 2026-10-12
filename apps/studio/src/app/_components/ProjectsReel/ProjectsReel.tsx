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
      setPaused(false);
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

  // Fallback in case the slide's transitionend never fires (background tab, cancelled transition).
  useEffect(() => {
    if (slideDone) return;
    const id = window.setTimeout(() => setSlideDone(true), 900);
    return () => window.clearTimeout(id);
  }, [slideDone, index]);

  // Videos play once their slide has landed, and pause while paused or under reduced motion.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (paused || reduced || !slideDone) video.pause();
    else void video.play().catch(() => undefined);
  }, [paused, reduced, slideDone, index]);

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
      history.replaceState(null, "", "#projects");
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
                href={current.appUrl ?? `/${current.slug}`}
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
              loop={!autoAdvance || holding}
              progress={hasVideo || autoAdvance ? progress : null}
              clock={clock}
              paused={paused}
              onTogglePause={() => setPaused((p) => !p)}
              onTime={onTime}
              onEnded={() => {
                if (autoAdvance && !holding) go(index + 1);
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

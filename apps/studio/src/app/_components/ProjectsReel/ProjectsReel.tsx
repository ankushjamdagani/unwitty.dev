"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";

import type { ProductWithLog } from "@/lib/data";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

import { BuildLog } from "./BuildLog";
import { DemoFrame } from "./DemoFrame";
import { ProductIcon } from "./ProductIcon";

/** How long a product without a demo video stays on stage. */
const SLIDE_MS = 8000;

export function ProjectsReel({ products }: { products: ProductWithLog[] }) {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [held, setHeld] = useState(false);
  const reduced = usePrefersReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const multi = products.length > 1;
  const current = products[index] ?? products[0];
  const autoAdvance = multi && !reduced;
  const hasVideo = Boolean(current?.demo.video);

  const go = useCallback(
    (next: number) => {
      setIndex((next + products.length) % products.length);
      setProgress(0);
    },
    [products.length],
  );

  // Poster-only products advance on a timer.
  useEffect(() => {
    if (!autoAdvance || hasVideo || held) return;
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
  }, [autoAdvance, hasVideo, held, index]);

  useEffect(() => {
    if (progress >= 1 && autoAdvance && !hasVideo) go(index + 1);
  }, [progress, autoAdvance, hasVideo, go, index]);

  // Videos pause while the reader is hovering or focused inside the reel.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (held || reduced) video.pause();
    else void video.play().catch(() => undefined);
  }, [held, reduced, index]);

  // Deep links from the hero (#projects/<slug>) select that product and hold the reel.
  useEffect(() => {
    const select = () => {
      const match = /^#projects\/(.+)$/.exec(window.location.hash);
      if (!match) return;
      const i = products.findIndex((p) => p.slug === decodeURIComponent(match[1] ?? ""));
      if (i < 0) return;
      go(i);
      setHeld(true);
      document.getElementById("projects")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    };
    select();
    window.addEventListener("hashchange", select);
    return () => window.removeEventListener("hashchange", select);
  }, [products, go, reduced]);

  if (!current) return null;

  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const delta = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
    if (!delta) return;
    event.preventDefault();
    const next = (i + delta + products.length) % products.length;
    go(next);
    tabRefs.current[next]?.focus();
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
          Projects{" "}
          <span className="font-normal text-fg-subtle">
            {String(products.length).padStart(2, "0")}
          </span>
        </h2>
        <span className="font-mono text-[12px] text-fg-subtle">
          newest first
        </span>
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
          className="flex flex-wrap gap-8 rounded-3xl bg-product-bg p-5 text-product-fg shadow-[0_0_0_1px_rgb(0_0_0/0.05),0_1px_2px_rgb(0_0_0/0.04)] transition-[background-color,color] duration-500 sm:p-8"
        >
          <div className="flex min-w-0 flex-[1_1_340px] flex-col gap-[18px] p-2">
            <div className="flex items-center gap-2.5">
              <ProductIcon {...current} />
              <span className="text-[15px] font-semibold">{current.name}</span>
              <span className="rounded-full bg-white/70 px-2 py-0.5 font-mono text-[11px] shadow-[0_0_0_1px_rgb(0_0_0/0.06)]">
                {current.status}
                {current.version ? ` · v${current.version}` : ""}
              </span>
            </div>
            <h3
              className="m-0 text-[clamp(32px,3.4vw,46px)] leading-[1.04] tracking-[-0.02em]"
              style={{
                fontFamily: current.brand.taglineFont,
                fontWeight: current.brand.taglineWeight ?? 400,
              }}
            >
              {current.tagline}
            </h3>
            <p className="m-0 max-w-[400px] text-[15px] leading-relaxed opacity-80">
              {current.description}
            </p>
            <div className="mt-auto flex flex-wrap gap-2">
              <a
                href={`/${current.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn bg-product-accent text-product-ink shadow-[inset_0_1px_0_rgb(255_255_255/0.2),0_1px_2px_rgb(0_0_0/0.15)] hover:opacity-90"
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

          <DemoFrame
            product={current}
            videoRef={videoRef}
            loop={!autoAdvance}
            progress={hasVideo || autoAdvance ? progress : null}
            onTime={() => {
              const v = videoRef.current;
              if (v?.duration) setProgress(v.currentTime / v.duration);
            }}
            onEnded={() => autoAdvance && go(index + 1)}
          />

          <BuildLog product={current} />
        </article>
      </div>

      {multi ? (
        <div
          role="tablist"
          aria-label="Choose a project"
          className="mt-3 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-2"
        >
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
                  selected
                    ? "bg-surface shadow-hairline"
                    : "shadow-[0_0_0_1px_rgb(0_0_0/0.04)] hover:bg-surface/60"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <ProductIcon {...product} size={24} />
                  <span>
                    <span className="block font-medium">{product.name}</span>
                    <span className="block text-[12px] text-fg-subtle">
                      {product.category}
                    </span>
                  </span>
                </span>
                <span
                  aria-hidden
                  className="mt-3 block h-0.5 overflow-hidden rounded-[1px] bg-black/[0.06]"
                >
                  <span
                    className="block h-full"
                    style={{
                      width: `${(selected ? progress : 0) * 100}%`,
                      background: product.brand.accent,
                    }}
                  />
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <p className="mt-3.5 flex items-center gap-2.5 text-[13px] text-fg-subtle">
          <span
            aria-hidden
            className="size-[18px] rounded-[5px] border border-dashed border-[#C4C4C4]"
          />
          The next project is in the workshop.
        </p>
      )}
    </section>
  );
}

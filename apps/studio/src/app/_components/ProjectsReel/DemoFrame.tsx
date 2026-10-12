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

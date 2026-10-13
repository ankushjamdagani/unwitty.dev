"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type RefObject } from "react";

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

  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    setVideoLoaded(false);
  }, [index]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.readyState >= 2) {
      setVideoLoaded(true);
    }
  }, [index, videoRef]);

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
        <div className="flex h-[30px] items-center gap-3 border-b border-line/[0.06] bg-canvas px-3 mr-[55px]">
          <span aria-hidden className="inline-flex gap-1.5">
            <span className="size-2 rounded-full bg-well" />
            <span className="size-2 rounded-full bg-well" />
            <span className="size-2 rounded-full bg-well" />
          </span>
          <span className="min-w-0 flex-1 truncate text-center font-mono text-[11px] text-fg-subtle">
            unwitty.dev/{current.slug}
          </span>
          <span className="font-mono text-[11px] tabular-nums text-fg-subtle">
            {clock
              ? `${formatClock(clock.current)} / ${formatClock(clock.total)}`
              : (current.demo.duration ?? "")}
          </span>
        </div>

        <div className="group relative aspect-[16/10] overflow-hidden bg-[#F4F4F4]">
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
                <div
                  key={product.slug}
                  aria-hidden={!active}
                  inert={!active}
                  className="relative h-full w-full shrink-0"
                >
                  {active && product.demo.video ? (
                    <>
                      <video
                        key={product.demo.video}
                        ref={videoRef}
                        src={product.demo.video}
                        poster={product.demo.poster}
                        className="absolute inset-0 size-full object-cover object-left-top -left-[30px]"
                        muted
                        playsInline
                        loop={loop}
                        preload="metadata"
                        onTimeUpdate={onTime}
                        onLoadedData={() => {
                          onTime();
                          setVideoLoaded(true);
                        }}
                        onPlaying={() => setVideoLoaded(true)}
                        onEnded={onEnded}
                      />
                      <div
                        className={`absolute inset-0 z-[1] flex flex-col items-center justify-center transition-opacity duration-300 ${
                          videoLoaded
                            ? "pointer-events-none opacity-0"
                            : "opacity-100"
                        }`}
                        style={{ background: product.brand.bg }}
                      >
                        <div className="flex flex-col items-center gap-3">
                          <div
                            className="flex size-16 items-center justify-center rounded-[18px] shadow-[inset_0_1px_0_rgb(255_255_255/0.25),0_6px_20px_-4px_rgb(11_92_84/0.25)]"
                            style={{ background: product.brand.accent }}
                          >
                            {product.icon === "canvas-one" ? (
                              <svg width={42} height={42} viewBox="0 0 48 48">
                                <path
                                  d="M17 6 H31 A11 11 0 0 1 42 17 V31 A11 11 0 0 1 31 42 H6 V17 A11 11 0 0 1 17 6 Z"
                                  fill="#FFFFFF"
                                />
                                <circle
                                  cx="18"
                                  cy="22"
                                  r="4.2"
                                  fill={product.brand.accent}
                                />
                                <circle
                                  cx="30"
                                  cy="22"
                                  r="4.2"
                                  fill={product.brand.accent}
                                />
                              </svg>
                            ) : (
                              <span className="font-mono text-base font-semibold text-white">
                                {product.monogram ??
                                  product.name.slice(0, 2).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <span className="font-mono text-xs tracking-wider text-[#16201D]/75">
                            {product.name}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <Image
                      src={product.demo.poster}
                      alt={active ? `${product.name} preview` : ""}
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

          {current.demo.video && (
            <button
              type="button"
              aria-label={paused ? "Play demo video" : "Pause demo video"}
              aria-pressed={paused}
              onClick={onTogglePause}
              className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center bg-black/15 opacity-0 transition-opacity duration-200 group-hover:opacity-100 focus-visible:opacity-100"
            >
              <span className="grid size-20 place-items-center rounded-full bg-black/60 text-white shadow-lg backdrop-blur-md transition-transform duration-150 hover:scale-110 active:scale-95">
                <span aria-hidden className="text-white">
                  {paused ? (
                    <svg
                      className="size-5 translate-x-0.5 fill-current"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  ) : (
                    <svg className="size-5 fill-current" viewBox="0 0 24 24">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                  )}
                </span>
              </span>
            </button>
          )}

          {progress !== null && (
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-0.5 bg-black/[0.06]"
            >
              <span
                className="block h-full transition-colors duration-700"
                style={{
                  width: `${progress * 100}%`,
                  background: current.brand.accent,
                }}
              />
            </span>
          )}
        </div>
      </figure>
    </div>
  );
}

"use client";

import Image from "next/image";
import type { RefObject } from "react";

import type { Product } from "@/config/types";

type Props = {
  product: Product;
  /** 0–1, or null to hide the bar. */
  progress: number | null;
  videoRef: RefObject<HTMLVideoElement | null>;
  loop: boolean;
  onTime: () => void;
  onEnded: () => void;
};

export function DemoFrame({ product, progress, videoRef, loop, onTime, onEnded }: Props) {
  const { demo, slug, name, brand } = product;

  return (
    <figure
      aria-label={`${name} demo`}
      className="m-0 min-w-0 flex-[999_1_560px] overflow-hidden rounded-xl bg-white shadow-frame"
    >
      <div className="flex h-9 items-center gap-3 border-b border-line/[0.06] bg-canvas px-3">
        <span aria-hidden className="inline-flex gap-1.5">
          <span className="size-2.5 rounded-full bg-well" />
          <span className="size-2.5 rounded-full bg-well" />
          <span className="size-2.5 rounded-full bg-well" />
        </span>
        <span className="flex-1 text-center font-mono text-[11px] text-fg-subtle">unwitty.dev/{slug}</span>
        <span className="min-w-[30px] text-right font-mono text-[11px] text-fg-subtle">{demo.duration}</span>
      </div>
      <div className="relative aspect-[16/10] bg-[#F4F4F4]">
        {demo.video ? (
          <video
            key={demo.video}
            ref={videoRef}
            src={demo.video}
            poster={demo.poster}
            className="absolute inset-0 size-full object-cover object-left-top"
            autoPlay
            muted
            playsInline
            loop={loop}
            preload="metadata"
            onTimeUpdate={onTime}
            onEnded={onEnded}
          />
        ) : (
          <Image
            src={demo.poster}
            alt={`${name} screenshot`}
            fill
            sizes="(min-width: 1120px) 680px, 100vw"
            className="object-cover object-left-top"
            priority
          />
        )}
        {progress !== null && (
          <span aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 bg-black/[0.06]">
            <span
              className="block h-full"
              style={{ width: `${progress * 100}%`, background: brand.accent }}
            />
          </span>
        )}
      </div>
    </figure>
  );
}

"use client";

import { useEffect, useState } from "react";

import type { TaglineCanvas } from "@/config/types";

import { CanvasHeadline } from "./CanvasTagline";

export type Tagline = {
  key: string;
  text: string;
  canvas?: TaglineCanvas;
  font: string;
  weight: number;
};

const SIZE =
  "m-0 pb-[0.08em] text-[clamp(32px,3.4vw,46px)] leading-[1.04] tracking-[-0.02em]";
const CELL = "[grid-area:1/1]";
const OUT_MS = 350;

/**
 * The product tagline. When `tagline.key` changes, the old line animates out
 * while the new one animates in; both share one grid cell, so the height of the
 * taller one is reserved and nothing jumps. Only the incoming line is the heading.
 * A tagline with `canvas` renders as a CanvasHeadline; its intro is driven by
 * the reel.
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
    // Clip only mid-swap, so a settled canvas tagline's cursor can hang below the line.
    <div className={leaving ? "grid overflow-hidden" : "grid"}>
      {leaving &&
        (leaving.canvas ? (
          <CanvasHeadline
            key={`out-${leaving.key}`}
            canvas={leaving.canvas}
            text={leaving.text}
            className={`${SIZE} ${CELL} tagline-out`}
            style={style(leaving)}
            decorative
          />
        ) : (
          <p
            key={`out-${leaving.key}`}
            aria-hidden
            className={`${SIZE} ${CELL} tagline-out`}
            style={style(leaving)}
          >
            {leaving.text}
          </p>
        ))}
      {current.canvas ? (
        <CanvasHeadline
          key={current.key}
          canvas={current.canvas}
          text={current.text}
          className={swapped ? `${SIZE} ${CELL} tagline-in` : `${SIZE} ${CELL}`}
          style={style(current)}
        />
      ) : (
        <h3
          key={current.key}
          className={swapped ? `${SIZE} ${CELL} tagline-in` : `${SIZE} ${CELL}`}
          style={style(current)}
        >
          {current.text}
        </h3>
      )}
    </div>
  );
}

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

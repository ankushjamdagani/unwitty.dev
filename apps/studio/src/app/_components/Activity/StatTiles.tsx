"use client";

import { useEffect, useRef, useState } from "react";

import type { ActivityGrid } from "@/lib/activity";

const DURATION_MS = 900;

/** Counts up from 0 once, the first time `play` turns true. */
function CountUp({ value, play, armed }: { value: number; play: boolean; armed: boolean }) {
  const [shown, setShown] = useState<number | null>(null);
  const done = useRef(false);

  useEffect(() => {
    if (!play || done.current) return;
    done.current = true;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / DURATION_MS);
      setShown(p < 1 ? Math.round(value * (1 - (1 - p) ** 3)) : null);
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      setShown(null);
    };
  }, [play, value]);

  if (armed) return <>0</>;

  return <>{(shown ?? value).toLocaleString("en-US")}</>;
}

type Tile = { label: string; value: number; unit?: [string, string] };

export function StatTiles({
  grid,
  countUp,
  armed,
}: {
  grid: ActivityGrid;
  countUp: boolean;
  armed: boolean;
}) {
  const tiles: Tile[] = [
    { label: "Contributions", value: grid.total },
    { label: "Releases", value: grid.releases },
    { label: "Longest streak", value: grid.longestStreak, unit: ["day", "days"] },
    { label: "Current streak", value: grid.currentStreak, unit: ["day", "days"] },
  ];

  return (
    <dl className="m-0 mb-6 grid grid-cols-2 border-t border-line sm:grid-cols-4">
      {tiles.map((tile) => (
        <div key={tile.label} className="py-3 pr-3.5">
          <dt className="font-mono text-[10.5px] uppercase tracking-[0.06em] text-fg-subtle">{tile.label}</dt>
          <dd className="m-0 mt-0.5 text-[30px] font-medium tabular-nums tracking-[-0.04em]">
            <CountUp value={tile.value} play={countUp} armed={armed} />
            {tile.unit && (
              <span className="ml-1 text-[13px] font-normal tracking-normal text-fg-subtle">
                {tile.value === 1 ? tile.unit[0] : tile.unit[1]}
              </span>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

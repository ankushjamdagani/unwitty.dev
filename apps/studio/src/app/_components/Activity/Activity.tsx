"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { filterGrid, type ActivityCell, type ActivityGrid } from "@/lib/activity";
import type { ActivitySwatch } from "@/lib/data";
import { formatDay } from "@/lib/format";

import { DayCard } from "./DayCard";
import { HeatmapGrid } from "./HeatmapGrid";
import { StatTiles } from "./StatTiles";
import { useDrawIn } from "./useDrawIn";

type Props = {
  grid: ActivityGrid;
  sources: ActivitySwatch[];
};

type Active = { pos: [number, number]; el: HTMLElement };

export function Activity({ grid, sources }: Props) {
  const colors = useMemo(() => Object.fromEntries(sources.map((s) => [s.slug, s.color])), [sources]);
  const names = useMemo(() => Object.fromEntries(sources.map((s) => [s.slug, s.name])), [sources]);

  const [hidden, setHidden] = useState<ReadonlySet<string>>(new Set());
  const [active, setActive] = useState<Active | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const phase = useDrawIn(gridRef);

  const view = useMemo(
    () => (hidden.size ? filterGrid(grid, (slug) => !hidden.has(slug)) : grid),
    [grid, hidden],
  );
  const activeCell = active ? (view.weeks[active.pos[0]]?.[active.pos[1]] ?? null) : null;

  const onActive = useCallback((pos: [number, number] | null, el: HTMLElement | null) => {
    setActive(pos && el ? { pos, el } : null);
  }, []);

  // A tap outside the grid closes the card on touch screens.
  useEffect(() => {
    if (!active) return;
    const onDown = (event: PointerEvent) => {
      if (!gridRef.current?.contains(event.target as Node)) setActive(null);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [active]);

  const toggle = (slug: string) =>
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });

  const describe = (cell: ActivityCell): string => {
    const parts = Object.entries(cell.bySlug)
      .sort((a, b) => b[1] - a[1])
      .map(([slug, n]) => `${names[slug] ?? slug} ${n}`);
    const releases = cell.releases.map((r) => ` · release ${r.name} v${r.version}`).join("");
    return `${formatDay(cell.date)} · ${cell.total ? parts.join(", ") : "no contributions"}${releases}`;
  };

  const releaseColor = sources[0]?.color ?? "rgb(var(--fg))";

  return (
    <section id="activity" aria-labelledby="activity-title" className="pt-section">
      <div ref={containerRef} className="relative rounded-2xl bg-surface p-6 shadow-hairline">
        <div className="mb-[18px] flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="activity-title" className="section-title">
            Activity
          </h2>
          <span aria-live="polite" className="font-mono text-[12px] text-fg-muted">
            {activeCell ? describe(activeCell) : "Last 12 months"}
          </span>
        </div>

        <StatTiles grid={view} countUp={phase === "played"} />

        <HeatmapGrid
          weeks={view.weeks}
          colors={colors}
          activeDate={activeCell?.date ?? null}
          armed={phase === "armed"}
          gridRef={gridRef}
          describe={describe}
          onActive={onActive}
        />

        <DayCard cell={activeCell} anchor={active?.el ?? null} containerRef={containerRef} sources={sources} />

        <div className="mt-4 flex flex-wrap items-center gap-x-1 gap-y-1 text-[12px] text-fg-muted">
          <span role="group" aria-label="Filter by source" className="-ml-1.5 flex flex-wrap items-center gap-x-1 gap-y-1">
            {sources.map((s) => {
              const shown = !hidden.has(s.slug);
              return (
                <button
                  key={s.slug}
                  type="button"
                  aria-pressed={shown}
                  onClick={() => toggle(s.slug)}
                  className={`inline-flex h-7 items-center gap-1.5 rounded-md px-1.5 transition-colors hover:bg-black/[0.04] ${
                    shown ? "" : "text-fg-subtle line-through decoration-fg-subtle/60"
                  }`}
                >
                  <span
                    aria-hidden
                    className="size-2.5 rounded-[3px] transition-colors"
                    style={
                      shown
                        ? { background: s.color }
                        : { background: "transparent", boxShadow: `inset 0 0 0 1.5px ${s.color}` }
                    }
                  />
                  {s.name}
                </button>
              );
            })}
            {hidden.size > 0 && (
              <button
                type="button"
                onClick={() => setHidden(new Set())}
                className="inline-flex h-7 items-center rounded-md px-1.5 text-fg underline-offset-2 hover:underline"
              >
                Show all
              </button>
            )}
          </span>
          <span className="inline-flex h-7 items-center gap-2 px-1.5">
            <span
              aria-hidden
              className="size-2.5 rounded-[3px] bg-black/[0.05]"
              style={{ boxShadow: `0 0 0 1.5px rgb(var(--surface)), 0 0 0 3px ${releaseColor}` }}
            />
            Release
          </span>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { filterGrid, type ActivityCell, type ActivityGrid, type DayRelease } from "@/lib/activity";
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

type ReleaseSpot = {
  release: DayRelease;
  date: string;
  pos: [number, number];
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatReleaseDate(iso: string): string {
  const [, m, d] = iso.split("-").map(Number);
  return `${MONTHS[(m ?? 1) - 1]} ${d}`;
}

export function Activity({ grid, sources }: Props) {
  const colors = useMemo(() => Object.fromEntries(sources.map((s) => [s.slug, s.color])), [sources]);
  const names = useMemo(() => Object.fromEntries(sources.map((s) => [s.slug, s.name])), [sources]);
  const sourceOrder = useMemo(() => sources.map((s) => s.slug), [sources]);

  const [selected, setSelected] = useState<string | null>(null);
  const [active, setActive] = useState<Active | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const phase = useDrawIn(gridRef);

  const releases = useMemo<ReleaseSpot[]>(() => {
    const list: ReleaseSpot[] = [];
    grid.weeks.forEach((week, w) => {
      week.forEach((cell, d) => {
        cell.releases.forEach((r) => {
          list.push({ release: r, date: cell.date, pos: [w, d] });
        });
      });
    });
    return list;
  }, [grid.weeks]);

  const view = useMemo(
    () => (selected ? filterGrid(grid, (slug) => slug === selected) : grid),
    [grid, selected],
  );
  const activeCell = active ? (view.weeks[active.pos[0]]?.[active.pos[1]] ?? null) : null;

  const onActive = useCallback((pos: [number, number] | null, el: HTMLElement | null) => {
    setActive(pos && el ? { pos, el } : null);
  }, []);

  // A tap outside the grid closes the card on touch screens.
  useEffect(() => {
    if (!active) return;
    const onDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (gridRef.current?.contains(target) || target?.closest?.("[data-release-spotlight]")) {
        return;
      }
      setActive(null);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [active]);

  const onSelectSource = (slug: string) => {
    setSelected((prev) => (prev === slug ? null : slug));
  };

  const spotlightRelease = (target: ReleaseSpot) => {
    // If the release's source is currently filtered out, restore "All" so the release cell is visible
    if (selected !== null && selected !== target.release.slug) {
      setSelected(null);
    }

    setTimeout(() => {
      const cellEl = gridRef.current?.querySelector<HTMLElement>(`[data-date="${target.date}"]`);
      if (cellEl) {
        cellEl.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        onActive(target.pos, cellEl);
        cellEl.focus();
      }
    }, 40);
  };

  const describe = (cell: ActivityCell): string => {
    const parts = Object.entries(cell.bySlug)
      .sort((a, b) => b[1] - a[1])
      .map(([slug, n]) => `${names[slug] ?? slug} ${n}`);
    const cellReleases = cell.releases.map((r) => ` · release ${r.name} v${r.version}`).join("");
    return `${formatDay(cell.date)} · ${cell.total ? parts.join(", ") : "no contributions"}${cellReleases}`;
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

        <StatTiles grid={view} countUp={phase === "played"} armed={phase === "armed"} />

        <HeatmapGrid
          weeks={view.weeks}
          colors={colors}
          sourceOrder={sourceOrder}
          activeDate={activeCell?.date ?? null}
          armed={phase === "armed"}
          gridRef={gridRef}
          describe={describe}
          onActive={onActive}
        />

        <DayCard cell={activeCell} anchor={active?.el ?? null} containerRef={containerRef} sources={sources} />

        <div className="mt-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 text-[12px]">
          <div role="group" aria-label="Filter by project" className="-ml-1.5 flex flex-wrap items-center gap-1">
            <button
              type="button"
              aria-pressed={selected === null}
              onClick={() => setSelected(null)}
              className={`inline-flex h-7 items-center rounded-md px-2 font-mono text-[11px] transition-colors ${
                selected === null
                  ? "bg-black/[0.08] font-medium text-fg dark:bg-white/15"
                  : "text-fg-muted hover:bg-black/[0.04] hover:text-fg"
              }`}
            >
              All
            </button>
            {sources.map((s) => {
              const isSelected = selected === s.slug;
              const isMuted = selected !== null && !isSelected;
              return (
                <button
                  key={s.slug}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => onSelectSource(s.slug)}
                  className={`inline-flex h-7 items-center gap-1.5 rounded-md px-2 transition-all hover:bg-black/[0.04] ${
                    isSelected
                      ? "bg-black/[0.08] font-medium text-fg shadow-xs dark:bg-white/15"
                      : isMuted
                        ? "text-fg-subtle opacity-45 hover:opacity-100"
                        : "text-fg-muted hover:text-fg"
                  }`}
                >
                  <span
                    aria-hidden
                    className="size-2.5 rounded-[3px] transition-all"
                    style={
                      !isMuted
                        ? { background: s.color }
                        : { background: "transparent", boxShadow: `inset 0 0 0 1.5px ${s.color}` }
                    }
                  />
                  {s.name}
                </button>
              );
            })}
          </div>

          {releases.length > 0 && (
            <div className="flex items-center">
              <button
                type="button"
                data-release-spotlight
                onClick={() => spotlightRelease(releases[0]!)}
                title={`Jump to ${releases[0]!.release.name} v${releases[0]!.release.version} (${formatDay(releases[0]!.date)})`}
                className="group inline-flex h-7 items-center gap-2 rounded-full border border-black/10 bg-surface pl-2 pr-2.5 text-[11px] text-fg shadow-xs transition-all hover:border-black/25 hover:bg-black/[0.03] active:scale-[0.98] dark:border-white/15 dark:hover:border-white/30 dark:hover:bg-white/[0.05]"
              >
                <span
                  aria-hidden
                  className="size-2 rounded-full bg-transparent transition-transform group-hover:scale-110"
                  style={{
                    boxShadow: `0 0 0 1px rgb(var(--surface)), 0 0 0 2.5px ${colors[releases[0]!.release.slug] ?? releaseColor}`,
                  }}
                />
                <span className="flex items-center gap-1">
                  <span className="font-medium text-fg">
                    {releases.length === 1 ? "1 release" : `${releases.length} releases`}
                  </span>
                  <span className="font-mono text-fg-subtle">
                    · {formatReleaseDate(releases[0]!.date)}
                  </span>
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

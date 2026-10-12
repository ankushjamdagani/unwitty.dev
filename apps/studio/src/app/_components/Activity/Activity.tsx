"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";

import { filterGrid, type ActivityCell, type ActivityGrid } from "@/lib/activity";
import type { ActivitySwatch } from "@/lib/data";
import { formatDay } from "@/lib/format";

type Props = {
  grid: ActivityGrid;
  sources: ActivitySwatch[];
  /** Dated releases per product slug. */
  releases: Record<string, number>;
};

const OPACITY = [0, 0.3, 0.55, 0.78, 1] as const;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function plural(n: number, word: string): string {
  return `${n.toLocaleString("en-US")} ${word}${n === 1 ? "" : "s"}`;
}

export function Activity({ grid, sources, releases }: Props) {
  const colors = useMemo(() => Object.fromEntries(sources.map((s) => [s.slug, s.color])), [sources]);
  const names = useMemo(() => Object.fromEntries(sources.map((s) => [s.slug, s.name])), [sources]);

  const lastWeek = grid.weeks.length - 1;
  const lastDay = Math.max(0, (grid.weeks[lastWeek]?.filter((c) => c.inRange).length ?? 1) - 1);
  const [focus, setFocus] = useState<[number, number]>([lastWeek, lastDay]);
  const [activePos, setActivePos] = useState<[number, number] | null>(null);
  const [hidden, setHidden] = useState<ReadonlySet<string>>(new Set());

  const view = useMemo(
    () => (hidden.size ? filterGrid(grid, (slug) => !hidden.has(slug)) : grid),
    [grid, hidden],
  );
  const active = activePos ? (view.weeks[activePos[0]]?.[activePos[1]] ?? null) : null;
  const visibleReleases = Object.entries(releases).reduce(
    (n, [slug, count]) => (hidden.has(slug) ? n : n + count),
    0,
  );

  const toggle = (slug: string) =>
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  const cellRefs = useRef<Map<string, HTMLSpanElement>>(new Map());
  const scrollerRef = useRef<HTMLDivElement>(null);

  // On narrow screens the grid scrolls; start at the most recent weeks.
  useEffect(() => {
    const el = scrollerRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, []);

  const summary = `${plural(view.total, "contribution")} · ${plural(visibleReleases, "release")} · longest streak ${plural(view.longestStreak, "day")}`;

  const describe = (cell: ActivityCell): string => {
    const parts = Object.entries(cell.bySlug)
      .sort((a, b) => b[1] - a[1])
      .map(([slug, n]) => `${names[slug] ?? slug} ${n}`);
    return `${formatDay(cell.date)} · ${cell.total ? parts.join(", ") : "no contributions"}`;
  };

  const monthLabels = grid.weeks.map((week, w) => {
    const first = week[0];
    const prev = grid.weeks[w - 1]?.[0];
    if (!first || (prev && prev.date.slice(5, 7) === first.date.slice(5, 7))) return "";
    return w === 0 ? "" : (MONTHS[Number(first.date.slice(5, 7)) - 1] ?? "");
  });

  const move = (event: KeyboardEvent<HTMLSpanElement>, w: number, d: number) => {
    const step: Record<string, [number, number]> = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
    };
    const delta = step[event.key];
    if (!delta) return;
    event.preventDefault();
    const nw = Math.min(lastWeek, Math.max(0, w + delta[0]));
    const nd = Math.min(6, Math.max(0, d + delta[1]));
    const cell = grid.weeks[nw]?.[nd];
    if (!cell?.inRange) return;
    setFocus([nw, nd]);
    cellRefs.current.get(`${nw}-${nd}`)?.focus();
  };

  return (
    <section id="activity" aria-labelledby="activity-title" className="pt-section">
      <div className="rounded-2xl bg-surface p-6 shadow-hairline">
        <div className="mb-[18px] flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="activity-title" className="section-title">
            Activity
          </h2>
          <span aria-live="polite" className="font-mono text-[12px] text-fg-muted">
            {active ? describe(active) : "Last 12 months"}
          </span>
        </div>

        <div ref={scrollerRef} className="overflow-x-auto pb-1">
          <div className="min-w-[720px]">
            <div aria-hidden className="mb-1.5 flex gap-[3px] font-mono text-[10px] text-fg-subtle">
              {monthLabels.map((label, w) => (
                <span key={w} className="flex-1 whitespace-nowrap">
                  {label}
                </span>
              ))}
            </div>
            <div
              role="grid"
              aria-label="Daily contributions for the last 12 months, coloured by project"
              className="flex gap-[3px]"
              onMouseLeave={() => setActivePos(null)}
            >
              {view.weeks.map((week, w) => (
                <div key={w} role="row" className="flex flex-1 flex-col gap-[3px]">
                  {week.map((cell, d) => {
                    const color = cell.lead ? colors[cell.lead] : undefined;
                    const focusable = focus[0] === w && focus[1] === d;
                    return (
                      <span
                        key={cell.date}
                        ref={(el) => {
                          if (el) cellRefs.current.set(`${w}-${d}`, el);
                          else cellRefs.current.delete(`${w}-${d}`);
                        }}
                        role="gridcell"
                        aria-label={cell.inRange ? describe(cell) : undefined}
                        aria-hidden={cell.inRange ? undefined : true}
                        tabIndex={cell.inRange ? (focusable ? 0 : -1) : undefined}
                        onMouseEnter={() => cell.inRange && setActivePos([w, d])}
                        onFocus={() => {
                          setFocus([w, d]);
                          setActivePos([w, d]);
                        }}
                        onKeyDown={(e) => move(e, w, d)}
                        className={`relative aspect-square w-full rounded-[3px] ${
                          cell.inRange ? "bg-black/[0.05]" : "invisible"
                        } ${active?.date === cell.date ? "ring-1 ring-fg/40" : ""}`}
                      >
                        {color && cell.level > 0 && (
                          <span
                            aria-hidden
                            className="absolute inset-0 rounded-[3px]"
                            style={{ background: color, opacity: OPACITY[cell.level] }}
                          />
                        )}
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-[12px] text-fg-muted">
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
          <span>{summary}</span>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";

import type { ActivityCell, ActivityGrid } from "@/lib/activity";
import type { ActivitySwatch } from "@/lib/data";
import { formatDay } from "@/lib/format";

type Props = {
  grid: ActivityGrid;
  sources: ActivitySwatch[];
  releases: number;
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
  const [active, setActive] = useState<ActivityCell | null>(null);
  const cellRefs = useRef<Map<string, HTMLSpanElement>>(new Map());
  const scrollerRef = useRef<HTMLDivElement>(null);

  // On narrow screens the grid scrolls; start at the most recent weeks.
  useEffect(() => {
    const el = scrollerRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, []);

  const summary = `${plural(grid.total, "contribution")} · ${plural(releases, "release")} · longest streak ${plural(grid.longestStreak, "day")}`;

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
              onMouseLeave={() => setActive(null)}
            >
              {grid.weeks.map((week, w) => (
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
                        onMouseEnter={() => cell.inRange && setActive(cell)}
                        onFocus={() => {
                          setFocus([w, d]);
                          setActive(cell);
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

        <div className="mt-4 flex flex-wrap justify-between gap-x-6 gap-y-2 text-[12px] text-fg-muted">
          <span className="flex flex-wrap gap-x-4 gap-y-1">
            {sources.map((s) => (
              <span key={s.slug} className="inline-flex items-center gap-1.5">
                <span aria-hidden className="size-2.5 rounded-[3px]" style={{ background: s.color }} />
                {s.name}
              </span>
            ))}
          </span>
          <span>{summary}</span>
        </div>
      </div>
    </section>
  );
}

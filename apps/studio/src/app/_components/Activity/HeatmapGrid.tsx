"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type RefObject } from "react";

import type { ActivityCell } from "@/lib/activity";

const OPACITY = [0, 0.3, 0.55, 0.78, 1] as const;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const STEP: Record<string, [number, number]> = {
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
};

export function getCellBackground(
  cell: ActivityCell,
  colors: Record<string, string>,
  sourceOrder?: string[],
): string | undefined {
  if (cell.level === 0) return undefined;

  const orderMap = sourceOrder ? new Map(sourceOrder.map((slug, i) => [slug, i])) : null;

  const entries = Object.entries(cell.bySlug)
    .filter(([slug, n]) => n > 0 && colors[slug])
    .sort((a, b) => {
      if (orderMap) {
        return (orderMap.get(a[0]) ?? 999) - (orderMap.get(b[0]) ?? 999);
      }
      return b[1] - a[1];
    });

  const leadEntry = entries[0];
  if (!leadEntry) return undefined;
  if (entries.length === 1) {
    return colors[leadEntry[0]];
  }

  // Equal split (Option B) ordered according to legends
  const step = 100 / entries.length;
  const stops: string[] = [];
  entries.forEach(([slug], idx) => {
    const color = colors[slug];
    const start = (idx * step).toFixed(1);
    const end = ((idx + 1) * step).toFixed(1);
    stops.push(`${color} ${start}% ${end}%`);
  });
  return `linear-gradient(135deg, ${stops.join(", ")})`;
}

type Props = {
  weeks: ActivityCell[][];
  /** Source slug → colour. */
  colors: Record<string, string>;
  /** Slugs in legend order. */
  sourceOrder?: string[];
  activeDate: string | null;
  /** Hide cells until the draw-in plays. */
  armed: boolean;
  gridRef: RefObject<HTMLDivElement | null>;
  describe: (cell: ActivityCell) => string;
  onActive: (pos: [number, number] | null, el: HTMLElement | null) => void;
};

export function HeatmapGrid({ weeks, colors, sourceOrder, activeDate, armed, gridRef, describe, onActive }: Props) {
  const lastWeek = weeks.length - 1;
  const lastDay = Math.max(0, (weeks[lastWeek]?.filter((c) => c.inRange).length ?? 1) - 1);
  const [focus, setFocus] = useState<[number, number]>([lastWeek, lastDay]);
  const cellRefs = useRef<Map<string, HTMLSpanElement>>(new Map());
  const scrollerRef = useRef<HTMLDivElement>(null);

  // On narrow screens the grid scrolls; start at the most recent weeks.
  useEffect(() => {
    const el = scrollerRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, []);

  const monthLabels = weeks.map((week, w) => {
    const first = week[0];
    const prev = weeks[w - 1]?.[0];
    if (!first || (prev && prev.date.slice(5, 7) === first.date.slice(5, 7))) return "";
    return w === 0 ? "" : (MONTHS[Number(first.date.slice(5, 7)) - 1] ?? "");
  });

  const move = (event: KeyboardEvent<HTMLSpanElement>, w: number, d: number) => {
    if (event.key === "Escape") {
      onActive(null, null);
      return;
    }
    const delta = STEP[event.key];
    if (!delta) return;
    event.preventDefault();
    const nw = Math.min(lastWeek, Math.max(0, w + delta[0]));
    const nd = Math.min(6, Math.max(0, d + delta[1]));
    if (!weeks[nw]?.[nd]?.inRange) return;
    setFocus([nw, nd]);
    cellRefs.current.get(`${nw}-${nd}`)?.focus();
  };

  return (
    <div ref={scrollerRef} className="-m-1 overflow-x-auto p-1 pb-2">
      <div className="min-w-[720px]">
        <div aria-hidden className="mb-1.5 flex gap-[3px] font-mono text-[10px] text-fg-subtle">
          {monthLabels.map((label, w) => (
            <span key={w} className="flex-1 whitespace-nowrap">
              {label}
            </span>
          ))}
        </div>
        <div
          ref={gridRef}
          role="grid"
          aria-label="Daily contributions for the last 12 months, coloured by project"
          data-armed={armed ? "" : undefined}
          className="flex gap-[3px]"
          onMouseLeave={() => onActive(null, null)}
        >
          {weeks.map((week, w) => (
            <div key={w} role="row" className="flex flex-1 flex-col gap-[3px]">
              {week.map((cell, d) => {
                const bg = getCellBackground(cell, colors, sourceOrder);
                const release = cell.releases[0];
                const ring = release ? colors[release.slug] : undefined;
                const focusable = focus[0] === w && focus[1] === d;
                const activate = (el: HTMLElement) => {
                  if (cell.inRange) onActive([w, d], el);
                };
                const shadows: string[] = [];
                if (cell.level === 0) {
                  shadows.push("inset 0 0 0 1px rgb(0 0 0 / 0.12)");
                }
                if (ring) {
                  shadows.push("0 0 0 1.5px rgb(var(--surface))", `0 0 0 3px ${ring}`);
                }
                const style = {
                  "--week": w,
                  ...(shadows.length > 0 ? { boxShadow: shadows.join(", ") } : {}),
                } as CSSProperties;
                return (
                  <span
                    key={cell.date}
                    data-date={cell.date}
                    data-has-release={cell.releases.length > 0 ? "true" : undefined}
                    ref={(el) => {
                      if (el) cellRefs.current.set(`${w}-${d}`, el);
                      else cellRefs.current.delete(`${w}-${d}`);
                    }}
                    role="gridcell"
                    aria-label={cell.inRange ? describe(cell) : undefined}
                    aria-hidden={cell.inRange ? undefined : true}
                    tabIndex={cell.inRange ? (focusable ? 0 : -1) : undefined}
                    onMouseEnter={(e) => activate(e.currentTarget)}
                    onClick={(e) => activate(e.currentTarget)}
                    onFocus={(e) => {
                      setFocus([w, d]);
                      activate(e.currentTarget);
                    }}
                    onKeyDown={(e) => move(e, w, d)}
                    style={style}
                    className={`heat-cell relative aspect-square w-full rounded-[3px] ${
                      cell.inRange
                        ? cell.level === 0
                          ? "bg-transparent"
                          : "bg-black/[0.04]"
                        : "invisible"
                    } ${activeDate === cell.date ? "outline outline-1 outline-offset-1 outline-fg/40" : ""}`}
                  >
                    {bg && cell.level > 0 && (
                      <span
                        aria-hidden
                        className="absolute inset-0 rounded-[3px]"
                        style={{ background: bg, opacity: OPACITY[cell.level] }}
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
  );
}

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

type Props = {
  weeks: ActivityCell[][];
  /** Source slug → colour. */
  colors: Record<string, string>;
  activeDate: string | null;
  /** Hide cells until the draw-in plays. */
  armed: boolean;
  gridRef: RefObject<HTMLDivElement | null>;
  describe: (cell: ActivityCell) => string;
  onActive: (pos: [number, number] | null, el: HTMLElement | null) => void;
};

export function HeatmapGrid({ weeks, colors, activeDate, armed, gridRef, describe, onActive }: Props) {
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
                const color = cell.lead ? colors[cell.lead] : undefined;
                const release = cell.releases[0];
                const ring = release ? colors[release.slug] : undefined;
                const focusable = focus[0] === w && focus[1] === d;
                const activate = (el: HTMLElement) => {
                  if (cell.inRange) onActive([w, d], el);
                };
                const style = {
                  "--week": w,
                  ...(ring ? { boxShadow: `0 0 0 1.5px rgb(var(--surface)), 0 0 0 3px ${ring}` } : {}),
                } as CSSProperties;
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
                    onMouseEnter={(e) => activate(e.currentTarget)}
                    onClick={(e) => activate(e.currentTarget)}
                    onFocus={(e) => {
                      setFocus([w, d]);
                      activate(e.currentTarget);
                    }}
                    onKeyDown={(e) => move(e, w, d)}
                    style={style}
                    className={`heat-cell relative aspect-square w-full rounded-[3px] ${
                      cell.inRange ? "bg-black/[0.05]" : "invisible"
                    } ${activeDate === cell.date ? "outline outline-1 outline-offset-1 outline-fg/40" : ""}`}
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
  );
}

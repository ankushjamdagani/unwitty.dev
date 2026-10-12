"use client";

import { useLayoutEffect, useRef, useState, type RefObject } from "react";

import { MAX_MESSAGES, type ActivityCell } from "@/lib/activity";
import type { ActivitySwatch } from "@/lib/data";
import { formatDay } from "@/lib/format";

const GAP = 18;

type Props = {
  cell: ActivityCell | null;
  anchor: HTMLElement | null;
  /** Positioned ancestor the card is placed in. */
  containerRef: RefObject<HTMLDivElement | null>;
  sources: ActivitySwatch[];
};

/** Floating detail card next to the active cell. Visual only: the aria-live readout carries the same facts. */
export function DayCard({ cell, anchor, containerRef, sources }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);

  useLayoutEffect(() => {
    const card = ref.current;
    const container = containerRef.current;
    if (!cell || !anchor || !card || !container) {
      setPos(null);
      return;
    }
    const a = anchor.getBoundingClientRect();
    const c = container.getBoundingClientRect();
    const width = card.offsetWidth;
    const height = card.offsetHeight;
    let left = a.right - c.left + GAP;
    if (left + width > c.width) left = a.left - c.left - GAP - width;
    left = Math.max(0, Math.min(left, c.width - width));
    const top = Math.max(0, Math.min(a.top - c.top + a.height / 2 - height / 2, c.height - height));
    setPos({ left, top });
  }, [cell, anchor, containerRef]);

  const breakdown = cell
    ? sources
        .filter((s) => cell.bySlug[s.slug])
        .map((s) => ({ ...s, n: cell.bySlug[s.slug] ?? 0 }))
        .sort((a, b) => b.n - a.n)
    : [];

  return (
    <div
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute z-10 w-[min(250px,calc(100vw-32px))] rounded-xl bg-surface p-3 text-[12px] shadow-[0_0_0_1px_rgb(0_0_0/0.08),0_12px_32px_-12px_rgb(0_0_0/0.25)] transition-[opacity,transform] duration-150 ${
        pos ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
      }`}
      style={{ left: pos?.left ?? 0, top: pos?.top ?? 0 }}
    >
      {cell && (
        <>
          <div className="font-mono text-[11px] text-fg-subtle">{formatDay(cell.date)}</div>
          <div className="mt-0.5 text-[18px] font-medium tracking-[-0.03em]">
            {cell.total ? `${cell.total.toLocaleString("en-US")} contribution${cell.total === 1 ? "" : "s"}` : "No activity"}
          </div>

          {breakdown.length > 0 && (
            <>
              <div className="mt-2 flex h-1.5 overflow-hidden rounded-[3px] bg-well">
                {breakdown.map((s) => (
                  <span key={s.slug} style={{ flex: s.n, background: s.color }} />
                ))}
              </div>
              <ul className="m-0 mt-2 grid list-none gap-0.5 p-0 text-fg-body">
                {breakdown.map((s) => (
                  <li key={s.slug} className="flex items-center gap-1.5">
                    <span className="size-[7px] rounded-[2px]" style={{ background: s.color }} />
                    {s.name} · {s.n}
                  </li>
                ))}
              </ul>
            </>
          )}

          {cell.releases.map((release) => {
            const source = sources.find((s) => s.slug === release.slug);
            return (
              <div
                key={`${release.slug}-${release.version}`}
                className="mt-2 rounded-lg px-2 py-1.5 font-medium"
                style={{ background: source?.bg ?? "rgb(var(--well))", color: source?.color }}
              >
                {release.name} v{release.version} released
              </div>
            );
          })}

          {cell.messages.length > 0 && (
            <ul className="m-0 mt-2 grid list-none gap-1 border-t border-line/[0.06] p-0 pt-2 font-mono text-[10.5px] text-fg-muted">
              {cell.messages.slice(0, MAX_MESSAGES).map((m) => (
                <li key={`${m.at}-${m.text}`} className="truncate">
                  {m.text}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

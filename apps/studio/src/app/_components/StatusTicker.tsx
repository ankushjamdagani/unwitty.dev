"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { formatDay, formatRelative } from "@/lib/format";
import type { HeroUpdate } from "@/lib/hero";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

const ROTATE_MS = 4000;

/** Current time after mount (null during SSR so hydration matches), refreshed every minute. */
function useNow(): Date | null {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

function message(update: HeroUpdate, now: Date | null): string {
  const when = now ? formatRelative(update.at, now) : formatDay(update.at.slice(0, 10));
  return `${update.text} ${when}${update.suffix}`;
}

/** Status pill cycling through live updates with a vertical slide. Pauses on hover and focus. */
export function StatusTicker({ updates }: { updates: HeroUpdate[] }) {
  const [index, setIndex] = useState(0);
  const [held, setHeld] = useState(false);
  const [width, setWidth] = useState<number | null>(null);
  const reduced = usePrefersReducedMotion();
  const now = useNow();
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const count = updates.length;
  const rotates = count > 1 && !reduced;

  useEffect(() => {
    if (!rotates || held) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % count), ROTATE_MS);
    return () => window.clearInterval(id);
  }, [rotates, held, count]);

  // The window animates to the active message's width.
  useLayoutEffect(() => {
    const el = itemRefs.current[index];
    if (el) setWidth(el.offsetWidth);
  }, [index, now]);

  const current = updates[index];
  if (!current) return null;

  return (
    <div
      className="inline-flex h-[30px] max-w-full items-center gap-2 rounded-full bg-surface pl-2.5 pr-3 font-mono text-[12px] text-fg-body shadow-[0_0_0_1px_rgb(0_0_0/0.08),0_1px_2px_rgb(0_0_0/0.04)]"
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setHeld(false);
      }}
    >
      <span
        aria-hidden
        className="size-1.5 shrink-0 rounded-full transition-colors duration-300"
        style={{
          background: current.color,
          boxShadow: `0 0 0 3px color-mix(in srgb, ${current.color} 15%, transparent)`,
        }}
      />
      <ul
        className="relative m-0 h-[30px] min-w-0 list-none overflow-hidden p-0 transition-[width] duration-[450ms] ease-[cubic-bezier(.2,.7,.2,1)]"
        style={width === null ? undefined : { width }}
      >
        {updates.map((update, i) => {
          const active = i === index;
          const previous = i === (index - 1 + count) % count && count > 1;
          const position = active ? "translate-y-0 opacity-100" : previous ? "-translate-y-full opacity-0" : "translate-y-full opacity-0";
          return (
            <li
              key={update.href}
              aria-hidden={!active}
              className={`${width === null && active ? "relative" : "absolute"} left-0 top-0 transition-[transform,opacity] duration-500 ease-[cubic-bezier(.2,.7,.2,1)] ${position}`}
            >
              <a
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                href={update.href}
                tabIndex={active ? 0 : -1}
                {...(update.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="block whitespace-nowrap leading-[30px] hover:text-fg"
              >
                {message(update, now)}
                {update.external && <span className="sr-only"> (opens in a new tab)</span>}
              </a>
            </li>
          );
        })}
      </ul>
      {count > 1 && (
        <span aria-hidden className="shrink-0 text-[10.5px] text-fg-subtle">
          {index + 1}/{count}
        </span>
      )}
    </div>
  );
}

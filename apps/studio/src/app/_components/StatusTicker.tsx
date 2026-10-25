"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import { formatDay, formatRelative } from "@/lib/format";
import type { HeroUpdate } from "@/lib/hero";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

const ROTATE_MS = 4200;
const DURATION_MS = 480;

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

type Props = {
  updates: HeroUpdate[];
};

/**
 * Status pill cycling through live updates with a silky slide vertical roll and gradient edge masking.
 * Pauses on hover and focus.
 */
export function StatusTicker({ updates }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [held, setHeld] = useState(false);
  const [width, setWidth] = useState<number | null>(null);

  const reduced = usePrefersReducedMotion();
  const now = useNow();

  const count = updates.length;
  const rotates = count > 1 && !reduced;

  const measureRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const widthsRef = useRef<number[]>([]);
  const exitTimeoutRef = useRef<number | null>(null);

  // Measure all item widths whenever updates or now changes
  useLayoutEffect(() => {
    widthsRef.current = measureRefs.current.map((el) => (el ? Math.ceil(el.getBoundingClientRect().width) : 0));
    const currentMeasured = widthsRef.current[currentIndex];
    if (currentMeasured) {
      setWidth(currentMeasured);
    }
  }, [updates, now, currentIndex]);

  const advanceTo = useCallback(
    (nextIndex: number) => {
      if (nextIndex === currentIndex) return;

      if (exitTimeoutRef.current) {
        window.clearTimeout(exitTimeoutRef.current);
      }

      setPrevIndex(currentIndex);
      setCurrentIndex(nextIndex);

      const targetWidth = widthsRef.current[nextIndex];
      if (targetWidth) {
        setWidth(targetWidth);
      }

      exitTimeoutRef.current = window.setTimeout(() => {
        setPrevIndex(null);
        exitTimeoutRef.current = null;
      }, DURATION_MS);
    },
    [currentIndex],
  );

  useEffect(() => {
    if (!rotates || held) return;
    const intervalId = window.setInterval(() => {
      advanceTo((currentIndex + 1) % count);
    }, ROTATE_MS);
    return () => window.clearInterval(intervalId);
  }, [rotates, held, count, currentIndex, advanceTo]);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (exitTimeoutRef.current) window.clearTimeout(exitTimeoutRef.current);
    };
  }, []);

  const current = updates[currentIndex];
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
      {/* Live status dot with synchronized glow transition */}
      <span
        aria-hidden="true"
        className="size-1.5 shrink-0 rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          backgroundColor: current.color,
          boxShadow: `0 0 0 3px color-mix(in srgb, ${current.color} 18%, transparent)`,
        }}
      />

      {/* Synchronized viewport with edge masking and zero-lag width transition */}
      <ul
        className="ticker-mask-y relative m-0 h-[30px] min-w-0 list-none overflow-hidden p-0 transition-[width] duration-[480ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={width === null ? undefined : { width }}
      >
        {/* Exiting item: only mounted during transition, guaranteed forward motion */}
        {prevIndex !== null && updates[prevIndex] && (
          <li
            key={`prev-${prevIndex}-${updates[prevIndex].href}`}
            aria-hidden="true"
            className="ticker-out-item ticker-slide-out pointer-events-none absolute left-0 top-0 select-none leading-[30px]"
          >
            <span className="block whitespace-nowrap leading-[30px] text-fg-body">
              {message(updates[prevIndex], now)}
            </span>
          </li>
        )}

        {/* Active item: entering or settled */}
        <li
          key={`curr-${currentIndex}-${current.href}`}
          className={`left-0 top-0 leading-[30px] ${
            prevIndex !== null ? "ticker-slide-in absolute" : width === null ? "relative" : "absolute"
          }`}
        >
          <a
            href={current.href}
            tabIndex={0}
            onFocus={() => advanceTo(currentIndex)}
            {...(current.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="block whitespace-nowrap leading-[30px] hover:text-fg"
          >
            {message(current, now)}
            {current.external && <span className="sr-only"> (opens in a new tab)</span>}
          </a>
        </li>
      </ul>

      {/* Hidden measurement elements for zero-lag width synchronization */}
      <div
        aria-hidden="true"
        className="pointer-events-none invisible absolute left-0 top-0 -z-50 whitespace-nowrap font-mono text-[12px] leading-[30px]"
      >
        {updates.map((update, i) => (
          <span
            key={`measure-${update.href}`}
            ref={(el) => {
              measureRefs.current[i] = el;
            }}
            className="inline-block whitespace-nowrap leading-[30px]"
          >
            {message(update, now)}
          </span>
        ))}
      </div>

      {/* Clean counter */}
      {count > 1 && (
        <span aria-hidden="true" className="shrink-0 font-mono text-[10.5px] tabular-nums text-fg-subtle">
          {currentIndex + 1}/{count}
        </span>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

import { formatLocalTime } from "@/lib/format";

type Props = { timeZone: string; label: string };

/**
 * Live wall-clock time. The server and the first client render show only
 * `label`, so hydration matches; the time appears after mount.
 */
export function LocalTime({ timeZone, label }: Props) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  return <time dateTime={now?.toISOString()}>{now ? formatLocalTime(now, timeZone, label) : label}</time>;
}

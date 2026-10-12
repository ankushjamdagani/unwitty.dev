import { describe, expect, it } from "vitest";

import { formatLocalTime, formatRelative } from "./format";

describe("formatLocalTime", () => {
  it("formats 24h time in the given zone with a label", () => {
    expect(formatLocalTime(new Date("2026-10-12T10:12:00Z"), "Asia/Kolkata", "IST")).toBe("15:42 IST");
  });

  it("pads single-digit hours", () => {
    expect(formatLocalTime(new Date("2026-10-12T02:35:00Z"), "Asia/Kolkata", "IST")).toBe("08:05 IST");
  });
});

describe("formatRelative", () => {
  const now = new Date("2026-10-12T12:00:00Z");
  const ago = (seconds: number) => new Date(now.getTime() - seconds * 1000).toISOString();

  it.each([
    [30, "just now"],
    [5 * 60, "5 minutes ago"],
    [2 * 3600, "2 hours ago"],
    [86_400, "yesterday"],
    [3 * 86_400, "3 days ago"],
    [14 * 86_400, "2 weeks ago"],
  ])("%i seconds ago → %s", (seconds, expected) => {
    expect(formatRelative(ago(seconds), now)).toBe(expected);
  });
});

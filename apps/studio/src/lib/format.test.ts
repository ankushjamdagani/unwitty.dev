import { describe, expect, it } from "vitest";

import { formatLocalTime } from "./format";

describe("formatLocalTime", () => {
  it("formats 24h time in the given zone with a label", () => {
    expect(formatLocalTime(new Date("2026-10-12T10:12:00Z"), "Asia/Kolkata", "IST")).toBe("15:42 IST");
  });

  it("pads single-digit hours", () => {
    expect(formatLocalTime(new Date("2026-10-12T02:35:00Z"), "Asia/Kolkata", "IST")).toBe("08:05 IST");
  });
});

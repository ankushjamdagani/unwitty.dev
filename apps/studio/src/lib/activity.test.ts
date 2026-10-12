import { describe, expect, it } from "vitest";

import { buildActivityGrid, levelFor } from "./activity";

describe("buildActivityGrid", () => {
  // Wednesday
  const end = new Date("2026-10-14T12:00:00Z");

  it("ends on the week containing `end`, Sunday first", () => {
    const grid = buildActivityGrid({}, end, 2);
    expect(grid.weeks).toHaveLength(2);
    expect(grid.weeks[1]?.[0]?.date).toBe("2026-10-11");
    expect(grid.weeks[1]?.[3]).toMatchObject({ date: "2026-10-14", inRange: true });
    expect(grid.weeks[1]?.[4]).toMatchObject({ date: "2026-10-15", inRange: false });
    expect(grid.weeks[0]?.[0]?.date).toBe("2026-10-04");
  });

  it("sums products, picks the lead and counts streaks", () => {
    const grid = buildActivityGrid(
      {
        a: { "2026-10-12": 1, "2026-10-13": 2, "2026-10-15": 9 },
        b: { "2026-10-13": 5, "2026-10-10": 1 },
      },
      end,
      2,
    );
    const tue = grid.weeks[1]?.[2];
    expect(tue).toMatchObject({ total: 7, lead: "b", level: 3, bySlug: { a: 2, b: 5 } });
    // 2026-10-15 is after `end` and ignored.
    expect(grid.total).toBe(9);
    expect(grid.activeDays).toBe(3);
    expect(grid.longestStreak).toBe(2);
  });

  it("maps totals to levels", () => {
    expect([0, 1, 3, 6, 10].map(levelFor)).toEqual([0, 1, 2, 3, 4]);
  });
});

import { describe, expect, it } from "vitest";

import {
  buildActivityGrid,
  filterGrid,
  filterReleases,
  firstLine,
  levelFor,
  releasesByDay,
  remainder,
  toDayCounts,
  type CommitDay,
} from "./activity";

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

describe("remainder", () => {
  it("keeps only what the known sources do not explain", () => {
    expect(
      remainder({ "2026-10-01": 5, "2026-10-02": 2, "2026-10-03": 1 }, [
        { "2026-10-01": 3 },
        { "2026-10-02": 4, "2026-10-01": 1 },
      ]),
    ).toEqual({ "2026-10-01": 1, "2026-10-03": 1 });
  });
});

describe("filterGrid", () => {
  it("drops hidden sources and recomputes leads and totals", () => {
    const grid = buildActivityGrid(
      { a: { "2026-10-12": 1, "2026-10-13": 2 }, b: { "2026-10-13": 5, "2026-10-14": 1 } },
      new Date("2026-10-14T12:00:00Z"),
      1,
    );
    const onlyA = filterGrid(grid, (slug) => slug === "a");
    expect(onlyA.weeks[0]?.[2]).toMatchObject({ total: 2, lead: "a", level: 1, bySlug: { a: 2 } });
    expect(onlyA.weeks[0]?.[3]).toMatchObject({ total: 0, lead: null, level: 0 });
    expect([onlyA.total, onlyA.activeDays, onlyA.longestStreak]).toEqual([3, 2, 2]);
  });
});

describe("commit helpers", () => {
  it("keeps the first line of a message", () => {
    expect(firstLine("feat: draw edges\n\nLonger body")).toBe("feat: draw edges");
  });

  it("counts commits per day", () => {
    const c = (day: string): CommitDay => ({ day, at: `${day}T00:00:00Z`, message: "" });
    expect(toDayCounts([c("2026-10-01"), c("2026-10-01"), c("2026-10-02")])).toEqual({
      "2026-10-01": 2,
      "2026-10-02": 1,
    });
  });

  it("maps each dated version to its day once", () => {
    expect(
      releasesByDay([
        {
          slug: "a",
          name: "Alpha",
          log: [
            { version: "1.0.0", date: "2026-10-01" },
            { version: "1.0.0", date: "2026-10-01" },
            { version: "Unreleased", date: null },
          ],
        },
      ]),
    ).toEqual({ "2026-10-01": [{ slug: "a", name: "Alpha", version: "1.0.0" }] });
  });
});

describe("grid extras", () => {
  const end = new Date("2026-10-14T12:00:00Z");
  const at = (time: string, message: string): CommitDay => ({ day: "2026-10-13", at: `2026-10-13T${time}:00Z`, message });
  const build = () =>
    buildActivityGrid({ a: { "2026-10-13": 4 }, b: { "2026-10-13": 1 } }, end, 1, {
      messagesBySlug: {
        a: [at("09:00", "a1"), at("12:00", "a2"), at("10:00", "a3"), at("08:00", "a4")],
        b: [at("11:00", "b1")],
      },
      releasesByDay: { "2026-10-13": [{ slug: "a", name: "Alpha", version: "1.0.0" }] },
    });

  it("attaches messages newest first, at most 3 per source, and releases", () => {
    const grid = build();
    const tue = grid.weeks[0]?.[2];
    expect(tue?.messages.map((m) => m.text)).toEqual(["a2", "b1", "a3", "a1"]);
    expect(tue?.releases).toEqual([{ slug: "a", name: "Alpha", version: "1.0.0" }]);
    expect(grid.releases).toBe(1);
  });

  it("filterGrid drops hidden sources' messages and releases", () => {
    const onlyB = filterGrid(build(), (slug) => slug === "b");
    expect(onlyB.weeks[0]?.[2]?.messages.map((m) => m.text)).toEqual(["b1"]);
    expect(onlyB.weeks[0]?.[2]?.releases).toEqual([]);
    expect(onlyB.releases).toBe(0);
  });

  it("filterReleases keeps only cells with releases and empties other cells", () => {
    const grid = build();
    const releasesOnly = filterReleases(grid);
    expect(releasesOnly.weeks[0]?.[2]?.releases).toEqual([{ slug: "a", name: "Alpha", version: "1.0.0" }]);
    expect(releasesOnly.weeks[0]?.[2]?.total).toBe(5);
    expect(releasesOnly.releases).toBe(1);
    expect(releasesOnly.weeks[0]?.[1]?.total).toBe(0);
    expect(releasesOnly.weeks[0]?.[1]?.releases).toEqual([]);
  });
});

describe("currentStreak", () => {
  // Wednesday; the single week is Sun 11 → Wed 14 in range.
  const end = new Date("2026-10-14T12:00:00Z");
  const streak = (counts: Record<string, number>) => buildActivityGrid({ a: counts }, end, 1).currentStreak;

  it("counts back from the last day", () => {
    expect(streak({ "2026-10-13": 1, "2026-10-14": 1 })).toBe(2);
  });

  it("does not break on an empty last day", () => {
    expect(streak({ "2026-10-12": 1, "2026-10-13": 1 })).toBe(2);
  });

  it("stops at a gap", () => {
    expect(streak({ "2026-10-11": 1, "2026-10-13": 1 })).toBe(1);
  });

  it("is zero when the last two days are empty", () => {
    expect(streak({ "2026-10-11": 1 })).toBe(0);
  });
});

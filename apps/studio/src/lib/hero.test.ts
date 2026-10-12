import { describe, expect, it } from "vitest";

import { buildHeroUpdates, COMMIT_COLOR, splitHeadline } from "./hero";

describe("buildHeroUpdates", () => {
  const releases = [
    {
      slug: "a",
      name: "Alpha",
      color: "#111",
      version: "1.0.0",
      date: "2026-09-01",
    },
    {
      slug: "b",
      name: "Beta",
      color: "#222",
      version: "0.2.0",
      date: "2026-10-01",
    },
    { slug: "c", name: "Gamma", color: "#333", version: null, date: null },
  ];

  it("lists dated releases newest first, then the newest commit", () => {
    const updates = buildHeroUpdates(releases, [
      { repoName: "alpha", url: "https://x/1", date: "2026-10-10T08:00:00Z" },
      null,
      { repoName: "beta", url: "https://x/2", date: "2026-10-11T08:00:00Z" },
    ]);
    expect(updates.map((u) => u.text)).toEqual([
      "Beta v0.2.0 shipped",
      "Alpha v1.0.0 shipped",
      "Last commit",
    ]);
    expect(updates[0]).toMatchObject({
      kind: "release",
      href: "#projects/b",
      color: "#222",
      external: false,
      suffix: "",
    });
    expect(updates[2]).toMatchObject({
      kind: "commit",
      suffix: " · beta",
      href: "https://x/2",
      at: "2026-10-11T08:00:00Z",
      color: COMMIT_COLOR,
      external: true,
    });
  });

  it("returns only releases when no commit is known", () => {
    expect(buildHeroUpdates(releases, [null]).map((u) => u.kind)).toEqual([
      "release",
      "release",
    ]);
  });

  it("returns nothing when there is no data", () => {
    expect(buildHeroUpdates([], [])).toEqual([]);
  });
});

describe("splitHeadline", () => {
  it("splits words and marks the emphasis", () => {
    expect(splitHeadline("I make tools for thinking.", "thinking.")).toEqual([
      { text: "I", emphasis: false },
      { text: "make", emphasis: false },
      { text: "tools", emphasis: false },
      { text: "for", emphasis: false },
      { text: "thinking.", emphasis: true },
    ]);
  });

  it("keeps words after the emphasis", () => {
    expect(
      splitHeadline("tools for thinking, daily", "thinking,").map(
        (w) => w.text,
      ),
    ).toEqual(["tools", "for", "thinking,", "daily"]);
  });

  it("works without an emphasis", () => {
    expect(splitHeadline("Hello world").every((w) => !w.emphasis)).toBe(true);
  });
});

# Studio activity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Activity heatmap tell a richer story with:
- Stat tiles, including the current streak.
- Ring markers on release days.
- A day card on hover, focus or tap, showing a breakdown, releases and commit messages.
- A one-time week-by-week draw-in.

**Architecture:**
- The grid model in `lib/activity.ts` carries commit messages and releases on each cell, plus `currentStreak` and `releases` totals. All of it is pure and unit-tested.
- `github.ts` keeps each commit's timestamp and first line.
- The UI splits into `StatTiles`, `HeatmapGrid` and `DayCard`, composed by `Activity`, which keeps the filter state and the `aria-live` readout.
- `useDrawIn` runs the entrance once, after hydration, and only if the grid starts off-screen.

**Tech Stack:** Next.js 15, React 19, Tailwind CSS 3, TypeScript, Vitest.

**Spec:** `docs/superpowers/specs/2026-10-12-studio-activity-design.md`

**Order:** Plan 4 of 5. Requires plan 3, whose `page.tsx` already calls `getHeroUpdates`.

## Global Constraints

- Only change `apps/studio`. Do not touch `apps/web`.
- Light theme only. Named exports only. `@/` maps to `apps/studio/src/`.
- ESLint runs with `--max-warnings 0`. Use `pnpm` only.
- Keep the legend filter (`aria-pressed` toggles plus "Show all"), the roving-tabindex grid with arrow keys, and the `aria-live` readout from #41.
- Release ring: `box-shadow: 0 0 0 1.5px rgb(var(--surface)), 0 0 0 3px <product accent>`. The gap colour is `--surface`, because the heatmap sits on the white card.
- Draw-in: 250ms per cell, `--week × 18ms` stagger, triggered at a threshold of 0.25. Count-up: 900ms, ease-out cubic. Day card fade: 150ms.
- Commit messages: first line only, up to 3 shown per day.
- Every commit message ends with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## File Structure

| File | Responsibility |
|---|---|
| `src/lib/activity.ts` | Types `CommitDay`, `CellMessage`, `DayRelease`, `GridExtras`; `firstLine`, `toDayCounts`, `releasesByDay`; grid with messages, releases and `currentStreak` |
| `src/lib/activity.test.ts` | New tests for the above |
| `src/lib/github.ts` | `fetchCommitDays` returns `CommitDay[]` |
| `src/lib/data.ts` | `getActivity(products, now?)`; `ActivitySwatch.bg` |
| `src/app/page.tsx` | New call order; drops the `releases` prop |
| `src/app/_styles/globals.css` | `.heat-cell` draw-in rules |
| `src/app/_components/Activity/useDrawIn.ts` (new) | `"idle" \| "armed" \| "played"` phase |
| `src/app/_components/Activity/StatTiles.tsx` (new) | Four tiles with count-up |
| `src/app/_components/Activity/HeatmapGrid.tsx` (new) | Cells, month labels, rings, roving focus |
| `src/app/_components/Activity/DayCard.tsx` (new) | Floating day card |
| `src/app/_components/Activity/Activity.tsx` | Composition, filter, readout, legend |

All paths are relative to `apps/studio/`.

---

### Task 1: Grid model with messages, releases and current streak (TDD)

**Files:**
- Modify: `src/lib/activity.ts` (full replacement)
- Modify: `src/lib/activity.test.ts`

**Interfaces:**
- Produces:

```ts
export type CommitDay = { day: string; at: string; message: string };
export type CellMessage = { slug: string; at: string; text: string };
export type DayRelease = { slug: string; name: string; version: string };
export type ActivityCell = { date: string; total: number; bySlug: Record<string, number>; lead: string | null; level: 0 | 1 | 2 | 3 | 4; inRange: boolean; messages: CellMessage[]; releases: DayRelease[] };
export type ActivityGrid = { weeks: ActivityCell[][]; total: number; activeDays: number; longestStreak: number; currentStreak: number; releases: number };
export type GridExtras = { messagesBySlug?: Record<string, CommitDay[]>; releasesByDay?: Record<string, DayRelease[]> };
export const MAX_MESSAGES = 3;
export function firstLine(message: string): string;
export function toDayCounts(commits: CommitDay[]): DayCounts;
export function releasesByDay(products: { slug: string; name: string; log: { version: string; date: string | null }[] }[]): Record<string, DayRelease[]>;
export function buildActivityGrid(countsBySlug: Record<string, DayCounts>, end: Date, weeks?: number, extras?: GridExtras): ActivityGrid;
export function filterGrid(grid: ActivityGrid, visible: (slug: string) => boolean): ActivityGrid;
```

`remainder`, `isoDay` and `levelFor` are unchanged.

- [ ] **Step 1: Write the failing tests.** In `src/lib/activity.test.ts`, change the import to:

```ts
import {
  buildActivityGrid,
  filterGrid,
  firstLine,
  levelFor,
  releasesByDay,
  remainder,
  toDayCounts,
  type CommitDay,
} from "./activity";
```

and append:

```ts

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
```

- [ ] **Step 2: Run the tests and confirm they fail.** Run `pnpm --filter @app/studio test -- activity`. Expected: FAIL, because `firstLine`, `toDayCounts` and `releasesByDay` are not exported.

- [ ] **Step 3: Implement.** Replace `src/lib/activity.ts` with:

```ts
export type DayCounts = Record<string, number>;

/** One commit: UTC day, full timestamp and first line of the message. */
export type CommitDay = { day: string; at: string; message: string };
export type CellMessage = { slug: string; at: string; text: string };
export type DayRelease = { slug: string; name: string; version: string };

export type ActivityCell = {
  date: string;
  total: number;
  /** Per source slug, only sources with contributions that day. */
  bySlug: Record<string, number>;
  /** Source with the most contributions that day. */
  lead: string | null;
  /** 0 (none) to 4 (busiest). */
  level: 0 | 1 | 2 | 3 | 4;
  /** False for padding days after `end`. */
  inRange: boolean;
  /** Newest first; at most MAX_MESSAGES per source. */
  messages: CellMessage[];
  releases: DayRelease[];
};

export type ActivityGrid = {
  weeks: ActivityCell[][];
  total: number;
  activeDays: number;
  longestStreak: number;
  /** Consecutive active days ending at the last day (or the day before, if the last day is empty). */
  currentStreak: number;
  releases: number;
};

export type GridExtras = {
  messagesBySlug?: Record<string, CommitDay[]>;
  releasesByDay?: Record<string, DayRelease[]>;
};

export const MAX_MESSAGES = 3;

const DAY = 86_400_000;

export function firstLine(message: string): string {
  return (message.split("\n", 1)[0] ?? "").trim();
}

export function toDayCounts(commits: CommitDay[]): DayCounts {
  const counts: DayCounts = {};
  for (const commit of commits) counts[commit.day] = (counts[commit.day] ?? 0) + 1;
  return counts;
}

type ReleaseSource = { slug: string; name: string; log: { version: string; date: string | null }[] };

/** Each product's dated versions, keyed by release day. */
export function releasesByDay(products: ReleaseSource[]): Record<string, DayRelease[]> {
  const byDay: Record<string, DayRelease[]> = {};
  for (const product of products) {
    const seen = new Set<string>();
    for (const entry of product.log) {
      if (!entry.date || seen.has(entry.version)) continue;
      seen.add(entry.version);
      (byDay[entry.date] ??= []).push({ slug: product.slug, name: product.name, version: entry.version });
    }
  }
  return byDay;
}

/**
 * Whatever `total` has beyond the known sources, per day. Used to show the
 * rest of the GitHub profile without double-counting the tracked repos.
 */
export function remainder(total: DayCounts, known: DayCounts[]): DayCounts {
  const rest: DayCounts = {};
  for (const [date, n] of Object.entries(total)) {
    const counted = known.reduce((sum, counts) => sum + (counts[date] ?? 0), 0);
    if (n > counted) rest[date] = n - counted;
  }
  return rest;
}

export function isoDay(time: number): string {
  return new Date(time).toISOString().slice(0, 10);
}

export function levelFor(total: number): ActivityCell["level"] {
  if (total <= 0) return 0;
  if (total < 3) return 1;
  if (total < 6) return 2;
  if (total < 10) return 3;
  return 4;
}

type MessageIndex = Record<string, Record<string, CommitDay[]>>;

function indexMessages(messagesBySlug: Record<string, CommitDay[]>): MessageIndex {
  const index: MessageIndex = {};
  for (const [slug, commits] of Object.entries(messagesBySlug)) {
    const days: Record<string, CommitDay[]> = (index[slug] = {});
    for (const commit of commits) (days[commit.day] ??= []).push(commit);
  }
  return index;
}

function cellMessages(index: MessageIndex, date: string): CellMessage[] {
  const newestFirst = (a: { at: string }, b: { at: string }) => b.at.localeCompare(a.at);
  return Object.entries(index)
    .flatMap(([slug, days]) =>
      [...(days[date] ?? [])]
        .sort(newestFirst)
        .slice(0, MAX_MESSAGES)
        .map((c) => ({ slug, at: c.at, text: c.message })),
    )
    .sort(newestFirst);
}

/**
 * Builds a GitHub-style grid: `weeks` columns (Sunday → Saturday) ending in
 * the week that contains `end`. Days after `end` are padding.
 */
export function buildActivityGrid(
  countsBySlug: Record<string, DayCounts>,
  end: Date,
  weeks = 53,
  extras: GridExtras = {},
): ActivityGrid {
  const endDay = Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate());
  const start = endDay - (end.getUTCDay() + (weeks - 1) * 7) * DAY;
  const messages = indexMessages(extras.messagesBySlug ?? {});
  const releases = extras.releasesByDay ?? {};

  const grid: ActivityCell[][] = [];
  for (let w = 0; w < weeks; w++) {
    const column: ActivityCell[] = [];
    for (let d = 0; d < 7; d++) {
      const time = start + (w * 7 + d) * DAY;
      const date = isoDay(time);
      const inRange = time <= endDay;
      const bySlug: Record<string, number> = {};
      let total = 0;
      let lead: string | null = null;

      if (inRange) {
        for (const [slug, counts] of Object.entries(countsBySlug)) {
          const n = counts[date] ?? 0;
          if (!n) continue;
          bySlug[slug] = n;
          total += n;
          if (!lead || n > (bySlug[lead] ?? 0)) lead = slug;
        }
      }

      column.push({
        date,
        total,
        bySlug,
        lead,
        level: levelFor(total),
        inRange,
        messages: inRange ? cellMessages(messages, date) : [],
        releases: inRange ? (releases[date] ?? []) : [],
      });
    }
    grid.push(column);
  }

  return summarize(grid);
}

/** Totals, streaks and release count over the in-range days, oldest first. */
function summarize(weeks: ActivityCell[][]): ActivityGrid {
  const cells = weeks.flat().filter((cell) => cell.inRange);
  let total = 0;
  let activeDays = 0;
  let streak = 0;
  let longestStreak = 0;
  let releases = 0;

  for (const cell of cells) {
    total += cell.total;
    releases += cell.releases.length;
    if (cell.total) {
      activeDays++;
      streak++;
      longestStreak = Math.max(longestStreak, streak);
    } else {
      streak = 0;
    }
  }

  let i = cells.length - 1;
  if (i >= 0 && !cells[i]?.total) i--;
  let currentStreak = 0;
  while (i >= 0 && cells[i]?.total) {
    currentStreak++;
    i--;
  }

  return { weeks, total, activeDays, longestStreak, currentStreak, releases };
}

/** The same grid counting only sources for which `visible(slug)` is true. */
export function filterGrid(grid: ActivityGrid, visible: (slug: string) => boolean): ActivityGrid {
  const weeks = grid.weeks.map((week) =>
    week.map((cell): ActivityCell => {
      const bySlug: Record<string, number> = {};
      let total = 0;
      let lead: string | null = null;
      for (const [slug, n] of Object.entries(cell.bySlug)) {
        if (!visible(slug)) continue;
        bySlug[slug] = n;
        total += n;
        if (!lead || n > (bySlug[lead] ?? 0)) lead = slug;
      }
      return {
        ...cell,
        bySlug,
        total,
        lead,
        level: levelFor(total),
        messages: cell.messages.filter((m) => visible(m.slug)),
        releases: cell.releases.filter((r) => visible(r.slug)),
      };
    }),
  );
  return summarize(weeks);
}
```

- [ ] **Step 4: Run the tests and confirm they pass.** Run `pnpm --filter @app/studio test`. Expected: all tests pass, old and new.

- [ ] **Step 5: Commit**

```bash
git add apps/studio/src/lib/activity.ts apps/studio/src/lib/activity.test.ts
git commit -m "feat(studio): activity grid carries messages, releases, current streak

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Data plumbing

**Files:**
- Modify: `src/lib/github.ts` (the `CommitItem` type and `fetchCommitDays`)
- Modify: `src/lib/data.ts` (`ActivitySwatch`, `activitySwatches`, `safely`, `getActivity`)
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `CommitDay`, `firstLine`, `toDayCounts`, `releasesByDay` and the `GridExtras` argument of `buildActivityGrid` (Task 1).
- Produces:
  - `fetchCommitDays(repo, since, author?): Promise<CommitDay[]>`
  - `getActivity(list: ProductWithLog[], now?: Date): Promise<ActivityGrid>`
  - `ActivitySwatch = Pick<ActivitySource, "slug" | "name" | "color"> & { bg?: string }`

- [ ] **Step 1: Change `fetchCommitDays`.** In `src/lib/github.ts`, change the activity import to `import { firstLine, type CommitDay, type DayCounts } from "./activity";`. Then replace the `CommitItem` type and the `fetchCommitDays` function with:

```ts
type CommitItem = { commit: { message: string; author: { date: string } | null } };

/** Commits since `since`, newest first, optionally only by `author`. */
export async function fetchCommitDays(
  repo: Product["repo"],
  since: Date,
  author?: string,
): Promise<CommitDay[]> {
  const commits: CommitDay[] = [];
  const branch =
    (repo.branch ? `&sha=${encodeURIComponent(repo.branch)}` : "") +
    (author ? `&author=${encodeURIComponent(author)}` : "");

  for (let page = 1; page <= MAX_PAGES; page++) {
    const res = await get(
      `${API}/repos/${repo.owner}/${repo.name}/commits?since=${since.toISOString()}&per_page=100&page=${page}${branch}`,
    );
    const items = (await res.json()) as CommitItem[];
    for (const item of items) {
      const at = item.commit.author?.date;
      if (at) commits.push({ day: at.slice(0, 10), at, message: firstLine(item.commit.message) });
    }
    if (items.length < 100) break;
  }

  return commits;
}
```

- [ ] **Step 2: Update `data.ts`.**
  - Change the activity import to:

```ts
import {
  buildActivityGrid,
  releasesByDay,
  remainder,
  toDayCounts,
  type ActivityGrid,
  type CommitDay,
  type DayCounts,
} from "./activity";
```

  - Replace `ActivitySwatch` and `activitySwatches` with:

```ts
export type ActivitySwatch = Pick<ActivitySource, "slug" | "name" | "color"> & {
  /** Product stage background, used for release pills. */
  bg?: string;
};

/** Graph sources in legend order: products, extra repos, then everything else. */
export function activitySwatches(): ActivitySwatch[] {
  return [
    ...products.map(({ slug, name, brand }) => ({ slug, name, color: brand.accent, bg: brand.bg })),
    ...extraSources.map(({ slug, name, color }) => ({ slug, name, color })),
    otherSource,
  ];
}
```

  - Replace `safely` and `getActivity` with:

```ts
async function safely<T>(label: string, load: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await load();
  } catch (error) {
    console.warn(`[studio] activity unavailable for ${label}:`, error);
    return fallback;
  }
}

export async function getActivity(list: ProductWithLog[], now = new Date()): Promise<ActivityGrid> {
  const since = new Date(now.getTime() - 371 * 86_400_000);
  const repos = [...products, ...extraSources];

  const [tracked, calendar] = await Promise.all([
    Promise.all(
      repos.map(async (s): Promise<[string, CommitDay[]]> => [
        s.slug,
        await safely(s.slug, () => fetchCommitDays(s.repo, since, profile.githubLogin), []),
      ]),
    ),
    safely(otherSource.slug, () => fetchContributionDays(profile.githubLogin, since, now), {} as DayCounts),
  ]);

  const counts: Record<string, DayCounts> = Object.fromEntries(
    tracked.map(([slug, commits]) => [slug, toDayCounts(commits)]),
  );
  counts[otherSource.slug] = remainder(calendar, Object.values(counts));

  return buildActivityGrid(counts, now, 53, {
    messagesBySlug: Object.fromEntries(tracked),
    releasesByDay: releasesByDay(list),
  });
}
```

- [ ] **Step 3: Update `page.tsx`.** Replace the body of `Home` with:

```tsx
export default async function Home() {
  const products = await getProducts();
  const [activity, updates] = await Promise.all([getActivity(products), getHeroUpdates(products)]);

  return (
    <>
      <Hero updates={updates} products={products} />
      <ProjectsReel products={products} />
      <Activity grid={activity} sources={activitySwatches()} />
      <About />
    </>
  );
}
```

  Typecheck will fail until Task 4 removes the `releases` prop from `Activity`. That is expected. Do not commit until then.

- [ ] **Step 4: Run the tests.** Run `pnpm --filter @app/studio test`. Expected: all tests pass. Vitest does not typecheck the components.

---

### Task 3: Draw-in hook, stat tiles, heatmap grid and day card

**Files:**
- Modify: `src/app/_styles/globals.css`
- Create: `src/app/_components/Activity/useDrawIn.ts`
- Create: `src/app/_components/Activity/StatTiles.tsx`
- Create: `src/app/_components/Activity/HeatmapGrid.tsx`
- Create: `src/app/_components/Activity/DayCard.tsx`

**Interfaces:**
- Consumes: the `ActivityCell` and `ActivityGrid` types and `MAX_MESSAGES` (Task 1), and `ActivitySwatch` (Task 2).
- Produces:
  - `useDrawIn(ref): "idle" | "armed" | "played"`
  - `StatTiles({ grid, countUp })`
  - `HeatmapGrid({ weeks, colors, activeDate, armed, gridRef, describe, onActive })`
  - `DayCard({ cell, anchor, containerRef, sources })`

- [ ] **Step 1: Add the CSS.** In `globals.css`, inside `@layer components`, add:

```css
  /* Activity draw-in: armed cells start hidden, then fill week by week. */
  .heat-cell {
    transition:
      opacity 250ms ease-out,
      transform 250ms ease-out;
    transition-delay: calc(var(--week, 0) * 18ms);
  }
  [data-armed] .heat-cell {
    opacity: 0;
    transform: scale(0.4);
  }
```

- [ ] **Step 2: Create `useDrawIn.ts`.**

```ts
import { useEffect, useState, type RefObject } from "react";

export type DrawInPhase = "idle" | "armed" | "played";

/**
 * One-time entrance. "armed" (hide) only when JS runs, motion is allowed and
 * the element starts below the fold; "played" once it scrolls into view.
 * The server HTML and the no-JS page always show the final state.
 */
export function useDrawIn(ref: RefObject<HTMLElement | null>, threshold = 0.25): DrawInPhase {
  const [phase, setPhase] = useState<DrawInPhase>("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * (1 - threshold)) return;

    setPhase("armed");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setPhase("played");
        observer.disconnect();
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, threshold]);

  return phase;
}
```

- [ ] **Step 3: Create `StatTiles.tsx`.**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";

import type { ActivityGrid } from "@/lib/activity";

const DURATION_MS = 900;

/** Counts up from 0 once, the first time `play` turns true. */
function CountUp({ value, play }: { value: number; play: boolean }) {
  const [shown, setShown] = useState<number | null>(null);
  const done = useRef(false);

  useEffect(() => {
    if (!play || done.current) return;
    done.current = true;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / DURATION_MS);
      setShown(p < 1 ? Math.round(value * (1 - (1 - p) ** 3)) : null);
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      setShown(null);
    };
  }, [play, value]);

  return <>{(shown ?? value).toLocaleString("en-US")}</>;
}

type Tile = { label: string; value: number; unit?: [string, string] };

export function StatTiles({ grid, countUp }: { grid: ActivityGrid; countUp: boolean }) {
  const tiles: Tile[] = [
    { label: "Contributions", value: grid.total },
    { label: "Releases", value: grid.releases },
    { label: "Longest streak", value: grid.longestStreak, unit: ["day", "days"] },
    { label: "Current streak", value: grid.currentStreak, unit: ["day", "days"] },
  ];

  return (
    <dl className="m-0 mb-6 grid grid-cols-2 border-t border-line sm:grid-cols-4">
      {tiles.map((tile) => (
        <div key={tile.label} className="py-3 pr-3.5">
          <dt className="font-mono text-[10.5px] uppercase tracking-[0.06em] text-fg-subtle">{tile.label}</dt>
          <dd className="m-0 mt-0.5 text-[30px] font-medium tabular-nums tracking-[-0.04em]">
            <CountUp value={tile.value} play={countUp} />
            {tile.unit && (
              <span className="ml-1 text-[13px] font-normal tracking-normal text-fg-subtle">
                {tile.value === 1 ? tile.unit[0] : tile.unit[1]}
              </span>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
```

- [ ] **Step 4: Create `HeatmapGrid.tsx`.**

```tsx
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
```

- [ ] **Step 5: Create `DayCard.tsx`.**

```tsx
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
```

- [ ] **Step 6: Lint the new files.** Run `pnpm --filter @app/studio lint`. Expected: 0 warnings. Typecheck still waits on Task 4.

---

### Task 4: Compose `Activity`

**Files:**
- Modify: `src/app/_components/Activity/Activity.tsx` (full replacement)

**Interfaces:**
- Consumes: Tasks 1–3.
- Produces: `Activity({ grid, sources }: { grid: ActivityGrid; sources: ActivitySwatch[] })`. The `releases` prop is removed.

- [ ] **Step 1: Replace `Activity.tsx`.**

```tsx
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { filterGrid, type ActivityCell, type ActivityGrid } from "@/lib/activity";
import type { ActivitySwatch } from "@/lib/data";
import { formatDay } from "@/lib/format";

import { DayCard } from "./DayCard";
import { HeatmapGrid } from "./HeatmapGrid";
import { StatTiles } from "./StatTiles";
import { useDrawIn } from "./useDrawIn";

type Props = {
  grid: ActivityGrid;
  sources: ActivitySwatch[];
};

type Active = { pos: [number, number]; el: HTMLElement };

export function Activity({ grid, sources }: Props) {
  const colors = useMemo(() => Object.fromEntries(sources.map((s) => [s.slug, s.color])), [sources]);
  const names = useMemo(() => Object.fromEntries(sources.map((s) => [s.slug, s.name])), [sources]);

  const [hidden, setHidden] = useState<ReadonlySet<string>>(new Set());
  const [active, setActive] = useState<Active | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const phase = useDrawIn(gridRef);

  const view = useMemo(
    () => (hidden.size ? filterGrid(grid, (slug) => !hidden.has(slug)) : grid),
    [grid, hidden],
  );
  const activeCell = active ? (view.weeks[active.pos[0]]?.[active.pos[1]] ?? null) : null;

  const onActive = useCallback((pos: [number, number] | null, el: HTMLElement | null) => {
    setActive(pos && el ? { pos, el } : null);
  }, []);

  // A tap outside the grid closes the card on touch screens.
  useEffect(() => {
    if (!active) return;
    const onDown = (event: PointerEvent) => {
      if (!gridRef.current?.contains(event.target as Node)) setActive(null);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [active]);

  const toggle = (slug: string) =>
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });

  const describe = (cell: ActivityCell): string => {
    const parts = Object.entries(cell.bySlug)
      .sort((a, b) => b[1] - a[1])
      .map(([slug, n]) => `${names[slug] ?? slug} ${n}`);
    const releases = cell.releases.map((r) => ` · release ${r.name} v${r.version}`).join("");
    return `${formatDay(cell.date)} · ${cell.total ? parts.join(", ") : "no contributions"}${releases}`;
  };

  const releaseColor = sources[0]?.color ?? "rgb(var(--fg))";

  return (
    <section id="activity" aria-labelledby="activity-title" className="pt-section">
      <div ref={containerRef} className="relative rounded-2xl bg-surface p-6 shadow-hairline">
        <div className="mb-[18px] flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="activity-title" className="section-title">
            Activity
          </h2>
          <span aria-live="polite" className="font-mono text-[12px] text-fg-muted">
            {activeCell ? describe(activeCell) : "Last 12 months"}
          </span>
        </div>

        <StatTiles grid={view} countUp={phase === "played"} />

        <HeatmapGrid
          weeks={view.weeks}
          colors={colors}
          activeDate={activeCell?.date ?? null}
          armed={phase === "armed"}
          gridRef={gridRef}
          describe={describe}
          onActive={onActive}
        />

        <DayCard cell={activeCell} anchor={active?.el ?? null} containerRef={containerRef} sources={sources} />

        <div className="mt-4 flex flex-wrap items-center gap-x-1 gap-y-1 text-[12px] text-fg-muted">
          <span role="group" aria-label="Filter by source" className="-ml-1.5 flex flex-wrap items-center gap-x-1 gap-y-1">
            {sources.map((s) => {
              const shown = !hidden.has(s.slug);
              return (
                <button
                  key={s.slug}
                  type="button"
                  aria-pressed={shown}
                  onClick={() => toggle(s.slug)}
                  className={`inline-flex h-7 items-center gap-1.5 rounded-md px-1.5 transition-colors hover:bg-black/[0.04] ${
                    shown ? "" : "text-fg-subtle line-through decoration-fg-subtle/60"
                  }`}
                >
                  <span
                    aria-hidden
                    className="size-2.5 rounded-[3px] transition-colors"
                    style={
                      shown
                        ? { background: s.color }
                        : { background: "transparent", boxShadow: `inset 0 0 0 1.5px ${s.color}` }
                    }
                  />
                  {s.name}
                </button>
              );
            })}
            {hidden.size > 0 && (
              <button
                type="button"
                onClick={() => setHidden(new Set())}
                className="inline-flex h-7 items-center rounded-md px-1.5 text-fg underline-offset-2 hover:underline"
              >
                Show all
              </button>
            )}
          </span>
          <span className="inline-flex h-7 items-center gap-2 px-1.5">
            <span
              aria-hidden
              className="size-2.5 rounded-[3px] bg-black/[0.05]"
              style={{ boxShadow: `0 0 0 1.5px rgb(var(--surface)), 0 0 0 3px ${releaseColor}` }}
            />
            Release
          </span>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Check everything.**

```bash
pnpm --filter @app/studio typecheck && pnpm --filter @app/studio lint && pnpm --filter @app/studio test && pnpm --filter @app/studio build
```

Expected: all pass, with 0 lint warnings.

- [ ] **Step 3: Commit Tasks 2–4 together.** The page does not typecheck until all three are in.

```bash
git add apps/studio/src/lib/github.ts apps/studio/src/lib/data.ts apps/studio/src/app/page.tsx apps/studio/src/app/_styles/globals.css apps/studio/src/app/_components/Activity
git commit -m "feat(studio): stat tiles, release rings, day card and draw-in for activity

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Verify in the browser

**Files:** none.

- [ ] **Step 1: Build and start.** Run `GITHUB_TOKEN=$(gh auth token) pnpm --filter @app/studio build` with the token set for this command only. Then restart the `studio` server.
- [ ] **Step 2: Stat tiles at 1440.** Load the page at the top and scroll to Activity. Expected:
  - The cells fill in left to right, week by week, over about 1.2s.
  - All four tiles count up once.
  - Contributions matches the old total (about 639).
- [ ] **Step 3: Release rings.** Hover a cell with a teal ring. Expected:
  - The card shows the date, total, a breakdown bar and rows, a teal-on-mint "Canvas One vX released" pill, and up to 3 commit messages.
  - The readout line ends with "· release Canvas One vX".
- [ ] **Step 4: Card position.** Hover cells at the far right of the grid. Expected: the card flips to the left of the cell.
- [ ] **Step 5: Keyboard.** Tab into the grid and use the arrow keys. Expected: the card follows the focused cell, and Esc closes it.
- [ ] **Step 6: Legend.** Click "Canvas One" in the legend. Expected: its rings disappear, Releases drops to 0, and Contributions drops. "Show all" restores them.
- [ ] **Step 7: Phone (375).** Expected:
  - The tiles are laid out 2×2.
  - Tapping a cell shows the card inside the viewport.
  - Tapping outside the grid closes the card.
- [ ] **Step 8: Reduced motion.** Emulate `prefers-reduced-motion: reduce` and reload, then scroll. Expected: no draw-in and no count-up.
- [ ] **Step 9: Console.** Check for warnings. Expected: no hydration warnings.

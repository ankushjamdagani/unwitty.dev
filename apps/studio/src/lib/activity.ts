export type DayCounts = Record<string, number>;

export type ActivityCell = {
  date: string;
  total: number;
  /** Per product slug, only products with commits that day. */
  bySlug: Record<string, number>;
  /** Product with the most commits that day. */
  lead: string | null;
  /** 0 (none) to 4 (busiest). */
  level: 0 | 1 | 2 | 3 | 4;
  /** False for padding days after `end`. */
  inRange: boolean;
};

export type ActivityGrid = {
  weeks: ActivityCell[][];
  total: number;
  activeDays: number;
  longestStreak: number;
};

const DAY = 86_400_000;

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

/**
 * Builds a GitHub-style grid: `weeks` columns (Sunday → Saturday) ending in
 * the week that contains `end`. Days after `end` are padding.
 */
export function buildActivityGrid(
  countsBySlug: Record<string, DayCounts>,
  end: Date,
  weeks = 53,
): ActivityGrid {
  const endDay = Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate());
  const start = endDay - (end.getUTCDay() + (weeks - 1) * 7) * DAY;

  const grid: ActivityCell[][] = [];
  let total = 0;
  let activeDays = 0;
  let streak = 0;
  let longestStreak = 0;

  for (let w = 0; w < weeks; w++) {
    const column: ActivityCell[] = [];
    for (let d = 0; d < 7; d++) {
      const time = start + (w * 7 + d) * DAY;
      const date = isoDay(time);
      const inRange = time <= endDay;
      const bySlug: Record<string, number> = {};
      let dayTotal = 0;
      let lead: string | null = null;

      if (inRange) {
        for (const [slug, counts] of Object.entries(countsBySlug)) {
          const n = counts[date] ?? 0;
          if (!n) continue;
          bySlug[slug] = n;
          dayTotal += n;
          if (!lead || n > (bySlug[lead] ?? 0)) lead = slug;
        }
        total += dayTotal;
        if (dayTotal) {
          activeDays++;
          streak++;
          longestStreak = Math.max(longestStreak, streak);
        } else {
          streak = 0;
        }
      }

      column.push({ date, total: dayTotal, bySlug, lead, level: levelFor(dayTotal), inRange });
    }
    grid.push(column);
  }

  return { weeks: grid, total, activeDays, longestStreak };
}

/** Recomputes totals and streaks over the in-range days, oldest first. */
function summarize(weeks: ActivityCell[][]): ActivityGrid {
  let total = 0;
  let activeDays = 0;
  let streak = 0;
  let longestStreak = 0;
  for (const cell of weeks.flat()) {
    if (!cell.inRange) continue;
    total += cell.total;
    if (cell.total) {
      activeDays++;
      streak++;
      longestStreak = Math.max(longestStreak, streak);
    } else {
      streak = 0;
    }
  }
  return { weeks, total, activeDays, longestStreak };
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
      return { ...cell, bySlug, total, lead, level: levelFor(total) };
    }),
  );
  return summarize(weeks);
}

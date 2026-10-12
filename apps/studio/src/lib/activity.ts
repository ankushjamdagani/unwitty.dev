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

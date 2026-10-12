export type HeroUpdate = {
  kind: "release" | "commit";
  /** Text before the relative time, e.g. "Canvas One v0.4.12 shipped" or "Last commit". */
  text: string;
  /** Text after the relative time, e.g. " · canvas-one" (may be ""). */
  suffix: string;
  /** ISO timestamp. */
  at: string;
  href: string;
  color: string;
  external: boolean;
};

export type ReleaseInput = {
  slug: string;
  name: string;
  color: string;
  version: string | null;
  date: string | null;
};

export type CommitInput = {
  repoName: string;
  url: string;
  date: string;
} | null;

export const COMMIT_COLOR = "#404040";

/** Ticker items: dated releases newest first, then the single newest commit. */
export function buildHeroUpdates(
  releases: ReleaseInput[],
  commits: CommitInput[],
): HeroUpdate[] {
  const releaseItems = releases
    .flatMap((r) =>
      r.version && r.date ? [{ ...r, version: r.version, date: r.date }] : [],
    )
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((r): HeroUpdate => ({
      kind: "release",
      text: `${r.name} v${r.version} shipped`,
      suffix: "",
      at: `${r.date}T00:00:00Z`,
      href: `#projects/${r.slug}`,
      color: r.color,
      external: false,
    }));

  const latest = commits
    .filter((c): c is NonNullable<CommitInput> => c !== null)
    .sort((a, b) => b.date.localeCompare(a.date))[0];
  if (!latest) return releaseItems;

  return [
    ...releaseItems,
    {
      kind: "commit",
      text: "Last commit",
      suffix: ` · ${latest.repoName}`,
      at: latest.date,
      href: latest.url,
      color: COMMIT_COLOR,
      external: true,
    },
  ];
}

export type HeadlineWord = { text: string; emphasis: boolean };

/** Splits the headline into words; the last occurrence of `emphasis` becomes one emphasised word. */
export function splitHeadline(
  headline: string,
  emphasis?: string,
): HeadlineWord[] {
  const words = (text: string) =>
    text
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => ({ text: w, emphasis: false }));

  const at = emphasis ? headline.lastIndexOf(emphasis) : -1;
  if (!emphasis || at < 0) return words(headline);
  return [
    ...words(headline.slice(0, at)),
    { text: emphasis, emphasis: true },
    ...words(headline.slice(at + emphasis.length)),
  ];
}

import "server-only";

import type { Product } from "@/config/types";

import { firstLine, type CommitDay, type DayCounts } from "./activity";

const API = "https://api.github.com";
/** Re-fetch GitHub data at most once a day. */
export const REVALIDATE_SECONDS = 86_400;
const MAX_PAGES = 10;

function headers(accept = "application/vnd.github+json"): HeadersInit {
  const token = process.env.GITHUB_TOKEN;
  return {
    Accept: accept,
    "X-GitHub-Api-Version": "2022-11-28",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function get(url: string, accept?: string, revalidate = REVALIDATE_SECONDS): Promise<Response> {
  const res = await fetch(url, {
    headers: headers(accept),
    next: { revalidate, tags: ["github"] },
  });
  if (!res.ok) throw new Error(`GitHub ${res.status} for ${url}`);
  return res;
}

/** Raw text of the product's changelog. */
export async function fetchChangelog(repo: Product["repo"]): Promise<string> {
  const path = repo.changelogPath ?? "CHANGELOG.md";
  const ref = repo.branch ? `?ref=${encodeURIComponent(repo.branch)}` : "";
  const res = await get(
    `${API}/repos/${repo.owner}/${repo.name}/contents/${path}${ref}`,
    "application/vnd.github.raw+json",
  );
  return res.text();
}

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

type CalendarResponse = {
  data?: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          weeks: { contributionDays: { date: string; contributionCount: number }[] }[];
        };
      };
    } | null;
  };
  errors?: { message: string }[];
};

/**
 * The profile's contribution calendar (commits, PRs, issues, reviews) per day.
 * GitHub's GraphQL API always needs a token.
 */
export async function fetchContributionDays(
  login: string,
  from: Date,
  to: Date,
): Promise<DayCounts> {
  if (!process.env.GITHUB_TOKEN) throw new Error("GITHUB_TOKEN is not set");

  const res = await fetch(`${API}/graphql`, {
    method: "POST",
    headers: { ...headers(), "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `query($login: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $login) {
          contributionsCollection(from: $from, to: $to) {
            contributionCalendar { weeks { contributionDays { date contributionCount } } }
          }
        }
      }`,
      variables: { login, from: from.toISOString(), to: to.toISOString() },
    }),
    next: { revalidate: REVALIDATE_SECONDS, tags: ["github"] },
  });
  if (!res.ok) throw new Error(`GitHub GraphQL ${res.status}`);

  const json = (await res.json()) as CalendarResponse;
  const weeks = json.data?.user?.contributionsCollection.contributionCalendar.weeks;
  if (!weeks) throw new Error(json.errors?.[0]?.message ?? "No contribution calendar");

  const counts: DayCounts = {};
  for (const week of weeks) {
    for (const day of week.contributionDays) {
      if (day.contributionCount) counts[day.date] = day.contributionCount;
    }
  }
  return counts;
}

/** The latest-commit line in the hero is refreshed hourly; this lowers the page's ISR interval to 1h. */
const LATEST_COMMIT_REVALIDATE_SECONDS = 3_600;

type LatestCommitItem = { html_url: string; commit: { author: { date: string } | null } };

/** The newest commit on the branch (optionally by `author`), or null. */
export async function fetchLatestCommit(
  repo: Product["repo"],
  author?: string,
): Promise<{ url: string; date: string } | null> {
  const query =
    "per_page=1" +
    (repo.branch ? `&sha=${encodeURIComponent(repo.branch)}` : "") +
    (author ? `&author=${encodeURIComponent(author)}` : "");
  const res = await get(
    `${API}/repos/${repo.owner}/${repo.name}/commits?${query}`,
    undefined,
    LATEST_COMMIT_REVALIDATE_SECONDS,
  );
  const [item] = (await res.json()) as LatestCommitItem[];
  const date = item?.commit.author?.date;
  return item && date ? { url: item.html_url, date } : null;
}

import "server-only";

import type { Product } from "@/config/types";

import type { DayCounts } from "./activity";

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

async function get(url: string, accept?: string): Promise<Response> {
  const res = await fetch(url, {
    headers: headers(accept),
    next: { revalidate: REVALIDATE_SECONDS, tags: ["github"] },
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

type CommitItem = { commit: { author: { date: string } | null } };

/** Commit counts per UTC day since `since`. */
export async function fetchCommitDays(
  repo: Product["repo"],
  since: Date,
): Promise<DayCounts> {
  const counts: DayCounts = {};
  const branch = repo.branch ? `&sha=${encodeURIComponent(repo.branch)}` : "";

  for (let page = 1; page <= MAX_PAGES; page++) {
    const res = await get(
      `${API}/repos/${repo.owner}/${repo.name}/commits?since=${since.toISOString()}&per_page=100&page=${page}${branch}`,
    );
    const items = (await res.json()) as CommitItem[];
    for (const item of items) {
      const date = item.commit.author?.date?.slice(0, 10);
      if (date) counts[date] = (counts[date] ?? 0) + 1;
    }
    if (items.length < 100) break;
  }

  return counts;
}

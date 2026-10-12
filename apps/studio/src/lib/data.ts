import "server-only";

import { extraSources, otherSource } from "@/config/activity";
import { products } from "@/config/products";
import { profile } from "@/config/profile";
import type { ActivitySource, Product } from "@/config/types";

import { buildActivityGrid, remainder, type ActivityGrid, type DayCounts } from "./activity";
import { parseChangelog, toBuildLog, type BuildLogEntry } from "./changelog";
import { buildHeroUpdates, type CommitInput, type HeroUpdate } from "./hero";
import { fetchChangelog, fetchCommitDays, fetchContributionDays, fetchLatestCommit } from "./github";

export type ProductWithLog = Product & {
  version: string | null;
  log: BuildLogEntry[];
  changelogUrl: string;
};

const LOG_ENTRIES = 4;

function changelogUrl(repo: Product["repo"]): string {
  return `https://github.com/${repo.owner}/${repo.name}/blob/${repo.branch ?? "HEAD"}/${repo.changelogPath ?? "CHANGELOG.md"}`;
}

async function withLog(product: Product): Promise<ProductWithLog> {
  const base = { ...product, changelogUrl: changelogUrl(product.repo) };
  try {
    const releases = parseChangelog(await fetchChangelog(product.repo));
    const version = releases.find((r) => r.date)?.version ?? null;
    return { ...base, version, log: toBuildLog(releases) };
  } catch (error) {
    console.warn(`[studio] changelog unavailable for ${product.slug}:`, error);
    return { ...base, version: null, log: [] };
  }
}

export async function getProducts(): Promise<ProductWithLog[]> {
  return Promise.all(products.map(withLog));
}

export function latestEntries(product: ProductWithLog): BuildLogEntry[] {
  return product.log.slice(0, LOG_ENTRIES);
}

export type ActivitySwatch = Pick<ActivitySource, "slug" | "name" | "color">;

/** Graph sources in legend order: products, extra repos, then everything else. */
export function activitySwatches(): ActivitySwatch[] {
  return [
    ...products.map(({ slug, name, brand }) => ({ slug, name, color: brand.accent })),
    ...extraSources.map(({ slug, name, color }) => ({ slug, name, color })),
    otherSource,
  ];
}

async function safely(label: string, load: () => Promise<DayCounts>): Promise<DayCounts> {
  try {
    return await load();
  } catch (error) {
    console.warn(`[studio] activity unavailable for ${label}:`, error);
    return {};
  }
}

export async function getActivity(now = new Date()): Promise<ActivityGrid> {
  const since = new Date(now.getTime() - 371 * 86_400_000);
  const repos = [...products, ...extraSources];

  const [tracked, calendar] = await Promise.all([
    Promise.all(
      repos.map(async (s): Promise<[string, DayCounts]> => [
        s.slug,
        await safely(s.slug, () => fetchCommitDays(s.repo, since, profile.githubLogin)),
      ]),
    ),
    safely(otherSource.slug, () => fetchContributionDays(profile.githubLogin, since, now)),
  ]);

  const counts = Object.fromEntries(tracked);
  counts[otherSource.slug] = remainder(calendar, Object.values(counts));
  return buildActivityGrid(counts, now);
}

/** Status ticker items: each product's latest dated release plus the newest commit across tracked repos. */
export async function getHeroUpdates(list: ProductWithLog[]): Promise<HeroUpdate[]> {
  const releases = list.map((p) => ({
    slug: p.slug,
    name: p.name,
    color: p.brand.accent,
    version: p.version,
    date: p.log.find((entry) => entry.version === p.version)?.date ?? null,
  }));

  const commits = await Promise.all(
    [...list, ...extraSources].map(async (source): Promise<CommitInput> => {
      try {
        const commit = await fetchLatestCommit(source.repo, profile.githubLogin);
        return commit && { repoName: source.repo.name, url: commit.url, date: commit.date };
      } catch (error) {
        console.warn(`[studio] latest commit unavailable for ${source.slug}:`, error);
        return null;
      }
    }),
  );

  return buildHeroUpdates(releases, commits);
}

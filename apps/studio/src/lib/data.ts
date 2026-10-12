import "server-only";

import { products } from "@/config/products";
import type { Product } from "@/config/types";

import { buildActivityGrid, type ActivityGrid, type DayCounts } from "./activity";
import { parseChangelog, toBuildLog, type BuildLogEntry } from "./changelog";
import { fetchChangelog, fetchCommitDays } from "./github";

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

export async function getActivity(now = new Date()): Promise<ActivityGrid> {
  const since = new Date(now.getTime() - 371 * 86_400_000);
  const entries = await Promise.all(
    products.map(async (p): Promise<[string, DayCounts]> => {
      try {
        return [p.slug, await fetchCommitDays(p.repo, since)];
      } catch (error) {
        console.warn(`[studio] commits unavailable for ${p.slug}:`, error);
        return [p.slug, {}];
      }
    }),
  );
  return buildActivityGrid(Object.fromEntries(entries), now);
}

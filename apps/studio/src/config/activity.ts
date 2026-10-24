import type { ActivitySource } from "./types";

/** Repos counted in the activity graph besides the products in products.ts. */
export const extraSources: ActivitySource[] = [
  {
    slug: "unwitty-dev",
    name: "unwitty.dev",
    color: "#3B82F6",
    repo: { owner: "ankushjamdagani", name: "unwitty.dev" },
  },
];

/** Every other contribution on the GitHub profile (needs GITHUB_TOKEN). */
export const otherSource = {
  slug: "others",
  name: "Other work",
  color: "#B5B5B5",
} as const;

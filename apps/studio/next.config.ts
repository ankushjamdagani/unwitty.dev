import type { NextConfig } from "next";

import { products } from "./src/config/products";

/** PRODUCT_URL_CANVAS_ONE for slug "canvas-one". */
function productUrl(slug: string): string | undefined {
  const key = `PRODUCT_URL_${slug.toUpperCase().replace(/-/g, "_")}`;
  return process.env[key]?.replace(/\/$/, "");
}

/** Routes from the previous portfolio (apps/web). */
const LEGACY_REDIRECTS = [
  { source: "/work", destination: "/" },
  { source: "/work/about", destination: "/#about" },
  { source: "/work/projects/:project*", destination: "/#projects" },
  { source: "/work/articles/:article*", destination: "/" },
  { source: "/life", destination: "/" },
];

const nextConfig: NextConfig = {
  async redirects() {
    // Send visitors to product's app URL or repository.
    const pending = products
      .filter(({ slug }) => !productUrl(slug))
      .map(({ slug, repo, appUrl }) => ({
        source: `/${slug}/:path*`,
        destination: appUrl ?? `https://github.com/${repo.owner}/${repo.name}`,
        permanent: false,
      }));

    return [
      ...LEGACY_REDIRECTS.map((r) => ({ ...r, permanent: false })),
      ...pending,
    ];
  },

  // Each product is its own deployment, built with basePath "/<slug>" (multi-zones).
  async rewrites() {
    return products.flatMap(({ slug }) => {
      const url = productUrl(slug);
      if (!url) return [];
      return [
        { source: `/${slug}`, destination: `${url}/${slug}` },
        { source: `/${slug}/:path*`, destination: `${url}/${slug}/:path*` },
      ];
    });
  },
};

export default nextConfig;

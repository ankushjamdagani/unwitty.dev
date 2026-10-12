import type { NextConfig } from "next";

import { products } from "./src/config/products";

/** PRODUCT_URL_CANVAS_ONE for slug "canvas-one". */
function productUrl(slug: string): string | undefined {
  const key = `PRODUCT_URL_${slug.toUpperCase().replace(/-/g, "_")}`;
  return process.env[key]?.replace(/\/$/, "");
}

const nextConfig: NextConfig = {
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

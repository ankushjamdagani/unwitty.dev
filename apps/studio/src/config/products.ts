import type { Product } from "./types";

/**
 * Every product on unwitty.dev. Newest first.
 * Adding one: append an entry, add its repo under projects/<slug>,
 * and set PRODUCT_URL_<SLUG> to its deployment.
 */
export const products: Product[] = [
  {
    slug: "canvas-one",
    name: "Canvas One",
    appUrl: "https://canvas-one-ai.vercel.app/",
    category: "Developer tools",
    status: "Preview",
    tagline: "Think in architecture. Let agents draw the system.",
    description:
      "AI agents sketch topologies, isolate hot paths and simulate backpressure on an infinite drafting sheet.",
    brand: {
      bg: "#EEF3F1",
      fg: "#16201D",
      accent: "#0B5C54",
      accentInk: "#FFFFFF",
      taglineFont: "var(--font-newsreader), Georgia, serif",
      taglineWeight: 300,
    },
    icon: "canvas-one",
    demo: {
      poster: "/products/canvas-one/poster.jpg",
      video: "/products/canvas-one/demo.mp4",
      duration: "0:20",
    },
    repo: {
      owner: "ankushjamdagani",
      name: "canvas-one",
    },
  },
];

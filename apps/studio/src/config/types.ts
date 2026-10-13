export type ProductStatus = "Preview" | "Beta" | "Live" | "Experiment";

export type ProductBrand = {
  /** Stage background. */
  bg: string;
  /** Stage text colour. */
  fg: string;
  /** Icon, progress bar and activity colour. */
  accent: string;
  /** Primary button text colour, drawn on `accent`. */
  accentInk: string;
  /** CSS font-family for the tagline. Use a font variable loaded in layout.tsx. */
  taglineFont: string;
  taglineWeight?: number;
};

/**
 * "Prompt → canvas" tagline: `prompt` is typed into a chat input, then
 * `before highlight after` lands as the headline with `highlight` selected by
 * Claude's cursor. `Product.tagline` stays the accessible full sentence.
 */
export type TaglineCanvas = {
  prompt: string;
  before: string;
  highlight: string;
  after: string;
};

export type Product = {
  /** Served at unwitty.dev/<slug>; also the folder name under projects/. */
  slug: string;
  name: string;
  category: string;
  status: ProductStatus;
  /** Public app URL; omit to use the site's /<slug> route. */
  appUrl?: string;
  tagline: string;
  /** Optional animated treatment for the tagline; plain text when omitted. */
  taglineCanvas?: TaglineCanvas;
  description: string;
  brand: ProductBrand;
  /** Optional inline SVG for the icon; falls back to a monogram. */
  icon?: "canvas-one";
  monogram?: string;
  demo: {
    poster: string;
    video?: string;
    /** Display duration, e.g. "0:42". */
    duration?: string;
  };
  repo: {
    owner: string;
    name: string;
    branch?: string;
    changelogPath?: string;
  };
};

export type Company = {
  name: string;
  role: string;
  location?: string;
  /** "YYYY-MM", or "YYYY" when the month is unknown. */
  start: string;
  /** Same format as start, or null for the current role. */
  end: string | null;
  logo?: string;
  url?: string;
  highlights: string[];
};

export type SocialLink = {
  label: string;
  url: string;
};

export type ActivitySource = {
  slug: string;
  name: string;
  color: string;
  repo: Product["repo"];
};

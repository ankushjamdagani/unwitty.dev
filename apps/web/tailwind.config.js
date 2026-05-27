/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "fg-contrast": "rgb(var(--fg-contrast) / <alpha-value>)",
        "canvas-contrast": "rgb(var(--canvas-contrast) / <alpha-value>)",
        canvas: "rgb(var(--canvas) / <alpha-value>)",
        "canvas-raised": "rgb(var(--canvas-raised) / <alpha-value>)",
        fg: "rgb(var(--fg) / <alpha-value>)",
        "fg-muted": "rgb(var(--fg-muted) / <alpha-value>)",
        "fg-subtle": "rgb(var(--fg-subtle) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        "ledger-outline": "rgb(var(--ledger-outline) / <alpha-value>)",
        "ledger-surface": "rgb(var(--ledger-surface) / <alpha-value>)",
      },
      fontFamily: {
        "work-body": "var(--font-work-body), ui-monospace, monospace",
        "work-heading": "var(--font-work-heading), serif",
        "life-body": "var(--font-life-body), serif",
        "life-heading": "var(--font-life-heading), cursive",
        "ledger-serif": "var(--font-life-body), serif",
      },
      borderRadius: {
        DEFAULT: "var(--border-radius)",
        sm: "var(--border-radius-sm)",
        md: "var(--border-radius-md)",
        lg: "var(--border-radius-lg)",
      },
      borderWidth: {
        DEFAULT: "var(--border-width-md)",
        thin: "var(--border-width-thin)",
        md: "var(--border-width-md)",
        thick: "var(--border-width-thick)",
        "extra-thick": "var(--border-width-extra-thick)",
      },
      zIndex: {
        "below-all": "var(--z-index-below-all)",
        base: "var(--z-index-base)",
        normal: "var(--z-index-normal)",
        menu: "var(--z-index-menu)",
        nav: "var(--z-index-nav)",
        overlay: "var(--z-index-overlay)",
      },
      maxWidth: {
        content: "var(--max-content-width)",
      },
      fontSize: {
        xxs: "var(--font-xxs)",
        xs: "var(--font-xs)",
        sm: "var(--font-sm)",
        md: "var(--font-md)",
        lg: "var(--font-lg)",
        "display-sm": "var(--font-display-sm)",
        "display-md": "var(--font-display-md)",
      },
      height: {
        nav: "var(--nav-height)",
        marquee: "var(--marquee-height)",
        "icon-sm": "var(--icon-sm)",
        "icon-md": "var(--icon-md)",
      },
      width: {
        "icon-sm": "var(--icon-sm)",
        "icon-md": "var(--icon-md)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      animation: {
        marquee: "marquee 25s linear infinite",
      },
    },
  },
  plugins: [],
};

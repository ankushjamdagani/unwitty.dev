/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "rgb(var(--canvas) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        fg: "rgb(var(--fg) / <alpha-value>)",
        "fg-body": "rgb(var(--fg-body) / <alpha-value>)",
        "fg-muted": "rgb(var(--fg-muted) / <alpha-value>)",
        "fg-subtle": "rgb(var(--fg-subtle) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        well: "rgb(var(--well) / <alpha-value>)",
        product: {
          bg: "var(--product-bg)",
          fg: "var(--product-fg)",
          accent: "var(--product-accent)",
          ink: "var(--product-ink)",
        },
      },
      fontFamily: {
        sans: "var(--font-geist), system-ui, sans-serif",
        mono: "var(--font-geist-mono), ui-monospace, monospace",
      },
      maxWidth: {
        content: "var(--max-content-width)",
      },
      spacing: {
        gutter: "var(--horizontal-gap)",
        section: "var(--section-gap)",
      },
      boxShadow: {
        hairline: "0 0 0 1px rgb(0 0 0 / 0.07), 0 1px 2px rgb(0 0 0 / 0.04)",
        button: "inset 0 1px 0 rgb(255 255 255 / 0.15), 0 1px 2px rgb(0 0 0 / 0.2)",
        frame:
          "0 0 0 1px rgb(0 0 0 / 0.08), 0 2px 4px rgb(0 0 0 / 0.04), 0 24px 48px -16px rgb(0 0 0 / 0.18)",
      },
      zIndex: {
        nav: "var(--z-index-nav)",
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        foreground: "rgb(var(--foreground-rgb))",
        background: "rgb(var(--background-rgb))",
      },
      borderRadius: {
        DEFAULT: "var(--border-radius)",
        sm: "var(--border-radius-sm)",
        md: "var(--border-radius-md)",
        lg: "var(--border-radius-lg)",
      },
      borderWidth: {
        DEFAULT: "var(--border-width)",
        thin: "var(--border-width-thin)",
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
        "above-all": "var(--z-index-above-all)",
      },
      maxWidth: {
        content: "var(--max-content-width)",
      },
      fontSize: {
        xs: "var(--font-xs)",
        sm: "var(--font-sm)",
        md: "var(--font-md)",
        lg: "var(--font-lg)",
      },
      height: {
        nav: "var(--nav-height)",
        marquee: "var(--marquee-height)",
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

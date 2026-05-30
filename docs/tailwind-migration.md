# Tailwind CSS Migration Notes

Migration of `apps/web` from plain CSS modules (per-component `.styles.css` files) to Tailwind CSS utility classes.

---

## Setup

### Packages added (`apps/web/package.json`)

```json
"devDependencies": {
  "autoprefixer": "^10.5.0",
  "postcss": "^8.5.14",
  "tailwindcss": "^3.4.19"
}
```

### Files added

| File                          | Purpose                                                 |
| ----------------------------- | ------------------------------------------------------- |
| `apps/web/tailwind.config.js` | Tailwind config — extends theme with design tokens      |
| `apps/web/postcss.config.js`  | Wires Tailwind + Autoprefixer into the PostCSS pipeline |

### `globals.css` changes

The three Tailwind directives must come **after** the CSS imports and **before** any custom CSS:

```css
@import url("./_styles/reset.css");
@import url("./_styles/normalize.css");
@import url("./_styles/theme.css");

@tailwind base;
@tailwind components;
@tailwind utilities;
```

Order matters. Putting `@tailwind` before the imports breaks the cascade.

---

## Design Token Mapping

All design tokens live in `src/app/_styles/theme.css` as CSS custom properties. The Tailwind config maps them so utilities like `bg-foreground`, `border-thin`, `z-nav` etc. resolve to the same variables.

### `tailwind.config.js`

```js
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        foreground: "rgb(var(--foreground-rgb))",
        background: "rgb(var(--background-rgb))",
      },
      borderRadius: {
        DEFAULT: "var(--border-radius)", // 3px
        sm: "var(--border-radius-sm)", // 1px
        md: "var(--border-radius-md)", // 5px
        lg: "var(--border-radius-lg)", // 8px
      },
      borderWidth: {
        DEFAULT: "var(--border-width)", // 2px
        thin: "var(--border-width-thin)", // 1px  ← important
        thick: "var(--border-width-thick)", // 3px
        "extra-thick": "var(--border-width-extra-thick)", // 4px
      },
      zIndex: {
        "below-all": "var(--z-index-below-all)", // -1
        base: "var(--z-index-base)", // 1
        normal: "var(--z-index-normal)", // 11
        menu: "var(--z-index-menu)", // 111
        nav: "var(--z-index-nav)", // 1111
        overlay: "var(--z-index-overlay)", // 11111
        "above-all": "var(--z-index-above-all)", // 11111
      },
      maxWidth: {
        content: "var(--max-content-width)", // 920px
      },
      fontSize: {
        xs: "var(--font-xs)", // 0.75rem
        sm: "var(--font-sm)", // 0.875rem
        md: "var(--font-md)", // 1rem
        lg: "var(--font-lg)", // 1.25rem
      },
      height: {
        nav: "var(--nav-height)", // 50px
        marquee: "var(--marquee-height)", // 80px
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
};
```

### Quick token reference

| CSS variable                            | Tailwind utility                                        |
| --------------------------------------- | ------------------------------------------------------- |
| `rgb(var(--foreground-rgb))`            | `text-foreground`, `bg-foreground`, `border-foreground` |
| `rgb(var(--background-rgb))`            | `text-background`, `bg-background`, `border-background` |
| `var(--border-width)` (2px)             | `border`                                                |
| `var(--border-width-thin)` (1px)        | `border-thin`                                           |
| `var(--border-width-extra-thick)` (4px) | `border-extra-thick`                                    |
| `var(--border-radius)`                  | `rounded`                                               |
| `var(--z-index-nav)`                    | `z-nav`                                                 |
| `var(--z-index-below-all)`              | `z-below-all`                                           |
| `var(--nav-height)`                     | `h-nav`                                                 |
| `var(--marquee-height)`                 | `h-marquee`                                             |
| `var(--horizontal-gap)`                 | `pl-[var(--horizontal-gap)]` (arbitrary value)          |

`--horizontal-gap` has no Tailwind alias — use the arbitrary-value syntax wherever needed:
`pl-[var(--horizontal-gap)]`, `ml-[var(--horizontal-gap)]`, etc.

---

## Reusable Component Classes (`@layer components`)

Shared visual patterns that appear in multiple components were moved to `globals.css` under `@layer components` so they stay available as utility classes. This avoids duplicating long Tailwind strings in JSX.

```css
@layer components {
  /* Section wrapper */
  .container { ... }
  .container > h2 { ... }
  .container > ul { ... }
  .container > footer { ... }

  /* Separator shapes (bg-foreground auto-applied via [class^="seperator"]) */
  .seperator-sq       { @apply aspect-square w-2; }
  .seperator-sq-sm    { @apply aspect-square w-1; }
  .seperator-rect     { @apply h-[2px] w-6; }
  .seperator-rect-sm  { @apply h-[2px] w-3; }

  /* Card variants */
  .shadow-box-v0 { ... }  /* raised shadow with ::after offset */
  .shadow-box    { ... }  /* flat bordered card, no shadow */

  /* Text helpers */
  .wavy-underline   { @apply underline decoration-wavy underline-offset-[0.4em]; }
  .highlight-inverted { @apply text-background bg-foreground; }
}
```

Use these class names in JSX as normal: `className="container"`, `className="shadow-box"`, etc.

---

## Patterns Used in Components

### Arbitrary CSS variable values

When a CSS variable has no Tailwind alias, wrap it in `[...]`:

```tsx
// border width from variable
className = "border-[length:var(--border-width)]";
className = "border-t-[length:var(--border-width-extra-thick)]";

// spacing from variable
className = "pl-[var(--horizontal-gap)]";
className = "ml-[var(--horizontal-gap)]";

// arbitrary calc()
className = "min-h-[calc(100vh-var(--nav-height)-var(--marquee-height))]";
```

Note the `length:` type hint required for border-width arbitrary values — without it Tailwind won't generate the right property.

### Inline styles for complex animations

Properties that CSS variables animate (via `@property`) and scroll-driven animations cannot be expressed as Tailwind classes. Use `style={{}}` for these:

```tsx
// Footer circles-zoom scroll animation
<div
  style={{
    animation: "circles-zoom 1s linear forwards",
    animationRange: "entry 0% entry 99%",
    animationTimeline: "view(block)",
    background: "repeating-radial-gradient(...)",
  }}
/>

// Projects in-progress stripe
<div
  style={{
    background: "repeating-linear-gradient(45deg, ...)",
    backgroundAttachment: "fixed",
    animation: "bg-move 0.35s linear infinite",
  }}
/>
```

### Pseudo-elements

Tailwind supports `::before` / `::after` via `before:` / `after:` variants. Always include `content-['']` (or a value) — without it the pseudo-element won't render:

```tsx
// Diamond separator after each marquee word
className =
  "after:bg-foreground relative after:absolute after:right-[-18px] after:top-[10px] after:aspect-square after:w-[6px] after:rotate-45 after:translate-x-[-50%] after:translate-y-[-50%] after:content-['']";

// First-letter styling (Hero name "A")
className =
  "first-letter:bg-foreground first-letter:text-background first-letter:rounded first-letter:mr-1 first-letter:px-3 font-bold";
```

### nth-child selectors

Tailwind supports arbitrary variants for structural selectors:

```tsx
className =
  "[&:nth-child(1)]:-translate-x-[10px] [&:nth-child(1)]:translate-y-0 [&:nth-child(1)]:-rotate-[7deg]";
```

### Group hover

Used to dim sibling items when any item in a list is hovered:

```tsx
// Parent list
<ul className="group/list flex">

// Each item — dim on group hover, restore on own hover
<li className="group-hover/list:opacity-50 hover:!opacity-100 ...">
```

The original CSS used `:has(~ li:hover)` and `li:hover ~ li` selectors. The Tailwind `group/list` approach is functionally equivalent for dimming all siblings.

### Keyframe animations defined in `globals.css`

Animations that can't be expressed in the Tailwind config (e.g., those animating `@property` custom properties) are defined as raw `@keyframes` in `globals.css` and referenced by name in `style={{}}` or via arbitrary `animate-[name_duration]` Tailwind classes:

```css
/* globals.css */
@keyframes noise { ... }
@keyframes slide { ... }
@keyframes blink-animation { ... }
@keyframes scale-fade-out { ... }
@keyframes circles-zoom { ... }  /* animates @property variables */
@keyframes bg-move { ... }
```

```tsx
// Used via arbitrary animate class
className="animate-[noise_90ms_infinite]"

// Or via inline style when the animation uses @property variables
style={{ animation: "circles-zoom 1s linear forwards" }}
```

---

## Bugs Found and Fixed

These issues caused the local version to visually differ from the remote.

### 1. Global `blockquote` styles contaminating the Footer

**Problem:** A global `blockquote` rule was added to `globals.css` with a `::before { content: '"' }` pseudo-element (large decorative quote mark), plus `px-12 py-8 italic text-left`. This applied to every `<blockquote>` on the page including the Footer's attribution quote, which should be plain centered text. The result was a large `"` character appearing in the top-left of the footer.

**Root cause:** The original `globals.css` had **no** global `blockquote` styles. The footer's own `.styles.css` scoped its blockquote styles under `#footer`. When migrating to Tailwind, a global blockquote style was accidentally added.

**Fix (`globals.css`):**

```css
/* Before — too broad */
blockquote {
  @apply relative mb-[1.4em] px-12 py-8 text-left italic;
  &::before {
    @apply absolute -left-1 top-0 text-[4em] content-['"'];
  }
}

/* After — minimal global rule */
blockquote {
  @apply relative mb-[1.4em];
}
```

If a fancy blockquote style is needed for article pages, apply it via a scoped class (e.g., `.prose-blockquote`) rather than the global element selector.

### 2. Border width too thick on interactive elements

**Problem:** Social icon links and tech stack badges used the Tailwind `border` class (resolves to `var(--border-width)` = **2px**). The original CSS used `border: solid var(--border-width-thin)` = **1px**. This made borders visually heavier.

**Affected files:** `Hero/Hero.tsx`, `Hero2/Hero.tsx`, `Footer.tsx`, `Introduction.tsx`, `Work.tsx`

**Fix:** Replace `border` with `border-thin` for elements that originally used `var(--border-width-thin)`:

```tsx
// Before
className = "... border ...";

// After
className = "... border-thin ...";
```

**Rule:** Check the original CSS carefully. `border: solid var(--border-width)` → `border`. `border: solid var(--border-width-thin)` (or hardcoded `1px`) → `border-thin`. `border: solid var(--border-width-extra-thick)` → `border-extra-thick`.

### 3. Missing `border-foreground` on Work tech stack badges

**Problem:** Tech badges in `Work.tsx` had `border border-solid` but no explicit border color class. The original CSS used `border: solid 1px` which inherits the element's `color` (foreground). Tailwind's `border` class does not inherit color automatically — it defaults to `currentColor` but the explicit `border-foreground` makes intent clear and avoids surprises.

**Fix (`Work.tsx`):**

```tsx
// Before
className = "text-xs rounded-[2px] border border-solid px-1 py-[2px]";

// After
className =
  "text-xs rounded-[2px] border-thin border-solid border-foreground px-1 py-[2px]";
```

### 4. Missing `user-select: none` on MarqueeText

**Problem:** The original `.marquee-text` CSS had `user-select: none` to prevent accidental text selection while the marquee scrolls. This wasn't carried over.

**Fix (`MarqueeText.tsx`):** Add `select-none` to both marquee wrapper divs.

---

## Migration Checklist for Remaining Pages

Use this when migrating a component from `.styles.css` to Tailwind classes.

- [ ] **Read the original `.styles.css` first** — note every property before deleting it
- [ ] **Check border widths** — distinguish `border-width-thin` (1px → `border-thin`) from `border-width` (2px → `border`) from hardcoded `1px` (→ `border-thin`)
- [ ] **Check border color** — add `border-foreground` or `border-background` explicitly; don't rely on inheritance
- [ ] **Convert `position: relative/absolute`** — `relative`, `absolute`, `inset-0`, `top-0`, `left-0` etc.
- [ ] **Map z-index values to named utilities** — use `z-nav`, `z-normal`, `z-below-all` etc. instead of raw numbers
- [ ] **Pseudo-elements** — always include `content-['']` on `::before`/`::after`; check `::first-letter`, `::selection`
- [ ] **`user-select: none`** → `select-none`
- [ ] **`pointer-events: none`** → `pointer-events-none`
- [ ] **`overflow: hidden`** → `overflow-hidden`
- [ ] **`transition`** — replace bare `transition: all 0.25s` with specific Tailwind utilities: `transition-all duration-[250ms]`
- [ ] **Scoped styles** — CSS rules scoped under `#section-id .child` need to be inlined on the child element in JSX. Don't add them as global styles.
- [ ] **Animations using `@property` variables** — keep as raw `@keyframes` in `globals.css`; reference via `style={{}}` not Tailwind classes
- [ ] **Scroll-driven animations** (`animation-timeline: view()`) — must use inline `style={{}}` as Tailwind has no support yet
- [ ] **`gap`** — only works when the element is `display: flex` or `display: grid`. Make sure the container has `flex` or `grid` applied.
- [ ] **Global element selectors** (`blockquote`, `a`, `p`) — be careful adding Tailwind `@apply` to these. If the original scoped the style to a specific component, keep it scoped.
- [ ] **`last-of-type` / structural selectors** — use Tailwind's `last-of-type:hidden` or `[&:last-of-type]:hidden` variants

---

## Things That Don't Need Tailwind (Keep as CSS)

| Pattern                                            | Why                                                                 |
| -------------------------------------------------- | ------------------------------------------------------------------- |
| `@keyframes` for `@property` animated variables    | `@property` + `@keyframes` combo not expressible in Tailwind config |
| `animation-timeline: view(block)`                  | Scroll-driven animation API, no Tailwind support                    |
| `@property` declarations                           | Must be at top-level CSS                                            |
| `body::after` dot pattern overlay                  | Complex filter + z-index combo easier as `@apply` in globals        |
| `::selection`                                      | Handled once in globals via `@apply`                                |
| CSS nesting for dark theme (`[data-theme="dark"]`) | Kept in `theme.css`, no Tailwind needed                             |

---

## File-by-File Migration Summary

| File                              | Status      | Notes                                                                                                     |
| --------------------------------- | ----------- | --------------------------------------------------------------------------------------------------------- |
| `globals.css`                     | ✅ Migrated | Added `@tailwind` directives; moved shared classes to `@layer components`; global `blockquote` simplified |
| `Nav/Nav.tsx`                     | ✅ Migrated | Sticky header, dashed border-bottom, logo pill                                                            |
| `Hero/Hero.tsx`                   | ✅ Migrated | Left-border layout, social icon links (`border-thin`)                                                     |
| `Hero2/Hero.tsx`                  | ✅ Migrated | Complex layout with absolute profile card; `first-letter:` styling                                        |
| `Footer/Footer.tsx`               | ✅ Migrated | Scroll-driven radial gradient via inline styles; `border-thin` on icons                                   |
| `MarqueeText/MarqueeText.tsx`     | ✅ Migrated | `animate-marquee`, `select-none`, `[animation-direction:reverse]` arbitrary                               |
| `Projects/Projects.tsx`           | ✅ Migrated | 5-column grid with `col-span-*` / `row-span-*`; animated stripe via inline style                          |
| `Words/Words.tsx`                 | ✅ Migrated | `group/list` hover dim pattern                                                                            |
| `Breadcrumb/BreadCrumb.tsx`       | ✅ Migrated | `after:` pseudo-element separators                                                                        |
| `about/Introduction.tsx`          | ✅ Migrated | `border-thin` on social links                                                                             |
| `about/Work.tsx`                  | ✅ Migrated | `border-thin border-foreground` on tech badges                                                            |
| `articles/[article]/page.tsx`     | ✅ Migrated | Inline `px-[var(--horizontal-gap)]`; `list-square`, `list-[upper-alpha]` arbitrary                        |
| `projects/[project]/page.tsx`     | ✅ Migrated | Tag borders                                                                                               |
| `Cursor/Cursor.tsx`               | ✅ Migrated | `backdrop-invert`, `backdrop-grayscale`, `z-above-all`                                                    |
| `NoiseOverlay/NoiseOverlay.tsx`   | ✅ Migrated | `animate-[noise_90ms_infinite]`, `mix-blend-mode-overlay`                                                 |
| `RotatingCards/RotatingCards.tsx` | ✅ Migrated | `[&:nth-child(n)]` selectors, stacked card transforms                                                     |
| `TypeWord/TypeWord.tsx`           | ✅ Migrated | `animate-[blink-animation...]` arbitrary                                                                  |
| `CursorDisplacementFire`          | ✅ Migrated | —                                                                                                         |
| `CursorInverted`                  | ✅ Migrated | —                                                                                                         |
| `CursorWind`                      | ✅ Migrated | —                                                                                                         |
| `LadderCards`                     | ✅ Migrated | —                                                                                                         |
| `SceneNightLighthouse`            | ✅ Migrated | —                                                                                                         |
| `SceneTest`                       | ✅ Migrated | —                                                                                                         |

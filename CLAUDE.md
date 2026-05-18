# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands run from the repo root via Turbo unless targeting a specific workspace.

```bash
# Run everything in dev mode
pnpm dev

# Run a single workspace in dev mode
pnpm --filter @app/portfolio dev
pnpm --filter @project/svg-editor dev

# Build, lint, typecheck (all workspaces)
pnpm build
pnpm lint
pnpm typecheck

# Run tests (only song-generator and svg-editor have tests)
pnpm --filter @project/song-generator test
pnpm --filter @project/svg-editor test

# Format (root-level, all .ts/.tsx/.md)
pnpm format

# Bootstrap native dependencies (Three.js WASM, gameboy assets, etc.)
pnpm bootstrap-all

# Clean all build artifacts + node_modules
pnpm clean
```

## Architecture

**Monorepo layout** managed by pnpm workspaces + Turbo:

| Path | Package | Purpose |
|---|---|---|
| `apps/web` | `@app/portfolio` | Next.js 15 portfolio site |
| `projects/*` | `@project/*` | Standalone Vite + React interactive projects |
| `packages/ui` | `@common/ui` | Shared React component library |
| `packages/eslint-config` | `@common/eslint-config` | Shared ESLint configs |
| `packages/typescript-config` | `@common/typescript-config` | Shared `tsconfig` bases |

**How projects plug into the portfolio:** `apps/web/src/configs/projects.tsx` defines all project metadata and dynamic imports. Each `@project/*` package is a Vite-built React component consumed by the Next.js app. `next.config.js` transpiles `@common/ui` via `transpilePackages`.

**`apps/web` source layout:**
- `src/app/` — Next.js App Router pages and route-level layout components
- `src/app/_components/` — Page-section components (Nav, Hero, Projects, Footer, etc.)
- `src/app/_styles/` — Global CSS: `theme.css` (all CSS variables), `globals.css` (Tailwind directives + `@layer components`)
- `src/components/` — Reusable cross-page components (cursors, cards, 3D scenes, etc.)
- `src/configs/` — Static data / project registry
- Underscore-prefixed folders (`_components`, `_styles`) are private to their parent route segment

## Styling

The app uses **Tailwind CSS 3** with an extensive CSS custom-property theme — do not hardcode colour or spacing values directly.

**Theme variables** (defined in `src/app/_styles/theme.css`):
- Colors: `--foreground-rgb` / `--background-rgb` in raw RGB (`r g b`) format — use `rgb(var(--foreground-rgb))` or the Tailwind aliases `text-foreground` / `bg-background`
- Border widths: `--border-width`, `--border-width-thick`, `--border-width-extra-thick`
- Z-index: `--z-index-below-all` (−1) … `--z-index-above-all` (11111), mapped to Tailwind `z-below-all` / `z-above-all` etc.
- Font sizes: `--font-xs` … `--font-lg`, mapped to Tailwind `text-xs` … `text-lg`
- Layout: `--horizontal-gap` (responsive side padding), `--max-content-width`

**Reusable classes** defined in `@layer components` inside `globals.css`: `.container`, `.shadow-box`, `.shadow-box-v0`, `.seperator-*`, `.wavy-underline`, `.highlight-inverted`, `.badge`.

Light/dark theming is driven by a `[data-theme]` attribute on the root element — not `prefers-color-scheme`.

## Key Conventions

- **Named exports** throughout — no default exports on components.
- TypeScript path alias `@/` maps to `apps/web/src/`.
- Shared TypeScript config hierarchy: `packages/typescript-config/base.json` → `nextjs.json` (for apps/web) / `reactjs.json` (for projects).
- ESLint zero-warnings policy (`--max-warnings 0`) — fix all warnings, not just errors.
- `pnpm` only — no `npm` or `yarn`.

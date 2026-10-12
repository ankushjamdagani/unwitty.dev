# unwitty.dev revamp — `apps/studio`

Design source: Claude Design canvas, page "Final structure" (i/Home, i/HomeLater).
Old portfolio `apps/web` stays untouched until the domain switch.

## Decisions

| Topic | Decision |
| --- | --- |
| Location | New Next 15 app `apps/studio` (`@app/studio`) |
| Theme | Light only. Geist + Geist Mono. Product colours come from config only |
| Activity | Per-repo commits (GitHub REST) for every product repo in config → days coloured by product |
| Build logs | Each product's `CHANGELOG.md` (Keep a Changelog), fetched from its repo and parsed |
| Old experiments | Dropped (Gameboy Shell, SVG Editor, Song Generator, XR Editor) |
| Products | Each product lives in `projects/<slug>` (Canvas One → `projects/canvas-one` from github.com/ankushjamdagani/canvas-one). Served at `unwitty.dev/<slug>` via Next multi-zones: product deploys with `basePath=/<slug>` (Canvas One already reads `NEXT_PUBLIC_CANVAS_BASE_PATH`), studio rewrites `/<slug>/:path*` to it |
| Demo videos | Later — poster image until supplied |
| Build logs depth | CHANGELOG only, no commit fallback |
| About | Rewritten from résumé (Dec 2025 CV); company logos shown; résumé PDF linked |
| Data fetching | Server-side at build + ISR (`revalidate: 86400`). On fetch failure the section shows an empty state and logs a warning (no snapshot file) |

## Structure

```
apps/studio/
  src/
    config/
      profile.ts      name, tagline, about, links, email, résumé path
      companies.ts    roles (from LedgerCompanies.tsx), logo paths
      products.ts     slug, name, status, version, tagline, blurb, brand {bg, fg, accent, font},
                      demo {video, poster}, repo {owner, name, changelogPath}, href
    lib/
      github.ts       fetchCommits(repo, since) → per-day counts
      changelog.ts    parseChangelog(md) → [{ version, date, items[] }]
      activity.ts     merge per-product days → 53×7 grid
      data.ts         getProducts() / getActivity(), empty-state fallback
    app/
      layout.tsx      fonts, metadata, Nav, Footer
      page.tsx        Hero · Projects · Activity · About
      _components/
        Nav.tsx         Projects · Activity · About · Résumé
        Hero.tsx        "I make tools for thinking." / by Ankush Jamdagani
        ProjectsReel/   Stage (server) + ReelController (client: tabs, progress, video end → next)
        BuildLog.tsx    latest 4 entries + "Full build log"
        Activity/       Heatmap (server grid) + HoverReadout (client)
        About.tsx       paragraph, roles, Résumé / Get in touch
  public/
    products/canvas-one/{poster.jpg, demo.mp4 (later)}
    images/company-logo/*   (copied from apps/web)
    resume.pdf
```

## Behaviour

- One product → single stage + "The next project is in the workshop." Two or more → tabs with progress; advance on `video ended`, pause on hover/focus, no auto-advance under `prefers-reduced-motion`.
- Heatmap cells are keyboard-focusable via a roving tabindex; readout = date · product · commits.
- `GITHUB_TOKEN` read from env only, never shipped to client.

## Steps

1. Scaffold `apps/studio` (package.json, tsconfig from `@common/typescript-config/nextjs.json`, eslint, tailwind, postcss).
2. Config files + types; port companies/links from `apps/web`.
3. `lib/` fetchers + parser + snapshot fallback, with unit tests (vitest) for changelog parser and activity grid.
4. Sections, matching the canvas boards.
5. Add `projects/canvas-one`; wire `rewrites()` in studio `next.config` from `products.ts` (`zoneUrl` per product, env-overridable).
6. Verify: `pnpm --filter @app/studio typecheck lint build`; Playwright screenshots at 1440 and 375.
7. Deploy switch (vercel.json / project root) — only when you say.

## Status (2026-10-12)

Steps 1–6 done on branch `studio/revamp`. `projects/canvas-one` is excluded from the pnpm workspace until it installs there (`@canvas-one/ui` is not on npm). Pending: demo video, deploy switch.

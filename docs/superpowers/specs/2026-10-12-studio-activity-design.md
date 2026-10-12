# Studio activity — design

Status: approved in brainstorming, 2026-10-12. Scope: `apps/studio` Activity section (`src/app/_components/Activity/`) and its data in `src/lib/`.
Mockup: `.superpowers/brainstorm/90056-1791795619/content/activity.html` (ring marker).

## Goal

Keep the heatmap and make it tell a richer story: shipping as well as committing, numbers you can take in at a glance, real detail on hover, and a single crafted entrance. The legend filter, the roving-tabindex grid and the `aria-live` readout from #41 all stay.

## 1. Stat tiles (`StatTiles.tsx`)

- They replace the summary line. There are four tiles: **Contributions**, **Releases**, **Longest streak**, **Current streak**. The streak values carry a muted "days" suffix.
- Layout: a `dl` grid with 4 columns (2×2 at 640px and below). There is a 1px `line` rule above the grid. Each label is 10.5px mono uppercase in `fg-subtle`, and each value is 30px Geist 500 with `tracking -0.04em` and `tabular-nums`.
- Values are computed from the filtered view (`filterGrid`), so hiding a legend item updates the tiles.
- Releases is the number of releases dated inside the grid window that belong to visible products.
- Current streak counts back from the last in-range day. If the last day is empty, counting starts from the day before it, so the streak isn't zero every morning.

## 2. Release markers

- A cell with a release from a visible product gets a ring: `box-shadow: 0 0 0 1.5px rgb(var(--canvas)), 0 0 0 3px <accent>`. The colour comes from the first release's `brand.accent`, in product config order.
- Hidden products' releases have no ring.
- The legend gains a non-interactive "Release" item that shows a ring swatch. It is a `span`, not a toggle.
- Data: `releasesByDay: Record<isoDay, { slug: string; name: string; version: string }[]>`, built in `data.ts` from each product's already-parsed log.

## 3. Hover card (`DayCard.tsx`)

**Trigger:**
- Pointer hover over a cell.
- Keyboard focus on a cell (arrow-key navigation stays as it is).
- Tap on touch devices. Tapping outside the grid, or pressing Esc, dismisses the card.

The card follows `activePos`, which is already tracked.

**Content:**
1. Header row in mono: the date (`formatDay`) on the left, and "N contributions" or "No activity" on the right. Then the total in larger type.
2. A breakdown bar, 6px high and flex-segmented by visible source colour, followed by one row per non-zero source ("Canvas One · 4").
3. A release pill for each release that day: "Canvas One v0.4.12 released", with the product's `brand.bg` behind it and its `brand.accent` as the text colour.
4. Commit messages: up to 3, first line only, in mono at 10.5px with ellipsis at the card width. They come only from product and extra repos; "Other work" has none.

**Placement:**
- Absolute, inside the Activity section, anchored to the cell's rect.
- The default is to the right of the cell, 18px offset and vertically centred.
- It flips to the left when it would overflow the section, and is clamped so it never crosses the top or bottom edge.
- It is 250px wide, or `min(250px, 100vw - 32px)` on phones.
- It fades in and rises 4px over 150ms. There is no motion under reduced motion.

**Accessibility:**
- The card is `aria-hidden`.
- The existing `aria-live` readout stays the accessible channel. It is extended to say "· release Canvas One v0.4.12" when relevant.

## 4. Draw-in (`HeatmapGrid.tsx`, `useInViewOnce.ts`)

- `useInViewOnce(ref, { threshold: 0.25 })` returns `true` once, then disconnects.
- The server-rendered HTML shows the final state.
- After hydration, if reduced motion is off and the grid is not already in view, a `data-armed` attribute is added. CSS then sets the cells to `opacity: 0; transform: scale(.4)`.
- When the grid comes into view, `data-armed` is removed. Each cell transitions back over 250ms, with `transition-delay: calc(var(--week) * 18ms)`, so 53 weeks finish in about 1.2s.
- The stat tiles count up from 0 over 900ms with ease-out cubic, using rAF and writing `textContent` through refs. Final values are server-rendered, so there is no hydration mismatch.
- It runs once per page load. Under reduced motion, or without JS, nothing animates.

## Data changes

| File | Change |
|---|---|
| `lib/github.ts` | `fetchCommitDays` returns `{ day: string; message: string }[]` (first line of `commit.message`, trimmed) instead of bare days. Callers that only count days map over the result. |
| `lib/activity.ts` | `ActivityCell` gains `messages: string[]` (top 3 by recency across visible sources) and `releases: DayRelease[]`. `buildActivityGrid` accepts `messagesBySlug` and `releasesByDay`. `summarize` gains `currentStreak` and `releases`. `filterGrid` drops hidden sources' messages and releases. |
| `lib/data.ts` | `getActivity` passes messages through and builds `releasesByDay` from `getProducts()` logs. |
| `app/page.tsx` | Replaces the `releases` count prop with grid-embedded release data; `Activity` reads everything from `grid`. |

The serialized grid size grows by at most 3 short strings for each active day, which is acceptable at about 371 cells.

## Components

`Activity/Activity.tsx` keeps the state (`hidden`, `activePos`, `view`) and composes:
- `StatTiles`
- `HeatmapGrid` (cells, month labels, ring markers, draw-in, roving tabindex)
- `DayCard`
- the legend (existing, plus the Release swatch)
- the readout (existing)

## Verification

- Unit tests (vitest), in `activity.test.ts`:
  - `currentStreak`: last day empty, last day active, a gap.
  - Messages capped at 3, most recent first.
  - `filterGrid` removes hidden sources' messages and releases.
  - `releases` count in `summarize`.
- `pnpm --filter @app/studio typecheck lint test build`, with zero warnings.
- In the browser, at 1440 and 375:
  - Hover, arrow keys and tap each show the card at the right cell.
  - The card flips near the right edge and never leaves the viewport on a phone.
  - Hiding Canvas One removes its rings and updates the tiles.
  - Draw-in runs once on scroll and is absent under emulated reduced motion.
  - No hydration warnings.

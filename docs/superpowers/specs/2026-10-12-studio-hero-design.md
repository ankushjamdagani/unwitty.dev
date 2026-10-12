# Studio hero — design

Status: approved in brainstorming, 2026-10-12. Scope: `apps/studio` home hero only. It sits on the background from `2026-10-12-studio-background-design.md`.
Mockups: `.superpowers/brainstorm/90056-1791795619/content/` (`hero-layouts`, `status-pill`, `hero-copy`, `hero-copy-v2`).

## Goal

Move the hero from headline-plus-byline to an editorial stack that has typographic craft, a live signal, context for first-time visitors, and a sense of a suite of tools. It stays quiet, with no gimmicks.

## Layout (top to bottom)

1. **Status ticker**: a pill that cycles through live updates.
2. **Headline**: "I make tools for *thinking.*"
3. **Intro**:
   > A set of tools for the work before the code: sketching, simulating and shipping ideas, made with care.

   On a second line in muted text: **unwitty** · a one-person studio.
4. **Actions**: "See the work ↓" (primary, `#projects`) and "About me" (secondary, `#about`).
5. **Suite strip**: a hairline rule, a "The suite" label on the left, and product chips on the right.

## Headline

- Copy: `profile.headline`. The last word renders in Newsreader italic, weight 300, `letter-spacing: -0.02em`. Everything else uses the current Geist 500 style.
- The italic word is configured as `profile.headlineEmphasis = "thinking."`. The component splits the headline on it, so no markup lives in config.
- Reveal on first paint: each word rises `0.35em` from a `4px` blur with opacity 0, over 700ms with `cubic-bezier(.2,.7,.2,1)`, staggered 60ms apart. It is CSS only (inline `animation-delay` per word), and the server renders the final text.
- Under `prefers-reduced-motion: reduce` there is no animation. The `h1` keeps its accessible name as one plain string through `aria-label`, and the word spans get `aria-hidden`.

## Intro

- `profile.intro` holds the sentence and `profile.studioLine` holds "a one-person studio". The wordmark comes from a new `profile.studio = "unwitty"`.
- Style: 15px/1.55 in `text-fg-body`, max width about 470px. The second line is `text-fg-subtle`, with the wordmark in `text-fg-body`, weight 500.

## Status ticker (`StatusTicker.tsx`, client)

**Items**, built on the server by `getHeroUpdates()` in `lib/data.ts`:
1. One **release** item per product that has a dated release: "Canvas One v0.4.12 shipped" plus a relative time, sorted newest first. The dot uses the product's `brand.accent`. The link is `#projects/<slug>`.
2. One **commit** item: the newest commit across all product repos and `extraSources`, shown as "Last commit" plus relative time · `<repo name>`. The dot is `#404040`. The link is the commit's `html_url`, opened in a new tab.

Each item is `{ kind, label, at: ISO string, href, color, external }`.

**Relative time** is computed on the client from `at`, using `Intl.RelativeTimeFormat` ("2h ago", "3 days ago"). It refreshes every minute. The server renders an absolute fallback ("12 Oct") so there is no hydration mismatch, and the relative text replaces it after mount.

**Motion: vertical ticker.**
- Every 4s the current message slides up and out (`translateY(-100%)` with opacity 0) and the next one slides up from below, over 500ms with `cubic-bezier(.2,.7,.2,1)`.
- The pill width animates to fit each message over 450ms. The width is measured from a hidden copy.
- Rotation pauses on hover and on focus-within.
- Under reduced motion it does not rotate: it shows the first item and the visitor tabs through the links.
- With one item it does not rotate. With none, the ticker is not rendered.

**Chrome:**
- A 6px coloured dot with a 3px halo at 15% alpha.
- The message text is 12px Geist Mono.
- An `n/N` counter in `text-fg-subtle`, shown only when there are two or more items.

**Accessibility:**
- The ticker is a `ul` of links. Only the visible one is focusable; the others are `aria-hidden` while hidden.
- It is not an `aria-live` region, so rotation is not announced.
- The whole pill is the link's hit target, at least 30px tall.

## Suite strip (`SuiteStrip.tsx`, server)

- One chip per product in `products.ts`: the `ProductIcon` (or its monogram) on a `brand.accent` tile, then the product name. The link is `#projects/<slug>`.
- It ends with a ghost chip "Next on the bench", which has a dashed hairline border, muted text, and no link.
- On phones the strip wraps under its label.

## Reel deep links

- The ticker and suite chips link to `#projects/<slug>`.
- `ProjectsReel` reads `location.hash` on mount and on `hashchange`. If the slug matches, it selects that product, holds auto-advance, and scrolls `#projects` into view. Smooth scrolling is skipped under reduced motion.
- Unknown slugs fall back to plain `#projects` behaviour.

## Data

- `github.ts`: add `fetchLatestCommit(repo)`. It calls `GET /repos/{o}/{r}/commits?per_page=1&author=<login>` with `next: { revalidate: 3600, tags: ["github"] }`, and returns `{ sha, url, date } | null`.
- `data.ts`: add `getHeroUpdates(products)`. It reuses the release dates already parsed in `getProducts()` and calls `fetchLatestCommit` for every tracked repo in parallel, wrapped in `safely()`. It returns the release items first, then the commit item.
- Page revalidation: the hourly fetch lowers the effective ISR interval for `/` to 1h. All other GitHub fetches keep their own 24h cache. That is about one extra API call per repo per hour.
- `profile.ts` gains `headlineEmphasis`, `intro`, `studio` and `studioLine`.

## Files

| File | Change |
|---|---|
| `src/app/_components/Hero.tsx` | Rewritten as the stack above; receives `updates` and `products` |
| `src/app/_components/HeroHeadline.tsx` | New. Splits the headline into words and adds the italic emphasis and the reveal |
| `src/app/_components/StatusTicker.tsx` | New, client |
| `src/app/_components/SuiteStrip.tsx` | New |
| `src/app/_components/ProjectsReel/ProjectsReel.tsx` | Hash deep links |
| `src/app/page.tsx` | Fetches hero updates and passes them down |
| `src/lib/github.ts`, `src/lib/data.ts` | Fetcher and builder |
| `src/lib/format.ts` | `formatRelative(at, now)` |
| `src/config/profile.ts` | New fields |

## Non-goals

- No hand-written "now" notes. No contribution-stat item.
- No ticker controls (arrows or dots) beyond pausing on hover or focus.
- No change to the reel itself beyond deep links.

## Verification

- Unit tests (vitest):
  - `getHeroUpdates` ordering. It must not depend on network, so fixtures go into a pure builder.
  - `formatRelative` boundaries: just now, minutes, hours, days, weeks.
  - Headline split on the emphasis word.
- `pnpm --filter @app/studio typecheck lint test build`, with zero warnings.
- Browser checks:
  - Screenshots at 1440 and 375 wide.
  - The ticker rotates and pauses on hover and focus.
  - A release item opens Canvas One's tab and scrolls to the reel.
  - The commit item opens GitHub in a new tab.
  - With reduced motion emulated, there is no reveal and no rotation.
  - No hydration warnings in the console.

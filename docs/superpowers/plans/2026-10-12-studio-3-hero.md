# Studio hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the hero into an editorial stack with five parts, top to bottom:
1. A rotating status ticker showing the latest releases and the last commit.
2. A headline with an italic accent and a word-by-word reveal.
3. An intro.
4. Two action buttons.
5. A "suite" strip of products.

The suite strip and the ticker link into the reel through `#projects/<slug>`.

**Architecture:**
- Pure builders in `src/lib/hero.ts` (`buildHeroUpdates`, `splitHeadline`) are unit-tested.
- `data.ts` gathers inputs: release data already loaded, plus a new hourly `fetchLatestCommit`.
- Server components: `HeroHeadline`, `SuiteStrip`, `Hero`.
- `StatusTicker` is a client island that handles rotation, measured width and relative time.
- `ProjectsReel` reads `#projects/<slug>`.

**Tech Stack:** Next.js 15 App Router (ISR), React 19, Tailwind CSS 3, TypeScript, Vitest.

**Spec:** `docs/superpowers/specs/2026-10-12-studio-hero-design.md`

**Order:** Plan 3 of 5. Requires plan 1 (`DotField`) and plan 2 (`.emphasis`).

## Global Constraints

- App: `apps/studio` only. Do not touch `apps/web`.
- Light theme only; use theme tokens.
- Named exports only. `@/` maps to `apps/studio/src/`.
- ESLint runs with `--max-warnings 0`. `pnpm` only.
- `GITHUB_TOKEN` is read only from the environment, on the server. Never ship it to the client.
- Respect `prefers-reduced-motion`: no reveal and no rotation.
- Intro copy, verbatim: "A set of tools for the work before the code: sketching, simulating and shipping ideas, made with care." Second line: "unwitty · a one-person studio".
- Ticker timing: rotate every 4000ms; slide 500ms `cubic-bezier(.2,.7,.2,1)`; width 450ms. Latest-commit fetch revalidates every 3600s.
- Headline reveal: 700ms `cubic-bezier(.2,.7,.2,1)`, staggered 60ms per word, from `translateY(.35em)` and `blur(4px)`.
- Every commit message ends with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## File Structure

| File | Responsibility |
|---|---|
| `src/lib/format.ts` | `formatRelative(at, now)` |
| `src/lib/format.test.ts` | Tests for `formatRelative`. Already exists from plan 2; add to it |
| `src/lib/hero.ts` (new) | `HeroUpdate` type, `buildHeroUpdates`, `splitHeadline` |
| `src/lib/hero.test.ts` (new) | Tests for both builders |
| `src/lib/github.ts` | `fetchLatestCommit(repo, author?)` |
| `src/lib/data.ts` | `getHeroUpdates(products)` |
| `src/lib/usePrefersReducedMotion.ts` (new) | Shared hook, moved out of `ProjectsReel` |
| `src/config/profile.ts` | `headlineEmphasis`, `intro`, `studio`, `studioLine` |
| `src/app/_styles/globals.css` | `.hero-word` and its keyframes |
| `src/app/_components/HeroHeadline.tsx` (new) | Split headline with reveal |
| `src/app/_components/StatusTicker.tsx` (new, client) | Rotating status pill |
| `src/app/_components/SuiteStrip.tsx` (new) | Product chips plus the "Next on the bench" chip |
| `src/app/_components/Hero.tsx` | Rewritten stack |
| `src/app/page.tsx` | Fetches hero updates and passes them |
| `src/app/_components/ProjectsReel/ProjectsReel.tsx` | Shared hook; `#projects/<slug>` deep links |

All paths below are relative to `apps/studio/`.

---

### Task 1: `formatRelative` (TDD)

**Files:**
- Modify: `src/lib/format.test.ts`
- Modify: `src/lib/format.ts`

**Interfaces:**
- Produces: `export function formatRelative(at: string, now: Date): string`. It returns strings like `"just now"`, `"5 minutes ago"`, `"yesterday"` or `"2 weeks ago"`.

- [ ] **Step 1: Write the failing tests.** In `src/lib/format.test.ts`, change the import to `import { formatLocalTime, formatRelative } from "./format";`, then append:

```ts

describe("formatRelative", () => {
  const now = new Date("2026-10-12T12:00:00Z");
  const ago = (seconds: number) => new Date(now.getTime() - seconds * 1000).toISOString();

  it.each([
    [30, "just now"],
    [5 * 60, "5 minutes ago"],
    [2 * 3600, "2 hours ago"],
    [86_400, "yesterday"],
    [3 * 86_400, "3 days ago"],
    [14 * 86_400, "2 weeks ago"],
  ])("%i seconds ago → %s", (seconds, expected) => {
    expect(formatRelative(ago(seconds), now)).toBe(expected);
  });
});
```

- [ ] **Step 2: Run and confirm failure.** Run `pnpm --filter @app/studio test -- format`. Expected: FAIL, because `formatRelative` is not exported.

- [ ] **Step 3: Implement.** Append to `src/lib/format.ts`:

```ts

const RELATIVE = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 31_536_000],
  ["month", 2_592_000],
  ["week", 604_800],
  ["day", 86_400],
  ["hour", 3_600],
  ["minute", 60],
];

/** "just now", "5 minutes ago", "yesterday", "2 weeks ago". */
export function formatRelative(at: string, now: Date): string {
  const seconds = Math.round((new Date(at).getTime() - now.getTime()) / 1000);
  for (const [unit, size] of UNITS) {
    if (Math.abs(seconds) >= size) return RELATIVE.format(Math.trunc(seconds / size), unit);
  }
  return "just now";
}
```

- [ ] **Step 4: Run and confirm pass.** Run `pnpm --filter @app/studio test`. Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add apps/studio/src/lib/format.ts apps/studio/src/lib/format.test.ts
git commit -m "feat(studio): formatRelative helper

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Hero builders (TDD)

**Files:**
- Create: `src/lib/hero.ts`
- Create: `src/lib/hero.test.ts`

**Interfaces:**
- Produces:

```ts
export type HeroUpdate = {
  kind: "release" | "commit";
  /** Text before the relative time, e.g. "Canvas One v0.4.12 shipped" or "Last commit". */
  text: string;
  /** Text after the relative time, e.g. " · canvas-one" (may be ""). */
  suffix: string;
  /** ISO timestamp. */
  at: string;
  href: string;
  color: string;
  external: boolean;
};
export type ReleaseInput = { slug: string; name: string; color: string; version: string | null; date: string | null };
export type CommitInput = { repoName: string; url: string; date: string } | null;
export const COMMIT_COLOR = "#404040";
export function buildHeroUpdates(releases: ReleaseInput[], commits: CommitInput[]): HeroUpdate[];
export type HeadlineWord = { text: string; emphasis: boolean };
export function splitHeadline(headline: string, emphasis?: string): HeadlineWord[];
```

- [ ] **Step 1: Write the failing tests.** Create `src/lib/hero.test.ts`:

```ts
import { describe, expect, it } from "vitest";

import { buildHeroUpdates, COMMIT_COLOR, splitHeadline } from "./hero";

describe("buildHeroUpdates", () => {
  const releases = [
    { slug: "a", name: "Alpha", color: "#111", version: "1.0.0", date: "2026-09-01" },
    { slug: "b", name: "Beta", color: "#222", version: "0.2.0", date: "2026-10-01" },
    { slug: "c", name: "Gamma", color: "#333", version: null, date: null },
  ];

  it("lists dated releases newest first, then the newest commit", () => {
    const updates = buildHeroUpdates(releases, [
      { repoName: "alpha", url: "https://x/1", date: "2026-10-10T08:00:00Z" },
      null,
      { repoName: "beta", url: "https://x/2", date: "2026-10-11T08:00:00Z" },
    ]);
    expect(updates.map((u) => u.text)).toEqual(["Beta v0.2.0 shipped", "Alpha v1.0.0 shipped", "Last commit"]);
    expect(updates[0]).toMatchObject({ kind: "release", href: "#projects/b", color: "#222", external: false, suffix: "" });
    expect(updates[2]).toMatchObject({
      kind: "commit",
      suffix: " · beta",
      href: "https://x/2",
      at: "2026-10-11T08:00:00Z",
      color: COMMIT_COLOR,
      external: true,
    });
  });

  it("returns only releases when no commit is known", () => {
    expect(buildHeroUpdates(releases, [null]).map((u) => u.kind)).toEqual(["release", "release"]);
  });

  it("returns nothing when there is no data", () => {
    expect(buildHeroUpdates([], [])).toEqual([]);
  });
});

describe("splitHeadline", () => {
  it("splits words and marks the emphasis", () => {
    expect(splitHeadline("I make tools for thinking.", "thinking.")).toEqual([
      { text: "I", emphasis: false },
      { text: "make", emphasis: false },
      { text: "tools", emphasis: false },
      { text: "for", emphasis: false },
      { text: "thinking.", emphasis: true },
    ]);
  });

  it("keeps words after the emphasis", () => {
    expect(splitHeadline("tools for thinking, daily", "thinking,").map((w) => w.text)).toEqual([
      "tools",
      "for",
      "thinking,",
      "daily",
    ]);
  });

  it("works without an emphasis", () => {
    expect(splitHeadline("Hello world").every((w) => !w.emphasis)).toBe(true);
  });
});
```

- [ ] **Step 2: Run and confirm failure.** Run `pnpm --filter @app/studio test -- hero`. Expected: FAIL, because the module `./hero` is not found.

- [ ] **Step 3: Implement.** Create `src/lib/hero.ts`:

```ts
export type HeroUpdate = {
  kind: "release" | "commit";
  /** Text before the relative time, e.g. "Canvas One v0.4.12 shipped" or "Last commit". */
  text: string;
  /** Text after the relative time, e.g. " · canvas-one" (may be ""). */
  suffix: string;
  /** ISO timestamp. */
  at: string;
  href: string;
  color: string;
  external: boolean;
};

export type ReleaseInput = {
  slug: string;
  name: string;
  color: string;
  version: string | null;
  date: string | null;
};

export type CommitInput = { repoName: string; url: string; date: string } | null;

export const COMMIT_COLOR = "#404040";

/** Ticker items: dated releases newest first, then the single newest commit. */
export function buildHeroUpdates(releases: ReleaseInput[], commits: CommitInput[]): HeroUpdate[] {
  const releaseItems = releases
    .flatMap((r) => (r.version && r.date ? [{ ...r, version: r.version, date: r.date }] : []))
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(
      (r): HeroUpdate => ({
        kind: "release",
        text: `${r.name} v${r.version} shipped`,
        suffix: "",
        at: `${r.date}T00:00:00Z`,
        href: `#projects/${r.slug}`,
        color: r.color,
        external: false,
      }),
    );

  const latest = commits
    .filter((c): c is NonNullable<CommitInput> => c !== null)
    .sort((a, b) => b.date.localeCompare(a.date))[0];
  if (!latest) return releaseItems;

  return [
    ...releaseItems,
    {
      kind: "commit",
      text: "Last commit",
      suffix: ` · ${latest.repoName}`,
      at: latest.date,
      href: latest.url,
      color: COMMIT_COLOR,
      external: true,
    },
  ];
}

export type HeadlineWord = { text: string; emphasis: boolean };

/** Splits the headline into words; the last occurrence of `emphasis` becomes one emphasised word. */
export function splitHeadline(headline: string, emphasis?: string): HeadlineWord[] {
  const words = (text: string) =>
    text
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => ({ text: w, emphasis: false }));

  const at = emphasis ? headline.lastIndexOf(emphasis) : -1;
  if (!emphasis || at < 0) return words(headline);
  return [
    ...words(headline.slice(0, at)),
    { text: emphasis, emphasis: true },
    ...words(headline.slice(at + emphasis.length)),
  ];
}
```

- [ ] **Step 4: Run and confirm pass.** Run `pnpm --filter @app/studio test`. Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add apps/studio/src/lib/hero.ts apps/studio/src/lib/hero.test.ts
git commit -m "feat(studio): hero update and headline builders

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Latest commit fetch and `getHeroUpdates`

**Files:**
- Modify: `src/lib/github.ts`
- Modify: `src/lib/data.ts`

**Interfaces:**
- Consumes: `buildHeroUpdates` and `HeroUpdate` (Task 2).
- Produces:
  - `fetchLatestCommit(repo: Product["repo"], author?: string): Promise<{ url: string; date: string } | null>`
  - `getHeroUpdates(products: ProductWithLog[]): Promise<HeroUpdate[]>`

- [ ] **Step 1: Let `get` take a revalidate value.** In `src/lib/github.ts`, replace the `get` function with:

```ts
async function get(url: string, accept?: string, revalidate = REVALIDATE_SECONDS): Promise<Response> {
  const res = await fetch(url, {
    headers: headers(accept),
    next: { revalidate, tags: ["github"] },
  });
  if (!res.ok) throw new Error(`GitHub ${res.status} for ${url}`);
  return res;
}
```

- [ ] **Step 2: Add `fetchLatestCommit`.** Append to `src/lib/github.ts`:

```ts

/** The latest-commit line in the hero is refreshed hourly; this lowers the page's ISR interval to 1h. */
const LATEST_COMMIT_REVALIDATE_SECONDS = 3_600;

type LatestCommitItem = { html_url: string; commit: { author: { date: string } | null } };

/** The newest commit on the branch (optionally by `author`), or null. */
export async function fetchLatestCommit(
  repo: Product["repo"],
  author?: string,
): Promise<{ url: string; date: string } | null> {
  const query =
    "per_page=1" +
    (repo.branch ? `&sha=${encodeURIComponent(repo.branch)}` : "") +
    (author ? `&author=${encodeURIComponent(author)}` : "");
  const res = await get(
    `${API}/repos/${repo.owner}/${repo.name}/commits?${query}`,
    undefined,
    LATEST_COMMIT_REVALIDATE_SECONDS,
  );
  const [item] = (await res.json()) as LatestCommitItem[];
  const date = item?.commit.author?.date;
  return item && date ? { url: item.html_url, date } : null;
}
```

- [ ] **Step 3: Add `getHeroUpdates`.** In `src/lib/data.ts`:
  - Change the github import to `import { fetchChangelog, fetchCommitDays, fetchContributionDays, fetchLatestCommit } from "./github";`
  - Add `import { buildHeroUpdates, type CommitInput, type HeroUpdate } from "./hero";` after the changelog import.
  - Append:

```ts

/** Status ticker items: each product's latest dated release plus the newest commit across tracked repos. */
export async function getHeroUpdates(list: ProductWithLog[]): Promise<HeroUpdate[]> {
  const releases = list.map((p) => ({
    slug: p.slug,
    name: p.name,
    color: p.brand.accent,
    version: p.version,
    date: p.log.find((entry) => entry.version === p.version)?.date ?? null,
  }));

  const commits = await Promise.all(
    [...list, ...extraSources].map(async (source): Promise<CommitInput> => {
      try {
        const commit = await fetchLatestCommit(source.repo, profile.githubLogin);
        return commit && { repoName: source.repo.name, url: commit.url, date: commit.date };
      } catch (error) {
        console.warn(`[studio] latest commit unavailable for ${source.slug}:`, error);
        return null;
      }
    }),
  );

  return buildHeroUpdates(releases, commits);
}
```

- [ ] **Step 4: Check.** Run `pnpm --filter @app/studio typecheck && pnpm --filter @app/studio lint`. Expected: both pass.

- [ ] **Step 5: Commit**

```bash
git add apps/studio/src/lib/github.ts apps/studio/src/lib/data.ts
git commit -m "feat(studio): latest commit fetch and hero updates

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Shared reduced-motion hook and reel deep links

**Files:**
- Create: `src/lib/usePrefersReducedMotion.ts`
- Modify: `src/app/_components/ProjectsReel/ProjectsReel.tsx`

**Interfaces:**
- Produces:
  - `export function usePrefersReducedMotion(): boolean`, used by `StatusTicker` and the reel plan.
  - `ProjectsReel` selects the product whose slug matches the URL hash `#projects/<slug>`.

- [ ] **Step 1: Create the hook.** Create `src/lib/usePrefersReducedMotion.ts`:

```ts
import { useEffect, useState } from "react";

/** True when the user asks for reduced motion. False during SSR and the first client render. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return reduced;
}
```

- [ ] **Step 2: Use the shared hook in `ProjectsReel`.** In `ProjectsReel.tsx`:
  - Delete the local `function usePrefersReducedMotion() { ... }` (lines 14–24).
  - Add `import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";` after the `@/lib/data` import.

- [ ] **Step 3: Add the deep-link effect.** In `ProjectsReel.tsx`, after the effect commented `// Videos pause while the reader is hovering or focused inside the reel.` (the one ending `}, [held, reduced, index]);`), add:

```tsx

  // Deep links from the hero (#projects/<slug>) select that product and hold the reel.
  useEffect(() => {
    const select = () => {
      const match = /^#projects\/(.+)$/.exec(window.location.hash);
      if (!match) return;
      const i = products.findIndex((p) => p.slug === decodeURIComponent(match[1] ?? ""));
      if (i < 0) return;
      go(i);
      setHeld(true);
      document.getElementById("projects")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    };
    select();
    window.addEventListener("hashchange", select);
    return () => window.removeEventListener("hashchange", select);
  }, [products, go, reduced]);
```

- [ ] **Step 4: Check.** Run `pnpm --filter @app/studio typecheck && pnpm --filter @app/studio lint`. Expected: both pass.

- [ ] **Step 5: Commit**

```bash
git add apps/studio/src/lib/usePrefersReducedMotion.ts apps/studio/src/app/_components/ProjectsReel/ProjectsReel.tsx
git commit -m "feat(studio): shared reduced-motion hook, reel deep links

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: `HeroHeadline`, `StatusTicker` and `SuiteStrip`

**Files:**
- Modify: `src/config/profile.ts`
- Modify: `src/app/_styles/globals.css`
- Create: `src/app/_components/HeroHeadline.tsx`
- Create: `src/app/_components/StatusTicker.tsx`
- Create: `src/app/_components/SuiteStrip.tsx`

**Interfaces:**
- Consumes:
  - `splitHeadline` and `HeroUpdate` (Task 2)
  - `formatRelative` (Task 1) and `formatDay`
  - `usePrefersReducedMotion` (Task 4)
  - `ProductIcon`
  - `.emphasis` (plan 2)
- Produces:
  - `HeroHeadline()`
  - `StatusTicker({ updates }: { updates: HeroUpdate[] })`
  - `SuiteStrip({ products }: { products: Product[] })`
  - `profile.headlineEmphasis`, `profile.intro`, `profile.studio` and `profile.studioLine`

- [ ] **Step 1: Add the profile fields.** In `src/config/profile.ts`, after `headline: "I make tools for thinking.",`, add:

```ts
  /** Rendered in italic serif inside the headline. */
  headlineEmphasis: "thinking.",
  intro: "A set of tools for the work before the code: sketching, simulating and shipping ideas, made with care.",
  studio: "unwitty",
  studioLine: "a one-person studio",
```

- [ ] **Step 2: Add the reveal CSS.** In `globals.css`, inside `@layer components`, after `.emphasis`, add:

```css
  /* Hero headline: each word rises in once on load. */
  .hero-word {
    display: inline-block;
    animation: hero-rise 700ms cubic-bezier(0.2, 0.7, 0.2, 1) both;
  }
```

At the end of the file, before `@media print`, add:

```css
@keyframes hero-rise {
  from {
    opacity: 0;
    transform: translateY(0.35em);
    filter: blur(4px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-word {
    animation: none;
  }
}
```

- [ ] **Step 3: Create `HeroHeadline.tsx`.**

```tsx
import { profile } from "@/config/profile";
import { splitHeadline } from "@/lib/hero";

/** The headline as words that rise in one after another; the accessible name stays one plain string. */
export function HeroHeadline() {
  const words = splitHeadline(profile.headline, profile.headlineEmphasis);

  return (
    <h1
      id="intro"
      aria-label={profile.headline}
      className="m-0 text-[clamp(44px,5.6vw,76px)] font-medium leading-[0.98] tracking-[-0.045em]"
    >
      {words.map((word, i) => (
        <span key={i} aria-hidden>
          {i > 0 && " "}
          <span
            className={word.emphasis ? "hero-word emphasis" : "hero-word"}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            {word.text}
          </span>
        </span>
      ))}
    </h1>
  );
}
```

- [ ] **Step 4: Create `StatusTicker.tsx`.**

```tsx
"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { formatDay, formatRelative } from "@/lib/format";
import type { HeroUpdate } from "@/lib/hero";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

const ROTATE_MS = 4000;

/** Current time after mount (null during SSR so hydration matches), refreshed every minute. */
function useNow(): Date | null {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

function message(update: HeroUpdate, now: Date | null): string {
  const when = now ? formatRelative(update.at, now) : formatDay(update.at.slice(0, 10));
  return `${update.text} ${when}${update.suffix}`;
}

/** Status pill cycling through live updates with a vertical slide. Pauses on hover and focus. */
export function StatusTicker({ updates }: { updates: HeroUpdate[] }) {
  const [index, setIndex] = useState(0);
  const [held, setHeld] = useState(false);
  const [width, setWidth] = useState<number | null>(null);
  const reduced = usePrefersReducedMotion();
  const now = useNow();
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const count = updates.length;
  const rotates = count > 1 && !reduced;

  useEffect(() => {
    if (!rotates || held) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % count), ROTATE_MS);
    return () => window.clearInterval(id);
  }, [rotates, held, count]);

  // The window animates to the active message's width.
  useLayoutEffect(() => {
    const el = itemRefs.current[index];
    if (el) setWidth(el.offsetWidth);
  }, [index, now]);

  const current = updates[index];
  if (!current) return null;

  return (
    <div
      className="inline-flex h-[30px] max-w-full items-center gap-2 rounded-full bg-surface pl-2.5 pr-3 font-mono text-[12px] text-fg-body shadow-[0_0_0_1px_rgb(0_0_0/0.08),0_1px_2px_rgb(0_0_0/0.04)]"
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setHeld(false);
      }}
    >
      <span
        aria-hidden
        className="size-1.5 shrink-0 rounded-full transition-colors duration-300"
        style={{
          background: current.color,
          boxShadow: `0 0 0 3px color-mix(in srgb, ${current.color} 15%, transparent)`,
        }}
      />
      <ul
        className="relative m-0 h-[30px] min-w-0 list-none overflow-hidden p-0 transition-[width] duration-[450ms] ease-[cubic-bezier(.2,.7,.2,1)]"
        style={width === null ? undefined : { width }}
      >
        {updates.map((update, i) => {
          const active = i === index;
          const previous = i === (index - 1 + count) % count && count > 1;
          const position = active ? "translate-y-0 opacity-100" : previous ? "-translate-y-full opacity-0" : "translate-y-full opacity-0";
          return (
            <li
              key={update.href}
              aria-hidden={!active}
              className={`${width === null && active ? "relative" : "absolute"} left-0 top-0 transition-[transform,opacity] duration-500 ease-[cubic-bezier(.2,.7,.2,1)] ${position}`}
            >
              <a
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                href={update.href}
                tabIndex={active ? 0 : -1}
                {...(update.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="block whitespace-nowrap leading-[30px] hover:text-fg"
              >
                {message(update, now)}
                {update.external && <span className="sr-only"> (opens in a new tab)</span>}
              </a>
            </li>
          );
        })}
      </ul>
      {count > 1 && (
        <span aria-hidden className="shrink-0 text-[10.5px] text-fg-subtle">
          {index + 1}/{count}
        </span>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Create `SuiteStrip.tsx`.**

```tsx
import type { Product } from "@/config/types";

import { ProductIcon } from "./ProjectsReel/ProductIcon";

/** "The suite": one chip per product, plus an empty slot for what's next. */
export function SuiteStrip({ products }: { products: Product[] }) {
  return (
    <div className="mt-9 flex flex-wrap items-center justify-between gap-3 border-t border-line/[0.06] pt-4">
      <span className="font-mono text-[10.5px] uppercase tracking-[0.06em] text-fg-subtle">The suite</span>
      <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
        {products.map((product) => (
          <li key={product.slug}>
            <a
              href={`#projects/${product.slug}`}
              className="inline-flex items-center gap-2 rounded-[10px] bg-surface py-1.5 pl-1.5 pr-2.5 text-[12.5px] font-medium shadow-[0_0_0_1px_rgb(0_0_0/0.07)] transition-shadow hover:shadow-hairline"
            >
              <ProductIcon {...product} size={22} />
              {product.name}
            </a>
          </li>
        ))}
        <li className="inline-flex items-center gap-2 rounded-[10px] border border-dashed border-line/[0.15] py-1.5 pl-1.5 pr-2.5 text-[12.5px] text-fg-subtle">
          <span aria-hidden className="size-[22px] rounded-md border border-dashed border-line/[0.18]" />
          Next on the bench
        </li>
      </ul>
    </div>
  );
}
```

- [ ] **Step 6: Check.** Run `pnpm --filter @app/studio typecheck && pnpm --filter @app/studio lint`. Expected: both pass, with 0 warnings.

- [ ] **Step 7: Commit**

```bash
git add apps/studio/src/config/profile.ts apps/studio/src/app/_styles/globals.css apps/studio/src/app/_components/HeroHeadline.tsx apps/studio/src/app/_components/StatusTicker.tsx apps/studio/src/app/_components/SuiteStrip.tsx
git commit -m "feat(studio): hero headline reveal, status ticker and suite strip

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Assemble the hero and wire the page

**Files:**
- Modify: `src/app/_components/Hero.tsx` (full replacement)
- Modify: `src/app/page.tsx` (full replacement)

**Interfaces:**
- Consumes: everything from Tasks 3–5, plus `DotField` (plan 1).
- Produces: `Hero({ updates, products }: { updates: HeroUpdate[]; products: Product[] })`.

- [ ] **Step 1: Replace `Hero.tsx`.**

```tsx
import { profile } from "@/config/profile";
import type { Product } from "@/config/types";
import type { HeroUpdate } from "@/lib/hero";

import { DotField } from "./DotField";
import { HeroHeadline } from "./HeroHeadline";
import { StatusTicker } from "./StatusTicker";
import { SuiteStrip } from "./SuiteStrip";

type Props = { updates: HeroUpdate[]; products: Product[] };

export function Hero({ updates, products }: Props) {
  return (
    <section aria-labelledby="intro" className="relative isolate pb-14 pt-16 sm:pt-24">
      <DotField fade="top" />
      <StatusTicker updates={updates} />
      <div className="mt-5">
        <HeroHeadline />
      </div>
      <p className="m-0 mt-5 max-w-[470px] text-[15px] leading-[1.55] text-fg-body">
        {profile.intro}
        <br />
        <span className="text-fg-subtle">
          <span className="font-medium text-fg-body">{profile.studio}</span> · {profile.studioLine}
        </span>
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        <a href="#projects" className="btn-primary">
          See the work <span aria-hidden>↓</span>
        </a>
        <a href="#about" className="btn-secondary">
          About me
        </a>
      </div>
      <SuiteStrip products={products} />
    </section>
  );
}
```

- [ ] **Step 2: Replace `page.tsx`.**

```tsx
import { activitySwatches, getActivity, getHeroUpdates, getProducts } from "@/lib/data";

import { About } from "./_components/About";
import { Activity } from "./_components/Activity";
import { Hero } from "./_components/Hero";
import { ProjectsReel } from "./_components/ProjectsReel";

// Must be a literal; keep in sync with REVALIDATE_SECONDS in lib/github.ts.
// The hourly latest-commit fetch (fetchLatestCommit) lowers the effective interval to 1h.
export const revalidate = 86400;

export default async function Home() {
  const [products, activity] = await Promise.all([getProducts(), getActivity()]);
  const updates = await getHeroUpdates(products);

  return (
    <>
      <Hero updates={updates} products={products} />
      <ProjectsReel products={products} />
      <Activity
        grid={activity}
        sources={activitySwatches()}
        releases={Object.fromEntries(
          products.map((p) => [p.slug, new Set(p.log.filter((e) => e.date).map((e) => e.version)).size]),
        )}
      />
      <About />
    </>
  );
}
```

- [ ] **Step 3: Check.**

```bash
pnpm --filter @app/studio typecheck && pnpm --filter @app/studio lint && pnpm --filter @app/studio test && pnpm --filter @app/studio build
```

Expected: all pass. In the build output, `/` shows `Revalidate 1h`.

- [ ] **Step 4: Commit**

```bash
git add apps/studio/src/app/_components/Hero.tsx apps/studio/src/app/page.tsx
git commit -m "feat(studio): editorial hero with status ticker and suite strip

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Verify in the browser

**Files:** none.

- [ ] **Step 1: Build with real data.** Build once with a token for this command only, then start the server. Do not save the token anywhere:

```bash
GITHUB_TOKEN=$(gh auth token) pnpm --filter @app/studio build
```

Restart the `studio` server (`lsof -ti tcp:3100 | xargs kill`, then start the launch configuration).
- [ ] **Step 2: Check at 1440.** Expected:
  - The pill shows "Canvas One v0.x.y shipped N days ago" with a teal dot and `1/2`. After about 4s it slides up to "Last commit N hours ago · …" with a grey dot.
  - Hovering the pill stops the rotation.
  - The headline words rise in once, and "thinking." is italic serif.
  - The intro has two lines and the buttons are there.
  - "The suite" shows a Canvas One chip and a dashed "Next on the bench" chip.
- [ ] **Step 3: Check the links.**
  - Click the Canvas One chip. Expected: the page scrolls to the reel and the URL is `#projects/canvas-one`.
  - Click the commit item. Expected: GitHub opens in a new tab.
- [ ] **Step 4: Check reduced motion.** Emulate `prefers-reduced-motion: reduce` and reload. Expected: no word reveal and no rotation. The first item shows, and Tab reaches only the visible link.
- [ ] **Step 5: Check the console.** Expected: no hydration warnings.
- [ ] **Step 6: Check at 375.** Expected: the pill fits (ellipsis is not needed for the current copy), and nothing overflows horizontally.

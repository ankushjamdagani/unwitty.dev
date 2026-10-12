# Studio about Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the About section's dated company list with:
- a warm greeting, a portrait and fact chips
- a dateless line of company logos
- a contact card with a copy-to-clipboard email

**Architecture:** `About.tsx` stays a server component. Two small client islands handle the interactive parts:
- `LocalTime`, which shows the live clock in a timezone
- `CopyEmail`, which copies the address to the clipboard

`ContactCard` is a server component. All copy comes from `profile.ts`. `companies.ts` only supplies names and logos.

**Tech Stack:** Next.js 15 App Router, React 19, Tailwind CSS 3, TypeScript, Vitest.

**Spec:** `docs/superpowers/specs/2026-10-12-studio-about-design.md`

**Order:** Plan 2 of 5. Requires plan 1 (`DotField`, background tokens).

## Global Constraints

- App: `apps/studio` only. Do not touch `apps/web`.
- Light theme only. Colours come from theme tokens or Tailwind theme colours (`fg`, `fg-body`, `fg-muted`, `fg-subtle`, `surface`, `canvas`, `line`, `well`).
- Named exports only. `@/` maps to `apps/studio/src/`.
- ESLint runs with `--max-warnings 0`. `pnpm` only.
- Do not show company roles, dates or tenure anywhere on the site.
- Links that open a new tab carry `target="_blank" rel="noopener noreferrer"` and a visually hidden "(opens in a new tab)".
- Every commit message ends with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## File Structure

| File | Responsibility |
|---|---|
| `apps/studio/public/images/portrait.jpg` (new) | 400×400 crop of the portrait, colour (greyscale applied in CSS) |
| `apps/studio/src/config/profile.ts` | `greeting`, `facts`, `portrait`, `contact` |
| `apps/studio/src/lib/format.ts` | `formatLocalTime(date, timeZone, label)` |
| `apps/studio/src/lib/format.test.ts` (new) | Tests for `formatLocalTime` |
| `apps/studio/src/app/_styles/globals.css` | `.emphasis` (Newsreader italic), reused by the hero plan |
| `apps/studio/src/app/_components/LocalTime.tsx` (new, client) | Live clock, rendered after hydration |
| `apps/studio/src/app/_components/CopyEmail.tsx` (new, client) | Email chip with a copy button |
| `apps/studio/src/app/_components/ContactCard.tsx` (new) | The closing contact card |
| `apps/studio/src/app/_components/About.tsx` | Rewritten section |
| `apps/studio/src/app/_components/Footer.tsx` | Slimmed down to © and site |

---

### Task 1: Portrait asset and profile config

**Files:**
- Create: `apps/studio/public/images/portrait.jpg`
- Modify: `apps/studio/src/config/profile.ts`

**Interfaces:**
- Produces:
  - `profile.greeting: { lead: string; name: string }`
  - `profile.facts: { experience: string; location: string; timeZone: string; timeZoneLabel: string }`
  - `profile.portrait: string`
  - `profile.contact: { title: string; emphasis: string; blurb: string }`

- [ ] **Step 1: Crop the portrait.** The source is `apps/web/public/images/profile.png` (2715×3613, a seated person, face near x≈1390 and y≈470). Crop a 1400px square at the top centre, then resize and convert:

```bash
cd /Users/ankushjamdagani/personal/unwitty.dev
mkdir -p "$TMPDIR/portrait" && cp apps/web/public/images/profile.png "$TMPDIR/portrait/src.png"
sips -c 1400 1400 --cropOffset 0 690 "$TMPDIR/portrait/src.png" --out "$TMPDIR/portrait/crop.png"
sips -Z 400 -s format jpeg -s formatOptions 80 "$TMPDIR/portrait/crop.png" --out apps/studio/public/images/portrait.jpg
ls -l apps/studio/public/images/portrait.jpg
```

Expected: the file exists and is roughly 40KB or smaller. Open it with the Read tool to check the framing. The face and shoulders should be centred, with the head not cut off. If the framing is off, adjust the second `--cropOffset` number (the x offset) and run again.

- [ ] **Step 2: Add the profile fields.** In `apps/studio/src/config/profile.ts`, inside the `profile` object, add these lines after `githubLogin: "ankushjamdagani",`:

```ts
  /** About section greeting: "Hi, I'm" + italic name. */
  greeting: { lead: "Hi, I'm", name: "Ankush." },
  facts: {
    experience: "9+ years",
    location: "Bangalore, IN",
    timeZone: "Asia/Kolkata",
    timeZoneLabel: "IST",
  },
  portrait: "/images/portrait.jpg",
  contact: {
    title: "Have something",
    emphasis: "in mind?",
    blurb: "Roles, collaborations, or feedback on the tools.",
  },
```

- [ ] **Step 3: Typecheck.**

```bash
pnpm --filter @app/studio typecheck
```

Expected: passes.

- [ ] **Step 4: Commit**

```bash
git add apps/studio/public/images/portrait.jpg apps/studio/src/config/profile.ts
git commit -m "feat(studio): portrait and about profile fields

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: `formatLocalTime` (TDD)

**Files:**
- Create: `apps/studio/src/lib/format.test.ts`
- Modify: `apps/studio/src/lib/format.ts`

**Interfaces:**
- Produces: `export function formatLocalTime(date: Date, timeZone: string, label: string): string`. For example, it returns `"15:42 IST"`.

- [ ] **Step 1: Write the failing test.** Create `apps/studio/src/lib/format.test.ts`:

```ts
import { describe, expect, it } from "vitest";

import { formatLocalTime } from "./format";

describe("formatLocalTime", () => {
  it("formats 24h time in the given zone with a label", () => {
    expect(formatLocalTime(new Date("2026-10-12T10:12:00Z"), "Asia/Kolkata", "IST")).toBe("15:42 IST");
  });

  it("pads single-digit hours", () => {
    expect(formatLocalTime(new Date("2026-10-12T02:35:00Z"), "Asia/Kolkata", "IST")).toBe("08:05 IST");
  });
});
```

- [ ] **Step 2: Run it and confirm it fails.**

```bash
pnpm --filter @app/studio test -- format
```

Expected: FAIL with `formatLocalTime is not a function` or a matching import error.

- [ ] **Step 3: Implement.** Append to `apps/studio/src/lib/format.ts`:

```ts

/** "15:42 IST": 24-hour wall-clock time in `timeZone`, followed by `label`. */
export function formatLocalTime(date: Date, timeZone: string, label: string): string {
  const time = new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit" }).format(date);
  return `${time} ${label}`;
}
```

- [ ] **Step 4: Run the tests and confirm they pass.**

```bash
pnpm --filter @app/studio test
```

Expected: every test passes, including the 2 new ones.

- [ ] **Step 5: Commit**

```bash
git add apps/studio/src/lib/format.ts apps/studio/src/lib/format.test.ts
git commit -m "feat(studio): formatLocalTime helper

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: `LocalTime`, `CopyEmail`, `ContactCard` and the `.emphasis` style

**Files:**
- Create: `apps/studio/src/app/_components/LocalTime.tsx`
- Create: `apps/studio/src/app/_components/CopyEmail.tsx`
- Create: `apps/studio/src/app/_components/ContactCard.tsx`
- Modify: `apps/studio/src/app/_styles/globals.css`

**Interfaces:**
- Consumes: `formatLocalTime` (Task 2), and `profile.contact`, `profile.email`, `profile.resumeUrl` and `socialLinks` (Task 1).
- Produces:
  - `LocalTime({ timeZone, label })`
  - `CopyEmail({ email })`
  - `ContactCard()`
  - the global class `.emphasis`, which the hero plan uses

- [ ] **Step 1: Add `.emphasis`.** In `globals.css`, inside `@layer components`, after `.section-title`, add:

```css
  /* Italic serif accent word, e.g. "thinking." or "Ankush." */
  .emphasis {
    font-family: var(--font-newsreader), Georgia, serif;
    font-style: italic;
    font-weight: 300;
    letter-spacing: -0.02em;
  }
```

- [ ] **Step 2: Create `LocalTime.tsx`.**

```tsx
"use client";

import { useEffect, useState } from "react";

import { formatLocalTime } from "@/lib/format";

type Props = { timeZone: string; label: string };

/**
 * Live wall-clock time. The server and the first client render show only
 * `label`, so hydration matches; the time appears after mount.
 */
export function LocalTime({ timeZone, label }: Props) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  return <time dateTime={now?.toISOString()}>{now ? formatLocalTime(now, timeZone, label) : label}</time>;
}
```

- [ ] **Step 3: Create `CopyEmail.tsx`.**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";

type State = "idle" | "copied" | "manual";

const LABEL: Record<State, string> = { idle: "Copy", copied: "Copied ✓", manual: "Press ⌘C" };

/** Email chip with a copy button. Falls back to selecting the text when the clipboard is blocked. */
export function CopyEmail({ email }: { email: string }) {
  const [state, setState] = useState<State>("idle");
  const linkRef = useRef<HTMLAnchorElement>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const settle = (next: State) => {
    setState(next);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), 1400);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      settle("copied");
    } catch {
      const link = linkRef.current;
      if (link) {
        const range = document.createRange();
        range.selectNodeContents(link);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
      settle("manual");
    }
  };

  return (
    <span className="inline-flex items-center gap-2.5 rounded-[10px] bg-canvas py-1.5 pl-3.5 pr-1.5 font-mono text-[13px] shadow-hairline">
      <a ref={linkRef} href={`mailto:${email}`} className="hover:underline">
        {email}
      </a>
      <button
        type="button"
        onClick={copy}
        className="min-w-[76px] rounded-md bg-fg px-2 py-1 text-[11px] text-white transition-colors hover:bg-fg/85"
      >
        {LABEL[state]}
      </button>
      <span aria-live="polite" className="sr-only">
        {state === "copied" ? "Email copied" : ""}
      </span>
    </span>
  );
}
```

- [ ] **Step 4: Create `ContactCard.tsx`.**

```tsx
import { profile, socialLinks } from "@/config/profile";

import { CopyEmail } from "./CopyEmail";

const newTab = { target: "_blank", rel: "noopener noreferrer" } as const;

export function ContactCard() {
  const { contact } = profile;

  return (
    <div className="mt-10 flex flex-wrap items-center justify-between gap-x-7 gap-y-5 rounded-[18px] bg-surface p-[22px] shadow-[0_0_0_1px_rgb(0_0_0/0.06),0_1px_2px_rgb(0_0_0/0.04)] sm:p-7">
      <div className="min-w-0">
        <h3 className="m-0 text-[22px] font-medium tracking-[-0.03em]">
          {contact.title} <em className="emphasis">{contact.emphasis}</em>
        </h3>
        <p className="m-0 mt-1 text-fg-muted">{contact.blurb}</p>
        <p className="m-0 mt-3 flex flex-wrap gap-4 text-[13px] text-fg-body">
          {socialLinks.map((link) => (
            <a key={link.label} href={link.url} {...newTab} className="hover:text-fg">
              {link.label} <span aria-hidden>↗</span>
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          ))}
        </p>
      </div>
      <div className="flex flex-col items-start gap-2.5 sm:items-end">
        <CopyEmail email={profile.email} />
        <a href={profile.resumeUrl} {...newTab} className="btn-primary">
          View résumé <span aria-hidden>↗</span>
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Check.**

```bash
pnpm --filter @app/studio typecheck && pnpm --filter @app/studio lint
```

Expected: both pass, with 0 warnings. These components are not rendered yet; Task 4 wires them in.

- [ ] **Step 6: Commit**

```bash
git add apps/studio/src/app/_components/LocalTime.tsx apps/studio/src/app/_components/CopyEmail.tsx apps/studio/src/app/_components/ContactCard.tsx apps/studio/src/app/_styles/globals.css
git commit -m "feat(studio): local time, copy email and contact card

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Rewrite About and slim the footer

**Files:**
- Modify: `apps/studio/src/app/_components/About.tsx` (full replacement)
- Modify: `apps/studio/src/app/_components/Footer.tsx` (full replacement)

**Interfaces:**
- Consumes: `DotField` (plan 1), `LocalTime` and `ContactCard` (Task 3), the `profile` fields (Task 1), and `companies`.
- Produces: `About()`. Keeps `id="about"` and `id="about-title"`.

- [ ] **Step 1: Replace `About.tsx`.**

```tsx
import Image from "next/image";

import { companies } from "@/config/companies";
import { profile } from "@/config/profile";
import type { Company } from "@/config/types";

import { ContactCard } from "./ContactCard";
import { DotField } from "./DotField";
import { LocalTime } from "./LocalTime";

const chip = "rounded-full bg-surface px-2.5 py-1 font-mono text-[11px] text-fg-body shadow-hairline";
const label = "font-mono text-[10px] uppercase tracking-[0.06em] text-fg-subtle";

function CompanyLogo({ company }: { company: Company }) {
  const tile = company.logo ? (
    <Image
      src={company.logo}
      alt=""
      width={22}
      height={22}
      className="size-[22px] rounded-md object-cover shadow-hairline contrast-125 grayscale"
    />
  ) : (
    <span className="block size-[22px] rounded-md bg-well" />
  );
  const tip = (
    <span
      aria-hidden
      className="pointer-events-none absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded bg-fg px-1.5 py-0.5 font-mono text-[10px] text-white opacity-0 transition-opacity duration-[120ms] group-hover:opacity-100 group-focus-visible:opacity-100"
    >
      {company.name}
    </span>
  );
  const className = "group relative block rounded-md";

  return company.url ? (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${company.name} (opens in a new tab)`}
      className={className}
    >
      {tile}
      {tip}
    </a>
  ) : (
    <span tabIndex={0} role="img" aria-label={company.name} className={className}>
      {tile}
      {tip}
    </span>
  );
}

export function About() {
  const { greeting, facts } = profile;

  return (
    <section id="about" aria-labelledby="about-title" className="relative isolate pt-section">
      <DotField fade="center" />

      <div className="flex items-end justify-between gap-5">
        <div>
          <p className={`m-0 ${label}`}>About</p>
          <h2
            id="about-title"
            className="m-0 mt-2 text-[clamp(30px,4vw,38px)] font-medium leading-none tracking-[-0.045em]"
          >
            {greeting.lead} <em className="emphasis">{greeting.name}</em>
          </h2>
        </div>
        <Image
          src={profile.portrait}
          alt={`Portrait of ${profile.name}`}
          width={72}
          height={72}
          className="size-[72px] shrink-0 rounded-full object-cover shadow-hairline contrast-105 grayscale"
        />
      </div>

      <p className="m-0 mt-4 max-w-[560px] text-[15px] leading-[1.65] text-fg-body">{profile.about}</p>

      <ul className="m-0 mt-3 flex list-none flex-wrap gap-1.5 p-0">
        <li className={chip}>{facts.experience}</li>
        <li className={chip}>{facts.location}</li>
        <li className={chip}>
          <LocalTime timeZone={facts.timeZone} label={facts.timeZoneLabel} />
        </li>
      </ul>

      <div className="mt-8 flex flex-wrap items-center gap-x-3.5 gap-y-3 border-t border-line/[0.07] pt-4">
        <span className={label}>Worked with</span>
        <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
          {companies.map((company) => (
            <li key={company.name}>
              <CompanyLogo company={company} />
            </li>
          ))}
        </ul>
        <a
          href={profile.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full text-[13px] underline decoration-line/25 underline-offset-4 hover:decoration-fg sm:ml-auto sm:w-auto"
        >
          Résumé <span aria-hidden>↗</span>
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </div>

      <ContactCard />
    </section>
  );
}
```

- [ ] **Step 2: Replace `Footer.tsx`.**

```tsx
import { profile } from "@/config/profile";

export function Footer() {
  return (
    <footer className="container-content mt-section flex flex-wrap justify-between gap-3 border-t border-line/[0.06] pb-10 pt-6 text-[13px] text-fg-subtle">
      <span>
        © {new Date().getFullYear()} {profile.name}
      </span>
      <span>{profile.site}</span>
    </footer>
  );
}
```

- [ ] **Step 3: Check.**

```bash
pnpm --filter @app/studio typecheck && pnpm --filter @app/studio lint && pnpm --filter @app/studio test && pnpm --filter @app/studio build
```

Expected: all pass, and the build ends with `✓ Generating static pages`.

- [ ] **Step 4: Commit**

```bash
git add apps/studio/src/app/_components/About.tsx apps/studio/src/app/_components/Footer.tsx
git commit -m "feat(studio): greeting, logo line and contact card in about

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Verify in the browser

**Files:** none.

- [ ] **Step 1:** Restart the `studio` server (`lsof -ti tcp:3100 | xargs kill`, then start the `studio` launch configuration). Open `http://localhost:3100/#about`.
- [ ] **Step 2: Check at 1440.** Expected:
  - "Hi, I'm *Ankush.*" with "Ankush." in italic serif
  - a round greyscale avatar on the right
  - three chips, the last showing `HH:MM IST`
  - a "Worked with" line of 7 greyscale logos, with "Résumé ↗" on the right
  - the contact card below
- [ ] **Step 3: Check at 375.** Expected: the chips and logos wrap, "Résumé ↗" moves to its own line, and there is no horizontal scroll.
- [ ] **Step 4: Check keyboard access.** Tab onto each logo. Expected: a dark tooltip shows the company name. The accessibility tree (`read_page`) lists each company name as an `img`.
- [ ] **Step 5: Check Copy.** Click Copy. Expected: the button shows "Copied ✓", then "Copy" again after about 1.4s. Then block the clipboard in the console with `Object.defineProperty(navigator, "clipboard", { value: undefined })` and click again. Expected: the email text is selected and the button shows "Press ⌘C".
- [ ] **Step 6: Check the console.** Expected: no hydration warnings.
- [ ] **Step 7: Check the nav.** Expected: the nav "About" link scrolls to the section, and the footer shows `© 2026 Ankush Jamdagani` and `unwitty.dev`.

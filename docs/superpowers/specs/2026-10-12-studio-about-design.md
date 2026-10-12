# Studio about — design

Status: approved in brainstorming, 2026-10-12. Scope: `apps/studio` About section and footer.
Mockups: `.superpowers/brainstorm/90056-1791795619/content/` (`about-v2` → A2 greeting, `about-light` → P3 logo line).

## Goal

Make About warmer and more personal, and lighter on CV detail. The site's job is the first impression; the résumé carries the full history. Company tenures and roles are deliberately not shown. Seven employers in about ten years, some with short stints, would read badly as a dated list, and the bio already names the strongest three.

Dropped during brainstorming: the career timeline, expandable roles, master-detail, filmstrip, proof-point cards, and the "Open to" fact.

## Layout (top to bottom)

1. **Greeting row**
   - Left: a mono uppercase "About" label (10px, `fg-subtle`), then `h2` "Hi, I'm *Ankush.*". The `h2` is 38px (clamp it down on phones), Geist 500, `tracking -0.045em`. The name is set in Newsreader italic 300, matching the hero's emphasis.
   - Right: a round portrait, 72px, `grayscale contrast-105`, with a hairline ring. It uses `next/image` with `alt="Portrait of Ankush Jamdagani"`.
   - The `h2` keeps `id="about-title"` so the section's `aria-labelledby` and the nav `#about` link still work.
2. **Bio**: `profile.about`, 15px/1.65, `fg-body`, max width about 560px.
3. **Fact chips**: mono 11px pills on a white background with a hairline ring.
   - `facts.experience` ("9+ years")
   - `facts.location` ("Bangalore, IN")
   - `<LocalTime>` ("15:42 IST")
4. **Logo line**
   - A hairline rule above.
   - A mono "Worked with" label.
   - One 22px greyscale logo tile per entry in `companies.ts`, newest first, with no names or dates shown.
   - "Résumé ↗" pushed to the right (`profile.resumeUrl`, new tab).
5. **Contact card**: see below.

## Logo tiles

- Each tile is a `span` with `tabIndex={0}`, `role="img"` and `aria-label={company.name}`, wrapping a decorative `img` with `alt=""`. Companies without a logo show the existing `bg-well` placeholder.
- The company name appears as a tooltip on hover or focus. The tooltip is a small dark mono label above the tile, CSS only (`group-hover` / `group-focus-visible`), and fades in over 120ms. There is no fade under reduced motion.
- If `company.url` is present, the tile is an `<a>` that opens in a new tab instead of a focusable `span`.
- On phones the line wraps, and "Résumé ↗" drops to its own line, aligned left.

## Local time (`LocalTime.tsx`, client)

- Props: `timeZone`, `label`.
- The server renders just `label` ("IST"). After mount, the component renders `HH:mm IST` using `Intl.DateTimeFormat('en-GB', { timeZone, hour: '2-digit', minute: '2-digit' })` and re-renders every 30s.
- It uses a `time` element with `dateTime` set to the ISO time once mounted.
- No hydration mismatch, because the first client render equals the server render.

## Contact card (`ContactCard.tsx`)

- White, `rounded-[18px]`, hairline ring with a soft shadow, padding 22–28px. It is a flex row that wraps.
- Left side:
  - `h3` "Have something *in mind?*", with the emphasis in Newsreader italic.
  - Blurb: "Roles, collaborations, or feedback on the tools."
  - Social links from `socialLinks`, each with "↗" and opening in a new tab.
- Right side:
  - `<CopyEmail>`: a mono email chip. The email is a `mailto:` link, followed by a dark "Copy" button.
  - "View résumé ↗": a primary button that opens in a new tab.

## Copy email (`CopyEmail.tsx`, client)

- Clicking "Copy" calls `navigator.clipboard.writeText(email)`.
  - On success, the label becomes "Copied ✓" for 1.4s, and a visually hidden `aria-live="polite"` region announces "Email copied".
  - On failure (no clipboard API or permission denied), it selects the email text with a Range selection and the label becomes "Press ⌘C".
- The button keeps a fixed minimum width, so the label change doesn't shift the layout.

## Footer

The contact links move into the card, so the footer slims down to `© {year} {profile.name}` on the left and `{profile.site}` on the right, with the same styling as today.

## Config

`src/config/profile.ts` gains:

```ts
greeting: { lead: "Hi, I'm", name: "Ankush." },
facts: { experience: "9+ years", location: "Bangalore, IN", timeZone: "Asia/Kolkata", timeZoneLabel: "IST" },
portrait: "/images/portrait.jpg",
contact: { title: "Have something", emphasis: "in mind?", blurb: "Roles, collaborations, or feedback on the tools." },
```

`companies.ts` is unchanged. Only `name`, `logo` and `url` are used. `role`, dates and `highlights` stay as data for later use.

## Assets

`public/images/portrait.jpg`: a 400×400 square crop of `apps/web/public/images/profile.png`, framed on the face and shoulders, saved as JPEG at about q80 (aim for 40KB or less). The colour original is kept; greyscale is applied in CSS.

## Files

| File | Change |
|---|---|
| `src/app/_components/About.tsx` | Rewritten as the layout above |
| `src/app/_components/LocalTime.tsx` | New, client |
| `src/app/_components/CopyEmail.tsx` | New, client |
| `src/app/_components/ContactCard.tsx` | New |
| `src/app/_components/Footer.tsx` | Slimmed down |
| `src/config/profile.ts` | New fields |
| `public/images/portrait.jpg` | New |

## Verification

- `pnpm --filter @app/studio typecheck lint test build`, with zero warnings.
- Browser checks at 1440 and 375:
  - The greeting, avatar and chips align, and the logo line wraps cleanly on phones.
  - Tabbing through the logos shows each name. A screen-reader pass with the accessibility tree lists the company names.
  - Copy works. With clipboard blocked (via a JS override), the email gets selected and the label shows "Press ⌘C".
  - Local time appears after hydration, with no hydration warnings in the console.
  - The nav `#about` link still scrolls to the section.

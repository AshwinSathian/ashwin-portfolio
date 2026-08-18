# Verified Identity Redesign — Design Spec

Date: 2026-08-18
Status: Approved for implementation (direction confirmed by Ashwin 2026-08-18)

## 1. Problem

An adversarial UI/UX review of the live site (rendered via dev server + Playwright, desktop and mobile, cross-checked against every component and content file) found:

1. The visual system is a reskinned Apple HIG page — color tokens named `label-1..4`/`surface-1..4`, accent `#2997ff` (Apple's own link blue), `font-thin` headlines throughout. Distinctive to Apple, not to Ashwin.
2. Zero visual evidence of any of the five shipped products anywhere on the site — all-text case studies for UIs that include a Monaco-powered editor, a chat interface, a typing game.
3. Project card layout breaks on desktop: the left column (index/category) is dramatically shorter than the right (name/copy/stack/links), leaving large orphaned whitespace on every row.
4. Mobile hero is a fully empty black screen — no content, texture, or motion cue above a tiny "Scroll" label at the very bottom.
5. All body content below the hero renders at `opacity: 0` until an `IntersectionObserver`-driven Framer Motion animation fires. No CSS/no-JS fallback. Works on real scroll; produces a blank page under tools that don't simulate incremental scroll.
6. Contact section exposes a plaintext `tel:` personal mobile number alongside email/LinkedIn/GitHub — unnecessary spam-scraping surface for a portfolio.
7. Motion is one repeated pattern (`fadeInUp` + `stagger`) applied identically to five unrelated sections — no directional intent.
8. Typography has a single register (thin, wide-tracked, quiet) — nothing on the page is allowed to read as confident, including the name.
9. Experience bullets drift back toward LinkedIn cadence ("Directed... architecture", "Standardized... audit trails") despite the rest of the site's deliberately plainspoken voice.
10. No color or imagery anywhere except one blue accent — flat regardless of how visually different the five projects actually are.

Full findings delivered in chat 2026-08-18; this spec covers the fix.

## 2. Direction (confirmed with Ashwin)

- **Visual scope:** full new identity, not a patch. Keep the dark/minimal/technical DNA; replace the Apple-HIG palette/type system with something specific to this site.
- **Project visuals:** real screenshots — captured live for Booklet/Wayfarer/Typester, sourced from the BRNR repo's own `docs/screenshots/` for BRNR (mobile app, no public web UI to screenshot live), and a real-code terminal frame for ngx-runtime-i18n (a library, not a visual product — no screenshot to take without fabricating one).
- **Contact:** trim the public page to email + LinkedIn + GitHub. Drop the plaintext phone number from the page (résumé PDF is unaffected, that's a separate document a recruiter opts into downloading).

## 3. Design system

### 3.1 Concept: "Verified, not vibes"

Every past session on this site fought the same fight: catching a fabricated employer hidden in JSON-LD, catching stale hosting claims about Booklet, catching resume-cadence creeping into supposedly honest copy. That fact-checking discipline is the actual identity of this portfolio — it's just never been visible as a UI element. The redesign surfaces it directly: verified factual claims get a visible marker styled like a git commit trailer, instead of the discipline staying invisible editorial process.

**Guardrail against this becoming a "hacker portfolio" cliché:** the terminal/mono motif is confined to functional roles — verified-tags, meta strips, labels. Never background matrix rain, scanlines, or CRT texture. It labels facts; it doesn't set a mood.

### 3.2 Color

| Token | Hex | Role |
|---|---|---|
| `canvas` | `#0A0D10` | Base background — graphite-black, cooler than Apple's true black |
| `surface-1` | `#12161B` | Raised sections (Experience band, Platforms card) |
| `surface-2` | `#1A2027` | Cards, chips |
| `ink-1` | `#EDEFF2` | Primary text — warm-neutral white |
| `ink-2` | `#8B93A1` | Secondary text |
| `ink-3` | `#5B636F` | Tertiary/label text |
| `ink-4` | `#394048` | Quaternary — dividers, disabled |
| `signal` | `#4CE0A6` | The one loud color. Links, active nav state, verified-tags |
| `signal-hover` | `#3BC98F` | Hover/active state of signal |
| `alert` | `#E0A64C` | Rare. Disclosed tradeoffs / "in progress" callouts (same L/S as signal, rotated hue — one designed system) |
| `diff-remove` | `#C4645A` | Rarest. Explicit before/after callouts only (Typester's documented architecture fixes) |

Derived, not hand-picked: `alert` and `diff-remove` share `signal`'s lightness/saturation curve so the three read as one accent system rotated around the color wheel, not three unrelated picks.

### 3.3 Type

| Role | Face | Weights used | Why |
|---|---|---|---|
| Display (h1/h2) + body | IBM Plex Sans | 400–500 body, 600–700 display | One coherent family (not a display face bolted onto an unrelated body face), designed for a technical/enterprise identity — fits "engineer" without costume. Also sidesteps a real risk: Space Grotesk, the more obvious "distinctive" pick, is now itself one of the most common display faces in 2025–26 dev portfolios — using it to escape one cliché would land in another. |
| Utility/mono | IBM Plex Mono | 500 | Eyebrows, meta strips, verified-tags, nav labels. Same type family as the display face (Plex Sans + Plex Mono are siblings), so the system reads as one designed identity, not three unrelated typefaces stitched together. |

Two families total, down from the current site's one (Inter, doing every job at every weight). Kills finding #8: display type now has real weight contrast (600–700, not 100–300 only), and a structurally distinct mono face replaces mono-as-afterthought.

### 3.4 Layout fixes

**Project cards** (fixes finding #3): replace the broken two-column index/copy split with a stacked card — a real screenshot in a minimal browser-chrome (or terminal-chrome, for ngx-runtime-i18n) frame at a fixed aspect ratio, a monospace meta strip below it (`category · primary stack item · license`), then name/tagline/links. The image fills the vertical space that used to be empty; both "columns" (image block, copy block) now have comparable, intentional height on every row instead of one dwarfing the other.

**Mobile hero** (fixes finding #4): the empty full-black screen gets a subtle ambient signature tied to the same verified-facts motif — a small monospace status line beneath the eyebrow (e.g. a real, current fact like the project count or years of experience, styled like a terminal prompt output) that's present at first paint, not gated behind scroll. Respects `prefers-reduced-motion`; degrades to static text with no JS.

**No-JS baseline** (fixes finding #5, scoped down after review): the real failure mode is narrower than "content is blank" — on a real browser with JS running, the `IntersectionObserver` fires within a frame or two of scroll and users never perceive it (confirmed by manually scrolling the live dev build). The actual gap is only the no-JS case, where nothing ever flips the `opacity: 0` initial state. Restructuring every motion variant to fix that would risk breaking the reveal choreography for a narrow edge case where nav/menu interactivity is already broken anyway. Surgical fix instead: a `<noscript>` block in `layout.tsx` that forces `opacity: 1; transform: none` on motion-wrapped elements, so a no-JS visitor sees full static content and everyone else keeps the animation exactly as designed.

**Motion differentiation** (fixes finding #7): each section keeps `fadeInUp`/`stagger` as the base but is given one distinguishing detail instead of being visually identical:
- Hero: existing scroll-exit parallax, unchanged (it's already distinct)
- Projects: card media frames get a subtle scale-in (`0.98 → 1`) alongside the fade, so the screenshot itself feels like it's focusing into view
- Capabilities: badges stagger faster and tighter (grid-like snap, not a slow reveal) — matches "a list of tools," not "a narrative"
- Experience: the verified-tag on each role's tech line fades in ~150ms after the row, a small delayed "confirmed" beat
- Contact: unchanged (it's already a single, deliberate full-screen moment)

### 3.5 Signature element: the verified-tag

A small monospace chip, `signal`-green text on `surface-2`, styled like a git trailer: `// verified · <claim>`. Attached to:
- Each project's `facts` entries (already-structured factual data — auth model, license, persistence) on the card and detail page
- The one HighLevel/Penny Platforms card (tenure-verified band)

Not applied everywhere — only to claims that are independently verifiable (license, persistence model, auth mechanism), not to subjective copy. Overuse would flatten it into decoration; the whole point is that it marks something specific.

## 4. Content structure changes

### 4.1 Project media (new)

`Project` type in `src/app/data/projects.ts` gains:

```ts
export type ProjectMedia =
  | { kind: "screenshot"; src: string; alt: string }
  | { kind: "code"; snippet: string; language: string; caption: string };

// added to Project:
media: ProjectMedia;
```

- Booklet, Wayfarer, Typester: `kind: "screenshot"`, captured live from the production URLs already in `links.live` via Playwright, saved to `public/projects/<slug>/hero.png` (or `.webp` if size warrants).
- BRNR: `kind: "screenshot"` too, captured live from `https://brnr.ashwinsathian.com` (confirmed live and public 2026-08-18 — a `brnr-web` Cloudflare Pages deploy that existed but was never linked from `PROJECTS.links`, which is itself a gap this redesign fixes, not a pre-existing decision to preserve). The specific screen captured is BRNR's own cryptographic-fingerprint/safety-number UI, which directly matches the "Double Ratchet, safety numbers" claims already in the case study copy — a case of the screenshot and the prose corroborating each other rather than one being decorative. `links.live` gets added to BRNR's data alongside the media change. The originally-considered mobile-app screenshot (`docs/screenshots/03_chat.png`, portrait, no public URL) is not used — the web app is the only currently-published surface.
- ngx-runtime-i18n: `kind: "code"`, a real usage snippet from the project's own README/API (e.g. `provideRuntimeI18n()` setup) rendered in a terminal/editor-chrome frame — honest about it being a library, not a disguised screenshot of something that doesn't visually exist.

New component `ProjectMedia.tsx` renders one of two chrome variants (browser traffic-lights + fake URL bar for `screenshot`, terminal titlebar for `code`). A third `device`/phone-frame variant was considered for BRNR before its live web app was found, then dropped — no project needs it, and building an unused code path fails YAGNI.

### 4.2 Contact trim

`SITE` in `data/site.ts` keeps the `phone`/`phoneHref` fields as data (not deleted — the résumé PDF is a separate document a recruiter opts into, and removing the fields outright would be a bigger change than what was asked). `Contact.tsx` simply stops rendering the phone link, showing LinkedIn · GitHub only alongside the email.

### 4.3 Copy audit (humanizing-writing pass)

Targeted, not a full rewrite — most of the site's copy (Projects, Hero, Contact) already passed a dedicated AI-writing-tells cleanup on 2026-07-23 and reads well. Scope of this pass:
- `data/experience.ts`: rework the HighLevel/Penny bullets that read as LinkedIn-cadence ("Directed... architecture", "Standardized... audit trails") into the plainer, more specific register the Projects section already achieves — concrete outcomes over abstract nouns, same facts, no fabrication.
- New verified-tag copy (`// verified · ...` strings): keep terse, factual, lowercase-after-colon, no marketing adjectives.
- Sweep any newly written copy (media captions, hero status line) for em-dash overuse and the flagged-vocabulary list before finalizing, per the standing preference.

## 5. Component changes

| Component | Change |
|---|---|
| `globals.css` | New `@theme` tokens (§3.2); wire IBM Plex Sans + IBM Plex Mono CSS vars |
| `layout.tsx` | Replace Inter with IBM Plex Sans + IBM Plex Mono via `next/font/google`; add `<noscript>` motion-visibility override (§3.4) |
| `Hero.tsx` | Display type → Plex Sans 700; add mobile status-line (§3.4); name/title weight increase |
| `Projects.tsx` | Card layout rework around `ProjectMedia` (§4.1); remove sitewide opacity-0 gate, add differentiated motion (§3.4) |
| `ProjectMedia.tsx` (new) | Screenshot/code chrome-frame renderer |
| `projects/[slug]/page.tsx` | Add media block near the top of the detail page; verified-tags on `facts` |
| `Capabilities.tsx` | Tighter/faster stagger; mono labels already fit the utility-face role, keep |
| `Experience.tsx` | Verified-tag on tech line; reworked bullet copy (§4.3) |
| `Contact.tsx` | Drop phone row (§4.2) |
| `Navbar.tsx`, `Footer.tsx` | Type token swap only (display/mono per §3.3), no structural change |
| `lib/motion.ts` | Remove/adjust variants that force `opacity: 0` as the unconditional initial state; keep `whileInView` polish, but content must not depend on it to be visible (§3.4 no-JS baseline) |

No change to routing, data fetching (`getProjects`/GitHub stats), SEO/JSON-LD structure, or the writing/empty-state pages beyond the global type/color tokens.

## 6. Risks / open questions resolved during spec self-review

- **Screenshot maintenance burden**: static screenshots go stale as the live products change UI. Accepted tradeoff — same category of risk as the existing text-based facts, which already get re-verified against source per the project's standing practice; screenshots get the same "re-check before trusting" treatment next time this site is touched, not treated as permanently accurate.
- **`ProjectMedia`'s "code" variant for ngx-runtime-i18n** must show real, current API surface (verified against the actual package, not written from memory) — same fabrication risk as any other copy on this site.
- **Contact phone field**: confirmed with Ashwin to drop from the page, not delete from data model, in case another surface needs it later.
- **BRNR's missing public entry point is resolved, not just documented**: `links: {}` in the current data was a genuine gap — `brnr-web` has been live at `https://brnr.ashwinsathian.com` the whole time, just never wired into the portfolio's data. This redesign adds `links.live` for BRNR alongside its new screenshot, rather than shipping a screenshot of a product with no way to click through to it.

## 7. Testing / verification plan

- `npm run lint` and `npm run build` must pass.
- Visual verification via Playwright at desktop (1440×900) and mobile (390×844) for: home page (all sections), one project detail page, mobile nav menu — before/after screenshots to confirm each of the 10 findings is actually resolved, not just theoretically addressed.
- Manual check: reduced-motion media query still suppresses animation (existing `globals.css` rule + `usePrefersReducedMotion` hook, unchanged).
- Confirm no-JS baseline: disable JS in Playwright, load the home page, confirm body copy is present in a screenshot (not opacity-0 invisible).
- Re-verify every new factual claim (screenshot captions, verified-tag text, reworked Experience bullets) against source before commit, per standing practice on this site.

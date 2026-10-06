# Lumen Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the whole presentation layer of ashwinsathian.com with the v7 "Lumen" identity while leaving every factual claim in `src/app/data` untouched.

**Architecture:** Server components only, except the navbar (menu dialog and active route). All motion is CSS: load keyframes, `animation-timeline: view()` / `scroll()` behind `@supports`, and React `<ViewTransition>` for navigation. Content is visible by default; animation only enhances.

**Tech Stack:** Next 16.2 App Router, React 19.2, Tailwind v4 (`@theme` in CSS), `next/font/google` (Bricolage Grotesque, Geist, Geist Mono), shiki, OpenNext on Cloudflare Workers.

**Spec:** `docs/superpowers/specs/2026-10-06-lumen-rebuild-design.md`

## Global Constraints

- No hue in the interface. Tokens: `base #050505`, `surface #0C0C0D`, `surface-2 #141415`, `fg #F5F5F4`, `fg-2 #A6A6A6`, `fg-3 #8A8A8A`, `line` white 8%, `line-strong` white 16%.
- One container everywhere: max 1200px, gutters 20 / 32 / 48px. Class name `.shell`.
- Radius 10px (controls) and 16px (panels, media). No `rounded-full` chips.
- Nothing may render hidden without JavaScript. No `opacity: 0` in server HTML outside an animation that runs from CSS alone.
- Every `:hover` style has a `:active` or `:focus-visible` twin. Touch targets at least 44px.
- `prefers-reduced-motion: reduce` disables all animation and transition.
- No number, date, title, employer, technology or project fact changes. `git diff src/app/data` may show only: removal of `summary.ts`, removal of the `TODO` comment, added `width`/`height` on screenshot media, added `RECORD` copy.
- Copy avoids em dashes and stock AI vocabulary.
- One `h1` per page, no skipped heading levels.
- Dev server for checks: `npx next dev --turbopack -p 3210` (port 3000 belongs to another project).

## Review Focus

1. JavaScript disabled or slow hydration: every route must show all content. Checked in Task 9 with a JS-disabled Playwright context.
2. Very long unbroken strings (`humanize-writing-skill`, `better-auth-mongoose`, long post titles) at 320px must wrap, not overflow. Checked in Task 9 by measuring `scrollWidth` at 320px on every route.
3. GitHub API failure or rate limit: project pages must render without stats, never throw. `fetchRepoMeta` already returns `null`; Task 5 keeps stats optional in the rail.
4. Screenshots with light backgrounds on a black page: media frame needs a border and must not glow. Checked by eye in Task 9.
5. Browser without scroll timelines or view transitions (Firefox stable): page is static and complete. All such CSS sits in `@supports`; checked in Task 9 by capturing with the `@supports` block disabled.

---

## File map

| File | Responsibility |
|---|---|
| `src/app/globals.css` | Tokens, base, `.shell`, light, motion keyframes, prose |
| `src/app/layout.tsx` | Fonts, metadata, JSON-LD, skip link, nav, footer, grain |
| `src/components/Navbar.tsx` | Top bar, active route, mobile `<dialog>` sheet (client) |
| `src/components/Footer.tsx` | One-line footer |
| `src/components/KineticHeading.tsx` | Splits a string into masked, staggered words |
| `src/components/Section.tsx` | `<section>` with index, `h2` and optional intro |
| `src/components/ArrowLink.tsx` | Text link with nudging arrow, internal or external |
| `src/components/ProjectMedia.tsx` | Screenshot at natural ratio, or highlighted code |
| `src/components/CodeBlock.tsx` | shiki server render |
| `src/components/ProjectPanel.tsx` | Featured project: media, name, tagline, facts |
| `src/components/ProjectRow.tsx` | Compact project row |
| `src/components/RoleRows.tsx` | Experience grouped by company |
| `src/components/DecisionRecord.tsx` | Before/after strip |
| `src/components/ArchitectureDiagram.tsx` | Booklet SVG |
| `src/components/writing/PostList.tsx`, `PostBody.tsx` | Post rows, highlighted body |
| `src/lib/highlight.ts` | Single shiki highlighter instance |
| `src/app/data/record.ts` | First-person Record paragraph and four figures |

---

### Task 1: Tooling and tokens

**Files:** `package.json`, `next.config.ts`, `src/app/globals.css`, `src/app/layout.tsx`; delete `tailwind.config.ts`.

**Produces:** Tailwind colour utilities `bg-base`, `bg-surface`, `bg-surface-2`, `text-fg`, `text-fg-2`, `text-fg-3`, `border-line`, `border-line-strong`; font utilities `font-display`, `font-sans`, `font-mono`; text utilities `text-display-xl`, `text-display-l`, `text-display-m`, `text-title`, `text-body`, `text-small`, `text-meta`; classes `.shell`, `.panel`, `.reveal`, `.reveal-media`, `.kinetic`, `.link`, `.prose`, `.progress`.

- [ ] `npm uninstall framer-motion react-icons postcss && npm install shiki && npm install -D postcss`
- [ ] `next.config.ts`: add `experimental: { viewTransition: true }`.
- [ ] Rewrite `globals.css` from empty: `@theme` tokens above; base element styles (no `overflow-x: hidden` on body, no global smooth scroll); `.shell`; `.panel` with inset top highlight and hover/active radial; `.kinetic` word animation (`font-variation-settings` 200/75 → 700/100, `translateY(110%)` → 0, per-word `--i` delay); `.reveal` and `.reveal-media` inside `@supports (animation-timeline: view())`; hero scroll response inside `@supports (animation-timeline: scroll())`; `::view-transition-*` rules; `.progress`; prose; reduced-motion block; print block.
- [ ] `layout.tsx`: load `Bricolage_Grotesque({ axes: ["wdth"] })`, `Geist`, `Geist_Mono` as CSS variables; keep metadata and both JSON-LD blocks byte-for-byte; update `themeColor` to `#050505`; skip link keeps a visible focus ring; add fixed grain layer.
- [ ] Verify: `npm run build` passes (pages will be restyled in later tasks; build may fail on deleted imports until Task 3, so run this at the end of Task 3 if needed).

### Task 2: Chrome

**Files:** `Navbar.tsx`, `Footer.tsx`, `ArrowLink.tsx`, `Section.tsx`.

**Produces:**
- `ArrowLink({ href, children, external?, className? })`
- `Section({ index, title, intro?, id, children, className? })` renders `<section aria-labelledby>` with an `h2`.

- [ ] Navbar: wordmark "Ashwin Sathian"; links Work `/projects`, Experience `/experience`, Writing `/writing`, Résumé (new tab). Active link gets `aria-current="page"`. Below `md`: a 48px "Menu" button calling `dialog.showModal()`; dialog is a bottom sheet with 56px rows; closes on link click, on backdrop click and on Escape (native).
- [ ] Footer: one row; wraps on mobile.
- [ ] Verify by keyboard: Tab reaches skip link, wordmark, each link; on 390px, Enter opens the sheet, focus stays inside, Escape closes and returns focus to the button.

### Task 3: Home

**Files:** `src/app/page.tsx`, `Hero.tsx`, `KineticHeading.tsx`, `ProjectPanel.tsx`, `ProjectRow.tsx`, `ProjectMedia.tsx`, `CodeBlock.tsx`, `lib/highlight.ts`, `RoleRows.tsx`, `writing/PostList.tsx`, `data/record.ts`, `data/projects.ts` (media dimensions only); delete the nine old home/list components, `Reveal.tsx`, `lib/motion.ts`, `data/summary.ts`.

**Produces:**
- `KineticHeading({ text, as?: "h1" | "h2", className?, id? })`
- `ProjectMedia({ media, priority?, name? })`; screenshot variant uses intrinsic `width`/`height`.
- `ProjectPanel({ project, index, flip?, priority? })`, `ProjectRow({ project, index })`
- `RoleRows({ detailed?: boolean })`
- `PostList({ posts, headingLevel?: "h2" | "h3" })`
- `highlight(code: string, lang: string): Promise<string>` returning HTML
- `RECORD = { paragraph: string[], figures: { value: string, label: string }[] }`

- [ ] Read actual pixel dimensions of the four PNGs (`sips -g pixelWidth -g pixelHeight`) and add them to the screenshot media type and data.
- [ ] `record.ts`: paragraph built only from sentences in the old `summary.ts` and `HowIWork.tsx`, in first person. Figures: `$1B+` "GTV on the Penny Software platform", `5 years` "founding engineer, Penny Software", `12` "person team mentored", `<200ms` "queries at that scale". Each is verbatim-traceable to `experience.ts` or `summary.ts`.
- [ ] Build sections in spec order. Shared view-transition names: `project-media-${slug}`, `project-name-${slug}`.
- [ ] Verify: `npm run build`; home at 390 and 1440 has six sections, no blank bands, one `h1`, five `h2`.

### Task 4: Projects index

**Files:** `src/app/projects/page.tsx`.

- [ ] Header uses `PROJECTS.length` spelled out for the count. Featured as `ProjectPanel`, rest as `ProjectRow`, then "Also shipped" rows. Metadata unchanged.

### Task 5: Project detail

**Files:** `src/app/projects/[slug]/page.tsx`, `DecisionRecord.tsx`, `ArchitectureDiagram.tsx`, `projects/[slug]/not-found.tsx`.

- [ ] Layout per spec section 5. JSON-LD and `generateMetadata` unchanged. Breadcrumb uses plain `Link`.
- [ ] Rail shows language and stars only when present.
- [ ] `caseStudy` and `description` are mutually exclusive in render.
- [ ] Architecture SVG: three tiers, connectors as `<path>`, text as real `<text>` using `currentColor`; scrolls horizontally inside its own container below 640px rather than shrinking text.
- [ ] Verify: `/projects/booklet` (screenshot, case study, diagram, decision record), `/projects/darkframe` (code media), `/projects/typester` (no case study), `/projects/nope` (404).

### Task 6: Experience

**Files:** `src/app/experience/page.tsx`, `RoleRows.tsx`.

- [ ] Group consecutive roles by `company`. Company header shows the span from the earliest start to the latest end of its roles, computed from the existing `dates` strings. Education and stack follow.

### Task 7: Writing

**Files:** `src/app/writing/page.tsx`, `src/app/writing/[slug]/page.tsx`, `writing/PostBody.tsx`.

- [ ] `PostBody`: `marked` with a custom `code` renderer calling `highlight`; unknown languages fall back to plain escaped text. `highlight` uses `shiki/core` with `createJavaScriptRegexEngine` and explicitly imported languages (no WASM, safe in a Worker), and a greyscale theme so code stays inside the no-hue rule. Project code media stays plain mono text. Post route sets `dynamicParams = false`.
- [ ] Post page: progress bar, previous/next from `getAllPosts()` order. Metadata and JSON-LD unchanged.
- [ ] Verify: every post builds; a code block is highlighted; a post with a table renders.

### Task 8: Peripheral surfaces

**Files:** `src/app/not-found.tsx`, `src/app/og/route.tsx`, `public/favicon.svg`, `public/apple-touch-icon.png`, `DESIGN.md`, `README.md` (only if it describes the old identity), `public/llms.txt` (untouched unless it names design details).

- [ ] OG: monochrome, Bricolage Grotesque title, Geist Mono meta; constants renamed to token names.
- [ ] Favicon: white "AS" in Bricolage-like geometry drawn as paths on `#050505`, 16px radius. Apple icon rendered from it at 180px via Playwright screenshot.
- [ ] DESIGN.md: rewritten from spec section 4, short.

### Task 9: Adversarial review

- [ ] `npm run build && npm run lint`.
- [ ] Capture all routes at 390, 768, 1440 and read every image.
- [ ] JS-disabled capture of all routes.
- [ ] Reduced-motion capture of home.
- [ ] Watch the hero load at 390 and 1440: if words re-wrap while axes animate, drop the width axis and animate weight only.
- [ ] 320px overflow measurement on all routes.
- [ ] Heading outline per route.
- [ ] Capture with scroll-timeline support stripped (inject CSS that sets `animation: none` on `.reveal*`) to prove the static fallback.
- [ ] `git diff --stat src/app/data` and read the diff against the Global Constraints list.
- [ ] `grep -rn "framer-motion\|react-icons\|paper\|ink-muted\|accent" src` returns nothing.
- [ ] Fix every finding, recapture.

### Task 10: Ship

- [ ] Commit, push to `main`.
- [ ] `npm run deploy`.
- [ ] Load `https://ashwinsathian.com/` and one project page; confirm the new build is live.

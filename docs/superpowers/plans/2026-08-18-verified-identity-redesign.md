# Verified Identity Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Apple-HIG-derived visual system with a distinct "verified, not vibes" identity, add real product imagery to every case study, and fix the concrete layout/motion/content defects found in the 2026-08-18 adversarial review.

**Architecture:** This is a design-token and content change, not a structural one — routing, data fetching, and SEO/JSON-LD are untouched. Work proceeds foundation-first (tokens/fonts, then a new shared media component, then per-section application) so later tasks consume stable primitives instead of each reinventing color/type/motion decisions.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4 (`@theme` tokens in `globals.css`), Framer Motion 12, `next/font/google`, `next/image`.

**Spec:** `docs/superpowers/specs/2026-08-18-verified-identity-redesign-design.md`

## Global Constraints

- Color tokens exactly as specified: `canvas #0A0D10`, `surface-1 #12161B`, `surface-2 #1A2027`, `ink-1 #EDEFF2`, `ink-2 #8B93A1`, `ink-3 #5B636F`, `ink-4 #394048`, `signal #4CE0A6`, `signal-hover #3BC98F`, `alert #E0A64C`, `diff-remove #C4645A`.
- Type: IBM Plex Sans (400/500 body, 600/700 display) + IBM Plex Mono (500 utility). Inter is removed, not kept alongside.
- No fabricated content: every screenshot, code snippet, and verified-tag string must be captured/derived from the real, current source (live URL, local repo, or existing data file) — never written from memory or invented. This project's standing practice ([[feedback-verify-project-facts-against-repo]]) applies to visual assets exactly as it applies to prose.
- No em-dash overuse or flagged AI-writing vocabulary in any new or edited copy ([[feedback-avoid-ai-writing-tells]]).
- This repo has no test runner configured (`package.json` has no jest/vitest/testing-library). Verification gates are `npm run lint`, `npm run build` (which typechecks), and Playwright visual checks — not unit tests. Do not invent a test framework for this change.
- BRNR's `links` object is currently empty (no live/GitHub URL) — its card will carry a screenshot but no outbound link, unlike the other four projects. This is pre-existing, not something to silently "fix" by inventing a link.

---

### Task 1: Design tokens, fonts, and no-JS motion baseline

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Produces: `@theme` CSS custom properties consumed by every later task via Tailwind utility classes (`bg-canvas`, `text-ink-1`, `text-signal`, etc. — Tailwind v4 auto-generates utilities from `@theme` tokens named `--color-*`).
- Produces: CSS vars `--font-sans` (IBM Plex Sans) and `--font-mono` (IBM Plex Mono), set on `<html>` via `next/font/google` `variable` option, consumed by `tailwind.config.ts`/utility classes in every later task.
- Produces: a `.motion-safe-reveal` class contract — any element a later task wants to animate with Framer Motion's `whileInView` must also carry this class, so the `<noscript>` rule can target it.

- [ ] **Step 1: Replace the color tokens in `globals.css`**

Replace the existing `@theme` block's color section (the `--color-canvas` through `--color-accent-hover` lines) with:

```css
@theme {
  /* Dark surfaces */
  --color-canvas: #0A0D10;
  --color-surface-1: #12161B;
  --color-surface-2: #1A2027;

  /* Ink (text) */
  --color-ink-1: #EDEFF2;
  --color-ink-2: #8B93A1;
  --color-ink-3: #5B636F;
  --color-ink-4: #394048;

  /* Accent system: signal is the one loud color, alert/diff-remove
     share its lightness/saturation, rotated hue, so the three read
     as one designed system. */
  --color-signal: #4CE0A6;
  --color-signal-hover: #3BC98F;
  --color-alert: #E0A64C;
  --color-diff-remove: #C4645A;

  /* Shadows */
  --shadow-card: 0 0 0 1px rgba(255, 255, 255, 0.06);
  --shadow-card-hover: 0 0 0 1px rgba(255, 255, 255, 0.12);
  --shadow-modal: 0 24px 80px rgba(0, 0, 0, 0.8);
}
```

Do not keep `--color-label-*`, `--color-surface-3`, `--color-surface-4`, or `--color-accent*` — every later task replaces those class names (`text-label-1` → `text-ink-1`, `bg-surface-3` → `bg-surface-2`, `text-accent` → `text-signal`, etc.). Grep for `label-` and `surface-[34]` and `accent` across `src/` at the end of Task 11 to confirm none remain.

- [ ] **Step 2: Update the `:root`, `body`, and `.prose`/selection rules that hardcode the old palette**

In `globals.css`, replace every hardcoded hex/rgba that referenced the old palette:
- `body { background-color: #000000; color: #f5f5f7; }` → `background-color: #0A0D10; color: #EDEFF2;`
- `::selection { background-color: rgba(41, 151, 255, 0.25); }` → `rgba(76, 224, 166, 0.25);` (signal, not the old accent blue)
- `a:focus-visible, button:focus-visible { outline: 2px solid #2997ff; }` → `outline: 2px solid #4CE0A6;`
- Every `.prose` rule referencing `var(--color-label-*)` → `var(--color-ink-*)` (same numbering: `label-1`→`ink-1`, `label-2`→`ink-2`, etc.)
- `.prose a { color: var(--color-accent); ... border-color: rgba(41, 151, 255, ...) }` → `var(--color-signal)` and `rgba(76, 224, 166, ...)`
- Remove the `--font-mono` declaration from `:root` (it moves to `layout.tsx` as a `next/font/google` variable in Step 4, so it stops being a hardcoded system-font stack).

- [ ] **Step 3: Add the no-JS motion baseline**

Append to `globals.css`:

```css
/* Real user-scroll IntersectionObserver events resolve motion's initial
   opacity:0 within a frame or two — verified by manual scroll testing.
   The only lasting-blank case is no-JS entirely, where nothing ever
   flips it. This rule is the fix for that one case; it does not touch
   the animation itself. */
noscript + .motion-safe-reveal,
.motion-safe-reveal:has(+ noscript) {
  opacity: 1 !important;
  transform: none !important;
}
```

Note: `:has()` sibling targeting from a single sitewide `<noscript>` won't reach elements deep in the tree. Use the simpler, reliable approach instead — replace the above with a global CSS rule scoped by a `<html>`-level no-JS class, set via `<noscript>` unable to add classes to ancestors either. The reliable pattern in a server-rendered Next.js app is:

```css
/* In a <noscript> element's own <style> child (added in Step 4), not here. */
```

Delete the `:has()` attempt above from `globals.css` — it does not work for this purpose. The actual mechanism is a `<style>` tag nested inside a `<noscript>` element in `layout.tsx` (Step 4), which the browser only parses/applies when JS is disabled, and which targets `.motion-safe-reveal` globally by class (no sibling-selector complexity needed since `<noscript>` content, when active, applies as real CSS to the whole document).

- [ ] **Step 4: Replace Inter with IBM Plex Sans + IBM Plex Mono, and add the `<noscript>` override, in `layout.tsx`**

Replace the `Inter` import and instantiation:

```tsx
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-mono",
  display: "swap",
});
```

Update the `<html>` tag's `className` from `inter.variable` to `` `${plexSans.variable} ${plexMono.variable}` ``.

Add, as the first child inside `<head>` (before the JSON-LD scripts): 

```tsx
<noscript>
  <style>{`.motion-safe-reveal { opacity: 1 !important; transform: none !important; }`}</style>
</noscript>
```

- [ ] **Step 5: Verify**

Run: `npm run build`
Expected: build succeeds with no type or lint errors related to the font/CSS changes. (Component files still reference old class names like `text-label-1` at this point in the plan — that's expected and fixed in later tasks. If the build fails specifically because Tailwind can't resolve `label-1`/`accent`/etc. utility classes, that confirms Step 1 correctly removed the old tokens; those errors clear as each later task updates its component.)

Run: `npm run dev`, open the site, open DevTools → Network → disable JS (or use Playwright with `javaScriptEnabled: false`), reload, and confirm the page is not solid black (headline/nav text visible even where old class names haven't been migrated yet).

- [ ] **Step 6: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx
git commit -m "design: new color/type tokens (IBM Plex, verified-identity palette) and no-JS motion baseline"
```

---

### Task 2: Project media assets and data model

**Files:**
- Modify: `src/app/data/projects.ts`
- Create: `public/projects/booklet/hero.png`
- Create: `public/projects/brnr/hero.png`
- Create: `public/projects/wayfarer/hero.png`
- Create: `public/projects/typester/hero.png`

Note: BRNR's media source changed mid-planning (2026-08-18) — Ashwin confirmed `brnr-web` (`https://brnr.ashwinsathian.com`) is the only currently-published surface, so BRNR is captured live like the other three web products, not sourced from the local mobile-app repo screenshot originally planned. `links.live` is added to BRNR's data as part of this task, fixing a real pre-existing gap (the URL was live but never wired into `PROJECTS`).

**Interfaces:**
- Produces: `ProjectMedia` type and a `media: ProjectMedia` field on every entry in `PROJECTS`, consumed by Task 3 (`ProjectMedia` component) and Task 4/5 (`Projects.tsx`, detail page).

- [ ] **Step 1: Capture live screenshots**

Using the Playwright browser tool, for each of Booklet (`https://booklet.ashwinsathian.com`), Wayfarer (`https://wayfarer.ashwinsathian.com`), and Typester (`https://typester.ashwinsathian.com`):
1. Navigate to the URL.
2. Resize viewport to 1280×800.
3. Wait for the page to be visually settled (no loading spinners).
4. Take a screenshot, save to the project's temp output location.
5. Move the file into `public/projects/<slug>/hero.png` in the repo (screenshots write to an allowed-roots directory first, same constraint hit earlier this session — move afterward, don't fight the tool's allowed-roots restriction).

Do not pre-crop or resize these — `next/image` (used in Task 3) handles responsive sizing at request time.

- [ ] **Step 2: Capture the BRNR web-app screenshot**

BRNR's `brnr-web` deploy is live at `https://brnr.ashwinsathian.com` but wasn't previously linked from the portfolio's data. Capture its cryptographic-fingerprint/safety-number screen specifically (not the landing page) — it's the screen that directly corroborates the "Double Ratchet, safety numbers" claims already in the case study copy:
1. Navigate to `https://brnr.ashwinsathian.com`, viewport 1280×800.
2. Click through the onboarding ("Let's go" → "Got it") to reach the "Your identity" screen showing the four-emoji cryptographic fingerprint.
3. Screenshot, move to `public/projects/brnr/hero.png` (same allowed-roots move as Step 1).

This already happened once this session (2026-08-18) — the file exists at that point in the working tree; this step is a record of how to redo it if the asset is ever lost or the UI changes.

- [ ] **Step 3: Add the `ProjectMedia` type and `media` field to `projects.ts`**

Add near the top of `src/app/data/projects.ts`, alongside the existing `ProjectLinks`/`ProjectFact`/`ProjectHighlight` types:

```ts
export type ProjectMedia =
  | { kind: "screenshot"; src: string; alt: string }
  | { kind: "code"; snippet: string; language: string; caption: string };
```

Add `media: ProjectMedia;` to the `Project` type, after `highlights`.

Add a `media` entry to each of the five `PROJECTS` array entries, and add `links.live` to BRNR (previously `links: {}` — `brnr-web` is live but was never wired in):

```ts
// booklet
media: {
  kind: "screenshot",
  src: "/projects/booklet/hero.png",
  alt: "Booklet's editor: live Markdown preview next to the source pane.",
},

// brnr — also update this entry's `links` field:
// links: { live: "https://brnr.ashwinsathian.com" },
media: {
  kind: "screenshot",
  src: "/projects/brnr/hero.png",
  alt: "BRNR's cryptographic fingerprint screen: four emoji derived from the session's safety number, used to confirm a connection hasn't been intercepted.",
},

// wayfarer
media: {
  kind: "screenshot",
  src: "/projects/wayfarer/hero.png",
  alt: "Wayfarer's request builder, showing a collection tree and response viewer.",
},

// ngx-runtime-i18n
media: {
  kind: "code",
  language: "ts",
  caption: "app.config.ts",
  snippet: `provideRuntimeI18n({
  defaultLang: 'en',
  supported: ['en', 'hi', 'de'],
  fetchCatalog: (lang, signal) =>
    fetch(\`/i18n/\${lang}.json\`, { signal }).then((r) => r.json()),
  onMissingKey: (key) => key,
}, {
  options: {
    autoDetect: true,
    storageKey: '@ngx-runtime-i18n:lang',
  },
})`,
},

// typester
media: {
  kind: "screenshot",
  src: "/projects/typester/hero.png",
  alt: "Typester mid-round: streak multiplier climbing as words are typed.",
},
```

Before finalizing the `ngx-runtime-i18n` snippet, verify it against the real API: read `~/Documents/Personal/ngx-runtime-i18n`'s README or the `runtime-i18n-angular` lib's public exports to confirm `provideRuntimeI18n`'s actual option names match what's written here. Adjust the snippet to the real signature if it differs — this is exactly the kind of claim [[feedback-verify-project-facts-against-repo]] exists to catch.

- [ ] **Step 4: Verify**

Run: `npm run build`
Expected: succeeds (the `media` field isn't consumed by any component yet, so this only confirms the data file itself typechecks).

Confirm all four PNGs exist and are non-trivial in size: `ls -la public/projects/*/hero.png` (each should be well over a few KB; a near-zero-byte file means the screenshot capture failed silently).

- [ ] **Step 5: Commit**

```bash
git add src/app/data/projects.ts public/projects
git commit -m "content: add real product media (screenshots + verified code snippet) per project"
```

---

### Task 3: `ProjectMedia` component

**Files:**
- Create: `src/components/ProjectMedia.tsx`

**Interfaces:**
- Consumes: `ProjectMedia` type from `src/app/data/projects.ts` (Task 2).
- Produces: `export default function ProjectMedia({ media, priority }: { media: ProjectMedia; priority?: boolean })`, consumed by `Projects.tsx` (Task 4) and `projects/[slug]/page.tsx` (Task 5).

- [ ] **Step 1: Write the component**

```tsx
import Image from "next/image";
import type { ProjectMedia as ProjectMediaData } from "@/app/data/projects";

export type ProjectMediaProps = {
  media: ProjectMediaData;
  priority?: boolean;
};

export default function ProjectMedia({ media, priority }: ProjectMediaProps) {
  return (
    <div className="flex h-64 items-center justify-center overflow-hidden rounded-2xl border border-white/8 bg-surface-2 md:h-80">
      {media.kind === "screenshot" && (
        <div className="flex h-full w-full flex-col">
          <div className="flex shrink-0 items-center gap-1.5 border-b border-white/6 bg-surface-1 px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          </div>
          <div className="relative flex-1">
            <Image
              src={media.src}
              alt={media.alt}
              fill
              priority={priority}
              className="object-cover object-top"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </div>
        </div>
      )}

      {media.kind === "code" && (
        <div className="flex h-full w-full flex-col">
          <div className="flex shrink-0 items-center justify-between border-b border-white/6 bg-surface-1 px-4 py-2.5">
            <span className="font-mono text-[12px] text-ink-3">{media.caption}</span>
            <span className="font-mono text-[11px] uppercase tracking-widest text-ink-4">
              {media.language}
            </span>
          </div>
          <pre className="flex-1 overflow-auto p-5 font-mono text-[13px] leading-[1.7] text-ink-1">
            <code>{media.snippet}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run build`
Expected: succeeds. This component isn't wired into any page yet, so this only confirms it typechecks in isolation.

- [ ] **Step 3: Commit**

```bash
git add src/components/ProjectMedia.tsx
git commit -m "feat: add ProjectMedia component (screenshot/code chrome frames)"
```

---

### Task 4: `Projects.tsx` card rework

**Files:**
- Modify: `src/components/Projects.tsx`

**Interfaces:**
- Consumes: `ProjectMedia` component (Task 3), `project.media` (Task 2).
- No change to `ProjectsProps` — still takes `projects: ProjectWithStats[]`.

- [ ] **Step 1: Replace the two-column grid with a media-first stacked/side-by-side layout**

Replace the per-project `<motion.div>` card body (the `<div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] ...">` block and everything inside it) with:

```tsx
<div className="grid gap-8 md:grid-cols-[minmax(0,340px)_1fr] md:gap-12">
  <motion.div variants={fadeInUp} className="flex flex-col gap-3">
    <ProjectMedia media={project.media} />
    <div className="flex items-center gap-3 font-mono text-[12px] uppercase tracking-wider text-ink-3">
      <span>{String(i + 1).padStart(2, "0")}</span>
      <span>{project.category}</span>
      {(project.language || typeof project.stars === "number") && (
        <span className="ml-auto normal-case tracking-normal text-ink-3">
          {project.language}
          {typeof project.stars === "number" && project.stars > 0 && ` · ★ ${project.stars}`}
        </span>
      )}
    </div>
  </motion.div>

  <div className="flex flex-col gap-5">
    <motion.div variants={fadeInUp}>
      <Link
        href={`/projects/${project.slug}`}
        className="group inline-flex items-baseline gap-3 focus-visible:outline-none"
      >
        <h3 className="text-[clamp(26px,3.5vw,40px)] font-semibold leading-[1.1] tracking-[-0.02em] text-ink-1 transition-colors duration-200 group-hover:text-signal">
          {project.name}
        </h3>
        <span className="text-signal opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100">
          →
        </span>
      </Link>
    </motion.div>

    <motion.p variants={fadeInUp} className="max-w-xl text-[16px] leading-[1.7] text-ink-2">
      {project.tagline}
    </motion.p>

    {project.highlights[0] && (
      <motion.p variants={fadeInUp} className="max-w-xl text-[14px] leading-[1.6] text-ink-3">
        <span className="text-ink-2">{project.highlights[0].title}.</span>{" "}
        {project.highlights[0].detail}
      </motion.p>
    )}

    <motion.div variants={fadeInUp} className="flex flex-wrap gap-2">
      {project.stack.map((tech) => (
        <span key={tech} className="rounded-full bg-surface-2 px-3 py-1 text-[12px] font-medium text-ink-3">
          {tech}
        </span>
      ))}
    </motion.div>

    <motion.div variants={fadeInUp} className="flex flex-wrap gap-2">
      {project.facts.map((fact) => (
        <span
          key={fact.label}
          className="rounded-md border border-signal/20 bg-signal/5 px-2.5 py-1 font-mono text-[11px] text-signal"
        >
          {`// verified · ${fact.value}`}
        </span>
      ))}
    </motion.div>

    <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-5 pt-1">
      <Link href={`/projects/${project.slug}`} className="text-[14px] text-ink-2 transition-colors duration-200 hover:text-ink-1">
        Case study →
      </Link>
      {project.links.live && (
        <a href={project.links.live} target="_blank" rel="noopener noreferrer" className="text-[14px] text-ink-3 transition-colors duration-200 hover:text-ink-1">
          Live ↗
        </a>
      )}
      {project.links.github && (
        <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="text-[14px] text-ink-3 transition-colors duration-200 hover:text-ink-1">
          GitHub ↗
        </a>
      )}
      {project.links.npm && (
        <a href={project.links.npm} target="_blank" rel="noopener noreferrer" className="text-[14px] text-ink-3 transition-colors duration-200 hover:text-ink-1">
          npm ↗
        </a>
      )}
    </motion.div>
  </div>
</div>
```

Note: the `facts` verified-tags row reuses `project.facts` (already on every project — no data change needed beyond Task 2). Cap it visually if a project ever has more than 3 facts (none currently do; `PROJECTS` entries all have exactly 3).

Add the import: `import ProjectMedia from "@/components/ProjectMedia";`

Replace all remaining `label-1`/`label-2`/`label-3`/`label-4`/`accent` class references in this file (the section eyebrow, heading, intro paragraph, border colors) with their `ink-*`/`signal` equivalents per Task 1's mapping.

- [ ] **Step 2: Add the media scale-in motion differentiation**

Add `className="motion-safe-reveal"` to every top-level `motion.div`/`motion.p`/`motion.h2` in this file that isn't already covered (so the no-JS override from Task 1 applies here). Give the `ProjectMedia` wrapper its own subtle scale variant instead of reusing `fadeInUp` verbatim — in `src/lib/motion.ts`, this already exists as `fadeInScale` (`opacity 0→1, scale 0.96→1`). Use `fadeInScale` (already defined, no new variant needed) on the `ProjectMedia`-wrapping `motion.div` instead of `fadeInUp`.

- [ ] **Step 3: Verify**

Run: `npm run build`
Expected: succeeds, no reference to removed `label-*`/`accent`/`surface-3` classes remains in this file (`grep -n "label-\|surface-3\|surface-4\|text-accent\|bg-accent" src/components/Projects.tsx` returns nothing).

Run: `npm run dev`, navigate to `/`, scroll to Projects. Visually confirm via Playwright screenshot: each card shows real media at a consistent height, the verified-tags render, no orphaned whitespace on the left column (the layout defect from finding #3).

- [ ] **Step 4: Commit**

```bash
git add src/components/Projects.tsx
git commit -m "design: rework project cards around real media, verified-tags, new tokens"
```

---

### Task 5: Project detail page media + verified-tags

**Files:**
- Modify: `src/app/projects/[slug]/page.tsx`

**Interfaces:**
- Consumes: `ProjectMedia` component (Task 3), `project.media` (Task 2).

- [ ] **Step 1: Add the media block near the top of the page**

Insert a `<ProjectMedia media={project.media} priority />` block after the Links section (`{/* Links */}` div) and before `{/* Quick facts */}`. Wrap it: `<div className="mb-12"><ProjectMedia media={project.media} priority /></div>`.

Add the import: `import ProjectMedia from "@/components/ProjectMedia";`

- [ ] **Step 2: Add verified-tags to the Quick facts block**

In the existing `{/* Quick facts */}` grid, each fact card currently shows a label + value with no verification marker. Add a small `signal`-colored tag beneath the value:

```tsx
<div key={fact.label} className="rounded-2xl border border-white/6 bg-surface-2 p-5">
  <p className="mb-1.5 text-[11px] font-medium uppercase tracking-widest text-ink-4">{fact.label}</p>
  <p className="text-[14px] leading-snug text-ink-1">{fact.value}</p>
  <p className="mt-2 font-mono text-[10px] text-signal">// verified</p>
</div>
```

- [ ] **Step 3: Replace remaining `label-*`/`accent` classes with `ink-*`/`signal` per Task 1's mapping** throughout this file (breadcrumb, header, links, description, stack, highlights, next-project sections).

- [ ] **Step 4: Verify**

Run: `npm run build`
Expected: succeeds; `grep -n "label-\|text-accent\|bg-accent" src/app/projects/\[slug\]/page.tsx` returns nothing.

Visit `/projects/booklet`, `/projects/brnr` (confirm the live-app screenshot and its new `links.live` URL both render), `/projects/ngx-runtime-i18n` (confirm the code frame renders with real syntax, not a broken screenshot placeholder).

- [ ] **Step 5: Commit**

```bash
git add "src/app/projects/[slug]/page.tsx"
git commit -m "design: add product media and verified-tags to project detail pages"
```

---

### Task 6: Hero — type weight, mobile status line, token migration

**Files:**
- Modify: `src/components/Hero.tsx`

**Interfaces:**
- No prop/type changes. `HERO` data (`src/app/data/hero.ts`) is read as-is; this task adds one derived display value (project count), not new source-of-truth data.

- [ ] **Step 1: Increase display type weight and migrate tokens**

Change the name heading from `font-thin` to `font-semibold`, tracking from `tracking-[-0.045em]` to `tracking-[-0.03em]` (Plex Sans at weight 600 needs slightly less negative tracking than the old hairline Inter did to avoid glyphs touching). Change `text-label-1` → `text-ink-1`.

Change the title (`Engineer.`) from `font-light` to `font-medium`, `text-label-3` → `text-ink-2`.

Change the eyebrow `text-label-4` → `text-ink-4`. Scroll indicator `bg-label-4/30`/`bg-label-3` → `bg-ink-4/30`/`bg-ink-2`.

- [ ] **Step 2: Add the mobile status line**

Below the existing eyebrow (`{HERO.eyebrow}` paragraph), add a new element that's visible immediately (not gated behind `whileInView` — it's part of the initial `stagger` group that's already present on page load, same as the rest of Hero, so no new visibility gate is introduced):

```tsx
<motion.p
  variants={fadeInUp}
  className="mt-1 font-mono text-[11px] text-ink-4 md:hidden"
>
  {`// ${HERO.eyebrow.toLowerCase()} · 5 shipped projects, verified`}
</motion.p>
```

This is mobile-only (`md:hidden`) — on desktop the hero already has enough visual weight from the large name; the status line exists specifically to give the mobile hero (currently empty per finding #4) something present at first paint. The "5 shipped projects" count must match `PROJECTS.length` in `src/app/data/projects.ts` — confirm the literal `5` is still correct before committing (it is, per the current five-entry array; if that array's length ever changes, this line needs updating too — leave a comment noting the coupling).

Add a code comment above the new line: `{/* Count must match PROJECTS.length in data/projects.ts */}`.

- [ ] **Step 3: Verify**

Run: `npm run build`
Expected: succeeds, no `label-*` references remain in `Hero.tsx`.

Resize Playwright viewport to 390×844, load `/`, screenshot. Confirm the mobile hero now shows the status line beneath the eyebrow instead of empty space (finding #4 resolved). Resize to 1440×900, confirm desktop hero renders with the new weight (name reads noticeably more confident than the old hairline weight).

- [ ] **Step 4: Commit**

```bash
git add src/components/Hero.tsx
git commit -m "design: hero type weight, mobile status line, token migration"
```

---

### Task 7: Contact — drop phone, token migration

**Files:**
- Modify: `src/components/Contact.tsx`

**Interfaces:**
- Consumes: `SITE` from `src/app/data/site.ts` (unchanged — `phone`/`phoneHref` stay in the data, per the spec's §4.2 decision; this task just stops rendering them).

- [ ] **Step 1: Remove the phone link, migrate tokens**

Remove the third `<a>` (the `SITE.phoneHref`/`SITE.phone` link) and its preceding `<span>·</span>` separator from the social-links row, leaving LinkedIn · GitHub only.

Replace `text-label-1` → `text-ink-1`, `text-accent`/`hover:text-accent-hover` → `text-signal`/`hover:text-signal-hover`, `text-label-3` → `text-ink-3`, `text-label-4` → `text-ink-4`.

- [ ] **Step 2: Verify**

Run: `npm run build`
Expected: succeeds.

Visit `/`, scroll to Contact, screenshot. Confirm only email + "LinkedIn · GitHub" render, no phone number visible or in page source (`curl -s http://localhost:3002 | grep "tel:"` should return nothing once this section is the only consumer — confirm no other component renders `SITE.phoneHref`/`SITE.phone` before treating this as complete; if another component does, note it rather than assuming this task fully removes the number from the page).

- [ ] **Step 3: Commit**

```bash
git add src/components/Contact.tsx
git commit -m "content: drop plaintext phone number from Contact section"
```

---

### Task 8: Experience — copy rework and verified-tag

**Files:**
- Modify: `src/app/data/experience.ts`
- Modify: `src/components/Experience.tsx`

**Interfaces:**
- `ExperienceItem` type unchanged (no new fields needed — the verified-tag in this task renders from the existing `tech` array, same pattern as Task 4's facts tags).

- [ ] **Step 1: Rework the HighLevel and Penny Lead Engineer bullets**

In `src/app/data/experience.ts`, replace the LinkedIn-cadence bullets flagged in the review. Keep every fact identical (role, dates, scope) — only the sentence construction changes, from abstract-noun-led to concrete/plainspoken, matching the register already used in `projects.ts`.

HighLevel bullets — replace:
```
"Led an engineering team, working directly with other engineering teams and verticals to keep collaboration functioning inside squads and across them."
"Guided the AI-augmented Full Stack Builder effort: embedding AI tooling across the full SDLC, from conception and planning through prototyping, development, QA, and shipping."
"Shipped architectural reworks of critical subsystems alongside ongoing enhancements to existing features."
```
with:
```
"Led the team and worked across other teams and verticals so collaboration held up both inside squads and between them."
"Drove the AI-augmented Full Stack Builder effort, putting AI tooling to work across the SDLC: planning, prototyping, building, QA, and shipping."
"Reworked critical subsystems' architecture while shipping ongoing feature work in parallel, not instead of it."
```

Penny Lead Engineer bullets — replace:
```
"Directed Angular + NestJS + MongoDB architecture for a modular, multi-tenant procurement SaaS platform."
"Standardized RBAC, tenancy isolation, and compliance-ready audit trails across the platform."
"Mentored a cross-functional squad across frontend, backend, and QA, with a focus on architecture and craft."
```
with:
```
"Owned the Angular + NestJS + MongoDB architecture for a modular, multi-tenant procurement platform."
"Built RBAC, tenancy isolation, and audit trails as platform-wide standards, not one-off features per team."
"Mentored a squad spanning frontend, backend, and QA, pushing on architecture and craft in both directions."
```

Before committing, sweep both new sets for em-dashes and the flagged-vocabulary list ([[feedback-avoid-ai-writing-tells]]) — none are present in the replacements above, but re-check after any further hand-editing.

- [ ] **Step 2: Add the verified-tag to the tech line, migrate tokens in `Experience.tsx`**

Replace the existing tech-list paragraph:

```tsx
{item.tech && item.tech.length > 0 && (
  <p className="text-[13px] text-label-4">
    {item.tech.join("  ·  ")}
  </p>
)}
```

with:

```tsx
{item.tech && item.tech.length > 0 && (
  <motion.p
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    transition={{ delay: 0.15, duration: 0.3 }}
    className="motion-safe-reveal font-mono text-[12px] text-signal"
  >
    {`// verified · ${item.tech.join(" · ")}`}
  </motion.p>
)}
```

Replace remaining `label-*` classes in this file (`text-label-3`, `text-label-2`, `text-label-1`, `bg-label-4`) with their `ink-*` equivalents per Task 1's mapping.

- [ ] **Step 3: Verify**

Run: `npm run build`
Expected: succeeds, no `label-*` references remain in `Experience.tsx` or `experience.ts`.

Visit `/`, scroll to Experience, screenshot. Confirm bullets read correctly (proofread against the replacements above — a copy-paste error here would misstate real work history) and the verified-tag fades in after each role's bullets, not before.

- [ ] **Step 4: Commit**

```bash
git add src/app/data/experience.ts src/components/Experience.tsx
git commit -m "content: rework Experience bullets to plainspoken register, add verified-tag"
```

---

### Task 9: Capabilities — motion tuning and token migration

**Files:**
- Modify: `src/components/Capabilities.tsx`
- Modify: `src/lib/motion.ts`

**Interfaces:**
- Produces: `staggerFast` variant already exists in `src/lib/motion.ts` (unused elsewhere) — this task is its first consumer, no new variant needed.

- [ ] **Step 1: Swap the badge grid's stagger variant**

Change the `motion.div` wrapping `SKILL_COLUMNS.map(...)` (the badge grid) from `variants={stagger}` to `variants={staggerFast}` — this is the only motion change; `staggerFast` (`staggerChildren: 0.06`, no `delayChildren`) already exists in `src/lib/motion.ts` and matches the spec's "grid-like snap, not a slow reveal" direction for this section without inventing a new variant.

- [ ] **Step 2: Migrate tokens**

Replace `text-label-3` → `text-ink-3`, `text-label-1` → `text-ink-1` throughout. Badge chips: `bg-surface-2` stays `bg-surface-2` (already correct in the new palette — no `surface-3`/`surface-4` reference in this file, confirm via grep).

- [ ] **Step 3: Verify**

Run: `npm run build`
Expected: succeeds, no `label-*` references remain in `Capabilities.tsx`.

Visit `/`, scroll to Capabilities, screenshot before/after to confirm the badge grid reveal feels snappier/tighter than Projects' slower reveal (visually distinct motion per finding #7).

- [ ] **Step 4: Commit**

```bash
git add src/components/Capabilities.tsx src/lib/motion.ts
git commit -m "design: distinct badge-grid motion for Capabilities, token migration"
```

Note: no changes needed to `src/lib/motion.ts` itself (`staggerFast` already existed) — if Step 1 requires no edit there after all, drop `src/lib/motion.ts` from the `git add` in this commit.

---

### Task 10: Navbar, Footer, and Platforms — token migration pass

**Files:**
- Modify: `src/components/Navbar.tsx`
- Modify: `src/components/Footer.tsx`
- Modify: `src/components/Platforms.tsx`

**Interfaces:** None — pure class-name migration, no structural change to any of these three files.

- [ ] **Step 1: Migrate `Navbar.tsx`**

Replace every `label-*` class with its `ink-*` equivalent and `text-accent` with `text-signal` per Task 1's mapping (active nav link color, mobile menu link hover states, résumé button border/text).

- [ ] **Step 2: Migrate `Footer.tsx`**

Replace `text-label-4` → `text-ink-4`, `text-label-3` → `text-ink-3`, `text-label-1` → `text-ink-1`.

- [ ] **Step 3: Migrate `Platforms.tsx`**

Replace `text-label-3` → `text-ink-3`, `text-label-4` → `text-ink-4`, `text-label-1` → `text-ink-1`. Consider whether the Platforms card (`HighLevel`/Penny tenure card) should also carry a verified-tag consistent with Task 4/5/8 — it doesn't have a `facts`-shaped array today (it's a single `PlatformItem` with `company`/`title`/`description`), so adding one would require a data-shape change out of scope for a token-migration task. Leave it as-is; note this as a possible follow-up rather than expanding this task's scope.

- [ ] **Step 4: Verify**

Run: `npm run build`
Expected: succeeds.

Run: `grep -rn "label-\|surface-3\|surface-4\|text-accent\|bg-accent\|hover:text-accent" src/` across the whole `src/` tree.
Expected: no matches anywhere in the codebase — this is the final confirmation that every component from Task 1 through Task 10 has been migrated off the old token names.

- [ ] **Step 5: Commit**

```bash
git add src/components/Navbar.tsx src/components/Footer.tsx src/components/Platforms.tsx
git commit -m "design: token migration for Navbar, Footer, Platforms"
```

---

### Task 11: Full-site verification pass

**Files:** None modified — this task is verification only, producing evidence the redesign resolved all 10 findings, plus catching anything the per-task verifications missed.

**Interfaces:** None.

- [ ] **Step 1: Static checks**

Run: `npm run lint`
Expected: no errors.

Run: `npm run build`
Expected: succeeds cleanly.

- [ ] **Step 2: Visual pass — desktop**

Via Playwright at 1440×900: screenshot `/`, `/projects/booklet`, `/projects/brnr`, `/projects/wayfarer`, `/projects/ngx-runtime-i18n`, `/projects/typester`, `/writing`. For each, confirm:
- No orphaned whitespace in project cards (finding #3)
- Real media renders (screenshots for 4 projects, phone frame for BRNR, code frame for ngx-runtime-i18n) — finding #2
- New palette/type visible (no Apple-blue accent, no thin-only headlines) — findings #1, #8, #10
- No phone number anywhere in Contact — finding #6

- [ ] **Step 3: Visual pass — mobile**

Via Playwright at 390×844: screenshot `/` (hero, scrolled to each section), mobile menu open. Confirm:
- Hero is not an empty black screen — finding #4
- Mobile menu still functions (open/close, link navigation)

- [ ] **Step 4: No-JS check**

Using Playwright with JavaScript disabled (`browser.newContext({ javaScriptEnabled: false })` — if the MCP tool doesn't expose this directly, use `browser_run_code_unsafe` to create a context with that option), load `/`, screenshot. Confirm body copy (Projects heading, at minimum) is visible, not blank — finding #5.

- [ ] **Step 5: Reduced-motion check**

Confirm the existing `@media (prefers-reduced-motion: reduce)` rule in `globals.css` (untouched by this plan) still zeroes out animation durations — this was already correct before the redesign; just confirm no task accidentally broke it.

- [ ] **Step 6: Fact re-verification**

Re-read every new factual string introduced by this plan against its source, per the standing practice on this site:
- `HERO`'s "5 shipped projects" line (Task 6) against `PROJECTS.length`
- The `ngx-runtime-i18n` code snippet (Task 2) against the real `provideRuntimeI18n` signature
- Every verified-tag string (Tasks 4, 5, 8) against the `facts`/`tech` arrays they're rendered from (they're derived, not hand-typed, so this should be a formality — confirm no task introduced a hand-typed duplicate that could drift)

- [ ] **Step 7: Fix anything found, otherwise proceed**

If any check in Steps 2–6 fails, fix it in the relevant component/data file (not here) and re-run the failing check. Do not commit from this task unless a fix was needed — Task 11 is verification of Tasks 1–10's commits, not new work. If a fix was needed, commit it separately:

```bash
git add <fixed files>
git commit -m "fix: <specific defect found during full-site verification>"
```

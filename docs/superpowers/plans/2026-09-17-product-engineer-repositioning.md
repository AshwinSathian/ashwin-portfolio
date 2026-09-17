# Product Engineer Repositioning Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild ashwinsathian.com's visual identity and rewrite its content to reposition Ashwin from "engineering leader / AI-Augmented Engineer" to "Product Engineer / Founding Engineer" — someone who takes a customer's raw ask through spec, architecture, and shipped code personally, with no PM/EM layer in between.

**Architecture:** No routing or IA changes — the existing App Router structure (`/`, `/projects`, `/projects/[slug]`, `/experience`, `/writing`) stays. This is a design-token swap (new palette/type in `globals.css` + `layout.tsx` font imports) plus a content rewrite across `src/app/data/*.ts`, SEO surfaces (`layout.tsx` metadata/JSON-LD, `og/route.tsx`, `public/llms.txt`), and two new pieces of evidence: a Problem/Decision/Outcome structure on the four featured project case studies, and a real architecture diagram on Booklet's case study.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS v4 (`@theme` tokens in `globals.css`), `next/font/google`. No new runtime dependencies.

**Spec:** `docs/superpowers/specs/2026-09-17-product-engineer-repositioning-design.md`
**Design tokens:** `DESIGN.md`

## Global Constraints

- Base theme stays dark/near-black, unconditionally (`color-scheme: dark`, no `prefers-color-scheme` fork) — hard user constraint.
- Single sans family (Public Sans) across display/body/UI; Martian Mono for dates/metadata/code only — hard user constraint (sans-serif only) plus this rebuild's fresh-identity decision.
- One accent color, `#E8492A` on `#0A0B0D` = 5.1:1 contrast (verified, not eyeballed) — no second hue for "success"/"shipped" states.
- Card/panel radius capped at Tailwind's `rounded` (4px, bare) — never `rounded-xl`/`rounded-2xl` on rectangular surfaces. Pills (`rounded-full`) are a separate, unaffected shape.
- No fabricated metrics, dates, or outcomes anywhere. Every fact traces to the resume, the current repo's already-published copy, or the direct Booklet source-repo scan in the spec §2. Where a real number doesn't exist yet (Vendor Pre-Qualification System adoption), ship the qualitative fact with no number and a `// TODO` comment in the data file — never a visible bracket placeholder on the live site.
- No lead framing on "leader," "AI-Augmented," or "engineering culture" anywhere — including SEO title tags, OG tags, and JSON-LD, not just visible copy. Mentorship/team facts are supporting bullets, never the first bullet.
- No standalone `/about` page.
- Copy voice rules: no banned-word list (robust, seamless, dynamic, delve, underscore, pivotal, leverage, unlock, moreover, furthermore), no rule-of-three parallel phrasing, at most one em dash per paragraph/bullet-group, no unearned "this shows X" tags, vary sentence length.
- Verification gate is `npm run build` (TypeScript check) — `next lint` is pre-existing broken on this repo (confirmed via `git stash` in a prior session), not something this plan fixes.
- No new npm dependencies. The architecture diagram is hand-built HTML/CSS, not a charting/diagramming library.

---

## File Structure

| File | Responsibility |
|---|---|
| `src/app/globals.css` | Color/font/token *values* only — token *names* (`--color-paper`, `--color-ink`, `--color-accent`, etc.) stay as-is so no component className changes; only their hex values and the two font-role vars change. |
| `src/app/layout.tsx` | Font imports (Public Sans + Martian Mono replacing Archivo + JetBrains Mono), all title/OG/Twitter metadata, `Person`/`WebSite` JSON-LD, viewport `themeColor`. |
| `src/app/og/route.tsx` | OG image subtitle text. |
| `src/app/data/hero.ts` | Hero eyebrow/title/thesis copy. |
| `src/app/data/summary.ts` | Homepage summary paragraph. |
| `src/app/data/skills.ts` | AI & Tooling group — matches resume's actual list. |
| `src/app/data/experience.ts` | HighLevel + Penny Software bullets rewritten; founding-engineer fact and Vendor Pre-Qualification System added. |
| `src/components/HomeExperience.tsx` | Home teaser copy + drop `Reveal` scroll-fade wrapper. |
| `src/components/ExperienceContent.tsx` | `/experience` intro copy (framing phrase only). |
| `src/components/Summary.tsx` | Drop `Reveal` scroll-fade wrapper. |
| `src/components/HomeSkills.tsx` | Drop `Reveal` scroll-fade wrapper. |
| `src/components/HowIWork.tsx` | **New.** Home-page prose band stating the ownership positioning — explicitly not a numbered step row. |
| `src/app/page.tsx` | Wire `HowIWork` into the homepage. |
| `src/app/data/projects.ts` | Add `CaseStudy` type + `caseStudy` field; populate for the 4 featured projects; fix Booklet's stale facts (npm package, VS Code extension, MCP tool count). |
| `src/app/projects/[slug]/page.tsx` | Render the new Problem/Decision/Outcome sections and the Booklet architecture diagram; radius cap fix; new `vscode` link label. |
| `src/components/ArchitectureDiagram.tsx` | **New.** Booklet-only system diagram (clients → app tier → data/infra), hand-built HTML/CSS. |
| `src/components/ProjectMedia.tsx`, `src/components/DecisionRecord.tsx`, `src/app/writing/page.tsx`, `src/app/not-found.tsx`, `src/app/projects/[slug]/loading.tsx`, `src/app/projects/[slug]/not-found.tsx` | Radius cap sweep only (`rounded-2xl`/`rounded-xl` → `rounded`). |
| `public/llms.txt` | Full resync to match every content change above. |

Out of scope, confirmed in the spec: `/writing`, `/about` (not created), `src/lib/github.ts`, `src/lib/writing.ts`, `src/app/(helpers)/projects.ts`, and the `framer-motion`/`Reveal` usage in `Projects.tsx`, `Skills.tsx`, `HomeProjects.tsx`, `ExperienceContent.tsx`'s role list, and `writing/PostList.tsx` (only the 3 files listed above lose their `Reveal` wrapper, because this plan is already rewriting their copy).

---

### Task 1: Design tokens — palette, type, viewport

**Files:**
- Modify: `src/app/globals.css:11-27`
- Modify: `src/app/layout.tsx:1-22, 28-30`

**Interfaces:**
- Produces: `--color-paper: #0A0B0D`, `--color-paper-raised: #131417`, `--color-ink: #EDEEF0`, `--color-ink-muted: #8B8E94`, `--color-line: #24262A`, `--color-accent: #E8492A`, `--color-accent-strong: #C43F23` — every later task's Tailwind classes (`bg-paper`, `text-ink`, `text-accent`, etc.) resolve to these new values with zero className changes.
- Produces: `--font-sans` bound to Public Sans, `--font-mono` bound to Martian Mono.

- [ ] **Step 1: Swap color values in `globals.css`**

Replace lines 11-19:

```css
  --color-paper: #0B0B0C;
  --color-paper-raised: #161514;
  --color-ink: #F1EEE8;
  --color-ink-muted: #9C968D;
  --color-line: #2A2826;
  /* Single accent, doing every job the old accent/signal/diff-add/diff-remove
     four-color set used to split between them. */
  --color-accent: #D3A24C;
  --color-accent-strong: #E8B854;
```

with:

```css
  /* v6.0 "Redline" — see DESIGN.md. #E8492A verified at 5.1:1 contrast
     against #0A0B0D (WCAG AA for normal text, not just large/UI). */
  --color-paper: #0A0B0D;
  --color-paper-raised: #131417;
  --color-ink: #EDEEF0;
  --color-ink-muted: #8B8E94;
  --color-line: #24262A;
  --color-accent: #E8492A;
  --color-accent-strong: #C43F23;
```

- [ ] **Step 2: Update the font-role comment (line 21-23) to match the new families**

Replace:

```css
  /* One sans-serif family for display, body, and UI — deliberately not a
     serif/sans split. Mono stays scoped to data/metadata (dates, tags,
     code), not headlines. */
```

with:

```css
  /* Public Sans across display, body, and UI — deliberately not a
     serif/sans split. Martian Mono stays scoped to data/metadata (dates,
     tags, code), not headlines. */
```

- [ ] **Step 3: Replace the font imports in `layout.tsx`**

Replace lines 1-22:

```tsx
import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Archivo } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Data/metadata only — dates, tags, code, fact labels. Not display type.
const dataMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

// Serves display, body, and UI chrome — one sans-serif family, deliberately
// not a serif/sans split.
const uiSans = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});
```

with:

```tsx
import type { Metadata, Viewport } from "next";
import { Martian_Mono, Public_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Data/metadata only — dates, tags, code, fact labels. Not display type.
const dataMono = Martian_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

// Serves display, body, and UI chrome — one sans-serif family, deliberately
// not a serif/sans split. Public Sans is designed to hold up at both
// heading and body-copy sizes, unlike a display-only optical size.
const uiSans = Public_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});
```

- [ ] **Step 4: Update `viewport.themeColor` (line 28-32) to the new canvas hex**

Replace:

```tsx
export const viewport: Viewport = {
  themeColor: "#0B0B0C",
  width: "device-width",
  initialScale: 1,
};
```

with:

```tsx
export const viewport: Viewport = {
  themeColor: "#0A0B0D",
  width: "device-width",
  initialScale: 1,
};
```

- [ ] **Step 5: Verify**

Run: `npm run build`
Expected: build succeeds with no TypeScript errors. Then run `npm run dev` and open `http://localhost:3000` — background should read as a slightly cooler near-black than before, body text a cool off-white, and any existing accent-colored element (nav active state, links) should render vermilion/red-orange, not amber.

- [ ] **Step 6: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx
git commit -m "design: swap to v6.0 Redline palette (vermilion accent) and Public Sans + Martian Mono"
```

---

### Task 2: Radius cliché sweep

**Files:**
- Modify: `src/components/ProjectMedia.tsx:11`
- Modify: `src/components/DecisionRecord.tsx:9`
- Modify: `src/app/writing/page.tsx:51`
- Modify: `src/app/not-found.tsx:6`
- Modify: `src/app/projects/[slug]/page.tsx:155, 195`
- Modify: `src/app/projects/[slug]/loading.tsx:6, 10, 15`
- Modify: `src/app/projects/[slug]/not-found.tsx:6`

**Interfaces:** None — pure className edits, no signature changes.

- [ ] **Step 1: Replace every `rounded-2xl` and `rounded-xl` on a rectangular card/panel with `rounded`**

Run this from the repo root (verified against the exact grep output already captured — these are the only 10 occurrences in `src/`, all on card-like rectangular containers, none on `rounded-full` pills):

```bash
sed -i '' \
  -e 's/rounded-2xl/rounded/g' \
  -e 's/rounded-xl/rounded/g' \
  src/components/ProjectMedia.tsx \
  src/components/DecisionRecord.tsx \
  src/app/writing/page.tsx \
  src/app/not-found.tsx \
  "src/app/projects/[slug]/page.tsx" \
  "src/app/projects/[slug]/loading.tsx" \
  "src/app/projects/[slug]/not-found.tsx"
```

- [ ] **Step 2: Verify no `rounded-2xl`/`rounded-xl` remain**

Run: `rg -n "rounded-2xl|rounded-xl" -g "*.tsx" src`
Expected: no output.

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: succeeds, no TypeScript errors (this was a pure className change).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "fix: cap card radius at 4px, drop rounded-2xl/rounded-xl (shadcn-default tell)"
```

---

### Task 3: SEO/structured data — purge "AI-Augmented"/"engineering leadership"

**Files:**
- Modify: `src/app/layout.tsx:24-26, 34-154`
- Modify: `src/app/og/route.tsx` (subtitle text block)

**Interfaces:**
- Consumes: nothing new.
- Produces: `siteDescription` string used by both `metadata` and `personSchema`/`websiteSchema` — later tasks (llms.txt resync) should read this exact string rather than re-deriving it.

- [ ] **Step 1: Replace `siteDescription` (line 25-26)**

Replace:

```tsx
const siteDescription =
  "AI-augmented senior full-stack engineer. 8+ years building and scaling enterprise-grade SaaS platforms — multi-tenant architecture, teams mentored. Eight independent products shipped outside of it, each with its decisions published, not hidden.";
```

with:

```tsx
const siteDescription =
  "Senior full-stack engineer, 7+ years. Founding engineer at Penny Software for five of them, taking it from zero to a procurement platform moving $1B+ a year. Eight independent products shipped on his own time, each checked against the actual repo.";
```

- [ ] **Step 2: Replace every "AI-Augmented Senior Full-Stack Engineer" title string with "Senior Full-Stack Engineer"**

In `metadata` (lines 34-101): replace `title.default`, `openGraph.title`, `openGraph.images[0].alt`, `twitter.title` — all four currently read `"Ashwin Sathian | AI-Augmented Senior Full-Stack Engineer"` or `"Ashwin Sathian, AI-Augmented Senior Full-Stack Engineer"`. Replace with `"Ashwin Sathian | Senior Full-Stack Engineer"` and `"Ashwin Sathian, Senior Full-Stack Engineer"` respectively (keep the comma-vs-pipe pattern each already uses).

- [ ] **Step 2a: Fix the `keywords` array (lines 41-56)**

Replace:

```tsx
  keywords: [
    "Ashwin Sathian",
    "AI-Augmented Senior Full-Stack Engineer",
    "Full-Stack Engineer",
    "AI-augmented engineering",
    "SaaS platform engineer",
    "Angular expert",
    "NestJS",
    "Next.js",
    "TypeScript engineer",
    "HighLevel engineer",
    "engineering leadership",
    "multi-tenant SaaS",
    "Kochi",
    "India",
  ],
```

with:

```tsx
  keywords: [
    "Ashwin Sathian",
    "Senior Full-Stack Engineer",
    "Founding Engineer",
    "Product Engineer",
    "SaaS platform engineer",
    "Angular expert",
    "NestJS",
    "Next.js",
    "TypeScript engineer",
    "HighLevel engineer",
    "multi-tenant SaaS",
    "Kochi",
    "India",
  ],
```

- [ ] **Step 3: Fix `personSchema` (lines 103-154)**

Replace `jobTitle: "AI-Augmented Senior Full-Stack Engineer",` (line 117) with `jobTitle: "Senior Full-Stack Engineer",`.

Replace the `knowsAbout` array (lines 122-143):

```tsx
  knowsAbout: [
    "AI-augmented software engineering",
    "SaaS platform architecture",
    "Multi-tenant platforms",
    "Engineering leadership",
    "Angular",
    "React",
    "Next.js",
    "NestJS",
    "Node.js",
    "MongoDB",
    "TypeScript",
    "AWS",
    "GCP",
    "Docker",
    "GitHub Actions",
    "Platform engineering",
    "CI/CD",
    "LLM APIs",
    "AI-augmented development workflows",
    "Full-stack development",
  ],
```

with:

```tsx
  knowsAbout: [
    "SaaS platform architecture",
    "Multi-tenant platforms",
    "System design",
    "Angular",
    "React",
    "Next.js",
    "NestJS",
    "Node.js",
    "MongoDB",
    "TypeScript",
    "AWS",
    "GCP",
    "Docker",
    "GitHub Actions",
    "Platform engineering",
    "CI/CD",
    "Full-stack development",
  ],
```

Replace `hasOccupation` (lines 144-153):

```tsx
  hasOccupation: {
    "@type": "Occupation",
    name: "AI-Augmented Senior Full-Stack Engineer",
    occupationLocation: {
      "@type": "City",
      name: "Kochi, Kerala, India",
    },
    skills:
      "Angular, React, Next.js, NestJS, MongoDB, TypeScript, AWS, GCP, AI-augmented engineering",
  },
```

with:

```tsx
  hasOccupation: {
    "@type": "Occupation",
    name: "Senior Full-Stack Engineer",
    occupationLocation: {
      "@type": "City",
      name: "Kochi, Kerala, India",
    },
    skills: "Angular, React, Next.js, NestJS, MongoDB, TypeScript, AWS, GCP",
  },
```

- [ ] **Step 4: Fix the OG image subtitle in `og/route.tsx`**

Find the line:

```tsx
          AI-augmented senior full-stack engineer. 8+ years, eight products. Decisions published, not hidden.
```

Replace with:

```tsx
          Senior full-stack engineer. Founding engineer at Penny Software, five years. Eight independent products shipped on his own time.
```

- [ ] **Step 5: Verify**

Run: `npm run build`
Expected: succeeds. Run `rg -n "AI-Augmented|AI-augmented|engineering leadership" src/app/layout.tsx src/app/og/route.tsx` — expect no output.

- [ ] **Step 6: Commit**

```bash
git add src/app/layout.tsx src/app/og/route.tsx
git commit -m "content: drop AI-Augmented/engineering-leadership framing from SEO surfaces"
```

---

### Task 4: Skills data — match resume's actual AI-tooling list

**Files:**
- Modify: `src/app/data/skills.ts:37-44`

**Interfaces:** None — `SKILL_GROUPS` shape unchanged, only the `AI & Tooling` group's `items` array shrinks.

- [ ] **Step 1: Fix the AI & Tooling group**

Replace:

```ts
  {
    title: "AI & Tooling",
    items: [
      { name: "Claude Code" },
      { name: "Claude Cowork" },
      { name: "Claude Design" },
      { name: "OpenAI Codex" },
    ],
  },
```

with:

```ts
  {
    title: "AI & Tooling",
    items: [{ name: "Claude Code" }, { name: "OpenAI Codex" }],
  },
```

(This matches the resume's Core Skills line exactly: "AI tooling: Claude Code, OpenAI Codex" — Claude Cowork and Claude Design aren't on the current resume and shouldn't be asserted as current tools.)

- [ ] **Step 2: Verify**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/app/data/skills.ts
git commit -m "content: match AI-tooling list to current resume (drop Claude Cowork/Design)"
```

---

### Task 5: Hero + Summary rewrite, drop scroll-fade on Summary

**Files:**
- Modify: `src/app/data/hero.ts`
- Modify: `src/app/data/summary.ts`
- Modify: `src/components/Summary.tsx`

**Interfaces:**
- Produces: `HERO.eyebrow`, `HERO.title`, `HERO.thesis` — consumed as-is by `Hero.tsx` (no shape change, string content only).
- Produces: `SUMMARY` string — consumed as-is by `Summary.tsx`.

- [ ] **Step 1: Rewrite `hero.ts`**

Replace the whole file:

```ts
export const HERO = {
  name: "Ashwin Sathian",
  eyebrow: "Senior Full-Stack Engineer · 7+ years",
  title: "I write the spec a customer never gave me, then I ship it.",
  thesis:
    "No PM or EM in between: Penny Software's Vendor Pre-Qualification System went from a customer vetting vendors by hand to shipped software, schema to UI, built and owned by me alone.",
} as const;
```

- [ ] **Step 2: Rewrite `summary.ts`**

Replace the whole file:

```ts
// Resume-style professional summary for the homepage.
export const SUMMARY =
  "Founding engineer at Penny Software for five years, taking it from zero to a procurement platform moving $1B+ a year — architecture, RBAC, and multi-tenant security were his to design from scratch. HighLevel followed for a short stretch owning Funnels, Websites, and Webinars. Eight independent products shipped on his own time, each documented against the actual repo, not the pitch. B.Tech, Electronics & Communication Engineering, NIT Calicut. Based in Kochi, Kerala, India.";
```

- [ ] **Step 3: Drop the scroll-fade wrapper in `Summary.tsx`**

Replace the whole file:

```tsx
import { SUMMARY } from "@/app/data/summary";

export default function Summary() {
  return (
    <section aria-labelledby="summary-heading" className="border-t border-line px-6 py-16 md:px-16 md:py-20">
      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-12 md:gap-8">
        <p
          id="summary-heading"
          className="font-ui text-micro font-medium uppercase tracking-[0.14em] text-ink-muted md:col-span-3"
        >
          Summary
        </p>
        <p className="font-body text-body-lg leading-[1.75] text-ink md:col-span-8 md:col-start-4">
          {SUMMARY}
        </p>
      </div>
    </section>
  );
}
```

(This also drops the `"use client"` directive and the `Reveal`/`RevealGroup` import — the section is now a static server component, matching DESIGN.md's "everything but the hero load and Decision Record reveal is static.")

- [ ] **Step 4: Verify**

Run: `npm run build`
Expected: succeeds. Run `npm run dev`, load `/`, confirm the Summary section renders immediately (no fade-in on scroll) and reads the new copy.

- [ ] **Step 5: Commit**

```bash
git add src/app/data/hero.ts src/app/data/summary.ts src/components/Summary.tsx
git commit -m "content: rewrite hero and summary for Product Engineer positioning, drop leader framing"
```

---

### Task 6: "How I work" home band (no numbered steps)

**Files:**
- Create: `src/components/HowIWork.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Produces: `export default function HowIWork()` — a server component, no props, rendered directly in `page.tsx` between `<Summary />` and `<HomeProjects />`.

- [ ] **Step 1: Create `HowIWork.tsx`**

```tsx
export default function HowIWork() {
  return (
    <section aria-labelledby="how-i-work-heading" className="border-t border-line px-6 py-16 md:px-16 md:py-20">
      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-12 md:gap-8">
        <p
          id="how-i-work-heading"
          className="font-ui text-micro font-medium uppercase tracking-[0.14em] text-ink-muted md:col-span-3"
        >
          How I work
        </p>
        <div className="flex flex-col gap-5 md:col-span-8 md:col-start-4">
          <p className="font-body text-body-lg leading-[1.75] text-ink">
            A customer&rsquo;s ask rarely arrives as a spec. I write it myself, then build against it end to end — no PM handoff, no EM rewrite in between.
          </p>
          <p className="font-body text-body leading-[1.7] text-ink-muted">
            Penny Software&rsquo;s Vendor Pre-Qualification System is the clearest example. It started as one customer&rsquo;s manual process and one conversation with me, and it ended as shipped software, schema to UI, built and owned alone.
          </p>
        </div>
      </div>
    </section>
  );
}
```

Deliberately prose, not a numbered `1 · 2 · 3` step row — that pattern is explicitly banned in the design brief, and rendering "ask → spec → build" as three enumerated steps would also reintroduce the rule-of-three cadence the copy rules ban.

- [ ] **Step 2: Wire it into `page.tsx`**

Replace:

```tsx
import Hero from "@/components/Hero";
import Summary from "@/components/Summary";
import HomeProjects from "@/components/HomeProjects";
```

with:

```tsx
import Hero from "@/components/Hero";
import Summary from "@/components/Summary";
import HowIWork from "@/components/HowIWork";
import HomeProjects from "@/components/HomeProjects";
```

and replace:

```tsx
      <Hero />
      <Summary />
      <HomeProjects projects={projects} />
```

with:

```tsx
      <Hero />
      <Summary />
      <HowIWork />
      <HomeProjects projects={projects} />
```

- [ ] **Step 3: Verify**

Run: `npm run build`
Expected: succeeds. `npm run dev`, load `/`, confirm the new section renders between Summary and Projects.

- [ ] **Step 4: Commit**

```bash
git add src/components/HowIWork.tsx src/app/page.tsx
git commit -m "feat: add How I Work band stating ownership positioning, no numbered steps"
```

---

### Task 7: Experience rewrite — founding engineer, Vendor Pre-Qualification, drop 60k figure

**Files:**
- Modify: `src/app/data/experience.ts`
- Modify: `src/components/HomeExperience.tsx`
- Modify: `src/components/ExperienceContent.tsx:9`

**Interfaces:**
- Produces: `RECENT_EXPERIENCE` array — same `ExperienceItem` shape, bullets/dates content only. `HomeExperience.tsx` and `ExperienceContent.tsx` both read `RECENT_EXPERIENCE[0]`/`.map()` unchanged.

- [ ] **Step 1: Rewrite `experience.ts`**

Replace the whole file:

```ts
export type ExperienceItem = {
  role: string;
  company: string;
  dates: string;
  bullets: string[];
  tech?: string[];
  link?: string;
};

export const RECENT_EXPERIENCE: ExperienceItem[] = [
  {
    role: "Lead Engineer · Funnels, Websites, Webinars",
    company: "HighLevel",
    dates: "Mar 2026 – Jun 2026",
    bullets: [
      "Owned Funnels, Websites, and Webinars under a model with no dedicated PM or EM layer — each engineer ran the full SDLC alone, AI-augmented, as a full-stack builder.",
      "Reworked the reverse proxy engine serving every website and funnel built on the platform, for better performance and resilience against cache purges and downtime.",
    ],
  },
  {
    role: "Lead Engineer",
    company: "Penny Software",
    dates: "Jan 2024 – Aug 2025",
    bullets: [
      "Founding engineer at Penny Software, five years in by this point, and still the one owning platform architecture.",
      "Designed the modular, multi-tenant procurement system that grew to $1B+ GTV across millions of records, tuned to hold sub-200ms queries at that scale.",
      "Built RBAC and multi-tenant security in-house, from scratch.",
      "Mentored a 12-person team across frontend, backend, and QA — code review and clean-code standards that stuck, not just got proposed.",
    ],
    tech: ["Angular", "NestJS", "MongoDB", "Nx", "GCP"],
  },
  {
    role: "Product Specialist",
    company: "Penny Software",
    dates: "Apr 2022 – Dec 2023",
    bullets: [
      "Sat directly with a customer who was vetting vendors by hand, wrote the spec myself, then built and owned the Vendor Pre-Qualification System solo, schema to UI.",
      // TODO: add a real adoption/impact figure for the Vendor Pre-Qualification
      // System once Ashwin supplies one — do not invent a number here.
      "Optimized APIs and database queries across critical paths, cutting response times by 40%+ as usage grew.",
      "Pushed the team onto iterative agile delivery, cutting release cycles by 1.5x.",
    ],
    tech: ["Angular", "NestJS", "MongoDB", "Nx"],
  },
  {
    role: "Full Stack Developer",
    company: "Penny Software",
    dates: "Jun 2020 – Mar 2022",
    bullets: [
      "Joined Penny Software as a founding engineer, shipping features across the full stack while the product and the team were still being built.",
      "Modularized the frontend and introduced lazy-loaded workspaces, keeping it scalable as usage grew past thousands of active users.",
    ],
    tech: ["Angular", "NestJS", "MongoDB"],
  },
  {
    role: "Senior Full Stack Developer",
    company: "Manaraah",
    dates: "Jan 2020 – Jun 2020",
    bullets: [
      "Translated ambiguous requirements into maintainable, production-grade features.",
      "Partnered with stakeholders to de-risk deployments and support adoption.",
    ],
    tech: ["Angular", "Node.js", "MongoDB", "AWS"],
  },
  {
    role: "Software Development Engineer",
    company: "WeCP",
    dates: "Jan 2019 – Jan 2020",
    bullets: [
      "Enhanced onboarding flows and stabilized critical evaluation journeys.",
      "Guided interns and juniors through architecture, reviews, and delivery.",
    ],
    tech: ["Angular", "Node.js", "MongoDB", "AWS"],
  },
  {
    role: "Junior Programmer",
    company: "Reubro International",
    dates: "Aug 2018 – Jan 2019",
    bullets: [
      "Shipped incremental enhancements while learning enterprise release discipline.",
    ],
    tech: ["Angular", "Node.js"],
  },
] as const;
```

- [ ] **Step 2: Fix the home teaser line in `HomeExperience.tsx`**

Replace (lines 30-33):

```tsx
          <Reveal>
            <p className="max-w-2xl font-body text-body leading-[1.7] text-ink-muted">
              Eight years, seven roles, five companies — from junior programmer to lead engineer
              directing a twelve-person team.
            </p>
          </Reveal>
```

with:

```tsx
          <p className="max-w-2xl font-body text-body leading-[1.7] text-ink-muted">
            Eight years, seven roles, five companies — including five years as a founding engineer at Penny Software.
          </p>
```

Also remove the now-unused `Reveal`/`RevealGroup` wrappers around the rest of this file's JSX (drop the `"use client"` directive and the `Reveal`/`RevealGroup` import, un-wrap every `<Reveal>...</Reveal>` and `<RevealGroup>...</RevealGroup>` down to their plain children) — same static-by-default treatment as Task 5's `Summary.tsx`. The full corrected file:

```tsx
import Link from "next/link";
import { RECENT_EXPERIENCE } from "@/app/data/experience";

export default function HomeExperience() {
  const [latest] = RECENT_EXPERIENCE;

  return (
    <section aria-labelledby="experience-heading" className="border-t border-line px-6 py-16 md:px-16 md:py-20">
      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-12 md:gap-8">
        <p
          id="experience-heading"
          className="font-ui text-micro font-medium uppercase tracking-[0.14em] text-ink-muted md:col-span-3"
        >
          Experience
        </p>

        <div className="flex flex-col gap-6 md:col-span-8 md:col-start-4">
          <div className="flex flex-col gap-1.5">
            <p className="font-data text-small text-accent">{latest.dates}</p>
            <p className="font-display text-heading font-semibold text-ink">{latest.role}</p>
            <p className="font-body text-body text-ink-muted">{latest.company}</p>
          </div>

          <p className="max-w-2xl font-body text-body leading-[1.7] text-ink-muted">
            Eight years, seven roles, five companies — including five years as a founding engineer at Penny Software.
          </p>

          <Link
            href="/experience"
            className="inline-flex items-center gap-2 font-ui text-body text-ink transition-colors duration-200 hover:text-accent"
          >
            Full record, all seven roles →
          </Link>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Fix the intro phrase in `ExperienceContent.tsx:9`**

Replace:

```tsx
const introText =
  "Eight years across seven roles and five companies, from junior programmer to lead engineer directing a twelve-person team. Every line below is a fact, not a claim — dates and the stack that shipped them.";
```

with:

```tsx
const introText =
  "Eight years across seven roles and five companies, from junior programmer to founding engineer at Penny Software. Every line below is a fact, not a claim — dates and the stack that shipped them.";
```

- [ ] **Step 4: Verify**

Run: `npm run build`
Expected: succeeds. `npm run dev`, check `/` (Experience teaser) and `/experience` (full record) — confirm the founding-engineer fact appears on both, no "directing a twelve-person team" or "60,000+ marketing agencies" text remains anywhere.

Run: `rg -n "directing a twelve|60,000|60000" src` — expect no output.

- [ ] **Step 5: Commit**

```bash
git add src/app/data/experience.ts src/components/HomeExperience.tsx src/components/ExperienceContent.tsx
git commit -m "content: rewrite Experience for ownership framing, state founding-engineer fact, add Vendor Pre-Qualification System"
```

---

### Task 8: Booklet fact corrections in `projects.ts`

**Files:**
- Modify: `src/app/data/projects.ts:6-10, 58-105`

**Interfaces:**
- Modifies: `ProjectLinks` type — adds optional `vscode?: string`.
- Consumed by: Task 9's `LINK_LABELS` update in `projects/[slug]/page.tsx`.

- [ ] **Step 1: Extend `ProjectLinks` to carry the VS Code Marketplace link**

Replace (lines 6-10):

```ts
export type ProjectLinks = {
  live?: string;
  github?: string;
  npm?: string;
};
```

with:

```ts
export type ProjectLinks = {
  live?: string;
  github?: string;
  npm?: string;
  vscode?: string;
};
```

- [ ] **Step 2: Fix Booklet's tagline, description, facts, highlights, and links**

Replace the Booklet entry's `tagline` (line 58):

```ts
    tagline: "Write Markdown, get a shareable page, backed by an API, CLI, GitHub Action, and MCP server.",
```

with:

```ts
    tagline: "Write Markdown, get a shareable page, backed by an API, CLI, VS Code extension, GitHub Action, and MCP server.",
```

Replace the second description paragraph (line 61) — find `"a published CLI (readable-cli on npm)"` and replace with `"a published CLI (booklet-cli on npm)"`; the rest of that paragraph is unchanged.

Replace `facts[0]` (line 65):

```ts
      { label: "Interfaces", value: "Web, CLI, REST API, GitHub Action, MCP server" },
```

with:

```ts
      { label: "Interfaces", value: "Web, CLI, VS Code extension, REST API, GitHub Action, MCP server" },
```

Replace `highlights[0].detail` (lines 72-73):

```ts
        detail:
          "A versioned REST API, readable-cli published on npm, a GitHub Action for CI publishing, and a standalone MCP server exposing publish_page, update_page, list_pages, and delete_page to AI assistants.",
```

with:

```ts
        detail:
          "A versioned REST API, booklet-cli published on npm, a VS Code extension on the Marketplace, a GitHub Action for CI publishing, and a standalone MCP server exposing publish_page, update_page, get_page, list_pages, and delete_page to AI assistants.",
```

Replace `links` (lines 91-94):

```ts
    links: {
      live: "https://booklet.ashwinsathian.com",
      npm: "https://www.npmjs.com/package/readable-cli",
    },
```

with:

```ts
    links: {
      live: "https://booklet.ashwinsathian.com",
      npm: "https://www.npmjs.com/package/booklet-cli",
      vscode: "https://marketplace.visualstudio.com/items?itemName=AshwinSathian.booklet-vscode",
    },
```

- [ ] **Step 3: Verify**

Run: `npm run build`
Expected: succeeds. Run `rg -n "readable-cli" src` — expect no output (confirms the dead-package reference is fully gone).

- [ ] **Step 4: Commit**

```bash
git add src/app/data/projects.ts
git commit -m "fix: correct stale Booklet facts (readable-cli is unpublished, add VS Code extension, fix MCP tool count)"
```

---

### Task 9: Problem/Decision/Outcome case studies + link label

**Files:**
- Modify: `src/app/data/projects.ts` (add `CaseStudy` type + field, populate 4 featured projects)
- Modify: `src/app/projects/[slug]/page.tsx` (render the new section, add `vscode` to `LINK_LABELS`)

**Interfaces:**
- Produces: `export type CaseStudy = { problem: string; decision: string; outcome: string }`, and `Project.caseStudy?: CaseStudy`.
- Consumed by: `projects/[slug]/page.tsx`, rendered only `{project.caseStudy && (...)}` — non-featured projects with no `caseStudy` field keep rendering exactly as before (backward compatible, no regression).

- [ ] **Step 1: Add the `CaseStudy` type next to `DecisionRecord`**

In `projects.ts`, after the existing `DecisionRecord` type (after line 28), add:

```ts
export type CaseStudy = {
  problem: string;
  decision: string;
  outcome: string;
};
```

And add the field to `Project` (in the type, right after `decisionRecord?: DecisionRecord;`):

```ts
  caseStudy?: CaseStudy;
```

- [ ] **Step 2: Add `caseStudy` to Booklet** (insert right after `decisionRecord` in the Booklet object)

```ts
    caseStudy: {
      problem:
        "Sharing a Markdown file with someone means sending a raw .md file, pasting it into a doc tool that reformats it badly, or standing up a static site generator for one page. The fast options don't render properly; the option that renders properly isn't fast.",
      decision:
        "Built Booklet as a full product around one conversion: paste or write Markdown, get a rendered, shareable URL immediately, with the same pipeline (unified/remark, GFM, math, Mermaid) backing a web editor, a REST API, a CLI, a VS Code extension, a GitHub Action, and an MCP server. Shipped on Cloudflare Workers via OpenNext first, then rolled the app back to a self-hosted PM2 process behind a Cloudflare Tunnel in May 2026 once the operational tradeoffs of the serverless path showed up in production.",
      outcome:
        "One Markdown pipeline now serves five different ways of publishing a page: from a browser, a terminal, an editor, a CI pipeline, or an AI assistant, all against the same versioned API.",
    },
```

- [ ] **Step 3: Add `caseStudy` to BRNR** (insert after BRNR's `links` block, since BRNR has no `decisionRecord`)

```ts
    caseStudy: {
      problem:
        "Most messaging apps that promise privacy still keep an account system, a message history, or a server that could theoretically read plaintext — any one of which is something to compromise or subpoena later.",
      decision:
        "Built BRNR with no account system at all: a 12-character code starts a chat, an X3DH handshake feeds a Double Ratchet implemented in its own tested crypto workspace, and Redis is the only datastore, with every key TTL'd so nothing outlives its 24-hour purpose. The server only ever sees ciphertext once the handshake completes, and the AGPL-3.0 license was chosen specifically so a modified server has to stay open.",
      outcome:
        "Nothing durable exists to breach: no user table, no message history, no plaintext on the server at any point after the handshake.",
    },
```

- [ ] **Step 4: Add `caseStudy` to Wayfarer** (insert right after Wayfarer's `decisionRecord`)

```ts
    caseStudy: {
      problem:
        "API clients that store your secrets ask you to trust their account system, their pricing page, and their acquisition risk with the credentials you paste into them.",
      decision:
        "Built Wayfarer to run entirely client-side: collections and requests live in IndexedDB, and secrets get their own vault where PBKDF2 (200,000 iterations) derives an AES-GCM-256 key held only in memory, so IndexedDB never sees anything but ciphertext. Renamed from API Sandbox to Wayfarer mid-life, same storage model and license carried forward, shipped as v1.0.0 of the new name rather than a quiet find-and-replace.",
      outcome:
        "No account, no backend, nothing that can gate access to data that was always yours — and pre/post-request scripts run sandboxed in a Web Worker with no DOM, cookie, or network access, so a pasted script can't exfiltrate anything even if it tried.",
    },
```

- [ ] **Step 5: Add `caseStudy` to Darkframe** (insert right after Darkframe's `decisionRecord`)

```ts
    caseStudy: {
      problem:
        "Most dark-mode browser extensions recolor everything indiscriminately, including photos and video, which is why so many of them get uninstalled the first time an image looks wrong.",
      decision:
        "Built Darkframe's classifier to score color diversity and edge density rather than raw brightness, defaulting to leaving anything it's unsure about untouched, with video, canvas, and audio excluded unconditionally. Theming applies as one additive CSS Cascade Layer instead of rewriting a page's own stylesheets. Shipped under the name Umbra first, then renamed to Darkframe (npm scope, extension name, storage keys, CSS layer name, and the Safari Xcode project, all of it) after a shipping-readiness review found an existing, active Chrome extension called \"Umbra Dark Mode.\"",
      outcome:
        "144 passing unit tests, a Chrome MV3 build E2E-verified against real Chromium, and a real, buildable Safari Xcode project — plus one disclosed and fixed High-severity CSS injection vulnerability, documented in CHANGELOG.md rather than quietly patched.",
    },
```

- [ ] **Step 6: Add the `vscode` link label in `projects/[slug]/page.tsx`**

Replace (lines 47-51):

```tsx
const LINK_LABELS: Record<keyof NonNullable<Awaited<ReturnType<typeof getProject>>>["links"], string> = {
  live: "Visit live site",
  github: "View on GitHub",
  npm: "View on npm",
};
```

with:

```tsx
const LINK_LABELS: Record<keyof NonNullable<Awaited<ReturnType<typeof getProject>>>["links"], string> = {
  live: "Visit live site",
  github: "View on GitHub",
  npm: "View on npm",
  vscode: "Install for VS Code",
};
```

- [ ] **Step 7: Render the Problem/Decision/Outcome section**

In `projects/[slug]/page.tsx`, replace the existing free-flow description block (lines 165-172):

```tsx
      {/* Description */}
      <div className="mb-12 flex max-w-2xl flex-col gap-5">
        {project.description.map((paragraph, i) => (
          <p key={i} className="font-body text-[16px] leading-[1.8] text-ink-muted">
            {paragraph}
          </p>
        ))}
      </div>
```

with:

```tsx
      {/* Problem / Decision / Outcome — the four featured case studies get
          this explicit structure; other projects fall back to the plain
          description paragraphs so nothing regresses for them. */}
      {project.caseStudy ? (
        <div className="mb-12 flex max-w-2xl flex-col gap-8">
          {(
            [
              ["Problem", project.caseStudy.problem],
              ["Decision", project.caseStudy.decision],
              ["Outcome", project.caseStudy.outcome],
            ] as const
          ).map(([label, text]) => (
            <div key={label}>
              <h2 className="mb-2 font-ui text-xs font-medium uppercase tracking-[0.08em] text-ink-muted">
                {label}
              </h2>
              <p className="font-body text-[16px] leading-[1.8] text-ink-muted">{text}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="mb-12 flex max-w-2xl flex-col gap-5">
          {project.description.map((paragraph, i) => (
            <p key={i} className="font-body text-[16px] leading-[1.8] text-ink-muted">
              {paragraph}
            </p>
          ))}
        </div>
      )}
```

- [ ] **Step 8: Verify**

Run: `npm run build`
Expected: succeeds. `npm run dev`, load `/projects/booklet`, `/projects/brnr`, `/projects/wayfarer`, `/projects/darkframe` — each should show Problem/Decision/Outcome headers instead of two plain paragraphs. Load `/projects/ngx-runtime-i18n` (non-featured, no `caseStudy`) and confirm it still renders the old plain-paragraph layout unchanged.

- [ ] **Step 9: Commit**

```bash
git add src/app/data/projects.ts "src/app/projects/[slug]/page.tsx"
git commit -m "feat: restructure the 4 featured case studies as Problem/Decision/Outcome"
```

---

### Task 10: Booklet architecture diagram

**Files:**
- Create: `src/components/ArchitectureDiagram.tsx`
- Modify: `src/app/data/projects.ts` (Booklet gets `hasArchitectureDiagram: true`, or simpler: check `slug === "booklet"` at the render site)
- Modify: `src/app/projects/[slug]/page.tsx` (render the diagram on Booklet's page only)

**Interfaces:**
- Produces: `export default function ArchitectureDiagram()` — a static server component, no props (Booklet-specific content is hardcoded inside it, since this is the one diagram this plan builds; a generic/reusable version is unnecessary YAGNI for a single consumer).

- [ ] **Step 1: Create `ArchitectureDiagram.tsx`**

```tsx
const TIER_BOX =
  "flex flex-col gap-1 rounded border border-line bg-paper-raised px-4 py-3 text-center";

export default function ArchitectureDiagram() {
  return (
    <figure aria-labelledby="architecture-diagram-caption" className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-3">
        <p className="font-data text-[11px] uppercase tracking-[0.12em] text-ink-muted">
          Clients — all consumers of one REST API
        </p>
        <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-5">
          {[
            "Browser (Web UI)",
            "booklet-cli (npm)",
            "booklet-vscode (Marketplace)",
            "CI, via publish-to-booklet (GitHub Action)",
            "AI assistants, via MCP",
          ].map((label) => (
            <div key={label} className={TIER_BOX}>
              <span className="font-body text-[13px] leading-snug text-ink">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div aria-hidden className="mx-auto font-data text-ink-muted">↓</div>

      <div className="flex flex-col items-center gap-3">
        <p className="font-data text-[11px] uppercase tracking-[0.12em] text-ink-muted">
          Application tier — PM2, self-hosted, behind a Cloudflare Tunnel
        </p>
        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 sm:max-w-2xl">
          <div className={TIER_BOX}>
            <span className="font-body text-[13px] font-medium text-ink">booklet-app</span>
            <span className="font-data text-[12px] text-ink-muted">Next.js 16 · web UI + REST API · :3100</span>
          </div>
          <div className={TIER_BOX}>
            <span className="font-body text-[13px] font-medium text-ink">booklet-mcp</span>
            <span className="font-data text-[12px] text-ink-muted">
              MCP bridge · :8788 → calls booklet-app over loopback HTTP
            </span>
          </div>
        </div>
      </div>

      <div aria-hidden className="mx-auto font-data text-ink-muted">↓</div>

      <div className="flex flex-col items-center gap-3">
        <p className="font-data text-[11px] uppercase tracking-[0.12em] text-ink-muted">
          Data + auth
        </p>
        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 sm:max-w-2xl">
          <div className={TIER_BOX}>
            <span className="font-body text-[13px] font-medium text-ink">MongoDB</span>
            <span className="font-data text-[12px] text-ink-muted">pages, users, sessions</span>
          </div>
          <div className={TIER_BOX}>
            <span className="font-body text-[13px] font-medium text-ink">In-house auth</span>
            <span className="font-data text-[12px] text-ink-muted">
              argon2id password hashing, HMAC-peppered session tokens
            </span>
          </div>
        </div>
      </div>

      <figcaption
        id="architecture-diagram-caption"
        className="mx-auto max-w-xl text-center font-body text-[14px] leading-relaxed text-ink-muted"
      >
        Both processes run under PM2 on a single Mac, reachable only through a Cloudflare Tunnel — no cloud compute. This replaced a Cloudflare Workers/OpenNext deployment, rolled back 2026-05-25 once its operational tradeoffs showed up in production.
      </figcaption>
    </figure>
  );
}
```

- [ ] **Step 2: Render it on Booklet's case study page only**

In `projects/[slug]/page.tsx`, add the import:

```tsx
import ArchitectureDiagram from "@/components/ArchitectureDiagram";
```

Insert the diagram right after the Problem/Decision/Outcome block from Task 9 (before the `{/* Stack */}` comment):

```tsx
      {/* Architecture diagram — Booklet only, the flagship technical case
          study, per the design brief's requirement for at least one real
          system diagram on the site. */}
      {project.slug === "booklet" && (
        <div className="mb-16 rounded border border-line bg-paper p-6 md:p-10">
          <ArchitectureDiagram />
        </div>
      )}
```

- [ ] **Step 3: Verify**

Run: `npm run build`
Expected: succeeds. `npm run dev`, load `/projects/booklet` — confirm the diagram renders between the case-study text and the tech-stack pills, with all five client types, both processes, and the data/auth tier visible. Load `/projects/wayfarer` and confirm the diagram does NOT render there (Booklet-only).

- [ ] **Step 4: Commit**

```bash
git add src/components/ArchitectureDiagram.tsx "src/app/projects/[slug]/page.tsx"
git commit -m "feat: add Booklet architecture diagram (clients, app tier, data/infra)"
```

---

### Task 11: `llms.txt` resync

**Files:**
- Modify: `public/llms.txt`

**Interfaces:** None — static text file, no code consumes its content at build time.

- [ ] **Step 1: Rewrite `public/llms.txt` in full**

```
# Ashwin Sathian

> Senior full-stack engineer, 7+ years. Founding engineer at Penny Software for five of them, taking it from zero to a procurement platform moving $1B+ a year. Eight independent products shipped on his own time, each checked against the actual repo.

## Site

/ (home) states the positioning in one line, a compact projects list, an
experience snapshot, and the stack — everything below fans out to a
dedicated page: /projects (index + 8 case studies), /experience (the full
seven-role record), /writing. Four project case studies — Booklet, BRNR,
Wayfarer, and Darkframe — are structured as Problem, Decision, and Outcome
rather than a feature list; three of those four (Booklet, Wayfarer,
Darkframe) also carry a dated Decision Record documenting a real, disclosed
reversal (a rollback, a rename) with before/after reasoning. Booklet's case
study additionally includes a real system architecture diagram (clients,
application tier, data/infra).

## About

Ashwin Sathian is an engineer based in Kochi, Kerala, India, with 7+ years
across full-stack and platform engineering. He joined Penny Software, a B2B
procurement SaaS platform, as a founding engineer in June 2020 and stayed
five years, progressing from Full Stack Developer to Product Specialist to
Lead Engineer. As Lead Engineer he owned platform architecture for a
modular, multi-tenant procurement system that grew to $1B+ GTV across
millions of records, designed to hold sub-200ms queries at that scale, built
RBAC and multi-tenant security in-house, and mentored a 12-person team. As
Product Specialist he sat directly with a customer who was vetting vendors
by hand, wrote the spec himself, and built and owned the Vendor
Pre-Qualification System solo, schema to UI; he also cut API/database
response times by 40%+ and pushed the team onto iterative agile delivery,
cutting release cycles by 1.5x.

From March to June 2026 he was Lead Engineer for HighLevel's Funnels,
Websites, and Webinars products, under a model with no dedicated PM or EM
layer — each engineer ran the full SDLC alone, AI-augmented, as a
full-stack builder. He reworked the reverse proxy engine serving every
website and funnel built on the platform.

Ashwin uses AI tooling — Claude Code and OpenAI Codex — to work faster
without changing who owns the decisions: he still writes the spec and ships
the code himself.

## Career History

- **HighLevel**: Lead Engineer, Funnels/Websites/Webinars (Mar 2026–Jun 2026)
- **Penny Software**: Lead Engineer (Jan 2024–Aug 2025)
- **Penny Software**: Product Specialist, hybrid engineering and product (Apr 2022–Dec 2023)
- **Penny Software**: Full Stack Developer, founding engineer (Jun 2020–Mar 2022)
- **Manaraah**: Senior Full Stack Developer (Jan 2020–Jun 2020)
- **WeCP**: Software Development Engineer (Jan 2019–Jan 2020)
- **Reubro International**: Junior Programmer (Aug 2018–Jan 2019)

## Skills & Stack

**Frontend:** Angular, React, Next.js
**Backend:** Node.js, NestJS, Express
**Data:** MongoDB, AWS DynamoDB
**Cloud & DevOps:** AWS, GCP, Docker, GitHub Actions
**Languages:** TypeScript, JavaScript, Python, HTML/CSS
**AI & Tooling:** Claude Code, OpenAI Codex

## Education

B.Tech, Electronics and Communication Engineering, National Institute of Technology Calicut (2014–2018)

## Projects

Eight projects designed, built, and run end to end, outside of work. Full case studies at ashwinsathian.com/projects/[slug].

- **Booklet** (booklet.ashwinsathian.com): Markdown-to-shareable-page SaaS product with a web editor, REST API, published CLI (booklet-cli on npm), a VS Code extension on the Marketplace, a GitHub Action, and an MCP server exposing 5 tools for AI assistants. Next.js 16, MongoDB, in-house auth. Self-hosted via PM2 behind a Cloudflare Tunnel, after rolling back off Cloudflare Workers/OpenNext in May 2026.
- **BRNR**: End-to-end encrypted, ephemeral messaging. No accounts, 24-hour message expiry, Redis-only persistence with hard TTLs, X3DH handshake plus Double Ratchet encryption. NestJS, Socket.IO, Expo/React Native. AGPL-3.0.
- **Wayfarer** (wayfarer.ashwinsathian.com): Local-first API testing client with no account. Collections, environments, client-side encrypted secrets vault (PBKDF2 + AES-GCM-256), sandboxed script execution. Angular, IndexedDB. Renamed from API Sandbox. MIT.
- **ngx-runtime-i18n**: Signals-first runtime internationalisation for Angular; SSR-safe via TransferState, configurable fallback chains. Three packages published on npm. MIT.
- **Typester**: Keyboard-first typing speed game (typester.ashwinsathian.com). Ground-up rebuild of a 2018 app; zoneless Angular 22, signals-first, no NgRx, static prerendered deploy via Cloudflare Workers Builds. MIT.
- **Darkframe** (github.com/AshwinSathian/umbra): Free, open-source, image-safe dark-mode engine for Chrome and Safari. OKLCH-native recoloring, 144 passing unit tests, real E2E-verified Chrome extension and buildable Safari Xcode project. Renamed from "Umbra" after finding a naming collision; disclosed and fixed a High-severity CSS injection vulnerability in the same changelog entry. MIT.
- **better-auth-mongoose** (better-auth-mongoose.ashwinsathian.com): Published npm package (Mongoose-native database adapter for Better Auth) closing a real, long-documented gap in the Better Auth ecosystem. CI-proven .populate() support, a companion tenant-scoping plugin, a real NestJS integration example. MIT.
- **humanize-writing-skill** (github.com/AshwinSathian/humanize-writing-skill): A Claude Code skill that makes AI-written text read as a specific, considered human voice, built from three cited research passes and a teardown of 13 existing public humanizer skills. MIT.

## Writing

Ashwin publishes technical notes at ashwinsathian.com/writing, newest first:

- "Why \"Humanize My Writing\" Tools Don't Work" (2026-08-18): why AI-writing detection research points at structure, not word lists, and why most humanizer tools miss that.
- "Why Better Auth's MongoDB adapter can't populate() a Mongoose ref" (2026-08-17): the gap in Better Auth's official MongoDB adapter that better-auth-mongoose closes.
- "Why ngx-runtime-i18n treats the active language as a signal, not an Observable" (2026-08-17): the signals-first design decision behind ngx-runtime-i18n, and its RxJS compat layer.
- "Runtime i18n for Angular, done right: @ngx-runtime-i18n" (2025-10-27): the original introduction to ngx-runtime-i18n's SSR-safe, signals-first approach.

## Contact

- Email: ashwinsathyan19@gmail.com
- LinkedIn: https://linkedin.com/in/ashwinsathian
- GitHub: https://github.com/AshwinSathian
- Website: https://ashwinsathian.com
- Resume: https://ashwinsathian.com/Resume.pdf
```

- [ ] **Step 2: Verify**

Run: `rg -n "AI-Augmented|AI-augmented senior|60,000|readable-cli|engineering leadership" public/llms.txt` — expect no output except the one intentional, factual mention of "AI-augmented" describing the HighLevel operating model (not a self-label).

- [ ] **Step 3: Commit**

```bash
git add public/llms.txt
git commit -m "content: resync llms.txt to the Product Engineer repositioning"
```

---

### Task 12: Final adversarial pass, build, visual review

**Files:** None new — verification only.

- [ ] **Step 1: Full-repo grep for anything missed**

```bash
rg -ni "engineering leader|ai-augmented senior|ai-augmented engineer|60,000|60000|readable-cli|directing a twelve|engineering culture" src public
```

Expected: no matches (the one legitimate factual "AI-augmented" mention describing HighLevel's operating model, added in Task 7/11, is phrased as "AI-augmented, as a full-stack builder" / "AI-augmented, using AI tooling" — a description of a way of working, not a self-applied title — confirm by reading each match in context if any appear).

- [ ] **Step 2: Banned-pattern re-check**

Confirm none of the following exist anywhere touched by this plan: purple-to-blue gradients, glassmorphism/backdrop-blur, a numbered 1-2-3 step row, `rounded-2xl`/`rounded-xl` on a card, a repeated badge/pill asserting "verified," fake terminal/dashboard mockups. Spot-check `HowIWork.tsx`, the Problem/Decision/Outcome sections, and `ArchitectureDiagram.tsx` visually via `npm run dev`.

- [ ] **Step 3: Copy voice re-check**

Run: `rg -ni "\brobust\b|\bseamless\b|\bdynamic\b|\bdelve\b|\bunderscore\b|\bpivotal\b|\bleverage\b|\bunlock\b|\bmoreover\b|\bfurthermore\b" src/app/data public/llms.txt`
Expected: no matches in any of the content this plan touched.

- [ ] **Step 4: Full build**

Run: `npm run build`
Expected: succeeds with no TypeScript errors. This is the project's established verification gate (`next lint` is separately known-broken and pre-existing, not a regression from this work).

- [ ] **Step 5: Manual visual review**

Run: `npm run dev`, then load and visually check each of: `/`, `/projects`, `/projects/booklet`, `/projects/brnr`, `/projects/wayfarer`, `/projects/darkframe`, `/experience`. Confirm: dark near-black background throughout, vermilion accent (not amber) on links/active states, Public Sans headings with real weight contrast, Martian Mono on dates/tags, no scroll-triggered fade on Summary/HowIWork/Experience-teaser, Booklet's diagram renders cleanly at both desktop and mobile widths (resize the window or use device toolbar).

- [ ] **Step 6: Report and hand off for push/deploy**

Summarize what changed and explicitly ask whether to `git push` and run `npm run deploy` (opennextjs-cloudflare) — deploy on this repo is manual and not git-triggered, per standing project practice, and both are actions with external visibility that warrant explicit confirmation before running.

---

## Plan Self-Review

**Spec coverage:** §2 (Booklet fact corrections) → Task 8. §3 (Decision Record kept structurally, one-accent before/after) → already true in the existing `DecisionRecord.tsx` (verified during planning, no change needed beyond the Task 1 token swap it inherits automatically). §4 (IA, no `/about`) → no route changes made, confirmed. §5 (diagram content) → Task 10. §6 (copy execution notes, Vendor Pre-Qualification placeholder handling) → Task 7. §7 (SEO/AEO/GEO) → Tasks 3 and 11. §8 (technical approach) → Tasks 1-11 collectively; `src/lib/github.ts` etc. confirmed untouched.

**Placeholder scan:** No "TBD"/"TODO" left as an unresolved planning gap — the one `// TODO` comment in Task 7 is an intentional, permanent code comment per the spec's own explicit instruction on how to handle the missing Vendor Pre-Qualification metric, not a plan placeholder.

**Type consistency:** `CaseStudy` (Task 9) and `Project.caseStudy?` are defined once and consumed with the same shape in `projects/[slug]/page.tsx`. `ProjectLinks.vscode` (Task 8) is defined once and consumed by both `LINK_LABELS` and the Booklet `links` object (Task 9's Step 6, Task 8's Step 2) with matching key name.

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-09-17-product-engineer-repositioning.md`. Two execution options:

1. **Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.
2. **Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints.

Which approach?

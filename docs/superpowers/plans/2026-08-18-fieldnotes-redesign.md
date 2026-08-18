# Field Notes Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current single-page, dark-canvas/signal-green portfolio with a multi-page "engineering log" site — paper/ink visual identity, three new project case studies pulled from a verified GitHub scan, and a Decision Record device built from real disclosed reversals.

**Architecture:** Next.js App Router, one route per concern (`/`, `/projects`, `/projects/[slug]`, `/experience`, `/about`, `/writing`, `/writing/[slug]`). Content stays in typed data modules under `src/app/data/`; presentation is server components except where interactivity (nav active-state, mobile menu) requires a client component. No framer-motion — CSS handles all motion.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4 (`@theme` CSS tokens, no `tailwind.config.ts` theme changes needed), `next/font/google` (JetBrains Mono, Source Serif 4, Archivo).

**Spec:** `docs/superpowers/specs/2026-08-18-fieldnotes-redesign-design.md`

**Test cycle note:** This repo has no test framework (verified: no jest/vitest/playwright in `package.json` devDependencies) and this is a presentational content site with no business logic beyond the already-working `src/lib/github.ts` and `src/lib/writing.ts` (both kept unchanged — do not touch their tests-worth logic). Each task's "test cycle" is therefore: `npx tsc --noEmit` (typecheck), `npm run lint`, and — for any task that produces a renderable page or a visually meaningful component — a Playwright screenshot at 1440×900 and 390×844 (mobile) checked against that task's stated visual intent. The dev server should already be reachable; if not, start it with `npm run dev` and use whatever port it reports.

## Global Constraints

- Color tokens (light, from spec §4): `paper #EEF0F1`, `paper-raised #E4E7E8`, `ink #14181C`, `ink-muted #5B6570`, `line #D3D7D9`, `accent #263C8B`, `signal #C8712E`, `diff-add #2E7D5B`, `diff-remove #B54B3E`.
- Color tokens (dark, chosen this plan per spec §8 open item, contrast-checked against `paper`/dark-paper): `paper #14171A`, `paper-raised #1D2124`, `ink #EDEFF1`, `ink-muted #9AA3AC`, `line #2B3034`, `accent #7C93E8`, `signal #E08F4E`, `diff-add #4FAE85`, `diff-remove #E07862`.
- Type roles (spec §4): display/headline = JetBrains Mono (`font-display`), long-form body/prose = Source Serif 4 (`font-body`), UI chrome/nav/labels = Archivo (`font-ui`, and the default body font).
- No `framer-motion` anywhere in new/modified code. No blanket scroll-triggered fade-on-every-element. Motion is limited to: one home-load stagger, the Decision Record diff-draw-in, and CSS-only hover/focus micro-interactions (spec §4 Motion).
- No fabricated metrics. Every number in Experience/About must trace to `public/llms.txt`, the current site's existing data files, or the resume at `~/Downloads/Resume.pdf` (already read into this plan).
- No photo on `/about`.
- `/writing` stays in primary nav (spec §1.1(1) — user override).
- Decision Records appear only on Booklet, Wayfarer, Darkframe, and Typester — never invented for a project that doesn't have a real documented reversal.
- Project screenshots (new or recaptured): use each project's own light-mode UI where the project supports theming, so it sits naturally in the site's paper-toned frame (spec §6).
- `git commit` after every task, following the existing repo's commit message style (see `git log`).

---

## Task 1: Design tokens, fonts, and the dot-grid texture utility

**Files:**
- Modify: `src/app/globals.css` (full rewrite of the `@theme` block and below; keep the `.prose` block for now, restyle it in Task 13)
- Modify: `src/app/layout.tsx:1-20` (font imports/setup only — full layout restructure is Task 7)

**Interfaces:**
- Produces: Tailwind utility classes `bg-paper`, `bg-paper-raised`, `text-ink`, `text-ink-muted`, `border-line`, `text-accent`/`bg-accent`, `text-signal`/`bg-signal`, `text-diff-add`/`bg-diff-add`, `text-diff-remove`/`bg-diff-remove`, `font-display`, `font-body`, `font-ui`; a `.field-texture` class for the dot-grid background device.

- [ ] **Step 1: Rewrite the `@theme` token block in `globals.css`**

Replace lines 1–23 of `src/app/globals.css` (the `@import`, old `@theme` block with `--color-canvas`/`--color-surface-*`/`--color-ink-*`/`--color-signal*`/shadow tokens) with:

```css
@import "tailwindcss";

@theme {
  /* Light (default) */
  --color-paper: #EEF0F1;
  --color-paper-raised: #E4E7E8;
  --color-ink: #14181C;
  --color-ink-muted: #5B6570;
  --color-line: #D3D7D9;
  --color-accent: #263C8B;
  --color-signal: #C8712E;
  --color-diff-add: #2E7D5B;
  --color-diff-remove: #B54B3E;

  --font-display: var(--font-mono);
  --font-body: var(--font-serif);
  --font-ui: var(--font-sans);

  --shadow-card: 0 0 0 1px rgba(20, 24, 28, 0.08);
  --shadow-card-hover: 0 0 0 1px rgba(20, 24, 28, 0.16);
}

:root {
  color-scheme: light dark;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-paper: #14171A;
    --color-paper-raised: #1D2124;
    --color-ink: #EDEFF1;
    --color-ink-muted: #9AA3AC;
    --color-line: #2B3034;
    --color-accent: #7C93E8;
    --color-signal: #E08F4E;
    --color-diff-add: #4FAE85;
    --color-diff-remove: #E07862;
    --shadow-card: 0 0 0 1px rgba(255, 255, 255, 0.08);
    --shadow-card-hover: 0 0 0 1px rgba(255, 255, 255, 0.16);
  }
}
```

Below that, replace the old `body`/`a:focus-visible`/`::selection` rules (previously hardcoded to `#0a0d10`/`#edeff2`/`#4ce0a6`) with:

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--color-paper);
  color: var(--color-ink);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}

a:focus-visible,
button:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 4px;
  border-radius: 4px;
}

::selection {
  background-color: color-mix(in srgb, var(--color-signal) 30%, transparent);
  color: var(--color-ink);
}

/* Engineering-notebook dot-grid texture. Hero and section-opening moments only. */
.field-texture {
  background-image: radial-gradient(var(--color-ink) 1px, transparent 1px);
  background-size: 24px 24px;
  opacity: 0.05;
}

@media (prefers-contrast: more) {
  .field-texture {
    display: none;
  }
}

/* Home-load stagger — the one orchestrated on-load motion moment (spec §4).
   Consumer applies `.load-fade-up` plus an inline `animationDelay` per
   element; see Task 8. */
@keyframes load-fade-up {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.load-fade-up {
  animation: load-fade-up 0.5s cubic-bezier(0, 0, 0.2, 1) both;
}
@media (prefers-reduced-motion: reduce) {
  .load-fade-up {
    animation: none;
    opacity: 1;
    transform: none;
  }
}
```

Keep the existing `.prose` block and `@media (prefers-reduced-motion: reduce)` block below this, unchanged for now (Task 13 restyles `.prose`; the reduced-motion block already does the right thing structurally and just needs no edits here).

- [ ] **Step 2: Swap the font imports in `layout.tsx`**

In `src/app/layout.tsx`, replace:

```tsx
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
```

and the two font-instantiation blocks, with:

```tsx
import { JetBrains_Mono, Source_Serif_4, Archivo } from "next/font/google";

const displayMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-mono",
  display: "swap",
});

const bodySerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-serif",
  display: "swap",
});

const uiSans = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});
```

Update the `<html>` tag's `className` from `` `${plexSans.variable} ${plexMono.variable}` `` to `` `${displayMono.variable} ${bodySerif.variable} ${uiSans.variable}` ``. Leave everything else in the file (metadata, schema scripts, body) untouched for this task — Task 7 rewrites the body structure.

Also update the inline `style={{ fontFamily: "var(--font-sans)" }}` on `<body>` to `style={{ fontFamily: "var(--font-ui)" }}` so body text defaults to Archivo (UI/label face), with `font-body`/`font-display` applied explicitly per-element in later tasks.

- [ ] **Step 3: Verify**

Run `npx tsc --noEmit` and `npm run lint` — both must pass (font variable renames are the only type-relevant change here). Then run `npm run dev`, navigate to `http://localhost:PORT/`, and confirm via Playwright screenshot that the background is now the light paper color (`#EEF0F1`) and text renders in a visibly different typeface than before — the page will look broken/unstyled in places since no components consume the new tokens yet, which is expected at this stage.

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx
git commit -m "design: paper/ink color tokens, dark-mode variants, new type system"
```

---

## Task 2: Extend the Projects data — 3 new projects, decision records, also-shipped list

**Files:**
- Modify: `src/app/data/projects.ts`

**Interfaces:**
- Produces: `DecisionRecord` type, `Project.decisionRecord?: DecisionRecord` field, 3 new `Project` entries (`darkframe`, `better-auth-mongoose`, `humanize-writing-skill`), `AlsoShipped` type and `ALSO_SHIPPED` array.
- Consumes: nothing new (pure data).

- [ ] **Step 1: Add the `DecisionRecord` type and extend `Project`**

At the top of `src/app/data/projects.ts`, after the existing `ProjectHighlight` type, add:

```ts
export type DecisionRecord = {
  /** "YYYY-MM" — always real, never invented. */
  date: string;
  before: string;
  after: string;
  why: string;
};
```

Add `decisionRecord?: DecisionRecord;` as a new optional field on the `Project` type, after `repo?: { owner: string; repo: string };`.

- [ ] **Step 2: Add `decisionRecord` to the four qualifying existing projects**

To the `booklet` entry, add:

```ts
decisionRecord: {
  date: "2026-05",
  before: "Cloudflare Workers via OpenNext",
  after: "Self-hosted Node process behind a Cloudflare Tunnel",
  why: "The operational tradeoffs of the serverless path showed up in production. It's the kind of call you only get right by shipping the wrong one first.",
},
```

To the `wayfarer` entry, add:

```ts
decisionRecord: {
  date: "2026-07",
  before: "API Sandbox",
  after: "Wayfarer",
  why: "Same local-first storage model, same MIT license, just a name that fit the product better. Shipped as v1.0.0 of the new name, not a quiet find-and-replace.",
},
```

To the `typester` entry, add:

```ts
decisionRecord: {
  date: "2026-07",
  before: "2018 Angular 7 app: direct DOM manipulation outside Angular's reactivity, navigation gated by a mutable bag of untyped booleans, a settings screen that saved nothing",
  after: "Zoneless Angular 22, signals-first, no NgRx, URL-driven game state, static prerendered deploy",
  why: "Every architectural decision in the rebuild traces back to a specific defect in the original, logged with its own before/after reasoning in the project's ARCHITECTURE.md.",
},
```

- [ ] **Step 3: Add the three new project entries**

Append these three entries to the `PROJECTS` array, after `typester` (so the array order is: booklet, brnr, wayfarer, ngx-runtime-i18n, typester, darkframe, better-auth-mongoose, humanize-writing-skill):

```ts
{
  slug: "darkframe",
  name: "Darkframe",
  category: "Browser extension",
  tagline: "A free, cross-browser dark-mode engine that never touches your photos or video.",
  description: [
    "Darkframe is a free, open-source dark-mode engine for Chrome and Safari, built as a constructive overhaul of how tools in this category usually work. Images and video are never altered: a classifier scores color diversity and edge density rather than raw brightness, and leans toward leaving anything it's unsure about untouched, with <video>/<canvas>/<audio> unconditionally excluded. Theming applies as a single additive CSS Cascade Layer rather than rewriting a page's own stylesheets in place, with a CSSOM-direct-rewrite fallback for engines without Cascade Layer support.",
    "The core engine (OKLCH-native perceptual recoloring, a WCAG 2.1 contrast solver, the image/media classifier) is framework-agnostic, with 144 passing unit tests. A Chrome MV3 extension is verified end-to-end against a real Chromium instance via Playwright, and a real, buildable macOS Safari Web Extension Xcode project is generated via Apple's own safari-web-extension-converter and confirmed to build and launch locally. The project has also been through a dedicated security audit and a separate architecture/quality review, with the findings from both disclosed in its CHANGELOG.md rather than quietly folded in.",
  ],
  stack: ["TypeScript", "Chrome MV3", "Safari Web Extension", "OKLCH", "Playwright", "Vitest"],
  facts: [
    { label: "Testing", value: "144 unit tests, E2E-verified against real Chromium" },
    { label: "Platforms", value: "Chrome (MV3) + Safari (macOS), built from one core engine" },
    { label: "License", value: "MIT" },
  ],
  highlights: [
    {
      title: "Image-safe by construction, not by exception list",
      detail:
        "A color-diversity/edge-density classifier decides what's a photo, not a domain blocklist. <video>/<canvas>/<audio> are excluded unconditionally, and anything the classifier is unsure about is left alone.",
    },
    {
      title: "Additive, not destructive",
      detail:
        "Theming is a single injected CSS Cascade Layer; a page's own stylesheets are never rewritten in place. A CSSOM-direct-rewrite fallback covers engines without Cascade Layer support.",
    },
    {
      title: "A disclosed security fix, not a silent patch",
      detail:
        "A High-severity CSS injection vulnerability, found via unescaped control characters in a generated image-selector attribute, is documented in CHANGELOG.md with the exact mechanism and the fix, not just a version bump.",
    },
    {
      title: "Real store-ready builds, not a demo",
      detail:
        "Both the Chrome and Safari listings are fully prepared (packaged build, screenshots, promo art, privacy copy) — submission is blocked on account/identity steps outside the code, not on the software being unfinished.",
    },
  ],
  links: {
    github: "https://github.com/AshwinSathian/umbra",
  },
  media: {
    kind: "screenshot",
    src: "/projects/darkframe/hero.png",
    alt: "Darkframe's Chrome popup: an aperture-ring toggle for the current site, a global-enable switch, and brightness/contrast tuning sliders.",
  },
  repo: { owner: "AshwinSathian", repo: "umbra" },
  decisionRecord: {
    date: "2026-08",
    before: "Umbra",
    after: "Darkframe",
    why: "A shipping-readiness review found an existing, active, same-category Chrome extension called \"Umbra Dark Mode.\" Renamed across the npm scope, extension name, storage keys, CSS layer name, and the Safari Xcode project before either store listing went live.",
  },
},
{
  slug: "better-auth-mongoose",
  name: "better-auth-mongoose",
  category: "Open-source library",
  tagline: "The Mongoose-native database adapter Better Auth's own GitHub issues have been asking for since February 2025.",
  description: [
    "Better Auth's official MongoDB adapter talks to the raw mongodb driver, not Mongoose — the standard ODM for Node and close to universal in NestJS or Express backends. For an app that already uses Mongoose, that forces an extra dependency, two parallel database connections with no shared schema or validation, and broken .populate() calls against anything Better Auth creates. Those are real, long-documented problems on Better Auth's own GitHub, with no first-party fix and no answer beyond a manual workaround that sidesteps the schema and validation problems rather than solving them.",
    "better-auth-mongoose closes that gap properly: Better Auth's own collections become real, registered Mongoose models, extensible the same way any other model in the app is. The differentiator isn't a claim — packages/better-auth-mongoose/test/populate.test.ts is the unit-level proof, and examples/nestjs-mongoose runs the same thing end to end inside a real NestJS app over real HTTP, on every push via CI. It also passes Better Auth's own official adapter contract test suite. A companion tenant-scoping plugin adds automatic, non-convention-based tenant isolation on top of Better Auth's organization plugin.",
  ],
  stack: ["TypeScript", "Mongoose", "Better Auth", "Turborepo", "Changesets", "NestJS"],
  facts: [
    { label: "Published", value: "npm, v0.1.1" },
    { label: "Proof", value: "CI-run test + real NestJS example, not just a claim" },
    { label: "License", value: "MIT" },
  ],
  highlights: [
    {
      title: "Closes a gap Better Auth's own issue tracker has open since Feb 2025",
      detail:
        "Cites the specific upstream issues and discussions the gap comes from, rather than asserting a problem exists. The fix is real, registered Mongoose models, not a workaround.",
    },
    {
      title: ".populate() works, proven in CI",
      detail:
        "A dedicated unit test proves the differentiator directly, and a full NestJS example app exercises the same path over real HTTP on every push.",
    },
    {
      title: "Passes Better Auth's own adapter contract suite",
      detail:
        "Not just internally tested — validated against @better-auth/test-utils, the same conformance suite the official adapters are held to.",
    },
    {
      title: "A tenant-scoping plugin, not just an adapter",
      detail:
        "A companion package adds automatic, non-convention-based tenant isolation on top of Better Auth's organization plugin — the adapter and the multi-tenancy concern are separated, not bundled.",
    },
  ],
  links: {
    live: "https://better-auth-mongoose.ashwinsathian.com",
    github: "https://github.com/AshwinSathian/better-auth-mongoose",
    npm: "https://www.npmjs.com/package/better-auth-mongoose",
  },
  media: {
    kind: "code",
    language: "ts",
    caption: "auth.ts",
    snippet: `import { betterAuth } from "better-auth";
import { mongooseAdapter } from "better-auth-mongoose";
import mongoose, { Schema } from "mongoose";

await mongoose.connect(process.env.MONGO_URI!);

export const auth = betterAuth({
  database: mongooseAdapter(mongoose.connection, {
    schemas: {
      user: new Schema({ role: { type: String, default: "member" } }),
    },
  }),
});`,
  },
  repo: { owner: "AshwinSathian", repo: "better-auth-mongoose" },
},
{
  slug: "humanize-writing-skill",
  name: "humanize-writing-skill",
  category: "Claude Code skill",
  tagline: "A Claude Code skill that makes AI-written text read as a specific, considered human voice — grounded in cited research, not a banned-word list.",
  description: [
    "Most public \"humanizer\" skills reduce to a banned-word list: swap out \"delve,\" cap the em dashes, call it done. That works until the list goes stale, which the research this skill is built on shows happens fast. Word-level tells are real, but the literature is clear that structural uniformity — flat sentence rhythm, symmetric paragraph shapes, safe generic claims instead of specific checkable ones — is the larger, more durable, more model-independent signal. This skill weights structure over vocabulary; the word list is kept as a compact backup, not the mechanism.",
    "It's built from three research passes (academic detection literature, editorial and practitioner style guides, and a cross-referenced catalog of 27 specific AI-writing tells), a teardown of 13 existing public humanizer skills, and one adversarial review round — all cited in reference/, not asserted from folk wisdom. It's distributed three ways: clone-and-symlink into a Claude Code skills directory, as a validated Claude Code plugin manifest, or via npx skills add. Published days before this site's own redesign began, and used to write this site's own copy.",
  ],
  stack: ["Claude Code", "Markdown", "Research synthesis"],
  facts: [
    { label: "Basis", value: "3 research passes + 13-skill teardown, cited in reference/" },
    { label: "Distribution", value: "git+symlink, Claude Code plugin, npx skills add" },
    { label: "License", value: "MIT" },
  ],
  highlights: [
    {
      title: "Structure over vocabulary",
      detail:
        "Targets sentence rhythm, paragraph shape, and specificity of claims — the durable, model-independent signal the research points to — rather than chasing a word list that goes stale with every model update.",
    },
    {
      title: "Cited, not asserted",
      detail:
        "Every design decision traces to reference/research.md or reference/oss-skills-review.md: academic detection literature, editorial style guides, and a direct teardown of 13 competing public skills.",
    },
    {
      title: "Validated as a real plugin",
      detail:
        "Ships a .claude-plugin/plugin.json manifest that passes claude plugin validate . --strict, plus before/after worked examples proving the skill changes real output.",
    },
    {
      title: "The tool that wrote this site's copy",
      detail:
        "Not a hypothetical demo — this skill was in active use for the writing on this redesign, including this sentence.",
    },
  ],
  links: {
    github: "https://github.com/AshwinSathian/humanize-writing-skill",
  },
  media: {
    kind: "code",
    language: "sh",
    caption: "install",
    snippet: `git clone https://github.com/AshwinSathian/humanize-writing-skill.git
ln -s "$(pwd)/humanize-writing-skill" ~/.claude/skills/humanizing-writing

# or, without installing anything:
claude --plugin-dir /path/to/humanize-writing-skill

# or:
npx skills add AshwinSathian/humanize-writing-skill`,
  },
  repo: { owner: "AshwinSathian", repo: "humanize-writing-skill" },
},
```

- [ ] **Step 4: Add the `AlsoShipped` type and list**

At the bottom of the file, before `export function getProjectBySlug`, add:

```ts
export type AlsoShipped = {
  name: string;
  description: string;
  href: string;
};

export const ALSO_SHIPPED: AlsoShipped[] = [
  {
    name: "github-issue-analyzer",
    description:
      "Fastify + TypeScript service that caches a repo's GitHub issues in SQLite and analyzes them with a local LLM over Ollama, so triage never leaves your machine.",
    href: "https://github.com/AshwinSathian/github-issue-analyzer",
  },
];
```

- [ ] **Step 5: Verify**

Run `npx tsc --noEmit` — must pass with no type errors (the `decisionRecord` field is optional, so existing `brnr`/`ngx-runtime-i18n` entries without it stay valid). Run `npm run lint`.

- [ ] **Step 6: Commit**

```bash
git add src/app/data/projects.ts
git commit -m "content: add Darkframe, better-auth-mongoose, humanize-writing-skill; decision records"
```

---

## Task 3: Rewrite Experience data, add the home-page log, retire VerifiedTag's data dependents

**Files:**
- Modify: `src/app/data/experience.ts`
- Modify: `src/app/data/site.ts` (job title only)
- Create: `src/app/data/log.ts`
- Modify: `src/app/data/skills.ts` (restructure for Experience page use, see Step 3)

**Interfaces:**
- Produces: `LogEntry` type + `RECENT_LOG` array (`src/app/data/log.ts`); rewritten `RECENT_EXPERIENCE` bullets in `experience.ts`; `SKILL_GROUPS` (flat list, not two-column) replacing `SKILL_COLUMNS`.

- [ ] **Step 1: Create `src/app/data/log.ts`**

```ts
export type LogEntry = {
  /** "YYYY-MM-DD" */
  date: string;
  text: string;
  href: string;
};

export const RECENT_LOG: LogEntry[] = [
  {
    date: "2026-08-17",
    text: "Published humanize-writing-skill, a Claude Code skill for AI-authored writing that doesn't read AI-authored.",
    href: "/projects/humanize-writing-skill",
  },
  {
    date: "2026-08-10",
    text: "Renamed Umbra to Darkframe after finding a naming collision in the Chrome Web Store — and fixed a High-severity CSS injection bug in the same pass.",
    href: "/projects/darkframe",
  },
  {
    date: "2026-05",
    text: "Rolled Booklet off Cloudflare Workers back to a self-hosted process once the operational tradeoffs showed up in production.",
    href: "/projects/booklet",
  },
];
```

- [ ] **Step 2: Rewrite `RECENT_EXPERIENCE` bullets in `experience.ts` with verified figures**

Replace the `HighLevel` entry's `bullets` array with:

```ts
bullets: [
  "Led engineering for Funnels, Websites, and Webinars — three revenue surfaces inside a platform serving 60,000+ marketing agencies — working directly with peer teams and verticals so collaboration held up both inside the squad and across it.",
  "Drove the AI-augmented Full Stack Builder effort: putting AI tooling to work across the full SDLC — planning, prototyping, building, QA, shipping — as a real change to how the team works, not a novelty layer on top of the existing process.",
  "Shipped architectural reworks of critical subsystems in parallel with ongoing feature delivery, not instead of it.",
],
```

Replace the first `Penny Software` entry's (`Lead Engineer`) `bullets` array with:

```ts
bullets: [
  "Owned the Angular + NestJS + MongoDB architecture for a modular, multi-tenant procurement platform that scaled toward $1B+ in gross transaction value.",
  "Built RBAC and tenancy isolation as platform-wide standards rather than per-client features, holding critical query paths under 200ms as load grew.",
  "Mentored and directed a 12-person team spanning frontend, backend, and QA, introducing code review and clean-code standards that were adopted, not just proposed.",
],
```

Replace the second `Penny Software` entry's (`Product Specialist`) `bullets` array with:

```ts
bullets: [
  "Owned feature lifecycles end-to-end, staying hands-on across the API layer and frontend while translating procurement workflows into shipped outcomes.",
  "Optimized APIs and database queries across critical paths, improving response times by 40%+.",
  "Coordinated engineering, QA, and product rhythms into iterative agile delivery, accelerating release cycles by 1.5×.",
],
```

Leave the remaining entries (`Full Stack Developer`, `Manaraah`, `WeCP`, `Reubro International`) as-is — they have no new verified figures from the resume to add.

- [ ] **Step 3: Restructure skills into a flat list for the Experience page**

Replace the entire contents of `src/app/data/skills.ts` with:

```ts
export type SkillBadge = {
  name: string;
};

export type SkillGroup = {
  title: string;
  items: SkillBadge[];
};

export const SKILL_GROUPS: SkillGroup[] = [
  {
    title: "Frontend",
    items: [{ name: "Angular" }, { name: "React" }, { name: "Next.js" }],
  },
  {
    title: "Backend",
    items: [{ name: "Node.js" }, { name: "NestJS" }, { name: "Express" }],
  },
  {
    title: "Data",
    items: [{ name: "MongoDB" }, { name: "AWS DynamoDB" }],
  },
  {
    title: "Cloud & DevOps",
    items: [{ name: "AWS" }, { name: "GCP" }, { name: "Docker" }, { name: "GitHub Actions" }],
  },
  {
    title: "Languages",
    items: [
      { name: "TypeScript" },
      { name: "JavaScript" },
      { name: "Python" },
      { name: "HTML / CSS" },
    ],
  },
  {
    title: "AI & Tooling",
    items: [
      { name: "Claude Code" },
      { name: "Claude Cowork" },
      { name: "Claude Design" },
      { name: "OpenAI Codex" },
    ],
  },
];
```

(This drops the two-column `SKILL_COLUMNS` tuple type in favor of a single flat array the Experience page lays out itself, and updates the AI & Tooling group to match the resume's current list — Claude Code, Claude Cowork, Claude Design, OpenAI Codex — dropping GitHub Copilot, which the updated resume no longer lists.)

- [ ] **Step 4: Update the job title in `site.ts`**

In `src/app/data/site.ts`, the `SITE.description` currently reads "Seven years building systems at scale. $1B+ GTV. Calm architecture, precise execution." Leave `SITE` otherwise unchanged (email/phone/links are still correct) — this task doesn't touch it further; `layout.tsx` metadata gets its title/description update in Task 7, sourced from the resume's "AI-Augmented Senior Full-Stack Engineer" title.

- [ ] **Step 5: Verify**

Run `npx tsc --noEmit` — this will surface every current consumer of `SKILL_COLUMNS` (currently only `Capabilities.tsx`, which Task 15 deletes) as a type error; that's expected and gets resolved when Task 15 runs. For this task specifically, confirm the error is scoped to `Capabilities.tsx` only (`grep -rn "SKILL_COLUMNS" src/` should show just that one file) and that `src/app/data/*.ts` itself has no errors in isolation.

- [ ] **Step 6: Commit**

```bash
git add src/app/data/experience.ts src/app/data/skills.ts src/app/data/log.ts
git commit -m "content: sharpen Experience copy with verified figures, flatten skills, add log data"
```

---

## Task 4: DecisionRecord component (the signature element)

**Files:**
- Create: `src/components/DecisionRecord.tsx`

**Interfaces:**
- Consumes: `DecisionRecord` type from `src/app/data/projects.ts` (Task 2).
- Produces: `export default function DecisionRecord({ record }: { record: DecisionRecordType })` — a server component (no client interactivity needed; the reveal animation is pure CSS).

- [ ] **Step 1: Write the component**

```tsx
import type { DecisionRecord as DecisionRecordType } from "@/app/data/projects";

export type DecisionRecordProps = {
  record: DecisionRecordType;
};

export default function DecisionRecord({ record }: DecisionRecordProps) {
  return (
    <div className="decision-record rounded-2xl border border-line bg-paper-raised p-6 md:p-8">
      <p className="font-display text-[11px] uppercase tracking-[0.12em] text-ink-muted">
        Decision · {record.date}
      </p>
      <div className="mt-4 flex flex-col gap-1.5 font-display text-[14px] leading-relaxed">
        <p className="decision-line flex gap-3 text-diff-remove">
          <span aria-hidden className="shrink-0">−</span>
          <span>{record.before}</span>
        </p>
        <p className="decision-line flex gap-3 text-diff-add">
          <span aria-hidden className="shrink-0">+</span>
          <span>{record.after}</span>
        </p>
      </div>
      <p className="mt-5 font-body text-[15px] leading-relaxed text-ink-muted">
        <span className="font-ui text-[11px] font-semibold uppercase tracking-[0.1em] text-ink">
          Why
        </span>{" "}
        {record.why}
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Add the scroll-driven reveal in `globals.css`**

Append to `src/app/globals.css` (after the `.field-texture` block from Task 1):

```css
/* Decision Record: diff lines draw in on scroll into view. Progressive
   enhancement only — unsupported browsers just show the final state. */
@supports (animation-timeline: view()) {
  .decision-line {
    clip-path: inset(0 100% 0 0);
    animation: decision-draw-in linear both;
    animation-timeline: view();
    animation-range: entry 0% cover 30%;
  }
  .decision-line:nth-child(2) {
    animation-range: entry 10% cover 40%;
  }
}

@keyframes decision-draw-in {
  to {
    clip-path: inset(0 0 0 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .decision-line {
    animation: none !important;
    clip-path: none !important;
  }
}
```

This is deliberately `@supports`-gated: browsers without scroll-driven animation support (§4 of the spec calls this out) just render the final, fully-visible state with no JS dependency and no failure mode — unlike the old `whileInView` pattern, there is no "animation never fires" state, only "animation isn't available, content is static and correct."

- [ ] **Step 3: Verify**

Run `npx tsc --noEmit` and `npm run lint`. This component has no page to render in yet — full visual verification happens in Task 10 when it's wired into the project detail page. For now, confirm the file compiles standalone by checking the import resolves (`grep -n "DecisionRecord" src/app/data/projects.ts` shows the exported type).

- [ ] **Step 4: Commit**

```bash
git add src/components/DecisionRecord.tsx src/app/globals.css
git commit -m "feat: add DecisionRecord component, the site's signature diff-record device"
```

---

## Task 5: Navbar rewrite — real routes, no anchor-scroll model

**Files:**
- Modify: `src/components/Navbar.tsx` (full rewrite)

**Interfaces:**
- Consumes: `SITE` from `src/app/data/site.ts`.
- Produces: `export default function Navbar()` — unchanged export shape, so `layout.tsx`'s import doesn't need to change.

- [ ] **Step 1: Rewrite the component**

Replace the entire contents of `src/components/Navbar.tsx`:

```tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { SITE } from "@/app/data/site";

const NAV_LINKS = [
  { label: "Projects", href: "/projects" },
  { label: "Experience", href: "/experience" },
  { label: "Writing", href: "/writing" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  const closeMenu = () => {
    setMenuOpen(false);
    toggleRef.current?.focus();
  };

  return (
    <>
      <header
        suppressHydrationWarning
        className={`fixed inset-x-0 top-0 z-50 transition-[height,background-color,border-color] duration-300 ${
          scrolled ? "h-14" : "h-16"
        }`}
        style={{
          background: scrolled ? "color-mix(in srgb, var(--color-paper) 92%, transparent)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled ? "1px solid var(--color-line)" : "1px solid transparent",
        }}
      >
        <div className="mx-auto flex h-full max-w-5xl items-center justify-between px-6 md:px-16">
          <Link
            href="/"
            className="font-display text-[15px] font-semibold text-ink transition-colors duration-200 hover:text-accent"
            aria-label="Ashwin Sathian, home"
          >
            AS
          </Link>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className={`font-ui text-[14px] transition-colors duration-200 ${
                  isActive(href) ? "text-signal" : "text-ink-muted hover:text-ink"
                }`}
              >
                {label}
              </Link>
            ))}
            <a
              href={SITE.resumePath}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-line px-4 py-1.5 font-ui text-[13px] text-ink-muted transition-colors duration-200 hover:border-ink-muted hover:text-ink"
            >
              Résumé
            </a>
          </nav>

          <button
            ref={toggleRef}
            className="flex h-8 w-8 flex-col items-center justify-center gap-1.5 md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span className={`block h-px w-5 bg-ink transition-all duration-200 ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-px w-5 bg-ink transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-px w-5 bg-ink transition-all duration-200 ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 flex flex-col items-center justify-center gap-10 bg-paper transition-opacity duration-300 md:hidden ${
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {NAV_LINKS.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            onClick={closeMenu}
            className={`font-display text-[32px] font-semibold tracking-[-0.01em] transition-colors duration-200 hover:text-signal ${
              isActive(href) ? "text-signal" : "text-ink"
            }`}
          >
            {label}
          </Link>
        ))}
        <a
          href={SITE.resumePath}
          target="_blank"
          rel="noopener noreferrer"
          onClick={closeMenu}
          className="mt-4 font-ui text-[15px] text-ink-muted"
        >
          Résumé ↓
        </a>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Verify**

Run `npx tsc --noEmit` and `npm run lint`. Since `layout.tsx` hasn't been restructured yet (Task 7), the header will render but page content below it still uses old classes until later tasks land — that's expected. Confirm via Playwright that clicking each nav link (once routes exist — some, like `/experience` and `/about`, 404 until Tasks 9–12 land, which is fine at this point) navigates rather than scroll-jacking.

- [ ] **Step 3: Commit**

```bash
git add src/components/Navbar.tsx
git commit -m "feat: rebuild Navbar as real routed links, drop anchor-scroll model"
```

---

## Task 6: ContactBand + slim Footer

**Files:**
- Create: `src/components/ContactBand.tsx`
- Modify: `src/components/Footer.tsx` (full rewrite, becomes the slim copyright bar only)
- Delete: `src/components/Contact.tsx` (superseded by ContactBand; also deferred to Task 15's cleanup pass if not done here — do it here since this task owns the replacement)

**Interfaces:**
- Consumes: `SITE` from `src/app/data/site.ts`.
- Produces: `export default function ContactBand()`, rewritten `export default function Footer()`.

- [ ] **Step 1: Create `ContactBand.tsx`**

```tsx
import { SITE } from "@/app/data/site";

export default function ContactBand() {
  return (
    <section
      aria-labelledby="contact-heading"
      className="border-t border-line bg-paper-raised px-6 py-20 text-center md:px-16 md:py-28"
    >
      <h2
        id="contact-heading"
        className="font-display text-[clamp(36px,6vw,64px)] font-bold leading-none tracking-[-0.02em] text-signal"
      >
        Let&apos;s talk.
      </h2>
      <a
        href={`mailto:${SITE.email}`}
        className="mt-6 inline-block font-body text-[clamp(17px,2vw,22px)] text-ink transition-colors duration-200 hover:text-accent hover:underline underline-offset-4"
      >
        {SITE.email}
      </a>
      <p className="mt-4 font-ui text-[14px] text-ink-muted">
        Engineering, ideas, or interesting problems welcome.
      </p>
      <div className="mt-6 flex items-center justify-center gap-2 font-ui text-[13px] text-ink-muted">
        <a
          href={SITE.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors duration-200 hover:text-ink"
        >
          LinkedIn
        </a>
        <span>·</span>
        <a
          href={SITE.github}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors duration-200 hover:text-ink"
        >
          GitHub
        </a>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Rewrite `Footer.tsx` as the slim bar beneath the ContactBand**

```tsx
import { SITE } from "@/app/data/site";

export default function Footer() {
  return (
    <footer className="bg-paper px-6 py-6 md:px-8">
      <div className="mx-auto flex max-w-5xl items-center justify-between font-ui text-[13px] text-ink-muted">
        <span>© {new Date().getFullYear()} {SITE.name}</span>
        <a
          href={SITE.resumePath}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors duration-200 hover:text-ink"
        >
          Résumé ↓
        </a>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Delete the old `Contact.tsx`**

```bash
git rm src/components/Contact.tsx
```

- [ ] **Step 4: Verify**

Run `npx tsc --noEmit` — this will surface `src/app/page.tsx`'s existing `import Contact from "@/components/Contact"` as an error; that's expected and resolved in Task 8 when the home page is rewritten to use `ContactBand` instead. Run `npm run lint`.

- [ ] **Step 5: Commit**

```bash
git add src/components/ContactBand.tsx src/components/Footer.tsx
git commit -m "feat: replace one-time Contact section with persistent ContactBand + slim Footer"
```

---

## Task 7: Root layout rewrite — wire Navbar/ContactBand/Footer on every page, drop MotionProvider/ScrollProgress, update metadata

**Files:**
- Modify: `src/app/layout.tsx` (body structure + metadata)
- Delete: `src/components/MotionProvider.tsx`, `src/components/ScrollProgress.tsx`, `src/lib/motion.ts`

**Interfaces:**
- Consumes: `Navbar`, `ContactBand`, `Footer` (all now exist from Tasks 5–6).
- Produces: every page rendered inside `{children}` now automatically gets the ContactBand + Footer below it, since they move into the root layout rather than being section components individual pages opt into.

- [ ] **Step 1: Update the metadata block**

In `src/app/layout.tsx`, update `siteDescription` and the title/description fields to match the resume's current positioning:

```ts
const siteDescription =
  "AI-augmented senior full-stack engineer. Seven years building and scaling enterprise-grade SaaS platforms — $1B+ GTV, multi-tenant architecture, teams mentored. Eight independent products shipped outside of it, each with its decisions published, not hidden.";
```

Update every occurrence of `"Ashwin Sathian | Lead Engineer, AI-Augmented Full-Stack SaaS"` (in `metadata.title.default`, `metadata.openGraph.title`, `metadata.twitter.title`) to `"Ashwin Sathian | AI-Augmented Senior Full-Stack Engineer"` — this matches the resume's own current job-title line verbatim, replacing the old site's self-authored variant.

Update `viewport.themeColor` from `"#000000"` to `"#EEF0F1"` (the new light paper background — this is what browser chrome/status-bar tinting shows, so it must match the new palette, not the old forced-dark one).

In `personSchema`, update `jobTitle` from `"Lead Engineer"` to `"AI-Augmented Senior Full-Stack Engineer"` to match.

- [ ] **Step 2: Rewrite the `<body>` structure**

Replace:

```tsx
<body
  className="min-h-screen bg-canvas text-ink-1"
  style={{ fontFamily: "var(--font-sans)" }}
>
  <MotionProvider>
    <ScrollProgress />
    <Navbar />
    <main>{children}</main>
  </MotionProvider>
</body>
```

with:

```tsx
<body
  className="min-h-screen bg-paper text-ink"
  style={{ fontFamily: "var(--font-ui)" }}
>
  <Navbar />
  <main>{children}</main>
  <ContactBand />
  <Footer />
</body>
```

Remove the now-unused imports of `MotionProvider` and `ScrollProgress` from the top of the file, and add:

```tsx
import ContactBand from "@/components/ContactBand";
import Footer from "@/components/Footer";
```

Also update the `<noscript>` style override — it currently forces `.motion-safe-reveal` elements visible for no-JS users, a class this redesign no longer uses (Task 1 onward never emits `.motion-safe-reveal`). Remove that `<noscript>` block entirely; there's nothing left for it to patch since no content is JS-gated to begin with (spec §4 Motion — this was the exact adversarial finding from the review, now structurally impossible instead of patched).

- [ ] **Step 3: Delete the now-dead files**

```bash
git rm src/components/MotionProvider.tsx src/components/ScrollProgress.tsx src/lib/motion.ts
```

- [ ] **Step 4: Verify**

Run `npx tsc --noEmit`. This will surface every remaining component still importing `framer-motion` or `@/lib/motion` (`Hero.tsx`, `Projects.tsx`, `Capabilities.tsx`, `Experience.tsx`, `Platforms.tsx`, `PostList.tsx`) as errors — expected, resolved as each is rewritten in Tasks 8–13, 15. Confirm the error list is exactly those files (`grep -rln "framer-motion\|@/lib/motion" src/`) and nothing else. Run `npm run lint`.

Playwright: load `/` and confirm the ContactBand ("Let's talk.") now renders at the bottom of the page even though the page content above it is still mid-migration.

- [ ] **Step 5: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: wire ContactBand+Footer into root layout, drop MotionProvider/ScrollProgress, update metadata"
```

---

## Task 8: Home page rebuild — thesis hero + Recent log strip

**Files:**
- Modify: `src/app/page.tsx` (full rewrite)
- Modify: `src/components/Hero.tsx` (full rewrite — becomes the thesis statement, no scroll-exit animation, no `usePrefersReducedMotion`/framer-motion)
- Create: `src/components/RecentLog.tsx`
- Modify: `src/app/data/hero.ts` (copy update)

**Interfaces:**
- Consumes: `HERO` from `hero.ts`, `RECENT_LOG` from `log.ts` (Task 3). (The old `Hero` took a `projectCount` prop sourced from `getProjects()` — the rewritten version drops that prop entirely, so `page.tsx` no longer calls `getProjects()`.)
- Produces: `export default function Hero()` (no longer takes `projectCount` — the project count line is dropped per the leaner thesis approach below), `export default function RecentLog({ entries }: { entries: LogEntry[] })`.

- [ ] **Step 1: Update `hero.ts`**

```ts
export const HERO = {
  name: "Ashwin Sathian",
  title: "AI-augmented senior full-stack engineer.",
  eyebrow: "Lead Engineer · 7+ years",
  thesis:
    "Seven years leading SaaS platforms at scale. Eight independent products shipped outside of it — each with the decisions that didn't survive first contact with production, published, not hidden.",
} as const;
```

- [ ] **Step 2: Rewrite `Hero.tsx`**

```tsx
import { HERO } from "@/app/data/hero";

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-name"
      className="field-texture relative flex flex-col gap-6 px-6 pb-16 pt-32 md:px-16 md:pb-24 md:pt-40"
    >
      <p
        className="load-fade-up font-ui text-[11px] font-medium uppercase tracking-[0.12em] text-ink-muted"
        style={{ animationDelay: "0ms" }}
      >
        {HERO.eyebrow}
      </p>
      <h1
        id="hero-name"
        className="load-fade-up font-display text-[clamp(40px,7vw,76px)] font-bold leading-[0.98] tracking-[-0.02em] text-ink"
        style={{ animationDelay: "80ms" }}
      >
        {HERO.name}
      </h1>
      <p
        className="load-fade-up font-body text-[clamp(20px,2.6vw,28px)] text-ink-muted"
        style={{ animationDelay: "160ms" }}
      >
        {HERO.title}
      </p>
      <p
        className="load-fade-up max-w-2xl font-body text-[17px] leading-[1.7] text-ink"
        style={{ animationDelay: "240ms" }}
      >
        {HERO.thesis}
      </p>
    </section>
  );
}
```

Note: this drops the `projectCount` prop, the scroll-exit `framer-motion` transform, and the "Scroll" indicator entirely — there is no dead black void to signal past, and the page is no longer a single long scroll where a scroll-cue is load-bearing. The `load-fade-up` class (Task 1) plus a hand-set `animationDelay` per element is the home-load stagger the spec's Motion section (§4) calls for — pure CSS, no client component needed.

- [ ] **Step 3: Create `RecentLog.tsx`**

```tsx
import Link from "next/link";
import type { LogEntry } from "@/app/data/log";

export type RecentLogProps = {
  entries: LogEntry[];
};

export default function RecentLog({ entries }: RecentLogProps) {
  return (
    <section aria-labelledby="recent-heading" className="px-6 py-16 md:px-16 md:py-20">
      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        <p
          id="recent-heading"
          className="load-fade-up font-ui text-[11px] font-medium uppercase tracking-[0.12em] text-ink-muted"
          style={{ animationDelay: "320ms" }}
        >
          Recent
        </p>
        <ol className="flex flex-col">
          {entries.map((entry, i) => (
            <li
              key={entry.href}
              className="load-fade-up border-t border-line py-6 first:border-t-0 first:pt-0"
              style={{ animationDelay: `${400 + i * 90}ms` }}
            >
              <Link
                href={entry.href}
                className="group flex flex-col gap-1.5 focus-visible:outline-none md:flex-row md:items-baseline md:gap-6"
              >
                <span className="shrink-0 font-display text-[13px] text-signal md:w-28">
                  {entry.date}
                </span>
                <span className="font-body text-[16px] leading-relaxed text-ink transition-colors duration-200 group-hover:text-accent">
                  {entry.text}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
```

Note the log-entry dates use `text-signal` — the copper accent's "key numerals/dates" role from spec §4's color table, applied here and in the Experience page (Task 11).

- [ ] **Step 4: Rewrite `src/app/page.tsx`**

```tsx
import Link from "next/link";
import Hero from "@/components/Hero";
import RecentLog from "@/components/RecentLog";
import { RECENT_LOG } from "@/app/data/log";
import { SITE } from "@/app/data/site";

export const revalidate = 3600;

const PATHS = [
  { label: "Projects", href: "/projects", description: "Eight products, designed and run end to end." },
  { label: "Experience", href: "/experience", description: "The professional record, with the numbers behind it." },
  { label: "Writing", href: "/writing", description: "Notes on engineering, architecture, and shipping." },
  { label: "About", href: "/about", description: "Who this is, and why the side projects exist." },
];

export default function Page() {
  const profilePageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${SITE.website}/#profilepage`,
    url: SITE.website,
    name: `${SITE.name}, Engineer`,
    mainEntity: { "@id": `${SITE.website}/#person` },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }}
      />
      <Hero />
      <RecentLog entries={RECENT_LOG} />
      <section aria-label="Site sections" className="border-t border-line px-6 py-16 md:px-16 md:py-20">
        <div className="mx-auto grid max-w-3xl gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
          {PATHS.map((path) => (
            <Link
              key={path.href}
              href={path.href}
              className="group flex flex-col gap-2 bg-paper p-8 transition-colors duration-200 hover:bg-paper-raised"
            >
              <span className="font-display text-[20px] font-semibold text-ink transition-colors duration-200 group-hover:text-signal">
                {path.label}
              </span>
              <span className="font-body text-[14px] leading-relaxed text-ink-muted">
                {path.description}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
```

Note this drops the `getProjects()` call and `projectCount` entirely (Hero no longer needs it) — `revalidate = 3600` stays since the page is still statically-revalidated, matching the rest of the site.

- [ ] **Step 5: Verify**

Run `npx tsc --noEmit` and `npm run lint`. Playwright: screenshot `/` at 1440×900 and 390×844. Confirm: the hero shows the name and thesis immediately (no empty viewport before scrolling), the Recent strip shows 3 dated entries in copper `signal` with links that work, and the 4-tile path grid renders as a 2×2 grid on desktop / stacked on mobile. Confirm the dot-grid texture is faintly visible behind the hero and does not reduce text legibility. Since the stagger only plays once on load, a single screenshot won't show it moving — instead confirm by reading the rendered DOM (`grep`-equivalent: check the page's computed styles via Playwright) that each staggered element carries a distinct `animationDelay` inline style, and manually watch one real page load in the browser to confirm the sequence is visible and not jarring.

- [ ] **Step 6: Commit**

```bash
git add src/app/page.tsx src/components/Hero.tsx src/components/RecentLog.tsx src/app/data/hero.ts
git commit -m "feat: rebuild home page — thesis hero, Recent log strip, section paths"
```

---

## Task 9: Projects index page

**Files:**
- Create: `src/app/projects/page.tsx`
- Modify: `src/components/Projects.tsx` (full rewrite — becomes the index-page list, no framer-motion)

**Interfaces:**
- Consumes: `getProjects()` (unchanged), `ALSO_SHIPPED` (Task 2), `ProjectMedia` component (unchanged), retires `VerifiedTag` usage (component itself deleted in Task 15).
- Produces: `export default function Projects({ projects }: { projects: ProjectWithStats[] })`.

- [ ] **Step 1: Rewrite `Projects.tsx`**

```tsx
import Link from "next/link";
import type { ProjectWithStats } from "@/app/(helpers)/projects";
import ProjectMedia from "@/components/ProjectMedia";

export type ProjectsProps = {
  projects: ProjectWithStats[];
};

export default function Projects({ projects }: ProjectsProps) {
  return (
    <div className="mx-auto max-w-5xl px-6 py-24 pt-32 md:px-16 md:py-32 md:pt-40">
      <p className="font-ui text-[11px] font-medium uppercase tracking-[0.12em] text-ink-muted">
        Projects
      </p>
      <h1 className="mt-4 font-display text-[clamp(32px,5vw,52px)] font-bold leading-[1.02] tracking-[-0.02em] text-ink">
        Eight products, designed and run end to end.
      </h1>
      <p className="mt-4 max-w-xl font-body text-[16px] leading-[1.7] text-ink-muted">
        Most of what I ship at work isn&apos;t mine to show. Everything here is —
        built, run, and where the record calls for it, corrected in public.
      </p>

      <div className="mt-16 flex flex-col">
        {projects.map((project, i) => (
          <div key={project.slug} className="border-t border-line py-12 first:border-t-0 first:pt-0 md:py-14">
            <div className="grid gap-8 md:grid-cols-[minmax(0,340px)_1fr] md:gap-12">
              <div className="flex flex-col gap-3">
                <ProjectMedia media={project.media} />
                <div className="flex items-center gap-3 font-display text-[12px] uppercase tracking-wider text-ink-muted">
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <span>{project.category}</span>
                  {(project.language || typeof project.stars === "number") && (
                    <span className="ml-auto normal-case tracking-normal">
                      {project.language}
                      {typeof project.stars === "number" && project.stars > 0 && ` · ★ ${project.stars}`}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <Link href={`/projects/${project.slug}`} className="group inline-flex items-baseline gap-3 focus-visible:outline-none">
                  <h2 className="font-display text-[clamp(24px,3.2vw,36px)] font-bold leading-[1.1] tracking-[-0.01em] text-ink transition-colors duration-200 group-hover:text-signal">
                    {project.name}
                  </h2>
                  <span className="text-signal opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100">
                    →
                  </span>
                </Link>

                <p className="max-w-xl font-body text-[16px] leading-[1.7] text-ink-muted">
                  {project.tagline}
                </p>

                {project.highlights[0] && (
                  <p className="max-w-xl font-body text-[14px] leading-[1.6] text-ink-muted">
                    <span className="text-ink">{project.highlights[0].title}.</span>{" "}
                    {project.highlights[0].detail}
                  </p>
                )}

                <div className="flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <span key={tech} className="rounded-full bg-paper-raised px-3 py-1 font-ui text-[12px] font-medium text-ink-muted">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-5 pt-1 font-ui text-[14px]">
                  <Link href={`/projects/${project.slug}`} className="text-ink transition-colors duration-200 hover:text-accent">
                    Case study →
                  </Link>
                  {project.links.live && (
                    <a href={project.links.live} target="_blank" rel="noopener noreferrer" className="text-ink-muted transition-colors duration-200 hover:text-ink">
                      Live ↗
                    </a>
                  )}
                  {project.links.github && (
                    <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="text-ink-muted transition-colors duration-200 hover:text-ink">
                      GitHub ↗
                    </a>
                  )}
                  {project.links.npm && (
                    <a href={project.links.npm} target="_blank" rel="noopener noreferrer" className="text-ink-muted transition-colors duration-200 hover:text-ink">
                      npm ↗
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `src/app/projects/page.tsx`**

```tsx
import type { Metadata } from "next";
import Projects from "@/components/Projects";
import { getProjects } from "@/app/(helpers)/projects";
import { ALSO_SHIPPED } from "@/app/data/projects";
import { SITE } from "@/app/data/site";

const description =
  "Eight independent products, designed and run end to end, outside of a full-time lead role.";

export const metadata: Metadata = {
  title: "Projects",
  description,
  alternates: { canonical: `${SITE.website}/projects` },
  openGraph: {
    title: "Projects | Ashwin Sathian",
    description,
    url: `${SITE.website}/projects`,
    type: "website",
    images: [{ url: "/og?label=Projects", width: 1200, height: 630, alt: "Projects | Ashwin Sathian" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects | Ashwin Sathian",
    description,
    creator: "@ashwinsathian",
    images: ["/og?label=Projects"],
  },
};

export const revalidate = 3600;

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <Projects projects={projects} />
      <section aria-labelledby="also-shipped-heading" className="mx-auto max-w-5xl px-6 pb-24 md:px-16 md:pb-32">
        <p id="also-shipped-heading" className="font-ui text-[11px] font-medium uppercase tracking-[0.12em] text-ink-muted">
          Also shipped
        </p>
        <ul className="mt-6 flex flex-col">
          {ALSO_SHIPPED.map((item) => (
            <li key={item.href} className="border-t border-line py-5 first:border-t-0 first:pt-0">
              <a href={item.href} target="_blank" rel="noopener noreferrer" className="group flex flex-col gap-1 md:flex-row md:items-baseline md:gap-6">
                <span className="font-display text-[15px] font-semibold text-ink transition-colors duration-200 group-hover:text-accent">
                  {item.name} ↗
                </span>
                <span className="font-body text-[14px] leading-relaxed text-ink-muted">
                  {item.description}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
```

- [ ] **Step 3: Verify**

Run `npx tsc --noEmit` and `npm run lint`. Playwright: navigate to `/projects`, screenshot at 1440×900. Confirm all 8 projects render (Booklet, BRNR, Wayfarer, ngx-runtime-i18n, Typester, Darkframe, better-auth-mongoose, humanize-writing-skill) plus the "Also shipped" line for github-issue-analyzer. Existing project screenshots (Booklet/BRNR/Wayfarer/Typester at `/projects/<slug>/hero.png`) will 404 for the 3 new projects since no image exists yet at `/projects/darkframe/hero.png` etc — `next/image` renders a broken-image state for those three; this is expected and resolved by a follow-up screenshot-capture pass outside this plan's scope (flag it in the final QA task, Task 17, rather than block here).

- [ ] **Step 4: Commit**

```bash
git add src/app/projects/page.tsx src/components/Projects.tsx
git commit -m "feat: add /projects index page with the full 8-project lineup + Also shipped list"
```

---

## Task 10: Project case study page — wire in DecisionRecord, fix nav references

**Files:**
- Modify: `src/app/projects/[slug]/page.tsx` (full rewrite)
- Modify: `src/components/BackToProjectsButton.tsx` (fix `/#projects` → `/projects`)
- Modify: `src/app/projects/[slug]/not-found.tsx` (fix `/#projects` → `/projects`, restyle)
- Modify: `src/app/projects/[slug]/loading.tsx` (restyle only — swap `bg-surface-2`/`border-white/6` for `bg-paper-raised`/`border-line`)

**Interfaces:**
- Consumes: `DecisionRecord` component (Task 4), `getProject` (unchanged).

- [ ] **Step 1: Fix `BackToProjectsButton.tsx`**

Change `router.push("/#projects")` to `router.push("/projects")`.

- [ ] **Step 2: Fix and restyle `not-found.tsx`**

```tsx
import Link from "next/link";

export default function ProjectNotFound() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-24 pt-32 md:px-8 md:py-32 md:pt-40">
      <div className="rounded-2xl border border-line bg-paper-raised p-8">
        <p className="font-body text-[17px] font-medium text-ink">Project not found.</p>
        <p className="mt-2 font-body text-[15px] text-ink-muted">
          It may have moved. Go back to{" "}
          <Link href="/projects" className="text-accent hover:underline">
            Projects
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Restyle `loading.tsx`**

Replace every `bg-surface-2` with `bg-paper-raised` and every `border-white/6` with `border-line` in the existing skeleton markup (structure unchanged, only the two class values swap).

- [ ] **Step 4: Rewrite `src/app/projects/[slug]/page.tsx`**

Keep the existing `generateStaticParams`, `generateMetadata`, and JSON-LD schema logic unchanged (they're structurally sound and don't reference removed tokens). Rewrite only the returned JSX body, replacing every old color class (`text-ink-1` → `text-ink`, `text-ink-2`/`text-ink-3` → `text-ink-muted`, `bg-surface-2` → `bg-paper-raised`, `border-white/*` → `border-line`, `text-signal` stays `text-signal`) and removing all `VerifiedTag` usage. Add the Decision Record render conditionally after the Highlights grid:

```tsx
{/* Decision Record — only for projects with a real, disclosed reversal */}
{project.decisionRecord && (
  <div className="mb-20">
    <p className="mb-6 font-ui text-xs font-medium uppercase tracking-[0.08em] text-ink-muted">
      Decision record
    </p>
    <DecisionRecord record={project.decisionRecord} />
  </div>
)}
```

placed between the existing "Highlights" block and the "Next project" block. Add `import DecisionRecord from "@/components/DecisionRecord";` at the top. Remove the `import VerifiedTag from "@/components/VerifiedTag";` line and the two `<VerifiedTag ... />` usages (one in the quick-facts grid, one — there is only one in this file, in the facts card loop; confirm by re-reading the file before editing, since the fact-card `<VerifiedTag size="xs" className="mt-2" />` line is removed entirely, not replaced, since facts now stand on their own per spec §5).

Also update the breadcrumb: change `href: "${SITE.website}/#projects"` in `breadcrumbSchema` to `"${SITE.website}/projects"`, and the visible breadcrumb `<BackToProjectsButton />` stays (now pointing at the fixed `/projects` route from Step 1).

- [ ] **Step 5: Verify**

Run `npx tsc --noEmit` and `npm run lint`. Playwright: visit `/projects/booklet` and `/projects/darkframe` (both have decision records) plus `/projects/brnr` (no decision record). Screenshot each. Confirm: Booklet and Darkframe show the diff-formatted Decision Record block with real before/after/why text and correct diff-red/diff-green coloring; BRNR shows no Decision Record section at all (not an empty one). Confirm breadcrumb navigation and the "Next project" link both work.

- [ ] **Step 6: Commit**

```bash
git add src/app/projects/[slug]/page.tsx src/app/projects/[slug]/not-found.tsx src/app/projects/[slug]/loading.tsx src/components/BackToProjectsButton.tsx
git commit -m "feat: rebuild project case study page — new tokens, Decision Record, fixed nav links"
```

---

## Task 11: Experience page

**Files:**
- Create: `src/app/experience/page.tsx`
- Delete: `src/components/Experience.tsx`, `src/components/Platforms.tsx` (both folded into the new page per plan intro — Platforms' "five years shaping how enterprise teams buy" content becomes the page's lead-in paragraph, Skills becomes a compact stack list at the top)

**Interfaces:**
- Consumes: `RECENT_EXPERIENCE`, `EDUCATION`, `PLATFORM`, `SKILL_GROUPS` (all existing/Task 3 data, unchanged shape except `SKILL_GROUPS`).

- [ ] **Step 1: Write `src/app/experience/page.tsx`**

```tsx
import type { Metadata } from "next";
import { RECENT_EXPERIENCE } from "@/app/data/experience";
import { EDUCATION } from "@/app/data/education";
import { PLATFORM } from "@/app/data/work";
import { SKILL_GROUPS } from "@/app/data/skills";
import { SITE } from "@/app/data/site";

const description =
  "Seven years leading and building SaaS platforms at scale — the record behind the resume, with the numbers that back it up.";

export const metadata: Metadata = {
  title: "Experience",
  description,
  alternates: { canonical: `${SITE.website}/experience` },
  openGraph: {
    title: "Experience | Ashwin Sathian",
    description,
    url: `${SITE.website}/experience`,
    type: "website",
    images: [{ url: "/og?label=Experience", width: 1200, height: 630, alt: "Experience | Ashwin Sathian" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Experience | Ashwin Sathian",
    description,
    creator: "@ashwinsathian",
    images: ["/og?label=Experience"],
  },
};

export default function ExperiencePage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-24 pt-32 md:px-16 md:py-32 md:pt-40">
      <p className="font-ui text-[11px] font-medium uppercase tracking-[0.12em] text-ink-muted">
        Experience
      </p>
      <h1 className="mt-4 font-display text-[clamp(32px,5vw,52px)] font-bold leading-[1.02] tracking-[-0.02em] text-ink">
        {PLATFORM.title}
      </h1>
      <p className="mt-4 max-w-2xl font-body text-[16px] leading-[1.7] text-ink-muted">
        {PLATFORM.description}
      </p>

      {/* Stack — compact, functional, not a filler badge wall */}
      <div className="mt-14 grid gap-x-12 gap-y-8 border-t border-line pt-10 sm:grid-cols-3">
        {SKILL_GROUPS.map((group) => (
          <div key={group.title} className="flex flex-col gap-3">
            <h2 className="font-ui text-[12px] uppercase tracking-[0.06em] text-ink-muted">
              {group.title}
            </h2>
            <p className="font-body text-[14px] leading-relaxed text-ink">
              {group.items.map((item) => item.name).join(", ")}
            </p>
          </div>
        ))}
      </div>

      {/* Roles */}
      <div className="mt-16 flex flex-col">
        {RECENT_EXPERIENCE.map((item) => (
          <div key={`${item.company}-${item.role}`} className="grid gap-6 border-t border-line py-10 first:border-t-0 first:pt-0 md:grid-cols-[200px_1fr]">
            <div className="flex flex-col gap-1">
              <p className="font-display text-[13px] text-signal">{item.dates}</p>
              <p className="font-body text-[15px] font-medium text-ink">{item.company}</p>
            </div>
            <div className="flex flex-col gap-5">
              <p className="font-display text-[17px] font-semibold tracking-[-0.01em] text-ink">
                {item.role}
              </p>
              <ul className="flex flex-col gap-3">
                {item.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-4 font-body text-[15px] leading-[1.65] text-ink-muted">
                    <span className="mt-2.5 h-px w-4 shrink-0 bg-ink-muted" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
              {item.tech && item.tech.length > 0 && (
                <p className="font-display text-[12px] text-ink-muted">{item.tech.join(" · ")}</p>
              )}
            </div>
          </div>
        ))}

        {EDUCATION.map((item) => (
          <div key={item.school} className="grid gap-6 border-t border-line py-10 md:grid-cols-[200px_1fr]">
            <div className="flex flex-col gap-1">
              <p className="font-display text-[13px] text-signal">{item.period}</p>
              <p className="font-body text-[15px] font-medium text-ink">Education</p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-display text-[17px] font-semibold tracking-[-0.01em] text-ink">
                {item.school}
              </p>
              <p className="font-body text-[15px] leading-[1.65] text-ink-muted">{item.credential}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Delete the superseded components**

```bash
git rm src/components/Experience.tsx src/components/Platforms.tsx
```

- [ ] **Step 3: Verify**

Run `npx tsc --noEmit` and `npm run lint` — this may surface `src/app/page.tsx`'s old `import Experience from "@/components/Experience"` if any reference remains from before Task 8's rewrite; there shouldn't be one since Task 8 already replaced `page.tsx` entirely, but double check with `grep -rn "components/Experience\"\|components/Platforms\"" src/`. Playwright: visit `/experience`, screenshot at 1440×900 and 390×844. Confirm the sub-200ms/12-engineer/40%/1.5× figures render in the HighLevel and Penny Software bullets, the Stack section shows all 6 groups including the updated AI & Tooling list, and Education renders below the role list.

- [ ] **Step 4: Commit**

```bash
git add src/app/experience/page.tsx
git commit -m "feat: add /experience page, folding Platforms + Skills into one page"
```

---

## Task 12: About page

**Files:**
- Create: `src/app/about/page.tsx`

**Interfaces:**
- Consumes: nothing beyond `SITE` (static prose content, per spec text-only).

- [ ] **Step 1: Write `src/app/about/page.tsx`**

```tsx
import type { Metadata } from "next";
import { SITE } from "@/app/data/site";

const description =
  "Who this is, and why an engineering leader with a full-time lead role also ships independent products in his own time.";

export const metadata: Metadata = {
  title: "About",
  description,
  alternates: { canonical: `${SITE.website}/about` },
  openGraph: {
    title: "About | Ashwin Sathian",
    description,
    url: `${SITE.website}/about`,
    type: "website",
    images: [{ url: "/og?label=About", width: 1200, height: 630, alt: "About | Ashwin Sathian" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About | Ashwin Sathian",
    description,
    creator: "@ashwinsathian",
    images: ["/og?label=About"],
  },
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24 pt-32 md:px-8 md:py-32 md:pt-40">
      <p className="font-ui text-[11px] font-medium uppercase tracking-[0.12em] text-ink-muted">
        About
      </p>
      <h1 className="mt-4 font-display text-[clamp(32px,5vw,52px)] font-bold leading-[1.02] tracking-[-0.02em] text-ink">
        Ashwin Sathian
      </h1>

      <div className="mt-10 flex flex-col gap-6 font-body text-[17px] leading-[1.8] text-ink">
        <p>
          Ashwin Sathian is an engineering leader with seven years building and scaling
          enterprise-grade SaaS platforms — systems that carry thousands of users, millions of
          records, and, in procurement alone, more than a billion dollars in transaction value.
          The résumé version of that sentence stops there. This page doesn&apos;t.
        </p>
        <p>
          At Penny Software, &ldquo;architecting multi-tenant, high-performance systems&rdquo;
          meant the actual Angular, NestJS, and MongoDB stack behind a B2B procurement platform:
          RBAC and tenancy isolation built as platform-wide standards rather than features bolted
          on per client, and query paths held under 200ms as the platform scaled toward $1B+ in
          gross transaction value. None of that is abstract — it&apos;s the architecture a
          five-year tenure was spent building, then defending as load grew.
        </p>
        <p>
          &ldquo;Accelerating release cycles&rdquo; was concrete too: a 1.5× faster release
          cadence came from reworking how engineering, QA, and product actually coordinated, and
          a 40%+ improvement in API and query response times came from treating performance as a
          standing responsibility, not a quarterly fire drill. &ldquo;Shaping engineering
          culture&rdquo; meant mentoring and directing a twelve-person team — introducing code
          review and clean-code standards that got adopted, not just proposed.
        </p>
        <p>
          Most recently, at HighLevel, he led engineering for Funnels, Websites, and Webinars —
          three revenue surfaces inside a platform serving tens of thousands of marketing
          agencies — while driving an AI-augmented Full Stack Builder effort: putting AI tooling
          to work across planning, prototyping, building, QA, and shipping, as a real change to
          how the SDLC runs rather than a novelty layer on top of the existing process.
        </p>
        <p>
          None of that explains why an engineering leader with a full-time lead role also ships
          independent products in his own time — eight of them, at last count, each documented on
          this site to the same standard as the professional work: real facts, checkable against
          the source. What connects the two is a specific kind of discipline. Booklet shipped on
          Cloudflare Workers, then moved to a self-hosted process once production revealed the
          tradeoffs. Darkframe shipped as &ldquo;Umbra,&rdquo; then was renamed after a
          shipping-readiness review turned up a naming collision — alongside a security
          vulnerability that got fixed and disclosed in the same changelog entry. The instinct to
          look at a decision honestly, including the one that turned out wrong, and change it in
          the open rather than quietly, isn&apos;t a side-project hobby distinct from the day job.
          It&apos;s the same engineer.
        </p>
        <p>
          Ashwin studied Electronics &amp; Communication Engineering at the National Institute of
          Technology Calicut (2014–2018) — the one credential behind all of this. He&apos;s based
          in Kochi, Kerala, India.
        </p>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Verify**

Run `npx tsc --noEmit` and `npm run lint`. Playwright: visit `/about`, screenshot at 1440×900 and 390×844. Confirm the serif body face renders for the prose paragraphs and the mono display face renders for the "Ashwin Sathian" H1, matching the type-role assignment from Task 1.

- [ ] **Step 3: Commit**

```bash
git add src/app/about/page.tsx
git commit -m "feat: add /about page, expanding the resume's Professional Summary into a real narrative"
```

---

## Task 13: Writing pages restyle — drop framer-motion, new empty state, new tokens

**Files:**
- Modify: `src/components/writing/PostList.tsx` (drop framer-motion, new tokens)
- Modify: `src/app/writing/page.tsx` (new tokens, new empty-state copy/visual per spec §5)
- Modify: `src/app/writing/[slug]/page.tsx` (new tokens only — structure unchanged)
- Modify: `src/app/globals.css` (`.prose` block restyle for the new palette/fonts)

**Interfaces:**
- No interface changes — `PostMeta`/`Post` types from `src/lib/writing.ts` are untouched.

- [ ] **Step 1: Rewrite `PostList.tsx` without framer-motion**

Replace the `motion.ol`/`motion.li` wrapper with plain `<ol>`/`<li>`, remove the `framer-motion` and `@/lib/motion` imports, and swap every old color class (`text-ink-4` → `text-ink-muted`, `text-ink-1` → `text-ink`, `text-ink-3` → `text-ink-muted`, `text-signal` stays, `border-white/6` → `border-line`, `focus-visible:ring-accent` stays) — same structure, static instead of animated:

```tsx
import Link from "next/link";
import type { PostMeta } from "@/lib/writing";

type Props = {
  posts: PostMeta[];
};

export default function PostList({ posts }: Props) {
  if (posts.length === 0) return null;

  return (
    <ol className="mt-16 list-none" aria-label="Posts">
      {posts.map((post) => (
        <li key={post.slug}>
          <Link
            href={`/writing/${post.slug}`}
            className="group block border-t border-line py-8 last:border-b last:border-line focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between md:gap-8">
              <div className="flex flex-col gap-1.5">
                <span className="font-ui text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted">
                  {post.formattedDate}
                  {post.draft && (
                    <span className="ml-3 rounded-full border border-line px-2 py-0.5 text-[10px] normal-case tracking-normal text-ink-muted">
                      Draft
                    </span>
                  )}
                </span>
                <h2 className="font-display text-[17px] font-semibold leading-snug tracking-[-0.01em] text-ink transition-colors duration-200 group-hover:text-signal">
                  {post.title}
                </h2>
                <p className="font-body text-[15px] leading-[1.6] text-ink-muted">
                  {post.description}
                </p>
              </div>
              <div className="shrink-0 font-ui text-[13px] text-ink-muted md:text-right">
                {post.readingTime} min
              </div>
            </div>
            {post.tags && post.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-line px-3 py-0.5 font-ui text-[11px] text-ink-muted">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </Link>
        </li>
      ))}
    </ol>
  );
}
```

- [ ] **Step 2: Rewrite `src/app/writing/page.tsx`**

Update the metadata's `writingDescription` and `openGraph`/`twitter` image URLs to drop the site-wide `/og` default in favor of `/og?label=Writing` (matching the pattern the other new pages use). Rewrite the JSX body:

```tsx
export default function WritingPage() {
  const posts = getAllPosts();

  return (
    <main className="min-h-svh px-6 pb-24 pt-32 md:px-16 md:pt-40">
      <div className="mx-auto max-w-3xl">
        <p className="font-ui text-[11px] font-medium uppercase tracking-widest text-ink-muted">
          Writing
        </p>
        <h1 className="mt-4 font-display text-[clamp(36px,6vw,60px)] font-bold text-ink leading-none tracking-[-0.02em]">
          Writing.
        </h1>

        {posts.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-line bg-paper-raised p-8">
            <p className="font-display text-[13px] uppercase tracking-[0.1em] text-ink-muted">
              [Unreleased]
            </p>
            <p className="mt-3 max-w-lg font-body text-[16px] leading-[1.7] text-ink">
              Nothing published yet. Real entries land here the same way the rest of this site
              works — dated, and only once there&apos;s something worth logging.
            </p>
          </div>
        ) : (
          <p className="mt-6 max-w-lg font-body text-[16px] leading-[1.7] text-ink-muted">
            Notes on engineering, architecture, and building things that last.
          </p>
        )}

        <PostList posts={posts} />
      </div>
    </main>
  );
}
```

(Keep the existing `import { getAllPosts } from "@/lib/writing"; import PostList from "@/components/writing/PostList"; import type { Metadata } from "next";` imports and the `metadata` export from the current file, only updating the description/OG-image details noted above.)

- [ ] **Step 3: Restyle `src/app/writing/[slug]/page.tsx`**

Swap every old color class in the JSX body: `bg-canvas` → remove (body background now comes from the root layout's `bg-paper`, no need to redeclare per-page), `text-ink-4` → `text-ink-muted`, `text-ink-1` → `text-ink`, `text-ink-2`/`text-ink-3` → `text-ink-muted`, `border-white/8` → `border-line`, `border-white/6` → `border-line`, `border-white/15` → `border-line`. Update the `<h1>` and the "← Writing" / "Writing" breadcrumb link's font to `font-display` for the H1 and `font-ui` for the breadcrumb/meta line, matching the type-role assignment used on every other new page. Leave `PostBody`, all data-fetching, and the JSON-LD schema untouched.

- [ ] **Step 4: Restyle the `.prose` block in `globals.css`**

In the `.prose` block (kept as-is from Task 1), swap `var(--color-ink-2)` → `var(--color-ink-muted)`, `var(--color-ink-1)` → `var(--color-ink)`, `var(--color-surface-2)` → `var(--color-paper-raised)`, and every `rgba(255, 255, 255, 0.0X)` border value → `var(--color-line)`. Also change `.prose h1–h4`'s `font-weight` values from the old thin-weight IBM Plex scale (200/300/400/500) to JetBrains Mono-appropriate weights (600/600/500/500 — mono at very light weights is hard to read, so this isn't a cosmetic no-op) and confirm `.prose` itself doesn't set a `font-family` (it should inherit `font-body`/Source Serif 4 from a `font-body` class added to the `.prose` container's usage in `PostBody.tsx` — add `className="prose font-body"` to the `<div>` in `PostBody.tsx`, and add `font-family: var(--font-display)` explicitly on the `.prose h1, .prose h2, .prose h3, .prose h4` rule so headings inside post bodies use the mono display face while paragraph text uses the inherited serif).

- [ ] **Step 5: Verify**

Run `npx tsc --noEmit` and `npm run lint`. Playwright: visit `/writing` (confirm the `[Unreleased]` empty state renders, styled, not an apology), and if any file exists under `src/content/writing/` confirm a real post also still renders correctly through `/writing/[slug]` — if none exists (expected, per `.gitkeep`), skip that check; Task 17's final QA still confirms the route itself builds via `generateStaticParams` returning an empty array without erroring.

- [ ] **Step 6: Commit**

```bash
git add src/components/writing/PostList.tsx src/app/writing/page.tsx src/app/writing/[slug]/page.tsx src/components/writing/PostBody.tsx src/app/globals.css
git commit -m "design: restyle Writing pages to new tokens, drop framer-motion, real empty state"
```

---

## Task 14: OG image route — new palette and fonts

**Files:**
- Modify: `src/app/og/route.tsx`

**Interfaces:**
- No signature change — same `GET(request: NextRequest)`, same `title`/`description`/`label` query params.

- [ ] **Step 1: Update the color constants**

Replace the top-of-file constants:

```ts
const CANVAS = "#EEF0F1";
const LABEL_1 = "#14181C";
const LABEL_3 = "#5B6570";
const LABEL_4 = "#889098";
const ACCENT = "#C8712E";
```

(`LABEL_4` is a lighter tint of `ink-muted` rather than the exact token, since this is a raster image with no CSS custom properties available — `#889098` sits between `ink-muted` and `line` for a readable-but-quiet label tone against the light `CANVAS`.)

- [ ] **Step 2: Update the accent bar + fontFamily**

Both `<div>` blocks currently set `fontFamily: "Inter, -apple-system, sans-serif"` — since `next/og`'s `ImageResponse` can't load `next/font` variables directly, keep a system-font fallback stack but swap it for a monospace-leaning stack to visually rhyme with the new JetBrains-Mono-driven site: `fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace"`. Update both occurrences.

The small accent-bar `<div style={{ width: 20, height: 2, backgroundColor: ACCENT }} />` and the "Engineer" label and "Ashwin Sathian." / site-card fontWeight values can stay structurally the same — only the color constants and font stack change, since the layout itself (top label, big title, bottom byline) is still an accurate template for either card type.

Update the default site-card's tagline line from `"Seven years. $1B+ GTV. Calm architecture."` to `"AI-augmented senior full-stack engineer. $1B+ GTV. Decisions published, not hidden."` — matching the new positioning from Task 7's metadata update.

- [ ] **Step 3: Verify**

Run `npx tsc --noEmit` and `npm run lint`. Fetch `http://localhost:PORT/og` and `http://localhost:PORT/og?title=Booklet&description=Test&label=Projects` directly (e.g. via `curl -o /tmp/og1.png` then Read the PNG) and visually confirm both render on a light paper background with dark ink text and the copper accent bar, not the old black-canvas version.

- [ ] **Step 4: Commit**

```bash
git add src/app/og/route.tsx
git commit -m "design: restyle OG image route to paper/ink palette"
```

---

## Task 15: Cleanup — delete retired components, drop framer-motion dependency

**Files:**
- Delete: `src/components/VerifiedTag.tsx`, `src/components/Capabilities.tsx`
- Modify: `package.json` (remove `framer-motion` dependency), `package-lock.json` (regenerated by `npm install`)

**Interfaces:** None — this is pure removal of now-dead code confirmed unused by every prior task.

- [ ] **Step 1: Confirm nothing still imports the files to be deleted**

```bash
grep -rn "components/VerifiedTag\|components/Capabilities\|framer-motion" src/
```

Expected: no results (every consumer was rewritten in Tasks 6–13). If any result appears, stop and fix that file first — it means an earlier task's rewrite missed a reference.

- [ ] **Step 2: Delete the dead component files**

```bash
git rm src/components/VerifiedTag.tsx src/components/Capabilities.tsx
```

- [ ] **Step 3: Remove the `framer-motion` dependency**

```bash
npm uninstall framer-motion
```

This updates both `package.json` and `package-lock.json`.

- [ ] **Step 4: Verify**

Run `npx tsc --noEmit`, `npm run lint`, and `npm run build` — a full production build must succeed with zero references to the removed package or components. Run `grep -rn "framer-motion" package.json` to confirm it's gone from dependencies.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: remove framer-motion dependency and retired VerifiedTag/Capabilities components"
```

---

## Task 16: SEO/meta finalization — sitemap, llms.txt

**Files:**
- Modify: `src/app/sitemap.ts`
- Modify: `public/llms.txt`

**Interfaces:** None — data-only changes.

- [ ] **Step 1: Add the new routes to `sitemap.ts`**

In the returned array, add three new entries (alongside the existing `/`, `/writing`, project, and post entries) for the new top-level pages:

```ts
{
  url: `${baseUrl}/projects`,
  lastModified: now,
  changeFrequency: "monthly",
  priority: 0.8,
},
{
  url: `${baseUrl}/experience`,
  lastModified: now,
  changeFrequency: "monthly",
  priority: 0.7,
},
{
  url: `${baseUrl}/about`,
  lastModified: now,
  changeFrequency: "monthly",
  priority: 0.6,
},
```

- [ ] **Step 2: Update `llms.txt`**

Update the following sections to match the redesign's verified content:

- The `## Skills & Stack` section's `AI & Tooling` line: change `Claude Code, GitHub Copilot, LLM APIs, AI-augmented workflows` to `Claude Code, Claude Cowork, Claude Design, OpenAI Codex`.
- The `## Projects` section: add three entries after the existing five, matching the case-study copy from Task 2:

```
- **Darkframe** (github.com/AshwinSathian/umbra): Free, open-source, image-safe dark-mode engine for Chrome and Safari. OKLCH-native recoloring, 144 passing unit tests, real E2E-verified Chrome extension and buildable Safari Xcode project. Renamed from "Umbra" after finding a naming collision; disclosed and fixed a High-severity CSS injection vulnerability in the same changelog entry. MIT.
- **better-auth-mongoose** (better-auth-mongoose.ashwinsathian.com): Published npm package (Mongoose-native database adapter for Better Auth) closing a real, long-documented gap in the Better Auth ecosystem. CI-proven .populate() support, a companion tenant-scoping plugin, a real NestJS integration example. MIT.
- **humanize-writing-skill** (github.com/AshwinSathian/humanize-writing-skill): A Claude Code skill that makes AI-written text read as a specific, considered human voice, built from three cited research passes and a teardown of 13 existing public humanizer skills. MIT.
```

- Update the `## Projects` intro line from `Five projects designed, built, and run end to end` to `Eight projects designed, built, and run end to end`.
- The `## Key Metrics & Achievements` section already lists the verified figures used in Tasks 3/11/12 — no change needed there, but add one line: `- 40%+ API/query response-time improvement: optimised critical paths during the Product Specialist era` (this metric exists in the resume but wasn't previously in `llms.txt`).

- [ ] **Step 3: Verify**

Run `npx tsc --noEmit` (sitemap.ts is TypeScript, must still typecheck) and manually read the updated `llms.txt` to confirm no contradictory figures remain (e.g., "Five projects" must not appear anywhere alongside the new eight-project list).

- [ ] **Step 4: Commit**

```bash
git add src/app/sitemap.ts public/llms.txt
git commit -m "content: update sitemap and llms.txt for the new routes and 8-project lineup"
```

---

## Task 17: Full-site QA pass, screenshot capture note, and ship

**Files:** None modified (verification-only task, plus flagging the follow-up screenshot work).

- [ ] **Step 1: Full build verification**

```bash
npx tsc --noEmit
npm run lint
npm run build
```

All three must succeed with zero errors and zero warnings introduced by this redesign (pre-existing warnings unrelated to this work, if any, are out of scope).

- [ ] **Step 2: Playwright pass over every route**

With the dev server running, screenshot each of the following at both 1440×900 and 390×844: `/`, `/projects`, `/projects/booklet`, `/projects/darkframe`, `/experience`, `/about`, `/writing`. For each, confirm:
- No content is invisible or unstyled (no leftover `bg-canvas`/`text-ink-1`/`border-white/*` classes rendering as unstyled black-on-transparent).
- The paper/ink palette, JetBrains Mono headlines, and Source Serif 4 body text are all visibly present.
- Nav active-state highlighting (copper `signal` color) matches the current route.
- The ContactBand and slim Footer render at the bottom of every page.
- Mobile layouts don't overflow horizontally (`overflow-x` stays clipped at the body level).

- [ ] **Step 3: Manual contrast spot-check**

For the four color pairs flagged in the spec's open items (§8), compute WCAG contrast ratio (relative luminance formula) for: `ink-muted` (`#5B6570`) on `paper` (`#EEF0F1`); `ink-muted` dark (`#9AA3AC`) on `paper` dark (`#14171A`); `diff-add` (`#2E7D5B`) on `paper-raised` (`#E4E7E8`); `diff-remove` (`#B54B3E`) on `paper-raised` (`#E4E7E8`). Each must clear 4.5:1 for body-sized text or 3:1 for large/UI text (WCAG AA). If any pair fails, darken/lighten that token by the minimum amount needed to pass and re-apply it in `globals.css`, then re-run Step 1.

- [ ] **Step 4: Flag the remaining out-of-scope work**

This plan does not capture new light-mode screenshots for Darkframe, better-auth-mongoose, or humanize-writing-skill (per spec §6, these need real captures of each project's own UI, which requires access to each running project — outside what this plan's file-editing scope can produce). Confirm the three `ProjectMedia` entries added in Task 2 point at `/projects/darkframe/hero.png`, `/projects/better-auth-mongoose/hero.png` (n/a — that project uses a `code` media type, no screenshot needed), and that Darkframe's screenshot path is a known, documented gap — leave a one-line note in the task output for the user: "Darkframe needs a real screenshot captured at `public/projects/darkframe/hero.png` (light-mode UI per your instruction); until then `next/image` shows a broken-image placeholder on `/projects` and `/projects/darkframe`."

- [ ] **Step 5: Push**

```bash
git push
```

(Confirm with the user before this step per the session's risk-communication norms — pushing is visible to others and this plan's final task is the natural checkpoint to ask.)

- [ ] **Step 6: Deploy**

Only after the user confirms: run `npm run deploy` (the existing `opennextjs-cloudflare build && opennextjs-cloudflare deploy` script) to ship to Cloudflare Workers, matching the site's existing deploy path (spec §7 — no new infra).

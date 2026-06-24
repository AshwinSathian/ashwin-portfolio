# Portfolio Overhaul Plan — ashwinsathian.com

**Version:** 1.0  
**Date:** June 2026  
**Prepared by:** Expert Panel + 2025–2026 Research Synthesis  
**Implementation target:** See `IMPLEMENT_PROMPT.md`

---

## Background

This document is the output of a full-site audit of `ashwinsathian.com`. The audit combined:

1. A complete read of every source file, data file, component, and the `BRAND.md` brand system document.
2. A five-person expert panel critique across UX/UI, hiring signal, content strategy, frontend engineering, and AI fluency.
3. A research brief on 2025–2026 best practices for senior engineer personal portfolio sites.
4. Comparison against the LinkedIn profile (source of truth for career facts).

The site's aesthetic ambition is genuine and the technical foundation is solid. The failures are content failures: a critical section is rendering the wrong data, a built component is not imported, the current role is underpresented, and the site's strongest signal (the Markdown essay) is invisible from the homepage.

---

## Panel of Experts

| Name | Role | Focus |
|------|------|-------|
| Alex | Senior UX/UI Designer (ex-Apple) | Visual hierarchy, typography, motion, layout |
| Maya | Engineering Hiring Manager (ex-Google, Stripe) | Hiring signal, career narrative, skills presentation |
| Priya | Content Strategist / Personal Brand | Voice, positioning, narrative arc, copy |
| James | Staff Frontend Engineer (Vercel) | Performance, accessibility, Next.js architecture, SEO |
| Sofia | AI/ML Product Lead | AI fluency signalling, structured data, llms.txt |

---

## Panel Findings — Critical Issues

### 1. The Impact section is displaying the wrong data (CRITICAL)

`Impact.tsx` renders three philosophy words — "Craft," "Ownership," "Clarity" — at display scale. The `BRAND.md` explicitly specifies this section as the **Metric Section**: "Three large isolated statistics, each centered in its own column. Feature size (120px). Weight 100." The actual metric data (`$1B+ GTV`, `<200ms`, `1.5×`, `12 engineers`) exists fully written in `highlights.ts` and is **completely unused on the rendered page**.

This is the single highest-impact change available. The narrative arc of the page (Who → How I think → What I've done → Who I am) is broken without the numbers. The current philosophy words belong in the About section, not as the page's proof point.

### 2. The Capabilities component is built but not imported (CRITICAL)

`Capabilities.tsx` exists, `skills.ts` is fully populated, the component is well-built. It is not imported in `page.tsx`. Angular — Ashwin's primary and most marketable skill — does not appear anywhere on the live page except buried inside experience bullet text. Every engineering hiring manager will look for a skills section and find nothing.

### 3. The HighLevel experience entry has zero substance (CRITICAL)

The current role — most prominent entry, most visible to anyone scanning the timeline — has one bullet: "Leading engineering for HighLevel's funnel builder, website builder, and webinar products." This is a job description, not an entry. HighLevel is a $1.5B+ ARR SaaS platform serving 60,000+ marketing agencies. Being Lead Engineer for three of its core revenue products is significant. Representing it with a single unsupported sentence is a credibility gap.

### 4. The About headline is factually outdated

"Five years. One platform. One conviction." anchors Ashwin's identity to a company he left. The body paragraph already acknowledges the move to HighLevel — the headline should match. The fix is a single line in `about.ts`.

### 5. The writing section is invisible from the homepage

"Wait, Is Markdown Having a Moment?" is genuinely good writing: well-reported, intellectually honest, technically specific, and the site's strongest AI-adjacent signal. It lives at `/writing` with no teaser, no link, no excerpt on the homepage. The average visitor who doesn't click "Writing" in the nav will never see it.

### 6. The `next.config.js` content was never migrated to `next.config.ts`

`next.config.js` contains all real configuration (cache headers, compression, `poweredByHeader: false`). `next.config.ts` is empty. Both files coexist in the project root. Only one will be used; the content of `.js` must be migrated into `.ts` using ESM syntax, then `.js` deleted.

### 7. PostBody ships the @uiw/react-markdown-preview bundle client-side

For static Markdown from local files, rendering client-side with a library that pulls in CodeMirror and a full syntax highlighter is wasted bytes. Every writing page visitor pays the JS cost. The content is static; it should be rendered server-side.

---

## Research Synthesis — 2025–2026 Standards

Key findings from a web research brief covering senior engineer portfolios:

**Signal hierarchy at Lead/Staff level:**
- Hiring managers want evidence of *judgment and force multiplication*, not skill lists
- "I led / I decided / I was accountable for" language over "we built"
- Scale indicators with specificity: users, latency numbers, GTV, team size
- Cross-functional evidence: product collaboration, technical initiative ownership

**What converts vs. what's filler:**
- ✅ 3–5 projects with measurable outcomes and explicit reasoning
- ✅ About section with genuine point of view, not bio recap
- ✅ Writing/thought leadership (compounds over time, demonstrates senior-level communication)
- ✅ Contact with clear availability signal
- ❌ Skills lists with 40+ technologies (signals insecurity at senior level)
- ❌ GitHub contribution graph widgets (sparse for enterprise engineers — backwards signal)
- ❌ Animated skill percentage bars (universally mocked)
- ❌ Tutorial clone projects without measurable outcomes

**Thought leadership:** Writing has shifted from "nice to have" to a meaningful differentiator at Lead+ level. A single well-written technical post can rank indefinitely, drives inbound passively, and positions the author as someone with opinions — which is what senior engineering looks like.

**AI fluency signals that work:**
- Deployed, documented AI systems with architecture writeups
- Production integration of AI tooling with quantified outcomes
- Technical writing about AI layer of the stack (Ashwin has this — it's buried)
- The `llms.txt` standard: a Markdown file at `/llms.txt` for AI-readable site description — Ashwin's own essay advocates for it but his site doesn't have it

**SEO in 2025–2026:**
- JSON-LD structured data is required for AI Overview citations and Knowledge Graph recognition
- Each blog post needs `BlogPosting` schema
- `sameAs` properties on `Person` schema build entity coherence across AI search
- Blog posts compound: individual pages rank for specific queries the homepage never will

**Performance:**
- Lighthouse 90+ on all metrics is the minimum for a senior engineer's portfolio
- LCP under 2.5s, INP under 200ms, CLS under 0.1
- `@uiw/react-markdown-preview` pulling in CodeMirror for a text-only blog page is a measurable LCP regression

**Accessibility (WCAG 2.2 AA):**
- Focus management when closing modals/menus must return focus to trigger
- All presentational elements need `aria-hidden`
- Touch targets: 44×44px minimum (Apple HIG)

---

## Change Specification

Changes are organized by priority tier. Tier 1 changes are content-critical and must ship together — they form a coherent overhaul, not a piecemeal update.

---

### TIER 1 — CRITICAL (Content-blocking, highest ROI)

---

#### T1-1: Rebuild the Impact section as a Metric section

**File:** `src/components/Impact.tsx` — FULL REWRITE  
**Data file:** `src/app/data/highlights.ts` — NO CHANGE (data is correct as-is)

The component must be replaced entirely. The four stats from `HIGHLIGHTS` must render at Feature scale.

**Layout spec:**
- Desktop: 4-column grid, each column centered
- Tablet (≥640px <1024px): 2×2 grid
- Mobile: stacked, each stat separated by a hairline divider
- Vertical padding: `min-h-svh` with `items-center` flex centering

**Per-stat layout (top to bottom within each column):**
1. Eyebrow label: `HIGHLIGHTS[n].title` — 11px, weight 500, uppercase, `tracking-[0.08em]`, `text-label-4`
2. Metric value: `HIGHLIGHTS[n].metric` — `clamp(64px, 9vw, 112px)`, weight 100, `text-label-1`, `tracking-[-0.045em]`, `leading-none`
3. Summary: `HIGHLIGHTS[n].summary` — 14px, weight 400, `text-label-3`, `leading-[1.6]`, `max-w-[220px]`, centered

**Dividers:** Vertical hairline `border-l border-white/8` between columns on desktop. Horizontal `border-t border-white/8` between rows on mobile.

**Animation:** Use existing `fadeInUp` + `stagger` from `@/lib/motion`. `whileInView` with `viewport={{ once: true, amount: 0.2 }}`.

**Section metadata:**
```
id="impact"
aria-label="By the numbers"
className="flex min-h-svh items-center bg-canvas px-6 py-24 md:px-16"
```

**What happens to "Craft / Ownership / Clarity":** These philosophy statements are good writing. Move them into the About section as a secondary content block (see T1-4), or simply retire them. Do NOT keep them as a standalone full-screen section — they are not the metric moment the brand calls for.

---

#### T1-2: Import and place the Capabilities component

**File:** `src/app/page.tsx` — ADD IMPORT + ADD COMPONENT

Add `import Capabilities from "@/components/Capabilities"` to the import block.

Place `<Capabilities />` between `<Work />` and `<Experience />`.

New page order:
```tsx
<Hero />
<Manifesto />
<Impact />        {/* now shows metrics */}
<About />
<Work projects={topProjects} />
<Capabilities />  {/* ADD THIS */}
<WritingTeaser /> {/* ADD THIS — see T1-5 */}
<Experience />
<Education />
<Contact />
<Footer />
```

No changes needed to `Capabilities.tsx` or `skills.ts` — the component is production-ready as-is.

---

#### T1-3: Expand the HighLevel experience entry

**File:** `src/app/data/experience.ts`

Replace the single HighLevel bullet with three substantive bullets. These are accurate and do not fabricate individual outcomes — they describe scope using publicly documented facts about HighLevel (60k+ agency customers, $1.5B+ ARR, core product surface areas).

```typescript
{
  role: "Lead Engineer — Funnels, Websites, Webinars",
  company: "HighLevel",
  dates: "Mar 2026 – Present",
  bullets: [
    "Leading the engineering organisation for three of HighLevel's core revenue products — funnel builder, website builder, and webinar platform — serving 60,000+ marketing agencies worldwide.",
    "Driving technical direction and cross-squad alignment across high-throughput, real-time builder products with complex customer-configurable state at scale.",
    "Establishing architecture patterns, engineering standards, and release discipline within a high-scale SaaS environment operating at $1.5B+ ARR.",
  ],
},
```

---

#### T1-4: Update the About headline

**File:** `src/app/data/about.ts`

Change the headline from `"Five years. One platform. One conviction."` to a statement accurate to Ashwin's full career arc including HighLevel.

```typescript
export const ABOUT = {
  headline: "Seven years. One standard.",
  paragraphs: [
    "When I joined Penny in 2020, I came to build features. By the time I left as Lead Engineer, I'd shaped the architecture underneath them — the module boundaries, the tenancy contracts, the data patterns that had to hold as the platform grew. That kind of understanding only comes from staying long enough for your early decisions to come back and teach you something.",
    "I care about the craft: clean interfaces, honest boundaries, structure that makes the work of the next engineer easier than your own. That conviction followed me from Penny to HighLevel, where I now lead engineering for Funnels, Websites, and Webinars.",
  ],
} as const;
```

The body paragraphs are unchanged — they're already correct and well-written. Only the headline changes.

---

#### T1-5: Build and add a WritingTeaser component

**New file:** `src/components/WritingTeaser.tsx`

A Server Component that fetches the latest 2 posts (or 1 if that's all that exists) using `getAllPosts()` from `@/lib/writing`, and surfaces them on the homepage with a link to `/writing`.

**Spec:**
- Background: `bg-canvas`
- Section eyebrow: "Writing" label in standard label style
- Section headline: `"Thinking out loud."` — `clamp(36px, 5.5vw, 64px)`, weight 100
- Post list: For each post, show date + title on one row, description below, right-side "Read →" arrow in accent
- Bottom link: "All writing →" linking to `/writing`
- Animation: `fadeInUp` + `stagger` on scroll entry

**Placement in page.tsx:** Between `<Capabilities />` and `<Experience />`.

**Component structure:**
```tsx
import { getAllPosts } from "@/lib/writing";
// Server component — no "use client" directive

export default function WritingTeaser() {
  const posts = getAllPosts().slice(0, 2);
  if (posts.length === 0) return null;
  // render section...
}
```

The section should render nothing (return null) if there are no posts, so it degrades gracefully.

---

### TIER 2 — HIGH PRIORITY (Positioning, accuracy, polish)

---

#### T2-1: Merge next.config files — migrate .js content into .ts, delete .js

**File to DELETE:** `next.config.js`  
**File to UPDATE:** `next.config.ts`

Migrate the real configuration from `next.config.js` (cache headers, `poweredByHeader: false`, `compress: true`) into `next.config.ts` using ESM syntax:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  async headers() {
    return [
      {
        source: "/(.*)\\.(?:png|jpg|jpeg|gif|webp|ico|svg)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/Resume.pdf",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400" }],
      },
      {
        source: "/(sitemap\\.xml|robots\\.txt)",
        headers: [{ key: "Cache-Control", value: "public, max-age=3600" }],
      },
    ];
  },
};

export default nextConfig;
```

Then delete `next.config.js`.

---

#### T2-2: Replace @uiw/react-markdown-preview with server-side rendering

**File:** `src/components/writing/PostBody.tsx` — REWRITE  
**Package to add:** `marked` (`npm install marked`)  
**Package to remove:** `@uiw/react-markdown-preview` (after confirming no other usage)

New `PostBody.tsx` — a Server Component (no `"use client"`):

```tsx
import { marked } from "marked";

type Props = {
  content: string;
};

export default function PostBody({ content }: Props) {
  const html = marked(content, { gfm: true }) as string;

  return (
    <div
      className="prose"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
```

**Safety note:** `content` comes from local `.md` files parsed at build time, never from user input. `dangerouslySetInnerHTML` is safe in this context.

The `.prose` class in `globals.css` already handles all typography for rendered HTML. No style changes needed.

After replacing, run `npm uninstall @uiw/react-markdown-preview` and remove the now-unused `types/estree-2.d.ts` type shim if it was added solely for that package.

---

#### T2-3: Normalize "Résumé" spelling across the site

**File:** `src/components/Footer.tsx`

Change `Resume ↓` to `Résumé ↓` to match the navbar's spelling.

```tsx
// Before
Résumé ↓

// In Footer.tsx, the link text currently reads:
// Resume ↓  ← change this
```

**File:** `src/app/data/site.ts` — confirm `resumePath` points to `"/Resume.pdf"` (the actual file in `/public`). No change needed to the file path — just the display text in the footer component.

---

#### T2-4: Add a clarifying note to the Product Specialist role

**File:** `src/app/data/experience.ts`

The "Product Specialist" title on an engineering portfolio creates a yellow flag for hiring managers unfamiliar with Penny's hybrid role structure. Add context in the bullets:

```typescript
{
  role: "Product Specialist",
  company: "Penny Software",
  dates: "Apr 2022 – Dec 2023",
  bullets: [
    "Remained hands-on across the API layer and frontend in a hybrid engineering + product ownership role — translating procurement workflows into shipped product outcomes.",
    "Optimized critical APIs and queries across high-traffic paths while preserving platform stability.",
    "Coordinated engineering, QA, and product rhythms to keep releases iterative and predictable.",
  ],
  tech: ["Angular", "NestJS", "MongoDB", "Nx"],
},
```

---

#### T2-5: Fix the scroll indicator alignment in Hero

**File:** `src/components/Hero.tsx`

The scroll indicator is currently `self-center` (horizontally centered) in the flex column. The name and title are anchored bottom-left. These two elements are visually disconnected. The scroll indicator should be `position: absolute` at the bottom-center of the viewport, independent of the flex layout.

Replace the current scroll indicator block with:

```tsx
{/* Scroll indicator — absolute bottom-center */}
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 1.2, duration: 0.6 }}
  className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
  aria-hidden
>
  <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-label-4">
    Scroll
  </span>
  <div className="relative h-8 w-px overflow-hidden bg-label-4/30">
    <motion.span
      className="absolute inset-x-0 top-0 bg-label-3"
      animate={{ y: ["-100%", "200%"] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      style={{ height: "50%" }}
    />
  </div>
</motion.div>
```

The parent `<section>` must have `relative` positioning for `absolute` child placement. The existing `className` already includes `relative`.

---

#### T2-6: Add aria-hidden to ScrollProgress

**File:** `src/components/ScrollProgress.tsx`

```tsx
<motion.div
  aria-hidden="true"
  className="fixed inset-x-0 top-0 z-60 h-0.5 origin-left bg-accent"
  style={{ scaleX: width }}
/>
```

---

#### T2-7: Fix mobile menu focus management in Navbar

**File:** `src/components/Navbar.tsx`

When the mobile menu closes (either via a link click or the close button), focus should return to the hamburger toggle button. Add a `ref` to the toggle button and call `.focus()` on close:

```tsx
const toggleRef = useRef<HTMLButtonElement>(null);

// In scrollTo (which calls setMenuOpen(false)):
const scrollTo = (href: string) => {
  setMenuOpen(false);
  toggleRef.current?.focus();
  // ... rest of scroll logic
};

// On the hamburger button:
<button
  ref={toggleRef}
  // ... existing props
>
```

---

#### T2-8: Fix Navbar IntersectionObserver on writing route

**File:** `src/components/Navbar.tsx`

The observer setup runs on the writing route even though the section IDs (`projects`, `about`, `experience`, `contact`) don't exist there. Add a guard:

```tsx
useEffect(() => {
  if (isWritingRoute) return; // no sections to observe
  
  const ids = ["projects", "about", "experience", "contact"];
  // ... rest of observer setup
}, [isWritingRoute]);
```

---

#### T2-9: Add apple-touch-icon.png to /public

**File:** `/public/apple-touch-icon.png` — CREATE

`layout.tsx` references `/apple-touch-icon.png` in the `icons` metadata field, but this file does not exist in `/public`. iOS share sheets and home screen saves will show a generic favicon fallback.

Create a 180×180px PNG with the "AS" monogram or the favicon design. This can be generated from the existing `favicon.svg`.

**Implementation note:** The simplest approach is to use a Node script or a design tool to export the `favicon.svg` as a 180×180 PNG and place it at `/public/apple-touch-icon.png`. Alternatively, use a Satori/`sharp` build script if the favicon is SVG-based.

---

### TIER 3 — MEDIUM PRIORITY (SEO, content expansion, AI signals)

---

#### T3-1: Create /public/llms.txt

**New file:** `/public/llms.txt`

Per the `llms.txt` standard (advocated for in Ashwin's own Markdown essay). This file makes the site legible to AI systems that crawl for structured plain-text content.

```markdown
# Ashwin Sathian

> Full-stack engineer and engineering leader. Seven years building SaaS platforms at scale.

## About

Ashwin Sathian is a Lead Engineer based in Kochi, India. He currently leads engineering for HighLevel's Funnels, Websites, and Webinars products — core revenue surface areas of a $1.5B+ ARR platform serving 60,000+ marketing agencies.

Prior to HighLevel, he spent five years at Penny Software, a B2B procurement SaaS platform, growing from Full Stack Developer to Lead Engineer. In that time he architected the core multi-tenant platform, implemented RBAC and tenancy isolation, led a cross-functional engineering team, and shaped the data patterns that held as the platform scaled to handle $1B+ in procurement GTV.

## Skills

Angular, React, Next.js, NestJS, Node.js, MongoDB, TypeScript, AWS, GCP, Docker, GitHub Actions

## Writing

Ashwin publishes long-form technical essays at ashwinsathian.com/writing. Current post: "Wait, Is Markdown Having a Moment?" — an essay on how a 2004 blogging format became the native language of AI.

## Contact

- Email: ashwinsathyan19@gmail.com
- LinkedIn: https://linkedin.com/in/ashwinsathian
- GitHub: https://github.com/AshwinSathian
- Website: https://ashwinsathian.com
```

---

#### T3-2: Add BlogPosting schema to individual writing pages

**File:** `src/app/writing/[slug]/page.tsx`

Add `BlogPosting` structured data for each post to enable AI Overview citations and Google Knowledge Panel association.

In the `generateMetadata` function or in the page body, inject a JSON-LD script:

```tsx
const articleSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: post.title,
  description: post.description,
  datePublished: post.date,
  author: {
    "@type": "Person",
    name: "Ashwin Sathian",
    url: "https://ashwinsathian.com",
  },
  url: `https://ashwinsathian.com/writing/${post.slug}`,
  publisher: {
    "@type": "Person",
    name: "Ashwin Sathian",
    url: "https://ashwinsathian.com",
  },
};
```

Inject via `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />` in the page's `<head>` or directly in the component (Next.js App Router will hoist it to the head).

---

#### T3-3: Enhance Person schema in layout.tsx

**File:** `src/app/layout.tsx`

Add the HighLevel role and expand `knowsAbout`:

```typescript
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Ashwin Sathian",
  url: siteUrl,
  email: "mailto:ashwinsathyan19@gmail.com",
  description: siteDescription,
  sameAs: [
    "https://www.linkedin.com/in/ashwinsathian",
    "https://github.com/AshwinSathian",
  ],
  jobTitle: "Lead Engineer",
  worksFor: {
    "@type": "Organization",
    name: "HighLevel",
    url: "https://www.gohighlevel.com",
  },
  knowsAbout: [
    "SaaS architecture",
    "Multi-tenant platforms",
    "Angular",
    "React",
    "Next.js",
    "NestJS",
    "MongoDB",
    "TypeScript",
    "AWS",
    "GCP",
    "Engineering leadership",
    "Platform engineering",
    "CI/CD",
  ],
};
```

---

#### T3-4: Add curated descriptions to TOP_PROJECTS

**File:** `src/app/data/top-projects.ts`

Add a `description` field to override the GitHub-scraped description with a curated one-line narrative:

```typescript
export const TOP_PROJECTS: Array<{ name: string; url: string; description?: string }> = [
  {
    name: "@ngx-runtime-i18n",
    url: "https://github.com/AshwinSathian/ngx-runtime-i18n",
    description: "An Angular library for runtime internationalization — switch languages without a page reload.",
  },
  {
    name: "API Sandbox",
    url: "https://github.com/AshwinSathian/apiSandbox",
    description: "A browser-based HTTP sandbox for testing API endpoints without leaving the browser.",
  },
  {
    name: "GitHub Issues Analyzer",
    url: "https://github.com/AshwinSathian/github-issue-analyzer",
    description: "A tool for analyzing GitHub issue patterns to surface trends and prioritize backlogs.",
  },
];
```

**Update `src/app/(helpers)/projects.ts`:** Use `projectSource.description` as the description fallback if GitHub API description is empty:

```typescript
return {
  owner: ref.owner,
  repo: ref.repo,
  description: meta.description ?? source.description ?? null,
  // ...
};
```

Also pass `description: source.description` in the error fallback `return` block.

---

#### T3-5: Update site metadata description

**File:** `src/app/layout.tsx`

The current layout-level description (`"Software engineer with a conviction for craft. Seven years at one platform. Now building at HighLevel."`) is good but doesn't surface the $1B+ claim or HighLevel's scale. The OG route already uses the better line. Update:

```typescript
const siteDescription =
  "Full-stack engineer and engineering leader. Seven years building SaaS platforms at scale — $1B+ GTV, now leading engineering at HighLevel.";
```

---

### TIER 4 — ENHANCEMENT (Expands depth, future-proofs)

---

#### T4-1: Add a second writing post

The writing section has one post. A single post doesn't establish a pattern. Ashwin's LinkedIn lists a publication: "All That You Can Do with Google Analytics, and More." This could be adapted or expanded into a second post.

Alternatively, write a new post in the existing voice. Suggested topics (fitting the established voice of the Markdown essay):

- "What five years on one codebase taught me about technical debt" — direct, personal, experience-backed
- "Why I spent three months on module boundaries before shipping any features" — architectural judgment story
- "The part of engineering leadership nobody talks about: owning your early decisions"

Format as a Markdown file in `/src/content/writing/` matching the existing frontmatter schema.

---

#### T4-2: Add a HighLevel card to the Work section

**Files:** `src/app/data/work.ts`, `src/components/Work.tsx`

Currently, the Work section has only the Penny Software platform card. HighLevel is now the current employer and represents a significant scope. Add a second, slightly smaller card for HighLevel:

```typescript
export const HIGHLEVEL_PLATFORM = {
  company: "HighLevel",
  title: "Leading engineering for the platform agencies are built on.",
  description:
    "HighLevel is an all-in-one SaaS platform powering 60,000+ marketing agencies worldwide. As Lead Engineer for Funnels, Websites, and Webinars, I own the technical direction of three of the platform's core revenue products — each requiring real-time, high-throughput builder experiences with complex customer-configurable state.",
} as const;
```

Render it as a second card in Work, visually lighter than the Penny card (perhaps without the company eyebrow or with a smaller heading), making the hierarchy clear.

---

#### T4-3: Add tags to the writing index

**File:** `src/components/writing/PostList.tsx`

The post frontmatter includes `tags: ["technology", "AI", "writing"]` but the PostList component doesn't render them. Surface them as subtle badges to help readers orient. Useful as the writing section grows.

---

## File-by-File Change Map

| File | Action | Priority |
|------|--------|----------|
| `src/components/Impact.tsx` | Full rewrite — metric section | T1-1 |
| `src/app/page.tsx` | Add Capabilities + WritingTeaser imports and JSX | T1-2 |
| `src/app/data/experience.ts` | Expand HighLevel bullets; clarify Product Specialist | T1-3, T2-4 |
| `src/app/data/about.ts` | Update headline | T1-4 |
| `src/components/WritingTeaser.tsx` | Create new Server Component | T1-5 |
| `next.config.ts` | Migrate content from .js version | T2-1 |
| `next.config.js` | DELETE | T2-1 |
| `src/components/writing/PostBody.tsx` | Rewrite as Server Component using `marked` | T2-2 |
| `src/components/Footer.tsx` | Fix "Resume" → "Résumé" | T2-3 |
| `src/components/Hero.tsx` | Fix scroll indicator positioning | T2-5 |
| `src/components/ScrollProgress.tsx` | Add `aria-hidden="true"` | T2-6 |
| `src/components/Navbar.tsx` | Fix focus management + observer guard | T2-7, T2-8 |
| `public/apple-touch-icon.png` | Create 180×180px PNG | T2-9 |
| `public/llms.txt` | Create new file | T3-1 |
| `src/app/writing/[slug]/page.tsx` | Add BlogPosting schema | T3-2 |
| `src/app/layout.tsx` | Enhance Person schema + update description | T3-3, T3-5 |
| `src/app/data/top-projects.ts` | Add curated descriptions | T3-4 |
| `src/app/(helpers)/projects.ts` | Use curated description as fallback | T3-4 |

---

## New Files to Create

| File | Purpose |
|------|---------|
| `src/components/WritingTeaser.tsx` | Homepage writing section teaser |
| `public/llms.txt` | AI-readable site description |
| `public/apple-touch-icon.png` | iOS home screen / share sheet icon |

---

## Files to Delete

| File | Reason |
|------|--------|
| `next.config.js` | Content migrated to `next.config.ts`; dual config files cause CI ambiguity |

---

## Dependencies

| Package | Action | Reason |
|---------|--------|--------|
| `marked` | `npm install marked` | Server-side Markdown rendering for PostBody |
| `@types/marked` | `npm install --save-dev @types/marked` | TypeScript types for marked |
| `@uiw/react-markdown-preview` | `npm uninstall` (after replacing PostBody) | Replaced by server-side marked |

---

## Page Structure — Before and After

**Before:**
```
Hero → Manifesto → Impact (Craft/Ownership/Clarity) → About → Work → Experience → Education → Contact
```

**After:**
```
Hero → Manifesto → Impact (Metrics: $1B+, <200ms, 1.5×, 12) → About → Work → Capabilities → WritingTeaser → Experience → Education → Contact
```

---

## Content Copy — Production-Ready

### About Headline
```
Seven years. One standard.
```

### About Paragraphs (unchanged — already correct)
```
When I joined Penny in 2020, I came to build features. By the time I left as Lead Engineer, I'd shaped the architecture underneath them — the module boundaries, the tenancy contracts, the data patterns that had to hold as the platform grew. That kind of understanding only comes from staying long enough for your early decisions to come back and teach you something.

I care about the craft: clean interfaces, honest boundaries, structure that makes the work of the next engineer easier than your own. That conviction followed me from Penny to HighLevel, where I now lead engineering for Funnels, Websites, and Webinars.
```

### HighLevel Experience Bullets
```
Leading the engineering organisation for three of HighLevel's core revenue products — funnel builder, website builder, and webinar platform — serving 60,000+ marketing agencies worldwide.

Driving technical direction and cross-squad alignment across high-throughput, real-time builder products with complex customer-configurable state at scale.

Establishing architecture patterns, engineering standards, and release discipline within a high-scale SaaS environment operating at $1.5B+ ARR.
```

### Product Specialist Role First Bullet
```
Remained hands-on across the API layer and frontend in a hybrid engineering + product ownership role — translating procurement workflows into shipped product outcomes.
```

### WritingTeaser Section Headline
```
Thinking out loud.
```

### Site Meta Description
```
Full-stack engineer and engineering leader. Seven years building SaaS platforms at scale — $1B+ GTV, now leading engineering at HighLevel.
```

---

## Acceptance Criteria

The overhaul is complete when the following are verifiable:

- [ ] Navigating to the homepage shows four metric stats ($1B+ GTV, 1.5× faster releases, <200ms, 12 engineers) at display scale between the Manifesto and About sections — not three philosophy words
- [ ] A skills/capabilities section (Angular, React, NestJS, MongoDB, TypeScript, etc.) is visible on the homepage between Work and Experience
- [ ] The HighLevel experience entry has three substantive bullets describing scope, not one generic line
- [ ] The About headline reads "Seven years. One standard." — not "Five years. One platform. One conviction."
- [ ] At least one writing post is teased on the homepage with a link to `/writing`
- [ ] `next.config.js` does not exist; `next.config.ts` contains all cache headers and config
- [ ] Writing pages load without the @uiw/react-markdown-preview client bundle (verify via Network tab — no CodeMirror JS)
- [ ] Footer reads "Résumé ↓" (with accent), matching the navbar
- [ ] The scroll indicator in the Hero is visually centered at the bottom of the viewport, not competing with the bottom-left name/title block
- [ ] `ScrollProgress` component has `aria-hidden="true"`
- [ ] Mobile menu close returns focus to the hamburger toggle button
- [ ] `/llms.txt` is accessible at the public URL
- [ ] `/apple-touch-icon.png` exists in `/public`
- [ ] `npm run build` passes with no TypeScript errors

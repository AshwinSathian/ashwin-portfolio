# Claude Code Implementation Prompt

**Use this prompt verbatim with a Claude Code agent to implement the portfolio overhaul.**

Paste this entire block as the first message to a fresh Claude Code session in this repository.

---

## PROMPT START

You are implementing a comprehensive overhaul of the personal portfolio site at `ashwinsathian.com`. The full specification is in `PORTFOLIO_OVERHAUL_PLAN.md` at the root of this repo. Read that document first and in full before writing a single line of code. Everything you need — spec, copy, component structure, file paths, acceptance criteria — is in that document.

Your job is to implement every change listed in it, from Tier 1 through Tier 3, in order. Do not skip anything. Do not ask for clarification — the plan is unambiguous. If something is genuinely ambiguous, make the decision that best serves the stated goal (positioning Ashwin as a senior, AI-augmented engineering leader) and note it briefly.

---

### Before you begin: orientation

Read these files to understand the current state of the codebase. Do not start implementing until you have read all of them:

- `PORTFOLIO_OVERHAUL_PLAN.md` — the full plan (primary reference)
- `src/app/page.tsx` — current page composition
- `src/components/Impact.tsx` — current (incorrect) Impact section
- `src/app/data/highlights.ts` — the metric data that Impact should render
- `src/app/data/experience.ts` — current experience data
- `src/app/data/about.ts` — current about data
- `src/components/WritingTeaser.tsx` — does not exist yet; you will create it
- `src/lib/writing.ts` — contains `getAllPosts()` which WritingTeaser will use
- `src/lib/motion.ts` — contains `fadeInUp`, `stagger`, `fadeIn` animation variants
- `src/app/globals.css` — contains `.prose` class that PostBody relies on
- `src/components/writing/PostBody.tsx` — to be rewritten
- `src/components/Hero.tsx` — scroll indicator to be repositioned
- `src/components/Navbar.tsx` — observer guard + focus management fix
- `src/components/ScrollProgress.tsx` — aria-hidden fix
- `src/components/Footer.tsx` — "Résumé" spelling fix
- `next.config.js` — to be migrated and deleted
- `next.config.ts` — to receive migrated content
- `src/app/layout.tsx` — structured data + meta description update
- `src/app/data/top-projects.ts` — to receive curated descriptions
- `src/app/(helpers)/projects.ts` — to use curated description as fallback
- `src/app/writing/[slug]/page.tsx` — to receive BlogPosting schema
- `tailwind.config.ts` — understand current Tailwind setup
- `src/app/data/skills.ts` — understand Capabilities data structure

---

### Implementation order

Execute changes in this exact order. Mark each complete before starting the next.

---

**STEP 1 — Rebuild Impact.tsx as a Metric section (CRITICAL)**

Completely replace `src/components/Impact.tsx`. The new component renders the four stats from `highlights.ts` (import `HIGHLIGHTS` from `@/app/data/highlights`).

Layout:
- Section: `min-h-svh`, `bg-canvas`, flex center, `px-6 md:px-16 py-24`
- Desktop: 4-column grid (`grid-cols-4`), each column centered (`text-center` or flex column with `items-center`)
- Mobile: stacked list with `border-t border-white/8` separator between items (except the first)
- Tablet (sm): 2-column grid (`sm:grid-cols-2`) — use CSS grid, not JS branching

Per-stat structure (top to bottom in each column):
1. Eyebrow: `HIGHLIGHTS[i].title` — `text-[11px] font-medium uppercase tracking-[0.08em] text-label-4 mb-4`
2. Metric: `HIGHLIGHTS[i].metric` — `clamp(64px, 9vw, 112px)`, `font-thin`, `leading-none`, `tracking-[-0.045em]`, `text-label-1`
3. Summary: `HIGHLIGHTS[i].summary` — `text-[13px] leading-[1.6] text-label-3 mt-4 max-w-[200px] mx-auto`

Hairline dividers between columns on desktop: `border-l border-white/8` on all columns except the first. Use `pl-8` and `pr-8` (or `gap-0` with padding) to space them.

Animation: wrap the grid in a `<motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>`. Each column is `<motion.div variants={fadeInUp}>`.

Section has `id="impact"` and `aria-label="By the numbers"`.

Use `"use client"` directive (required for framer-motion `whileInView`).

Imports needed: `framer-motion`, `HIGHLIGHTS` from `@/app/data/highlights`, `fadeInUp` and `stagger` from `@/lib/motion`.

---

**STEP 2 — Add Capabilities and WritingTeaser to page.tsx**

In `src/app/page.tsx`, add two new imports:
```tsx
import Capabilities from "@/components/Capabilities";
import WritingTeaser from "@/components/WritingTeaser";
```

Update the JSX render order to:
```tsx
<Hero />
<Manifesto />
<Impact />
<About />
<Work projects={topProjects} />
<Capabilities />
<WritingTeaser />
<Experience />
<Education />
<Contact />
<Footer />
```

Do NOT create `WritingTeaser.tsx` yet — that's Step 3. Just add the import and JSX placeholder so the order is established.

Actually — create WritingTeaser.tsx first (Step 3), then update page.tsx.

Revised order: do Step 3 before Step 2.

---

**STEP 3 — Create WritingTeaser.tsx (Server Component)**

Create `src/components/WritingTeaser.tsx`. This is a Server Component — no `"use client"` directive.

```tsx
import Link from "next/link";
import { getAllPosts } from "@/lib/writing";

export default function WritingTeaser() {
  const posts = getAllPosts().slice(0, 2);
  if (posts.length === 0) return null;

  return (
    <section
      id="writing"
      aria-labelledby="writing-teaser-heading"
      className="bg-canvas px-6 py-24 md:px-16 md:py-32"
    >
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-16">
          {/* Header */}
          <div className="flex flex-col gap-4">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-label-3">
              Writing
            </p>
            <h2
              id="writing-teaser-heading"
              className="text-[clamp(36px,5.5vw,64px)] font-thin leading-none tracking-[-0.035em] text-label-1"
            >
              Thinking out loud.
            </h2>
          </div>

          {/* Post list */}
          <div className="flex flex-col">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/writing/${post.slug}`}
                className="group flex items-start justify-between gap-6 border-t border-white/8 py-8 first:border-t-0 first:pt-0 hover:opacity-80 transition-opacity duration-200"
              >
                <div className="flex flex-col gap-2">
                  <p className="text-[13px] text-label-4">
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <h3 className="text-[17px] font-medium leading-snug tracking-[-0.01em] text-label-1">
                    {post.title}
                  </h3>
                  {post.description && (
                    <p className="text-[15px] leading-[1.6] text-label-2 max-w-2xl">
                      {post.description}
                    </p>
                  )}
                </div>
                <span className="shrink-0 text-[14px] text-accent opacity-0 transition-opacity duration-200 group-hover:opacity-100 mt-1">
                  Read →
                </span>
              </Link>
            ))}
          </div>

          {/* All writing link */}
          <Link
            href="/writing"
            className="text-[14px] text-label-3 transition-colors duration-200 hover:text-label-1 w-fit"
          >
            All writing →
          </Link>
        </div>
      </div>
    </section>
  );
}
```

Check `src/lib/writing.ts` for the exact shape of the post object returned by `getAllPosts()` — specifically whether it has `.slug`, `.title`, `.date`, `.description` properties. Adjust property names if needed to match.

After creating this component, complete Step 2 (add to page.tsx).

---

**STEP 4 — Update experience data**

In `src/app/data/experience.ts`:

Replace the HighLevel entry:
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

Update the Product Specialist entry first bullet:
```typescript
"Remained hands-on across the API layer and frontend in a hybrid engineering + product ownership role — translating procurement workflows into shipped product outcomes.",
```

(The other two bullets for Product Specialist can remain as-is.)

---

**STEP 5 — Update about data**

In `src/app/data/about.ts`, change the headline only:

```typescript
export const ABOUT = {
  headline: "Seven years. One standard.",
  // paragraphs unchanged
} as const;
```

---

**STEP 6 — Migrate next.config and delete the .js file**

Read `next.config.js` to get its content. Then update `next.config.ts` to contain all that configuration using ESM syntax:

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

Then delete `next.config.js`. Verify `next.config.ts` is the only config file.

---

**STEP 7 — Replace PostBody with server-side Markdown rendering**

First install the dependency: run `npm install marked` and `npm install --save-dev @types/marked`.

Then rewrite `src/components/writing/PostBody.tsx`:

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

Remove the `"use client"` directive entirely — this is now a Server Component.

After replacing, check if `@uiw/react-markdown-preview` is used anywhere else in the codebase. If it is only used in PostBody (search all `.tsx` and `.ts` files for `@uiw`), then run `npm uninstall @uiw/react-markdown-preview`. Also check `types/estree-2.d.ts` — if it was added solely as a workaround for the @uiw package's type conflicts, delete it too (verify by checking if anything imports from it or if any other file references `estree`).

---

**STEP 8 — Fix Footer "Résumé" spelling**

In `src/components/Footer.tsx`, change the link text from `Resume ↓` to `Résumé ↓`.

---

**STEP 9 — Fix Hero scroll indicator positioning**

In `src/components/Hero.tsx`, the scroll indicator block (the `<motion.div>` containing "Scroll" text and animated line) currently has `className` containing `self-center`. 

Remove that element from the flex column flow and re-add it as an absolutely positioned element. The parent `<section>` already has `relative` positioning.

Change the scroll indicator's outer motion.div to:
```tsx
className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
```

Remove `self-center` and any `mt-` or `mb-` margins from the old position. The section's inner flex column (`flex-1 flex-col justify-end`) should now contain only the name+title block, not the scroll indicator.

---

**STEP 10 — Add aria-hidden to ScrollProgress**

In `src/components/ScrollProgress.tsx`, add `aria-hidden="true"` to the motion.div:

```tsx
<motion.div
  aria-hidden="true"
  className="fixed inset-x-0 top-0 z-60 h-0.5 origin-left bg-accent"
  style={{ scaleX: width }}
/>
```

---

**STEP 11 — Fix Navbar: observer guard + focus management**

In `src/components/Navbar.tsx`:

**Fix 1 — Observer guard.** In the `useEffect` that sets up IntersectionObservers (the one observing `["projects", "about", "experience", "contact"]`), add a guard at the top:

```tsx
useEffect(() => {
  if (isWritingRoute) return;
  
  const ids = ["projects", "about", "experience", "contact"];
  // ... rest of existing observer code unchanged
}, [isWritingRoute]);
```

**Fix 2 — Focus management.** Add a `useRef` for the hamburger toggle button. When `setMenuOpen(false)` is called (either via `scrollTo` or inline close button click), restore focus to the toggle:

```tsx
const toggleRef = useRef<HTMLButtonElement>(null);

const scrollTo = (href: string) => {
  setMenuOpen(false);
  toggleRef.current?.focus();
  const el = document.getElementById(href.replace("#", ""));
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};
```

Add `ref={toggleRef}` to the hamburger `<button>` element.

Also add `onClick={() => { setMenuOpen(false); toggleRef.current?.focus(); }}` to the mobile overlay Link elements if they don't already call setMenuOpen(false).

---

**STEP 12 — Create /public/llms.txt**

Create the file `public/llms.txt` with this exact content:

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

**STEP 13 — Enhance Person structured data and meta description in layout.tsx**

In `src/app/layout.tsx`:

Update `siteDescription`:
```typescript
const siteDescription =
  "Full-stack engineer and engineering leader. Seven years building SaaS platforms at scale — $1B+ GTV, now leading engineering at HighLevel.";
```

Update the `structuredData` object — expand `knowsAbout` and add `worksFor.url`:
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

**STEP 14 — Add BlogPosting schema to writing post pages**

In `src/app/writing/[slug]/page.tsx`, read the current file structure. After the post content is loaded, inject a JSON-LD script for the post.

Inside the `default export` page component (Server Component), after loading the post, add:

```tsx
const articleSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: post.title,
  description: post.description ?? "",
  datePublished: post.date,
  author: {
    "@type": "Person",
    name: "Ashwin Sathian",
    url: "https://ashwinsathian.com",
  },
  url: `https://ashwinsathian.com/writing/${params.slug}`,
  publisher: {
    "@type": "Person",
    name: "Ashwin Sathian",
    url: "https://ashwinsathian.com",
  },
};
```

And in the JSX return, inside the `<main>` or before it:
```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
/>
```

Match the exact variable names and post data shape already in use in this file. Read the file carefully before editing.

---

**STEP 15 — Add curated descriptions to top-projects.ts and update the helper**

In `src/app/data/top-projects.ts`, update the type and add descriptions:

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

In `src/app/(helpers)/projects.ts`, update the `buildProject` function to use the curated description as a fallback:

In the try block's return statement, change:
```typescript
description: meta.description,
```
to:
```typescript
description: meta.description ?? source.description ?? null,
```

In the catch block's fallback return, add:
```typescript
description: source.description ?? null,
```

Also update the function signature to accept the source description — the function receives `{ name, url }` but now needs `description` too. Change:
```typescript
async function buildProject({ name, url }: ProjectSource): Promise<ProjectListItem> {
```
to pass the full source object and access `source.description`.

You may need to update the `ProjectSource` type to include `description?: string`.

---

**STEP 16 — Run build and verify**

Run `npm run build`. Fix any TypeScript errors before declaring implementation complete.

Common things to check:
- `WritingTeaser.tsx` uses the correct property names from `getAllPosts()` return type (read `src/lib/writing.ts` for the exact shape)
- `marked()` return type — cast to `string` if TypeScript complains: `marked(content, { gfm: true }) as string`
- `ProjectSource` type change in `projects.ts` — ensure the type update doesn't break anything
- `next.config.ts` ESM syntax — `export default` not `module.exports`

If the build passes, run `npm run lint` and fix any lint warnings.

---

### What you must NOT do

- Do not change the Manifesto copy (`"I've always cared more about the structure underneath..."`) — the panel judged it the strongest writing on the site
- Do not add, remove, or reorder the existing experience entries beyond the specific bullet changes described
- Do not fabricate metrics or claims beyond what is specified in the plan
- Do not change the visual design system (colors, typography scale, motion tokens) — it is correct
- Do not add comments to components unless the WHY is genuinely non-obvious
- Do not add the HighLevel Work section card (T4-2) unless Tier 1–3 are fully complete — it is Tier 4
- Do not write a second blog post — that is Tier 4 and requires original content

---

### Definition of done

Implementation is complete when every item in the Acceptance Criteria section of `PORTFOLIO_OVERHAUL_PLAN.md` can be checked off, and `npm run build` passes with no TypeScript or lint errors.

## PROMPT END

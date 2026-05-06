# Blog Plan — ashwinsathian.com/writing

**Date:** May 2026  
**Status:** Plan only — not yet implemented  
**Design authority:** BRAND.md v2.0

---

## 1. Identity & Purpose

The blog is called **Writing** — one word, no explanation needed. It lives at `/writing`.

This is not a tutorial site. Not a newsletter. Not a content marketing channel. It is a place where Ashwin thinks out loud about engineering, architecture, and leadership — deliberately, infrequently, and at length. The standard is: publish only when there is something worth saying. One essay worth reading is worth more than thirty posts optimised for search.

**The writing Ashwin publishes here sounds like:**
- "What I've learned from spending five years on one platform"
- "Why 'boring' technology is a leadership decision, not a technical one"
- "What happens when you let 12 engineers own their own quality"
- "The architectural decisions I'd make differently"

**It does not sound like:**
- "5 things I learned this week"
- "Angular vs React in 2025"
- "How to set up CI/CD (tutorial)"

The reader is assumed to be technical and thoughtful. Sentences can be long. Arguments can be made. Evidence from real work is welcome.

---

## 2. Routes

| Path | Purpose |
|---|---|
| `/writing` | List of all posts, reverse-chronological |
| `/writing/[slug]` | Individual post, rendered from Markdown |

No pagination needed at launch. If the archive eventually exceeds 20–30 posts, lazy loading or a "Load more" pattern is added then — not now.

No category or tag pages at launch. If tags are added to front matter, they can be displayed on posts without requiring their own routes.

---

## 3. Content Model

Posts live as plain Markdown files in `src/content/writing/`. The filename becomes the slug.

```
src/content/writing/
  building-at-scale.md
  on-engineering-leadership.md
  the-case-for-boring-architecture.md
```

### Front matter schema

```yaml
---
title: "The case for boring architecture"
date: "2025-03-10"
description: "Why choosing the obvious technology is one of the most underrated acts of engineering leadership."
tags: ["architecture", "leadership"]   # optional
draft: true                             # optional — drafts excluded from production list
---
```

**Required fields:** `title`, `date`, `description`  
**Optional:** `tags`, `draft`

`draft: true` posts are excluded from the listing page and are not reachable in production. In development they remain accessible by direct URL for review.

**Slug:** derived from the filename. `building-at-scale.md` → `/writing/building-at-scale`.

**Date format:** ISO 8601 (`YYYY-MM-DD`). Displayed as "March 10, 2025" on the site.

---

## 4. File & Directory Structure

```
src/
  content/
    writing/
      .gitkeep          ← ensures directory is committed even when empty
      [slug].md         ← one file per post
  app/
    writing/
      page.tsx          ← /writing list page (server component)
      [slug]/
        page.tsx        ← /writing/[slug] detail page (server component)
  lib/
    writing.ts          ← data layer: read posts, parse front matter, resolve slugs
  components/
    writing/
      PostList.tsx      ← list UI component (client, receives serialised post metadata)
      PostBody.tsx      ← article body renderer (client)
```

All reading of `.md` files happens in server components / the data layer (`lib/writing.ts`). No filesystem access from client components.

---

## 5. Data Layer — `src/lib/writing.ts`

Three exported functions:

```typescript
getAllPosts(): PostMeta[]
// Reads all .md files from src/content/writing/
// Parses front matter with gray-matter
// Filters out drafts in production (process.env.NODE_ENV === 'production')
// Returns array sorted by date descending
// PostMeta: { slug, title, date, description, tags?, draft? }

getPost(slug: string): { meta: PostMeta; content: string }
// Reads a single .md file
// Returns parsed front matter + raw Markdown body string
// Throws if file not found (triggers Next.js notFound())

getPostSlugs(): string[]
// Returns all valid slugs (filenames without extension)
// Used by generateStaticParams
```

### Dependency: `gray-matter`

`gray-matter` is the only new package required. It is the standard library for YAML front matter parsing in the Node ecosystem — small (no transitive deps), well-maintained, used by the official Next.js blog starter.

```
npm install gray-matter
npm install --save-dev @types/gray-matter
```

### Markdown rendering

The Markdown body (everything after the front matter `---`) is rendered using `@uiw/react-markdown-preview`, which is **already installed**. No additional markdown parser is needed.

The blog applies a custom CSS class (`prose`) to the preview container to override `@uiw`'s default dark GitHub styling with brand-appropriate article typography. This CSS is added to `globals.css`.

---

## 6. Page Designs

### 6.1 `/writing` — List page

**Concept:** Follows the same product-page rhythm as the rest of the site. Above the fold: the section identity. Below: a clean typographic post list.

```
[full viewport, bg-canvas]

px-6 md:px-16, pt-[nav height + 80px], pb-24

LABEL: WRITING

Writing.         ← clamp(48px→80px), font-thin, tracking-[-0.04em], label-1

[list, mt-16]
──────────────────────────────────────────────────────── ← border-white/6
Mar 2025
The case for boring architecture.                        ← 17px, font-medium, label-1
Why choosing the obvious technology is one of the        ← 15px, label-3, mt-1
most underrated acts of engineering leadership.
──────────────────────────────────────────────────────── ← border between posts
Jan 2025
On engineering ownership.
...
```

**Each row:**
- Top: date string — 12px, label-4, uppercase-tracking
- Middle: post title — 17px, font-medium, label-1; hover → accent
- Bottom: description — 15px, label-3
- Full row is a `<Link>` — entire area is clickable
- Hover: title color transitions to accent (200ms)

**Empty state** (no posts yet): A single line — `"Nothing published yet."` in label-3. No placeholder cards.

**Post count:** Not shown. The list speaks for itself.

### 6.2 `/writing/[slug]` — Post detail page

**Concept:** A reading experience. Full attention on the prose. No distractions.

```
[bg-canvas]

Header area (pt-[nav + 80px]):
  LABEL: WRITING  ← links back to /writing

  [Post title]    ← clamp(32px→56px), font-extralight (200), tracking-[-0.03em], label-1

  [Date]          ← 13px, label-3, mt-4
  [Read time]     ← "· 6 min read", 13px, label-3 (inline after date)

  [description]   ← 17px, label-2, mt-6, max-w-2xl — the summary, before the article

──────────────────────────────────────────────────────── ← border-white/8, mt-12

Article body (mt-12):
  [Markdown-rendered prose]
  max-width: 680px (65ch equivalent)
  left-aligned, not centered

──────────────────────────────────────────────────────── ← border-white/8, mt-16

Footer:
  ← Writing     ← text link back to /writing list
```

**No:** comments, share buttons, author bio (the whole site is the author bio), related posts, newsletter signup, social proof.

---

## 7. Article Typography (Prose CSS)

The Markdown body needs brand-appropriate article styling. A `.prose` CSS class is added to `globals.css` which overrides `@uiw/react-markdown-preview`'s default styles.

```css
/* Applied to the container wrapping @uiw/react-markdown-preview */
.prose {
  /* Inherit background, remove @uiw's own dark background */
  background: transparent;
  color: var(--color-label-2);
  font-size: 17px;
  line-height: 1.75;
  max-width: 680px;
}

/* Headings */
.prose h1 { font-size: 32px; font-weight: 200; color: var(--color-label-1); ... }
.prose h2 { font-size: 24px; font-weight: 300; color: var(--color-label-1); ... }
.prose h3 { font-size: 19px; font-weight: 400; color: var(--color-label-1); ... }

/* Paragraphs */
.prose p { margin-bottom: 1.5em; color: var(--color-label-2); }

/* Strong / emphasis */
.prose strong { font-weight: 500; color: var(--color-label-1); }
.prose em     { color: var(--color-label-2); }

/* Blockquote — treated as a pull quote */
.prose blockquote {
  border-left: 2px solid var(--color-accent);
  padding-left: 1.5rem;
  color: var(--color-label-2);
  font-size: 19px;
  font-weight: 300;
  font-style: normal;  /* not italic — Apple style */
}

/* Code inline */
.prose code { font-family: var(--font-mono); font-size: 14px; color: var(--color-label-1); background: var(--color-surface-2); padding: 2px 6px; border-radius: 4px; }

/* Code block */
.prose pre { background: var(--color-surface-2); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 24px; overflow-x: auto; }
.prose pre code { background: none; padding: 0; }

/* Lists */
.prose ul, .prose ol { padding-left: 1.5rem; color: var(--color-label-2); }
.prose li { margin-bottom: 0.4em; }

/* Links */
.prose a { color: var(--color-accent); text-decoration: underline; text-underline-offset: 3px; }
.prose a:hover { color: var(--color-accent-hover); }

/* Horizontal rule */
.prose hr { border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 2.5rem 0; }

/* Images */
.prose img { border-radius: 12px; max-width: 100%; }
```

---

## 8. Navigation Integration

Two touch points:

**Navbar:** Add "Writing" as a fourth nav link — but as a standard `<Link href="/writing">` (not a scroll target). On scroll pages (home), it navigates away. On the writing pages, it is the active link.

The nav needs to detect whether it is on the home page (scroll nav) or a sub-route (link nav). Simplest approach: check `usePathname()` — if path starts with `/writing`, render all nav items as `<Link>` elements rather than scroll buttons.

**Home page footer:** No blog link on the home page itself (it would feel promotional). Discovery is through the nav.

**Sitemap:** The `/writing` route and each `/writing/[slug]` route are added to the sitemap generator (`src/app/sitemap.ts`).

---

## 9. SEO & Metadata

Each post generates its own `<Metadata>` via `generateMetadata`:

```typescript
export async function generateMetadata({ params }) {
  const post = getPost(params.slug)
  return {
    title: `${post.meta.title} — Writing`,
    description: post.meta.description,
    openGraph: {
      title: post.meta.title,
      description: post.meta.description,
      type: "article",
      publishedTime: post.meta.date,
    },
  }
}
```

Static generation via `generateStaticParams` — all posts are pre-rendered at build time. `revalidate` is not needed (static posts don't change at runtime; a new deploy is required to publish new posts, which is acceptable for an infrequent personal blog).

---

## 10. Read Time Estimation

Compute estimated read time in the data layer — no new dependency needed:

```typescript
function estimateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).length
  return Math.max(1, Math.round(words / 200)) // 200 wpm
}
```

Displayed on the detail page as "· N min read".

---

## 11. Dependencies Required

| Package | Purpose | Size |
|---|---|---|
| `gray-matter` | Parse YAML front matter from `.md` files | ~9 kB |
| `@types/gray-matter` | TypeScript types (devDependency) | trivial |

No other new dependencies. The markdown renderer (`@uiw/react-markdown-preview`) is already installed. No CMS, no external API, no database.

---

## 12. Implementation Steps (Ordered)

1. `npm install gray-matter` + `npm install -D @types/gray-matter`
2. Create `src/content/writing/.gitkeep`
3. Write `src/lib/writing.ts` (data layer: `getAllPosts`, `getPost`, `getPostSlugs`)
4. Add prose CSS to `src/app/globals.css`
5. Build `src/app/writing/page.tsx` (list page, server component)
6. Build `src/app/writing/[slug]/page.tsx` (detail page, server component + `generateStaticParams` + `generateMetadata`)
7. Build `src/components/writing/PostList.tsx` (list UI)
8. Build `src/components/writing/PostBody.tsx` (article body, wraps @uiw with `.prose` class)
9. Update `src/components/Navbar.tsx` — add "Writing" link, handle scroll-vs-route mode
10. Update `src/app/sitemap.ts` — include writing routes
11. Write one sample post in `src/content/writing/` to validate the full pipeline
12. Commit

---

## 13. What Is Explicitly Not Built

- Comments (no Disqus, no custom system)
- Newsletter signup (not this site's purpose)
- RSS feed (can be added later if there's readership — don't build for hypothetical future)
- Category/tag pages (tags are metadata on posts; no routes until needed)
- Search (overkill for a sparse archive)
- Dark/light toggle (site is dark only, per brand)
- View counts or analytics display
- "Related posts" section
- Author bio at post end (the whole site is the author bio)
- Draft preview via URL in production

All of these can be added when the blog has enough posts to justify them. The rule is: ship the minimum that makes the blog genuinely useful, then let actual usage drive additions.

---

*Ready to implement. Run steps in §12 in order.*

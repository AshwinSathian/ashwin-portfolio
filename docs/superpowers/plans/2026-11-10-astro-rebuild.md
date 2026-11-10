# Astro rebuild, 2026-11-10

Goal: rebuild the Next.js 16 / OpenNext site from scratch on Astro, since the
site is static and already hosted on Cloudflare, then review and improve it
with every available skill.

## Decisions

| Area | Before | After | Why |
|---|---|---|---|
| Framework | Next 16, React 19, OpenNext Worker | Astro 7, zero framework JS | The site is static; the Worker, R2 cache and self-binding were all overhead. |
| Deploy | Worker + R2 + service binding | Workers static assets from `dist/` | No runtime, nothing to cache-invalidate. One tiny Worker serves the Google verification file at its exact `.html` path. |
| Posts | gray-matter + marked + Shiki at runtime-ish | Content collection with a zod schema, Astro Markdown, Shiki | Bad front matter fails the build. |
| OG cards | `/og` route fetching Google Fonts at request time | Satori + resvg at build, local fonts | No third-party call, no Worker. |
| Images | Pre-made WebP in `public/` | `astro:assets` from `src/assets` | Responsive srcset, one source of truth. |
| Transitions | React ViewTransition | CSS `@view-transition` | No JS. |
| Look | v9 Kasavu | v10 Folders (see DESIGN.md) | Brief: dark first, ChatterMeter tone and intent. |

## Discoverability work

llms.txt generated from data (post list cannot drift), llms-full.txt, a `.md`
twin of every post, Content-Signal in robots.txt, entity-linked JSON-LD
(Person, WebSite, ProfilePage, Blog/CollectionPage with ItemList, BlogPosting
`about` its project, SoftwareApplication/SourceCode, BreadcrumbList), visible
Quick answers, author box on posts, sitemap lastmod from front matter.

## Verification

`npm run build` type-checks; `npm test` checks every built page for one h1,
title and description length, canonical, parseable JSON-LD, and no broken
internal links or empty alt text. Preview served with `wrangler dev`.

# v7.0 "Lumen": ground-up rebuild

Date: 2026-10-06
Supersedes: v6.0 "Redline" (DESIGN.md of 2026-09-17) and every earlier identity.

## 1. Brief

Ashwin asked for an adversarial audit of the live site, then a rebuild from
zero, including the design guideline. Fixed constraints from him:

- Black or near-black theme.
- Simple sans-serif type that is not boring.
- Motion that is clearly visible without being loud.
- Desktop and mobile are both first-class.
- Tooling, framework and dependencies may change where that gives a better result.

Decisions he made from options offered:

- Direction: "Lumen" (light as material, large kinetic type, product screenshots as the centrepiece).
- Accent: none. Monochrome.
- Scope: sections may be reordered, merged or cut and connective copy rewritten. Every factual claim stays exactly as it is in the data files and résumé.
- Signature interaction: kinetic hero type. Cursor light, scroll-pinned showcase and command palette were offered and not chosen, so they are out of scope.

Success means: the site reads as designed rather than templated, the work is
visible on the home page, nothing is hidden when JavaScript is absent, and
both 390px and 1440px layouts look composed on purpose.

## 2. Audit findings this rebuild must close

Broken behaviour:

1. `/projects`, `/experience` roles, `/writing` list, home project list and stack chips render at `opacity: 0` in server HTML (framer-motion `initial="hidden"`). Without JS, or before hydration, they are blank.
2. Scroll-gated reveals leave black voids on mobile, in print and in full-page captures.
3. "Case study →" and "Details →" are `opacity-0` until hover, so touch users never see them.
4. Mobile menu has no Escape handling and no focus trap. Toggle is 32px.
5. Home has an `h1` and no other headings. Sections use `aria-labelledby` pointing at `<p>`. Skip link removes its own focus outline.

Layout and hierarchy:

6. Three different left edges on home (64, 208, 272px). Project detail uses a fourth.
7. The `h1` is the person's name. The thesis is 15px muted grey with an orphaned last word.
8. One eyebrow-plus-paragraph block repeats five times with no visual peak.
9. No product imagery on home.
10. `/projects` screenshots are cropped to a 256px strip.
11. Project detail is a wall of bordered cards and tells Booklet's rollback four times.
12. The architecture diagram is boxes joined by a text arrow.
13. Home Experience leads with a three-month role; the five-year one is a grey sentence.
14. Three contact asks sit within 600px.
15. `/writing` repeats its title; tag pills add noise; posts lack syntax highlighting and next/previous links.
16. `/projects` splits nine entries across three differently styled tiers.

Identity:

17. Public Sans is neutral by design.
18. Nearly all copy is `#8B8E94` at 15px.
19. Uppercase 11px eyebrows, pill chips and hairlines are the stock template kit.
20. Accent appears three times on home with no system.
21. Motion is one fade-up reused everywhere.

Voice:

22. Hero is first person, Summary is third person.
23. Stack lists "HTML / CSS" and "Agile & Scrum".

Rot:

24. Favicon is from three identities ago (blue gradient, Inter).
25. DESIGN.md contradicts the code on radius, on Reveal usage and on token names.
26. Dead code: `LABEL_*` constants in the OG route, `@uiw` resets in `.prose`, unused shadow tokens, `tailwind.config.ts`, `react-icons`, a `TODO` in experience data.
27. framer-motion ships for a fade; nine font files load.
28. `overflow-x: hidden` on body and global smooth scrolling.

## 3. Tooling

- Keep Next 16 (App Router), React 19.2, Tailwind v4, OpenNext on Cloudflare Workers. Astro was considered and rejected: the OG image route, hourly GitHub-stats revalidation and the deploy pipeline already work, and a migration changes nothing a visitor can see.
- Remove `framer-motion`, `react-icons`, `tailwind.config.ts`. Move `postcss` to devDependencies.
- Add `shiki` for syntax highlighting, run on the server while rendering posts and code media.
- Enable `experimental.viewTransition` in `next.config.ts` and use React's `<ViewTransition>`.
- Fonts through `next/font/google`: Bricolage Grotesque (variable, `wght` and `wdth` axes), Geist, Geist Mono.

## 4. Design system

### Colour

| Token | Value | Use |
|---|---|---|
| `base` | `#050505` | Page background |
| `surface` | `#0C0C0D` | Panels, code |
| `surface-2` | `#141415` | Raised or pressed surface |
| `line` | `rgb(255 255 255 / 0.08)` | Hairlines |
| `line-strong` | `rgb(255 255 255 / 0.16)` | Hover and focus borders |
| `fg` | `#F5F5F4` | Primary text |
| `fg-2` | `#A6A6A6` | Secondary text |
| `fg-3` | `#8A8A8A` | Metadata |

Computed contrast: `fg` on `base` 18.7:1; `fg-2` on `base` 8.4:1, on `surface-2` 7.6:1;
`fg-3` on `base` 5.9:1, on `surface-2` 5.3:1. All clear WCAG AA for body text.

No hue anywhere in the interface. Product screenshots are the only colour on
the site. Focus ring is `fg` at 2px with a 3px offset.

### Light

- Hero: one large radial white glow at low opacity behind the headline, drifting slowly.
- Panels: 1px inset top highlight (white at 6%), and a radial highlight that brightens on hover and on press.
- Page: fixed SVG-noise grain at about 4% opacity to stop banding in the gradients.

### Type

- Display: Bricolage Grotesque, weights 200 to 800, width 75 to 100. Tight tracking, line-height near 0.95.
- Body and UI: Geist. Base size 17px, line-height 1.6.
- Data: Geist Mono, for dates, counts, versions and code only.

Scale tokens: `display-xl` `clamp(2.75rem, 9.2vw, 8rem)`, `display-l` `clamp(2.25rem, 6vw, 4.75rem)`,
`display-m` `clamp(1.625rem, 3.4vw, 2.75rem)`, `title` 1.25rem, `body` 1.0625rem,
`small` 0.9375rem, `meta` 0.8125rem.

Section labels are sentence-case, `small`, `fg-3`, preceded by a mono index
("01"). No uppercase tracked eyebrows.

### Space and shape

- One container: max 1200px, gutters 20px (mobile), 32px (from 640px), 48px (from 1024px). Every page uses it.
- Section rhythm: 96px mobile, 160px desktop.
- Radius: 10px controls, 16px panels and media. No pills.
- No drop shadows; depth comes from surface steps and light.

### Motion

Easing: `cubic-bezier(0.16, 1, 0.3, 1)` throughout. Durations 200ms (hover), 500ms (reveal), 900ms (hero).

1. Kinetic hero. The headline is split into words on the server. Each word rises through a clip mask with a stagger while its weight runs 200 → 700 and width 75 → 100. Where scroll timelines are supported, the headline then loses weight and fades slightly over the first viewport of scroll.
2. Scroll reveals. CSS only, inside `@supports (animation-timeline: view())`. Elements are fully visible by default; the animation is an enhancement. Media panels scale from 0.94 and unclip; text blocks rise 24px.
3. Page transitions. React `<ViewTransition>`: page content crossfades with a small rise; a project's name and media share a transition name between list and detail.
4. Hover and press. Panel highlight, underline draw on links, arrow nudge. Every `:hover` rule has a matching `:active` or `:focus-visible` rule so touch and keyboard get the same feedback.
5. Reading progress on posts: a 2px bar driven by a scroll timeline.

`prefers-reduced-motion: reduce` turns all of it off and leaves final states.
Firefox (no scroll timelines in stable) gets items 1, 3 and 4 and a static page otherwise.

## 5. Information architecture

Routes are unchanged: `/`, `/projects`, `/projects/[slug]`, `/experience`,
`/writing`, `/writing/[slug]`, `/og`, `robots`, `sitemap`, 404. Metadata and
JSON-LD are kept as they are.

### Navigation

- Desktop: fixed top bar. "Ashwin Sathian" wordmark left; Work, Experience, Writing, Résumé right. Current route marked by an underline, with `aria-current`.
- Mobile: same bar with wordmark and a 48px Menu button. Menu is a native `<dialog>` shown with `showModal()`, styled as a bottom sheet. The platform supplies focus trapping, Escape and inert background.
- Footer: one line with copyright, email, LinkedIn, GitHub, Résumé.

### Home

1. **Hero.** `h1` is the thesis from `HERO.title`. Below: name, role and years, location. Résumé and "See the work" links.
2. **Selected work.** The four featured projects, each a full-width panel: media, name, tagline, three facts, link to the case study. On desktop, media and text alternate sides; on mobile, media first.
3. **More shipped.** The other four as rows with name, category, tagline. Link to `/projects`.
4. **Record.** A first-person paragraph that merges Summary and How I work without adding claims. Four figures that already exist in `experience.ts`: "$1B+ GTV", "5 years founding engineer", "12-person team", "sub-200ms queries". Then all seven roles as compact rows (dates, role, company) and a link to `/experience`.
5. **Writing.** Latest three posts.
6. **Contact.** One band: large line, email, LinkedIn, GitHub.

Every section has an `h2`.

### `/projects`

Header, then all eight projects in one list using the home panel for featured
ones and the row for the rest, then "Also shipped". The headline counts from
`PROJECTS.length`.

### `/projects/[slug]`

- Header: category, name, tagline, links.
- Media at natural aspect ratio, not cropped.
- Two columns on desktop: narrative left; facts, stack and live GitHub stats in a sticky rail right. One column on mobile with the rail content after the header.
- Narrative: Problem, Decision, Outcome when `caseStudy` exists, else `description`. Never both.
- Highlights as a numbered list.
- Decision record as a before/after strip.
- Booklet's architecture as an inline SVG with drawn connectors.
- Next project link.

### `/experience`

Header, then roles grouped by company so Penny Software's three roles read as
one five-year progression. Education. Stack as labelled lines of text, with the
stack data unchanged (see section 9).

### `/writing` and posts

List: date, title, description, reading time, tags as plain mono text. Post:
title, meta, body at 68ch, highlighted code, reading progress, previous and
next posts.

## 6. Copy changes

Allowed: headings, section intros, link labels, and the merged Record
paragraph. The Record paragraph is assembled from sentences already in
`summary.ts` and `HowIWork.tsx`, converted to first person.

Not allowed: changing any number, date, title, employer, technology or project
fact. The `TODO` about a Vendor Pre-Qualification adoption figure is removed
from the data file and recorded in section 9.

Copy follows the house rule against AI-writing tells.

## 7. Files

Deleted: `Reveal.tsx`, `lib/motion.ts`, `HomeProjects.tsx`, `HomeExperience.tsx`,
`HomeSkills.tsx`, `HowIWork.tsx`, `Summary.tsx`, `ContactBand.tsx`, `Projects.tsx`,
`ExperienceContent.tsx`, `Skills.tsx`, `BackToProjectsButton.tsx`,
`projects/[slug]/loading.tsx`, `tailwind.config.ts`, `data/summary.ts`.

New or rewritten: `globals.css`, `layout.tsx`, `Navbar.tsx`, `Footer.tsx`,
`Hero.tsx`, `KineticHeading.tsx`, `ProjectPanel.tsx`, `ProjectRow.tsx`,
`ProjectMedia.tsx`, `CodeBlock.tsx`, `Section.tsx`, `ArrowLink.tsx`,
`DecisionRecord.tsx`, `ArchitectureDiagram.tsx`, `PostList.tsx`, `PostBody.tsx`,
every `page.tsx`, `not-found.tsx`, `og/route.tsx`, `favicon.svg`,
`apple-touch-icon.png`, `DESIGN.md`.

Data files keep their content. `projects.ts` gains `width` and `height` on
screenshot media so images render at natural aspect ratio without layout shift.

## 8. Verification

- `npm run build` and `npm run lint` pass.
- Playwright captures of all eight route types at 390, 768 and 1440px, read by eye.
- JS-disabled capture of every route shows full content.
- `prefers-reduced-motion` capture shows final states.
- No horizontal overflow at 320px.
- Keyboard walk: skip link, nav, menu dialog open and close, every link reachable with a visible ring.
- Heading outline has one `h1` per page and no skipped levels.
- Facts diff: `git diff` on `src/app/data` shows no changed claim.

Then commit, push, `npm run deploy`, and check production.

## 9. Open items for Ashwin

- A real adoption figure for the Vendor Pre-Qualification System, if he wants one shown.
- Whether "HTML / CSS" and "Agile & Scrum" stay in the stack list.

# Site Overhaul Plan — ashwinsathian.com

**Version:** 1.0  
**Date:** May 2026  
**Based on:** BRAND.md v1.0  
**Authority:** Full creative latitude — nothing is protected by default

---

## 1. Executive Summary

The current portfolio is technically competent and content-rich, but it over-explains itself. The dark galaxy aesthetic, breathing background, purple glow effects, and chip-heavy sections are doing work that the content should be doing. The site talks loudly to get attention when it should be quiet and certain.

This overhaul transforms ashwinsathian.com from a developer portfolio into something closer to an Apple product page for a person: pure black canvas, thin typographic headlines, restrained use of color, and content that is so precisely stated it doesn't need decoration to be impressive.

Every decision in this plan is traceable to the brand principles in BRAND.md. When a section is simplified, it's because deference demands it. When an animation is removed, it's because it was decorative rather than functional.

---

## 2. Vision Statement

**"An Apple product page for an engineering leader."**

When a recruiter or CTO lands on this site, they should feel the same quiet authority they feel when they open apple.com on a device launch day: everything is exactly where it should be, nothing is competing for attention, and the content — the actual achievements — are the loudest thing on the page.

The site communicates: *I don't need to impress you with effects. The work speaks.*

---

## 3. What Changes, What Goes, What Stays, What's New

### REMOVED ENTIRELY
- `BreathingBackground.tsx` — animated radial gradient. Decorative idle animation. Gone.
- The entire purple accent (`#8B5CF6`, `#7C3AED`, `#A78BFA`). Replaced by Apple blue.
- All `box-shadow` glow effects (purple glows on cards, buttons, experience markers).
- Parallax pointer-tracking on the hero section.
- Hero metrics cards (the 3 small stat boxes in the hero). Metrics relocate to a cleaner location.
- PrimeReact as the UI component library — every component rebuilt from scratch.
- The "pipe separator" section titling convention (`About | Purpose & Proof`).
- Hover tooltips on skills — replaced by a cleaner capability narrative.
- The Lara Dark Indigo PrimeReact theme import.
- Space Grotesk / Manrope font references. Inter only.
- All `shadow-glass`, `shadow-soft`, `shadow-glow` tokens.

### KEPT / PRESERVED
- Next.js App Router architecture — no changes to routing.
- Framer Motion — kept, but retokened (see motion system).
- GitHub API integration — preserved, endpoint unchanged.
- All content data (experience, skills, education, about, highlights, contact).
- `ScrollProgress.tsx` — kept but restyled (see §6.1).
- Section anchor IDs for navigation.
- The single-page structure.
- `Markdown.tsx` project detail pages — kept, restyled.
- SEO: metadata, sitemap, robots, OG image generation — all preserved.
- ISR revalidation strategy.

### REDESIGNED / TRANSFORMED
- Every section — reskinned to match the new brand system.
- Tailwind config — completely replaced with new design tokens.
- `globals.css` — rewritten with new CSS custom properties.
- Animation presets in `lib/motion.ts` — retokened.
- `ProjectCard.tsx` — rebuilt.
- `Experience.tsx` timeline — visual redesign.
- `Contact.tsx` — transformed.
- `Footer.tsx` — simplified.

### NEW
- **Navigation bar** — currently absent; added as sticky top nav.
- **"Status" indicator** in the hero — a small badge showing current professional status.
- **Impact section redesign** — metrics become large typographic display numbers, no modals.
- **Capabilities section** — replaces Skills with a cleaner prose+list layout.
- **Custom CSS custom properties** replacing Tailwind extended colors.

---

## 4. Section-by-Section Redesign Plan

---

### 4.0 Navigation Bar (NEW)

**Status:** Does not exist today. Must be created.

**Component:** `Navbar.tsx`

**Layout:**
```
[Monogram: "AS"]                        [Work] [Impact] [About] [Contact]  [Resume ↓]
```

**Visual spec:**
- Height: 52px (matches macOS menu bar height — intentional reference)
- Background: `rgba(0,0,0,0.80)` with `backdrop-filter: blur(20px)` — Apple's Nav Material
- Border-bottom: `1px solid var(--separator)`
- Position: `fixed top-0`, `z-index: 100`
- Scroll behavior: always visible, no hide-on-scroll (this site is short; don't complicate it)

**Left: Monogram**
- Text: "AS"
- Style: 17px, weight 600, `--label-1`
- Behavior: smooth scroll to `#hero` on click

**Center/Right: Nav Links**
- Items: "Work", "Impact", "About", "Contact" — 4 items max
- Style: 14px, weight 400, `--label-2`; hover → `--label-1`
- Active section highlighting via `IntersectionObserver` — active link becomes `--accent`
- On mobile (< 768px): collapse to hamburger icon
- Mobile menu: full-screen overlay, `--canvas` background, large stacked links

**Right CTA: "Resume"**
- Secondary button style (see BRAND.md §6.2)
- Opens `Resume.pdf` in new tab

---

### 4.1 Hero Section

**Status:** Complete rebuild.

**File:** `src/components/Hero.tsx`

**Current problems:**
- Breathing background is too theatrical
- Parallax effect adds motion without meaning
- Three metric cards in the hero clutter the first impression
- The tagline "I help teams ship complex SaaS faster, cleaner, and saner" is first-person marketing speak
- Too many elements competing for attention simultaneously

**New structure:**

```
┌────────────────────────────────────────────────────────┐
│                                                        │
│  [LABEL: ENGINEERING LEADER]                           │
│                                                        │
│  Engineering.                   ← Display, weight 200  │
│  At scale.                      ← Display, weight 200  │
│                                                        │
│  Ashwin Sathian · Bangalore / Dubai · Open to work    │
│                                                        │
│  ─────────────────────────────────────────────────    │
│                                                        │
│  $1B+ GTV    ·    12 engineers    ·    <200ms          │
│                                                        │
│  [View Work]                [Download Resume]          │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Detail specs:**

*Eyebrow label:*
- "ENGINEERING LEADER" — LABEL style (12px, 500, 0.08em), `--label-3`, rendered above the headline

*Main headline:*
- "Engineering." on line 1, "At scale." on line 2
- Display: 80px desktop / 52px tablet / 36px mobile
- Weight: 200 (ExtraLight)
- Tracking: -0.040em
- Color: `--label-1`
- Leading: 1.05

*Identity line:*
- "Ashwin Sathian · Bangalore / Dubai · Open to work"
- Body Large: 17px, weight 400, `--label-3`
- The "·" separators are `--label-4`
- "Open to work" — only if actively seeking; otherwise replace with LinkedIn handle

*Horizontal rule:*
- `1px solid var(--separator)`
- `max-width: 480px`, left-aligned
- Creates a visual pause before the metrics

*Metrics bar:*
- "$1B+ GTV    ·    12 engineers    ·    <200ms"
- 17px, weight 500, `--label-2`
- The numbers are `--label-1`
- Plain text, not cards

*CTAs:*
- "View Work" → Primary button style → smooth scroll to `#experience`
- "Download Resume" → Secondary button style → `/Resume.pdf`

**Background:**
- Pure `--canvas` (#000000)
- One subtle centered radial gradient: `radial-gradient(ellipse 80% 60% at 50% 70%, rgba(41,151,255,0.04), transparent)`
- Maximum opacity: 0.04. It should be invisible on first glance and only barely perceptible on close inspection.
- No animation on the background.

**Animation:**
- All hero elements fade in sequentially on mount
- Opacity 0 → 1, 300ms `--ease-decelerate`
- Stagger: eyebrow → headline → identity → rule → metrics → CTAs (60ms between each)
- No Y movement, no parallax

**Mobile:**
- Full viewport height (`100svh`)
- Headline reduces to 36px
- Metrics stack vertically if needed
- CTAs stack vertically

---

### 4.2 About Section

**Status:** Significant redesign.

**File:** `src/components/About.tsx`

**Current problems:**
- "About | Purpose & Proof" title format is heavy-handed
- Focus area chips feel like a resumé keyword list
- Opening with "I'm an engineering leader who..." is too direct and corporate

**New structure:**

```
[LABEL: ABOUT]

Complex systems.          ← Headline 1, weight 200
Calm delivery.

[Pull-quote bar: 2px accent left border]
"7 years building SaaS at scale. $1B+ GTV. 12 engineers.
The through-line: calm architecture and clear ownership."

[Body paragraph 1]
[Body paragraph 2]
```

**Detail specs:**

*Section headline:*
- "Complex systems. Calm delivery."
- Headline 1: 56px, weight 200, -0.030em
- Or consider: "Built for scale." as a single line

*Pull-quote:*
- Background: `--surface-1`
- Left border: 3px solid `--accent`
- Padding: 24px 32px
- Text: 17px, weight 400, `--label-2`
- No quotation marks (they're decorative noise)

*Body paragraphs — Rewritten copy:*

Paragraph 1:
> "Engineering leadership that makes complex SaaS feel predictable. I work across architecture, delivery, and team design — keeping product, engineering, and operations aligned without the usual friction."

Paragraph 2:
> "Seven years building Angular, Next.js, and NestJS platforms that handle millions of procurement records. My approach: clean module boundaries, multi-tenant guardrails, and CI/CD pipelines that make releases boring — in the best way."

*Focus area chips → REMOVED.*
The prose replaces them. The information is in the copy, not in separate visual elements.

**Layout:**
- Two-column on desktop: large pull-quote left (60%), metadata right (40%)
- Or single-column centered text block — explore during implementation
- Section background: `--surface-1`

---

### 4.3 Impact Section (formerly Highlights)

**Status:** Complete architectural redesign.

**File:** `src/components/Impact.tsx` (renamed from Highlights)

**Current problems:**
- Cards with hover → modal pattern hides the most important information behind an interaction
- Colored icon headers are decorative noise
- Card format dilutes the impact of the metrics (no pun intended)
- "Highlights" as a section name is generic

**New structure:**

```
[LABEL: IMPACT]

By the numbers.           ← Headline 1

┌─────────────┬─────────────┬─────────────┬─────────────┐
│   $1B+      │  1.5×       │  <200ms     │   12        │
│ Procurement │  Faster     │  Critical   │ Engineers   │
│ GTV         │  Releases   │  Queries    │ Mentored    │
└─────────────┴─────────────┴─────────────┴─────────────┘

[Below the 4 metrics: 4 compact prose statements, one per metric]
```

**Detail specs:**

*Section headline:*
- "By the numbers." — Headline 1, weight 200, --label-1
- Eyebrow: "IMPACT" in LABEL style

*Metric display:*
- 4 columns on desktop, 2×2 on tablet, stacked on mobile
- Each metric:
  - Number: 56px, weight 200, `--metric-positive` (#30D158)
  - Label line 1 (qualifier): 13px, weight 400, `--label-3` (e.g., "Procurement")
  - Label line 2 (noun): 13px, weight 500, `--label-2` (e.g., "GTV")
  - Separated by thin horizontal rule from the supporting statement below

*Supporting statements (below the 4-column grid):*
- 4 items in 2×2 grid
- Each: Title-2 bold label + one Body sentence
  - "$1B+ GTV — Architected a modular, multi-tenant procurement backbone handling millions of records without downtime."
  - "1.5× Release Cadence — Streamlined CI/CD pipelines so squads ship predictably and confidently."
  - "<200ms — Codified performance patterns that keep critical interactions snappy as data scales."
  - "12 Engineers — Built an inclusive growth culture that turns ambitious roadmaps into calm execution."
- This replaces the modal dialog pattern entirely

*No modals. No click interactions. All information visible.*

**Background:** `--canvas`

---

### 4.4 Work / Projects Section (formerly Top Projects)

**Status:** Reskin + structural cleanup.

**File:** `src/components/Work.tsx` (renamed from TopProjects)

**Current problems:**
- Section name "Top Projects" feels like a list, not a portfolio
- Cards have gradient/glass styling that conflicts with new brand
- Too many colored tag chips per card

**New structure:**

```
[LABEL: WORK]

Open source.              ← Headline 1, weight 200

┌──────────────────────────────────────────────────────────┐
│  ngx-runtime-i18n                     TypeScript  ★ 12   │
│  Runtime i18n for Angular apps without full rebuilds.    │
│  angular  library  i18n               [View Project →]   │
├──────────────────────────────────────────────────────────┤
│  API Sandbox                          TypeScript  ★ 8    │
│  Interactive HTTP request builder and testing tool.      │
│  api  testing  developer-tools        [View Project →]   │
├──────────────────────────────────────────────────────────┤
│  GitHub Issues Analyzer               TypeScript  ★ 5    │
│  Aggregate and analyze GitHub issue patterns visually.   │
│  github  analysis  visualization      [View Project →]   │
└──────────────────────────────────────────────────────────┘
```

**Detail specs:**

*Layout:*
- Vertical list of project cards (not a grid) — cleaner on all viewports
- Each card: `--surface-2` background, `1px solid --separator` border, 16px radius
- Padding: 28px 32px
- Hover: border → `--separator-strong`

*Card anatomy (horizontal):*
- Left: Project name (Title 1, weight 500, `--label-1`) + description (Body, `--label-2`)
- Right: Language badge + star count (Body Small, `--label-3`)
- Bottom left: Topic tags as pill chips
- Bottom right: "View Project →" ghost button

*Topic tags:*
- Max 3 visible
- Chip style from BRAND.md §6.3 — no color
- Arrow "→" is `--accent` colored — the only color on the card besides the text

*Link behavior:* Navigates to `/projects/[owner]/[repo]` (existing detail page, preserved)

**Background:** `--surface-1`

---

### 4.5 Capabilities Section (formerly Skills)

**Status:** Complete conceptual redesign.

**File:** `src/components/Capabilities.tsx` (renamed from Skills)

**Current problems:**
- Icon chip grid for 24+ technologies is visually noisy
- Hover tooltips hide context that should be visible
- Section feels like a keyword-stuffed ATS list, not an engineer's voice
- Groups are split into too many sub-categories

**New structure:**

```
[LABEL: CAPABILITIES]

Full-stack.               ← Headline 1, weight 200
End to end.

[A short prose paragraph establishing depth]

┌─────────────────────────────┬────────────────────────────┐
│  Frontend                   │  Cloud & DevOps            │
│  Angular · React · Next.js  │  AWS · GCP · Docker        │
│                             │  GitHub Actions            │
│  Backend                    │                            │
│  Node.js · NestJS · Express │  Languages                 │
│                             │  TypeScript · Python       │
│  Data                       │  JavaScript · HTML/CSS     │
│  MongoDB · DynamoDB         │                            │
└─────────────────────────────┴────────────────────────────┘
```

**Detail specs:**

*Prose paragraph (NEW):*
- "Angular and Next.js on the frontend. NestJS and Node.js on the backend. MongoDB and DynamoDB for data. AWS for cloud infrastructure. TypeScript throughout. The goal is always the same: systems that stay fast, stay maintainable, and don't surprise the team at 2am."
- Body Large (17px), `--label-2`, max-width 60ch

*Two-column skill list:*
- Left column: Frontend, Backend, Data — 3 groups
- Right column: Cloud & DevOps, Languages, Productivity & QA — 3 groups
- Each group: Title-2 label (22px, weight 500, `--label-1`) + comma-separated tech list (Body, `--label-3`)
- No icons. No chips. No hover state.
- Clean typographic list.

**Background:** `--canvas`

---

### 4.6 Experience Section

**Status:** Visual redesign, content preserved.

**File:** `src/components/Experience.tsx`

**Current problems:**
- Timeline styling uses PrimeReact's Timeline component (must be replaced)
- Alternating left-right layout on desktop is harder to scan than a standard left-aligned timeline
- Experience markers have a glow animation on scroll (decorative, removed)
- Too much visual weight on each role card

**New structure:**

```
[LABEL: EXPERIENCE]

The story.                ← Headline 1, weight 200

│  Lead Engineer                         Jan 2024 – Aug 2025
●  Penny Software
│
│  Directed Angular + NestJS + MongoDB architecture for $1B+
│  procurement platform. Standardized multi-tenant RBAC.
│  Mentored 12-person squad across frontend, backend, QA.
│
│  [Metric badge: $1B+ GTV · <200ms latency]
│
│  ─────────────────────────────────────────────────────
│
│  Product Specialist                    Apr 2022 – Dec 2023
●  Penny Software
...
```

**Detail specs:**

*Timeline visual:*
- Left edge: 1px vertical line, `--separator`
- Nodes: 6px circle, `--accent` fill, centered on line
- Left-aligned on ALL viewports (no alternating). Desktop: line at left, content indented 32px.

*Role header:*
- Company name: Title 1 (22px), weight 500, `--label-1`
- Role title: Body Large (17px), weight 400, `--label-2`
- Date range: right-aligned, 13px, weight 400, `--label-3`
- All three on the same horizontal row (flex, space-between)

*Body:*
- 2–3 bullets max per role (content pruned from current 4–5)
- Body (15px), `--label-2`
- Simple `–` dash as bullet marker, not icons

*Metric badge per role (simplified from current):*
- Inline text: 13px, weight 500, `--metric-positive` (for the key number) + `--label-3` (for context)
- No chip/tag styling — just styled inline text

*Transitions between roles:*
- `--space-7` (48px) gap
- Thin horizontal rule `--separator` as separator between major career transitions (not all roles)

**Background:** `--surface-1`

---

### 4.7 Education Section

**Status:** Significantly simplified.

**File:** `src/components/Education.tsx`

**Current problems:**
- Full card with icon, title, and multiple lines for what is a single degree
- Over-engineered for the information density

**New design:**

Single clean line — no card needed:

```
B.Tech. Electronics & Communication Engineering
National Institute of Technology Calicut  ·  2014 – 2018
```

*OR*, if section needs visual weight to fill the page rhythm:

```
[LABEL: EDUCATION]

┌──────────────────────────────────────────────────────────┐
│  National Institute of Technology Calicut                │
│  B.Tech. · Electronics & Communication Engineering       │
│  2014 – 2018                                             │
└──────────────────────────────────────────────────────────┘
```

*Detail specs:*
- Institution: Title 1 (22px), weight 500, `--label-1`
- Degree: Body Large (17px), weight 400, `--label-2`
- Years: 15px, weight 400, `--label-3`
- Card: `--surface-2`, 1px `--separator` border, 16px radius
- No degree icon, no decorative elements

**Background:** `--canvas`

---

### 4.8 Contact Section

**Status:** Significant redesign.

**File:** `src/components/Contact.tsx`

**Current problems:**
- "Contact | Let's build something remarkable." is trying too hard
- Button grid for email/phone/LinkedIn/GitHub is appropriate but needs visual simplification
- The section doesn't have enough visual presence for the final CTA

**New structure:**

```
[LABEL: CONTACT]

Let's talk.               ← Display, weight 200, 80px

Open to engineering leadership roles.
Reach out directly.

ashwinsathyan19@gmail.com           ← Large text link, --accent

[LinkedIn]  [GitHub]  [+971 58 500 4573]   ← Secondary text links
```

**Detail specs:**

*Section headline:*
- "Let's talk." — Display size (80px), weight 200, `--label-1`
- Centered

*Sub-copy:*
- "Open to engineering leadership roles. Reach out directly."
- Body Large, `--label-3`, centered
- Two sentences on two lines (intentional line break)

*Email as primary CTA:*
- Renders as a large plain `<a>` tag (not a button)
- Size: 28px (Headline 3), weight 400, color: `--accent`
- Hover: underline + `--accent-hover`
- This is the primary conversion element — make it visually dominant

*Secondary links:*
- LinkedIn, GitHub, Phone
- Body (15px), weight 400, `--label-2`
- Arranged horizontally with `·` separators
- Hover: `--label-1`
- No buttons, no icons in the primary view (icons optional as tiny 16px inline)

**Background:** `--surface-1`, centered content, full-section height

---

### 4.9 Footer

**Status:** Stripped down to essentials.

**File:** `src/components/Footer.tsx`

**New design:**

```
© 2026 Ashwin Sathian                         Resume ↓
```

Single row. 14px, `--label-4`. "Resume ↓" is a ghost text link to `/Resume.pdf`.

No decorative borders, no icons, no additional copy.

---

### 4.10 Project Detail Pages (`/projects/[owner]/[repo]`)

**Status:** Light reskin.

**Files:** `src/app/projects/[owner]/[repo]/page.tsx`, `Markdown.tsx`, `BackToProjectsButton.tsx`

**Changes:**
- Page background: `--canvas`
- Markdown styles: Override default PrimeReact markdown theme with brand tokens
- Back button: Ghost text link "← Work" using brand styles, no PrimeReact Button
- Loading skeleton: Match `--surface-2` color, remove purple shimmer
- Error page: Clean `--label-2` error message, brand-styled retry button

---

## 5. Technical Implementation Plan

### 5.1 Remove PrimeReact

PrimeReact imports exist in:
- `PrimeProvider.tsx` — entire component removed
- `layout.tsx` — remove provider wrapper and theme CSS import
- `Highlights.tsx` (Dialog, Card) — rebuild with custom modal
- `Skills.tsx` (Chip) — rebuild with plain div
- `Experience.tsx` (Timeline) — rebuild with CSS-only timeline
- `Contact.tsx` (Button) — rebuild with `<a>` or `<button>`
- `Footer.tsx` (Button) — rebuild
- `TopProjects.tsx` (Card, Tag, Skeleton) — rebuild
- `ProjectCard.tsx` (Card, Chip, Tag) — rebuild

**Replacement strategy:** Custom components + Tailwind. No new component library. If a modal is needed, use Radix UI's `Dialog` primitive (headless, no styling).

**`package.json` removals:**
- `primereact`
- `primeicons`
- `@primereact/themes`
- `primeicons` CSS import

### 5.2 Tailwind Config Replacement

Replace current `tailwind.config.ts` extended colors with the new design token set.

**New token map:**
```typescript
colors: {
  canvas:     '#000000',
  surface: {
    1: '#111111',
    2: '#1C1C1E',
    3: '#2C2C2E',
    4: '#3A3A3C',
  },
  label: {
    1: '#F5F5F7',
    2: '#A1A1A6',
    3: '#6E6E73',
    4: '#48484A',
  },
  accent:     '#2997FF',
  'accent-hover': '#147CE5',
  metric:     '#30D158',
}
```

**New shadow tokens:**
```typescript
boxShadow: {
  card: '0 0 0 1px rgba(255,255,255,0.08)',
  'card-hover': '0 0 0 1px rgba(255,255,255,0.15)',
  modal: '0 24px 80px rgba(0,0,0,0.8)',
}
```

Remove: `shadow-soft`, `shadow-glass`, `shadow-glow`, `bg-primary`, `bg-soft`, `bg-glass`, `text-primary`, `text-secondary`, `text-muted`, `accent-*` (purple), `accent-warm`, `outline-color`.

### 5.3 globals.css Rewrite

Replace the current `globals.css` with:
- CSS custom property declarations matching BRAND.md tokens
- Inter font import from Google Fonts (weights 200, 300, 400, 500, 600)
- Base styles: `background: var(--canvas); color: var(--label-1); font-family: var(--font-sans)`
- Remove PrimeReact CSS imports
- Remove Space Grotesk / Manrope font imports
- Maintain Tailwind directives (`@tailwind base; components; utilities`)

### 5.4 Motion Rewrite — `lib/motion.ts`

```typescript
// Replace all current presets with:

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.3, ease: [0, 0, 0.2, 1] }
}

export const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.06, delayChildren: 0.05 }
  }
}

export const springHover = {
  whileHover: { scale: 1.02 },
  transition: { type: 'spring', stiffness: 300, damping: 30 }
}

// Remove: fadeInUp (no Y offset animations)
// Remove: 600ms durations
// Remove: 80ms stagger
```

### 5.5 New Component Inventory

| New Component | Replaces | Notes |
|---|---|---|
| `Navbar.tsx` | (none) | New |
| `Impact.tsx` | `Highlights.tsx` | Metrics grid, no modal |
| `Work.tsx` | `TopProjects.tsx` | List layout, new card |
| `Capabilities.tsx` | `Skills.tsx` | Prose + clean list |
| `ProjectCard.tsx` | (rebuild existing) | Minimal style |
| `Modal.tsx` | PrimeReact Dialog | Radix primitive |

### 5.6 Font Loading

```html
<!-- In layout.tsx <head> -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600&display=swap"
  rel="stylesheet"
/>
```

**OR** use Next.js `next/font/google` for optimal loading:
```typescript
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'], weight: ['200','300','400','500','600'] })
```

### 5.7 OG Image Update

Update `src/app/og/route.tsx` to use:
- `--canvas` background (pure black)
- `--label-1` text
- New color tokens
- Inter font (200 weight for name, 400 for title)
- Remove purple/gradient elements

---

## 6. Asset Requirements

### 6.1 ScrollProgress

Keep `ScrollProgress.tsx` but restyle:
- Line color: `--accent` (#2997FF)
- Reduce height from current to 2px
- Remove glow effect

### 6.2 Favicon

Update `favicon.svg`:
- Black background square with "AS" monogram in white, Inter weight 600
- Or: Pure `A` lettermark

### 6.3 OG Image

The static `og-2026.png` should be regenerated after implementation via the `/og` route, OR updated to match the new brand.

### 6.4 Resume PDF

No changes needed to `Resume.pdf` content.

---

## 7. Copy Revisions

All section headlines and major copy strings need updating. The data files in `src/app/data/` contain the source content. Required revisions per file:

### `hero.ts`
```
headline:   "Engineering.\nAt scale."
subline:    "Ashwin Sathian · Engineering Leader · SaaS Architecture"
metrics:    "$1B+ GTV  ·  12 engineers  ·  <200ms"
cta_primary:   "View Work"
cta_secondary: "Download Resume"
```

### `about.ts`
- Remove the "I'm an engineering leader who..." opening
- New opening: "Complex systems. Calm delivery."
- Paragraph 1 rewrite (see §4.2)
- Remove focus area chips array

### `highlights.ts`
- Rename file reference to `impact.ts`
- Remove `detail` fields (no modal needed)
- Ensure `metric`, `title`, `summary` fields map to new Impact section

### `skills.ts`
- Consolidate 6 groups into 2 column-groups: `frontend_backend_data`, `cloud_devops_languages`
- Remove icon references
- Remove note/tooltip fields

### `site.ts`
- Add `status: "Open to engineering leadership roles"` field

---

## 8. Implementation Phases

Recommended execution order to minimize breaking changes:

### Phase 1 — Foundation (No visible changes until complete)
1. Install Inter font (next/font)
2. Rewrite `tailwind.config.ts` with new tokens
3. Rewrite `globals.css` (new custom properties, remove PrimeReact imports)
4. Rewrite `lib/motion.ts` with new presets
5. Remove PrimeReact from `package.json`, `layout.tsx`, `PrimeProvider.tsx`
6. Update data files with new copy

### Phase 2 — Global Components
7. Build `Navbar.tsx`
8. Restyle `ScrollProgress.tsx`
9. Remove `BreathingBackground.tsx`, update `layout.tsx`

### Phase 3 — Hero & Above-Fold
10. Rebuild `Hero.tsx` (highest priority — first impression)
11. Rebuild `About.tsx`

### Phase 4 — Content Sections
12. Build `Impact.tsx` (from Highlights)
13. Build `Work.tsx` + `ProjectCard.tsx` (from TopProjects)
14. Build `Capabilities.tsx` (from Skills)
15. Rebuild `Experience.tsx`
16. Rebuild `Education.tsx`

### Phase 5 — Footer & Detail Pages
17. Rebuild `Contact.tsx`
18. Rebuild `Footer.tsx`
19. Restyle project detail pages
20. Update OG image route

### Phase 6 — QA & Polish
21. Cross-browser / cross-device testing
22. Accessibility audit (contrast ratios against new palette)
23. Performance audit (Lighthouse)
24. `prefers-reduced-motion` verification
25. SEO metadata update (OG image, description if changed)

---

## 9. Success Criteria

The overhaul is complete when:

- [ ] No PrimeReact code remains anywhere in the codebase
- [ ] No purple (`#8B5CF6` family) color appears in any file
- [ ] `BreathingBackground.tsx` is deleted
- [ ] Hero has no parallax, no metrics cards, no tagline — only the new typographic layout
- [ ] Navigation bar is present, sticky, and working on all viewports
- [ ] All section titles match the new naming convention (Impact, Work, Capabilities)
- [ ] Lighthouse Performance score ≥ 90
- [ ] Lighthouse Accessibility score ≥ 95
- [ ] All animations respect `prefers-reduced-motion`
- [ ] No animation duration exceeds 500ms
- [ ] Inter 200 weight renders correctly on all target browsers
- [ ] The site reads as the same Ashwin Sathian, with the same story — just told with more clarity

---

*This document is a plan, not a spec. Implementation may require tactical decisions that deviate from these instructions. When in doubt, return to the BRAND.md principles: Clarity, Deference, Depth.*

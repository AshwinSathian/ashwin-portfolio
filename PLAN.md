# Execution Plan — v2.0 Product Page Overhaul

**Based on:** BRAND.md v2.0  
**Scope:** Transform the current apple.com-editorial site into an Apple product page experience

---

## What Changes

### Added
- `Manifesto.tsx` — new full-screen word-reveal statement section
- Light section variant in About (single `#FBFBFD` section)
- Weight 100 (Thin) in Inter font load
- `--light-*` CSS tokens for the light section
- Scroll indicator component (subtle animated hint)
- Metric number update: white (`#F5F5F7`) instead of green

### Changed
- `Hero.tsx` — full-screen, name as product name only, scroll indicator
- `Impact.tsx` — full-screen 3-column isolated metrics, Feature size type
- `About.tsx` — light section, two-column, personal philosophy copy
- `Work.tsx` — "Built to last." headline, show professional platform work + OSS
- `Capabilities.tsx` — "The stack." minimal
- `Experience.tsx` — "The career." narrative style
- `Contact.tsx` — remove all job-seeking language, personal only
- `Navbar.tsx` — minor: update "View Work" → "Explore" link label behavior
- `globals.css` — add `--light-*` tokens, update `--metric` to white
- `layout.tsx` — add weight 100 to Inter
- `lib/motion.ts` — add `fadeInUp` variant (opacity + 24px Y)
- All data files — rewrite copy

### Removed / Collapsed
- The section `id="impact"` nav link "Impact" — metrics stand alone, not a nav destination
- Job-seeking copy everywhere

---

## Section-by-Section Plan

### 1. `Hero.tsx`

**Concept:** The name is the product. Full stop.

**Layout:**
```
[Full screen, black, flex column justify-between]

  Top area (grows):
    [empty — let name be the first thing eyes find]

  Middle (flex-1 flex items-end or items-center):
    Ashwin Sathian.   ← Feature/Display size, weight 100, left-aligned
    Engineer.          ← 32px, weight 300, left-aligned, 16px below name

  Bottom:
    [Scroll indicator: animated vertical line + "Scroll" label, centered]
```

**Copy:**
```
Ashwin Sathian.
Engineer.
```

No eyebrow. No subtitle. No metrics. No CTAs in the primary viewport. The name and title ARE the hero. Everything else is revealed by scrolling.

**Motion:** Both lines fade+rise on mount with 200ms stagger.

---

### 2. `Manifesto.tsx` (NEW)

**Concept:** A single truth about the work. Apple's "iPhone. Forged in titanium." equivalent.

**Layout:**
```
[Full screen, black, flex items-center justify-center]

  max-w-4xl centered:
    "The systems I've built      ← word-by-word reveal
    handle $1B+ in transactions.
    Calm under load.
    Precise by design."
```

**Size:** 40px desktop, 28px mobile. Weight 300. Centered.

**Motion:** Word-by-word fade. 60ms stagger. Triggers on section entering viewport. The effect makes the statement feel like it's being thought out in real time.

---

### 3. `Impact.tsx`

**Concept:** Three numbers. Full screen. Nothing else competes.

**Layout:**
```
[Full screen, black, flex items-center]

  Three columns (dividers between them — 1px white/8):

  Col 1:              Col 2:              Col 3:
  $1B+                <200ms              12
  ───────             ───────             ───────
  Procurement GTV     Query latency       Engineers
```

**Type:** `clamp(80px, 12vw, 120px)`, weight 100, `--label-1` (white). No green.

**Motion:** Each number fades in with 100ms stagger as section enters. The numbers don't animate (no count-up) — they appear, complete, as facts.

---

### 4. `About.tsx`

**Concept:** The ONE light section. Visual punctuation. Personal voice.

**Layout:**
```
[Full screen, bg #FBFBFD, flex items-center]

  Two columns (60/40 split on desktop, stacked on mobile):

  Left (headline):
    Seven years
    building things
    that matter.     ← 56px, weight 200, --light-text-1

  Right (body):
    [paragraph 1]    ← 17px, weight 400, --light-text-2
    [paragraph 2]
```

**Copy:**
```
Headline: "Seven years building things that matter."

Para 1: "I spent seven years at one company — growing from the engineer who shipped features to the one who designed the systems that shipped them. That depth is rare in this industry. I'm proud of it."

Para 2: "My work lives at the intersection of architecture and execution. I care about the systems underneath the product as much as the product itself. Clean boundaries, honest tradeoffs, teams that understand why — not just what."
```

**Note:** This is the only section with `--light-bg` (#FBFBFD) background and `--light-text-1` (#1D1D1F) text.

---

### 5. `Work.tsx`

**Concept:** "Built to last." — professional platform + open source.

**Layout:**
```
[Natural height, dark (--surface-1), generous padding]

LABEL: WORK
H1: "Built to last."

[Platform card — the Penny work]:
  "The procurement platform."
  Description of what was built at scale
  Key stats inline: $1B+ · Angular + NestJS · 5 years

[Divider]

"Open source."
[Existing project cards]
```

**New data needed:** A "platform" entry in data representing the professional work at Penny Software — its own card at the top of the Work section.

---

### 6. `Capabilities.tsx`

**Minor changes only.** Already clean from v1.

Change:
- Headline: "Full-stack. / End to end." → "The stack."
- Prose paragraph: rewrite to be less "I" focused, more declarative
- Styling: slightly more vertical padding between groups

---

### 7. `Experience.tsx`

**Concept:** "The career." — narrative, not a list of jobs.

**Changes:**
- Headline: "The story." → "The career."
- Each role: company name larger, metric line removed (already in Impact section — no repetition)
- Last role of a "chapter" (e.g., last Penny role) gets slightly more visual weight

---

### 8. `Contact.tsx`

**Concept:** Personal close — not a job application. Closing the story.

**Changes:**
- Remove all job-seeking copy entirely
- Sub-copy: "ashwinsathyan19@gmail.com" as the CTA (already is) 
- New sub-copy below email: "Engineering, ideas, or interesting problems welcome."
- Keep LinkedIn, GitHub, phone links

---

### 9. `Navbar.tsx`

**Minor update:** Change nav links to reflect new section IDs and naming.
```
Before: Work | Impact | About | Contact
After:  Work | About | Contact
```
Impact section doesn't need nav — it's an experience between Hero and About.

---

## Data File Changes

### `hero.ts`
```
Remove: eyebrow, identity (job-seeking), metricsLine, primaryCta, secondaryCta
Add: name, title
```

### `about.ts`
```
pullQuote: removed (absorbed into body)
paragraphs: new copy (see §4 above)
headline: "Seven years building things that matter."
```

### New: `work.ts` (platform card data)
```
platformCard: {
  title: "The procurement platform.",
  description: "...",
  stats: ["$1B+ GTV", "Angular + NestJS + MongoDB", "5 years"],
  company: "Penny Software"
}
```

### `site.ts`
```
Remove: heroSubhead, heroTagline (legacy fields)
Add: title: "Engineer." 
```

---

## Implementation Order

1. Foundation: `layout.tsx` (Inter weight 100), `globals.css` (light tokens, metric token), `lib/motion.ts` (fadeInUp)
2. Data files: `hero.ts`, `about.ts`, `site.ts`, new `work.ts`
3. `Hero.tsx` rebuild
4. New `Manifesto.tsx`
5. `Impact.tsx` rebuild
6. `About.tsx` rebuild (light section)
7. `Work.tsx` rebuild (platform card + OSS)
8. `Capabilities.tsx` update
9. `Experience.tsx` update
10. `Contact.tsx` update
11. `Navbar.tsx` update
12. `page.tsx` update (add Manifesto between Hero and Impact)
13. Commit, build check, delete PLAN.md

---

*Plan is complete when PLAN.md is deleted.*

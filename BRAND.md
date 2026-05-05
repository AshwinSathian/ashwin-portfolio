# Brand System — Ashwin Sathian

**Version:** 2.0  
**Date:** May 2026  
**Aesthetic Base:** Apple Product Pages (iPhone Pro / MacBook Pro / Vision Pro)  
**Key Shift from v1.0:** Editorial → Cinematic. Resume → Personal Statement.

---

## 1. Design Philosophy

### The Governing Idea

This is not a resumé website. It is a personal statement rendered in the visual language of Apple's most dramatic product launches.

Apple's product pages treat each feature as a *moment*. The screen goes black. One sentence appears. Then another. Then a number so large it fills your peripheral vision. Then silence. The product page earns its claims through restraint, not volume.

Ashwin's portfolio operates identically. Each section is a moment. One idea. Full screen. No noise.

### The Three Shifts

**From editorial to cinematic.** Apple's website (apple.com) is editorial — columns, articles, navigation. Apple's product pages are cinematic — full-bleed, scroll-driven, one scene at a time. This brand lives on product pages, not in articles.

**From resumé to portfolio.** A resumé pitches availability. A portfolio demonstrates craft. This site is not looking for a job. It is showing what seven years of serious engineering looks like. The audience arrives curious, not screening.

**From presenting to declaring.** "I help teams ship faster" is a pitch. "The systems I've built handle over $1B in transactions without missing a beat" is a declaration. This brand declares.

### Apple Product Page Principles (Applied)

1. **One idea per screen.** If a section contains two independent thoughts, it becomes two sections.
2. **The number is the hero.** When a metric is present, it is the largest element on screen. Everything else defers to it.
3. **Silence earns the statement.** Generous vertical space before and after key text makes that text feel inevitable.
4. **Scroll is narrative.** The page has a beginning, middle, and end. Each scroll step advances the story.
5. **No chrome.** Nothing decorates for its own sake. The line between the words and the empty black space IS the design.

---

## 2. Color System

Core palette unchanged from v1.0, with one addition: a strategic near-white surface for the About/philosophy section — the single moment of light that makes the dark sections feel even deeper.

### 2.1 Dark System (Primary — 90% of the site)

| Token | Hex | Usage |
|---|---|---|
| `--canvas` | `#000000` | Page base |
| `--surface-1` | `#111111` | Section-level lifts |
| `--surface-2` | `#1C1C1E` | Cards, containers |
| `--surface-3` | `#2C2C2E` | Elevated elements |
| `--surface-4` | `#3A3A3C` | Borders at rest on dark surfaces |

### 2.2 Light System (Exactly one section — the About/philosophy section)

| Token | Hex | Usage |
|---|---|---|
| `--light-bg` | `#FBFBFD` | Apple's page background for light surfaces |
| `--light-text-1` | `#1D1D1F` | Apple's primary text on light |
| `--light-text-2` | `#515154` | Secondary on light |
| `--light-text-3` | `#86868B` | Tertiary on light |
| `--light-separator` | `rgba(0,0,0,0.08)` | Borders on light surfaces |

This section exists as a **visual punctuation mark** — the single moment the page breathes differently. One light section. The contrast makes the surrounding dark sections feel deeper.

### 2.3 Text / Label (Dark sections)

| Token | Hex | Role |
|---|---|---|
| `--label-1` | `#F5F5F7` | Primary |
| `--label-2` | `#A1A1A6` | Secondary |
| `--label-3` | `#6E6E73` | Tertiary |
| `--label-4` | `#48484A` | Quaternary |

### 2.4 Accent & Metric

| Token | Hex | Usage |
|---|---|---|
| `--accent` | `#2997FF` | Interactive only — links, active nav, primary CTA |
| `--accent-hover` | `#147CE5` | Hover state |
| `--metric` | `#F5F5F7` | Large metric numbers — NOT green. On a product page, the number speaks for itself in white. |

> **v2.0 change:** The `--metric` token changes from `#30D158` (green) to `#F5F5F7` (white). Green reads as "status indicator" on a product page. The numbers here are statements, not alerts. White at 120px is all the emphasis they need.

---

## 3. Typography System

### 3.1 Weight Philosophy Change

v1.0 used weight 200 (ExtraLight) as the minimum. v2.0 introduces weight 100 (Thin) for the largest display moments. This is the Apple product page signature: at 120px+ in a pure black environment, a hairline-thin numeral is not weak — it is devastating.

Add weight `100` to the Inter font load.

### 3.2 Type Scale

| Role | Size | Weight | Tracking | Line Height | Usage |
|---|---|---|---|---|---|
| **Feature** | 120px+ | 100 | -0.050em | 1.00 | Full-screen isolated stats, largest hero moments |
| **Display** | 80px | 100–200 | -0.040em | 1.05 | Section-level headline statements |
| **Headline 1** | 56px | 200 | -0.030em | 1.10 | Section headlines |
| **Headline 2** | 40px | 300 | -0.022em | 1.15 | Sub-headlines |
| **Headline 3** | 28px | 400 | -0.015em | 1.20 | Card titles |
| **Title 1** | 22px | 500 | -0.010em | 1.25 | Labels, callouts |
| **Body Large** | 17px | 400 | -0.010em | 1.70 | Primary paragraphs |
| **Body** | 15px | 400 | 0 | 1.65 | Standard body |
| **Body Small** | 13px | 400 | 0.005em | 1.55 | Metadata, captions |
| **Label** | 12px | 500 | 0.080em | 1.40 | Eyebrow — ALL CAPS only |
| **Mono** | 13px | 400 | 0 | 1.60 | Code, URLs |

### 3.3 The Feature Size

`clamp(80px, 14vw, 140px)` — responsive Feature text that fills roughly 40–50% of the viewport width on desktop. On mobile, it clips to 80px. Used exclusively for:
- The stat numbers in the Impact section ($1B+, <200ms, 12)
- The hero name on a full-screen name-only hero variant

### 3.4 Typographic Rules (Updated)

- **Feature and Display are always Thin (100) or ExtraLight (200).** Weight and scale trade off: the larger the text, the lighter the weight.
- **Never bold a headline.** Weight 600+ appears only in navigation CTAs and micro-labels.
- **Metric numbers in Feature size use weight 100.** A three-digit number at 120px in weight 700 is aggressive. At weight 100 it is authoritative.
- **Max line length for body: 65ch desktop, full-width mobile.**

---

## 4. Section Architecture

### 4.1 The Full-Screen Section

The fundamental unit of this design is the **full-screen section** — a viewport-height panel with one primary idea centered or positioned for maximum visual impact.

```
min-height: 100svh
display: flex
flex-direction: column
justify-content: center (or space-between for hero)
padding: 96px horizontal, 80px vertical
```

Not every section needs to be exactly 100vh. The principle is: **no section feels rushed**. Content sections that naturally exceed 100vh are fine. But they should open and close with generous space.

### 4.2 Section Types

**Hero Section**  
Full screen. Black. Name and title only. The name is the product name.  
No metrics. No CTAs in the primary viewport. Scroll indicator at bottom.

**Statement Section**  
Full screen. Black. One sentence. Centered. Large type, weight 200–300.  
The manifesto: what Ashwin's work actually means, stated as truth.

**Metric Section**  
Full screen or near-full. Three large isolated statistics, each centered in its own column.  
Feature size (120px). Weight 100. White. The three numbers are the entire content of this section.

**Feature Section**  
Full screen. A topic with a headline, one paragraph, and optionally one data point.  
The About section uses a two-column variant (light background).

**List Section**  
Natural height (may exceed 100vh). Structured content: experience timeline, capabilities, projects.  
These sections breathe but are not forced to fill the screen.

**Contact Section**  
Full screen. The closing statement. Similar energy to the hero but looking forward, not introducing.

### 4.3 Rhythm

The page reads as: **Dark → Dark → Dark → Light (About) → Dark → Dark → Dark → Dark**

The single light section is at roughly the 40% mark in the scroll. Its contrast creates a moment of relief that makes everything around it feel more dramatic.

---

## 5. Motion & Animation

### 5.1 Upgraded Motion Philosophy

v1.0 used opacity-only scroll entrances — too conservative for a product page. v2.0 allows subtle vertical movement on scroll entrances, matching Apple's product page behavior.

Apple's product pages use:
- Opacity fade with slight upward drift (20–24px) for text elements
- Slight scale-up (0.96 → 1.0) for feature images
- Word-by-word or character-by-character text builds for key statements
- These are driven by scroll position, not just IntersectionObserver

### 5.2 Motion Tokens

| Token | Value | Usage |
|---|---|---|
| `--duration-fast` | 200ms | Hover, button states |
| `--duration-normal` | 400ms | Scroll-triggered entrance |
| `--duration-slow` | 600ms | Full-screen section transitions |
| `--ease-decelerate` | `cubic-bezier(0, 0, 0.2, 1)` | Elements entering |
| `--ease-standard` | `cubic-bezier(0.25, 0.1, 0.25, 1)` | Standard |

### 5.3 Scroll Entrance Pattern (Updated)

```
Trigger: element enters viewport (threshold: 0.1)
Animation: opacity 0 → 1, y 24 → 0
Duration: 500ms (up from 300ms)
Easing: cubic-bezier(0, 0, 0.2, 1)
Stagger (grouped): 80ms between children
```

The 24px Y drift is subtle enough to read as "natural" but adds depth that opacity-only lacks.

### 5.4 Word Reveal Pattern (NEW — Manifesto section)

The statement section reveals text word by word as the section enters the viewport. Each word fades in with a 60ms stagger. This is the signature motion of Apple's "Pro" product pages.

```
Each <span> wrapping a word:
  initial: opacity 0
  animate: opacity 1
  duration: 400ms per word
  stagger: 60ms between words
  trigger: section enters viewport
```

### 5.5 What Stays Removed

- Parallax mouse tracking (Hero.tsx v1)
- Looping background animations (BreathingBackground)
- Glow effects and purple shadows

---

## 6. Component Language

### 6.1 Updated Card Style

Cards in v2.0 are more minimal — the border treatment is lighter:

```
Border: 1px solid rgba(255,255,255,0.06)  (even more subtle than v1)
Background: --surface-2 (#1C1C1E)
Radius: 20px (slightly larger than v1's 16px — Apple's current radius)
Padding: 32px
Hover: border → rgba(255,255,255,0.12)
```

### 6.2 Buttons (Updated)

No changes to button styling from v1.0. One addition:  

**Text link with arrow:**
```
Style: no background, no border
Text: --label-2, 15px, weight 400
Arrow: " →" appended, --accent colored
Hover: text → --label-1, arrow translate-x-1
```

Used for project links, scroll prompts, etc.

### 6.3 Scroll Indicator (NEW)

A subtle animated scroll hint at the bottom of full-screen sections that don't have a CTA:

```
Element: vertical line (1px, 32px tall) + label "Scroll" in Label style
Color: --label-4
Animation: line extends downward (0 → 32px height) on a 1.5s loop
Position: absolute bottom-12, centered
```

---

## 7. Voice & Tone (Updated for Personal Portfolio)

### 7.1 The Fundamental Shift

v1.0 voice was calibrated for a job seeker. v2.0 voice is calibrated for a craftsman presenting their work. The distinction matters in almost every sentence.

| v1.0 (Job Seeker) | v2.0 (Craftsman) |
|---|---|
| "Open to engineering leadership roles" | (doesn't exist anywhere on the site) |
| "Reach out directly" | "Let's talk" |
| "View Work" | "Explore" |
| "Download Resume" | "Read the resumé" or just "Resumé" |
| "I help teams ship faster" | removed — the evidence speaks |

### 7.2 The Voice in Practice

This is a personal portfolio. First-person is earned. But first person is used in body paragraphs, not in section headlines or metrics. The headlines are declarative. The paragraphs are personal.

**Headlines declare:**
> "The systems I've built handle $1B+ in transactions."  
> "Calm under load. Precise by design."  
> "Seven years. One platform. Everything working."

**Paragraphs speak:**
> "I spent seven years at one company, growing from the person who shipped features to the person who designed the systems that shipped them. That kind of depth is rare in this industry, and I'm proud of it."

### 7.3 Section Headlines (Updated)

| Section | v1.0 | v2.0 |
|---|---|---|
| Hero | "Engineering. / At scale." | "Ashwin Sathian." / "Engineer." |
| Statement | (didn't exist) | "The systems I've built handle $1B+ in transactions." |
| Impact/Metrics | "By the numbers." | (numbers only — no headline needed) |
| About | "Complex systems. / Calm delivery." | "Seven years building things that matter." |
| Work | "Open source." | "Built to last." |
| Capabilities | "Full-stack. / End to end." | "The stack." |
| Experience | "The story." | "The career." |
| Contact | "Let's talk." | "Let's talk." (unchanged — already right) |

### 7.4 What This Site Never Says

Same as v1.0, plus:
- "Open to" anything (opportunities, roles, work)
- "Available for" anything  
- "Hire me" in any form
- "Let me help you" (pitch language)
- Anything that positions the reader as a potential employer

The reader is welcome. They are not a buyer.

---

## 8. Identity

**Name:** Ashwin Sathian  
**Monogram:** AS  
**Self-description:** Engineer. (one word, with period)  
**Domain:** ashwinsathian.com  
**Side project:** readable.ashwinsathian.com  
**Accent:** `#2997FF`  
**Typeface:** Inter (weights 100–600)  
**Tone:** Precise. Personal. Proud of the work.

---

*This document is the single source of truth. v2.0 supersedes v1.0 entirely.*

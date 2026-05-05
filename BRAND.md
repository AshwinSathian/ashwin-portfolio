# Brand System — Ashwin Sathian

**Version:** 1.0  
**Date:** May 2026  
**Philosophy Base:** Apple Human Interface Guidelines + Apple.com editorial design language

---

## 1. Design Philosophy

This brand is built on three principles borrowed directly from Apple's HIG — and applied without compromise:

**Clarity.** Every element communicates one thing. When in doubt, remove. Typography carries meaning; decoration does not. Legibility at every scale is non-negotiable.

**Deference.** The interface steps back. Content is the hero. The design system exists to make Ashwin's work, metrics, and story legible — not to express itself.

**Depth.** Hierarchy is achieved through weight, size, and contrast — not gradients, glow, or animation. Layers communicate structure; motion communicates change.

The governing aesthetic is **precision without coldness**. The brand should feel like a well-crafted instrument: considered, purposeful, and calm. Like an Apple Pro product page built for a person.

---

## 2. Color System

The palette is derived from Apple's dark mode system colors as implemented across iOS, macOS, and apple.com. It uses a strict surface hierarchy and a single accent color.

### 2.1 Background / Surface Hierarchy

| Token | Hex | Usage |
|---|---|---|
| `--canvas` | `#000000` | Page base — full-bleed sections |
| `--surface-1` | `#111111` | Section-level fills, subtle separations |
| `--surface-2` | `#1C1C1E` | Cards, modals — Apple's `systemGray6` dark |
| `--surface-3` | `#2C2C2E` | Elevated cards, hover states — Apple's `systemGray5` dark |
| `--surface-4` | `#3A3A3C` | Tooltips, overlays — Apple's `systemGray4` dark |

### 2.2 Separator / Border

| Token | Value | Usage |
|---|---|---|
| `--separator` | `rgba(255,255,255,0.08)` | Default card borders, dividers |
| `--separator-strong` | `rgba(255,255,255,0.15)` | Hover borders, emphasis dividers |
| `--separator-opaque` | `#222222` | Use only when transparency causes issues |

### 2.3 Text / Label Hierarchy

| Token | Hex | Usage |
|---|---|---|
| `--label-1` | `#F5F5F7` | Primary text — Apple's brand text color |
| `--label-2` | `#A1A1A6` | Secondary text, subtitles, metadata |
| `--label-3` | `#6E6E73` | Tertiary — dates, captions, helper text |
| `--label-4` | `#48484A` | Quaternary — least prominent, decorative |

### 2.4 Accent

One accent. One only.

| Token | Hex | Usage |
|---|---|---|
| `--accent` | `#2997FF` | Apple Blue (dark-mode variant) — CTAs, links, active states |
| `--accent-hover` | `#147CE5` | Hover/pressed state |
| `--accent-muted` | `rgba(41,151,255,0.12)` | Very subtle fill behind accent-colored elements |

**Rule:** Accent is used for interactive elements — links, primary buttons, active nav items. It is never used decoratively. If you are tempted to use it for visual interest, do not.

### 2.5 Semantic Colors (Metrics Only)

| Token | Hex | Usage |
|---|---|---|
| `--metric-positive` | `#30D158` | Apple's systemGreen (dark) — key stats like GTV, performance wins |

This color appears exclusively in the Impact/Highlights section for metric numbers. Nowhere else.

### 2.6 Color Usage Rules

- **No gradients** on surfaces, buttons, or text. One exception: a radial gradient may be used on the hero canvas — maximum opacity 0.06, radius >60%, centered.
- **No glow effects.** `box-shadow` is allowed only for 1px inset borders simulated via shadow, never for light emission effects.
- **No purple.** The existing `#8B5CF6` accent is removed entirely. It conflicts with Apple's restrained palette and reads as decorative rather than semantic.
- **Background sections alternate** between `--canvas` and `--surface-1` to create rhythm without color.

---

## 3. Typography System

The typeface is **Inter** — the closest publicly available approximation of SF Pro. It shares Inter's optical sizing, variable weight axis, and neutral character that scales from 11px captions to 96px display text.

Load weights: 200 (ExtraLight), 300 (Light), 400 (Regular), 500 (Medium), 600 (SemiBold).

Do not use Bold (700) or heavier. Apple's headlines are light. The contrast between thin weight and large size is the signature.

### 3.1 Type Scale

| Role | Size | Weight | Tracking | Line Height | Usage |
|---|---|---|---|---|---|
| **Display** | 80px | 200 | -0.040em | 1.05 | Hero headline only |
| **Headline 1** | 56px | 200 | -0.030em | 1.10 | Section entry headlines |
| **Headline 2** | 40px | 300 | -0.022em | 1.15 | Section sub-headlines |
| **Headline 3** | 28px | 400 | -0.015em | 1.20 | Card titles, subsection heads |
| **Title 1** | 22px | 500 | -0.010em | 1.25 | Highlighted callouts |
| **Title 2** | 17px | 600 | -0.008em | 1.30 | Labels, button text, nav |
| **Body Large** | 17px | 400 | -0.010em | 1.70 | Primary paragraph text |
| **Body** | 15px | 400 | 0 | 1.65 | Standard body copy |
| **Body Small** | 13px | 400 | 0.005em | 1.55 | Secondary content, card metadata |
| **Caption** | 11px | 400 | 0.010em | 1.50 | Timestamps, legal, minor metadata |
| **Label** | 12px | 500 | 0.080em | 1.40 | Eyebrow text — ALL CAPS only |
| **Mono** | 13px | 400 | 0 | 1.60 | Code, URLs, file paths |

**Font stack:**
```css
--font-sans: "Inter", -apple-system, BlinkMacSystemFont, "SF Pro Display", 
             "SF Pro Text", system-ui, sans-serif;
--font-mono: "SF Mono", "Fira Code", "Fira Mono", Menlo, Consolas, monospace;
```

### 3.2 Typographic Rules

**Headings:**
- Display and H1 are always weight 200 (ExtraLight). This is intentional and non-negotiable.
- No bold headings except in UI labels and button text.
- Never mix weights within a single headline.
- Track all headings below their default — see table above.
- Headings never exceed their section width on desktop. Use `max-width: 18ch` to `28ch` for readability.

**Body:**
- Max line length: 75ch on desktop, full width on mobile.
- Line height minimum 1.60 for all body text.
- Never justify body text. Left-align only.
- No full caps for body text.

**Eyebrow labels (section identifiers):**
- LABEL style: 12px, weight 500, 0.08em tracking, ALL CAPS
- Color: `--label-3`
- Used above section headlines: "WORK" above Experience, "IMPACT" above Highlights, etc.
- Never used in body copy.

---

## 4. Spacing & Grid

Apple's 8pt grid. All spacing values are multiples of 8px.

### 4.1 Spacing Scale

| Token | Value | Usage |
|---|---|---|
| `--space-1` | 4px | Micro gaps (icon padding, tight groups) |
| `--space-2` | 8px | Compact component padding |
| `--space-3` | 12px | Default component padding |
| `--space-4` | 16px | Default gap between related elements |
| `--space-5` | 24px | Gap between distinct elements |
| `--space-6` | 32px | Section internal padding |
| `--space-7` | 48px | Sub-section separation |
| `--space-8` | 64px | Section separation |
| `--space-9` | 96px | Major section padding (top/bottom) |
| `--space-10` | 128px | Hero section vertical padding |
| `--space-11` | 192px | Maximum section padding on tall viewports |

### 4.2 Layout Grid

- **Max content width:** 1080px (Apple.com uses 980px; 1080px slightly wider for readability)
- **Page gutter:** 48px desktop, 24px tablet, 20px mobile
- **Column grid:** 12-column, 24px gutter
- **Section padding:** `--space-9` (96px) top and bottom
- **Hero height:** `100svh` minimum

### 4.3 Border Radius

| Element | Radius |
|---|---|
| Cards | 16px |
| Buttons | 980px (pill) |
| Chip / Tag | 980px (pill) |
| Image containers | 12px |
| Tooltips | 8px |
| Modal | 20px |
| Input fields | 10px |

Apple uses rounded corners consistently. The pill shape for interactive elements (buttons, tags) is characteristic of the HIG.

---

## 5. Motion & Animation

Motion in this brand is **functional, not decorative.** It communicates state change, establishes hierarchy during entrance, and guides attention. It never runs on a loop.

### 5.1 Principles

1. **No breathing, pulsing, or idle animations.** If an element animates when the user isn't interacting with the page, remove it.
2. **Entrance animations are opacity fades only.** No Y-axis translation on scroll entrance. Elements appear — they don't rise into place.
3. **Duration is shorter than you think.** Apple's system transitions are 250–350ms. 600ms is too long; it reads as sluggish on modern hardware.
4. **Spring physics over easing curves** for interactive elements (hover, press). Linear ease for entrance.
5. **Respect `prefers-reduced-motion`.** All animations must be disabled under this media query.

### 5.2 Motion Tokens

| Token | Value | Usage |
|---|---|---|
| `--duration-instant` | 100ms | Immediate feedback (focus, active state) |
| `--duration-fast` | 200ms | Hover transitions, button states |
| `--duration-normal` | 300ms | Scroll-triggered entrance, panel open |
| `--duration-slow` | 500ms | Page transitions, modal appearance |
| `--ease-standard` | `cubic-bezier(0.25, 0.1, 0.25, 1)` | Standard ease |
| `--ease-decelerate` | `cubic-bezier(0, 0, 0.2, 1)` | Elements entering the screen |
| `--spring` | `{ stiffness: 300, damping: 30 }` | Interactive springs (Framer Motion) |

### 5.3 Scroll Entrance Pattern

```
Trigger: element enters viewport (threshold: 0.15)
Animation: opacity 0 → 1
Duration: 300ms
Easing: --ease-decelerate
Stagger (when grouped): 60ms between children
No Y offset. No scale. Opacity only.
```

### 5.4 What Is Removed

- **Parallax on hero.** Parallax is theatrical. Remove entirely.
- **BreathingBackground.** Idling radial gradient animation. Remove entirely.
- **Glow effects on scroll.** Remove the experience timeline marker glow.
- **600ms animations.** Reduce all durations.
- **80ms stagger.** Replace with 60ms maximum.

---

## 6. Component Language

### 6.1 Cards

```
Background:  --surface-2 (#1C1C1E)
Border:      1px solid --separator
Radius:      16px
Padding:     32px
Hover:       border-color → --separator-strong (200ms ease)
Shadow:      none
```

No glass-morphism. No `backdrop-blur`. No box-shadow glows. Depth is achieved through surface color differential and border precision.

### 6.2 Buttons

**Primary (CTA):**
```
Background:  --accent (#2997FF)
Text:        #FFFFFF, 15px, weight 500
Padding:     12px 24px
Radius:      980px (pill)
Hover:       background → --accent-hover (200ms)
```

**Secondary:**
```
Background:  --surface-3 (#2C2C2E)
Text:        --label-1, 15px, weight 500
Border:      1px solid --separator
Radius:      980px
Hover:       border → --separator-strong (200ms)
```

**Ghost / Text:**
```
Background:  transparent
Text:        --label-2, 15px, weight 400
Hover:       color → --label-1 (200ms)
```

No button uses gradient, glow, or shadow. Button text is Title Case — never ALL CAPS.

### 6.3 Tags / Chips

```
Background:  --surface-3
Text:        --label-3, 12px, weight 500, 0.04em tracking
Padding:     6px 14px
Radius:      980px
Border:      none
```

Used only when tagging technologies or categories. Never colored. Never interactive unless explicitly a filter.

### 6.4 Navigation

```
Background:  rgba(0,0,0,0.8) + backdrop-blur(20px)
Height:      52px (matches macOS menu bar)
Border-bottom: 1px solid --separator
Links:       --label-2, 14px, weight 400; hover → --label-1
Active:      --accent
CTA ("Resume"): Secondary button style, compressed to 32px height
```

Sticky. Always visible. Collapses to icon-only hamburger on mobile with full-screen overlay.

### 6.5 Dividers

```
Default: horizontal rule, 1px, --separator
Strong:  1px, --separator-strong
```

Preferred alternative: white space. If section content is clear, don't add a line.

### 6.6 Metric Display (Impact Section)

```
Number:      56px, weight 200, --metric-positive (#30D158)
Label below: 14px, weight 400, --label-3
Max width:   200px per metric unit
```

The large number is the hero. Everything else defers to it.

### 6.7 Timeline (Experience)

```
Line:        1px vertical, --separator
Node dot:    6px circle, --accent, centered on line
Company:     22px, weight 500, --label-1
Role:        15px, weight 400, --label-2
Date:        13px, weight 400, --label-3
Bullets:     15px body, --label-2, left-aligned
```

---

## 7. Voice & Tone

This section defines the text language for the portfolio — how copy is written, what it sounds like, and what it never does.

### 7.1 Brand Voice

The writing voice is **Apple-adjacent editorial**: declarative, minimal, confident, and quiet. It never shouts. It does not explain itself. It states things as facts, then lets the reader draw conclusions.

**Reference benchmark:** Apple's product page headlines. "Titanium. So strong. So light. So Pro." Each word is a sentence. Each sentence is a fact. There is no filler.

### 7.2 Headline Principles

1. **Lead with the noun or the verb — not "I".** "Engineering that scales." not "I build engineering systems."
2. **One idea.** A headline is exactly one thought. Two ideas → two headlines.
3. **End with a period.** Standalone statements end with a period, not an ellipsis or exclamation mark.
4. **Metrics are plaintext, not hyperbole.** "$1B+ GTV." Not "an incredible $1B+ GTV milestone."
5. **Light weight words carry more impact than dramatic ones.** "Calm" > "incredible". "Fast" > "blazing".
6. **Avoid gerunds in hero headlines.** "Engineering leadership" > "Leading engineers"
7. **Short is always better.** If a headline has five words, find the three that matter.

### 7.3 Section Naming Convention

| Section | Current Name | New Name |
|---|---|---|
| Hero | (no label) | (no label) |
| About | About \| Purpose & Proof | About |
| Highlights | Highlights | Impact |
| Projects | Top Projects | Work |
| Skills | Skills | Capabilities |
| Experience | Experience | Experience |
| Education | Education | Education |
| Contact | Contact \| Let's build something remarkable. | Let's talk. |

Section labels use the LABEL style (12px, 500, 0.08em, ALL CAPS). Section headlines use Headline 1.

### 7.4 Rewrite Examples

**Hero headline — Before:**
> "Ashwin Sathian" + "Engineering leader building scalable SaaS systems powering $1B+ GTV."

**Hero headline — After:**
> "Engineering.  
> At scale."

*(Two-line Display, weight 200. Sparse. Powerful.)*

---

**About — Before:**
> "I'm an engineering leader who makes complex SaaS programs feel calm, intentional, and fast."

**About — After:**
> "Complex systems. Calm delivery."

*(Pull-quote at Headline 1 weight 200. Then a paragraph in Body Large for the full story.)*

---

**Contact headline — Before:**
> "Contact | Let's build something remarkable."

**Contact — After:**
> "Let's talk."

*(Display weight 200. Nothing else needed before the email address.)*

---

**Highlights metric — Before:**
> "$1B+ GTV safeguarded"

**After:**
> "$1B+"  
> "Procurement GTV"

*(Number at 56px --metric-positive. Label at 14px --label-3. Precise. Quiet.)*

---

### 7.5 What This Brand Never Says

- "Passionate" — everyone says this; it means nothing here
- "Leverage" as a verb
- "Robust" or "cutting-edge"
- Exclamation marks in headlines or buttons
- "Click here" or "Learn more" (use specific action words: "Download Resume", "View project")
- First-person in section headlines
- Run-on sentences in the hero

### 7.6 Copy Length Guide

| Location | Max Length |
|---|---|
| Hero headline | 5 words |
| Section headline | 6 words |
| Card title | 8 words |
| Body paragraph | 3 sentences |
| Bullet point | 1 sentence |
| Button label | 3 words |
| Nav link | 1 word |

---

## 8. Brand Dos and Don'ts

### DO

- Use white space as a design element. Empty space communicates confidence.
- Let metrics speak for themselves. `$1B+` is more impressive than three sentences about it.
- Use Inter 200 (ExtraLight) for large headlines. The thinness at scale is the visual signature.
- Use one accent color (`--accent`) and use it sparingly.
- Alternate section backgrounds between `--canvas` and `--surface-1` for visual rhythm.
- Write copy as if every word costs money. Cut everything that doesn't earn its place.
- Keep the navigation simple: 4 links maximum, one CTA.

### DON'T

- Use more than two typeface weights in any single section.
- Add shadows to anything except modals (and even then, keep them minimal).
- Use gradients on interactive elements.
- Animate anything that is not responding to user input or scroll entrance.
- Use more than one color accent on any given page.
- Add helper text to self-evident UI elements.
- Use PrimeReact's visual style directly — rebuild components to match this system.
- Use `purple`, `violet`, or any warm-toned accent. The existing purple is gone.
- Use particles, confetti, or ambient motion effects.

---

## 9. Identity Reference

**Name:** Ashwin Sathian  
**Monogram:** AS  
**Primary URL:** ashwinsathian.com  
**Brand color (single-color contexts):** `#F5F5F7` on dark, `#1D1D1F` on light  
**Accent:** `#2997FF`  
**Typeface:** Inter  
**Tone:** Precise. Quiet. Earned.

---

*This document is the single source of truth for all visual and editorial decisions on ashwinsathian.com. Any deviation requires an explicit reason that references the core principles in §1.*

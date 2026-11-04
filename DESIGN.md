# DESIGN.md: v8 "Pinned poster"

Date: 2026-11-04. Supersedes v7 "Lumen" (2026-10-06).
Tokens live in `src/app/globals.css`; this file explains them.

## The idea

The name stays put while the work changes. On the home page the lowercase
wordmark, set as the page title, holds the top of the screen and live
screens of the shipped products scroll under it, one plate at a time. Every
screen is a new cover of the same poster. Product screens are still the only
colour on the site, so the work is the brightest thing on every page.

v7 used light as its material (a glow behind the hero, glass, hairlines,
grain). v8 removes all of it: no gradients, no glass, no glow, no grain, no
thin rules. Surfaces are told apart by a step in tone or by space.

## Colour

| Token | Value | Use |
|---|---|---|
| `night` | `#050505` | Page background, ink on paper |
| `surface` | `#0C0C0D` | Tone-step sections and panels |
| `surface-2` | `#141415` | Raised or pressed surface, chips |
| `fg` | `#F5F5F4` | Primary text; the paper field (contact) |
| `fg-2` | `#A6A6A6` | Secondary text |
| `fg-3` | `#8A8A8A` | Metadata |
| `line`, `line-strong` | white 8% / 16% | Real tables and form fields only |

Contrast on `night`: `fg` 18.7:1, `fg-2` 8.4:1, `fg-3` 5.9:1. Running text
is `fg`; grey is for secondary notes. One inverse field per page at most
(`.paper`, the contact section). `color-scheme: dark`; there is no light theme.

## Type

- One typeface, Bricolage Grotesque, with its weight, width and optical-size
  axes. `font-optical-sizing: auto` gives body copy the text cut and display
  sizes the sharper display cut. Code uses the system monospace and nothing
  else does.
- Display tracking -0.025 to -0.035em, leading near 0.9. Body 17px, 1.6.
- About five steps per page: display (the name, the email), heading
  (`display-l`/`display-m`), statement (28px), body, small/meta.
- No eyebrows (a small label above a heading), no uppercase tracked labels,
  no 01 / 02 markers on things that are not a sequence.
- Headlines are two lines or fewer at every width.

## Wordmark

`ashwin sathian.` in lowercase, weight 800, tracking -0.035em (`.wordmark`).
It ends on a full stop because the voice is declarative. Used in the nav,
as the home `h1` at display size, in the footer and on the OG cards. Body
copy and structured data keep the proper-case name; the home `h1` carries
"Ashwin Sathian, senior full-stack engineer" as screen-reader text.

The favicon is `a.` drawn from the font's outlines (opsz 96, wght 800) on
night, 14/64 corner radius. `public/favicon.svg`, `src/app/favicon.ico` and
`public/apple-touch-icon.png` are generated from it. Bump the `?v=` in
layout.tsx after changing any of them.

## Layout

- One container, `.shell`: 1200px max, gutters 20 / 32 / 48px.
- Sections 96px apart on a phone, 160px on desktop. Neighbouring sections
  never share a composition.
- Radius 10px controls, 16px panels and media. Buttons are solid `fg` on
  night (or `surface-2`), one shape.
- No drop shadows, no hairlines, no outlined boxes, no glass. The nav is a
  plain opaque bar.

## Home, in order

1. **Pinned name and plates** (`home/PinnedWork`). The `h1` wordmark sits in
   an opaque band that is `position: sticky` from 768px up, so the plates
   pass beneath it and never under the letters. First screen: the thesis,
   one line about who, one action, and the first plate. Then one plate per
   featured project: its live capture (`/projects/<slug>/live.webp`, 2400 ×
   1500, captured from production) with name, category and a link.
2. **One frame, three distances** (`home/WeirZoom`). A sticky stage inside a
   300svh wrapper; a CSS view timeline zooms the live Weir screen from the
   whole page to its `Cache-Status` line and then its `go get` line, and
   brings in the second half of the headline and the caption. Without scroll
   timelines, or with reduced motion, it is one still frame with all text.
3. **Experience** on a `surface` field: a heading, one statement, every role
   in a table at one type size.
4. **Writing**: heading and intro on the left, three posts as large rows.
5. **Contact** on paper: the email address as display type.
6. **Footer** (every page): a greyscale photograph of a Chinese fishing net in
   Kochi on one half (Hans A. Rosbach, CC BY-SA 3.0, credited in the footer),
   the menu set large on the other.

## Motion

One easing, `cubic-bezier(0.16, 1, 0.3, 1)`. CSS only.

1. Kinetic headings: words rise through a clip while weight and width settle.
2. The pinned name (sticky) and the Weir zoom (view timeline).
3. Scroll reveals (`.reveal`, `.reveal-late`, `.reveal-media`). They start
   part-visible (opacity 0.3), so a page captured without scrolling is never
   blank.
4. Page transitions: React `<ViewTransition>`.
5. Feedback: underline draw (`.link`, a flat pseudo-element, not a
   gradient), arrow nudge, row background, plate image scale, footer menu
   shift.

Rules: nothing is hidden in server HTML waiting for JavaScript; every
`:hover` has an `:active` or `:focus-visible` twin; `prefers-reduced-motion`
switches it all off and unpins the zoom.

## Content rules

- Facts in `src/app/data` come from the project's GitHub repo, checked at the
  time of writing. The repo wins over the résumé and older site copy.
- Only finished, released work is featured. Unreleased work carries a
  `status` tag.
- First person. No em dashes, no stock AI vocabulary.
- Found pictures show the world around the work (Kochi), never the work
  itself, and are credited on the page.

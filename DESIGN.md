# DESIGN.md: v7.0 "Lumen"

Date: 2026-10-06. Supersedes every earlier identity.
Full spec: `docs/superpowers/specs/2026-10-06-lumen-rebuild-design.md`.
Tokens live in `src/app/globals.css`; this file explains them.

## The idea

The interface has no hue. Light is the material: a slow glow behind the hero,
a highlight along the top edge of panels, fine grain over flat black. Product
screenshots are the only colour on the site, so the work is the brightest
thing on every page.

## Colour

| Token | Value | Use |
|---|---|---|
| `night` | `#050505` | Page background |
| `surface` | `#0C0C0D` | Panels, code |
| `surface-2` | `#141415` | Raised or pressed surface |
| `line` | white 8% | Hairlines |
| `line-strong` | white 16% | Hover and focus borders, media frames |
| `fg` | `#F5F5F4` | Primary text |
| `fg-2` | `#A6A6A6` | Secondary text |
| `fg-3` | `#8A8A8A` | Metadata |

Computed contrast on `night`: `fg` 18.7:1, `fg-2` 8.4:1, `fg-3` 5.9:1. On
`surface-2`: 16.9, 7.6, 5.3. All pass WCAG AA for body text. Do not add a
dimmer text colour.

`color-scheme: dark` is unconditional. There is no light theme.

## Type

- One typeface on every surface: Bricolage Grotesque (variable weight, width
  and optical size). Headings, body, UI, metadata and the OG images all use
  it. Do not add a second family.
- Optical size is automatic (`font-optical-sizing: auto`, the default), so
  body copy gets the open text cut and display sizes get the sharper display
  cut with its ink traps. This is where the face's character lives; before
  2026-11-04 only the text cut was loaded and headings looked generic.
- Headings: tracking -0.02 to -0.03em (the display cut is already tight, so
  the old -0.045em collided letters), line-height near 0.95.
- Body and UI: 17px base, line-height 1.6.
- Metadata (dates, counts, versions): `text-meta` with `tabular-nums`.
- Code blocks and inline code are the only exception: the system monospace
  stack, so columns still align. No monospace web font is loaded.

Scale: `display-xl`, `display-l`, `display-m`, `title`, `body`, `small`,
`meta`. Section labels are sentence case. No uppercase tracked eyebrows.
No `01 / 02` markers on things that are not a sequence.

## Wordmark

`ashwin sathian.` in lowercase, weight 800, tracking -0.035em (`.wordmark`
in globals.css). It ends on a full stop because every display headline on
the site does: the voice is declarative, and the mark says so. The nav,
the OG cards and the favicon use it. Body copy and structured data keep the
proper-case name; the nav link's accessible name is "Ashwin Sathian, home".

The favicon is `a.` drawn from the font's own outlines (opsz 96, wght 800),
on night with a 14/64 corner radius. `public/favicon.svg`, `src/app/favicon.ico`
(32 and 48 px) and `public/apple-touch-icon.png` (180 px, square) are
generated from it. Bump the `?v=` in layout.tsx after changing any of them.

## Layout

- One container, `.shell`: 1200px max, gutters 20 / 32 / 48px. Every page
  uses it, so there is one left edge.
- Section rhythm: 80px mobile, 144px desktop.
- Radius: 10px controls, 16px panels and media. No pill chips.
- No drop shadows. Depth comes from surface steps and light.
- One glass surface: the caption plate on the home gallery stage. It sits
  over a product preview, so the blur has something under it. Nothing
  else is translucent except the nav bar, and both turn opaque under
  `prefers-reduced-transparency` and `prefers-contrast: more`.

- Mobile and desktop are designed separately, not scaled. Touch targets are
  at least 44px. Nothing is revealed only on hover.

## Home gallery

Featured work is shown like Finder's Gallery view (`ProjectGallery`): one
large preview, a strip of thumbnails under it, and the selected project's
facts beside it. The preview has a short reflection
(`-webkit-box-reflect`, no reflection in Firefox). The strip is an ARIA
tab list, so arrow keys, Home and End move the selection. The preview has
a fixed 16:10 ratio, so the strip never moves when the selection changes.
Projects with no screenshot get a file tile showing their code sample's
filename. `/projects` is a plain index of every project, not a second
copy of the gallery.

## Motion

One easing, `cubic-bezier(0.16, 1, 0.3, 1)`. Hover 200 to 450ms, reveals tied
to scroll position, hero 950ms.

1. Kinetic headings (`KineticHeading`): words rise through a clip while weight
   runs 200 to final and width 75% to 100%. An invisible sizing copy keeps
   line breaks fixed during the animation.
2. Scroll reveals (`.reveal`, `.reveal-media`): CSS `animation-timeline:
   view()` inside `@supports`. Content is visible by default.
3. Hero scroll response (`.hero-away`) and reading progress (`.progress`):
   `animation-timeline: scroll()`.
4. Page transitions: React `<ViewTransition>`. Pages crossfade and rise; a
   project's media morphs between list and detail.
5. Hover, press and focus share the same feedback: panel highlight, underline
   draw (`.link`), arrow nudge (`.arrow`), row shift (`.row`).

Rules:

- Nothing may be hidden in server HTML waiting for JavaScript. Animation
  enhances a page that is already complete.
- Every `:hover` rule has an `:active` or `:focus-visible` twin.
- `prefers-reduced-motion: reduce` switches all of it off.

## Content rules

- Facts in `src/app/data` come from the project's GitHub repo, checked at the
  time of writing. The repo wins over the résumé and over older site copy.
- Only finished, released work is showcased (`featured`). Unfinished or
  unreleased work may be listed, with a `status` tag saying so.
- First person throughout. No em dashes, no stock AI vocabulary.

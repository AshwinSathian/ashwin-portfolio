# DESIGN.md: v10 "Folders"

Date: 2026-11-10. Supersedes v9 "Kasavu" in structure, motion and voice; keeps
its warm dark ground and type. The rebuild moved the site from Next.js to Astro.
Tokens live in `src/styles/global.css`.

## The idea

Dark first, with a little colour. The visual language borrows its intent from
ChatterMeter's landing page (the owner's own product): oversized display type,
pill shapes, folder tabs and a lively, spring-like motion. It does not copy
it. Here the colour stays small: four tones appear on tabs, dates and tiles,
and the page ends in one full-yellow panel.

## Colour

| Token | Value | Use |
|---|---|---|
| `night` | `#15120F` | Page ground, text on tone colours |
| `surface`, `surface-2` | `#1C1814`, `#26211B` | Alternating folder panels |
| `fg`, `fg-2`, `fg-3` | `#F1EADC`, `#C3B8A6`, `#9A8F7D` | Text, secondary, metadata |
| `orange` `#F47A38`, `yellow` `#FFC849`, `teal` `#18B6AA`, `blue` `#6598F8` | | Tones. Always ink (`night`) text on top, never as body text colour, except yellow for the email link. |

Each section has one tone: Projects teal, Writing yellow, Experience orange,
Colophon blue. Dark only.

## Type

Bricolage Grotesque (display, 700), Figtree (body), JetBrains Mono (code).
Variable, OFL, self-hosted through `@fontsource-variable`. Display sizes run to
`clamp(3.25rem, 11vw, 9.5rem)` for the home greeting.

## Shapes

Pills (`.pill`) for labels and dates. Folders: panels have a 28px rounded top
and overlap the previous panel (`.sheet-panel`), each with a tab pill on its
edge. Project tiles (`.tile`) are dark and fill with their tone on hover.

## Motion

CSS only. A single fade-and-rise on load, spring easing (`--ease-spring`) on
tab, tile, arrow and row hover, a scroll-linked rise (`.reveal`) and reading
progress on posts where `animation-timeline` exists, and cross-document view
transitions (`@view-transition`). No per-word heading animation. All of it
stops under `prefers-reduced-motion`.

## Voice

Plain and first-person, a little playful, never salesy. No "open to work"
language and no current employer (the last role ended June 2026). Copy avoids
AI tells: no em dash habit, no stock vocabulary.

## Rules that carry over

- Project facts come from each repo, not old copy (see `src/data/projects.ts`).
- Every page is complete without JavaScript. The only script opens the mobile menu.
- Posts live only on this site. No off-site canonicals.

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

Bricolage Grotesque is the only face for headings and text, with its optical size pinned at 36 (the axis alone cost 23 KB; a font under ~42 KB arrives in two TCP round trips instead of three). JetBrains Mono is the one exception,
for code blocks, and a page without code never requests it. Nothing is italic:
Bricolage has none. Arrows are drawn (`Arrow.astro`), since the face lacks them.
Display sizes run to `clamp(3.25rem, 11vw, 9.5rem)` for the home greeting.

Both files are cut by `tools/cut-fonts.sh` into `src/fonts` (24 KB and 8 KB, down
from 61 KB of fonts before): weights 400 to 800, Latin only, only the glyphs the
site shows. `tests/fonts.test.mjs` fails when a page needs a character outside the cut.

## Load speed

Strategy: the floor is one round trip plus the bytes, so cut bytes, requests and round trips, then hide what is left.
Measured on `/` (Lighthouse mobile, devtools throttling, median of 5; the first number is the site before this work):

| | Before | Now |
|---|---|---|
| First contentful paint | 1470 ms | 666 ms |
| Largest contentful paint | 1581 ms | about 1530 ms |
| Page weight | 131 KB | 67 KB |
| Requests | 10 | 7 |

- **CSS inlined** (`build.inlineStylesheets`, so the CSP allows inline styles): no stylesheet request.
- **One text face, 24 KB** (`tools/cut-fonts.sh`): a font preload was tried and was slower to first paint, so there is none.
- **Thumbnails are AVIF** (quality 52, 480 and 800 px): about 23% smaller than the WebP they replaced.
- **One script file** (`src/scripts/site.ts`): menu, navigation feedback and link prefetching, about 1 KB.
- **Browser cache for pages** (`public/_headers`): fresh for 60 s, then stale-while-revalidate for 10 min, so a back button or a second visit costs no network wait. A deploy shows within a minute for new visits and a few minutes at most for returning ones.

## Navigation

Pages are static, so navigation is about not waiting:

- **Chrome**: `public/speculation.json` (linked by a `Speculation-Rules` header, since the CSP forbids inline rules) prefetches the three bar pages at once and prerenders any page when its link is hovered or pressed.
- **Everywhere else**: `src/scripts/prefetch.ts` prefetches a page on pointer-over, touch or focus (Safari falls back to a low-priority fetch). It stays off for Save-Data and 2G.
- **Short transitions**: a 160 ms crossfade, the bar held still, entrance animations under 150 ms of delay.
- **Skeletons** (`NavSkeleton.astro`, `src/scripts/navigation.ts`): a progress bar starts on click, and if the next page has not landed after 150 ms the shape of it (home, list or article) shimmers in under the bar. Prerendered or prefetched pages land before that and never show it. Images shimmer until each arrives. Reduced motion turns all of it off.

`tests/fonts.test.mjs` and `tests/navigation.test.mjs` keep this: no stylesheet link, no preload, byte budgets, one script file, the cache headers and the rules.

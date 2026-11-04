# DESIGN.md: v9 "Kasavu"

Date: 2026-11-04. Supersedes v7 "Lumen". (A v8 "pinned poster" redesign was
tried the same day and dropped: it read as a template, the giant pinned name
was too much, and the page was mostly other sites' screenshots.)
Tokens live in `src/app/globals.css`; this file explains them.

## The idea

A personal site, writing first. It opens with a person and a voice:
"Hi, I'm Ashwin" and who I am in my own words, with no picture beside it. Then what I've been doing lately, then the things I've
made told as short stories, then work, writing and a way to say hello.

The palette comes from the Kerala kasavu sari, off-white cotton with a gold
zari border, set on a warm dark ground. Dark only.

## Colour

| Token | Value | Use |
|---|---|---|
| `night` | `#15120F` | Page background |
| `surface` | `#1C1814` | Panels, code |
| `surface-2` | `#24201A` | Raised or pressed surface |
| `fg` | `#EFE8DA` | Primary text (kasavu off-white) |
| `fg-2` | `#BDB2A0` | Secondary text |
| `fg-3` | `#968B7A` | Metadata |
| `zari` | `#D6AA52` | The one accent: the email address, dates in Lately |
| `line`, `line-strong` | off-white 10% / 18% | Hairlines between list rows |

Contrast on `night`: `fg` 15.3:1, `fg-2` 8.9:1, `fg-3` 5.6:1, `zari` 8.7:1.
Zari is used sparingly: never on buttons, never as a background.

## Type

- One typeface, Newsreader, a reading serif with an optical-size axis
  (6 to 72), roman and italic. `font-optical-sizing: auto` gives body copy
  the text cut and headings the display cut. Code uses the system monospace.
- Headings at weight 500, tracking -0.015em. Italic for categories and the
  email line. Body 19px, line-height 1.6; article prose 19px, 1.7, 66ch.
- Scale: `display-xl` (the greeting), `display-l`, `display-m` (section
  heads), `title`, `body`, `small`, `meta`.

## Wordmark and favicon

The wordmark is the name, "Ashwin Sathian", in the text face at 600
(`.wordmark`). The favicon is an italic Newsreader "a" in zari on night,
drawn from the font's outlines. `public/favicon.svg`, `src/app/favicon.ico`
and `public/apple-touch-icon.png` are generated from it; bump the `?v=` in
layout.tsx after changing any of them.

## Layout

- One container, `.shell`: 1200px max, gutters 20 / 32 / 48px.
- Home sections share one grid: the heading in the first three columns, the
  content in the other nine, so the page reads down one left edge.
- Lists (Lately, roles, posts) are rows divided by hairlines.
- Radius 10px controls, 16px panels and media. No drop shadows.

## Home, in order

1. Hello: the greeting as the `h1`, three short paragraphs (`data/home.ts`)
   and contact links. Text only. The Penny Software line covers the whole
   role (architecture, growth, the team), not one feature.
2. Lately: dated entries, newest first, each linking to its proof.
3. Things I've made: each featured project as a short story (what prompted
   it, what it does) with one in-app picture or a real code sample,
   alternating sides; the rest as one-line entries.
4. Work: one paragraph and the role list.
5. Writing: the latest posts.
6. Say hello: the email address, large, in italic zari, and the time in
   Kochi right now (`home/KochiTime`; the server HTML states the time zone,
   so it reads fine without JavaScript).

## Motion

One easing, `cubic-bezier(0.16, 1, 0.3, 1)`. CSS only and quiet. Headings
settle in as one piece (a 0.7s fade with 6px of lift); there is no per-word
animation. Load and scroll reveals move 6 to 10px and start part-visible.
Underline and arrow feedback on links; page transitions through React
`<ViewTransition>`.
Nothing is hidden in server HTML waiting for JavaScript; every `:hover`
has an `:active` or `:focus-visible` twin; `prefers-reduced-motion` turns
it all off.

## Content rules

- Facts in `src/app/data` come from the project's GitHub repo, checked at
  the time of writing. The repo wins over the résumé and older site copy.
- Home copy restates facts already in the data files or the posts.
- Only finished, released work is featured. Unreleased work carries a
  `status` tag.
- First person, plain and specific. No em dashes, no stock AI vocabulary.

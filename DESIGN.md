# DESIGN.md — v6.0 "Redline"

Date: 2026-09-17
Supersedes: v5.x "Field Notes" (paper/ink, Decision Record, single-amber-accent
identity shipped through commit `dd86fac`)

Full spec, content plan, and IA: `docs/superpowers/specs/2026-09-17-product-engineer-repositioning-design.md`.
This file covers design tokens only, per standing instruction to write this
before touching layout code.

## Why "Redline"

The repositioning is from "engineering leader" to "product/founding engineer
— spec to shipped code, personally, no PM or EM layer in between." A redline
is the correction an engineer marks directly on a drawing before it's built —
made by the person who's actually going to build it, not routed through a
draftsman. That's the identity's one real idea. Everything else stays quiet
so the redline mark means something when it appears.

## Color

| Token | Hex | Role |
|---|---|---|
| `canvas` | `#0A0B0D` | Page background. Near-black, not pure black. `color-scheme: dark` set unconditionally — no `prefers-color-scheme` fork (verified in the previous redesign that browsers report "no OS preference" as a `light` match, which would make a conditional light variant the de facto default for most visitors). |
| `canvas-raised` | `#131417` | Card/panel surfaces, code blocks. |
| `ink` | `#EDEEF0` | Primary text. Neutral cool off-white, not warm — the old identity's warm ink was tied to its amber accent; a cooler neutral keeps the one warm color (the accent) from competing with the text color for attention. |
| `ink-muted` | `#8B8E94` | Secondary text, metadata, captions. |
| `line` | `#24262A` | Hairline borders (1px only — no drop shadows anywhere). |
| `accent` | `#E8492A` | The redline. Links, primary CTA, active states, the Decision Record's "after" line, the on-load underline draw. **One accent, one job everywhere it appears** — no second hue introduced for "success" or "shipped" states. |
| `accent-pressed` | `#C43F23` | Hover/active state for accent-colored interactive elements. Same hue, darkened ~15%, not a second color. |

Contrast, computed (not eyeballed — the last two redesigns shipped an accent
that failed WCAG AA and needed a post-hoc fix):

- `accent` (`#E8492A`) on `canvas` (`#0A0B0D`): **5.1:1** — clears AA (4.5:1)
  for normal text, not just large/UI elements.
- `ink` on `canvas`: >15:1.

Rejected explicitly, per the banned-pattern list: purple-to-blue gradients,
neon cyan/violet glow, and the previous identity's own single-amber-accent
formula (not banned, just already used — a genuinely fresh identity needs a
new hue, not a re-hue).

## Type

Single sans family across display, body, and UI — **Public Sans** (variable,
weights 300–900). Chosen over the first draft's Red Hat Display because
Public Sans is explicitly designed (USWDS) to hold up at both heading and
body-copy sizes; Red Hat Display is a display-only optical size and would
have hurt long-form reading in project case studies. Real weight contrast:
300–400 for body copy, 500 for UI chrome (nav, buttons, labels), 700–800 for
headlines — not left at default weight throughout.

**Martian Mono** (variable, weight + width axes) for data only: dates,
metadata, the Decision Record's diff lines, code snippets, version strings.
Deliberately not JetBrains Mono, which the previous identity already used —
picked for its condensed/technical-drawing character, which fits a redline
metaphor better than a code-editor mono would. Used with intent (per the
brief's own rule): never for headlines or body copy.

## Spacing & radius

4px base unit: `4, 8, 12, 16, 24, 32, 48, 64, 96, 128`.

Radius capped small and mostly sharp-cornered, on purpose — this is a
blueprint/spec register, not a soft rounded-card one:

- `radius-xs: 2px` — tags, buttons, small chips.
- `radius-sm: 4px` — cards, panels. Nothing in the system goes larger.

No shadows. Elevation is a 1px `line`-colored border, full stop — this also
sidesteps the "untouched shadcn card" tell (`rounded-2xl shadow-lg p-6`) by
construction, not by remembering to avoid it.

## Motion

One orchestrated load sequence, everything else static:

- **Home load**: the one-line thesis settles in, then a single `accent`
  rule draws itself under it once — the redline mark landing, literally,
  the one time the metaphor gets to be visual instead of just verbal.
- **Decision Record reveal**: unchanged mechanism from the previous
  identity (CSS `animation-timeline: view()`, diff lines clip-path in) —
  it already only fires once per element and degrades to instant under
  `prefers-reduced-motion`, no reason to rebuild working, correct code.
- **Hover/focus**: real, considered, CSS-only — border draw-in on cards,
  underline draw on nav/inline links, accent → accent-pressed on active
  states. No fade-in applied uniformly to everything.
- `prefers-reduced-motion: reduce` collapses all three to instant/no-op.

**Correction from the first draft of this doc**: `framer-motion` is not
already removed — it's a live dependency (`src/lib/motion.ts`,
`Reveal.tsx`, `Projects.tsx`), and `Reveal`/`RevealGroup` currently wrap
`Summary`, `HomeExperience`, `HomeSkills`, and others in a scroll-triggered
`whileInView` fade — the identical-fade-on-every-element pattern this brief
bans. This rebuild touches `Summary.tsx`, `HomeExperience.tsx`, and
`HomeSkills.tsx` anyway for copy; while in those files, their `Reveal`
wrappers come out in favor of the existing static/CSS `.load-fade-up`
pattern the Hero already uses. `Reveal`, `lib/motion.ts`, and
`framer-motion` itself stay in the tree for now — `Projects.tsx`,
`Skills.tsx`, `HomeProjects.tsx`, `ExperienceContent.tsx`, and
`writing/PostList.tsx` also consume it and are out of scope for this
repositioning-focused rebuild. A full framer-motion removal is a real,
separate cleanup, not bundled into this task.

# Portfolio redesign: "Field Notes" — v5.0

Date: 2026-08-18
Status: approved, pending implementation plan
Supersedes: v4.0 "Verified, not vibes" (2026-08-18, commit d55dc06 and prior)

## 1. Why this exists

An adversarial review of the current site (see conversation log; not duplicated
here) found a well-executed but generic result: the current dark-canvas +
signal-green + IBM Plex + single-page-scroller shape is the default formula
for 2025–26 developer portfolios, and the repeated `// verified · X` device
reads as a nervous tic rather than a rigor signal once it appears on every
pill, tag, and fact card. The user asked for a full rebuild with no deference
to the current design system, copy register, or structure — full latitude to
change layout, routing, pages, and content strategy.

Two structural decisions were confirmed with the user before this spec was
written:

- **Multi-page site**, not a single scrolling homepage with anchor nav.
- **New visual identity from scratch** — not a re-hue of the current dark
  formula.

Two content decisions were also confirmed:

- About page stays **text/type-only**, no photo.
- Experience copy stays **qualitative but sharpened** — no invented metrics.
  (Real, already-published figures from `public/llms.txt` — $1B+ GTV,
  sub-200ms query optimization, ~12 engineers mentored, 1.5× release cadence —
  are fair game since they're verified facts already public, not fabrication.)

## 2. The idea the whole design is built from

Across Ashwin's real shipped projects, one trait recurs and is unusual for a
portfolio: **he discloses his own reversals.** Booklet shipped on Cloudflare
Workers, then rolled back to a self-hosted process once the tradeoffs showed
up in production. Wayfarer was renamed from API Sandbox mid-life. Typester is
a ground-up rebuild of a 2018 app, with an `ARCHITECTURE.md` that logs each
past defect and the reasoning that replaced it. Most portfolios only show the
finished, polished state. This one has the receipts for the changes of mind
along the way — that's the actual differentiator, not a repeated badge
claiming trustworthiness.

The site is built around that: **a running engineering log**, not a
marketing landing page. Structural devices (dates, before/after decision
records) are used only where the underlying content genuinely has a
timeline or a reversal — never as decoration.

## 3. Information architecture

Multi-page, App Router, one route per concern:

| Route | Purpose |
|---|---|
| `/` | Thesis statement (who, in one screen, no dead hero void) + a "Recent" strip of 2–3 real dated log entries pulled from project/experience history + entry points to the four sections below |
| `/projects` | Index of all projects, same evidence-forward facts the current site has, restructured (see §5) |
| `/projects/[slug]` | Case study — genuinely differentiated from the index teaser: full narrative, and for the three projects with a real reversal (Booklet, Wayfarer, Typester), a **Decision Record** component |
| `/experience` | Rewritten role-by-role, same specificity standard as Projects, using only verified figures |
| `/about` | New. Text-only. The "who and why" the current site never states |
| `/writing` | Kept (infra already exists in `src/lib/writing.ts` / `src/content/writing/`), but **removed from primary nav** until it holds real posts — a nav item pointing at "nothing published yet" is worse than no nav item. Reachable via footer + sitemap. Restore to primary nav on first real post. |
| Contact | No longer a full-viewport section. Folds into the footer (persistent, every page) as a compact module: mailto, LinkedIn, GitHub, one line on response expectations. |

Nav becomes real `<Link>`s to real routes — no more dual model of anchor-scroll
+ conditional-route-detection in one component.

## 4. Visual identity

Rejecting both AI-default clusters explicitly: not warm-cream-serif-terracotta,
not near-black-plus-one-bright-accent. Landing on a **cool paper / document**
register instead — it fits a site organized as a log/spec record, and neither
default cluster reads that way.

### Color tokens

| Token | Hex | Role |
|---|---|---|
| `paper` | `#EEF0F1` | Page background — cool stone, not warm cream |
| `paper-raised` | `#E4E7E8` | Card/panel backgrounds, code blocks |
| `ink` | `#14181C` | Primary text, near-black navy-charcoal (not pure black) |
| `ink-muted` | `#5B6570` | Secondary text, metadata |
| `line` | `#D3D7D9` | Hairline rules, borders |
| `accent` | `#263C8B` | Links, active states, focus rings — a "blueprint ink" blue, one job only |
| `diff-add` | `#2E7D5B` | Muted terminal-green — *only* inside Decision Record "after" states |
| `diff-remove` | `#B54B3E` | Muted brick-red — *only* inside Decision Record "before" states |

Dark mode: a `prefers-color-scheme` dark variant follows the same structure
(paper → near-black, ink → near-white, accent/diff hues adjusted for contrast)
rather than forcing `color-scheme: dark` unconditionally the way the current
site does. Implemented as CSS custom properties so it's close to free.

### Type system — three roles, none of them IBM Plex

- **Display / data face — JetBrains Mono.** Used boldly for page titles, the
  wordmark, dates, and version-style metadata. Most portfolios exile mono to
  10px captions; here it carries real headline weight because the subject
  matter (logs, versions, diffs) is genuinely mono-shaped content.
- **Body / reading face — Source Serif 4.** Long-form prose only: project
  narratives, About, Writing. A serif built for reading technical content
  at length, not a decorative editorial serif.
- **UI / label face — Archivo.** Nav, buttons, eyebrows, form-adjacent chrome.
  Quiet, gets out of the way.

### Signature element — the Decision Record

A dated, permalinked block used only on the three project case studies that
have a real documented reversal:

```
┌─ DECISION · 2026-05 ──────────────────────────┐
│ − Cloudflare Workers via OpenNext              │  (diff-remove)
│ + Self-hosted Node process, Cloudflare Tunnel  │  (diff-add)
│                                                  │
│ Why: [one real, specific sentence from the      │
│ existing project copy]                          │
└──────────────────────────────────────────────────┘
```

Real diff syntax (`−`/`+`), real dates, real reasoning already written for
these projects — reformatted, not invented. This is the one place the design
spends its boldness; everything else stays quiet paper/ink/serif.

### Motion

Near-total removal of the current blanket `whileInView`-on-every-element
pattern (framer-motion dependency likely drops entirely — CSS transitions and
`@media (prefers-reduced-motion: reduce)` cover everything this site actually
needs: hover states, focus rings, one optional orchestrated reveal on the
home thesis load). This also fixes the adversarial finding that content
disappears when scroll-triggered JS doesn't fire cleanly (bots, slow
hydration, some crawlers).

## 5. Content plan by page

**Home (`/`)** — Identity stated once, plainly, above the fold, no void:
name, one-line thesis, current focus. Below it, a "Recent" log strip: 2–3
real dated entries (e.g. the Booklet rollback, a role change, a project
ship) with permalinks into the fuller story. Then four labeled paths:
Projects, Experience, Writing (only once it has posts), About. Footer
contact module on every page from here down.

**Projects index + case studies** — Keep every verified fact already in
`src/app/data/projects.ts` (stack, license, architecture facts, highlights).
Rewrite the "verified" pill styling: drop the repeated `// verified · X`
stamp (VerifiedTag component retired), let facts stand on their own — a
fact stated once, plainly, in a document register, doesn't need a badge
asserting it's true. Case studies add the Decision Record for Booklet
(Workers → self-hosted), Wayfarer (rename, API Sandbox → Wayfarer), and
Typester (2018 rebuild, defect-by-defect).

**Experience (`/experience`)** — One entry per role, dated, same specificity
standard as Projects. Pull the real, already-published figures from
`llms.txt` into the HighLevel and Penny Software entries (~12 engineers
mentored, sub-200ms critical query optimization, $1B+ GTV, 1.5× release
cadence) instead of the current generic "Led the team..." bullets. No
numbers beyond what's already published anywhere on the site today.

**About (`/about`)** — New page. Text-only. States: who this is, the
throughline connecting NIT Calicut → the career path → why he builds and
ships real side products outside of work, and the actual engineering
philosophy the Decision Record device is evidence of (shipping the wrong
call first is sometimes how you find the right one — Booklet is the literal
example). Written from real, existing facts already elsewhere on the site
(bio paragraph in `llms.txt`, `PLATFORM` data, project descriptions) —
synthesized into a real narrative, not resume bullets restated.

**Writing (`/writing`)** — Keep current empty-state infra but redesign the
empty state itself as a real, well-composed "log has no entries yet" state
in the new visual language, consistent with a changelog metaphor (not an
apology). Removed from primary nav per §3 until real posts exist.

## 6. Technical approach

- Next.js App Router structure stays; routes reorganized per §3.
- `framer-motion` dependency: removed if nothing in the rebuilt design
  needs spring/gesture physics CSS can't do (expected outcome). Confirmed
  during implementation, not assumed here.
- `src/lib/github.ts`, `src/lib/writing.ts`, `src/app/(helpers)/projects.ts`:
  kept, logic unchanged — live GitHub stats and the Markdown writing
  pipeline are infrastructure, not presentation, and both still verified
  as correct.
- `src/app/data/*.ts`: content re-authored in place (copy rewrites), types
  largely stable; `VerifiedTag.tsx` component retired since the badge
  device is dropped (§5).
- New `DecisionRecord` component for the signature element, used only on
  the three qualifying project pages.
- SEO/structured data (Person/WebSite/ProfilePage/SoftwareApplication/
  BreadcrumbList JSON-LD, OG image route, sitemap, robots, `llms.txt`):
  preserved and updated to match the new IA (new `/about` and `/experience`
  routes added to sitemap; nav-related copy in `llms.txt` updated if the
  Writing nav demotion changes how it should be described).
- Accessibility floor: visible focus rings (existing pattern is reasonable,
  carried forward), `prefers-reduced-motion` respected, semantic landmarks
  per page, color contrast re-verified against the new paper/ink palette
  (particularly `ink-muted` on `paper` and `diff-add`/`diff-remove` in the
  Decision Record, since muted diff colors on light paper need explicit
  contrast checking, not just visual eyeballing).
- Responsive floor: mobile-first, same discipline as current site's
  breakpoint usage.

## 7. What this explicitly does not do

- No fabricated metrics anywhere (Experience or elsewhere).
- No photo on About (per user decision).
- No feature-flagging or backwards-compat shims for the old design — this is
  a clean replacement, not a toggle.
- No new third-party services, analytics, or CMS — same static/ISR model,
  same Cloudflare Workers deploy path via OpenNext.

## 8. Open items for the implementation plan

- Exact home-page "Recent" log entries to feature (likely: Booklet rollback,
  most recent role, most recent shipped project) — finalize during
  implementation using only existing verified facts.
- Whether `framer-motion` is fully removable or partially retained for one
  orchestrated home-load moment — decide during implementation, remove the
  dependency if unused.
- Dark-mode contrast tokens (§4) need explicit values chosen and
  contrast-checked, not just "adjusted for contrast" as written here.

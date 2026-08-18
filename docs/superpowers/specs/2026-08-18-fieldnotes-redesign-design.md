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

Mid-brainstorm, the user supplied an updated resume (`~/Downloads/Resume.pdf`)
and asked that the Projects section be built from a live GitHub scan rather
than the current site's fixed list — "go beyond the basics." The resume adds
one more verifiable figure not previously on the site (40%+ API/query
response-time improvement, Product Specialist era) and a materially different
AI-tooling list (Claude Code, Claude Cowork, Claude Design, OpenAI Codex —
GitHub Copilot dropped). A scan of `github.com/AshwinSathian`'s public,
non-fork, non-archived repos turned up three substantial, currently-active
projects not on the site today (§5.1). Also per the user's mid-brainstorm
instruction: any project screenshot captured or recaptured for this redesign
should use the project's own light-mode UI where the project supports
theming, so it sits naturally in the site's paper-toned frame rather than
clashing (§6).

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
name, one-line thesis, current focus. Below it, a "Recent" log strip: 3
real dated entries pulled from the now-current material, e.g. "2026-08-17 —
Published humanize-writing-skill", "2026-08-10 — Renamed Umbra to Darkframe
after finding a naming collision in the Chrome Web Store", "2026-05 —
Rolled Booklet off Cloudflare Workers back to a self-hosted process" — each
a permalink into the fuller story. Then four labeled paths: Projects,
Experience, Writing (only once it has posts), About. Footer contact module
on every page from here down.

**Projects index + case studies** — Keep every verified fact already in
`src/app/data/projects.ts` (stack, license, architecture facts, highlights).
Rewrite the "verified" pill styling: drop the repeated `// verified · X`
stamp (VerifiedTag component retired), let facts stand on their own — a
fact stated once, plainly, in a document register, doesn't need a badge
asserting it's true. Case studies add the Decision Record for Booklet
(Workers → self-hosted), Wayfarer (rename, API Sandbox → Wayfarer),
Darkframe (rename, Umbra → Darkframe, §5.1), and Typester (2018 rebuild,
defect-by-defect).

### 5.1 Expanded project lineup (from the GitHub scan)

The current site lists five projects. The GitHub scan of `AshwinSathian`'s
public, non-fork repos found three more that are substantial, currently
active (all pushed to within the last two weeks), and independently
verifiable — real evidence, not filler:

- **Darkframe** (repo `umbra`, package/branding `darkframe`) — a free,
  open-source, image-safe dark-mode browser engine for Chrome and Safari.
  OKLCH-native recoloring, a WCAG 2.1 contrast solver, non-destructive CSS
  Cascade Layers injection, an image/video classifier that never recolors
  photos or video, 144 passing unit tests, a real E2E-verified Chrome MV3
  extension, a real buildable Safari Xcode project, MIT. This is the
  strongest Decision Record candidate on the whole site: the project
  shipped under the name "Umbra," and its own `CHANGELOG.md` documents a
  full rename to "Darkframe" (npm scope, extension name, storage keys, CSS
  layer name, Xcode project) after finding an existing, active,
  same-category Chrome extension called "Umbra Dark Mode" during a
  shipping-readiness review — plus a disclosed, fixed High-severity CSS
  injection vulnerability in the same changelog. Both are real, dated,
  checkable events.
- **better-auth-mongoose** — a published npm package (`0.1.1`, live) that
  closes a real, long-documented gap in the Better Auth ecosystem (cites
  specific upstream GitHub issues/discussions by number): a Mongoose-native
  database adapter so `.populate()`, schema validation, and hooks work
  against Better Auth's own collections instead of forcing a parallel raw
  `mongodb` connection. Turborepo + Changesets, CI + CodeQL, a companion
  tenant-scoping plugin, a real NestJS integration example that runs in CI,
  its own docs site (`better-auth-mongoose.ashwinsathian.com`). MIT.
- **humanize-writing-skill** — a Claude Code skill (published days before
  this redesign began) that changes how an AI writes so the output reads as
  a specific, considered human voice rather than generic AI-shaped prose.
  Built from three cited research passes (academic detection literature,
  editorial style guides, a 27-item catalog of AI-writing tells) plus a
  teardown of 13 existing public "humanizer" skills, all in `reference/`,
  not asserted from folk wisdom. Directly evidences the "AI-augmented,
  not AI-replaced" positioning with a real built artifact instead of a
  buzzword — arguably the single most on-thesis project on the site.
  Distributed three ways (git+symlink, Claude Code plugin manifest,
  `npx skills add`). MIT.

`github-issue-analyzer` (Fastify + SQLite + local-LLM issue triage over
Ollama) is real and complete but smaller in scope and less differentiated
than the other seven — it gets a one-line mention in a lighter "Also
shipped" list on the Projects index, not a full case study. `angularCalc`
and `bing-distance-matrix` are archived learning-era repos and are excluded
per the existing curation bar (the current site already only lists
substantial, maintained work).

Final case-study lineup (8): Booklet, BRNR, Wayfarer, ngx-runtime-i18n,
Typester, Darkframe, better-auth-mongoose, humanize-writing-skill.

**Experience (`/experience`)** — One entry per role, dated, same specificity
standard as Projects. Pull the real, verified figures from `llms.txt` and
the updated resume into the HighLevel and Penny Software entries (~12
engineers mentored, sub-200ms critical query optimization, $1B+ GTV, 1.5×
release-cadence acceleration, 40%+ API/query response-time improvement in
the Product Specialist era) instead of the current generic "Led the
team..." bullets. Skills/tooling list also updates to match the resume's
current AI-tooling set (Claude Code, Claude Cowork, Claude Design, OpenAI
Codex — GitHub Copilot is no longer on the resume and drops from the site).
No numbers beyond what's already published across the resume or the
current site.

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
- Project screenshots: for the three new projects (§5.1) and any recapture
  of existing ones, use each project's own **light-mode** UI where the
  project supports theming, so the screenshot sits naturally in the site's
  paper-toned frame rather than clashing with it (user instruction,
  mid-brainstorm). Darkframe's own popup/options UI and any inherently
  dark-only surface (e.g. a terminal capture) are exempt where no light
  variant exists — the surrounding device-chrome frame still uses the
  site's own palette either way.
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

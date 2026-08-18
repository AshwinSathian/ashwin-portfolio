# Portfolio redesign: "Field Notes" — v5.0

Date: 2026-08-18
Status: approved (incl. §1.1 revisions), proceeding to implementation plan
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
| `/projects/[slug]` | Case study — genuinely differentiated from the index teaser: full narrative, and for the four projects with a real reversal (Booklet, Wayfarer, Darkframe, Typester), a **Decision Record** component |
| `/experience` | Rewritten role-by-role, same specificity standard as Projects, using only verified figures |
| `/about` | New. Text-only. The "who and why" the current site never states |
| `/writing` | Kept **in primary nav** (user override, §1.1): the user is populating it with real posts in the next working session, so the empty state is a known, temporary in-progress state rather than a stale dead end. Empty state redesigned as a real "log has no entries yet" moment (§5), not an apology. |
| Contact | Redesigned, not simply demoted (§4.1): a persistent, confident contact module rather than the current one-time full-viewport section. |

### 1.1 Post-spec revisions (user, second review round)

Four changes on top of the approved design above, given full latitude to
judge execution:

1. **`/writing` stays in primary nav.** The user is working with Claude in
   the next session specifically to add posts, so the empty state is
   short-lived, not permanent — the objection to a dead nav link doesn't
   apply here. IA table above updated accordingly.
2. **Contact keeps its confidence, loses its dead end.** The user flagged
   the current full-viewport "Let's talk." section as genuinely good — the
   fix isn't to shrink it into a footer line, it's to keep that
   declarative confidence but make it persistent instead of a one-time
   scroll-past. See §4.1.
3. **About is explicitly an expansion of the resume's Professional
   Summary**, not a fresh synthesis from scattered bio fragments. See §5
   revision.
4. **The paper/ink palette needs more life.** Approved direction stays
   (reject both AI-default clusters), but as originally scoped it read as
   too flat/quiet. See §4 revision: a wider functional color range, a
   textural device, and real (if restrained) motion brought back.

Nav becomes real `<Link>`s to real routes — no more dual model of anchor-scroll
+ conditional-route-detection in one component.

## 4. Visual identity

Rejecting both AI-default clusters explicitly: not warm-cream-serif-terracotta,
not near-black-plus-one-bright-accent. Landing on a **cool paper / document**
register instead — it fits a site organized as a log/spec record, and neither
default cluster reads that way. Revised per §1.1(4): the base register stays,
but with a wider functional color range, one textural device, and real
(if restrained) motion, so it reads as a living notebook, not a blank form.

### Color tokens

| Token | Hex | Role |
|---|---|---|
| `paper` | `#EEF0F1` | Page background — cool stone, not warm cream |
| `paper-raised` | `#E4E7E8` | Card/panel backgrounds, code blocks |
| `ink` | `#14181C` | Primary text, near-black navy-charcoal (not pure black) |
| `ink-muted` | `#5B6570` | Secondary text, metadata |
| `line` | `#D3D7D9` | Hairline rules, borders |
| `accent` | `#263C8B` | Primary UI accent — a "blueprint ink" blue: links, focus rings, primary CTA |
| `signal` | `#C8712E` | Second accent — a warm, confident copper/amber: active nav state, the Contact module, key numerals/dates. Gives the palette a second temperature so it isn't one hue doing every job |
| `diff-add` | `#2E7D5B` | Terminal-green — Decision Record "after" states, and reused functionally as the "live/shipped" status marker across Projects |
| `diff-remove` | `#B54B3E` | Brick-red — Decision Record "before" states, and reused functionally as the "deprecated/renamed-from" status marker |

Four working colors (accent, signal, diff-add, diff-remove) instead of one,
but each is assigned a specific job and never just decorative — that's what
keeps this from becoming a second, busier cliché. Texture: a faint
dot-grid/graph-paper pattern (a few percent opacity, `ink` on `paper`) sits
behind hero and section-opening moments — engineering-notebook texture, not
a gimmick — and disappears entirely under `prefers-contrast: more` and in
dense text regions where it would hurt legibility.

Dark mode: a `prefers-color-scheme` dark variant follows the same structure
(paper → near-black, ink → near-white, all four accents re-tuned for
contrast on dark) rather than forcing `color-scheme: dark` unconditionally
the way the current site does. Implemented as CSS custom properties so it's
close to free.

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

A dated, permalinked block used only on the four project case studies that
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

The blanket `whileInView`-fade-on-every-element pattern is still gone (it's
what made everything disappear when scroll-triggered JS doesn't fire
cleanly — bots, slow hydration, some crawlers). But per §1.1(4), motion
isn't reduced to nothing — it's concentrated into a small number of real,
purposeful moments instead of smeared across every paragraph:

- **Home load**: one orchestrated sequence — the thesis statement and the
  Recent log strip's entries settle in with a short stagger, once, on
  first paint.
- **Decision Record reveal**: when a Decision Record scrolls into view, its
  `−`/`+` lines draw in like a diff being applied — the one place motion
  directly dramatizes what the content *is*, not just decoration.
- **Hover/focus micro-interactions**: nav links, cards, and buttons get a
  real, considered interaction (underline draw, a hairline expanding into
  a card border, the accent-to-signal color shift on active nav) — CSS
  only, no JS observer needed.
- Everything else is static. `prefers-reduced-motion: reduce` collapses
  all three categories above to instant/no-op, same as before.

`framer-motion` is dropped: CSS transitions/animations plus the native
`@starting-style`/scroll-driven-animation primitives cover all of the
above at zero JS-bundle cost, which a purely presentational, mostly-static
personal site doesn't need a physics library for.

### 4.1 Contact, redesigned (not demoted)

The current full-viewport "Let's talk." moment is genuinely good — bold,
declarative, memorable — the review's complaint was that it's a one-time
dead end at the bottom of a single scroll, not that it's too confident. In
a multi-page site the fix is to make that confidence persistent: a
**Contact band** — full-width, generous vertical padding (not a full
viewport, but a real visual event, not a footer afterthought), large
JetBrains Mono "Let's talk." set in the `signal` copper accent, the mailto
as the one large piece of type beneath it — rendered at the bottom of
*every* page, above a slim, quiet copyright footer. Every page ends on the
same confident invitation instead of only the homepage having one.

## 5. Content plan by page

**Home (`/`)** — Identity stated once, plainly, above the fold, no void:
name, one-line thesis, current focus. Below it, a "Recent" log strip: 3
real dated entries pulled from the now-current material, e.g. "2026-08-17 —
Published humanize-writing-skill", "2026-08-10 — Renamed Umbra to Darkframe
after finding a naming collision in the Chrome Web Store", "2026-05 —
Rolled Booklet off Cloudflare Workers back to a self-hosted process" — each
a permalink into the fuller story. Then four labeled paths: Projects,
Experience, Writing, About (all in primary nav per §1.1). Contact band
(§4.1) on every page from here down.

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

**About (`/about`)** — New page. Text-only. Per §1.1(3), the source text is
specifically the resume's Professional Summary paragraph — "Engineering
leader with 7+ years of experience building and scaling enterprise-grade
SaaS platforms supporting thousands of users, millions of records, and $1B+
in gross transaction value... Recognised for owning technical strategy,
shaping engineering culture, and facilitating teams to deliver secure,
customer-centric solutions" — expanded into a real page, not restated as
resume bullets. The summary is four dense, generic-sounding clauses; the
job here is to unpack each one with the specific, checkable material that's
already documented elsewhere on the site: "architecting multi-tenant,
high-performance systems" → the actual RBAC/tenancy-isolation/sub-200ms
work at Penny Software; "accelerating release cycles" → the real 1.5×
figure and what changed to produce it; "shaping engineering culture" → the
12-engineer mentorship and code-review standards; and the one thing the
resume summary doesn't mention at all — why an engineering leader with a
full-time lead role also ships eight independent products in his own time,
each with its own disclosed reversal. That last thread is the connective
tissue between the resume's corporate register and the Decision Record
device elsewhere on the site: the same person who owns technical strategy
professionally is the one who publishes his own rename and rollback
decisions publicly. NIT Calicut appears as the one biographical anchor,
not as a coming-of-age narrative.

**Writing (`/writing`)** — Stays in primary nav (§1.1). Current empty-state
infra kept; empty state redesigned as a real, well-composed "log has no
entries yet" moment in the new visual language — a changelog with an
`[Unreleased]` header and nothing under it yet, not an apology — since the
user is populating it with real posts in the working session right after
this one.

## 6. Technical approach

- Next.js App Router structure stays; routes reorganized per §3.
- `framer-motion` dependency: dropped per §4 Motion — CSS covers the
  motion this design actually uses.
- `src/lib/github.ts`, `src/lib/writing.ts`, `src/app/(helpers)/projects.ts`:
  kept, logic unchanged — live GitHub stats and the Markdown writing
  pipeline are infrastructure, not presentation, and both still verified
  as correct.
- `src/app/data/*.ts`: content re-authored in place (copy rewrites), types
  extended to carry the 3 new projects (§5.1) and Decision Record fields;
  `VerifiedTag.tsx` component retired since the badge device is dropped
  (§5).
- New `DecisionRecord` component for the signature element, used on the
  four qualifying project pages (Booklet, Wayfarer, Darkframe, Typester).
- SEO/structured data (Person/WebSite/ProfilePage/SoftwareApplication/
  BreadcrumbList JSON-LD, OG image route, sitemap, robots, `llms.txt`):
  preserved and updated to match the new IA (new `/about` and `/experience`
  routes added to sitemap and nav; `llms.txt` updated for the 3 new
  projects, the updated AI-tooling list, and the new resume figure).
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

- Exact home-page "Recent" log entries — candidates listed in §5, finalize
  exact wording/order during implementation using only existing verified
  facts.
- Dark-mode values for all four accent tokens (§4) need to be chosen and
  contrast-checked (WCAG AA minimum, both against `paper`/dark-`paper` and
  against each other where they appear adjacent, e.g. `diff-add` next to
  `diff-remove` in a Decision Record) — not just "re-tuned for contrast" as
  written here.
- Dot-grid texture (§4): confirm opacity/contrast against `prefers-contrast:
  more` and verify it doesn't degrade text legibility in Safari/Firefox at
  common zoom levels, not just Chrome.

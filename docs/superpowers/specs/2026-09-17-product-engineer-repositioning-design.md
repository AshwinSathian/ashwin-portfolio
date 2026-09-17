# Portfolio repositioning: "Redline" — v6.0

Date: 2026-09-17
Status: approved (visual identity + facts confirmed via AskUserQuestion and
an adversarial review round), proceeding to implementation plan
Supersedes: v5.x "Field Notes" (paper/ink, multi-accent, Decision Record
shipped through commit `dd86fac`)
Design tokens: `DESIGN.md` (repo root)

## 1. Why this exists

Ashwin's resume has been repositioned from "engineering leader / people
manager" to "Product Engineer / Founding Engineer" — someone who takes a
customer's raw ask through spec, architecture, and shipped code personally,
with no PM or EM layer in between. The live site currently states the
opposite framing in multiple places: the homepage `SUMMARY` opens with
"Engineering leader with eight years..."; the hero eyebrow reads
"AI-Augmented Engineer · 8+ years"; `layout.tsx`'s title tags, OG tags, and
`Person` JSON-LD all use "AI-Augmented Senior Full-Stack Engineer" as the
`jobTitle`; Experience bullets lead with "Led engineering," "Drove the
AI-augmented... effort," "Mentored and directed a 12-person team." None of
this is factually wrong, but it's the wrong lead — this rebuild reorders
what's stated first and cuts the words the brief explicitly bans (leader,
AI-Augmented, engineering culture) from anywhere they're currently the
headline framing.

Full creative latitude on UI/UX/layout/routing/copy was given, with two hard
constraints: stays dark/near-black, stays sans-serif. Two structural
decisions were confirmed via `AskUserQuestion` before this spec was written:

- **Fresh visual identity**, not a re-skin of the current dark/amber system
  (even though that system already clears every banned pattern — the user
  chose full replacement over evolution).
- **No standalone `/about` page.** Identity and narrative stay folded into
  home + case studies + experience, in service of the "evaluate in under 30
  seconds" goal.

One fact correction was made mid-brainstorm: the current HighLevel bullet's
"60,000+ marketing agencies" figure isn't in the facts supplied for this
rebuild and is dropped.

## 2. Adversarial findings (from a direct scan of the Booklet source repo)

The brief specifically asked for a real architecture diagram on the
strongest technical case study, with a hard rule against claiming anything
not present or published. A full scan of `~/Documents/Personal/booklet`
(not the site's copy, the actual repo) found the current site copy has
drifted in ways that matter for exactly this case study:

- **`readable-cli` is dead.** `npm view readable-cli` returns a 404 —
  unpublished 2026-08-10. The site's current `links.npm` points at a
  package that no longer exists. The actual published package (verified via
  `packages/cli/package.json` and `npm view booklet-cli version`) is
  **`booklet-cli`, v1.0.2**. This is a live broken link on the current site,
  independent of the redesign — fixing it is in scope regardless.
- **A real interface is missing from the site entirely.** `packages/vscode`
  is a real, published VS Code extension (`booklet-vscode`, v0.2.0,
  `CHANGELOG.md` confirms "First public Marketplace release"). It publishes
  Markdown straight from the editor via the same REST API the CLI and
  GitHub Action use. Nothing on the site mentions it. This directly
  strengthens the "owns a full product surface" argument the diagram exists
  to make — it's the single best piece of evidence found during this pass
  and should be added, not just fixed.
- **MCP tool count is off by one.** `mcp-server/src/mcp-server.ts` registers
  five tools (`publish_page`, `update_page`, `get_page`, `list_pages`,
  `delete_page`); the site currently lists four, omitting `get_page`.
- **Confirmed accurate, no change needed**: argon2id password hashing
  (`src/lib/auth/password.ts`), MongoDB as the store, a dedicated SSRF guard
  (`src/lib/ssrf-guard.ts`) and origin-check module
  (`src/lib/auth/origin-check.ts`), the self-hosted PM2 deployment
  (`ecosystem.config.js`: `booklet-app` on `:3100`, `booklet-mcp` bridge on
  `:8788`) behind a Cloudflare Tunnel (`scripts/setup-server.sh`,
  `README.md` §Deployment), the 2026-05-25 rollback from Cloudflare
  Workers/OpenNext, the GitHub Action as a separate real repo
  (`AshwinSathian/publish-to-booklet`, real `action.yml`, MIT), and MIT
  licensing on the main app.

## 3. The idea the identity is built from

See `DESIGN.md` §"Why Redline." A redline is a correction made directly on
the drawing by the person who's going to build it — no draftsman in
between. That's the visual metaphor for "no PM or EM layer between the ask
and the shipped code." The Decision Record device from the previous
identity is kept **structurally** (it already is a problem → decision →
outcome record, which is exactly what the brief asks case studies to be
built from) but is reframed: previously it existed to prove "I disclose my
own reversals" as a trust signal; now it's simply the evidence format for
decisions made and owned personally. Visually it's rebuilt under the new
tokens — before/after states are distinguished by strikethrough + dimming
vs. full-strength `accent`, not a second red/green color pair, which keeps
the palette to one working accent color as the brief requires and is a
genuine accessibility improvement (dual-coded via symbol and weight, not
color alone).

## 4. Information architecture

Unchanged route shape, content rewritten:

| Route | Change |
|---|---|
| `/` | Hero rewritten to a one-line ownership statement (not a title, not "AI-Augmented"). A short "how I work" passage (spec → build → ship, personally) in prose — explicitly **not** a numbered 1-2-3 step row, which is a banned pattern. No standalone About. |
| `/projects` | Same four featured case studies (Booklet, BRNR, Wayfarer, Darkframe — already `featured: true` in `projects.ts`, no data restructuring needed there), copy rewritten. |
| `/projects/[slug]` | Each case study restructured under explicit **Problem / Decision / Outcome** framing (replacing the current two free-flow paragraphs). Booklet's case study gains the architecture diagram (§5) and the CLI/VSCode/MCP-tool-count corrections (§2). |
| `/experience` | Penny Software stays one continuous arc (dates unchanged, already correct). Founding-engineer fact added — currently absent from `experience.ts` entirely. Bullets reordered so architecture/build facts lead and mentorship is a supporting fact. Vendor Pre-Qualification System story added (new fact from the updated resume, not currently on the site anywhere). HighLevel entry states role/dates plainly, drops the 60k-agencies figure, no tenure apology. |
| `/writing`, `/writing/[slug]` | Unchanged — out of scope for this rebuild. |

## 5. Booklet architecture diagram (content, verified against source)

A real system diagram, not a mockup, showing:

- **Clients**: browser (web app), `booklet-cli` (npm), `booklet-vscode`
  (VS Code Marketplace), CI runners (via the `publish-to-booklet` GitHub
  Action), AI assistants (via the MCP server) — five real, distinct
  consumers of one API surface, not five separate backends.
- **Application tier**: Next.js 16 app (`booklet-app`, PM2, port 3100) —
  serves both the web UI and the REST API (`/api/v1/*`) that every other
  client above calls into.
- **MCP bridge**: a separate Node process (`booklet-mcp`, PM2, port 8788)
  that exposes 5 MCP tools and talks to the app tier over loopback HTTP
  (`BOOKLET_API_BASE=http://localhost:3100`) — architecturally a client of
  the same API, not a second copy of the backend.
- **Data**: MongoDB.
- **Auth**: in-house, argon2id password hashing, opaque DB-backed session
  tokens with an HMAC pepper, httpOnly/Secure/SameSite cookie.
- **Infra**: both processes run under PM2 on a single Mac, reachable via a
  Cloudflare Tunnel (`cloudflared`) — no cloud compute — annotated with the
  one-line decision-record fact that this replaced a Cloudflare
  Workers/OpenNext deployment, rolled back 2026-05-25.

Built as an inline SVG/React component under the new token system (no
canvas library, no diagramming dependency) — a static, hand-labeled diagram
is the correct scope for one diagram on one page.

## 6. Copy execution notes

- Hero one-liner: avoid the rule-of-three trap a first draft fell into
  ("take the ask, write the spec, ship it" reads as the exact banned
  parallel-triplet pattern). Two clauses, varied length, no parallel verb
  chain.
- Vendor Pre-Qualification System: the brief provides no adoption/impact
  number and explicitly forbids inventing one. Resolution: the qualitative
  story (customer vetting vendors by hand → spec → solo build, schema to
  UI) ships with no metric attached, rather than a visible bracket
  placeholder on a live page. A `// TODO: add real adoption figure when
  available` comment goes in the data file instead, so the gap is tracked
  without shipping placeholder text to visitors.
- "Product Specialist" (Penny Software, Apr 2022–Dec 2023) is stated as
  what it was — internal subject-matter-expert title — never implied as a
  PM role, per the facts brief.
- Founding-engineer fact: stated plainly once, on first mention of Penny
  Software, not repeated as a badge.
- Standard voice rules apply throughout (banned-word list, ≤1 em dash per
  section, no unearned "this shows X" tags, vary sentence length) — final
  copy pass runs through the humanize-writing-skill before commit, per
  the site's own established practice (`humanize-writing-skill` is itself
  one of the 8 shipped side projects and was used to write this site's
  existing copy).

## 7. SEO / AEO / GEO

- `layout.tsx`: title tags, OG tags, and `Person` JSON-LD `jobTitle` all
  currently read "AI-Augmented Senior Full-Stack Engineer" — replaced with
  the resume's actual stated title, "Senior Full-Stack Engineer" (a factual
  role/tenure string, kept separate from the hero's ownership one-liner,
  which is not a job title and doesn't belong in structured data as one).
  `knowsAbout` drops "Engineering leadership" in favor of terms that match
  the new positioning (system architecture, spec-to-ship ownership) without
  inventing credentials.
- `SoftwareApplication` / `BreadcrumbList` schema: unchanged structurally,
  content resynced to the corrected Booklet facts (§2) and the new project
  copy.
- `llms.txt`: resynced to match — no "AI-Augmented" framing, updated
  Booklet facts (CLI package name, VS Code extension, MCP tool count),
  updated Experience section.
- No new schema types added. No FAQ schema (the site has already been
  burned once by shipping structured data with no matching visible
  content — not repeating that).

## 8. Technical approach

- `DESIGN.md` tokens (`canvas`/`ink`/`accent`/etc., Public Sans, Martian
  Mono, 4px spacing scale, 2/4px radius cap) replace the current
  `paper`/`ink`/`accent` set in `globals.css` and the `Archivo` +
  `JetBrains_Mono` imports in `layout.tsx`.
- Decision Record component: kept, restyled under new tokens, before/after
  states rebuilt as strikethrough+dim vs. accent rather than a second color
  pair (§3).
- New `ArchitectureDiagram` component (Booklet-only for now) — inline SVG,
  no new dependency.
- `src/app/data/projects.ts`: Booklet's `facts`/`highlights`/`links`
  updated per §2 (npm package name, VS Code extension added, MCP tool
  count). Other three featured projects (BRNR, Wayfarer, Darkframe) get a
  copy pass to the new Problem/Decision/Outcome structure and voice rules,
  no new fact-checking findings surfaced for those in this pass — spot-
  check during implementation, not assumed clean.
- `src/app/data/hero.ts`, `summary.ts`, `experience.ts`: rewritten per §4/§6.
- `src/app/layout.tsx`, `public/llms.txt`: resynced per §7.
- `src/lib/github.ts`, `src/lib/writing.ts`, `src/app/(helpers)/projects.ts`:
  untouched — infrastructure, not presentation, out of scope.

## 9. What this explicitly does not do

- No new `/about` page (confirmed).
- No fabricated metrics anywhere, including the Vendor Pre-Qualification
  System (§6) and the dropped HighLevel figure (§1).
- No second accent color, no light-mode fork.
- No new runtime dependencies (diagram is hand-built SVG, motion stays CSS).
- Does not touch `/writing` content or infrastructure.

## 10. Open items for the implementation plan

- Exact hero one-liner and "how I work" passage wording — draft during
  implementation against the voice rules and the rule-of-three trap in §6.
- Exact `ArchitectureDiagram` visual layout (box/arrow placement) — content
  is fixed by §5, layout is an implementation-time decision.
- Confirm BRNR/Wayfarer/Darkframe project copy has no similar drift to what
  was found on Booklet — not scanned in this pass, spot-check before
  shipping.

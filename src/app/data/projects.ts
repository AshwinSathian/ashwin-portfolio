// Central source of truth for the Projects section.
// Every fact here is verified against the source repo (README, package.json,
// git history), not resume copy. Live GitHub stats (stars, language) are
// merged in at request time where the repo is public; see src/app/(helpers)/projects.ts.

export type ProjectLinks = {
  live?: string;
  github?: string;
  npm?: string;
};

export type ProjectFact = {
  label: string;
  value: string;
};

export type ProjectHighlight = {
  title: string;
  detail: string;
};

export type DecisionRecord = {
  /** "YYYY-MM" — always real, never invented. */
  date: string;
  before: string;
  after: string;
  why: string;
};

export type ProjectMedia =
  | { kind: "screenshot"; src: string; alt: string }
  | { kind: "code"; snippet: string; language: string; caption: string };

export type Project = {
  slug: string;
  name: string;
  category: string;
  tagline: string;
  description: string[];
  stack: string[];
  facts: ProjectFact[];
  highlights: ProjectHighlight[];
  links: ProjectLinks;
  media: ProjectMedia;
  /** Present only for public repos; enables live star/language lookup. */
  repo?: { owner: string; repo: string };
  decisionRecord?: DecisionRecord;
};

export const PROJECTS: Project[] = [
  {
    slug: "booklet",
    name: "Booklet",
    category: "SaaS product",
    tagline: "Write Markdown, get a shareable page, backed by an API, CLI, GitHub Action, and MCP server.",
    description: [
      "Booklet turns Markdown into a published, shareable page in one click. Live preview first, then a read-only URL. I built the whole surface: a custom Markdown pipeline (unified/remark, GFM, math, Mermaid) that renders into a typed page rather than trusting raw HTML, in-house auth with argon2id password hashing and JWT sessions, and MongoDB as the store. Past the editor it's a full product, with version history, per-page analytics, password-protected pages, and collections.",
      "It's also a platform: a versioned REST API, a published CLI (readable-cli on npm), a GitHub Action for publishing docs from CI, and a standalone MCP server so AI assistants can publish and update pages directly. It shipped on Cloudflare Workers via OpenNext first; I rolled that back to a self-hosted Node process behind a Cloudflare Tunnel in May 2026 once the operational tradeoffs became clear in production. It's the kind of call you only get right by shipping the wrong one first.",
    ],
    stack: ["Next.js 16", "TypeScript", "React 19", "Tailwind CSS v4", "MongoDB", "unified / remark"],
    facts: [
      { label: "Interfaces", value: "Web, CLI, REST API, GitHub Action, MCP server" },
      { label: "Auth", value: "In-house: argon2id, JWT sessions" },
      { label: "License", value: "MIT" },
    ],
    highlights: [
      {
        title: "A real API surface, not an afterthought",
        detail:
          "A versioned REST API, readable-cli published on npm, a GitHub Action for CI publishing, and a standalone MCP server exposing publish_page, update_page, list_pages, and delete_page to AI assistants.",
      },
      {
        title: "SSRF guard and origin checks, unit-tested",
        detail:
          "Both live as dedicated, independently tested modules rather than inline checks. It's the kind of boring correctness that matters once a product accepts arbitrary published content.",
      },
      {
        title: "A disclosed infrastructure rollback",
        detail:
          "Shipped on Cloudflare Workers via OpenNext first, then moved back to a self-hosted PM2 process behind a Cloudflare Tunnel once the operational tradeoffs of the serverless path showed up in production.",
      },
      {
        title: "In-house auth, no vendor",
        detail:
          "Email + password with argon2id hashing and JWT-backed sessions, with no third-party auth provider in the loop.",
      },
    ],
    links: {
      live: "https://booklet.ashwinsathian.com",
      npm: "https://www.npmjs.com/package/readable-cli",
    },
    media: {
      kind: "screenshot",
      src: "/projects/booklet/hero.png",
      alt: "Booklet's editor: Markdown source on the left, a live formatted preview with a rendered code block on the right.",
    },
    decisionRecord: {
      date: "2026-05",
      before: "Cloudflare Workers via OpenNext",
      after: "Self-hosted Node process behind a Cloudflare Tunnel",
      why: "The operational tradeoffs of the serverless path showed up in production. It's the kind of call you only get right by shipping the wrong one first.",
    },
  },
  {
    slug: "brnr",
    name: "BRNR",
    category: "Encrypted messaging",
    tagline: "Burner chats. No accounts. No history. End-to-end encrypted, gone in 24 hours.",
    description: [
      "BRNR is ephemeral, end-to-end encrypted messaging: a 12-character code starts a chat between two people, every message expires after 24 hours, and there's no account system to compromise. Redis is the only persistence layer: every key is TTL'd, so data doesn't outlive its purpose by design, not by policy. Encryption is an X3DH-style handshake feeding a Double Ratchet, implemented in a dedicated brnr-crypto workspace with its own test suite covering key derivation, padding, safety numbers, and the ratchet itself. That isolation means the cryptographic core can be reasoned about on its own.",
      "The stack is a NestJS API with Socket.IO gateways for chat and matchmaking, a Vite/React web client, an Expo/React Native mobile client, and shared contracts and crypto primitives as their own workspaces in a Turbo monorepo. The web client is the currently published surface. The server is architecturally blind to plaintext (it only ever sees ciphertext once the handshake completes), and the logger is configured to redact message and ciphertext fields outright. It's licensed AGPL-3.0, deliberately: any modifications to the server-side code have to stay open.",
    ],
    stack: ["NestJS 11", "Redis 7", "Socket.IO", "Vite / React", "Expo / React Native", "Turborepo"],
    facts: [
      { label: "Persistence", value: "Redis only: every key TTL'd, zero PII" },
      { label: "Encryption", value: "X3DH handshake + Double Ratchet" },
      { label: "License", value: "AGPL-3.0" },
    ],
    highlights: [
      {
        title: "Double Ratchet, implemented and tested",
        detail:
          "An X3DH-style handshake feeds a Double Ratchet implementation in its own brnr-crypto workspace. Key derivation, padding, safety numbers, and the ratchet each have a dedicated test suite.",
      },
      {
        title: "Server-blind by architecture",
        detail:
          "The backend only ever handles ciphertext once the handshake completes, and the logger redacts message/ciphertext fields outright. Privacy enforced in code, not policy.",
      },
      {
        title: "Redis-only, hard TTLs, zero accounts",
        detail:
          "No database, no user table, no message history past 24 hours. Nothing to breach because nothing durable exists to steal.",
      },
      {
        title: "AGPL-3.0 on purpose",
        detail:
          "Chosen specifically so that anyone running a modified server has to publish those modifications: a deliberate license decision, not a default.",
      },
    ],
    links: {
      live: "https://brnr.ashwinsathian.com",
    },
    media: {
      kind: "screenshot",
      src: "/projects/brnr/hero.png",
      alt: "BRNR's cryptographic fingerprint screen: four emoji derived from the session's safety number, used to confirm a connection hasn't been intercepted.",
    },
  },
  {
    slug: "wayfarer",
    name: "Wayfarer",
    category: "Developer tool",
    tagline: "The API client that can't rug-pull you: local-first, no account, client-side encrypted vault.",
    description: [
      "Wayfarer is an API testing client (collections, environments, pre/post-request scripts, a Postman-grade response viewer) that runs entirely in the browser with no account and no backend. Everything lives in IndexedDB on your machine. Secrets get their own encrypted vault: PBKDF2 with 200,000 iterations derives an AES-GCM-256 key that's held in memory only, so only ciphertext ever touches storage. Scripts run sandboxed inside an isolated Web Worker with no DOM, cookie, or network access, so a pasted test script can't exfiltrate anything even if it wanted to.",
      "It was renamed from API Sandbox to Wayfarer partway through its life: same app, same local-first storage model, same MIT license, just a name that fit better. There's also an optional local-bridge, a small Node CLI for CORS/intranet relay when a request needs to reach somewhere the browser can't. The positioning is direct: there's no update, acquisition, or pricing page that can gate access to data you already own.",
    ],
    stack: ["Angular 20", "PrimeNG", "IndexedDB", "Monaco Editor", "RxJS"],
    facts: [
      { label: "Persistence", value: "100% client-side: IndexedDB, no backend" },
      { label: "Secrets vault", value: "PBKDF2 (200k) + AES-GCM-256, key in memory only" },
      { label: "License", value: "MIT" },
    ],
    highlights: [
      {
        title: "Client-side encrypted secrets vault",
        detail:
          "PBKDF2 at 200,000 iterations derives an AES-GCM-256 key held only in memory. IndexedDB never sees anything but ciphertext.",
      },
      {
        title: "Sandboxed script execution",
        detail:
          "Pre/post-request scripts run inside an isolated Web Worker with no DOM, cookie, or network access. Untrusted scripts stay untrusted.",
      },
      {
        title: "Nothing to rug-pull",
        detail:
          "No account, no hosted backend, no pricing tier that can change under you. HAR 1.2 export means your data leaves in a standard format whenever you want.",
      },
      {
        title: "A disclosed rename, not a silent rewrite",
        detail:
          "API Sandbox became Wayfarer with the same storage model and license carried forward. The history is documented, not hidden.",
      },
    ],
    links: {
      live: "https://wayfarer.ashwinsathian.com",
      github: "https://github.com/AshwinSathian/wayfarer",
    },
    media: {
      kind: "screenshot",
      src: "/projects/wayfarer/hero.png",
      alt: "Wayfarer's request builder: headers editor on the left, a syntax-highlighted JSON response with status and timing on the right.",
    },
    repo: { owner: "AshwinSathian", repo: "wayfarer" },
    decisionRecord: {
      date: "2026-07",
      before: "API Sandbox",
      after: "Wayfarer",
      why: "Same local-first storage model, same MIT license, just a name that fit the product better. Shipped as v1.0.0 of the new name, not a quiet find-and-replace.",
    },
  },
  {
    slug: "ngx-runtime-i18n",
    name: "ngx-runtime-i18n",
    category: "Angular library",
    tagline: "Runtime internationalization for Angular: switch languages without a rebuild, without breaking SSR.",
    description: [
      "Angular's built-in i18n compiles a separate build per locale, so switching languages means reloading against a different bundle. ngx-runtime-i18n fixes that: language catalogs load and swap at runtime behind a signal, while SSR output stays deterministic through Angular's TransferState. No flash of untranslated content, no DOM mutation before the app is stable.",
      "It's three published, versioned npm packages inside an Nx monorepo: a framework-agnostic core, an Angular wrapper with signals and an optional RxJS compat layer, and a PrimeNG adapter, so consumers install only what they need. Two demo apps, one CSR and one SSR with Express, exercise the whole pipeline end to end.",
    ],
    stack: ["Angular (signals)", "TypeScript", "Nx monorepo", "Jest"],
    facts: [
      { label: "Packages", value: "3 published on npm: core, angular, primeng" },
      { label: "Demos", value: "CSR + SSR/Express" },
      { label: "License", value: "MIT" },
    ],
    highlights: [
      {
        title: "Signals-first, RxJS-optional",
        detail:
          "provideRuntimeI18n() installs a signal-based I18nService and I18nPipe; an optional compat service bridges lang$ and ready$ for RxJS codebases that haven't migrated yet.",
      },
      {
        title: "SSR-safe hydration",
        detail:
          "Catalogs travel from server to client via TransferState snapshots, so the first paint and the hydrated app always agree. No flicker, no re-fetch.",
      },
      {
        title: "Configurable fallback chains",
        detail:
          "Lookup order is active language → each configured fallback, in order → default language, before a key is reported missing via onMissingKey.",
      },
      {
        title: "Three caching modes",
        detail:
          "none, memory, or storage (localStorage revalidation), tuned per app instead of one policy for everyone. Server environments never touch localStorage.",
      },
    ],
    links: {
      github: "https://github.com/AshwinSathian/ngx-runtime-i18n",
      npm: "https://www.npmjs.com/package/@ngx-runtime-i18n/angular",
    },
    media: {
      kind: "code",
      language: "ts",
      caption: "app.config.ts",
      snippet: `provideRuntimeI18n({
  defaultLang: 'en',
  supported: ['en', 'hi', 'de'],
  fetchCatalog: (lang, signal) =>
    fetch(\`/i18n/\${lang}.json\`, { signal }).then((r) => r.json()),
  onMissingKey: (key) => key,
}, {
  options: {
    autoDetect: true,
    storageKey: '@ngx-runtime-i18n:lang',
  },
})`,
    },
    repo: { owner: "AshwinSathian", repo: "ngx-runtime-i18n" },
  },
  {
    slug: "typester",
    name: "Typester",
    category: "Web game",
    tagline: "A keyboard-first typing speed game: chase a streak multiplier, beat your best score.",
    description: [
      "Typester is a ground-up rebuild of a 2018 Angular 7 app. Nothing carried forward but the core idea. The original manipulated the DOM directly with getElementById and setInterval outside Angular's reactivity, gated navigation through a mutable bag of untyped booleans, and shipped a settings screen that saved nothing. Every architectural decision in the rebuild traces back to one of those defects, logged with its own before/after reasoning in the project's ARCHITECTURE.md.",
      "The result is zoneless, standalone, and signals-first with no NgRx. A game session is a couple of plain injectable signal services, unit-tested without TestBed. Game configuration lives in the URL, not shared-service state, so a round is shareable, bookmarkable, and safe to refresh mid-game. It builds to a fully static, prerendered site with no Node server at runtime, deployed straight from Git through Cloudflare Workers Builds. No CI pipeline, no server to patch.",
    ],
    stack: ["Angular 22 (zoneless, signals)", "Tailwind CSS v4", "Vitest", "Playwright"],
    facts: [
      { label: "Modes", value: "Quick, Timed, Endless, Daily" },
      { label: "Testing", value: "Vitest + Playwright, incl. axe a11y" },
      { label: "Platform", value: "Installable PWA, offline-capable, WCAG AA" },
    ],
    highlights: [
      {
        title: "URL-driven game state",
        detail:
          "The entire game config is validated route params, not a mutable service. Refresh, share, or bookmark a round mid-play and it just works.",
      },
      {
        title: "Deterministic daily challenge",
        detail:
          "The daily mode seeds its word list from the UTC date against the bundled word bank, so every player sees the same words that day.",
      },
      {
        title: "Zoneless, signals-first, no NgRx",
        detail:
          "The game engine, daily challenge, and stats/settings each live in a small, pure, testable signal service. No external state library.",
      },
      {
        title: "Static, zero-ops deploy",
        detail:
          "Prerendered output with no Node server at runtime, deployed straight from Git through Cloudflare Workers Builds. No GitHub Actions, no server to maintain.",
      },
    ],
    links: {
      live: "https://typester.ashwinsathian.com",
      github: "https://github.com/AshwinSathian/typester",
    },
    media: {
      kind: "screenshot",
      src: "/projects/typester/hero.png",
      alt: "Typester mid-round: the current word large on screen, upcoming words queued behind it, timer counting down.",
    },
    repo: { owner: "AshwinSathian", repo: "typester" },
    decisionRecord: {
      date: "2026-07",
      before: "2018 Angular 7 app: direct DOM manipulation outside Angular's reactivity, navigation gated by a mutable bag of untyped booleans, a settings screen that saved nothing",
      after: "Zoneless Angular 22, signals-first, no NgRx, URL-driven game state, static prerendered deploy",
      why: "Every architectural decision in the rebuild traces back to a specific defect in the original, logged with its own before/after reasoning in the project's ARCHITECTURE.md.",
    },
  },
  {
    slug: "darkframe",
    name: "Darkframe",
    category: "Browser extension",
    tagline: "A free, cross-browser dark-mode engine that never touches your photos or video.",
    description: [
      "Darkframe is a free, open-source dark-mode engine for Chrome and Safari, built as a constructive overhaul of how tools in this category usually work. Images and video are never altered: a classifier scores color diversity and edge density rather than raw brightness, and leans toward leaving anything it's unsure about untouched, with <video>/<canvas>/<audio> unconditionally excluded. Theming applies as a single additive CSS Cascade Layer rather than rewriting a page's own stylesheets in place, with a CSSOM-direct-rewrite fallback for engines without Cascade Layer support.",
      "The core engine (OKLCH-native perceptual recoloring, a WCAG 2.1 contrast solver, the image/media classifier) is framework-agnostic, with 144 passing unit tests. A Chrome MV3 extension is verified end-to-end against a real Chromium instance via Playwright, and a real, buildable macOS Safari Web Extension Xcode project is generated via Apple's own safari-web-extension-converter and confirmed to build and launch locally. The project has also been through a dedicated security audit and a separate architecture/quality review, with the findings from both disclosed in its CHANGELOG.md rather than quietly folded in.",
    ],
    stack: ["TypeScript", "Chrome MV3", "Safari Web Extension", "OKLCH", "Playwright", "Vitest"],
    facts: [
      { label: "Testing", value: "144 unit tests, E2E-verified against real Chromium" },
      { label: "Platforms", value: "Chrome (MV3) + Safari (macOS), built from one core engine" },
      { label: "License", value: "MIT" },
    ],
    highlights: [
      {
        title: "Image-safe by construction, not by exception list",
        detail:
          "A color-diversity/edge-density classifier decides what's a photo, not a domain blocklist. <video>/<canvas>/<audio> are excluded unconditionally, and anything the classifier is unsure about is left alone.",
      },
      {
        title: "Additive, not destructive",
        detail:
          "Theming is a single injected CSS Cascade Layer; a page's own stylesheets are never rewritten in place. A CSSOM-direct-rewrite fallback covers engines without Cascade Layer support.",
      },
      {
        title: "A disclosed security fix, not a silent patch",
        detail:
          "A High-severity CSS injection vulnerability, found via unescaped control characters in a generated image-selector attribute, is documented in CHANGELOG.md with the exact mechanism and the fix, not just a version bump.",
      },
      {
        title: "Real store-ready builds, not a demo",
        detail:
          "Both the Chrome and Safari listings are fully prepared (packaged build, screenshots, promo art, privacy copy) — submission is blocked on account/identity steps outside the code, not on the software being unfinished.",
      },
    ],
    links: {
      github: "https://github.com/AshwinSathian/umbra",
    },
    media: {
      kind: "screenshot",
      src: "/projects/darkframe/hero.png",
      alt: "Darkframe's Chrome popup: an aperture-ring toggle for the current site, a global-enable switch, and brightness/contrast tuning sliders.",
    },
    repo: { owner: "AshwinSathian", repo: "umbra" },
    decisionRecord: {
      date: "2026-08",
      before: "Umbra",
      after: "Darkframe",
      why: "A shipping-readiness review found an existing, active, same-category Chrome extension called \"Umbra Dark Mode.\" Renamed across the npm scope, extension name, storage keys, CSS layer name, and the Safari Xcode project before either store listing went live.",
    },
  },
  {
    slug: "better-auth-mongoose",
    name: "better-auth-mongoose",
    category: "Open-source library",
    tagline: "The Mongoose-native database adapter Better Auth's own GitHub issues have been asking for since February 2025.",
    description: [
      "Better Auth's official MongoDB adapter talks to the raw mongodb driver, not Mongoose — the standard ODM for Node and close to universal in NestJS or Express backends. For an app that already uses Mongoose, that forces an extra dependency, two parallel database connections with no shared schema or validation, and broken .populate() calls against anything Better Auth creates. Those are real, long-documented problems on Better Auth's own GitHub, with no first-party fix and no answer beyond a manual workaround that sidesteps the schema and validation problems rather than solving them.",
      "better-auth-mongoose closes that gap properly: Better Auth's own collections become real, registered Mongoose models, extensible the same way any other model in the app is. The differentiator isn't a claim — packages/better-auth-mongoose/test/populate.test.ts is the unit-level proof, and examples/nestjs-mongoose runs the same thing end to end inside a real NestJS app over real HTTP, on every push via CI. It also passes Better Auth's own official adapter contract test suite. A companion tenant-scoping plugin adds automatic, non-convention-based tenant isolation on top of Better Auth's organization plugin.",
    ],
    stack: ["TypeScript", "Mongoose", "Better Auth", "Turborepo", "Changesets", "NestJS"],
    facts: [
      { label: "Published", value: "npm, v0.1.1" },
      { label: "Proof", value: "CI-run test + real NestJS example, not just a claim" },
      { label: "License", value: "MIT" },
    ],
    highlights: [
      {
        title: "Closes a gap Better Auth's own issue tracker has open since Feb 2025",
        detail:
          "Cites the specific upstream issues and discussions the gap comes from, rather than asserting a problem exists. The fix is real, registered Mongoose models, not a workaround.",
      },
      {
        title: ".populate() works, proven in CI",
        detail:
          "A dedicated unit test proves the differentiator directly, and a full NestJS example app exercises the same path over real HTTP on every push.",
      },
      {
        title: "Passes Better Auth's own adapter contract suite",
        detail:
          "Not just internally tested — validated against @better-auth/test-utils, the same conformance suite the official adapters are held to.",
      },
      {
        title: "A tenant-scoping plugin, not just an adapter",
        detail:
          "A companion package adds automatic, non-convention-based tenant isolation on top of Better Auth's organization plugin — the adapter and the multi-tenancy concern are separated, not bundled.",
      },
    ],
    links: {
      live: "https://better-auth-mongoose.ashwinsathian.com",
      github: "https://github.com/AshwinSathian/better-auth-mongoose",
      npm: "https://www.npmjs.com/package/better-auth-mongoose",
    },
    media: {
      kind: "code",
      language: "ts",
      caption: "auth.ts",
      snippet: `import { betterAuth } from "better-auth";
import { mongooseAdapter } from "better-auth-mongoose";
import mongoose, { Schema } from "mongoose";

await mongoose.connect(process.env.MONGO_URI!);

export const auth = betterAuth({
  database: mongooseAdapter(mongoose.connection, {
    schemas: {
      user: new Schema({ role: { type: String, default: "member" } }),
    },
  }),
});`,
    },
    repo: { owner: "AshwinSathian", repo: "better-auth-mongoose" },
  },
  {
    slug: "humanize-writing-skill",
    name: "humanize-writing-skill",
    category: "Claude Code skill",
    tagline: "A Claude Code skill that makes AI-written text read as a specific, considered human voice — grounded in cited research, not a banned-word list.",
    description: [
      "Most public \"humanizer\" skills reduce to a banned-word list: swap out \"delve,\" cap the em dashes, call it done. That works until the list goes stale, which the research this skill is built on shows happens fast. Word-level tells are real, but the literature is clear that structural uniformity — flat sentence rhythm, symmetric paragraph shapes, safe generic claims instead of specific checkable ones — is the larger, more durable, more model-independent signal. This skill weights structure over vocabulary; the word list is kept as a compact backup, not the mechanism.",
      "It's built from three research passes (academic detection literature, editorial and practitioner style guides, and a cross-referenced catalog of 27 specific AI-writing tells), a teardown of 13 existing public humanizer skills, and one adversarial review round — all cited in reference/, not asserted from folk wisdom. It's distributed three ways: clone-and-symlink into a Claude Code skills directory, as a validated Claude Code plugin manifest, or via npx skills add. Published days before this site's own redesign began, and used to write this site's own copy.",
    ],
    stack: ["Claude Code", "Markdown", "Research synthesis"],
    facts: [
      { label: "Basis", value: "3 research passes + 13-skill teardown, cited in reference/" },
      { label: "Distribution", value: "git+symlink, Claude Code plugin, npx skills add" },
      { label: "License", value: "MIT" },
    ],
    highlights: [
      {
        title: "Structure over vocabulary",
        detail:
          "Targets sentence rhythm, paragraph shape, and specificity of claims — the durable, model-independent signal the research points to — rather than chasing a word list that goes stale with every model update.",
      },
      {
        title: "Cited, not asserted",
        detail:
          "Every design decision traces to reference/research.md or reference/oss-skills-review.md: academic detection literature, editorial style guides, and a direct teardown of 13 competing public skills.",
      },
      {
        title: "Validated as a real plugin",
        detail:
          "Ships a .claude-plugin/plugin.json manifest that passes claude plugin validate . --strict, plus before/after worked examples proving the skill changes real output.",
      },
      {
        title: "The tool that wrote this site's copy",
        detail:
          "Not a hypothetical demo — this skill was in active use for the writing on this redesign, including this sentence.",
      },
    ],
    links: {
      github: "https://github.com/AshwinSathian/humanize-writing-skill",
    },
    media: {
      kind: "code",
      language: "sh",
      caption: "install",
      snippet: `git clone https://github.com/AshwinSathian/humanize-writing-skill.git
ln -s "$(pwd)/humanize-writing-skill" ~/.claude/skills/humanizing-writing

# or, without installing anything:
claude --plugin-dir /path/to/humanize-writing-skill

# or:
npx skills add AshwinSathian/humanize-writing-skill`,
    },
    repo: { owner: "AshwinSathian", repo: "humanize-writing-skill" },
  },
];

export type AlsoShipped = {
  name: string;
  description: string;
  href: string;
};

export const ALSO_SHIPPED: AlsoShipped[] = [
  {
    name: "github-issue-analyzer",
    description:
      "Fastify + TypeScript service that caches a repo's GitHub issues in SQLite and analyzes them with a local LLM over Ollama, so triage never leaves your machine.",
    href: "https://github.com/AshwinSathian/github-issue-analyzer",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}

// Central source of truth for the Projects section.
// Every fact here is verified against the source repo (README, package.json,
// git history) — not resume copy. Live GitHub stats (stars, language) are
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
  /** Present only for public repos — enables live star/language lookup. */
  repo?: { owner: string; repo: string };
};

export const PROJECTS: Project[] = [
  {
    slug: "booklet",
    name: "Booklet",
    category: "SaaS product",
    tagline: "Write Markdown, get a shareable page — with an API, CLI, GitHub Action, and MCP server behind it.",
    description: [
      "Booklet turns Markdown into a published, shareable page in one click — live preview, then a read-only URL. I built the whole surface: a custom Markdown pipeline (unified/remark, GFM, math, Mermaid) rendering into a typed page rather than trusting raw HTML, in-house auth with argon2id password hashing and JWT sessions, and MongoDB as the store. Past the editor it's a full product — version history, per-page analytics, password-protected pages, collections.",
      "It's also a platform: a versioned REST API, a published CLI (readable-cli on npm), a GitHub Action for publishing docs from CI, and a standalone MCP server so AI assistants can publish and update pages directly. It shipped on Cloudflare Workers via OpenNext first; I rolled that back to a self-hosted Node process behind a Cloudflare Tunnel in May 2026 once the operational tradeoffs became clear in production — the kind of call you only get right by shipping the wrong one first.",
    ],
    stack: ["Next.js 16", "TypeScript", "React 19", "Tailwind CSS v4", "MongoDB", "unified / remark"],
    facts: [
      { label: "Interfaces", value: "Web, CLI, REST API, GitHub Action, MCP server" },
      { label: "Auth", value: "In-house — argon2id, JWT sessions" },
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
          "Both live as dedicated, independently tested modules rather than inline checks — the kind of boring correctness that matters once a product accepts arbitrary published content.",
      },
      {
        title: "A disclosed infrastructure rollback",
        detail:
          "Shipped on Cloudflare Workers via OpenNext first, then moved back to a self-hosted PM2 process behind a Cloudflare Tunnel once the operational tradeoffs of the serverless path showed up in production.",
      },
      {
        title: "In-house auth, no vendor",
        detail:
          "Email + password with argon2id hashing and JWT-backed sessions — no third-party auth provider in the loop.",
      },
    ],
    links: {
      live: "https://booklet.ashwinsathian.com",
      npm: "https://www.npmjs.com/package/readable-cli",
    },
  },
  {
    slug: "brnr",
    name: "BRNR",
    category: "Encrypted messaging",
    tagline: "Burner chats. No accounts. No history. End-to-end encrypted, gone in 24 hours.",
    description: [
      "BRNR is ephemeral, end-to-end encrypted messaging: a 12-character code starts a chat between two people, every message expires after 24 hours, and there's no account system to compromise. Redis is the only persistence layer — every key is TTL'd, so data doesn't outlive its purpose by design, not by policy. Encryption is a X3DH-style handshake feeding a Double Ratchet, implemented in a dedicated brnr-crypto workspace with its own test suite covering key derivation, padding, safety numbers, and the ratchet itself — isolated from the app so the cryptographic core can be reasoned about on its own.",
      "The stack is a NestJS API with Socket.IO gateways for chat and matchmaking, an Expo/React Native mobile client, and shared contracts and crypto primitives as their own workspaces in a Turbo monorepo. The server is architecturally blind to plaintext — it only ever sees ciphertext once the handshake completes — and the logger is configured to redact message and ciphertext fields outright. It's licensed AGPL-3.0, deliberately: any modifications to the server-side code have to stay open.",
    ],
    stack: ["NestJS 11", "Redis 7", "Socket.IO", "Expo / React Native", "Turborepo"],
    facts: [
      { label: "Persistence", value: "Redis only — every key TTL'd, zero PII" },
      { label: "Encryption", value: "X3DH handshake + Double Ratchet" },
      { label: "License", value: "AGPL-3.0" },
    ],
    highlights: [
      {
        title: "Double Ratchet, implemented and tested",
        detail:
          "An X3DH-style handshake feeds a Double Ratchet implementation in its own brnr-crypto workspace — key derivation, padding, safety numbers, and the ratchet each have a dedicated test suite.",
      },
      {
        title: "Server-blind by architecture",
        detail:
          "The backend only ever handles ciphertext once the handshake completes, and the logger redacts message/ciphertext fields outright — privacy enforced in code, not policy.",
      },
      {
        title: "Redis-only, hard TTLs, zero accounts",
        detail:
          "No database, no user table, no message history past 24 hours. Nothing to breach because nothing durable exists to steal.",
      },
      {
        title: "AGPL-3.0 on purpose",
        detail:
          "Chosen specifically so that anyone running a modified server has to publish those modifications — a deliberate license decision, not a default.",
      },
    ],
    links: {},
  },
  {
    slug: "wayfarer",
    name: "Wayfarer",
    category: "Developer tool",
    tagline: "The API client that can't rug-pull you — local-first, no account, client-side encrypted vault.",
    description: [
      "Wayfarer is an API testing client — collections, environments, pre/post-request scripts, a Postman-grade response viewer — that runs entirely in the browser with no account and no backend. Everything lives in IndexedDB on your machine. Secrets get their own encrypted vault: PBKDF2 with 200,000 iterations derives an AES-GCM-256 key that's held in memory only, so only ciphertext ever touches storage. Scripts run sandboxed inside an isolated Web Worker with no DOM, cookie, or network access, so a pasted test script can't exfiltrate anything even if it wanted to.",
      "It was renamed from API Sandbox to Wayfarer partway through its life — same app, same local-first storage model, same MIT license, just a name that fit better. There's also an optional local-bridge — a small Node CLI for CORS/intranet relay when a request needs to reach somewhere the browser can't. The positioning is direct: there's no update, acquisition, or pricing page that can gate access to data you already own.",
    ],
    stack: ["Angular 20", "PrimeNG", "IndexedDB", "Monaco Editor", "RxJS"],
    facts: [
      { label: "Persistence", value: "100% client-side — IndexedDB, no backend" },
      { label: "Secrets vault", value: "PBKDF2 (200k) + AES-GCM-256, key in memory only" },
      { label: "License", value: "MIT" },
    ],
    highlights: [
      {
        title: "Client-side encrypted secrets vault",
        detail:
          "PBKDF2 at 200,000 iterations derives an AES-GCM-256 key held only in memory — IndexedDB never sees anything but ciphertext.",
      },
      {
        title: "Sandboxed script execution",
        detail:
          "Pre/post-request scripts run inside an isolated Web Worker with no DOM, cookie, or network access — untrusted scripts stay untrusted.",
      },
      {
        title: "Nothing to rug-pull",
        detail:
          "No account, no hosted backend, no pricing tier that can change under you. HAR 1.2 export means your data leaves in a standard format whenever you want.",
      },
      {
        title: "A disclosed rename, not a silent rewrite",
        detail:
          "API Sandbox became Wayfarer with the same storage model and license carried forward — the history is documented, not hidden.",
      },
    ],
    links: {
      live: "https://wayfarer.ashwinsathian.com",
      github: "https://github.com/AshwinSathian/wayfarer",
    },
    repo: { owner: "AshwinSathian", repo: "wayfarer" },
  },
  {
    slug: "ngx-runtime-i18n",
    name: "ngx-runtime-i18n",
    category: "Angular library",
    tagline: "Runtime internationalization for Angular — switch languages without a rebuild, without breaking SSR.",
    description: [
      "Angular's built-in i18n compiles a separate build per locale, so switching languages means reloading against a different bundle. ngx-runtime-i18n fixes that: language catalogs load and swap at runtime behind a signal, while SSR output stays deterministic through Angular's TransferState — no flash of untranslated content, no DOM mutation before the app is stable.",
      "It's three published, versioned npm packages inside an Nx monorepo — a framework-agnostic core, an Angular wrapper with signals and an optional RxJS compat layer, and a PrimeNG adapter — so consumers install only what they need. Two demo apps, one CSR and one SSR with Express, exercise the whole pipeline end to end.",
    ],
    stack: ["Angular (signals)", "TypeScript", "Nx monorepo", "Jest"],
    facts: [
      { label: "Packages", value: "3 published on npm — core, angular, primeng" },
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
          "Catalogs travel from server to client via TransferState snapshots, so the first paint and the hydrated app always agree — no flicker, no re-fetch.",
      },
      {
        title: "Configurable fallback chains",
        detail:
          "Lookup order is active language → each configured fallback, in order → default language, before a key is reported missing via onMissingKey.",
      },
      {
        title: "Three caching modes",
        detail:
          "none, memory, or storage (localStorage revalidation) — tuned per app instead of one policy for everyone. Server environments never touch localStorage.",
      },
    ],
    links: {
      github: "https://github.com/AshwinSathian/ngx-runtime-i18n",
      npm: "https://www.npmjs.com/package/@ngx-runtime-i18n/angular",
    },
    repo: { owner: "AshwinSathian", repo: "ngx-runtime-i18n" },
  },
  {
    slug: "typester",
    name: "Typester",
    category: "Web game",
    tagline: "A keyboard-first typing speed game — chase a streak multiplier, beat your best score.",
    description: [
      "Typester is a ground-up rebuild of a 2018 Angular 7 app — nothing carried forward but the core idea. The original manipulated the DOM directly with getElementById and setInterval outside Angular's reactivity, gated navigation through a mutable bag of untyped booleans, and shipped a settings screen that saved nothing. Every architectural decision in the rebuild traces back to one of those defects, logged with its own before/after reasoning in the project's ARCHITECTURE.md.",
      "The result is zoneless, standalone, and signals-first with no NgRx — a game session is a couple of plain injectable signal services, unit-tested without TestBed. Game configuration lives in the URL, not shared-service state, so a round is shareable, bookmarkable, and safe to refresh mid-game. It builds to a fully static, prerendered site with no Node server at runtime, deployed straight from Git through Cloudflare Workers Builds — no CI pipeline, no server to patch.",
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
          "The entire game config is validated route params, not a mutable service — refresh, share, or bookmark a round mid-play and it just works.",
      },
      {
        title: "Deterministic daily challenge",
        detail:
          "The daily mode seeds its word list from the UTC date against the bundled word bank, so every player sees the same words that day.",
      },
      {
        title: "Zoneless, signals-first, no NgRx",
        detail:
          "The game engine, daily challenge, and stats/settings each live in a small, pure, testable signal service — no external state library.",
      },
      {
        title: "Static, zero-ops deploy",
        detail:
          "Prerendered output with no Node server at runtime, deployed straight from Git through Cloudflare Workers Builds — no GitHub Actions, no server to maintain.",
      },
    ],
    links: {
      live: "https://typester.ashwinsathian.com",
      github: "https://github.com/AshwinSathian/typester",
    },
    repo: { owner: "AshwinSathian", repo: "typester" },
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}

// Central source of truth for the Projects section.
// Every fact here is verified against the source repo (README, package.json,
// git history), not resume copy. Live GitHub stats (stars, language) are
// merged in at request time where the repo is public; see src/app/(helpers)/projects.ts.

export type ProjectLinks = {
  live?: string;
  github?: string;
  npm?: string;
  vscode?: string;
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

export type CaseStudy = {
  problem: string;
  decision: string;
  outcome: string;
};

export type ProjectMedia =
  | { kind: "screenshot"; src: string; alt: string; width: number; height: number }
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
  caseStudy?: CaseStudy;
  /** Set only when the project is not finished or not released; shown as a tag. */
  status?: string;
  /** Deepest technical substance / most differentiated — gets the full case-study treatment on /projects and the home teaser. */
  featured?: boolean;
};

export const PROJECTS: Project[] = [
  {
    slug: "booklet",
    name: "Booklet",
    featured: true,
    category: "SaaS product",
    tagline: "Write Markdown, get a shareable page, backed by an API, CLI, GitHub Action, and MCP server.",
    description: [
      "Booklet turns Markdown into a published, shareable page in one click. You get a live preview first, then a read-only URL. I built the whole surface: a custom Markdown pipeline (unified/remark, GFM, math, Mermaid) that renders into a typed page rather than trusting raw HTML, in-house auth with argon2id password hashing and DB-backed sessions, and MongoDB as the store. Beyond the editor it has version history, per-page analytics, password-protected pages, and collections.",
      "It's also a platform: a versioned REST API, a published CLI (booklet-cli on npm), a GitHub Action for publishing docs from CI, and a standalone MCP server so AI assistants can publish and update pages directly. A VS Code extension is built in the repo but not yet on the Marketplace. It shipped on Cloudflare Workers via OpenNext first. On 25 May 2026 I rolled that back to a self-hosted PM2 process behind a Cloudflare Tunnel, the same day the app dropped its external AI, email, and Stripe integrations.",
    ],
    stack: ["Next.js 16", "TypeScript", "React 19", "Tailwind CSS v4", "MongoDB", "unified / remark"],
    facts: [
      { label: "Interfaces", value: "Web, CLI, REST API, GitHub Action, MCP server" },
      { label: "Auth", value: "In-house: argon2id, DB-backed sessions" },
      { label: "License", value: "MIT" },
    ],
    highlights: [
      {
        title: "One versioned REST API under every client",
        detail:
          "A versioned REST API, booklet-cli published on npm, a GitHub Action for CI publishing, and a standalone MCP server exposing publish_page, update_page, get_page, list_pages, and delete_page to AI assistants.",
      },
      {
        title: "SSRF guard and origin checks, unit-tested",
        detail:
          "Each is its own module with its own unit tests. Both matter once a product accepts arbitrary published content.",
      },
      {
        title: "A disclosed infrastructure rollback",
        detail:
          "Shipped on Cloudflare Workers via OpenNext first, then moved back to a self-hosted PM2 process behind a Cloudflare Tunnel on 25 May 2026, the same day the external AI, email, and Stripe integrations were removed.",
      },
      {
        title: "In-house auth, no vendor",
        detail:
          "Email and password with argon2id hashing and DB-backed sessions. No third-party auth provider is involved.",
      },
    ],
    links: {
      live: "https://booklet.ashwinsathian.com",
      github: "https://github.com/AshwinSathian/booklet",
      npm: "https://www.npmjs.com/package/booklet-cli",
    },
    repo: { owner: "AshwinSathian", repo: "booklet" },
    media: {
      kind: "screenshot",
      src: "/projects/booklet/hero.png",
      width: 1280,
      height: 800,
      alt: "Booklet's editor: Markdown source on the left, a live formatted preview with a rendered code block on the right.",
    },
    decisionRecord: {
      date: "2026-05",
      before: "Cloudflare Workers via OpenNext",
      after: "Self-hosted PM2 process behind a Cloudflare Tunnel",
      why: "Part of a one-day move to self-hosting: the same day's commits removed the external AI, email, and Stripe integrations and deleted the Workers configuration.",
    },
    caseStudy: {
      problem:
        "Sharing a Markdown file with someone means sending a raw .md file, pasting it into a doc tool that reformats it badly, or standing up a static site generator for one page.",
      decision:
        "Built Booklet as a full product around one conversion: paste or write Markdown, get a rendered, shareable URL immediately, with the same pipeline (unified/remark, GFM, math, Mermaid) backing a web editor, a REST API, a CLI, a GitHub Action, and an MCP server. Shipped on Cloudflare Workers via OpenNext first, then rolled the app back to a self-hosted PM2 process behind a Cloudflare Tunnel in May 2026, the same day its external AI, email, and Stripe integrations were removed.",
      outcome:
        "One Markdown pipeline now serves four different ways of publishing a page: from a browser, a terminal, a CI pipeline, or an AI assistant, all against the same versioned API.",
    },
  },
  {
    slug: "brnr",
    name: "BRNR",
    featured: true,
    // Hosted instance taken down 2026-10-06. Restore `links.live`
    // (https://brnr.ashwinsathian.com) and drop this when it is back up.
    status: "Hosted instance offline",
    category: "Encrypted messaging",
    tagline: "Burner chats. No accounts. No history. End-to-end encrypted, gone in 24 hours.",
    description: [
      "BRNR is ephemeral, end-to-end encrypted messaging: a 12-character code starts a chat between two people, every message expires after 24 hours, and there's no account system to compromise. Redis is the only persistence layer and every key has a TTL, so expiry is enforced by the datastore and does not depend on a retention policy. Encryption is an X3DH-style handshake feeding a Double Ratchet, implemented in a dedicated brnr-crypto workspace with its own test suite covering key derivation, padding, safety numbers, and the ratchet itself. Keeping it in its own workspace means the cryptographic core can be reviewed and tested apart from the rest of the app.",
      "The stack is a NestJS API with Socket.IO gateways for chat and matchmaking, a Vite/React web client, an Expo/React Native mobile client, and shared contracts and crypto primitives as their own workspaces in a Turbo monorepo. The web client is the published surface; its hosted instance is offline for now. The server never sees plaintext: once the handshake completes it handles only ciphertext, and the logger redacts message and ciphertext fields. It's licensed AGPL-3.0 so that anyone who runs a modified server has to publish the changes.",
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
          "The backend only ever handles ciphertext once the handshake completes, and the logger redacts message and ciphertext fields.",
      },
      {
        title: "Redis-only, hard TTLs, zero accounts",
        detail:
          "There is no user table and no message history past 24 hours, so a breach finds nothing durable to take.",
      },
      {
        title: "AGPL-3.0 on purpose",
        detail:
          "Chosen so that anyone running a modified server has to publish those modifications.",
      },
    ],
    links: {
      github: "https://github.com/AshwinSathian/brnr",
    },
    repo: { owner: "AshwinSathian", repo: "brnr" },
    caseStudy: {
      problem:
        "Messaging apps that promise privacy often still keep an account system or a message history somewhere on the server, and either one can be compromised or subpoenaed later.",
      decision:
        "Built BRNR with no account system at all: a 12-character code starts a chat, an X3DH handshake feeds a Double Ratchet implemented in its own tested crypto workspace, and Redis is the only datastore, with every key TTL'd so nothing outlives its 24-hour purpose. The server only ever sees ciphertext once the handshake completes, and the AGPL-3.0 license was chosen so that a modified server has to stay open.",
      outcome:
        "Nothing durable exists to breach: there's no user table or message history, and no plaintext touches the server after the handshake completes.",
    },
    media: {
      kind: "screenshot",
      src: "/projects/brnr/chat.png",
      width: 1280,
      height: 800,
      alt: "A BRNR chat between two browsers: four end-to-end encrypted messages under a header showing the 12-character chat code, an Encrypted status, session expiry and the emoji safety number.",
    },
  },
  {
    slug: "wayfarer",
    name: "Wayfarer",
    featured: true,
    category: "Developer tool",
    tagline: "The API client that can't rug-pull you: local-first, no account, client-side encrypted vault.",
    description: [
      "Wayfarer is an API testing client (collections, environments, pre/post-request scripts, a response viewer) that runs entirely in the browser with no account and no backend. Everything lives in IndexedDB on your machine. Secrets get their own encrypted vault: PBKDF2 with 200,000 iterations derives an AES-GCM-256 key that's held in memory only, so only ciphertext ever touches storage. Scripts are switched off in the hosted app while their sandbox is rebuilt, after a September 2026 audit found gaps between the docs and the code.",
      "It was renamed from API Sandbox to Wayfarer partway through its life. The app, the local-first storage model, and the MIT license stayed the same. There's also an optional local-bridge, a small Node CLI for CORS/intranet relay when a request needs to reach somewhere the browser can't. No update, acquisition, or pricing change can gate access to data you already own.",
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
        title: "Audit findings kept in the open",
        detail:
          "A September 2026 audit found gaps between the docs and the code. Each one is an open issue labelled audit-2026-09, and scripts are disabled in the hosted app while the sandbox is rebuilt.",
      },
      {
        title: "Nothing to rug-pull",
        detail:
          "There is no account, hosted backend, or pricing tier that can change under you. HAR 1.2 export lets you take your data out in a standard format at any time.",
      },
      {
        title: "A disclosed rename",
        detail:
          "API Sandbox became Wayfarer with the same storage model and license carried forward.",
      },
    ],
    links: {
      live: "https://wayfarer.ashwinsathian.com",
      github: "https://github.com/AshwinSathian/wayfarer",
    },
    media: {
      kind: "screenshot",
      src: "/projects/wayfarer/hero.png",
      width: 1280,
      height: 800,
      alt: "Wayfarer's request builder: headers editor on the left, a syntax-highlighted JSON response with status and timing on the right.",
    },
    repo: { owner: "AshwinSathian", repo: "wayfarer" },
    decisionRecord: {
      date: "2026-07",
      before: "API Sandbox",
      after: "Wayfarer",
      why: "The new name fit the product better. The local-first storage model and the MIT license carried over, and the rename shipped as v1.0.0 under the new name.",
    },
    caseStudy: {
      problem:
        "API clients that store your secrets ask you to trust their account system and their pricing page with the credentials you paste into them.",
      decision:
        "Built Wayfarer to run entirely client-side: collections and requests live in IndexedDB, and secrets get their own vault where PBKDF2 (200,000 iterations) derives an AES-GCM-256 key held only in memory, so IndexedDB never sees anything but ciphertext. Renamed from API Sandbox to Wayfarer mid-life, with the storage model and license carried forward, and shipped as v1.0.0 under the new name.",
      outcome:
        "There is no account or backend, so nothing can gate access to your own data. Scripts are disabled in the hosted app while the sandbox is rebuilt.",
    },
  },
  {
    slug: "ngx-runtime-i18n",
    name: "ngx-runtime-i18n",
    featured: true,
    category: "Angular library",
    tagline: "Runtime internationalization for Angular: switch languages without a rebuild, without breaking SSR.",
    description: [
      "Angular's built-in i18n compiles a separate build per locale, so switching languages means reloading against a different bundle. ngx-runtime-i18n fixes that: language catalogs load and swap at runtime behind a signal, while SSR output stays deterministic through Angular's TransferState. There is no flash of untranslated content and no DOM mutation before the app is stable.",
      "It's six published, versioned npm packages inside an Nx monorepo: a framework-agnostic core, an Angular wrapper with signals and an optional RxJS compat layer, PrimeNG and Angular Material adapters, schematics, and a CLI. Consumers install only what they need. Two demo apps, one CSR and one SSR with Express, exercise the whole pipeline end to end.",
    ],
    stack: ["Angular (signals)", "TypeScript", "Nx monorepo", "Jest"],
    facts: [
      { label: "Packages", value: "6 published on npm: core, angular, primeng, material, schematics, cli" },
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
          "Catalogs travel from server to client via TransferState snapshots, so the first paint and the hydrated app always agree, with no flicker and no re-fetch.",
      },
      {
        title: "Configurable fallback chains",
        detail:
          "Lookup order is active language → each configured fallback, in order → default language, before a key is reported missing via onMissingKey.",
      },
      {
        title: "Three caching modes",
        detail:
          "none, memory, or storage (localStorage revalidation), chosen per app. Server environments never touch localStorage.",
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
      "Typester is a ground-up rebuild of a 2018 Angular 7 app that keeps only the core idea. The original manipulated the DOM directly with getElementById and setInterval outside Angular's reactivity, gated navigation through a mutable bag of untyped booleans, and shipped a settings screen that saved nothing. Every architectural decision in the rebuild traces back to one of those defects, logged with its own before/after reasoning in the project's ARCHITECTURE.md.",
      "The result is zoneless, standalone, and signals-first with no NgRx. A game session is a couple of plain injectable signal services, unit-tested without TestBed. Game configuration lives in the URL, not shared-service state, so a round is shareable, bookmarkable, and safe to refresh mid-game. It builds to a fully static, prerendered site with no Node server at runtime, deployed straight from Git through Cloudflare Workers Builds, with no CI pipeline and no server to patch.",
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
          "The entire game config is validated route params, not a mutable service, so a round survives a refresh and can be shared or bookmarked mid-play.",
      },
      {
        title: "Deterministic daily challenge",
        detail:
          "The daily mode seeds its word list from the UTC date against the bundled word bank, so every player sees the same words that day.",
      },
      {
        title: "Zoneless, signals-first, no NgRx",
        detail:
          "The game engine, daily challenge, and stats/settings each live in a small, pure, testable signal service, with no external state library.",
      },
      {
        title: "Static, zero-ops deploy",
        detail:
          "Prerendered output with no Node server at runtime, deployed straight from Git through Cloudflare Workers Builds, with no GitHub Actions and no server to maintain.",
      },
    ],
    links: {
      live: "https://typester.ashwinsathian.com",
      github: "https://github.com/AshwinSathian/typester",
    },
    media: {
      kind: "screenshot",
      src: "/projects/typester/hero.png",
      width: 1280,
      height: 800,
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
    status: "Store submission pending",
    category: "Browser extension",
    tagline: "A free, cross-browser dark-mode engine that never touches your photos or video.",
    description: [
      "Darkframe is a free, open-source dark-mode engine for Chrome and Safari. Images and video are never altered. A classifier scores color diversity and edge density rather than raw brightness and leaves anything it's unsure about untouched, and <video>/<canvas>/<audio> are excluded unconditionally. Theming applies as a single additive CSS Cascade Layer rather than rewriting a page's own stylesheets in place. Engines without Cascade Layer support get a CSSOM-direct-rewrite fallback.",
      "The core engine (OKLCH-native perceptual recoloring, a WCAG 2.1 contrast solver, the image/media classifier) is framework-agnostic, with 144 passing unit tests. The Chrome MV3 extension is verified end to end against a Chromium instance via Playwright. The macOS Safari Web Extension Xcode project is generated with Apple's safari-web-extension-converter and confirmed to build and launch locally. The project has also been through a security audit and a separate architecture/quality review, and the findings from both are disclosed in its CHANGELOG.md.",
    ],
    stack: ["TypeScript", "Chrome MV3", "Safari Web Extension", "OKLCH", "Playwright", "Vitest"],
    facts: [
      { label: "Testing", value: "144 unit tests, E2E-verified against real Chromium" },
      { label: "Platforms", value: "Chrome (MV3) + Safari (macOS), built from one core engine" },
      { label: "License", value: "MIT" },
    ],
    highlights: [
      {
        title: "Image-safe by classifier, with no domain blocklist",
        detail:
          "A classifier that scores color diversity and edge density decides what is a photo. <video>/<canvas>/<audio> are excluded unconditionally, and anything the classifier is unsure about is left alone.",
      },
      {
        title: "Additive, not destructive",
        detail:
          "Theming is a single injected CSS Cascade Layer; a page's own stylesheets are never rewritten in place. A CSSOM-direct-rewrite fallback covers engines without Cascade Layer support.",
      },
      {
        title: "A disclosed security fix",
        detail:
          "A High-severity CSS injection vulnerability, found via unescaped control characters in a generated image-selector attribute, is documented in CHANGELOG.md with the exact mechanism and the fix.",
      },
      {
        title: "Store-ready builds for both browsers",
        detail:
          "Both the Chrome and Safari listings are fully prepared (packaged build, screenshots, promo art, privacy copy). Submission is waiting on account and identity steps outside the code.",
      },
    ],
    links: {
      github: "https://github.com/AshwinSathian/umbra",
    },
    media: {
      kind: "code",
      language: "json",
      caption: "manifest.json",
      snippet: `{
  "name": "Darkframe",
  "description": "Free, cross-browser dark-mode engine",
  "manifest_version": 3,
  "permissions": ["storage", "scripting"],
  "host_permissions": ["http://*/*", "https://*/*"],
  "content_scripts": [{
    "matches": ["<all_urls>"],
    "run_at": "document_start",
    "js": ["content-script.js"]
  }]
}`,
    },
    repo: { owner: "AshwinSathian", repo: "umbra" },
    decisionRecord: {
      date: "2026-08",
      before: "Umbra",
      after: "Darkframe",
      why: "A shipping-readiness review found an existing, active, same-category Chrome extension called \"Umbra Dark Mode.\" Renamed across the npm scope, extension name, storage keys, CSS layer name, and the Safari Xcode project before either store listing went live.",
    },
    caseStudy: {
      problem:
        "Dark-mode browser extensions often recolor everything on the page, including photos and video.",
      decision:
        "Built Darkframe's classifier to score color diversity and edge density rather than raw brightness, defaulting to leaving anything it's unsure about untouched, with video, canvas, and audio excluded unconditionally. Theming applies as one additive CSS Cascade Layer instead of rewriting a page's own stylesheets. Shipped under the name Umbra first, then renamed to Darkframe (npm scope, extension name, storage keys, CSS layer name, and the Safari Xcode project) after a shipping-readiness review found an existing, active Chrome extension called \"Umbra Dark Mode.\"",
      outcome:
        "144 passing unit tests back a Chrome MV3 build that's E2E-verified against real Chromium, plus a Safari Xcode project that builds. One High-severity CSS injection vulnerability was found, fixed, and documented in CHANGELOG.md.",
    },
  },
  {
    slug: "better-auth-mongoose",
    name: "better-auth-mongoose",
    category: "Open-source library",
    tagline: "The Mongoose-native database adapter Better Auth's own GitHub issues have been asking for since February 2025.",
    description: [
      "Better Auth's official MongoDB adapter talks to the raw mongodb driver, not Mongoose, the usual ODM in NestJS and Express backends. For an app that already uses Mongoose, that forces an extra dependency, two parallel database connections with no shared schema or validation, and broken .populate() calls against anything Better Auth creates. Those problems have been documented on Better Auth's own GitHub since February 2025. There is no first-party fix, and the manual workaround leaves the schema and validation problems in place.",
      "better-auth-mongoose registers Better Auth's own collections as Mongoose models, extensible the same way any other model in the app is. packages/better-auth-mongoose/test/populate.test.ts tests .populate() directly, and examples/nestjs-mongoose runs the same path end to end inside a NestJS app over HTTP, on every push via CI. It also passes Better Auth's own official adapter contract test suite. A companion tenant-scoping plugin adds automatic, non-convention-based tenant isolation on top of Better Auth's organization plugin.",
    ],
    stack: ["TypeScript", "Mongoose", "Better Auth", "Turborepo", "Changesets", "NestJS"],
    facts: [
      { label: "Published", value: "npm, v0.1.2" },
      { label: "Proof", value: "CI-run test + NestJS example app" },
      { label: "License", value: "MIT" },
    ],
    highlights: [
      {
        title: "Closes a gap open on Better Auth's issue tracker since Feb 2025",
        detail:
          "Cites the specific upstream issues and discussions the gap comes from. The fix is registered Mongoose models in place of the manual workaround.",
      },
      {
        title: ".populate() works, proven in CI",
        detail:
          "A dedicated unit test covers .populate() against a user Better Auth created, and a full NestJS example app exercises the same path over HTTP on every push.",
      },
      {
        title: "Passes Better Auth's own adapter contract suite",
        detail:
          "Validated against @better-auth/test-utils, the same conformance suite the official adapters run.",
      },
      {
        title: "A companion tenant-scoping plugin",
        detail:
          "A companion package adds automatic, non-convention-based tenant isolation on top of Better Auth's organization plugin. It ships separately from the adapter.",
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
    featured: true,
    category: "Claude Code skill",
    tagline: "A Claude Code skill that guides how Claude writes prose so it doesn't read as machine-written. Its rules come from cited 2026 research and were tested blind on Haiku, Sonnet, and Opus.",
    description: [
      "Text reads as machine-written when every choice in it would suit any reader and any subject: the safe claim, the impressive word, the sentence shape that worked last time. This skill applies while Claude is writing, where the widely used alternatives are rewrite tools run over a finished draft. Its rules cover claims (specific, checkable, never invented), sentence shape, and endings, and a Scope section says where they give way: API docs, legal text, fiction, marketing copy, someone else's own writing. It is written for human readers and says plainly that it does not change AI-detector scores.",
      "Version 2.0.0 (October 2026) came out of an audit of the first release. The tells had moved since 2023: a four-model study by The Economist found the signal now sits in long noun-heavy sentences and thin punctuation, and Anthropic's own prompting guide names metaphor in place of plain statement as a habit of its current model. The 1.x rewritten examples had swapped the old tells for the new ones and added facts their originals did not contain. The rules were rewritten against those sources and judged in shuffled blind pairs. Two model judges each preferred 2.0.0 to no skill in 5 of 6 pairs. An earlier draft lost to the previous version, and that round is published in the repo along with the pairs it lost.",
      "Version 2.1.0 lets an author's own habits outrank the style rules when Claude drafts in their voice from a sample or a voice profile. A second blind round on 10 October 2026 used Claude Haiku as the writer: three judges each preferred the skill's text to no-skill text in 3 of 3 pairs, and two of them flagged one passage for stating a team's current practice as fact. A pre-registered test of a reworded rule followed on four new tasks, and the rewording was not adopted. The project has its own site at humanize.ashwinsathian.com, with the 2026 tells and their sources, the worked examples, the test results, and a comparison with four other humanizer skills.",
    ],
    stack: ["Claude Code", "Markdown", "Python", "Research synthesis", "Next.js (site)"],
    facts: [
      { label: "Release", value: "2.1.0, October 2026, MIT" },
      { label: "Install", value: "npx skills add AshwinSathian/humanize-writing-skill" },
      { label: "Validation", value: "18 blind pairs on Haiku, Sonnet, and Opus, losses published" },
    ],
    highlights: [
      {
        title: "Rules that follow where the tells are now",
        detail:
          "Covers the 2026 patterns: verbs turned into nouns, sentences chained with \"and\", a figure of speech where a fact would do, and a closing line that only repeats the paragraph. The word list is down to six patterns that no rule already names.",
      },
      {
        title: "Never invents to sound specific",
        detail:
          "Blind testing caught the previous version making up a past incident for an internal blog post. The rule against invention now sits directly under the rule that asks for specifics, and covers anything a rewrite adds to its source. It still slips. On four tasks the rules were never tuned on, 2 of 9 passages said something about the reader's team that nobody had supplied. A reworded rule brought that to 1 of 9, short of the bar set before the test ran, so the rule was left alone and the result is published.",
      },
      {
        title: "Tested blind, with the losses on record",
        detail:
          "Passages written with no skill, with 1.1.1, and with the current rules were shuffled and judged unlabeled, first on Sonnet and Opus (12 pairs, two judges) and then on Haiku (6 pairs, three judges). The passages, the pairs, the keys, every judge's answers, and a 20-finding adversarial review are in reference/, and reference/research/2026-update.md lists the 1.x claims that newer sources weakened.",
      },
      {
        title: "Your voice outranks the rules",
        detail:
          "Since 2.1.0, a draft in a person's own voice keeps their dashes, rhetorical questions, and \"not X but Y\" at about their rate. The repo has one worked profile, mine, built from about 55,000 words I wrote without AI assistance and described as counts with no quoted text. In its test the drafts moved toward my use of \"we\" and of questions, and still came out with shorter sentences and fewer dashes than I write.",
      },
      {
        title: "It wrote its own landing page",
        detail:
          "humanize.ashwinsathian.com was drafted with the skill and that voice profile, and prints the counts for its own copy from the repo's measuring script: 15.9 words a sentence against my 18, and 3.3 dashes per 1,000 words against my 6. The first release was in use for the writing on this redesign. This entry was written under 2.1.0.",
      },
    ],
    links: {
      live: "https://humanize.ashwinsathian.com",
      github: "https://github.com/AshwinSathian/humanize-writing-skill",
    },
    media: {
      kind: "screenshot",
      src: "/projects/humanize-writing-skill/hero.png",
      width: 1280,
      height: 800,
      alt: "The humanizing-writing site: the headline, an install command, and a paragraph marked up like a copy-edit, with machine habits struck through in red and notes beside them.",
    },
    repo: { owner: "AshwinSathian", repo: "humanize-writing-skill" },
    decisionRecord: {
      date: "2026-10",
      before: "Vary sentence rhythm on purpose",
      after: "Let sentence length follow the content",
      why: "A model told to vary its rhythm writes short sentences for effect: the one-line closer, the fragment, the colon reveal. Sources from 2026 list those among the most recognizable habits of current models, and the skill's own 1.x examples contained them.",
    },
    caseStudy: {
      problem:
        "Prose from Claude is easy to recognize, and most public humanizer skills answer that with a list of banned words run over a finished draft. The lists go stale. Wikipedia's list of AI vocabulary for mid-2025 onward is four words long, and current models have mostly dropped \"delve\" for long noun-heavy sentences, metaphor in place of plain statement, and closing lines written for effect.",
      decision:
        "Wrote a skill that applies while Claude is writing, with rules on claims, sentence shape, and endings, and a Scope section for the genres where those rules give way. In October 2026 I audited my own first release against newer research, found that its rewritten examples had swapped the 2023 tells for the 2026 ones and added facts their originals did not contain, and rewrote the rules. Each blind round is published, including a draft that lost to the previous version.",
      outcome:
        "In blind pairs, two model judges each preferred the skill's text to no-skill text in 5 of 6 pairs with Sonnet and Opus writing, and three judges each preferred it in 3 of 3 with Haiku writing. The samples are small and the judges are Claude models. A later test on new tasks found 2 of 9 passages stating something about the reader's team that nobody had supplied. A reworded rule did not clear the bar set in advance, and that is on record too. The skill does not change AI-detector scores and says so.",
    },
  },
];

export type AlsoShipped = {
  name: string;
  description: string;
  href: string;
  /** Set only when the repo is not finished; shown as a tag. */
  status?: string;
};

export const ALSO_SHIPPED: AlsoShipped[] = [
  {
    name: "mergehand",
    description:
      "Claude Code plugin that runs a project as cards: one card per session, with a scope gate, a separate reviewer agent and one pull request. v0.1.2, MIT.",
    href: "https://github.com/AshwinSathian/mergehand",
  },
  {
    name: "github-issue-analyzer",
    description:
      "Fastify + TypeScript service that caches a repo's GitHub issues in SQLite and analyzes them with a local LLM over Ollama, so triage never leaves your machine.",
    href: "https://github.com/AshwinSathian/github-issue-analyzer",
  },
  {
    name: "angularjs-migration-copilot",
    description:
      "AngularJS to Angular migration CLI: deterministic AST codemods, an LLM fallback, and a compile-and-test gate on every AI-touched change. Ingest and inventory stages are built; the rest is not.",
    href: "https://github.com/AshwinSathian/angularjs-migration-copilot",
    status: "In progress",
  },
  {
    name: "weir",
    description:
      "Go library for shared HTTP caching in front of an origin that has to stay up: RFC 9111 caching with stampede, outage and poisoning defenses. Design complete, implementation not started.",
    href: "https://github.com/AshwinSathian/weir",
    status: "In progress",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}

// Central source of truth for the curated Projects section.
// Unlike a generic repo list, each entry is a hand-written case study —
// live GitHub stats (stars, language) are merged in at request time where
// the repo is public; see src/app/(helpers)/projects.ts.

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
    slug: "ngx-runtime-i18n",
    name: "ngx-runtime-i18n",
    category: "Angular library",
    tagline:
      "Runtime internationalization for Angular — switch languages without a rebuild, without breaking SSR.",
    description: [
      "Angular's built-in i18n compiles a separate build per locale, so switching languages means reloading against a different bundle. I built ngx-runtime-i18n to fix that: language catalogs load and swap at runtime behind a signal, while SSR output stays deterministic through Angular's TransferState — no flash of untranslated content, no DOM mutation before the app is stable.",
      "It's structured as three focused npm packages inside an Nx monorepo — a framework-agnostic core, an Angular wrapper with signals and an optional RxJS compat layer, and a PrimeNG adapter — so consumers install only what they need. Two demo apps, one CSR and one SSR with Express, exercise the whole pipeline end to end.",
    ],
    stack: ["Angular (signals)", "TypeScript", "Nx monorepo", "RxJS (compat layer)"],
    facts: [
      { label: "Packages", value: "3 — core, angular, primeng" },
      { label: "Demos", value: "CSR + SSR/Express" },
      { label: "License", value: "MIT" },
    ],
    highlights: [
      {
        title: "Signals-first, RxJS-optional",
        detail:
          "provideRuntimeI18n() installs a signal-based I18nService and I18nPipe; an optional I18nCompatService bridges lang$ and ready$ for RxJS codebases that haven't migrated yet.",
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
    slug: "readable",
    name: "Readable",
    category: "SaaS product",
    tagline: "Publish clean, readable pages from Markdown — paste, preview, share a URL.",
    description: [
      "Readable is a Markdown publishing product: paste or write Markdown, watch it render live, and get a shareable, read-only page in one click. I built the whole surface myself — a custom block-based renderer that parses Markdown into a typed AST rather than trusting raw HTML, in-house authentication with argon2id hashing and database-backed sessions, and a Cloudflare Workers deployment via OpenNext.",
      "Past the editor, it's a full product: version history on every publish, per-page analytics, password-protected and collection-grouped pages, and team spaces for shared publishing. And past the browser, it's a platform — a REST API, a published CLI, a GitHub Action for publishing docs in CI, and an MCP server so AI assistants can publish and update pages directly.",
    ],
    stack: [
      "Next.js 16",
      "TypeScript",
      "Tailwind CSS v4",
      "MongoDB",
      "Cloudflare Workers (OpenNext)",
      "unified / remark",
    ],
    facts: [
      { label: "Live product", value: "readable.ashwinsathian.com" },
      { label: "Interfaces", value: "Web, CLI, REST API, MCP, GitHub Action" },
      { label: "Auth", value: "In-house — argon2id, DB-backed sessions" },
    ],
    highlights: [
      {
        title: "Custom block-based renderer",
        detail:
          "Markdown is parsed into a typed Block/Inline AST and rendered by a purpose-built BlockRenderer, not dumped as raw HTML — the same AST drives the editor preview, the share page, PDF/Markdown/HTML export, and embeds.",
      },
      {
        title: "A real API surface, not an afterthought",
        detail:
          "A versioned REST API, readable-cli on npm, a GitHub Action for CI publishing, and a standalone MCP server exposing publish_page, update_page, list_pages, and delete_page to AI assistants.",
      },
      {
        title: "In-house auth, fail-closed secrets",
        detail:
          "Email + password with argon2id hashing and DB-backed sessions — no third-party auth vendor. Every required secret documents its own generation command and fails closed if unset.",
      },
      {
        title: "Built for real usage",
        detail:
          "Version history with restore, per-page view/scroll/referrer analytics, password protection, custom slugs, collections, and webhooks on publish and update events.",
      },
    ],
    links: {
      live: "https://readable.ashwinsathian.com",
      npm: "https://www.npmjs.com/package/readable-cli",
    },
  },
  {
    slug: "typester",
    name: "Typester",
    category: "Web game",
    tagline: "A keyboard-first typing speed game — chase a streak multiplier, beat your best score.",
    description: [
      "Typester is a ground-up rebuild of a 2018 Angular 7 app — nothing carried forward but the core idea. The original manipulated the DOM directly with getElementById and setInterval outside Angular's reactivity, gated navigation through a mutable bag of untyped booleans, and shipped a settings screen that saved nothing. Every architectural decision in the rebuild traces back to one of those defects.",
      "The result is zoneless, standalone, and signals-first with no NgRx — a game session is a couple of plain injectable signal services. Game configuration lives in the URL (/play/:mode/:difficulty/:duration), not shared-service state, so a round is shareable, bookmarkable, and safe to refresh mid-game. It builds to a fully static, prerendered site, and I self-host it: a local Caddy server exposed through an outbound-only Cloudflare Tunnel, so no inbound port is ever opened on the network it runs on.",
    ],
    stack: ["Angular 22 (zoneless, signals)", "Tailwind CSS v4", "Vitest", "Playwright", "Caddy + Cloudflare Tunnel"],
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
          "/play/daily/:date seeds its word list from the UTC date against the bundled word bank, so every player sees the same words that day.",
      },
      {
        title: "Zoneless, signals-first, no NgRx",
        detail:
          "The game engine, daily challenge, and stats/settings each live in a small, pure, testable signal service — no external state library.",
      },
      {
        title: "Fully static, self-hosted",
        detail:
          "Prerendered output with no Node server at runtime, served by Caddy behind a Cloudflare Tunnel with no inbound port ever opened.",
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

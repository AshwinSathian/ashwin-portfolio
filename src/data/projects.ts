// Central source of truth for the Projects section.
// Every fact here is verified against the source repo (README, package.json,
// git history), not resume copy. Live GitHub stats (stars, language) are
// merged in at build time where the repo is public; see src/lib/projects.ts.

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
    tagline: "Publish Markdown incident reports, ADRs, RFCs and runbooks as web pages, from a browser, a terminal, CI or an AI assistant.",
    description: [
      "Booklet turns Markdown into a published, shareable page in one click. You get a live preview first, then a read-only URL. I built the whole surface: a custom Markdown pipeline (unified/remark, GFM, math, Mermaid) that renders into a typed page rather than trusting raw HTML, in-house auth (argon2id passwords, passkeys, DB-backed sessions), and MongoDB as the store. A page can declare a document type (incident, ADR, RFC, runbook, postmortem, release notes) and link to other pages with [[wikilinks]], and team spaces keep a team’s documents together.",
      "It’s also a platform: a versioned REST API, a published CLI (booklet-cli on npm), a GitHub Action for publishing docs from CI, and a standalone MCP server so AI assistants can publish and update pages directly. It shipped on Cloudflare Workers via OpenNext first. On 25 May 2026 I rolled that back to a self-hosted PM2 process behind a Cloudflare Tunnel, the same day the app dropped its external AI, email, and Stripe integrations. Email has since come back for account confirmation, password resets and team invites. The repository is private.",
    ],
    stack: ["Next.js 16", "TypeScript", "React 19", "Tailwind CSS v4", "MongoDB", "unified / remark"],
    facts: [
      { label: "Interfaces", value: "Web, CLI, REST API, GitHub Action, MCP server" },
      { label: "Auth", value: "In-house: argon2id, passkeys, DB-backed sessions" },
      { label: "License", value: "AGPL-3.0 (CLI and MCP server: MIT)" },
    ],
    highlights: [
      {
        title: "One versioned REST API under every client",
        detail:
          "A versioned REST API, booklet-cli published on npm, a GitHub Action for CI publishing, and a standalone MCP server with seven tools (publish_page, update_page, get_page, list_pages, delete_page, create_document, search_pages) and six document templates, signed in with OAuth or an API key.",
      },
      {
        title: "SSRF guard and origin checks, unit-tested",
        detail:
          "Each is its own module with its own unit tests. Both matter once a product accepts arbitrary published content.",
      },
      {
        title: "Rolled back from Workers to self-hosted",
        detail:
          "Shipped on Cloudflare Workers via OpenNext first, then moved back to a self-hosted PM2 process behind a Cloudflare Tunnel on 25 May 2026, the same day the external AI, email, and Stripe integrations were removed.",
      },
      {
        title: "Auth built in-house",
        detail:
          "Email and password with argon2id hashing, passkeys, and DB-backed sessions, all inside the app. GitHub and Google sign-in are optional and appear only when the host configures them.",
      },
    ],
    links: {
      live: "https://booklet.ashwinsathian.com",
      npm: "https://www.npmjs.com/package/booklet-cli",
    },
    media: {
      kind: "screenshot",
      src: "/projects/booklet/hero.png",
      width: 1280,
      height: 800,
      alt: "Booklet’s editor: Markdown source on the left, a live formatted preview with a rendered code block on the right.",
    },
    decisionRecord: {
      date: "2026-05",
      before: "Cloudflare Workers via OpenNext",
      after: "Self-hosted PM2 process behind a Cloudflare Tunnel",
      why: "Part of a one-day move to self-hosting: the same day’s commits removed the external AI, email, and Stripe integrations and deleted the Workers configuration.",
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
    slug: "weir",
    name: "Weir",
    featured: true,
    category: "Go library",
    tagline: "A Go HTTP cache for an origin that has to stay up. It forwards only what it keyed and caps how fast a stampede can reach the origin.",
    description: [
      "Weir sits between an HTTP server and an origin and decides, for each request, whether the cache can answer. It implements RFC 9111 caching and adds defenses I could not find together in one Go library. Each lifetime is shortened by up to 10%, so entries stored together do not expire together. Concurrent requests for one key share one origin fetch. Every origin fetch, whatever its key, holds a slot from a limiter of 64. Stale-while-revalidate, stale-if-error and a circuit breaker cover an origin outage, and a soft purge revalidates through the same limiter. The core module imports only the Go standard library. Three more modules add a Caddy handler, a Valkey store for several nodes, and Prometheus metrics.",
      "The cache key is treated as a security boundary. On a cacheable request the origin receives only the headers that are in the key, the ones the operator allowed, and a short fixed list, so the forwarded request is the keyed request. That has a cost: an origin that reads Accept-Language or a cookie does not see it until the operator keys or allows it. The threat model lists 51 threats with the answer and the test for each, and 15 risks the defaults do not remove.",
      "It was built in fifteen days through Claude Code sessions: a seed design document, ten numbered design documents with requirement IDs, and 103 task cards, one session per card, each ending in a pull request that I reviewed and merged. Version 1.0.0 was tagged on 12 October 2026 after two release-candidate rehearsals. It is a new library with no production history yet.",
    ],
    stack: ["Go 1.26", "net/http", "Caddy", "Valkey", "Prometheus", "Claude Code"],
    facts: [
      { label: "Release", value: "1.2.0, October 2026, Apache-2.0" },
      { label: "Install", value: "go get github.com/AshwinSathian/weir@v1.2.0" },
      { label: "Checks", value: "155 requirement IDs traced to tests, 30 fuzz targets, a 51-threat model" },
      { label: "Latest", value: "1.2.0: one origin download shared by every client waiting for a large response, and coalescing across nodes" },
    ],
    highlights: [
      {
        title: "The origin sees only what the cache keyed",
        detail:
          "Cache poisoning needs an input that changes the origin’s response and is not in the cache key. By default Weir does not forward such an input, so an unkeyed header cannot shape what is stored for other clients. For its first five minutes it counts the cookie names it dropped and logs the common ones once, so an operator can find the ones the origin needs.",
      },
      {
        title: "One origin budget for every key",
        detail:
          "Coalescing protects one hot key and does nothing when thousands of different keys go cold together. Every fetch holds a limiter slot, with a share per path. In the load test that lets 10,000 keys expire at once with the limit set to 32, all 10,000 were refetched, the origin never had more than 32 requests in flight, and no client saw an error.",
      },
      {
        title: "Stale answers and a breaker when the origin fails",
        detail:
          "Weir serves stale content only where the origin allowed it with stale-while-revalidate or stale-if-error, unless the operator sets a default. In the brownout scenario of the load test every request got a 2xx and 54,155 were served stale.",
      },
      {
        title: "Requirements traced to tests by a script",
        detail:
          "Every behavior in the spec has an ID and each test cites the IDs it covers. The build fails if an ID has no test citing it: 147 at release. Before the tag, 29 fuzz targets ran for an hour each without a crash and the engine tests passed 100 consecutive runs under the race detector.",
      },
      {
        title: "Six adversarial reviews before the tag",
        detail:
          "Six adversarial reviews of the finished code found a 304 that could bring back a body a hard purge had removed, %2e decoded into a dot-segment of the path, and a named pipe at the snapshot path that hung startup. The release candidates found a module tagged without its go.sum lines and a runbook that promised a cache hit after a restart. The changelog inside the v1.0.0 tag still says \"unreleased\". It is all written down in the repository.",
      },
      {
        title: "A seventh review, after the release",
        detail:
          "The day after 1.0.1 a seventh review went looking for trouble and found it, each finding confirmed by a test first. With an origin that took 15 seconds to answer, 100 requests for one key made 16 fetches and 84 of them got a 503. Twenty errors from one path opened the circuit breaker for every path. Half a million POSTs to uncached URLs sent about half of all other entries back to the origin. The fixes shipped as 1.1.0 on 13 October 2026. A reviewer reading those fixes found three defects in them, and the existing tests caught a fourth: behind Caddy, every GET had stopped being cached.",
      },
    ],
    links: {
      live: "https://weir.ashwinsathian.com",
      github: "https://github.com/AshwinSathian/weir",
    },
    media: {
      kind: "screenshot",
      src: "/projects/weir/hero-1-2.png",
      width: 1280,
      height: 800,
      alt: "The Weir site: the headline \"Shared HTTP caching in front of an origin that has to stay up\", an install command, and a terminal transcript in which the second request, 13 seconds later, is answered from the cache with ttl=43.",
    },
    repo: { owner: "AshwinSathian", repo: "weir" },
    decisionRecord: {
      date: "2026-10",
      before: "A Range request that also carried If-Match was answered with a 206 slice",
      after: "Range is ignored in that case and the answer is the full 200",
      why: "Weir does not evaluate If-Match and removes it from the forwarded request, so nobody had checked the slice against the bytes the client already held, from the cache or from the origin. A resumed download could have joined two versions of a file. The release review noted it for cache hits, and the work between the first release candidate and 1.0.0 found the same gap on the origin path.",
    },
    caseStudy: {
      problem:
        "Weir began with a caching layer that had three weaknesses. A full flush turned every request into a cold miss at once, nothing held requests back when they arrived faster than the origin could regenerate entries, and entries stored in a batch expired in a batch. None of the fixes is new. Varnish coalesces requests for one object, nginx has proxy_cache_lock, and Souin covers RFC 7234 and surrogate keys in Go. What I could not find in one Go library was lifetime jitter, an origin limit shared across keys, and a default that keeps unkeyed headers from the origin.",
      decision:
        "Built it as a library that makes the cache decision and leaves the wire to adapters for net/http and Caddy. Put every origin fetch behind one limiter and tied the forwarded request to the cache key by default, accepting that operators have to name the headers their origin reads. Wrote the behavior down as requirement IDs before any code, and had Claude Code sessions build it one task card at a time, with separate adversarial reviews and two release-candidate rehearsals before the tag.",
      outcome:
        "Version 1.0.0 shipped on 12 October 2026, and 1.0.1 followed with documentation and no change to behavior. On an Apple M4 Pro a cached hit takes 852 ns and 12 allocations. The reviews and rehearsals found defects that a green test suite had not, and each was fixed with a test. A seventh review after the release found eight more serious ones, and 1.1.0, released the next day, fixes them and takes the hit to 669 ns and 8 allocations, measured against 964 ns for 1.0.1 in the same run on a machine that was not idle. 1.2.0 followed on 22 October. Clients waiting for a response too large to store now share one origin download instead of fetching it each, nodes on one Valkey server can fetch a missing key once between them, and the library builds on Go 1.26. A cached hit is 615 ns, the same as 1.1.0 within noise. A third comparison round also measured memory, and there Weir does worst: it holds about 3.6 KB of memory for a cached 100-byte response, where Varnish holds about 1 KB. Weir has no production history yet, it has two storage backends where Souin has many, and its Valkey store is tested against Valkey 7.2 and 8.1.",
    },
  },
  {
    slug: "brnr",
    name: "BRNR",
    featured: true,
    category: "Encrypted messaging",
    tagline: "End-to-end encrypted burner chats with no accounts, where every message expires after 24 hours.",
    description: [
      "BRNR is ephemeral, end-to-end encrypted messaging: a 12-character code starts a chat between two people, every message expires after 24 hours, and there’s no account system to compromise. Redis is the only persistence layer and every key has a TTL, so expiry is enforced by the datastore and does not depend on a retention policy. Encryption is an X3DH handshake feeding a Double Ratchet (XChaCha20-Poly1305, HKDF-SHA256) from @brnr/e2ee, my own library, which the app vendors as a signed release and verifies before every install. Neither BRNR nor the library has had an independent security audit.",
      "The stack is a NestJS API with Socket.IO gateways for chat and matchmaking, a Vite/React web client, an Expo/React Native mobile client, and shared contracts in their own workspace, in a Turbo monorepo. The web client is the published surface, at brnr.ashwinsathian.com. The server never sees plaintext: once the handshake completes it handles only ciphertext, and the logger redacts message and ciphertext fields. The source is private and proprietary.",
    ],
    stack: ["NestJS 11", "Redis 7", "Socket.IO", "Vite / React", "Expo / React Native", "Turborepo"],
    facts: [
      { label: "Persistence", value: "Redis only: every key TTL’d, zero PII" },
      { label: "Encryption", value: "X3DH handshake + Double Ratchet" },
      { label: "License", value: "Proprietary" },
    ],
    highlights: [
      {
        title: "Double Ratchet from a signed library",
        detail:
          "X3DH with separate Ed25519 and X25519 device keys feeds a Double Ratchet (XChaCha20-Poly1305, HKDF-SHA256) from @brnr/e2ee 1.0.0. The app vendors the library as a signed tarball and checks the signature before every install. It has not had an independent audit.",
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
    ],
    links: {
      live: "https://brnr.ashwinsathian.com",
    },
    caseStudy: {
      problem:
        "Messaging apps that promise privacy often still keep an account system or a message history somewhere on the server, and either one can be compromised or subpoenaed later.",
      decision:
        "Built BRNR with no account system at all: a 12-character code starts a chat, an X3DH handshake feeds a Double Ratchet from my own signed, vendored @brnr/e2ee library, and Redis is the only datastore, with every key TTL’d so nothing outlives its 24-hour purpose. The server only ever sees ciphertext once the handshake completes.",
      outcome:
        "Nothing durable exists to breach: there’s no user table or message history, and no plaintext touches the server after the handshake completes.",
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
    tagline: "A local-first API client that opens in a browser tab: no account, an encrypted vault for secrets, and a test behind every claim it makes.",
    description: [
      "Wayfarer is an API client that opens in a browser tab. There is no install and no account. Collections, environments and history live in IndexedDB, and a request goes from the page to the host you typed. It imports Postman, Insomnia, OpenAPI, HAR and cURL, runs Postman-style scripts in QuickJS compiled to WebAssembly, does GraphQL, WebSockets and event streams, and runs a collection from the command line with the same engine (wayfarer-cli on npm). Secrets go in a vault: PBKDF2-SHA-256 at 600,000 iterations wraps a random AES-GCM-256 key that is held in memory only, so only ciphertext is stored and a reload locks it.",
      "A page can’t do everything a desktop client can. CORS, forbidden headers like Cookie and Origin, mixed content and the missing timings of cross-origin responses all apply, so before a request goes the composer says what the browser will do to it. For what a page can’t do there is an optional Local Bridge (wayfarer-bridge on npm, no dependencies, listening on 127.0.0.1 only, paired with a one-time code) that sends the request from your machine. A collection can be shared as a link that carries it encrypted after the #, which a browser never sends to a server.",
      "Every claim the project makes is a row in a public ledger, 94 of them at version 3.4.0, and each row names the tests that prove it. The repository’s first commit is from January 2020, an Angular 8 project called api-sandbox. It was renamed Wayfarer in July 2026 with the storage model and the MIT license unchanged, and a September 2026 audit of its documentation against its code produced 75 issues, 71 of them closed.",
    ],
    stack: ["Angular 22", "IndexedDB", "QuickJS (WebAssembly)", "Monaco Editor", "Astro 7", "Playwright"],
    facts: [
      { label: "Release", value: "3.4.0, November 2026, MIT. wayfarer-cli 2.2.0 and wayfarer-bridge 3.0.2 on npm" },
      { label: "Persistence", value: "Client-side: IndexedDB, no backend of its own" },
      { label: "Secrets vault", value: "PBKDF2 (600k) wraps an AES-GCM-256 key, held in memory only" },
      { label: "Checks", value: "94 public claims, each tied to tests that run in Chromium, Firefox and WebKit" },
    ],
    highlights: [
      {
        title: "Client-side encrypted secrets vault",
        detail:
          "PBKDF2-SHA-256 at 600,000 iterations wraps a random AES-GCM-256 key held only in memory, and a reload locks the vault. IndexedDB holds ciphertext. History, exports and shared files carry a mask where a secret was, and a reference to a vault secret is refused before it can reach the network.",
      },
      {
        title: "Every claim has a test",
        detail:
          "The ledger has 94 rows. Each names the documents that say it and the tests that prove it, and a check fails if a row has no test or names one that doesn’t exist. A claim test is never retried: one that passes on the second try hasn’t shown what it claims. Since 3.4.0 a skipped test no longer counts as one.",
      },
      {
        title: "Says what the browser will do, before the send",
        detail:
          "A page can’t send a Cookie header, can’t read most response headers across origins and gets no phase timings unless the server sends Timing-Allow-Origin. The composer says what the browser will do to a request before it goes, and a network failure shows the real error. An early version’s service worker answered with a made-up 504.",
      },
      {
        title: "A bridge for what a page can’t do",
        detail:
          "wayfarer-bridge relays a request from your machine, where CORS doesn’t apply. It listens on 127.0.0.1 only, relays only for an allowed origin that presents its token, and issues the token against a pairing code that works once. The route Auto sends from the page and offers the bridge only after the page got no answer. A response is never sent twice.",
      },
      {
        title: "Audited, then reviewed again before the announcement",
        detail:
          "The September 2026 audit compared the documentation with the code and left 75 issues labeled audit-2026-09, among them scripts blocked by the production CSP and an “encrypted at rest” claim that overstated. 71 are closed, and scripts came back in 2.1.0 on a sandbox that runs under that CSP. In November a walkthrough of the live app as a first-time visitor and a review of the whole codebase went into 3.2.4 to 3.4.0: a Timings phase that showed 593 seconds for a one-second request, a phone told to run a terminal command, and a bridge timeout that cut requests off at 30 seconds.",
      },
      {
        title: "Nothing to rug-pull",
        detail:
          "There is no account, hosted backend, or pricing tier that can change under you. Collections export as Postman v2.1 or Wayfarer files, an exchange as HAR 1.2, and the whole workspace backs up to one file.",
      },
    ],
    links: {
      live: "https://wayfarer.ashwinsathian.com",
      github: "https://github.com/AshwinSathian/wayfarer",
      npm: "https://www.npmjs.com/package/wayfarer-cli",
    },
    media: {
      kind: "screenshot",
      src: "/projects/wayfarer/hero.png",
      width: 1280,
      height: 800,
      alt: "Wayfarer with a Postman collection imported: the Storefront API folders on the left, a POST request built from the collection’s variables, and the JSON answer, 201 Created, on the right, with a notice that the imported scripts have not been reviewed yet.",
    },
    repo: { owner: "AshwinSathian", repo: "wayfarer" },
    decisionRecord: {
      date: "2026-11",
      before: "The ledger said the production page “loads with no script the app didn’t ship (0 CSP violations)”",
      after: "It says the page runs no script but the app’s, and the CSP blocks any other, also one the host adds",
      why: "The Cloudflare zone that serves the site injects a bot-detection script. The CSP blocks it, and a block is a violation, so “0 violations” was false, and the check for it was skipped against production with a warning, so nothing was testing the claim. The new wording says what holds, with a test that fails on any script fetched from another origin and on any violation that isn’t a blocked script. The strict zero-violations test stays, skipped on production until the zone stops injecting. Reworded in 3.2.5 on 9 November 2026.",
    },
    caseStudy: {
      problem:
        "API clients that keep your secrets ask you to trust their account system and their pricing page with the credentials you paste into them. A client that runs in a browser tab needs neither, but the tab can’t do everything a desktop client can, and a client that doesn’t say so reports wrong things.",
      decision:
        "Built Wayfarer to run in the tab: collections live in IndexedDB, secrets go in a vault whose key exists only in memory, and the composer says what the browser will do to a request before it is sent. What a page can’t do goes to an optional Local Bridge on the user’s machine, paired by a code. Made every public claim a row in a ledger with the tests that prove it, run in three browser engines, after an audit of the project’s own documentation found where it said more than the code did.",
      outcome:
        "Version 3.4.0 is current, with wayfarer-cli 2.2.0 and wayfarer-bridge 3.0.2 on npm. The ledger has 94 claims, and one of them was false while the host injected its own script, until it was reworded on 9 November 2026. Of the audit’s 75 issues, 71 are closed. What isn’t built is written down: no gRPC, no Git-backed collections, no live shared workspace.",
    },
  },
  {
    slug: "coil",
    name: "Coil",
    category: "Browser game",
    tagline: "Snake for phone, tablet and desktop in a 25 KB page, with replays you can share as links and a leaderboard that scores every run on the server.",
    description: [
      "Coil is a snake game with five modes: Classic, Gates, Daily, Blitz and Zen. The whole app is one HTML file of about 25 KB gzipped, plus a 28 KB cut of the Anybody font. Every sound is synthesised with Web Audio, it installs as an app and it plays offline after the first visit. Swipe, the arrow keys or a gamepad all steer it, and it has two looks, Retro and Modern, each in a light and a dark theme.",
      "The game is one integer-only simulation with a seeded random generator and no clock, and the same seed and turns always replay to the same game. A run is stored as its seed and the ticks where it turned, so a 55-segment Classic game fits in 192 characters of a link. The Daily leaderboard is a Cloudflare Worker that imports the same simulation, replays each submitted run and stores the score it computes. The browser never sends one.",
      "Edges are decided cell by cell: a stretch is a wall or a gate that brings the snake in on the opposite edge, in the same row or column. Gates mode is a run of generated rooms, each with fewer gates and more inner walls than the last, and Daily is one generated room a day.",
    ],
    stack: ["TypeScript", "Canvas 2D", "Web Audio", "Vite", "Cloudflare Workers", "D1"],
    facts: [
      { label: "Page", value: "One HTML file, about 25 KB gzipped, plus a 28 KB font" },
      { label: "Replays", value: "Seed plus turns, varint and base64url, in the link fragment" },
      { label: "License", value: "MIT" },
    ],
    highlights: [
      {
        title: "The server scores the run itself",
        detail:
          "A Daily submission carries a name, a device id and a replay, never a score. The Worker checks the board is today's (or yesterday's, for a run that ended after midnight UTC), plays the run to its end and stores what it scored. That stops a forged score. It can't stop a run searched for offline, because a replay proves the moves are legal and not that a person made them live.",
      },
      {
        title: "Old links replay under old rules",
        detail:
          "When Daily changed from rocks on a walled board to generated rooms, every earlier Daily replay would have played on the wrong board. The first byte of a replay now records the rules revision. Before the change, one autopilot game per mode was saved with its score and final tick, and a test checks that each still replays to both.",
      },
      {
        title: "Walls and gates, cell by cell",
        detail:
          "Each row and column has a gate flag, so an edge can be wall in one stretch and gate in the next. A generator mirrors the runs and the inner walls, and keeps a wall only if a flood fill that follows the gates still reaches every open cell.",
      },
      {
        title: "Frames between ticks",
        detail:
          "The simulation moves whole cells, about 7 to 17 times a second. The renderer slides the head and tail between cells at the display's rate, and draws a snake that is partway through a gate twice, once on each side of the board.",
      },
    ],
    links: {
      live: "https://coil.ashwinsathian.com",
      github: "https://github.com/AshwinSathian/coil",
    },
    media: {
      kind: "screenshot",
      src: "/projects/coil/hero.png",
      width: 1280,
      height: 800,
      alt: "Coil in its Retro look, replaying a Gates run in room 3: a block snake crossing a charcoal board between mirrored grey walls, with dashed green gates along parts of every edge, and the score 1250 at ×4 beside it.",
    },
    repo: { owner: "AshwinSathian", repo: "coil" },
    decisionRecord: {
      date: "2026-11",
      before: "A replay's first byte was a format version, and Daily was rocks on a board with solid edges",
      after: "The first byte is the rules revision; revision 2 Daily is a generated room of walls and gates",
      why: "The simulation promises that a replay plays back to the same game, and changing the Daily board would have broken that for every link already shared. Recording the revision lets an old link rebuild the old board, and the leaderboard accepts only the current revision, since today's board is the one it scores against.",
    },
  },
  {
    slug: "minefield",
    name: "Minefield",
    category: "Browser game",
    tagline: "Minesweeper where every board can be cleared by logic, checked before you see it by an exact solver that also gives the hints.",
    description: [
      "Minefield is Minesweeper for phone, tablet and desktop: Beginner, Intermediate, Expert, custom sizes up to 60 by 40, and a Daily board that is the same for everyone. The app is one HTML file of about 21 KB gzipped with no fonts or images to fetch, and it installs as an app and plays offline.",
      "With No guessing on, a board is dealt only after a solver has cleared it from the first click without a guess. The solver works in layers: single numbers, overlapping pairs, then a count of every mine arrangement on each frontier component, weighted by how the leftover mines fit the unexplored interior. Certainty is decided from which mine totals are feasible, never from floating-point probabilities.",
      "The same solver gives hints that ring the numbers behind a move, shades every hidden cell by its exact chance of being a mine, and tells you after a loss whether a safe move was open.",
    ],
    stack: ["TypeScript", "Web Workers", "CSS Grid", "Web Audio", "Vite", "Cloudflare Workers"],
    facts: [
      { label: "Page", value: "One HTML file, about 21 KB gzipped" },
      { label: "No-guess Expert boards", value: "15.8% of random deals; 2.5 ms median to find one" },
      { label: "License", value: "MIT" },
    ],
    highlights: [
      {
        title: "A solver that is sound and complete",
        detail:
          "Single and pair rules alone would accept 17 random Expert boards in 1,000. Counting every arrangement on the frontier, combined with the global mine count, accepts 158. Tests compare its probabilities and certainties with brute-force enumeration on 400 random positions.",
      },
      {
        title: "Certainty without floats",
        detail:
          "Binomial weights reach 10^513 on large boards, so probabilities are computed in log space and rescaled. A rescaled weight can underflow to zero while its arrangement is still possible, so safe and mine are decided from integer counts and feasible totals instead.",
      },
      {
        title: "Loss review",
        detail:
          "After a mine, the solver replays the position before the click. It either outlines the safe move that was open or says the guess was forced and gives the odds the chosen cell had.",
      },
      {
        title: "Boards that turn",
        detail:
          "A 30 by 16 board turns upright on a portrait phone. Logic stays in board coordinates; only the view and the arrow keys swap axes.",
      },
    ],
    links: {
      live: "https://minefield.ashwinsathian.com",
      github: "https://github.com/AshwinSathian/minefield",
    },
    media: {
      kind: "screenshot",
      src: "/projects/minefield/hero.png",
      width: 1280,
      height: 800,
      alt: "Minefield on a desktop: an Expert board on warm paper-coloured tiles, with a hint outlining a safe cell in green and ringing the number that proves it.",
    },
    repo: { owner: "AshwinSathian", repo: "minefield" },
  },
  {
    slug: "nonet",
    name: "Nonet",
    category: "Browser game",
    tagline: "Sudoku graded by the techniques a person needs, with hints that explain each step and an adaptive mode that sets the next puzzle from how you played the last.",
    description: [
      "Nonet is a sudoku for phone, tablet and desktop with five levels, a Daily puzzle and an adaptive mode. The app is one HTML file of about 24 KB gzipped, generator included, plus a 23 KB cut of Atkinson Hyperlegible Next. It installs as an app, plays offline and saves after every move.",
      "Every puzzle is graded by a solver that only uses human techniques, 24 of them from hidden singles to alternating chains, cheapest first. The hardest step sets the rating and the level, the sum of every step's time sets the par, and the next step from the player's own notes is the hint. A puzzle the solver can't finish is never dealt.",
      "In the adaptive mode the player has a rating on the puzzles' scale, moved after each game by an Elo update that scores time against par, mistakes and hints.",
    ],
    stack: ["TypeScript", "Web Workers", "CSS Grid", "Vite", "Cloudflare Workers"],
    facts: [
      { label: "Page", value: "One HTML file, about 24 KB gzipped, plus a 23 KB font" },
      { label: "Techniques", value: "24, from full house to alternating inference chains" },
      { label: "License", value: "MIT" },
    ],
    highlights: [
      {
        title: "Graded like a person solves",
        detail:
          "Across 2,000 random minimal puzzles, a backtracking search's effort has a rank correlation of 0.39 with the technique grade, and its median effort is the same for Hard, Expert and Master. So levels come from the hardest technique each puzzle needs.",
      },
      {
        title: "Generated to a level",
        detail:
          "Clues come out in symmetric pairs while the puzzle keeps one solution and, below Master, while the solver capped at the level's hardest technique can still finish it. Puzzles take 1 to 8 ms each in a Web Worker, and the Daily is the same seeded puzzle on every device with no server.",
      },
      {
        title: "Elo with a continuous score",
        detail:
          "Finishing at par with no mistakes or hints scores 0.5, half of par 0.74, and each hint costs a quarter of what's left. K starts at 1.6 and settles at 0.4, so the first games find your level and later ones nudge it.",
      },
      {
        title: "Hints from your own notes",
        detail:
          "When your notes are complete and haven't crossed out an answer, the hint works from them and finds the step you're stuck on. It names the technique first, then shows the cells and the digits it removes, then applies it as one undoable move.",
      },
    ],
    links: {
      live: "https://nonet.ashwinsathian.com",
      github: "https://github.com/AshwinSathian/nonet",
    },
    media: {
      kind: "screenshot",
      src: "/projects/nonet/hero.png",
      width: 1280,
      height: 800,
      alt: "Nonet on a desktop: an Expert puzzle drawn as nine separate tiles with pencil notes, three cells in box 9 shaded amber, and a hint card explaining a pointing pair beside a 3 by 3 keypad.",
    },
    repo: { owner: "AshwinSathian", repo: "nonet" },
  },
  {
    slug: "ngx-runtime-i18n",
    name: "ngx-runtime-i18n",
    featured: true,
    category: "Angular library",
    tagline: "Runtime internationalization for Angular: switch languages without a rebuild, without breaking SSR.",
    description: [
      "Angular’s built-in i18n compiles a separate build per locale, so switching languages means reloading against a different bundle. ngx-runtime-i18n fixes that: language catalogs load and swap at runtime behind a signal, while SSR output stays deterministic through Angular’s TransferState. There is no flash of untranslated content and no DOM mutation before the app is stable.",
      "It’s six published, versioned npm packages inside an Nx monorepo: a framework-agnostic core, an Angular wrapper with signals and an optional RxJS compat layer, PrimeNG and Angular Material adapters, schematics, and a CLI. Consumers install only what they need. Two demo apps, one CSR and one SSR with Express, exercise the whole pipeline end to end.",
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
          "provideRuntimeI18n() installs a signal-based I18nService and I18nPipe; an optional compat service bridges lang$ and ready$ for RxJS codebases that haven’t migrated yet.",
      },
      {
        title: "SSR-safe hydration",
        detail:
          "Catalogs travel from server to client via TransferState snapshots, so the first paint and the hydrated app always agree, with no flicker and no re-fetch.",
      },
      {
        title: "Configurable fallback chains",
        detail:
          "Lookup order is the active language, then each configured fallback in order, then the default language, before a key is reported missing via onMissingKey.",
      },
      {
        title: "Three caching modes",
        detail:
          "none, memory, or storage (localStorage revalidation), chosen per app. Server environments never touch localStorage.",
      },
    ],
    links: {
      live: "https://i18n.ashwinsathian.com",
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
    category: "Browser game",
    tagline: "A keyboard-first typing speed game: chase a streak multiplier, beat your best score.",
    description: [
      "Typester is a ground-up rebuild of a 2018 Angular 7 app that keeps only the core idea. The original manipulated the DOM directly with getElementById and setInterval outside Angular’s reactivity, gated navigation through a mutable bag of untyped booleans, and shipped a settings screen that saved nothing. Every architectural decision in the rebuild traces back to one of those defects, logged with its own before/after reasoning in the project’s ARCHITECTURE.md.",
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
      before: "2018 Angular 7 app: direct DOM manipulation outside Angular’s reactivity, navigation gated by a mutable bag of untyped booleans, a settings screen that saved nothing",
      after: "Zoneless Angular 22, signals-first, no NgRx, URL-driven game state, static prerendered deploy",
      why: "Every architectural decision in the rebuild traces back to a specific defect in the original, logged with its own before/after reasoning in the project’s ARCHITECTURE.md.",
    },
  },
  {
    slug: "better-auth-mongoose",
    name: "better-auth-mongoose",
    category: "Open-source library",
    tagline: "A Mongoose-native database adapter for Better Auth, filling a gap its issue tracker has asked about since February 2025.",
    description: [
      "Better Auth’s official MongoDB adapter talks to the raw mongodb driver, not Mongoose, the usual ODM in NestJS and Express backends. For an app that already uses Mongoose, that forces an extra dependency, two parallel database connections with no shared schema or validation, and broken .populate() calls against anything Better Auth creates. Those problems have been documented on Better Auth’s own GitHub since February 2025. There is no first-party fix, and the manual workaround leaves the schema and validation problems in place.",
      "better-auth-mongoose registers Better Auth’s own collections as Mongoose models, extensible the same way any other model in the app is. packages/better-auth-mongoose/test/populate.test.ts tests .populate() directly, and examples/nestjs-mongoose runs the same path end to end inside a NestJS app over HTTP, on every push via CI. It also passes Better Auth’s own official adapter contract test suite. A companion tenant-scoping plugin adds automatic, non-convention-based tenant isolation on top of Better Auth’s organization plugin.",
    ],
    stack: ["TypeScript", "Mongoose", "Better Auth", "Turborepo", "Changesets", "NestJS"],
    facts: [
      { label: "Published", value: "npm, v0.1.2" },
      { label: "Proof", value: "CI-run test + NestJS example app" },
      { label: "License", value: "MIT" },
    ],
    highlights: [
      {
        title: "Closes a gap open on Better Auth’s issue tracker since Feb 2025",
        detail:
          "Cites the specific upstream issues and discussions the gap comes from. The fix is registered Mongoose models in place of the manual workaround.",
      },
      {
        title: ".populate() works, proven in CI",
        detail:
          "A dedicated unit test covers .populate() against a user Better Auth created, and a full NestJS example app exercises the same path over HTTP on every push.",
      },
      {
        title: "Passes Better Auth’s own adapter contract suite",
        detail:
          "Validated against @better-auth/test-utils, the same conformance suite the official adapters run.",
      },
      {
        title: "A companion tenant-scoping plugin",
        detail:
          "A companion package adds automatic, non-convention-based tenant isolation on top of Better Auth’s organization plugin. It ships separately from the adapter.",
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
    slug: "loupe",
    name: "loupe",
    category: "Design review skill",
    tagline: "Design review for coding agents. It measures contrast, keyboard focus and reflow in a running app before it judges, and tags every rule with Apple’s strength.",
    description: [
      "Ask a coding agent for a design review and it finds most of what is wrong. What goes wrong is the rest of the review: contrast is estimated from hex values, severities inflate, and a well-built app gets a list of critical problems. loupe measures first. It composites every translucent layer before it computes text contrast, walks the page with real Tab presses, and stresses it at 320 px, with WCAG text spacing, at 200% text, with longer translated text and in right-to-left. A Blocker needs a measurement, a source line or a confirmed failure, and what could not be measured is listed with what would verify it.",
      "It checks an interface against Apple’s Human Interface Guidelines and the research around them, for iOS, iPadOS, macOS and the web, in SwiftUI, UIKit, React, Next.js, React Native, Expo, Angular, Vue or plain HTML. Each rule it cites carries Apple’s own wording (MUST, SHOULD, CONSIDER), or is marked as Web, Research or Taste, and it says when a screen looks like every other template. It edits nothing until you pick findings by number. It installs in Claude Code, Codex, Cursor and Gemini CLI, though a full review has only been run in Claude Code.",
      "The measuring half runs without a model as the loupe-review CLI on npm, and as the loupe-action GitHub Action. Only measured problems that no WCAG exception covers fail a run, and a committed baseline lets a pull request fail on new findings only.",
    ],
    stack: ["JavaScript", "Playwright", "Python", "SKILL.md", "GitHub Actions"],
    facts: [
      { label: "Release", value: "2.1.1, November 2026, MIT" },
      { label: "Install", value: "npx skills add AshwinSathian/loupe" },
      { label: "CLI", value: "npx -y loupe-review@2 <url>" },
      { label: "Blind round", value: "Judges preferred its review in 6 of 9 pairs; it did not find more defects than the same models without it" },
    ],
    highlights: [
      {
        title: "Measures before it judges",
        detail:
          "Contrast is computed after compositing every translucent layer. The keyboard walk uses real Tab presses and reports missing accessible names, hidden focus, focus hidden under fixed bars and keyboard traps. Stress modes are applied to the page and undone afterwards.",
      },
      {
        title: "Every rule says how strongly Apple states it",
        detail:
          "A finding carries an Impact (Blocker, Major, Minor or Polish) and a tag for the rule’s source. Outside research adds to Apple’s guidance and never replaces it, and a conflict is shown in the finding rather than settled quietly.",
      },
      {
        title: "“No rework warranted” is the usual answer",
        detail:
          "A rework is proposed only when the evidence clears a stated bar. On the well-built app in the blind round, reviews with loupe reported no Blockers, while the same models without it put 10 findings in their top tier.",
      },
      {
        title: "Tested blind, with the miss published",
        detail:
          "The held-out round failed one of its four pre-registered rules: both conditions found nearly every planted defect, and recall missed by half a defect with Haiku. loupe’s reviews had fewer findings judged wrong or inflated. The fixtures, all 18 reports and the judges’ answers are in the repository.",
      },
      {
        title: "A CI gate that fails only on new findings",
        detail:
          "Finding ids come from the rule, the role, the text and the colours, not the element’s position, so adding a list item doesn’t turn one finding into a new one. The npm package is published from GitHub Actions with signed provenance, and the repository holds no npm token.",
      },
    ],
    links: {
      live: "https://loupe.ashwinsathian.com",
      github: "https://github.com/AshwinSathian/loupe",
      npm: "https://www.npmjs.com/package/loupe-review",
    },
    media: {
      kind: "screenshot",
      src: "/projects/loupe/hero.png",
      width: 1280,
      height: 800,
      alt: "The loupe site: the headline “A design review that shows its measurements”, with the headline’s own size and contrast measured beside it, and an install command below.",
    },
    repo: { owner: "AshwinSathian", repo: "loupe" },
  },
  {
    slug: "humanize-writing-skill",
    name: "humanize-writing-skill",
    featured: true,
    category: "Claude Code skill",
    tagline: "A Claude Code skill that shapes how Claude writes prose, built from cited 2026 research and tested blind on Haiku, Sonnet, and Opus.",
    description: [
      "Text reads as machine-written when every choice in it would suit any reader and any subject: the safe claim, the impressive word, the sentence shape that worked last time. This skill applies while Claude is writing, where the widely used alternatives are rewrite tools run over a finished draft. Its rules cover claims (specific, checkable, never invented), sentence shape, and endings, and a Scope section says where they give way: API docs, legal text, fiction, marketing copy, someone else’s own writing. It is written for human readers and says plainly that it does not change AI-detector scores.",
      "Version 2.0.0 (October 2026) came out of an audit of the first release. The tells had moved since 2023: a four-model study by The Economist found the signal now sits in long noun-heavy sentences and thin punctuation, and Anthropic’s own prompting guide names metaphor in place of plain statement as a habit of its current model. The 1.x rewritten examples had swapped the old tells for the new ones and added facts their originals did not contain. The rules were rewritten against those sources and judged in shuffled blind pairs. Two model judges each preferred 2.0.0 to no skill in 5 of 6 pairs. An earlier draft lost to the previous version, and that round is published in the repo along with the pairs it lost.",
      "Version 2.1.0 lets an author’s own habits outrank the style rules when Claude drafts in their voice from a sample or a voice profile. A second blind round on 10 October 2026 used Claude Haiku as the writer: three judges each preferred the skill’s text to no-skill text in 3 of 3 pairs, and two of them flagged one passage for stating a team’s current practice as fact. A pre-registered test of a reworded rule followed on four new tasks, and the rewording was not adopted. The project has its own site at humanize.ashwinsathian.com, with the 2026 tells and their sources, the worked examples, the test results, and a comparison with four other humanizer skills.",
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
          "Blind testing caught the previous version making up a past incident for an internal blog post. The rule against invention now sits directly under the rule that asks for specifics, and covers anything a rewrite adds to its source. It still slips. On four tasks the rules were never tuned on, 2 of 9 passages said something about the reader’s team that nobody had supplied. A reworded rule brought that to 1 of 9, short of the bar set before the test ran, so the rule was left alone and the result is published.",
      },
      {
        title: "Tested blind, losses included",
        detail:
          "Passages written with no skill, with 1.1.1, and with the current rules were shuffled and judged unlabeled, first on Sonnet and Opus (12 pairs, two judges) and then on Haiku (6 pairs, three judges). The passages, the pairs, the keys, every judge’s answers, and a 20-finding adversarial review are in reference/, and reference/research/2026-update.md lists the 1.x claims that newer sources weakened.",
      },
      {
        title: "Your voice outranks the rules",
        detail:
          "Since 2.1.0, a draft in a person’s own voice keeps their dashes, rhetorical questions, and \"not X but Y\" at about their rate. The repo has one worked profile, mine, built from about 55,000 words I wrote without AI assistance and described as counts with no quoted text. In its test the drafts moved toward my use of \"we\" and of questions, and still came out with shorter sentences and fewer dashes than I write.",
      },
      {
        title: "It wrote its own landing page",
        detail:
          "humanize.ashwinsathian.com was drafted with the skill and that voice profile, and prints the counts for its own copy from the repo’s measuring script: 16.2 words a sentence against my 18, and 3.1 dashes per 1,000 words against my 6. The first release was in use for the writing on this redesign. This entry was written under 2.1.0.",
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
      why: "A model told to vary its rhythm writes short sentences for effect: the one-line closer, the fragment, the colon reveal. Sources from 2026 list those among the most recognizable habits of current models, and the skill’s own 1.x examples contained them.",
    },
    caseStudy: {
      problem:
        "Prose from Claude is easy to recognize, and most public humanizer skills answer that with a list of banned words run over a finished draft. The lists go stale. Wikipedia’s list of AI vocabulary for mid-2025 onward is four words long, and current models have mostly dropped \"delve\" for long noun-heavy sentences, metaphor in place of plain statement, and closing lines written for effect.",
      decision:
        "Wrote a skill that applies while Claude is writing, with rules on claims, sentence shape, and endings, and a Scope section for the genres where those rules give way. In October 2026 I audited my own first release against newer research, found that its rewritten examples had swapped the 2023 tells for the 2026 ones and added facts their originals did not contain, and rewrote the rules. Each blind round is published, including a draft that lost to the previous version.",
      outcome:
        "In blind pairs, two model judges each preferred the skill’s text to no-skill text in 5 of 6 pairs with Sonnet and Opus writing, and three judges each preferred it in 3 of 3 with Haiku writing. The samples are small and the judges are Claude models. A later test on new tasks found 2 of 9 passages stating something about the reader’s team that nobody had supplied. A reworded rule did not clear the bar set in advance. The skill does not change AI-detector scores and says so.",
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
    name: "WorkDeck",
    description:
      "Claude Code plugin that runs a project as cards: one card per session, with a scope gate, a separate reviewer agent and one pull request. v0.1.3, MIT.",
    href: "https://github.com/AshwinSathian/workdeck",
  },
  {
    name: "github-issue-analyzer",
    description:
      "Fastify + TypeScript service that caches a repo’s GitHub issues in SQLite and analyzes them with a local LLM over Ollama, so triage never leaves your machine.",
    href: "https://github.com/AshwinSathian/github-issue-analyzer",
  },
  {
    name: "angularjs-migration-copilot",
    description:
      "AngularJS to Angular migration CLI: deterministic AST codemods, an LLM fallback, and a compile-and-test gate on every AI-touched change. Inventory, scaffold, the codemods and the compile-and-test gate are built; the LLM fallback and a hosted demo are not.",
    href: "https://github.com/AshwinSathian/angularjs-migration-copilot",
    status: "In progress",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}

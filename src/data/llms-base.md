# Ashwin Sathian

> Senior full-stack engineer with eight years of experience. Founding engineer at Penny Software for five of them, taking it from zero to a procurement platform that grew to $1B+ in GTV. Eight independent products shipped on his own time.

## Site

ashwinsathian.com is a static site built with Astro and served from Cloudflare's edge. Pages: / (home: about, lately, writing, projects, work, contact), /projects (index plus eight project pages, five of them full case studies in Problem, Decision and Outcome form), /experience (the full seven-role record), /writing (technical notes, RSS at /writing/feed.xml) and /colophon. Every post is also available as plain Markdown by adding .md to its URL. /llms-full.txt carries this file plus the full text of every post.

Four of the five case studies (Booklet, Weir, Wayfarer, humanize-writing-skill) carry a dated Decision Record documenting a disclosed reversal (a rollback, a claim that was reworded, a rule that was replaced) with before/after reasoning, and Typester carries one for its rebuild. Booklet's case study includes a system architecture diagram.

## About

Ashwin Sathian is an engineer based in Kochi, Kerala, India, with eight years
across full-stack and platform engineering. He joined Penny Software, a B2B
procurement SaaS platform, as a founding engineer in June 2020 and stayed
five years, progressing from Full Stack Developer to Product Specialist to
Lead Engineer. As Product Specialist he built RBAC and multi-tenant security
in-house, cut API and database response times by about 40%, and moved the
team to iterative agile delivery, cutting release cycles by 1.5x. As Lead
Engineer he owned platform architecture for a modular SaaS procurement
system that grew to $1B+ GTV across millions of records, designed and
expanded the Angular, NestJS, and MongoDB stack to hold sub-200ms queries at
that scale, and mentored the 12-person team building it. In that role he
also sat with a customer who was vetting vendors by hand, distilled the
spec, and built and owned the Vendor Pre-Qualification System from scratch,
schema to UI.

From March to June 2026 he was Lead Engineer for HighLevel's Funnels,
Websites, and Webinars products, under a model where each engineer ran the
full SDLC alone, AI-augmented, as a full-stack builder. He reworked the
reverse proxy engine serving the websites and funnels built on the platform.

Ashwin uses AI tooling (Claude Code and OpenAI Codex) to work faster
without changing who owns the decisions: he still writes the spec and ships
the code himself.

## Career History

- **HighLevel**: Lead Engineer, Funnels/Websites/Webinars (Mar 2026 – Jun 2026)
- **Penny Software**: Lead Engineer (Jan 2024 – Aug 2025)
- **Penny Software**: Product Specialist, hybrid engineering and product (Apr 2022 – Dec 2023)
- **Penny Software**: Full Stack Developer, founding engineer (Jun 2020 – Mar 2022)
- **Manaraah**: Senior Full Stack Developer (Jan 2020 – Jun 2020)
- **WeCP**: Software Development Engineer (Jan 2019 – Jan 2020)
- **Reubro International**: Junior Programmer (Aug 2018 – Jan 2019)

## Skills & Stack

**Frontend:** Angular, React, Next.js
**Backend:** Node.js, NestJS, Express
**Data:** MongoDB
**Cloud & DevOps:** GCP, AWS, Docker, GitHub Actions
**Languages:** TypeScript, JavaScript, Python
**AI & Tooling:** Claude Code, OpenAI Codex
**Practices:** SaaS architecture, multi-tenancy, RBAC

## Education

B.Tech, Electronics and Communication Engineering, National Institute of Technology Calicut (2014 – 2018)

## Projects

Eight projects designed, built, and run end to end, outside of work. Full case studies at ashwinsathian.com/projects/[slug].

- **Booklet** (booklet.ashwinsathian.com): Publishes Markdown incident reports, ADRs, RFCs and runbooks as web pages, with team spaces. A web editor, REST API, published CLI (booklet-cli on npm), a GitHub Action (publish-to-booklet), and an MCP server with 7 tools for AI assistants. Next.js 16, MongoDB, in-house auth with passkeys. Private repository; the app is AGPL-3.0, the CLI and MCP server MIT. Self-hosted via PM2 behind a Cloudflare Tunnel, after rolling back off Cloudflare Workers/OpenNext in May 2026.
- **Weir** (weir.ashwinsathian.com, github.com/AshwinSathian/weir): Go library for shared HTTP caching in front of an origin that has to stay up. RFC 9111 caching with lifetime jitter, request coalescing, an origin concurrency limit shared across keys, stale serving, a circuit breaker, and a default that forwards to the origin only what the cache keyed. Adapters for net/http and Caddy, a Valkey store, Prometheus metrics. Built through Claude Code sessions from 103 task cards; 155 requirement IDs traced to tests and a 51-threat model. v1.2.0, October 2026, Apache-2.0: large responses downloaded once for every waiting client, coalescing across nodes on a shared Valkey server, Go 1.26 support. New, with no production history yet.
- **BRNR** (brnr.ashwinsathian.com): End-to-end encrypted, ephemeral messaging. No accounts, 24-hour message expiry, Redis-only persistence with hard TTLs, X3DH handshake plus Double Ratchet from a signed, vendored library (not independently audited). NestJS, Socket.IO, Expo/React Native. Private repository, proprietary.
- **Wayfarer** (wayfarer.ashwinsathian.com, github.com/AshwinSathian/wayfarer): API client that opens in a browser tab, local-first with no account. Collections, environments and history in IndexedDB; a client-side encrypted secrets vault (PBKDF2 at 600,000 iterations + AES-GCM-256, key held in memory only); Postman, Insomnia, OpenAPI, HAR and cURL import; pre/post-request scripts in a QuickJS sandbox, held until reviewed (back in every build since 2.1.0, after a September 2026 audit); GraphQL, WebSockets and event streams; collection runs and a command line (wayfarer-cli on npm); an optional Local Bridge (wayfarer-bridge on npm) for what a browser can't do; collections shared as encrypted links. The composer says what the browser will do to a request before it is sent. 94 public claims, each with tests that run in Chromium, Firefox and WebKit. Version 3.4.0, November 2026, MIT. Angular 22; the site is Astro 7. First commit January 2020 as api-sandbox, renamed Wayfarer in July 2026. Its decision record is a claim about the production page's scripts that was reworded on 9 November 2026.
- **ngx-runtime-i18n** (i18n.ashwinsathian.com): Signals-first runtime internationalisation for Angular. SSR-safe via TransferState, with configurable fallback chains. Six packages published on npm. MIT.
- **Typester**: Keyboard-first typing speed game (typester.ashwinsathian.com). Ground-up rebuild of a 2018 app. Zoneless Angular 22, signals-first, no NgRx, static prerendered deploy via Cloudflare Workers Builds. MIT.
- **better-auth-mongoose** (better-auth-mongoose.ashwinsathian.com): Published npm package: a Mongoose-native database adapter for Better Auth, closing a gap documented on Better Auth's issue tracker since February 2025. .populate() support tested in CI, a companion tenant-scoping plugin, and a NestJS integration example. MIT.
- **humanize-writing-skill** (humanize.ashwinsathian.com, github.com/AshwinSathian/humanize-writing-skill): A Claude Code skill that guides how Claude writes prose so it does not read as machine-written, for human readers (it does not change AI-detector scores). It applies while Claude is writing. Version 2.0.0 (October 2026) rewrote the rules against cited 2026 research; version 2.1.0 lets an author's own voice outrank the rules. Tested in blind pairs on Claude Haiku, Sonnet, and Opus (18 pairs), with the losses published. A pre-registered test of one proposed rule change was run on new tasks and the change was not adopted; that result is published too. The project site lists the 2026 AI-writing tells with sources and has its own llms.txt at humanize.ashwinsathian.com/llms.txt. MIT.

## Also shipped

Smaller repos, listed on /projects without a case study:

- **WorkDeck** (github.com/AshwinSathian/workdeck): Claude Code plugin that runs a project as cards: one card per session, with a scope gate, a separate reviewer agent and one pull request. v0.1.3, MIT.
- **github-issue-analyzer** (github.com/AshwinSathian/github-issue-analyzer): Fastify + TypeScript service that caches a repo's GitHub issues in SQLite and analyzes them with a local LLM over Ollama, so triage never leaves your machine.
- **angularjs-migration-copilot** (github.com/AshwinSathian/angularjs-migration-copilot), in progress: AngularJS to Angular migration CLI: deterministic AST codemods, an LLM fallback, and a compile-and-test gate on every AI-touched change. Inventory, scaffold, the codemods and the compile-and-test gate are built; the LLM fallback and a hosted demo are not.

## Contact

- Email: hello@ashwinsathian.com
- LinkedIn: https://linkedin.com/in/ashwinsathian
- GitHub: https://github.com/AshwinSathian
- Website: https://ashwinsathian.com
- Résumé: https://ashwinsathian.com/Resume.pdf

# ashwinsathian.com

Personal site: writing, projects and work. Astro 7, Tailwind CSS 4, static output served from Cloudflare's edge.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # type-check, then build to dist/
npm test         # unit tests, plus a crawler-view check of dist/ (build first)
npm run deploy   # build, then wrangler deploy
```

## Where things live

| Path | What |
|---|---|
| `src/content/posts/*.md` | Posts. The filename is the URL slug. Front matter is validated in `src/content.config.ts`. |
| `src/data/*.ts` | Projects, experience, home copy, site constants. Check project facts against each repo before editing. |
| `src/data/llms-base.md` | Hand-written part of `/llms.txt`. The post list is generated. |
| `src/assets/projects/` | Screenshots. Astro resizes them to WebP at build. |
| `src/pages/og/` | Social cards, drawn with Satori at build time. |
| `worker/index.js` | Answers one path (Google verification). Everything else is static. |
| `public/_headers` | Security and cache headers. The CSP forbids inline scripts: keep scripts in files. |

Design notes: `DESIGN.md`. Plans and specs: `docs/superpowers/`.

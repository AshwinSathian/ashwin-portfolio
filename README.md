# Ashwin Sathian's Portfolio

[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Live Site](https://img.shields.io/badge/Live-ashwinsathian.com-8B5CF6)](https://ashwinsathian.com)

A near-black, monochrome personal portfolio built with Next.js and Tailwind CSS. Motion is native CSS (scroll-driven animations and view transitions). Design rules are in [DESIGN.md](DESIGN.md).

**Live site:** [ashwinsathian.com](https://ashwinsathian.com)

## Tech Stack

- [Next.js](https://nextjs.org/): React framework (App Router)
- [TailwindCSS](https://tailwindcss.com/): Utility-first styling
- [Shiki](https://shiki.style/): Syntax highlighting for posts
- Deployed on [Cloudflare Workers](https://developers.cloudflare.com/workers/) via [OpenNext](https://opennext.js.org/)

## Running Locally

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

Deploying is manual: `npm run deploy` builds with OpenNext and publishes to Cloudflare Workers.

Other scripts:

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # lint the codebase
```

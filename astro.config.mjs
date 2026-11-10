// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import fs from "node:fs";
import { shikiTheme } from "./src/lib/shiki-theme.mjs";

// slug to the latest of date/updatedAt, read straight from the front matter.
const dates = new Map(
  fs.readdirSync("src/content/posts").filter((f) => f.endsWith(".md")).map((f) => {
    const fm = fs.readFileSync(`src/content/posts/${f}`, "utf8");
    const get = (k) => fm.match(new RegExp(`^${k}: "?(\\d{4}-\\d{2}-\\d{2})`, "m"))?.[1] ?? "";
    return [f.replace(/\.md$/, ""), [get("date"), get("updatedAt")].sort().at(-1)];
  }),
);

export default defineConfig({
  site: "https://ashwinsathian.com",
  // Fully static: every page is HTML served from Cloudflare's edge.
  output: "static",
  trailingSlash: "never",
  build: { format: "file", inlineStylesheets: "never" },
  prefetch: { prefetchAll: false, defaultStrategy: "hover" },
  integrations: [
    sitemap({
      // lastmod only where a real date exists: posts carry one in front matter.
      serialize(item) {
        const m = item.url.match(/\/writing\/([^/]+)$/);
        const lastmod = m && dates.get(m[1]);
        return lastmod ? { ...item, lastmod: new Date(`${lastmod}T12:00:00Z`).toISOString() } : item;
      },
    }),
  ],
  markdown: { shikiConfig: { theme: shikiTheme } },
  // Never inline assets as data: URIs or inline scripts: the CSP in public/_headers forbids both.
  vite: { plugins: [tailwindcss()], build: { assetsInlineLimit: 0 } },
});

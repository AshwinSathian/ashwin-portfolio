import type { APIRoute } from "astro";
import { SITE } from "../data/site";

// Training crawlers (bulk collection for model training) are disallowed.
// Search and retrieval agents that fetch a page to answer or cite a query
// (OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, PerplexityBot)
// are not listed, so the `*` rule allows them, along with ordinary search engines.
// Google-Extended and Applebot-Extended are opt-out tokens, not separate bots.
const TRAINING = ["GPTBot", "ClaudeBot", "anthropic-ai", "Google-Extended", "CCBot", "Bytespider", "meta-externalagent", "Applebot-Extended", "Google-CloudVertexBot", "cohere-ai", "Diffbot", "ImagesiftBot", "Omgilibot", "PanguBot", "Timpibot"];

export const GET: APIRoute = () =>
  new Response(
    [`User-agent: *`, `Content-Signal: search=yes, ai-input=yes, ai-train=no`, `Allow: /`, ``, ...TRAINING.flatMap((ua) => [`User-agent: ${ua}`, `Content-Signal: ai-train=no`, `Disallow: /`, ``]), `Sitemap: ${SITE.website}/sitemap-index.xml`, ``].join("\n"),
    { headers: { "Content-Type": "text/plain; charset=utf-8" } },
  );

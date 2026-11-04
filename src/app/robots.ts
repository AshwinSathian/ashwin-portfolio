import type { MetadataRoute } from "next";
import { SITE } from "@/app/data/site";

// Training crawlers (bulk collection for model training) are disallowed.
// Search and retrieval agents that fetch a page to answer or cite a query
// (OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, PerplexityBot)
// are not listed, so the `*` rule allows them, along with ordinary search engines.
// Google-Extended and Applebot-Extended are opt-out tokens, not separate bots:
// blocking them keeps Google and Apple search indexing but opts out of AI training.
const TRAINING_CRAWLERS = [
  "GPTBot",
  "ClaudeBot",
  "anthropic-ai",
  "Google-Extended",
  "CCBot",
  "Bytespider",
  "meta-externalagent",
  "Applebot-Extended",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: TRAINING_CRAWLERS, disallow: "/" },
    ],
    sitemap: `${SITE.website}/sitemap.xml`,
  };
}

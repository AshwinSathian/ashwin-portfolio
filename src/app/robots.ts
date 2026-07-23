import type { MetadataRoute } from "next";
import { SITE } from "@/app/data/site";

// Selective AI crawler policy: retrieval bots (the ones that fetch a page live
// to answer a specific query: ChatGPT-User, PerplexityBot, Claude search) are
// allowed, since this site publishes an llms.txt specifically to be readable
// by them. Bulk training crawlers (GPTBot, Google-Extended, CCBot, the raw
// anthropic-ai UA) are disallowed. This content shouldn't be scraped into a
// model's training set without attribution, independent of whether it can be
// cited in an answer.
const TRAINING_CRAWLERS = ["GPTBot", "Google-Extended", "CCBot", "anthropic-ai", "Bytespider"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...TRAINING_CRAWLERS.map((userAgent) => ({ userAgent, disallow: "/" })),
    ],
    sitemap: `${SITE.website}/sitemap.xml`,
  };
}

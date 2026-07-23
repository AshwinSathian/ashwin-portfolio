// Single source of truth for the homepage FAQ — rendered as a visible section
// AND used to generate the FAQPage JSON-LD in the same page. Keeping these in
// one place means the structured data can never drift from what's on screen.

export type FaqItem = {
  question: string;
  answer: string;
};

export const FAQ: FaqItem[] = [
  {
    question: "Who is Ashwin Sathian?",
    answer:
      "A Lead Engineer based in Kochi, India. He currently leads engineering for HighLevel's Funnels, Websites, and Webinars products — three core revenue surfaces of a $1.5B+ ARR SaaS platform serving 60,000+ marketing agencies worldwide. Previously, he spent five years at Penny Software growing from Full Stack Developer to Lead Engineer, architecting a multi-tenant procurement platform that came to move over $1B in GTV.",
  },
  {
    question: "What is Ashwin Sathian's tech stack?",
    answer:
      "Angular, React, Next.js, NestJS, Node.js, MongoDB, and TypeScript, deployed on AWS and GCP. He uses AI tooling — Claude Code, GitHub Copilot, and LLM APIs — as a working part of how he designs and ships systems, not a bolt-on.",
  },
  {
    question: "What companies has Ashwin Sathian worked at?",
    answer:
      "HighLevel (Lead Engineer, March 2026–present), Penny Software (five years, 2020–2025, Full Stack Developer to Lead Engineer), Manaraah, WeCP, and Reubro International.",
  },
  {
    question: "What has Ashwin Sathian built outside of work?",
    answer:
      "Five side projects, each designed, built, and run end to end on his own: Booklet (a Markdown publishing SaaS product with an API, CLI, and MCP server), BRNR (end-to-end encrypted ephemeral messaging), Wayfarer (a local-first API client with a client-side encrypted secrets vault), ngx-runtime-i18n (a published Angular library), and Typester (a typing speed game). Full case studies are linked from the Projects section.",
  },
  {
    question: "Where can I contact Ashwin Sathian?",
    answer:
      "Email at ashwinsathyan19@gmail.com, LinkedIn at linkedin.com/in/ashwinsathian, or GitHub at github.com/AshwinSathian.",
  },
];

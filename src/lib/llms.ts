import fs from "node:fs";
import { ALSO_SHIPPED, PROJECTS, type Project } from "../data/projects";
import { SITE } from "../data/site";
import { getPosts } from "./posts";

const base = () => fs.readFileSync("src/data/llms-base.md", "utf8").trimEnd();
const today = () => new Date().toISOString().slice(0, 10);

const LINK_LABELS = { live: "Live", github: "Repository", npm: "npm", vscode: "VS Code" } as const;

/** One project as Markdown, built from the same data as its page. */
export function projectMarkdown(p: Project): string {
  const links = (Object.entries(p.links) as [keyof typeof LINK_LABELS, string][]).map(([k, v]) => `- ${LINK_LABELS[k]}: ${v}`);
  const story = p.caseStudy
    ? `## Problem\n\n${p.caseStudy.problem}\n\n## Decision\n\n${p.caseStudy.decision}\n\n## Outcome\n\n${p.caseStudy.outcome}`
    : p.description.join("\n\n");
  const dr = p.decisionRecord
    ? `\n\n## Revised in public (${p.decisionRecord.date})\n\n- Was: ${p.decisionRecord.before}\n- Now: ${p.decisionRecord.after}\n- Why: ${p.decisionRecord.why}`
    : "";
  return `# ${p.name}: ${p.category}${p.status ? ` (${p.status})` : ""}

By Ashwin Sathian. ${SITE.website}/projects/${p.slug}

> ${p.tagline}

${links.join("\n")}

## Facts

${p.facts.map((f) => `- ${f.label}: ${f.value}`).join("\n")}
- Stack: ${p.stack.join(", ")}

${story}

## Highlights

${p.highlights.map((h) => `- **${h.title}.** ${h.detail}`).join("\n")}${dr}
`;
}

/** The index: hand-written facts, plus project and post lists built from the data so they cannot drift. */
export async function llmsTxt() {
  const posts = await getPosts();
  const projects = PROJECTS.map((p) => `- [${p.name}](${SITE.website}/projects/${p.slug}.md) (${p.category}${p.status ? `, ${p.status}` : ""}): ${p.tagline}`).join("\n");
  const also = ALSO_SHIPPED.map((a) => `- [${a.name}](${a.href})${a.status ? ` (${a.status})` : ""}: ${a.description}`).join("\n");
  const list = posts
    .map((p) => `- [${p.data.title}](${SITE.website}/writing/${p.id}.md) (${p.data.date}): ${p.data.description}`)
    .join("\n");
  const [head, tail] = base().split("## Contact");
  const [h1, ...rest] = (head ?? "").split("\n\n");
  return `${h1}\n\nLast updated: ${today()}\n\n${rest.join("\n\n")}## Projects\n\nEight projects built on his own time. Each link is the Markdown version of the project page, with its facts, case study and highlights.\n\n${projects}\n\n## Also shipped\n\nSmaller repositories, listed on /projects without a case study.\n\n${also}\n\n## Writing\n\nTechnical notes at ${SITE.website}/writing (RSS: ${SITE.website}/writing/feed.xml), newest first. Each link is the Markdown version of the post.\n\n${list}\n\n## Optional\n\n- [Experience](${SITE.website}/experience): every role, with dates and stack\n- [Colophon](${SITE.website}/colophon): how this site is built\n- [Résumé](${SITE.website}${SITE.resumePath}): PDF\n\n## Contact${tail}\n`;
}

/** Everything in one file, for agents that want a single fetch. */
export async function llmsFullTxt() {
  const posts = await getPosts();
  const projects = PROJECTS.map(projectMarkdown).join("\n\n---\n\n");
  const full = posts
    .map((p) => `# ${p.data.title}\n\nPublished ${p.data.date}${p.data.updatedAt ? `, updated ${p.data.updatedAt}` : ""} by Ashwin Sathian. ${SITE.website}/writing/${p.id}\n\n${p.body ?? ""}`)
    .join("\n\n---\n\n");
  return `${await llmsTxt()}\n---\n\n${projects}\n\n---\n\n${full}\n`;
}

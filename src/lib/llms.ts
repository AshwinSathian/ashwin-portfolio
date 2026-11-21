import fs from "node:fs";
import { GAMES, GAMES_CATALOGUE } from "../data/games";
import { SECTIONS } from "../data/home";
import { ALSO_SHIPPED, PROJECTS, type Project } from "../data/projects";
import { ORDERED_PROJECTS } from "./projects";
import { numberWord } from "./text";
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
  const line = (slug: string) => {
    const p = PROJECTS.find((x) => x.slug === slug)!;
    return `- [${p.name}](${SITE.website}/projects/${p.slug}.md) (${p.category}${p.status ? `, ${p.status}` : ""}): ${p.tagline}`;
  };
  const also = (name: string) => {
    const a = ALSO_SHIPPED.find((x) => x.name === name)!;
    return `- [${a.name}](${a.href})${a.status ? ` (${a.status})` : ""}: ${a.description}`;
  };
  const gamesLine = `- [Games](${SITE.website}/projects/games): ${numberWord(GAMES.length)} small browser games (${GAMES.map((g) => g.name).join(", ")}). Catalogue: ${GAMES_CATALOGUE}. The ones with a full page are listed below.`;
  const projects = SECTIONS.map((s) => {
    const body = s.view === "games" ? [gamesLine, ...s.slugs.map(line)] : [...s.slugs.map(line), ...(s.also ?? []).map(also)];
    return `### ${s.title}\n\n${s.blurb}\n\n${body.join("\n")}`;
  }).join("\n\n");
  const list = posts
    .map((p) => `- [${p.data.title}](${SITE.website}/writing/${p.id}.md) (${p.data.date}): ${p.data.description}`)
    .join("\n");
  const [head, tail] = base().split("## Contact");
  const [h1, ...rest] = (head ?? "").split("\n\n");
  return `${h1}\n\nLast updated: ${today()}\n\n${rest.join("\n\n")}## Projects\n\nBuilt on his own time and grouped by kind. Each project link is the Markdown version of its page, with its facts, case study and highlights. Entries that link to GitHub are smaller repositories without a page of their own.\n\n${projects}\n\n## Writing\n\nTechnical notes at ${SITE.website}/writing (RSS: ${SITE.website}/writing/feed.xml), newest first. Each link is the Markdown version of the post.\n\n${list}\n\n## Optional\n\n- [Experience](${SITE.website}/experience): every role, with dates and stack\n- [Colophon](${SITE.website}/colophon): how this site is built\n- [Résumé](${SITE.website}${SITE.resumePath}): PDF\n\n## Contact${tail}\n`;
}

/** Everything in one file, for agents that want a single fetch. */
export async function llmsFullTxt() {
  const posts = await getPosts();
  const projects = ORDERED_PROJECTS.map(projectMarkdown).join("\n\n---\n\n");
  const full = posts
    .map((p) => `# ${p.data.title}\n\nPublished ${p.data.date}${p.data.updatedAt ? `, updated ${p.data.updatedAt}` : ""} by Ashwin Sathian. ${SITE.website}/writing/${p.id}\n\n${p.body ?? ""}`)
    .join("\n\n---\n\n");
  return `${await llmsTxt()}\n---\n\n${projects}\n\n---\n\n${full}\n`;
}

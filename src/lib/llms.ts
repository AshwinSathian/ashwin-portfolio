import fs from "node:fs";
import { SITE } from "../data/site";
import { getPosts } from "./posts";

const base = () => fs.readFileSync("src/data/llms-base.md", "utf8").trimEnd();

/** The index: hand-written facts, plus a post list built from the content so it cannot drift. */
export async function llmsTxt() {
  const posts = await getPosts();
  const list = posts
    .map((p) => `- [${p.data.title}](${SITE.website}/writing/${p.id}.md) (${p.data.date}): ${p.data.description}`)
    .join("\n");
  const [head, tail] = base().split("## Contact");
  return `${head}## Writing\n\nTechnical notes at ${SITE.website}/writing (RSS: ${SITE.website}/writing/feed.xml), newest first. Each link is the Markdown version of the post.\n\n${list}\n\n## Contact${tail}\n`;
}

/** Everything in one file, for agents that want a single fetch. */
export async function llmsFullTxt() {
  const posts = await getPosts();
  const full = posts
    .map((p) => `# ${p.data.title}\n\nPublished ${p.data.date}${p.data.updatedAt ? `, updated ${p.data.updatedAt}` : ""} by Ashwin Sathian. ${SITE.website}/writing/${p.id}\n\n${p.body ?? ""}`)
    .join("\n\n---\n\n");
  return `${await llmsTxt()}\n---\n\n${full}\n`;
}

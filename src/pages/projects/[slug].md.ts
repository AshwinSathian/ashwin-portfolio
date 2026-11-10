import type { APIRoute, GetStaticPaths } from "astro";
import { PROJECTS, type Project } from "../../data/projects";
import { projectMarkdown } from "../../lib/llms";

export const getStaticPaths = (() => PROJECTS.map((project) => ({ params: { slug: project.slug }, props: { project } }))) satisfies GetStaticPaths;

// The same project as plain Markdown, for readers and agents that want no markup.
export const GET: APIRoute = ({ props }) =>
  new Response(projectMarkdown((props as { project: Project }).project), { headers: { "Content-Type": "text/markdown; charset=utf-8" } });

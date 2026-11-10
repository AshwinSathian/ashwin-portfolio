import type { APIRoute, GetStaticPaths } from "astro";
import { SITE } from "../../data/site";
import { getPosts, type Post } from "../../lib/posts";

export const getStaticPaths = (async () => (await getPosts()).map((post) => ({ params: { slug: post.id }, props: { post } }))) satisfies GetStaticPaths;

// The same post as plain Markdown, for readers and agents that want no markup.
export const GET: APIRoute = ({ props }) => {
  const { data, id, body } = (props as { post: Post }).post;
  const text = `# ${data.title}\n\nBy Ashwin Sathian. Published ${data.date}${data.updatedAt ? `, updated ${data.updatedAt}` : ""}. ${SITE.website}/writing/${id}\n\n> ${data.description}\n\n${body ?? ""}\n`;
  return new Response(text, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
};

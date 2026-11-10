import type { APIRoute, GetStaticPaths } from "astro";
import { PROJECTS } from "../../data/projects";
import { getPosts } from "../../lib/posts";
import { siteCard, titleCard, type Tone } from "../../lib/og";
import { capitalize, numberWord } from "../../lib/text";

type Card = { kind: "site" } | { kind: "title"; title: string; description?: string; label: string; tone: Tone };

export const getStaticPaths = (async () => {
  const posts = await getPosts();
  const pages: [string, Card][] = [
    ["site", { kind: "site" }],
    ["projects", { kind: "title", title: `${capitalize(numberWord(PROJECTS.length))} projects`, description: "Products and libraries I built on my own time.", label: "Projects", tone: "teal" }],
    ["writing", { kind: "title", title: "Writing", description: "Technical notes from the libraries and tools I build, including what I got wrong.", label: "Writing", tone: "yellow" }],
    ["experience", { kind: "title", title: "Eight years, seven roles", description: "From junior programmer to owning platform architecture at Penny Software.", label: "Experience", tone: "orange" }],
    ["colophon", { kind: "title", title: "Colophon", description: "How this site is put together, and why.", label: "Colophon", tone: "blue" }],
    ...PROJECTS.map((p): [string, Card] => [`projects/${p.slug}`, { kind: "title", title: p.name, description: p.tagline, label: p.category, tone: "teal" }]),
    ...posts.map((p): [string, Card] => [`writing/${p.id}`, { kind: "title", title: p.data.title, description: p.data.description, label: "Writing", tone: "yellow" }]),
  ];
  return pages.map(([slug, card]) => ({ params: { slug }, props: { card } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const card = props.card as Card;
  const body = card.kind === "site" ? await siteCard() : await titleCard(card);
  return new Response(new Uint8Array(body), { headers: { "Content-Type": "image/png" } });
};

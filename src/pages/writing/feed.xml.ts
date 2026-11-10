import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { SITE } from "../../data/site";
import { getPosts } from "../../lib/posts";

export const GET: APIRoute = async (context) => {
  const posts = await getPosts();
  return rss({
    title: "Ashwin Sathian: Writing",
    description: "Technical notes from the libraries and tools I build, including what I got wrong.",
    site: context.site ?? SITE.website,
    trailingSlash: false,
    xmlns: { atom: "http://www.w3.org/2005/Atom", dc: "http://purl.org/dc/elements/1.1/" },
    customData: `<language>en-us</language><atom:link href="${SITE.website}/writing/feed.xml" rel="self" type="application/rss+xml"/><lastBuildDate>${new Date(`${posts[0]?.data.updatedAt ?? posts[0]?.data.date}T12:00:00Z`).toUTCString()}</lastBuildDate>`,
    items: posts.map((p) => ({
      title: p.data.title,
      link: `/writing/${p.id}`,
      // Calendar days; noon UTC keeps the day stable in any reader's timezone.
      pubDate: new Date(`${p.data.date}T12:00:00Z`),
      description: p.data.description,
      categories: p.data.tags,
      customData: "<dc:creator>Ashwin Sathian</dc:creator>",
    })),
  });
};

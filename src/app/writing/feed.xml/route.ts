import { SITE } from "@/app/data/site";
import { getAllPosts } from "@/lib/writing";

export const dynamic = "force-static";

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

// Post dates are calendar days; noon UTC keeps the day stable in any reader's timezone.
const rfc822 = (isoDay: string) => new Date(`${isoDay}T12:00:00Z`).toUTCString();

export function GET() {
  const posts = getAllPosts();
  const feedUrl = `${SITE.website}/writing/feed.xml`;

  const items = posts
    .map((post) => {
      const url = `${SITE.website}/writing/${post.slug}`;
      return `    <item>
      <title>${escape(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${rfc822(post.date)}</pubDate>
      <description>${escape(post.description)}</description>
${(post.tags ?? []).map((tag) => `      <category>${escape(tag)}</category>`).join("\n")}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Ashwin Sathian: Writing</title>
    <link>${SITE.website}/writing</link>
    <description>Technical notes from the libraries and tools I build, including what I got wrong.</description>
    <language>en-us</language>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}

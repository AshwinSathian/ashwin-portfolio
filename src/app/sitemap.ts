import type { MetadataRoute } from "next";
import { PROJECTS } from "@/app/data/projects";
import { SITE } from "@/app/data/site";
import { getAllPosts } from "@/lib/writing";

// lastModified only where a real date exists (posts). Cross-posted entries are
// left out: their canonical points at the original, so they aren't ours to index.
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE.website;

  const posts: MetadataRoute.Sitemap = getAllPosts()
    .filter((post) => !post.canonical)
    .map((post) => ({
      url: `${baseUrl}/writing/${post.slug}`,
      lastModified: post.updatedAt ?? post.date,
    }));

  return [
    { url: `${baseUrl}/` },
    { url: `${baseUrl}/writing` },
    { url: `${baseUrl}/projects` },
    { url: `${baseUrl}/experience` },
    ...posts,
    ...PROJECTS.map((project) => ({ url: `${baseUrl}/projects/${project.slug}` })),
    { url: `${baseUrl}${SITE.resumePath}` },
  ];
}

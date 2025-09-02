import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: "https://ashwin-smoky.vercel.app/",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://ashwin-smoky.vercel.app/Resume.pdf",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];
}

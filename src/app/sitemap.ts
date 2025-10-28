import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: "https://ashwinsathian.com/",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://ashwinsathian.com/Resume.pdf",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];
}

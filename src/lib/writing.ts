import fs from "fs";
import path from "path";
import matter from "gray-matter";

// ─── Content directory ────────────────────────────────────────────────────────
// Drop .md files here to publish them. Filename becomes the URL slug.
// Example: src/content/writing/my-post.md → /writing/my-post
export const WRITING_DIR = path.join(process.cwd(), "src/content/writing");

// ─── Types ────────────────────────────────────────────────────────────────────

export type PostMeta = {
  slug: string;

  // Required front matter
  title: string;
  date: string;       // ISO 8601: "YYYY-MM-DD"
  description: string;

  // Optional front matter
  tags?: string[];
  draft?: boolean;
  updatedAt?: string; // ISO 8601 — shown if different from date
  coverImage?: string; // relative path or URL — used for OG image override
  canonical?: string;  // canonical URL if cross-posted elsewhere

  // Computed
  readingTime: number; // minutes, rounded up
  formattedDate: string;       // e.g. "March 10, 2025"
  formattedUpdatedAt?: string; // e.g. "April 2, 2025"
};

export type Post = {
  meta: PostMeta;
  content: string; // raw Markdown body (front matter stripped)
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function estimateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Returns all published posts sorted newest-first.
 * In production, posts with `draft: true` are excluded.
 */
export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(WRITING_DIR)) return [];

  const files = fs
    .readdirSync(WRITING_DIR)
    .filter((f) => f.endsWith(".md") && f !== ".gitkeep");

  const posts = files
    .map((filename): PostMeta | null => {
      const slug = filename.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(WRITING_DIR, filename), "utf8");
      const { data, content } = matter(raw);

      if (isProduction() && data.draft) return null;

      if (!data.title || !data.date || !data.description) {
        console.warn(`[writing] Missing required front matter in ${filename}`);
        return null;
      }

      return {
        slug,
        title: data.title as string,
        date: data.date as string,
        description: data.description as string,
        tags: Array.isArray(data.tags) ? (data.tags as string[]) : undefined,
        draft: data.draft === true,
        updatedAt: data.updatedAt as string | undefined,
        coverImage: data.coverImage as string | undefined,
        canonical: data.canonical as string | undefined,
        readingTime: estimateReadTime(content),
        formattedDate: formatDate(data.date as string),
        formattedUpdatedAt: data.updatedAt
          ? formatDate(data.updatedAt as string)
          : undefined,
      };
    })
    .filter((p): p is PostMeta => p !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return posts;
}

/**
 * Returns a single post by slug.
 * Returns null if not found or (in production) if draft.
 */
export function getPost(slug: string): Post | null {
  const filepath = path.join(WRITING_DIR, `${slug}.md`);
  if (!fs.existsSync(filepath)) return null;

  const raw = fs.readFileSync(filepath, "utf8");
  const { data, content } = matter(raw);

  if (isProduction() && data.draft) return null;

  if (!data.title || !data.date || !data.description) {
    console.warn(`[writing] Missing required front matter in ${slug}.md`);
    return null;
  }

  return {
    meta: {
      slug,
      title: data.title as string,
      date: data.date as string,
      description: data.description as string,
      tags: Array.isArray(data.tags) ? (data.tags as string[]) : undefined,
      draft: data.draft === true,
      updatedAt: data.updatedAt as string | undefined,
      coverImage: data.coverImage as string | undefined,
      canonical: data.canonical as string | undefined,
      readingTime: estimateReadTime(content),
      formattedDate: formatDate(data.date as string),
      formattedUpdatedAt: data.updatedAt
        ? formatDate(data.updatedAt as string)
        : undefined,
    },
    content,
  };
}

/**
 * Returns all valid slugs (used by generateStaticParams).
 * In production, drafts are excluded.
 */
export function getPostSlugs(): string[] {
  return getAllPosts().map((p) => p.slug);
}

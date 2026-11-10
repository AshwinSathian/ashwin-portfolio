import { getCollection, type CollectionEntry } from "astro:content";
import { longDate } from "./text";

export type Post = CollectionEntry<"posts"> & { readingTime: number };

/** Published posts, newest first. Same-day posts sort by slug so the order is stable. */
export async function getPosts(): Promise<Post[]> {
  const entries = await getCollection("posts", ({ data }) => import.meta.env.DEV || !data.draft);
  return entries
    .map((e) => ({
      ...e,
      readingTime: Math.max(1, Math.round((e.body ?? "").trim().split(/\s+/).length / 200)),
    }))
    .sort((a, b) =>
      a.data.date === b.data.date ? a.id.localeCompare(b.id) : a.data.date < b.data.date ? 1 : -1,
    );
}

export const postDate = (p: Post) => longDate(p.data.date);

import { getAllPosts } from "@/lib/writing";
import PostList from "@/components/writing/PostList";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Writing — Ashwin Sathian",
  description:
    "Essays on engineering, architecture, and building things that last.",
};

export default function WritingPage() {
  const posts = getAllPosts();

  return (
    <main className="min-h-svh bg-canvas px-6 pb-24 pt-40 md:px-16">
      <div className="mx-auto max-w-3xl">
        <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-label-4">
          Writing
        </p>

        <h1
          className="mt-4 font-thin text-label-1 leading-none tracking-[-0.04em]"
          style={{ fontSize: "clamp(48px, 7vw, 80px)" }}
        >
          Writing.
        </h1>

        <PostList posts={posts} />
      </div>
    </main>
  );
}

import { getAllPosts } from "@/lib/writing";
import PostList from "@/components/writing/PostList";
import type { Metadata } from "next";

const writingDescription =
  "Essays on engineering, architecture, and building things that last.";

export const metadata: Metadata = {
  title: "Writing",
  description: writingDescription,
  openGraph: {
    title: "Writing — Ashwin Sathian",
    description: writingDescription,
    url: "https://ashwinsathian.com/writing",
    type: "website",
    images: [
      {
        url: "/og",
        width: 1200,
        height: 630,
        alt: "Writing — Ashwin Sathian",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Writing — Ashwin Sathian",
    description: writingDescription,
    creator: "@ashwinsathian",
    images: ["/og"],
  },
};

export default function WritingPage() {
  const posts = getAllPosts();

  return (
    <main className="min-h-svh bg-canvas px-6 pb-24 pt-40 md:px-16">
      <div className="mx-auto max-w-3xl">
        <p className="text-[11px] font-medium uppercase tracking-widest text-label-4">
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

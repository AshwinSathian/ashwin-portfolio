import { getAllPosts } from "@/lib/writing";
import PostList from "@/components/writing/PostList";
import type { Metadata } from "next";

const writingDescription =
  "Notes on engineering, architecture, and building things that last. New pieces on the way.";

export const metadata: Metadata = {
  title: "Writing",
  description: writingDescription,
  openGraph: {
    title: "Writing | Ashwin Sathian",
    description: writingDescription,
    url: "https://ashwinsathian.com/writing",
    type: "website",
    images: [
      {
        url: "/og?label=Writing",
        width: 1200,
        height: 630,
        alt: "Writing | Ashwin Sathian",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Writing | Ashwin Sathian",
    description: writingDescription,
    creator: "@ashwinsathian",
    images: ["/og?label=Writing"],
  },
};

export default function WritingPage() {
  const posts = getAllPosts();

  return (
    <main className="min-h-svh px-6 pb-24 pt-32 md:px-16 md:pt-40">
      <div className="mx-auto max-w-3xl">
        <p className="font-ui text-[11px] font-medium uppercase tracking-widest text-ink-muted">
          Writing
        </p>
        <h1 className="mt-4 font-display text-[clamp(36px,6vw,60px)] font-bold text-ink leading-none tracking-[-0.02em]">
          Writing.
        </h1>

        {posts.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-line bg-paper-raised p-8">
            <p className="font-display text-[13px] uppercase tracking-[0.1em] text-ink-muted">
              [Unreleased]
            </p>
            <p className="mt-3 max-w-lg font-body text-[16px] leading-[1.7] text-ink">
              Nothing published yet. Real entries land here the same way the rest of this site
              works — dated, and only once there&apos;s something worth logging.
            </p>
          </div>
        ) : (
          <p className="mt-6 max-w-lg font-body text-[16px] leading-[1.7] text-ink-muted">
            Notes on engineering, architecture, and building things that last.
          </p>
        )}

        <PostList posts={posts} />
      </div>
    </main>
  );
}

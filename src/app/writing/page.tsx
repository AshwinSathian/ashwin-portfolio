import { getAllPosts } from "@/lib/writing";
import PostList from "@/components/writing/PostList";
import type { Metadata } from "next";

const writingDescription =
  "Technical notes from the libraries and tools I build, including what I got wrong.";

const ogImageUrl = `/og?title=Writing&description=${encodeURIComponent(writingDescription)}&label=Writing`;

export const metadata: Metadata = {
  title: "Writing",
  description: writingDescription,
  alternates: { canonical: "https://ashwinsathian.com/writing" },
  openGraph: {
    title: "Writing | Ashwin Sathian",
    description: writingDescription,
    url: "https://ashwinsathian.com/writing",
    type: "website",
    images: [
      {
        url: ogImageUrl,
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
    images: [ogImageUrl],
  },
};

export default function WritingPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-svh px-6 pb-24 pt-32 md:px-16 md:pt-40">
      <div className="mx-auto max-w-3xl">
        <p className="font-ui text-micro font-medium uppercase tracking-widest text-ink-muted">
          Writing
        </p>
        <h1 className="mt-4 font-display text-display-2 font-semibold text-ink leading-none tracking-[-0.02em]">
          Writing.
        </h1>

        {posts.length === 0 ? (
          <div className="mt-10 rounded border border-line bg-paper-raised p-8">
            <p className="font-data text-[13px] uppercase tracking-widest text-ink-muted">
              [Unreleased]
            </p>
            <p className="mt-3 max-w-lg font-body text-[16px] leading-[1.7] text-ink">
              Nothing published yet. Entries will be dated, like the rest of this site, and
              posted only when there&apos;s something worth logging.
            </p>
          </div>
        ) : (
          <p className="mt-6 max-w-lg font-body text-[16px] leading-[1.7] text-ink-muted">
            {writingDescription}
          </p>
        )}

        <PostList posts={posts} />
      </div>
    </div>
  );
}

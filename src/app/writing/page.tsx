import { getAllPosts } from "@/lib/writing";
import PostList from "@/components/writing/PostList";
import { PageHeader } from "@/components/Section";
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
    <>
      <PageHeader
        title="Writing."
        intro={
          posts.length === 0
            ? "Nothing published yet. Entries will be dated, like the rest of this site, and posted only when there's something worth logging."
            : writingDescription
        }
      />
      <div className="shell pb-24 lg:pb-40">
        <div className="border-b border-line">
          <PostList posts={posts} />
        </div>
      </div>
    </>
  );
}

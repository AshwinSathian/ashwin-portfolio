import { notFound } from "next/navigation";
import Link from "next/link";
import { getPost, getPostSlugs } from "@/lib/writing";
import PostBody from "@/components/writing/PostBody";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return {
    title: `${post.meta.title} — Writing`,
    description: post.meta.description,
    alternates: post.meta.canonical ? { canonical: post.meta.canonical } : undefined,
    openGraph: {
      title: post.meta.title,
      description: post.meta.description,
      type: "article",
      publishedTime: post.meta.date,
      modifiedTime: post.meta.updatedAt,
      images: post.meta.coverImage
        ? [{ url: post.meta.coverImage }]
        : [{ url: "/og" }],
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const { meta, content } = post;

  return (
    <main className="min-h-svh bg-canvas px-6 pb-24 pt-40 md:px-16">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/writing"
          className="text-[11px] font-medium uppercase tracking-[0.1em] text-label-4 transition-colors duration-200 hover:text-label-2"
        >
          Writing
        </Link>

        <h1
          className="mt-6 font-extralight text-label-1 leading-tight tracking-[-0.03em]"
          style={{ fontSize: "clamp(32px, 5vw, 56px)" }}
        >
          {meta.title}
        </h1>

        <div className="mt-4 flex items-center gap-2 text-[13px] text-label-3">
          <span>{meta.formattedDate}</span>
          {meta.formattedUpdatedAt && meta.formattedUpdatedAt !== meta.formattedDate && (
            <>
              <span>·</span>
              <span>Updated {meta.formattedUpdatedAt}</span>
            </>
          )}
          <span>·</span>
          <span>{meta.readingTime} min read</span>
          {meta.draft && (
            <span className="rounded-full border border-white/15 px-2 py-0.5 text-[10px] text-label-3">
              Draft
            </span>
          )}
        </div>

        <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-label-2">
          {meta.description}
        </p>

        {meta.tags && meta.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {meta.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/6 px-3 py-0.5 text-[11px] text-label-4"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <hr className="mt-12 border-t border-white/8" />

        <div className="mt-12">
          <PostBody content={content} />
        </div>

        <hr className="mt-16 border-t border-white/8" />

        <div className="mt-8">
          <Link
            href="/writing"
            className="text-[15px] text-label-3 transition-colors duration-200 hover:text-label-1"
          >
            ← Writing
          </Link>
        </div>
      </div>
    </main>
  );
}

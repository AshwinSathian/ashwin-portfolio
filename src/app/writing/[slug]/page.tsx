import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllPosts, getPost, getPostSlugs } from "@/lib/writing";
import KineticHeading from "@/components/KineticHeading";
import PostBody from "@/components/writing/PostBody";
import type { Metadata } from "next";

const siteUrl = "https://ashwinsathian.com";

type Props = {
  params: Promise<{ slug: string }>;
};

// Posts are files in the repo, so every valid slug is known at build time.
export const dynamicParams = false;

export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  const { meta } = post;

  // Per-post OG image: pass title + description as query params to the dynamic route
  const ogImageUrl = meta.coverImage
    ? meta.coverImage
    : `/og?title=${encodeURIComponent(meta.title)}&description=${encodeURIComponent(meta.description)}`;

  const postUrl = `${siteUrl}/writing/${slug}`;

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: meta.canonical ?? postUrl,
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: postUrl,
      type: "article",
      publishedTime: meta.date,
      modifiedTime: meta.updatedAt ?? meta.date,
      authors: ["Ashwin Sathian"],
      tags: meta.tags,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: meta.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      creator: "@ashwinsathian",
      images: [ogImageUrl],
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const { meta, content } = post;

  const postUrl = `${siteUrl}/writing/${slug}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: meta.title,
    description: meta.description,
    url: postUrl,
    datePublished: meta.date,
    dateModified: meta.updatedAt ?? meta.date,
    author: {
      "@type": "Person",
      name: "Ashwin Sathian",
      url: siteUrl,
    },
    publisher: {
      "@type": "Person",
      name: "Ashwin Sathian",
      url: siteUrl,
    },
    ...(meta.tags && { keywords: meta.tags.join(", ") }),
  };

  const posts = getAllPosts();
  const position = posts.findIndex((p) => p.slug === slug);
  // List is newest-first, so the previous index is the newer post.
  const newer = position > 0 ? posts[position - 1] : undefined;
  const older = position >= 0 ? posts[position + 1] : undefined;

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div aria-hidden className="progress" />

      <header className="shell pb-10 pt-28 lg:pb-16 lg:pt-40">
        <Link href="/writing" className="load-rise mb-6 inline-flex min-h-11 items-center gap-2 text-small text-fg-3 hover:text-fg active:text-fg">
          <span aria-hidden>←</span>
          <span className="link">Writing</span>
        </Link>

        <KineticHeading
          text={meta.title}
          className="max-w-4xl text-display-l font-semibold tracking-[-0.035em]"
        />

        <p className="load-rise mt-6 max-w-2xl text-[1.1875rem] leading-[1.5] text-fg-2" style={{ "--d": "350ms" } as React.CSSProperties}>
          {meta.description}
        </p>

        <p className="load-rise mt-6 flex flex-wrap gap-x-3 gap-y-1 text-meta tabular-nums text-fg-3" style={{ "--d": "450ms" } as React.CSSProperties}>
          <span>{meta.formattedDate}</span>
          {meta.formattedUpdatedAt && meta.formattedUpdatedAt !== meta.formattedDate && (
            <span>· Updated {meta.formattedUpdatedAt}</span>
          )}
          <span>· {meta.readingTime} min read</span>
          {meta.draft && <span>· Draft</span>}
          {meta.tags && meta.tags.length > 0 && <span>· {meta.tags.join(", ")}</span>}
        </p>
      </header>

      <div className="shell border-t border-line py-12 lg:py-20">
        <PostBody content={content} />
      </div>

      {(newer || older) && (
        <nav aria-label="More writing" className="border-t border-line">
          <div className="shell grid sm:grid-cols-2 sm:gap-x-12">
            {[
              ["Older", older],
              ["Newer", newer],
            ].map(([label, post], i) =>
              post && typeof post !== "string" ? (
                <Link
                  key={post.slug}
                  href={`/writing/${post.slug}`}
                  className={`row flex flex-col gap-2 rounded-control border-b border-line py-8 last:border-b-0 sm:border-b-0 sm:py-12 ${i === 1 ? "sm:items-end sm:text-right" : ""}`}
                >
                  <span className="text-small text-fg-3">{label as string}</span>
                  <span className="text-title font-semibold tracking-[-0.02em] text-fg">
                    {post.title}
                  </span>
                </Link>
              ) : (
                <span key={label as string} className="hidden sm:block" />
              )
            )}
          </div>
        </nav>
      )}
    </article>
  );
}

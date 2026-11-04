import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllPosts, getPost, getPostSlugs } from "@/lib/writing";
import KineticHeading from "@/components/KineticHeading";
import PostBody from "@/components/writing/PostBody";
import ArrowLink from "@/components/ArrowLink";
import { PROJECTS } from "@/app/data/projects";
import { projectForPost } from "@/app/data/related";
import type { Metadata } from "next";

const siteUrl = "https://ashwinsathian.com";

function ogImageFor(meta: { title: string; description: string; coverImage?: string }) {
  return meta.coverImage
    ? meta.coverImage
    : `/og?title=${encodeURIComponent(meta.title)}&description=${encodeURIComponent(meta.description)}`;
}

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

  const ogImageUrl = ogImageFor(meta);
  // Cross-posted entries point canonical (and og:url) at the original.
  const canonicalUrl = meta.canonical ?? `${siteUrl}/writing/${slug}`;

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: canonicalUrl,
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
      images: [ogImageUrl],
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const { meta, content } = post;

  const canonicalUrl = meta.canonical ?? `${siteUrl}/writing/${slug}`;
  const ogImage = ogImageFor(meta);
  const project = PROJECTS.find((p) => p.slug === projectForPost(slug));

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: meta.title,
    description: meta.description,
    url: canonicalUrl,
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
    ...(meta.canonical && { isBasedOn: meta.canonical }),
    image: new URL(ogImage, siteUrl).href,
    datePublished: meta.date,
    dateModified: meta.updatedAt ?? meta.date,
    author: { "@id": `${siteUrl}/#person` },
    publisher: { "@id": `${siteUrl}/#person` },
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
          className="max-w-4xl text-display-l font-semibold tracking-[-0.025em]"
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

        {project && (
          <div className="load-rise mt-4" style={{ "--d": "500ms" } as React.CSSProperties}>
            <ArrowLink href={`/projects/${project.slug}`}>About the project: {project.name}</ArrowLink>
          </div>
        )}
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

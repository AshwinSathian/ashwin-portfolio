import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllPosts, getPost, getPostSlugs } from "@/lib/writing";
import KineticHeading, { twoLineSize } from "@/components/KineticHeading";
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
        <nav aria-label="Breadcrumb" className="load-rise mb-8 text-small text-fg-3 lg:mb-12">
          <ol className="flex flex-wrap items-center gap-x-2">
            <li>
              <Link href="/" className="inline-flex min-h-11 items-center hover:text-fg active:text-fg">
                <span className="link">Home</span>
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href="/writing" className="inline-flex min-h-11 items-center hover:text-fg active:text-fg">
                <span className="link">Writing</span>
              </Link>
            </li>
          </ol>
        </nav>

        <KineticHeading
          text={meta.title}
          className="text-display-l font-semibold tracking-[-0.025em]"
          // A long title may take three lines on a phone rather than drop below 24px.
          style={{ fontSize: `max(1.5rem, ${twoLineSize(meta.title, "var(--text-display-l)")})` }}
        />

        <p className="load-rise mt-6 max-w-2xl leading-[1.5] text-fg sm:text-[1.1875rem]" style={{ "--d": "350ms" } as React.CSSProperties}>
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

      <div className="shell pb-20 pt-8 lg:pb-32 lg:pt-12">
        <PostBody content={content} />
      </div>

      {(newer || older) && (
        <nav aria-label="More writing" className="shell pb-20 lg:pb-32">
          <h2 className="mb-6 text-display-m font-semibold tracking-[-0.025em] lg:mb-10">More writing</h2>
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            {[
              ["Older", older],
              ["Newer", newer],
            ].map(([label, post], i) =>
              post && typeof post !== "string" ? (
                <Link
                  key={post.slug}
                  href={`/writing/${post.slug}`}
                  className={`panel flex flex-col gap-3 p-6 lg:p-8 ${i === 1 ? "sm:col-start-2 sm:items-end sm:text-right" : ""}`}
                >
                  <span className="text-title font-semibold tracking-[-0.02em] text-fg">
                    {post.title}
                  </span>
                  <span className="text-small text-fg-2">{label === "Older" ? "Older post" : "Newer post"}</span>
                </Link>
              ) : null
            )}
          </div>
        </nav>
      )}
    </article>
  );
}

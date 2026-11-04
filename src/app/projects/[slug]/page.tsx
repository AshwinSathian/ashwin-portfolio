import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import ArchitectureDiagram from "@/components/ArchitectureDiagram";
import ArrowLink from "@/components/ArrowLink";
import DecisionRecord from "@/components/DecisionRecord";
import KineticHeading, { twoLineSize } from "@/components/KineticHeading";
import ProjectMedia from "@/components/ProjectMedia";
import { StatusTag } from "@/components/ProjectRow";
import PostList from "@/components/writing/PostList";
import { getProject, type ProjectWithStats } from "@/app/(helpers)/projects";
import { PROJECTS } from "@/app/data/projects";
import { PROJECT_POSTS } from "@/app/data/related";
import { SITE } from "@/app/data/site";
import { truncate } from "@/lib/text";
import { getAllPosts } from "@/lib/writing";

type RouteParams = { slug: string };
type PageProps = { params: Promise<RouteParams> };

export function generateStaticParams(): RouteParams[] {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: "Project not found" };

  const description = truncate(project.tagline, 160);
  const ogUrl = `/og?title=${encodeURIComponent(project.name)}&description=${encodeURIComponent(project.tagline)}&label=Projects`;

  return {
    title: `${project.name}: ${project.category}`,
    description,
    alternates: { canonical: `${SITE.website}/projects/${project.slug}` },
    openGraph: {
      title: `${project.name} | Ashwin Sathian`,
      description,
      url: `${SITE.website}/projects/${project.slug}`,
      images: [{ url: ogUrl, width: 1200, height: 630, alt: project.name }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.name} | Ashwin Sathian`,
      description,
      images: [ogUrl],
    },
  };
}

// Apps whose project data says outright that they cost nothing (Wayfarer: "no account, hosted
// backend, or pricing tier"). The others don't say, so they get no Offer.
const FREE_TO_USE = new Set(["wayfarer"]);
const LANGUAGES = ["Go", "TypeScript", "JavaScript", "Python"];

/** Libraries and skills are source code; everything else is an app people use in a browser. */
function projectSchema(project: ProjectWithStats) {
  const id = `${SITE.website}/projects/${project.slug}`;
  const common = {
    "@context": "https://schema.org",
    "@id": `${id}#software`,
    name: project.name,
    description: project.tagline,
    author: { "@id": `${SITE.website}/#person` },
  };

  if (/library|skill/i.test(project.category)) {
    const languages = LANGUAGES.filter((lang) => project.stack.some((s) => new RegExp(`^${lang}\\b`).test(s)));
    return {
      ...common,
      "@type": "SoftwareSourceCode",
      url: id,
      ...(project.links.github ? { codeRepository: project.links.github } : {}),
      ...(languages.length ? { programmingLanguage: languages.length === 1 ? languages[0] : languages } : {}),
    };
  }

  return {
    ...common,
    "@type": "WebApplication",
    url: project.links.live ?? id,
    applicationCategory: /game/i.test(project.category)
      ? "GameApplication"
      : /messaging/i.test(project.category)
        ? "CommunicationApplication"
        : "DeveloperApplication",
    operatingSystem: "Any (web browser)",
    ...(FREE_TO_USE.has(project.slug)
      ? { offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } }
      : {}),
  };
}

const LINK_LABELS: Record<keyof NonNullable<Awaited<ReturnType<typeof getProject>>>["links"], string> = {
  live: "Visit live site",
  github: "View on GitHub",
  npm: "View on npm",
  vscode: "Install for VS Code",
};

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const index = PROJECTS.findIndex((p) => p.slug === project.slug);
  const next = PROJECTS[(index + 1) % PROJECTS.length];

  const schema = projectSchema(project);
  const liveHost = project.links.live ? new URL(project.links.live).host : "";
  const relatedSlugs = PROJECT_POSTS[project.slug] ?? [];
  const relatedPosts = getAllPosts().filter((post) => relatedSlugs.includes(post.slug));

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.website },
      { "@type": "ListItem", position: 2, name: "Projects", item: `${SITE.website}/projects` },
      { "@type": "ListItem", position: 3, name: project.name, item: `${SITE.website}/projects/${project.slug}` },
    ],
  };

  const narrative: [string, string][] = project.caseStudy
    ? [
        ["Problem", project.caseStudy.problem],
        ["Decision", project.caseStudy.decision],
        ["Outcome", project.caseStudy.outcome],
      ]
    : [];

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

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
              <Link href="/projects" className="inline-flex min-h-11 items-center hover:text-fg active:text-fg">
                <span className="link">Projects</span>
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-fg-2">
              {project.name}
            </li>
          </ol>
        </nav>

        <KineticHeading
          text={project.name}
          className="text-display-xl font-bold tracking-[-0.03em] wrap-anywhere"
          style={{ fontSize: twoLineSize(project.name, "var(--text-display-xl)") }}
        />
        <p
          className="load-rise mt-6 max-w-3xl text-[1.1875rem] leading-[1.5] text-fg lg:mt-8 lg:text-[1.375rem]"
          style={{ "--d": "300ms" } as React.CSSProperties}
        >
          {project.tagline}
        </p>
        <p
          className="load-rise mt-4 flex flex-wrap items-center gap-3 text-fg-2"
          style={{ "--d": "350ms" } as React.CSSProperties}
        >
          {project.category}
          {project.status && <StatusTag>{project.status}</StatusTag>}
        </p>

        <div className="load-rise mt-6 flex flex-wrap gap-x-8" style={{ "--d": "400ms" } as React.CSSProperties}>
          {(Object.entries(project.links) as [keyof typeof LINK_LABELS, string][]).map(([key, href]) => (
            <ArrowLink key={key} href={href} external>
              {LINK_LABELS[key]}
            </ArrowLink>
          ))}
        </div>
      </header>

      <div className="shell">
        <ViewTransition name={`project-media-${project.slug}`} share="morph">
          <ProjectMedia media={project.media} priority />
        </ViewTransition>
      </div>

      <div className="shell grid grid-cols-1 gap-x-16 gap-y-20 py-20 lg:grid-cols-12 lg:py-32">
        {/* Rail: first in source so it follows the media on mobile; sticky at desktop. */}
        <aside aria-label="Project facts" className="min-w-0 lg:order-2 lg:col-span-4">
          <div className="panel flex flex-col gap-8 p-6 lg:sticky lg:top-24 lg:p-8">
            <h2 className="text-title font-semibold tracking-[-0.02em]">Facts</h2>
            <dl className="flex flex-col gap-5">
              {project.facts.map((fact) => (
                <div key={fact.label} className="flex flex-col gap-1">
                  <dt className="text-small text-fg-3">{fact.label}</dt>
                  <dd className="text-fg">{fact.value}</dd>
                </div>
              ))}
              {project.language && (
                <div className="flex flex-col gap-1">
                  <dt className="text-small text-fg-3">Primary language</dt>
                  <dd className="text-fg">{project.language}</dd>
                </div>
              )}
              {typeof project.stars === "number" && project.stars > 0 && (
                <div className="flex flex-col gap-1">
                  <dt className="text-small text-fg-3">GitHub stars</dt>
                  <dd className="tabular-nums text-fg">{project.stars}</dd>
                </div>
              )}
              <div className="flex flex-col gap-1">
                <dt className="text-small text-fg-3">Stack</dt>
                <dd className="text-small text-fg-2">{project.stack.join(" · ")}</dd>
              </div>
            </dl>
          </div>
        </aside>

        <div className="flex min-w-0 flex-col gap-20 lg:order-1 lg:col-span-8 lg:gap-32">
          {/* Case study where one exists, otherwise the plain description. Never both. */}
          {narrative.length > 0 ? (
            <div className="flex flex-col gap-14">
              {narrative.map(([label, text], i) => (
                <section key={label} aria-labelledby={`cs-${label}`} className="reveal flex flex-col gap-3">
                  <h2 id={`cs-${label}`} className="text-display-m font-semibold tracking-[-0.03em]">
                    {label}
                  </h2>
                  <p className={i === 0 ? "text-[1.1875rem] leading-[1.6] text-fg" : "text-fg"}>{text}</p>
                </section>
              ))}
            </div>
          ) : (
            <div className="reveal flex flex-col gap-5">
              {project.description.map((paragraph, i) => (
                <p key={i} className={i === 0 ? "text-[1.1875rem] leading-[1.6] text-fg" : "text-fg-2"}>
                  {paragraph}
                </p>
              ))}
            </div>
          )}

          {project.slug === "booklet" && (
            <section aria-labelledby="architecture-heading" className="flex flex-col gap-6">
              <h2 id="architecture-heading" className="reveal text-display-m font-semibold tracking-[-0.03em]">
                Architecture
              </h2>
              <ArchitectureDiagram />
            </section>
          )}

          <section aria-labelledby="highlights-heading" className="flex flex-col gap-8">
            <h2 id="highlights-heading" className="reveal text-display-m font-semibold tracking-[-0.03em]">
              Highlights
            </h2>
            <ul className="flex flex-col gap-10">
              {project.highlights.map((highlight) => (
                <li key={highlight.title} className="reveal flex flex-col gap-2">
                  <h3 className="text-title font-medium text-fg">{highlight.title}</h3>
                  <p className="text-fg-2">{highlight.detail}</p>
                </li>
              ))}
            </ul>
          </section>

          {project.decisionRecord && (
            <section aria-labelledby="decision-heading" className="flex flex-col gap-6">
              <h2 id="decision-heading" className="reveal text-display-m font-semibold tracking-[-0.03em]">
                Revised in public
              </h2>
              <DecisionRecord record={project.decisionRecord} />
            </section>
          )}

          {relatedPosts.length > 0 && (
            <section aria-labelledby="writing-heading" className="flex flex-col gap-4">
              <h2 id="writing-heading" className="reveal text-display-m font-semibold tracking-[-0.03em]">
                Writing about this
              </h2>
              <PostList posts={relatedPosts} as="h3" />
            </section>
          )}
        </div>
      </div>

      {project.links.live && (
        <section aria-labelledby="live-heading" className="shell pb-20 lg:pb-32">
          <h2 id="live-heading" className="reveal mb-6 text-display-m font-semibold tracking-[-0.03em] lg:mb-10">
            The live site
          </h2>
          <figure className="reveal-media flex flex-col gap-4">
            <div className="panel p-2 md:p-3">
              <Image
                src={`/projects/${project.slug}/live.webp`}
                alt={`The live ${project.name} site at ${liveHost}`}
                width={2400}
                height={1500}
                sizes="(min-width: 1200px) 1104px, 100vw"
                className="block h-auto w-full rounded-control"
              />
            </div>
            <figcaption className="text-small text-fg-2">
              <a href={project.links.live} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-fg">
                <span className="link">{liveHost}</span>
                <span aria-hidden className="arrow arrow-out">↗</span>
                <span className="sr-only"> (opens in new tab)</span>
              </a>
            </figcaption>
          </figure>
        </section>
      )}

      <div className="shell pb-20 lg:pb-32">
        <Link
          href={`/projects/${next.slug}`}
          className="panel group flex items-end justify-between gap-6 p-6 md:p-10 lg:p-14"
        >
          <span className="flex min-w-0 flex-col gap-3">
            <span className="text-display-l font-semibold tracking-[-0.025em] wrap-anywhere">{next.name}</span>
            <span className="text-fg-2">Next project: {next.category}</span>
          </span>
          <span aria-hidden className="arrow text-display-m text-fg-2">→</span>
        </Link>
      </div>
    </article>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import ArchitectureDiagram from "@/components/ArchitectureDiagram";
import ArrowLink from "@/components/ArrowLink";
import DecisionRecord from "@/components/DecisionRecord";
import KineticHeading from "@/components/KineticHeading";
import ProjectMedia from "@/components/ProjectMedia";
import { StatusTag } from "@/components/ProjectRow";
import { getProject } from "@/app/(helpers)/projects";
import { PROJECTS } from "@/app/data/projects";
import { SITE } from "@/app/data/site";

type RouteParams = { slug: string };
type PageProps = { params: Promise<RouteParams> };

export const revalidate = 3600;

export function generateStaticParams(): RouteParams[] {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: "Project not found" };

  const ogUrl = `/og?title=${encodeURIComponent(project.name)}&description=${encodeURIComponent(project.tagline)}&label=Projects`;

  return {
    title: project.name,
    description: project.tagline,
    alternates: { canonical: `${SITE.website}/projects/${project.slug}` },
    openGraph: {
      title: `${project.name} | Ashwin Sathian`,
      description: project.tagline,
      url: `${SITE.website}/projects/${project.slug}`,
      images: [{ url: ogUrl, width: 1200, height: 630, alt: project.name }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.name} | Ashwin Sathian`,
      description: project.tagline,
      images: [ogUrl],
    },
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

  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${SITE.website}/projects/${project.slug}#software`,
    name: project.name,
    description: project.tagline,
    url: `${SITE.website}/projects/${project.slug}`,
    applicationCategory: project.category,
    ...(project.links.github ? { codeRepository: project.links.github } : {}),
    author: { "@id": `${SITE.website}/#person` },
    creator: { "@id": `${SITE.website}/#person` },
    softwareRequirements: project.stack.join(", "),
  };

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

        <p className="load-rise mb-4 flex flex-wrap items-center gap-3 text-meta tabular-nums text-fg-3">
          {project.category}
          {project.status && <StatusTag>{project.status}</StatusTag>}
        </p>
        <KineticHeading
          text={project.name}
          className="text-display-xl font-bold tracking-[-0.045em] wrap-anywhere"
        />
        <p
          className="load-rise mt-6 max-w-3xl text-[1.1875rem] leading-[1.5] text-fg-2 lg:mt-8 lg:text-[1.375rem]"
          style={{ "--d": "300ms" } as React.CSSProperties}
        >
          {project.tagline}
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

      <div className="shell grid grid-cols-1 gap-x-16 gap-y-14 py-16 lg:grid-cols-12 lg:py-28">
        {/* Rail: first in source so it follows the media on mobile; sticky at desktop. */}
        <aside aria-label="Project facts" className="min-w-0 lg:order-2 lg:col-span-4">
          <div className="flex flex-col gap-8 lg:sticky lg:top-24">
            <dl className="flex flex-col border-t border-line">
              {project.facts.map((fact) => (
                <div key={fact.label} className="flex flex-col gap-1 border-b border-line py-4">
                  <dt className="text-small text-fg-3">{fact.label}</dt>
                  <dd className="text-fg">{fact.value}</dd>
                </div>
              ))}
              {project.language && (
                <div className="flex flex-col gap-1 border-b border-line py-4">
                  <dt className="text-small text-fg-3">Primary language</dt>
                  <dd className="text-fg">{project.language}</dd>
                </div>
              )}
              {typeof project.stars === "number" && project.stars > 0 && (
                <div className="flex flex-col gap-1 border-b border-line py-4">
                  <dt className="text-small text-fg-3">GitHub stars</dt>
                  <dd className="tabular-nums text-fg">{project.stars}</dd>
                </div>
              )}
            </dl>
            <div>
              <h2 className="mb-3 text-small text-fg-3">Stack</h2>
              <p className="text-meta tabular-nums leading-[1.9] text-fg-2">{project.stack.join(" · ")}</p>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-col gap-16 lg:order-1 lg:col-span-8 lg:gap-24">
          {/* Case study where one exists, otherwise the plain description. Never both. */}
          {narrative.length > 0 ? (
            <div className="flex flex-col gap-12">
              {narrative.map(([label, text], i) => (
                <section key={label} aria-labelledby={`cs-${label}`} className="reveal flex flex-col gap-3">
                  <h2 id={`cs-${label}`} className="flex items-baseline gap-4 text-display-m font-semibold tracking-[-0.03em]">
                    <span aria-hidden className="text-meta tabular-nums font-normal tracking-normal text-fg-3">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {label}
                  </h2>
                  <p className={i === 0 ? "text-[1.1875rem] leading-[1.6] text-fg" : "text-fg-2"}>{text}</p>
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

          <section aria-labelledby="highlights-heading" className="flex flex-col gap-2">
            <h2 id="highlights-heading" className="reveal text-display-m font-semibold tracking-[-0.03em]">
              Highlights
            </h2>
            <ol className="flex flex-col">
              {project.highlights.map((highlight, i) => (
                <li key={highlight.title} className="reveal grid gap-x-6 gap-y-2 border-b border-line py-7 sm:grid-cols-[2.5rem_1fr]">
                  <span aria-hidden className="text-meta tabular-nums text-fg-3 sm:pt-1.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-title font-medium text-fg">{highlight.title}</h3>
                    <p className="text-fg-2">{highlight.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {project.decisionRecord && (
            <section aria-labelledby="decision-heading" className="flex flex-col gap-6">
              <h2 id="decision-heading" className="reveal text-display-m font-semibold tracking-[-0.03em]">
                Revised in public
              </h2>
              <DecisionRecord record={project.decisionRecord} />
            </section>
          )}
        </div>
      </div>

      <Link
        href={`/projects/${next.slug}`}
        className="group block border-t border-line transition-colors duration-300 hover:bg-surface active:bg-surface"
      >
        <div className="shell flex items-end justify-between gap-6 py-14 lg:py-24">
          <div className="flex min-w-0 flex-col gap-3">
            <span className="text-small text-fg-3">Next project</span>
            <span className="text-display-l font-semibold tracking-[-0.035em] wrap-anywhere">
              {next.name}
            </span>
          </div>
          <span aria-hidden className="arrow text-display-m text-fg-2">→</span>
        </div>
      </Link>
    </article>
  );
}

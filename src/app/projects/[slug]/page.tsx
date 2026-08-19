import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BackToProjectsButton from "@/components/BackToProjectsButton";
import DecisionRecord from "@/components/DecisionRecord";
import ProjectMedia from "@/components/ProjectMedia";
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

  return (
    <div className="mx-auto max-w-5xl px-6 py-24 pt-29 md:px-8 md:py-32 md:pt-33">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 font-ui text-[13px] text-ink-muted">
        <Link href="/" className="transition-colors duration-200 hover:text-ink">
          Home
        </Link>
        <span aria-hidden>/</span>
        <BackToProjectsButton />
        <span aria-hidden>/</span>
        <span aria-current="page" className="text-ink-muted">
          {project.name}
        </span>
      </nav>

      {/* Header */}
      <p className="mb-3 font-display text-[11px] uppercase tracking-widest text-ink-muted">
        {project.category}
      </p>
      <h1 className="mb-4 font-display text-[clamp(28px,4.5vw,44px)] font-semibold leading-[1.1] tracking-[-0.015em] text-ink">
        {project.name}
      </h1>
      <p className="mb-10 max-w-2xl font-body text-[17px] leading-[1.7] text-ink-muted">
        {project.tagline}
      </p>

      {/* Links */}
      <div className="mb-10 flex flex-wrap gap-3">
        {(Object.entries(project.links) as [keyof typeof LINK_LABELS, string][]).map(
          ([key, href]) => (
            <a
              key={key}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-line px-4 py-2 font-ui text-[13px] text-ink-muted transition-colors duration-200 hover:text-ink"
            >
              {LINK_LABELS[key]} ↗
            </a>
          )
        )}
        {(project.language || typeof project.stars === "number") && (
          <span className="flex items-center gap-3 rounded-full border border-line px-4 py-2 font-ui text-[13px] text-ink-muted">
            {project.language && <span>{project.language}</span>}
            {typeof project.stars === "number" && project.stars > 0 && (
              <span>★ {project.stars}</span>
            )}
          </span>
        )}
      </div>

      {/* Media */}
      <div className="mb-12">
        <ProjectMedia media={project.media} priority />
      </div>

      {/* Quick facts */}
      <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {project.facts.map((fact) => (
          <div
            key={fact.label}
            className="rounded-2xl border border-line bg-paper-raised p-5"
          >
            <p className="mb-1.5 font-ui text-[11px] font-medium uppercase tracking-widest text-ink-muted">
              {fact.label}
            </p>
            <p className="font-body text-[14px] leading-snug text-ink">{fact.value}</p>
          </div>
        ))}
      </div>

      {/* Description */}
      <div className="mb-12 flex max-w-2xl flex-col gap-5">
        {project.description.map((paragraph, i) => (
          <p key={i} className="font-body text-[16px] leading-[1.8] text-ink-muted">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Stack */}
      <div className="mb-16 flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <span
            key={tech}
            className="rounded-full bg-paper-raised px-3.5 py-1.5 font-ui text-[13px] font-medium text-ink-muted"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Highlights */}
      <div className="mb-20">
        <h2 className="mb-6 font-ui text-xs font-medium uppercase tracking-[0.08em] text-ink-muted">
          Highlights
        </h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {project.highlights.map((highlight) => (
            <div
              key={highlight.title}
              className="rounded-2xl border border-line bg-paper-raised p-7"
            >
              <h3 className="mb-2.5 font-body text-[16px] font-semibold leading-snug text-ink">
                {highlight.title}
              </h3>
              <p className="font-body text-[14px] leading-[1.7] text-ink-muted">{highlight.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Decision Record — only for projects with a real, disclosed reversal */}
      {project.decisionRecord && (
        <div className="mb-20">
          <h2 className="mb-6 font-ui text-xs font-medium uppercase tracking-[0.08em] text-ink-muted">
            Decision record
          </h2>
          <DecisionRecord record={project.decisionRecord} />
        </div>
      )}

      {/* Next project */}
      <div className="flex items-center justify-between border-t border-line pt-8">
        <span className="font-ui text-[13px] text-ink-muted">Next</span>
        <Link
          href={`/projects/${next.slug}`}
          className="group flex items-center gap-2 font-ui text-[15px] text-ink-muted transition-colors duration-200 hover:text-ink"
        >
          {next.name}
          <span className="text-signal transition-transform duration-200 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
    </div>
  );
}

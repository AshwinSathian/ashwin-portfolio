import Link from "next/link";
import { ViewTransition } from "react";
import type { Project } from "@/app/data/projects";
import ArrowLink from "@/components/ArrowLink";
import ProjectMedia from "@/components/ProjectMedia";

export type ProjectPanelProps = {
  project: Project;
  /** Zero-based position in the list; shown as "01", "02"… */
  index: number;
  /** Media on the right at desktop widths. */
  flip?: boolean;
  priority?: boolean;
  /** Heading level for the project name. */
  as?: "h2" | "h3";
};

/** A featured project: large media beside name, tagline and facts. */
export default function ProjectPanel({ project, index, flip, priority, as: Heading = "h3" }: ProjectPanelProps) {
  const href = `/projects/${project.slug}`;

  return (
    <article className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center lg:gap-14">
      {/* Decorative duplicate of the text link below, so it is skipped by
          keyboard and assistive tech. */}
      <Link
        href={href}
        tabIndex={-1}
        aria-hidden
        className={`reveal-media block min-w-0 transition-transform duration-500 ease-out hover:scale-[1.015] active:scale-[0.99] lg:col-span-7 ${flip ? "lg:order-2" : ""}`}
      >
        <ViewTransition name={`project-media-${project.slug}`} share="morph">
          <ProjectMedia
            media={project.media}
            priority={priority}
            sizes="(min-width: 1024px) 640px, 100vw"
          />
        </ViewTransition>
      </Link>

      <div className="reveal flex min-w-0 flex-col gap-5 lg:col-span-5">
        <p className="flex items-baseline gap-3 font-mono text-meta text-fg-3">
          <span>{String(index + 1).padStart(2, "0")}</span>
          <span>{project.category}</span>
        </p>
        <Heading className="font-display text-display-m font-semibold tracking-[-0.03em] wrap-anywhere">
          {project.name}
        </Heading>
        <p className="text-fg-2">{project.tagline}</p>

        <dl className="flex flex-col border-t border-line">
          {project.facts.map((fact) => (
            <div key={fact.label} className="grid grid-cols-[7rem_1fr] gap-4 border-b border-line py-3 text-small">
              <dt className="text-fg-3">{fact.label}</dt>
              <dd className="text-fg">{fact.value}</dd>
            </div>
          ))}
        </dl>

        <ArrowLink href={href}>
          Read the case study<span className="sr-only">: {project.name}</span>
        </ArrowLink>
      </div>
    </article>
  );
}

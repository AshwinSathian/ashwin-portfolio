"use client";

import Link from "next/link";
import type { ProjectWithStats } from "@/app/(helpers)/projects";
import { Reveal, RevealGroup } from "@/components/Reveal";

export type HomeProjectsProps = {
  projects: ProjectWithStats[];
};

export default function HomeProjects({ projects }: HomeProjectsProps) {
  const flagship = projects.filter((p) => p.featured);

  return (
    <section aria-labelledby="projects-heading" className="border-t border-line px-6 py-16 md:px-16 md:py-20">
      <div className="mx-auto max-w-5xl">
        <RevealGroup className="grid gap-3 md:grid-cols-12 md:gap-8">
          <Reveal>
            <p
              id="projects-heading"
              className="font-ui text-micro font-medium uppercase tracking-[0.14em] text-ink-muted md:col-span-3"
            >
              Projects
            </p>
          </Reveal>
          <Reveal className="md:col-span-8 md:col-start-4">
            <p className="font-body text-body text-ink-muted">
              Eight independent products, designed and run end to end. Four of them, below.
            </p>
          </Reveal>
        </RevealGroup>

        <RevealGroup className="mt-10 flex flex-col md:ml-[25%]">
          {flagship.map((project, i) => (
            <Reveal key={project.slug}>
              <Link
                href={`/projects/${project.slug}`}
                className="group flex flex-col gap-1.5 border-t border-line py-6 first:border-t-0 first:pt-0 focus-visible:outline-none md:flex-row md:items-baseline md:gap-6"
              >
                <span className="shrink-0 font-data text-small text-ink-muted md:w-8">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="flex items-baseline gap-3">
                    <span className="font-display text-heading font-semibold text-ink transition-colors duration-200 group-hover:text-accent">
                      {project.name}
                    </span>
                    {project.decisionRecord && (
                      <span className="font-data text-micro normal-case tracking-normal text-ink-muted">
                        revised in public
                      </span>
                    )}
                  </span>
                  <span className="font-body text-body text-ink-muted">{project.tagline}</span>
                </span>
                <span className="shrink-0 font-ui text-small text-ink-muted opacity-0 transition-opacity duration-200 group-hover:opacity-100 md:opacity-0">
                  Case study →
                </span>
              </Link>
            </Reveal>
          ))}
        </RevealGroup>

        <RevealGroup amount={0.5}>
          <Reveal>
            <Link
              href="/projects"
              className="mt-6 inline-flex items-center gap-2 font-ui text-body text-ink transition-colors duration-200 hover:text-accent md:ml-[25%]"
            >
              All eight projects, with the full write-up →
            </Link>
          </Reveal>
        </RevealGroup>
      </div>
    </section>
  );
}

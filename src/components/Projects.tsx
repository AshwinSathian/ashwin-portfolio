"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { ProjectWithStats } from "@/app/(helpers)/projects";
import ProjectMedia from "@/components/ProjectMedia";
import { Reveal, RevealGroup } from "@/components/Reveal";

export type ProjectsProps = {
  projects: ProjectWithStats[];
};

export default function Projects({ projects }: ProjectsProps) {
  const flagship = projects.filter((p) => p.featured);
  const secondary = projects.filter((p) => !p.featured);

  return (
    <div className="mx-auto max-w-5xl px-6 py-24 pt-32 md:px-16 md:py-32 md:pt-40">
      <RevealGroup onMount amount={0} className="flex flex-col gap-4">
        <Reveal>
          <p className="font-ui text-micro font-medium uppercase tracking-[0.14em] text-ink-muted">
            Projects
          </p>
        </Reveal>
        <Reveal>
          <h1 className="font-display text-display-2 font-medium leading-[1.02] tracking-[-0.01em] text-ink">
            Eight products, designed and run end to end.
          </h1>
        </Reveal>
        <Reveal>
          <p className="max-w-xl font-body text-body-lg leading-[1.7] text-ink-muted">
            Most of what I ship at work isn&apos;t mine to show. Everything here is —
            built, run, and where the record calls for it, corrected in public. Four below
            go deep. The rest are listed just as plainly, further down.
          </p>
        </Reveal>
      </RevealGroup>

      <div className="mt-16 flex flex-col">
        {flagship.map((project, i) => {
          const reversed = i % 2 === 1;
          return (
            <RevealGroup
              key={project.slug}
              className="border-t border-line py-12 first:border-t-0 first:pt-0 md:py-14"
            >
              <div className="grid min-w-0 gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-14">
                <Reveal className={`flex min-w-0 flex-col gap-3 ${reversed ? "md:order-2" : ""}`}>
                  <motion.div whileHover={{ scale: 1.015 }} transition={{ duration: 0.2 }}>
                    <ProjectMedia media={project.media} priority={i === 0} />
                  </motion.div>
                  <div className="flex items-center gap-3 font-data text-[12px] uppercase tracking-wider text-ink-muted">
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    <span>{project.category}</span>
                    {project.decisionRecord && <span className="text-accent normal-case tracking-normal">revised in public</span>}
                    {(project.language || typeof project.stars === "number") && (
                      <span className="ml-auto normal-case tracking-normal">
                        {project.language}
                        {typeof project.stars === "number" && project.stars > 0 && ` · ★ ${project.stars}`}
                      </span>
                    )}
                  </div>
                </Reveal>

                <Reveal className={`flex min-w-0 flex-col gap-5 ${reversed ? "md:order-1" : ""}`}>
                  <Link href={`/projects/${project.slug}`} className="group inline-flex items-baseline gap-3 focus-visible:outline-none">
                    <h2 className="font-display text-display-3 font-medium leading-[1.1] tracking-[-0.01em] text-ink transition-colors duration-200 group-hover:text-accent">
                      {project.name}
                    </h2>
                    <span className="text-accent opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100">→</span>
                  </Link>

                  <p className="max-w-xl font-body text-body-lg leading-[1.7] text-ink-muted">{project.tagline}</p>

                  {project.highlights[0] && (
                    <p className="max-w-xl font-body text-body leading-[1.6] text-ink-muted">
                      <span className="text-ink">{project.highlights[0].title}.</span> {project.highlights[0].detail}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {project.stack.map((tech) => (
                      <span key={tech} className="rounded-full bg-paper-raised px-3 py-1 font-ui text-[12px] font-medium text-ink-muted">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-x-6 gap-y-1.5 font-ui text-small text-ink-muted">
                    {project.facts.map((fact) => (
                      <span key={fact.label}>
                        <span className="text-ink-muted">{fact.label}:</span> {fact.value}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-5 pt-1 font-ui text-body">
                    <Link href={`/projects/${project.slug}`} className="text-ink transition-colors duration-200 hover:text-accent">
                      Case study →
                    </Link>
                    {project.links.live && (
                      <a href={project.links.live} target="_blank" rel="noopener noreferrer" className="text-ink-muted transition-colors duration-200 hover:text-ink">
                        Live ↗
                      </a>
                    )}
                    {project.links.github && (
                      <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="text-ink-muted transition-colors duration-200 hover:text-ink">
                        GitHub ↗
                      </a>
                    )}
                    {project.links.npm && (
                      <a href={project.links.npm} target="_blank" rel="noopener noreferrer" className="text-ink-muted transition-colors duration-200 hover:text-ink">
                        npm ↗
                      </a>
                    )}
                  </div>
                </Reveal>
              </div>
            </RevealGroup>
          );
        })}
      </div>

      <div className="mt-24 border-t border-line pt-14">
        <RevealGroup className="flex flex-col gap-2">
          <Reveal>
            <p className="font-ui text-micro font-medium uppercase tracking-[0.14em] text-ink-muted">More shipped work</p>
          </Reveal>
          <Reveal>
            <p className="max-w-lg font-body text-body text-ink-muted">
              Smaller in scope, or built for a narrower audience — real, running, and worth a look.
            </p>
          </Reveal>
        </RevealGroup>

        <RevealGroup className="mt-8 flex flex-col">
          {secondary.map((project, i) => (
            <Reveal key={project.slug}>
              <Link
                href={`/projects/${project.slug}`}
                className="group flex flex-col gap-1.5 border-t border-line py-6 first:border-t-0 first:pt-0 focus-visible:outline-none md:flex-row md:items-baseline md:gap-6"
              >
                <span className="shrink-0 font-data text-small text-ink-muted md:w-8">
                  {String(flagship.length + i + 1).padStart(2, "0")}
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="flex items-baseline gap-2">
                    <span className="font-display text-heading font-medium text-ink transition-colors duration-200 group-hover:text-accent">
                      {project.name}
                    </span>
                    {project.decisionRecord && (
                      <span className="font-data text-micro normal-case tracking-normal text-ink-muted">revised in public</span>
                    )}
                  </span>
                  <span className="font-body text-body text-ink-muted">{project.tagline}</span>
                </span>
                <span className="shrink-0 font-ui text-small text-ink-muted opacity-0 transition-opacity duration-200 group-hover:opacity-100 md:opacity-0">
                  Details →
                </span>
              </Link>
            </Reveal>
          ))}
        </RevealGroup>
      </div>
    </div>
  );
}

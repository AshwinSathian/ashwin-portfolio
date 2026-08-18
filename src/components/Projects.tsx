import Link from "next/link";
import type { ProjectWithStats } from "@/app/(helpers)/projects";
import ProjectMedia from "@/components/ProjectMedia";

export type ProjectsProps = {
  projects: ProjectWithStats[];
};

export default function Projects({ projects }: ProjectsProps) {
  return (
    <div className="mx-auto max-w-5xl px-6 py-24 pt-32 md:px-16 md:py-32 md:pt-40">
      <p className="font-ui text-[11px] font-medium uppercase tracking-[0.12em] text-ink-muted">
        Projects
      </p>
      <h1 className="mt-4 font-display text-[clamp(32px,5vw,52px)] font-bold leading-[1.02] tracking-[-0.02em] text-ink">
        Eight products, designed and run end to end.
      </h1>
      <p className="mt-4 max-w-xl font-body text-[16px] leading-[1.7] text-ink-muted">
        Most of what I ship at work isn&apos;t mine to show. Everything here is —
        built, run, and where the record calls for it, corrected in public.
      </p>

      <div className="mt-16 flex flex-col">
        {projects.map((project, i) => (
          <div key={project.slug} className="border-t border-line py-12 first:border-t-0 first:pt-0 md:py-14">
            <div className="grid min-w-0 gap-8 md:grid-cols-[minmax(0,340px)_1fr] md:gap-12">
              <div className="flex min-w-0 flex-col gap-3">
                <ProjectMedia media={project.media} />
                <div className="flex items-center gap-3 font-display text-[12px] uppercase tracking-wider text-ink-muted">
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <span>{project.category}</span>
                  {project.decisionRecord && (
                    <span className="text-diff-add normal-case tracking-normal">± Decision record</span>
                  )}
                  {(project.language || typeof project.stars === "number") && (
                    <span className="ml-auto normal-case tracking-normal">
                      {project.language}
                      {typeof project.stars === "number" && project.stars > 0 && ` · ★ ${project.stars}`}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex min-w-0 flex-col gap-5">
                <Link href={`/projects/${project.slug}`} className="group inline-flex items-baseline gap-3 focus-visible:outline-none">
                  <h2 className="font-display text-[clamp(24px,3.2vw,36px)] font-bold leading-[1.1] tracking-[-0.01em] text-ink transition-colors duration-200 group-hover:text-signal">
                    {project.name}
                  </h2>
                  <span className="text-signal opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100">
                    →
                  </span>
                </Link>

                <p className="max-w-xl font-body text-[16px] leading-[1.7] text-ink-muted">
                  {project.tagline}
                </p>

                {project.highlights[0] && (
                  <p className="max-w-xl font-body text-[14px] leading-[1.6] text-ink-muted">
                    <span className="text-ink">{project.highlights[0].title}.</span>{" "}
                    {project.highlights[0].detail}
                  </p>
                )}

                <div className="flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <span key={tech} className="rounded-full bg-paper-raised px-3 py-1 font-ui text-[12px] font-medium text-ink-muted">
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Facts stand on their own, plainly — no VerifiedTag stamp (spec §5) */}
                <div className="flex flex-wrap gap-x-6 gap-y-1.5 font-ui text-[13px] text-ink-muted">
                  {project.facts.map((fact) => (
                    <span key={fact.label}>
                      <span className="text-ink-muted">{fact.label}:</span> {fact.value}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-5 pt-1 font-ui text-[14px]">
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
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

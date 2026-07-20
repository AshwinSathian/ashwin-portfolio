"use client";

import Link from "next/link";
import type { ProjectWithStats } from "@/app/(helpers)/projects";

export type ProjectCardProps = ProjectWithStats;

export function ProjectCard({
  slug,
  name,
  category,
  tagline,
  stack,
  stars,
  language,
}: ProjectCardProps) {
  const visibleStack = stack.slice(0, 3);

  return (
    <Link
      href={`/projects/${slug}`}
      className="group block rounded-[20px] border border-white/6 bg-surface-2 p-8 transition-colors duration-200 hover:border-white/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <div className="flex flex-col gap-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <p className="text-[11px] font-medium uppercase tracking-widest text-label-4">
              {category}
            </p>
            <h3 className="text-[19px] font-medium leading-snug text-label-1">{name}</h3>
          </div>
          {(language || typeof stars === "number") && (
            <div className="flex shrink-0 items-center gap-3 pt-4 text-[13px] text-label-3">
              {language && <span>{language}</span>}
              {typeof stars === "number" && stars > 0 && <span>★ {stars}</span>}
            </div>
          )}
        </div>

        {/* Tagline */}
        <p className="text-[15px] leading-[1.6] text-label-2">{tagline}</p>

        {/* Footer row */}
        <div className="flex items-center justify-between gap-4 pt-1">
          <div className="flex flex-wrap gap-2">
            {visibleStack.map((tech) => (
              <span
                key={tech}
                className="rounded-full bg-surface-3 px-3 py-1 text-[12px] font-medium text-label-3"
              >
                {tech}
              </span>
            ))}
          </div>
          <span className="shrink-0 text-[13px] text-accent opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            View case study →
          </span>
        </div>
      </div>
    </Link>
  );
}

export default ProjectCard;

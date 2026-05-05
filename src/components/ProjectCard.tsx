"use client";

import Link from "next/link";

export type ProjectCardProps = {
  owner: string;
  repo: string;
  description?: string | null;
  stargazers_count?: number;
  language?: string | null;
  topics?: string[];
  updated_at?: string;
  default_branch?: string | null;
  title?: string;
};

export function ProjectCard({
  owner,
  repo,
  title,
  description,
  stargazers_count,
  language,
  topics = [],
}: ProjectCardProps) {
  const displayTitle = title ?? repo;
  const visibleTopics = topics.slice(0, 3);

  return (
    <Link
      href={`/projects/${owner}/${repo}`}
      className="group block rounded-2xl border border-white/8 bg-surface-2 p-7 transition-colors duration-200 hover:border-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <div className="flex flex-col gap-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-[17px] font-medium leading-snug text-label-1">
            {displayTitle}
          </h3>
          <div className="flex shrink-0 items-center gap-3 text-[13px] text-label-3">
            {language && <span>{language}</span>}
            {typeof stargazers_count === "number" && stargazers_count > 0 && (
              <span>★ {stargazers_count}</span>
            )}
          </div>
        </div>

        {/* Description */}
        {description && (
          <p className="text-[15px] leading-[1.6] text-label-2 line-clamp-2">
            {description}
          </p>
        )}

        {/* Footer row */}
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {visibleTopics.map((topic) => (
              <span
                key={topic}
                className="rounded-full bg-surface-3 px-3 py-1 text-[12px] font-medium text-label-3"
              >
                {topic}
              </span>
            ))}
          </div>
          <span className="text-[13px] text-accent opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            View →
          </span>
        </div>
      </div>
    </Link>
  );
}

export default ProjectCard;

"use client";

import Link from "next/link";
import { Button } from "primereact/button";
import { Card } from "primereact/card";

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
  updated_at,
}: ProjectCardProps) {
  const updatedLabel = updated_at
    ? new Date(updated_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  const displayTitle = title ?? `${owner}/${repo}`;
  const ownerRepoLabel = `${owner}/${repo}`;

  return (
    <Card className="rounded-3xl bg-bg-glass p-6 shadow-glass backdrop-blur-soft transition duration-200 hover:-translate-y-0.5 hover:shadow-soft focus-within:shadow-soft">
      <div className="flex flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <Link
              href={`/projects/${owner}/${repo}`}
              className="font-[var(--font-heading)] text-xl font-semibold text-text-primary underline-offset-4 hover:underline focus-visible:underline"
            >
              {displayTitle}
            </Link>
            <p className="text-xs uppercase tracking-[0.25em] text-text-muted">
              {ownerRepoLabel}
            </p>
            {description ? (
              <p className="text-sm text-text-muted line-clamp-2">
                {description}
              </p>
            ) : null}
          </div>
        </div>

        {updatedLabel ? (
          <div className="text-xs text-text-muted">{`Updated ${updatedLabel}`}</div>
        ) : null}
      </div>

      <div className="mt-6">
        <Link href={`/projects/${owner}/${repo}`}>
          <Button
            label="View Details"
            icon="pi pi-arrow-right"
            iconPos="right"
            outlined
            className="w-full justify-between border-accent/40 text-text-secondary transition-colors group-hover:border-accent"
          />
        </Link>
      </div>
    </Card>
  );
}

export default ProjectCard;

"use client";

import { SKILL_GROUPS } from "@/app/data/skills";
import { Reveal, RevealGroup } from "@/components/Reveal";

export type SkillsProps = {
  /** "grid" (full detail, used on /experience) or "compact" (chip cloud, used on home). */
  variant?: "grid" | "compact";
};

export default function Skills({ variant = "grid" }: SkillsProps) {
  if (variant === "compact") {
    return (
      <RevealGroup className="flex flex-wrap gap-2">
        {SKILL_GROUPS.flatMap((group) => group.items).map((item) => (
          <Reveal key={item.name} className="inline-block">
            <span className="rounded-full border border-line px-3 py-1.5 font-ui text-small text-ink-muted">
              {item.name}
            </span>
          </Reveal>
        ))}
      </RevealGroup>
    );
  }

  return (
    <RevealGroup className="grid gap-x-12 gap-y-8 sm:grid-cols-3">
      {SKILL_GROUPS.map((group) => (
        <Reveal key={group.title} className="flex flex-col gap-3">
          <h2 className="font-ui text-[12px] uppercase tracking-[0.06em] text-ink-muted">
            {group.title}
          </h2>
          <p className="font-body text-body text-ink">
            {group.items.map((item) => item.name).join(", ")}
          </p>
        </Reveal>
      ))}
    </RevealGroup>
  );
}

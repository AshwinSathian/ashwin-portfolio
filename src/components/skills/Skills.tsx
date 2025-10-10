import React from "react";
import { Chip } from "primereact/chip";
import { Tag } from "primereact/tag";
import { Divider } from "primereact/divider";
import { SKILLS, TOP_SKILLS } from "@/data/skills";

type SkillGroupKey = keyof typeof SKILLS;

const skillEntries = Object.entries(SKILLS) as Array<
  [SkillGroupKey, (typeof SKILLS)[SkillGroupKey]]
>;

export default function Skills() {
  return (
    <div className="max-w-5xl mx-auto text-gray-200">
      <div className="grid gap-8 md:grid-cols-2">
        {skillEntries.map(([group, items], index) => (
          <section
            key={group}
            aria-labelledby={`skills-${group}`}
            className="space-y-3"
          >
            <h4
              id={`skills-${group}`}
              className="text-sm font-semibold uppercase tracking-widest text-gray-300"
            >
              {formatGroupTitle(group)}
            </h4>

            <div className="flex flex-wrap gap-2">
              {items.map((item) => (
                <Chip
                  key={item}
                  label={item}
                  aria-label={item}
                  className="px-3 py-2 text-sm bg-gray-800/40 border border-gray-700 text-gray-100 hover:shadow-sm transition-shadow"
                />
              ))}
            </div>

            {index % 2 === 1 ? (
              <Divider className="hidden md:block border-gray-800 mt-4" />
            ) : null}
          </section>
        ))}
      </div>
    </div>
  );
}

function formatGroupTitle(key: SkillGroupKey) {
  switch (key) {
    case "cloudAndDevops":
      return "Cloud & DevOps";
    default:
      return key.charAt(0).toUpperCase() + key.slice(1);
  }
}

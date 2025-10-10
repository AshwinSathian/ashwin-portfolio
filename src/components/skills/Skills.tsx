import React from "react";
import { SKILLS, type Skills as SkillsType } from "@/data/skills";

const sections: Array<{ label: string; key: keyof SkillsType }> = [
  { label: "Frontend", key: "frontend" },
  { label: "Backend", key: "backend" },
  { label: "Database", key: "database" },
  { label: "Languages", key: "languages" },
  { label: "Cloud & DevOps", key: "cloudAndDevops" },
  { label: "Tools", key: "tools" },
];

export default function Skills() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-gray-300">
      {sections.map(({ label, key }) => (
        <div key={label}>
          <h3 className="font-semibold text-white mb-1">{label}</h3>
          <p>{SKILLS[key].join(", ")}</p>
        </div>
      ))}
    </div>
  );
}

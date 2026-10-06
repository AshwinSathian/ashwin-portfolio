export type SkillBadge = {
  name: string;
};

export type SkillGroup = {
  title: string;
  items: SkillBadge[];
};

export const SKILL_GROUPS: SkillGroup[] = [
  {
    title: "Frontend",
    items: [{ name: "Angular" }, { name: "React" }, { name: "Next.js" }],
  },
  {
    title: "Backend",
    items: [{ name: "Node.js" }, { name: "NestJS" }, { name: "Express" }],
  },
  {
    title: "Data",
    items: [{ name: "MongoDB" }],
  },
  {
    title: "Cloud & DevOps",
    items: [{ name: "GCP" }, { name: "AWS" }, { name: "Docker" }, { name: "GitHub Actions" }],
  },
  {
    title: "Languages",
    items: [
      { name: "TypeScript" },
      { name: "JavaScript" },
      { name: "Python" },
      { name: "HTML / CSS" },
    ],
  },
  {
    title: "AI & Tooling",
    items: [{ name: "Claude Code" }, { name: "OpenAI Codex" }],
  },
  {
    title: "Practices",
    items: [
      { name: "SaaS Architecture" },
      { name: "Multi-tenancy" },
      { name: "RBAC" },
      { name: "Agile & Scrum" },
    ],
  },
];

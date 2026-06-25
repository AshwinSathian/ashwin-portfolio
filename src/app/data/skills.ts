export type SkillBadge = {
  name: string;
};

export type SkillGroup = {
  title: string;
  items: SkillBadge[];
};

export const SKILL_COLUMNS: [SkillGroup[], SkillGroup[]] = [
  [
    {
      title: "Frontend",
      items: [{ name: "Angular" }, { name: "React" }, { name: "Next.js" }],
    },
    {
      title: "Backend",
      items: [
        { name: "Node.js" },
        { name: "NestJS" },
        { name: "Express" },
      ],
    },
    {
      title: "Data",
      items: [{ name: "MongoDB" }, { name: "AWS DynamoDB" }],
    },
  ],
  [
    {
      title: "Cloud & DevOps",
      items: [
        { name: "AWS" },
        { name: "GCP" },
        { name: "Docker" },
        { name: "GitHub Actions" },
      ],
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
      items: [
        { name: "Claude Code" },
        { name: "GitHub Copilot" },
        { name: "LLM APIs" },
        { name: "AI-augmented workflows" },
      ],
    },
  ],
];

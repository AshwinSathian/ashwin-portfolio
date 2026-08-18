export type ExperienceItem = {
  role: string;
  company: string;
  dates: string;
  bullets: string[];
  tech?: string[];
  link?: string;
};

export const RECENT_EXPERIENCE: ExperienceItem[] = [
  {
    role: "Lead Engineer · Funnels, Websites, Webinars",
    company: "HighLevel",
    dates: "Mar 2026 – Jun 2026",
    bullets: [
      "Led the team and worked across other teams and verticals so collaboration held up both inside squads and between them.",
      "Drove the AI-augmented Full Stack Builder effort, putting AI tooling to work across the SDLC: planning, prototyping, building, QA, and shipping.",
      "Reworked critical subsystems' architecture while shipping ongoing feature work in parallel, not instead of it.",
    ],
  },
  {
    role: "Lead Engineer",
    company: "Penny Software",
    dates: "Jan 2024 – Aug 2025",
    bullets: [
      "Owned the Angular + NestJS + MongoDB architecture for a modular, multi-tenant procurement platform.",
      "Built RBAC, tenancy isolation, and audit trails as platform-wide standards, not one-off features per team.",
      "Mentored a squad spanning frontend, backend, and QA, pushing on architecture and craft in both directions.",
    ],
    tech: ["Angular", "NestJS", "MongoDB", "Nx", "GCP"],
  },
  {
    role: "Product Specialist",
    company: "Penny Software",
    dates: "Apr 2022 – Dec 2023",
    bullets: [
      "Remained hands-on across the API layer and frontend in a hybrid engineering and product ownership role, translating procurement workflows into shipped product outcomes.",
      "Optimized APIs and queries across critical paths while preserving platform stability.",
      "Coordinated product, QA, and engineering rhythms to keep releases iterative and predictable.",
    ],
    tech: ["Angular", "NestJS", "MongoDB", "Nx"],
  },
  {
    role: "Full Stack Developer",
    company: "Penny Software",
    dates: "Jun 2020 – Mar 2022",
    bullets: [
      "Shipped features across frontend and backend while preserving platform uptime targets.",
      "Modularized the frontend stack and introduced lazy-loaded workspaces for scale.",
    ],
    tech: ["Angular", "NestJS", "MongoDB"],
  },
  {
    role: "Senior Full Stack Developer",
    company: "Manaraah",
    dates: "Jan 2020 – Jun 2020",
    bullets: [
      "Translated ambiguous requirements into maintainable, production-grade features.",
      "Partnered with stakeholders to de-risk deployments and support adoption.",
    ],
    tech: ["Angular", "Node.js", "MongoDB", "AWS"],
  },
  {
    role: "Software Development Engineer",
    company: "WeCP",
    dates: "Jan 2019 – Jan 2020",
    bullets: [
      "Enhanced onboarding flows and stabilized critical evaluation journeys.",
      "Guided interns and juniors through architecture, reviews, and delivery.",
    ],
    tech: ["Angular", "Node.js", "MongoDB", "AWS"],
  },
  {
    role: "Junior Programmer",
    company: "Reubro International",
    dates: "Aug 2018 – Jan 2019",
    bullets: [
      "Shipped incremental enhancements while learning enterprise release discipline.",
    ],
    tech: ["Angular", "Node.js"],
  },
] as const;

export type ExperienceItem = {
  role: string;
  company: string;
  dates: string;
  metric: string;
  bullets: string[];
  tech?: string[];
  link?: string;
};

export const RECENT_EXPERIENCE: ExperienceItem[] = [
  {
    role: "Lead Engineer",
    company: "Penny Software",
    dates: "Jan 2024 – Aug 2025",
    metric: "Stabilized $1B+ procurement flows at <200 ms latency.",
    bullets: [
      "Directed Angular + NestJS + MongoDB architecture for a modular procurement SaaS serving millions of records.",
      "Standardized multi-tenant RBAC, tenancy isolation, and compliance-ready audit trails.",
      "Mentored a 12-person squad across frontend, backend, and QA, raising review rigor and delivery confidence.",
    ],
    tech: ["Angular", "NestJS", "MongoDB", "Nx", "GCP", "JIRA"],
  },
  {
    role: "Product Specialist",
    company: "Penny Software",
    dates: "Apr 2022 – Dec 2023",
    metric: "Lifted release cadence by ~1.5× across squads.",
    bullets: [
      "Owned end-to-end feature lifecycles, translating procurement pains into measurable product outcomes.",
      "Optimized APIs and queries, cutting response times by 40%+ while preserving stability.",
      "Coordinated product, QA, and engineering rhythms to keep launches iterative and low-risk.",
    ],
    tech: ["Angular", "NestJS", "MongoDB", "Nx"],
  },
  {
    role: "Full Stack Developer",
    company: "Penny Software",
    dates: "Jun 2020 – Mar 2022",
    metric: "Expanded SaaS modules without sacrificing uptime.",
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
    metric: "Delivered cloud-native business apps on tight timelines.",
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
    metric:
      "Strengthened a SaaS assessments platform serving global customers.",
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
    metric: "Improved reliability of a flagship SaaS capability.",
    bullets: [
      "Shipped incremental enhancements while learning enterprise release discipline.",
    ],
    tech: ["Angular", "Node.js"],
  },
] as const;

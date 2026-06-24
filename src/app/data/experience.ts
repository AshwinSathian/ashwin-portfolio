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
    role: "Lead Engineer — Funnels, Websites, Webinars",
    company: "HighLevel",
    dates: "Mar 2026 – Present",
    bullets: [
      "Leading the engineering organisation for three of HighLevel's core revenue products — funnel builder, website builder, and webinar platform — serving 60,000+ marketing agencies worldwide.",
      "Driving technical direction and cross-squad alignment across high-throughput, real-time builder products with complex customer-configurable state at scale.",
      "Establishing architecture patterns, engineering standards, and release discipline within a high-scale SaaS environment operating at $1.5B+ ARR.",
    ],
  },
  {
    role: "Lead Engineer",
    company: "Penny Software",
    dates: "Jan 2024 – Aug 2025",
    bullets: [
      "Directed Angular + NestJS + MongoDB architecture for a modular, multi-tenant procurement SaaS platform.",
      "Standardized RBAC, tenancy isolation, and compliance-ready audit trails across the platform.",
      "Mentored a cross-functional squad across frontend, backend, and QA — focused on architecture and craft.",
    ],
    tech: ["Angular", "NestJS", "MongoDB", "Nx", "GCP"],
  },
  {
    role: "Product Specialist",
    company: "Penny Software",
    dates: "Apr 2022 – Dec 2023",
    bullets: [
      "Remained hands-on across the API layer and frontend in a hybrid engineering + product ownership role — translating procurement workflows into shipped product outcomes.",
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

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
      "Led engineering for Funnels, Websites, and Webinars — three revenue surfaces inside a platform serving 60,000+ marketing agencies — working directly with peer teams and verticals so collaboration held up both inside the squad and across it.",
      "Drove the AI-augmented Full Stack Builder effort: putting AI tooling to work across the full SDLC — planning, prototyping, building, QA, shipping — as a real change to how the team works, not a novelty layer on top of the existing process.",
      "Shipped architectural reworks of critical subsystems in parallel with ongoing feature delivery, not instead of it.",
    ],
  },
  {
    role: "Lead Engineer",
    company: "Penny Software",
    dates: "Jan 2024 – Aug 2025",
    bullets: [
      "Owned the Angular + NestJS + MongoDB architecture for a modular, multi-tenant procurement platform used across the business.",
      "Built RBAC and tenancy isolation as platform-wide standards rather than per-client features, holding query performance steady as load grew.",
      "Mentored and directed a 12-person team spanning frontend, backend, and QA, introducing code review and clean-code standards that were adopted, not just proposed.",
    ],
    tech: ["Angular", "NestJS", "MongoDB", "Nx", "GCP"],
  },
  {
    role: "Product Specialist",
    company: "Penny Software",
    dates: "Apr 2022 – Dec 2023",
    bullets: [
      "Owned feature lifecycles end-to-end, staying hands-on across the API layer and frontend while translating procurement workflows into shipped outcomes.",
      "Optimized APIs and database queries across critical paths as usage grew.",
      "Coordinated engineering, QA, and product rhythms into iterative agile delivery.",
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

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
      "Owned Funnels, Websites, and Webinars under a model with no dedicated PM or EM layer — each engineer ran the full SDLC alone, AI-augmented, as a full-stack builder.",
      "Reworked the reverse proxy engine serving every website and funnel built on the platform, for better performance and resilience against cache purges and downtime.",
    ],
  },
  {
    role: "Lead Engineer",
    company: "Penny Software",
    dates: "Jan 2024 – Aug 2025",
    bullets: [
      "Founding engineer at Penny Software, five years in by this point, and still the one owning platform architecture.",
      "Designed the modular, multi-tenant procurement system that grew to $1B+ GTV across millions of records, tuned to hold sub-200ms queries at that scale.",
      "Built RBAC and multi-tenant security in-house, from scratch.",
      "Mentored a 12-person team across frontend, backend, and QA — code review and clean-code standards that stuck, not just got proposed.",
    ],
    tech: ["Angular", "NestJS", "MongoDB", "Nx", "GCP"],
  },
  {
    role: "Product Specialist",
    company: "Penny Software",
    dates: "Apr 2022 – Dec 2023",
    bullets: [
      "Sat directly with a customer who was vetting vendors by hand, wrote the spec myself, then built and owned the Vendor Pre-Qualification System solo, schema to UI.",
      // TODO: add a real adoption/impact figure for the Vendor Pre-Qualification
      // System once Ashwin supplies one — do not invent a number here.
      "Optimized APIs and database queries across critical paths, cutting response times by 40%+ as usage grew.",
      "Pushed the team onto iterative agile delivery, cutting release cycles by 1.5x.",
    ],
    tech: ["Angular", "NestJS", "MongoDB", "Nx"],
  },
  {
    role: "Full Stack Developer",
    company: "Penny Software",
    dates: "Jun 2020 – Mar 2022",
    bullets: [
      "Joined Penny Software as a founding engineer, shipping features across the full stack while the product and the team were still being built.",
      "Modularized the frontend and introduced lazy-loaded workspaces, keeping it scalable as usage grew past thousands of active users.",
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

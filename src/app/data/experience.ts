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
      "Owned Funnels, Websites, and Webinars under a model where each engineer ran the full SDLC alone, AI-augmented, as a full-stack builder.",
      "Reworked the reverse proxy engine serving the websites and funnels built on the platform, making it faster and more resilient to cache purges and downtime.",
    ],
  },
  {
    role: "Lead Engineer",
    company: "Penny Software",
    dates: "Jan 2024 – Aug 2025",
    bullets: [
      "Owned platform architecture for a modular SaaS procurement system that grew to $1B+ GTV across millions of records, and mentored the 12-person team building it.",
      "Designed and expanded the tech stack to hold sub-200ms queries at that scale.",
      "Sat with a customer who was vetting vendors by hand, distilled the spec, then built and owned a Vendor Pre-Qualification System from scratch, schema to UI.",
      // TODO: add a real adoption/impact figure for the Vendor Pre-Qualification
      // System once Ashwin supplies one — do not invent a number here.
    ],
    tech: ["Angular", "NestJS", "MongoDB", "Nx", "GCP"],
  },
  {
    role: "Product Specialist",
    company: "Penny Software",
    dates: "Apr 2022 – Feb 2024",
    bullets: [
      "Built RBAC and multi-tenant security in-house, from scratch.",
      "Optimized APIs and database queries, cutting response times by about 40%.",
      "Pushed the team onto iterative agile delivery, cutting release cycles by 1.5x.",
    ],
    tech: ["Angular", "NestJS", "MongoDB", "Nx"],
  },
  {
    role: "Full Stack Developer",
    company: "Penny Software",
    dates: "Jul 2020 – Apr 2022",
    bullets: [
      "Joined Penny Software as a founding engineer and delivered SaaS features across the full stack.",
      "Used lazy loading and modular design to keep the frontend scalable as usage grew past thousands of active users.",
    ],
    tech: ["Angular", "NestJS", "MongoDB"],
  },
  {
    role: "Senior Full Stack Developer",
    company: "Manaraah",
    dates: "Jan 2020 – Jun 2020",
    bullets: [
      "Built and deployed cloud-native, AI-powered business applications for construction clients moving off legacy systems.",
      "Worked directly with clients to turn raw requirements into working software.",
    ],
    tech: ["Angular", "Node.js", "MongoDB", "AWS"],
  },
  {
    role: "Software Development Engineer",
    company: "WeCP",
    dates: "Feb 2019 – Jan 2020",
    bullets: [
      "Built highly available SaaS platforms used for technical hiring.",
      "Set up and led a mentorship program for interns and junior engineers.",
    ],
    tech: ["Angular", "Node.js", "MongoDB", "AWS"],
  },
  {
    role: "Junior Programmer",
    company: "Reubro International",
    dates: "Aug 2018 – Jan 2019",
    bullets: [
      "Worked on reliability and usability improvements to the company's main SaaS products.",
    ],
    tech: ["Angular", "Node.js"],
  },
] as const;

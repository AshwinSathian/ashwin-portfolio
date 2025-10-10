export type ExperienceItem = {
  company: string;
  role: string;
  location?: string;
  period: string;
  bullets: string[];
  tech?: string[];
  link?: string;
};

export const EXPERIENCE = [
  {
    role: "Lead Engineer",
    company: "Penny Software",
    period: "Jan 2024 – Present",
    bullets: [
      "Drove platform architecture for a modular procurement SaaS (millions of records; ~$1B+ GTV).",
      "Established Angular + NestJS + MongoDB patterns delivering consistent sub-200 ms queries.",
      "Hardened multi-tenant security and standardized enterprise-grade RBAC.",
      "Mentored a ~12-member team; uplifted code quality and review rigor.",
    ],
  },
  {
    role: "Product Specialist",
    company: "Penny Software",
    period: "Apr 2022 – Dec 2023",
    bullets: [
      "Owned feature lifecycles end-to-end with business-aligned delivery.",
      "Optimized APIs and queries, improving response times 40%+ and speeding releases by ~1.5×.",
      "Coordinated across engineering, QA, and product for iterative wins.",
    ],
  },
  {
    role: "Full Stack Developer",
    company: "Penny Software",
    period: "Jun 2020 – Mar 2022",
    bullets: [
      "Shipped features across the stack with high uptime and reliability.",
      "Improved frontend scalability via modularization and lazy-loading.",
    ],
  },
  {
    role: "Senior Full Stack Developer",
    company: "Manaraah",
    period: "Jan 2020 – Jun 2020",
    bullets: [
      "Built and deployed cloud-native business applications.",
      "Translated requirements into robust, maintainable implementations.",
    ],
  },
  {
    role: "Software Development Engineer",
    company: "WeCP",
    period: "Jan 2019 – Jan 2020",
    bullets: [
      "Contributed to a SaaS assessments platform at scale.",
      "Streamlined onboarding and mentored interns/junior developers.",
    ],
  },
  {
    role: "Junior Programmer",
    company: "Reubro International",
    period: "Aug 2018 – Jan 2019",
    bullets: ["Delivered improvements to a flagship SaaS product."],
  },
] as const satisfies ExperienceItem[];

export const EXPERIENCE_HEADING = "Experience" as const;

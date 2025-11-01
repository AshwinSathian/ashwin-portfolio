export type Highlight = {
  id: string;
  title: string;
  metric: string;
  summary: string;
  details: string[];
  icon: string;
};

export const HIGHLIGHTS: Highlight[] = [
  {
    id: "platform-scale",
    title: "Scaled the core procurement platform",
    metric: "$1B+ GTV safeguarded",
    summary:
      "Architected a modular, multi-tenant SaaS backbone handling millions of procurement records without downtime.",
    details: [
      "Owned Angular + NestJS + MongoDB architecture end-to-end, aligning services around domain boundaries.",
      "Hardened security with enterprise-grade RBAC, tenancy isolation, and compliance-friendly audit trails.",
      "Partnered with product and customer teams to land critical features without destabilizing the core.",
    ],
    icon: "pi pi-sitemap",
  },
  {
    id: "release-cadence",
    title: "Accelerated delivery without chaos",
    metric: "1.5× faster releases",
    summary:
      "Streamlined delivery rituals and CI/CD pipelines so squads ship predictably and confidently.",
    details: [
      "Reworked CI/CD flows, trimming regression cycles and cutting lead time to production by ~1.5×.",
      "Instituted release cadences, QA handoffs, and observability dashboards that made iteration safer.",
      "Championed blameless retros and sprint reviews that kept engineers, QA, and product synced.",
    ],
    icon: "pi pi-forward",
  },
  {
    id: "latency",
    title: "Standardized performance guardrails",
    metric: "<200 ms critical queries",
    summary:
      "Codified performance patterns that keep customer-critical interactions snappy even as data scales.",
    details: [
      "Optimized server-side queries and caching strategy to keep high-traffic flows well under 200 ms.",
      "Introduced performance budgets and dashboards so regressions were caught before customers felt them.",
      "Enabled product experimentation without compromising baseline reliability metrics.",
    ],
    icon: "pi pi-chart-line",
  },
  {
    id: "team-leadership",
    title: "Led and scaled a high-trust engineering team",
    metric: "12 engineers mentored",
    summary:
      "Built an inclusive, growth-minded culture that turned ambitious roadmaps into calm execution.",
    details: [
      "Mentored a ~12-person team across frontend, backend, QA, and product, raising code-review rigor.",
      "Coached leads on decomposing initiatives into resilient, testable slices.",
      "Instituted architecture reviews and tech talks that spread context and kept quality high.",
    ],
    icon: "pi pi-users",
  },
];

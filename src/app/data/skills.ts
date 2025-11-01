import type { TagProps } from "primereact/tag";

export type SkillBadge = {
  name: string;
  note: string;
  severity?: TagProps["severity"];
};

export type SkillGroup = {
  title: string;
  items: SkillBadge[];
};

export const SKILL_GROUPS: SkillGroup[] = [
  {
    title: "Frontend",
    items: [
      {
        name: "Angular",
        note: "Primary enterprise frontend; architected modular workspace shells.",
        severity: "info",
      },
      {
        name: "React",
        note: "Component systems and dashboards for SaaS analytics.",
      },
      {
        name: "Next.js",
        note: "Edge-ready SaaS portals with App Router and performance-first patterns.",
      },
    ],
  },
  {
    title: "Backend & Services",
    items: [
      {
        name: "Node.js",
        note: "Event-driven services powering procurement workflows.",
      },
      {
        name: "NestJS",
        note: "Structured multi-module APIs with testing and guard rails baked in.",
        severity: "info",
      },
      {
        name: "Express",
        note: "Lean services for integration surfaces and webhooks.",
      },
    ],
  },
  {
    title: "Data & Persistence",
    items: [
      {
        name: "MongoDB",
        note: "High-volume collections with tenant isolation and query tuning.",
      },
      {
        name: "AWS DynamoDB",
        note: "Serverless data paths for latency-sensitive features.",
      },
    ],
  },
  {
    title: "Cloud & DevOps",
    items: [
      {
        name: "AWS",
        note: "Multi-environment infrastructure, IAM, and monitoring.",
        severity: "success",
      },
      {
        name: "GCP",
        note: "Selective workloads and analytics tooling.",
      },
      {
        name: "Docker",
        note: "Containerized services with consistent local DX.",
      },
      {
        name: "GitHub Actions",
        note: "CI/CD automation and release gating workflows.",
      },
    ],
  },
  {
    title: "Languages",
    items: [
      { name: "TypeScript", note: "Default for application and infrastructure code.", severity: "warning" },
      { name: "JavaScript", note: "Legacy services and glue code." },
      { name: "Python", note: "Automation scripts and data checks." },
      { name: "HTML/CSS", note: "Accessible UI delivery and design systems." },
    ],
  },
  {
    title: "Productivity & QA",
    items: [
      { name: "Git", note: "Trunk-based workflows with guard-railed branching." },
      { name: "Postman", note: "API collaboration and regression suites." },
      { name: "Jira", note: "Delivery planning with outcomes-first roadmaps." },
      { name: "CI/CD", note: "Release automation and quality gates across environments." },
    ],
  },
];

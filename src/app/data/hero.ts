import { SITE } from "./site";

export type HeroMetric = {
  label: string;
  value: string;
  icon: string;
};

export const HERO = {
  title: SITE.name,
  subhead: SITE.heroSubhead,
  tagline: SITE.heroTagline,
  primaryCta: {
    label: "Download Resume",
    href: SITE.resumePath,
    icon: "pi pi-download",
  },
  secondaryCta: {
    label: "See My Work",
    href: "#experience",
    icon: "pi pi-arrow-down",
  },
  metrics: [
    { label: "GTV orchestrated", value: "$1B+", icon: "pi pi-chart-line" },
    { label: "Engineers led", value: "10+", icon: "pi pi-users" },
    { label: "Critical latency", value: "<200 ms", icon: "pi pi-bolt" },
  ] satisfies HeroMetric[],
} as const;

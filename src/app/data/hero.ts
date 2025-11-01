import { SITE } from "./site";

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
} as const;

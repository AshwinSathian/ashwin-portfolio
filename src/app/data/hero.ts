import { SITE } from "./site";

export const HERO = {
  eyebrow: "Engineering Leader",
  headline: ["Engineering.", "At scale."],
  identity: `${SITE.name} · Open to engineering leadership roles`,
  metricsLine: "$1B+ GTV  ·  12 engineers  ·  <200ms",
  primaryCta: {
    label: "View Work",
    href: "#experience",
  },
  secondaryCta: {
    label: "Download Resume",
    href: SITE.resumePath,
  },
} as const;

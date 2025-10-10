export type HeroContent = {
  title: string;
  subtitle: string;
  metrics?: Array<{ label: string; value: string }>;
};

export const HERO: HeroContent = {
  title: "Ashwin Sathian",
  subtitle: "Full-Stack Engineer • SaaS Architecture",
};

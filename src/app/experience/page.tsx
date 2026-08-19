import type { Metadata } from "next";
import ExperienceContent from "@/components/ExperienceContent";
import { SITE } from "@/app/data/site";

const description =
  "Eight years leading and building SaaS platforms at scale — the record behind the résumé, not just the résumé.";

const ogImageUrl = `/og?title=Experience&description=${encodeURIComponent("Eight years leading and building SaaS platforms at scale — the record behind the résumé.")}&label=Experience`;

export const metadata: Metadata = {
  title: "Experience",
  description,
  alternates: { canonical: `${SITE.website}/experience` },
  openGraph: {
    title: "Experience | Ashwin Sathian",
    description,
    url: `${SITE.website}/experience`,
    type: "website",
    images: [{ url: ogImageUrl, width: 1200, height: 630, alt: "Experience | Ashwin Sathian" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Experience | Ashwin Sathian",
    description,
    creator: "@ashwinsathian",
    images: [ogImageUrl],
  },
};

export default function ExperiencePage() {
  return <ExperienceContent />;
}

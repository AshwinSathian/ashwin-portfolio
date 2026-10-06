import type { Metadata } from "next";
import { RoleGroups } from "@/components/RoleRows";
import { PageHeader } from "@/components/Section";
import { EDUCATION } from "@/app/data/education";
import { SKILL_GROUPS } from "@/app/data/skills";
import { SITE } from "@/app/data/site";

const description =
  "Eight years, seven roles, and five companies, with the dates behind each one.";

const ogImageUrl = `/og?title=Experience&description=${encodeURIComponent(description)}&label=Experience`;

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
  return (
    <>
      <PageHeader
        title="The record behind the résumé."
        intro="Eight years across seven roles and five companies, from junior programmer to owning platform architecture at Penny Software. Each role below lists its dates, and most list the stack they shipped on."
      />

      <div className="shell pb-24 lg:pb-40">
        <RoleGroups />

        {EDUCATION.map((item) => (
          <section
            key={item.school}
            aria-labelledby="education-heading"
            className="grid gap-x-12 gap-y-6 border-t border-line py-10 lg:grid-cols-12 lg:py-14"
          >
            <h2 id="education-heading" className="reveal font-display text-display-m font-semibold tracking-[-0.03em] lg:col-span-4">
              Education
            </h2>
            <div className="reveal flex flex-col gap-1 lg:col-span-8">
              <p className="text-title font-medium text-fg">{item.school}</p>
              <p className="text-fg-2">{item.credential}</p>
              <p className="mt-1 font-mono text-meta text-fg-3">{item.period}</p>
            </div>
          </section>
        ))}

        <section
          aria-labelledby="stack-heading"
          className="grid gap-x-12 gap-y-6 border-y border-line py-10 lg:grid-cols-12 lg:py-14"
        >
          <h2 id="stack-heading" className="reveal font-display text-display-m font-semibold tracking-[-0.03em] lg:col-span-4">
            Stack
          </h2>
          <dl className="reveal flex flex-col lg:col-span-8">
            {SKILL_GROUPS.map((group) => (
              <div key={group.title} className="grid gap-x-8 gap-y-1 border-b border-line py-4 last:border-b-0 sm:grid-cols-[11rem_1fr]">
                <dt className="text-small text-fg-3">{group.title}</dt>
                <dd className="text-fg">{group.items.map((item) => item.name).join(", ")}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </>
  );
}

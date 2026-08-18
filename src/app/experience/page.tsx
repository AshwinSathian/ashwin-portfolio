import type { Metadata } from "next";
import { RECENT_EXPERIENCE } from "@/app/data/experience";
import { EDUCATION } from "@/app/data/education";
import { PLATFORM } from "@/app/data/work";
import { SKILL_GROUPS } from "@/app/data/skills";
import { SITE } from "@/app/data/site";

const description =
  "Seven years leading and building SaaS platforms at scale — the record behind the resume, with the numbers that back it up.";

export const metadata: Metadata = {
  title: "Experience",
  description,
  alternates: { canonical: `${SITE.website}/experience` },
  openGraph: {
    title: "Experience | Ashwin Sathian",
    description,
    url: `${SITE.website}/experience`,
    type: "website",
    images: [{ url: "/og?label=Experience", width: 1200, height: 630, alt: "Experience | Ashwin Sathian" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Experience | Ashwin Sathian",
    description,
    creator: "@ashwinsathian",
    images: ["/og?label=Experience"],
  },
};

export default function ExperiencePage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-24 pt-32 md:px-16 md:py-32 md:pt-40">
      <p className="font-ui text-[11px] font-medium uppercase tracking-[0.12em] text-ink-muted">
        Experience
      </p>
      <h1 className="mt-4 font-display text-[clamp(32px,5vw,52px)] font-bold leading-[1.02] tracking-[-0.02em] text-ink">
        {PLATFORM.title}
      </h1>
      <p className="mt-4 max-w-2xl font-body text-[16px] leading-[1.7] text-ink-muted">
        {PLATFORM.description}
      </p>

      {/* Stack — compact, functional, not a filler badge wall */}
      <div className="mt-14 grid gap-x-12 gap-y-8 border-t border-line pt-10 sm:grid-cols-3">
        {SKILL_GROUPS.map((group) => (
          <div key={group.title} className="flex flex-col gap-3">
            <h2 className="font-ui text-[12px] uppercase tracking-[0.06em] text-ink-muted">
              {group.title}
            </h2>
            <p className="font-body text-[14px] leading-relaxed text-ink">
              {group.items.map((item) => item.name).join(", ")}
            </p>
          </div>
        ))}
      </div>

      {/* Roles */}
      <div className="mt-16 flex flex-col">
        {RECENT_EXPERIENCE.map((item) => (
          <div key={`${item.company}-${item.role}`} className="grid gap-6 border-t border-line py-10 first:border-t-0 first:pt-0 md:grid-cols-[200px_1fr]">
            <div className="flex flex-col gap-1">
              <p className="font-display text-[13px] text-signal">{item.dates}</p>
              <p className="font-body text-[15px] font-medium text-ink">{item.company}</p>
            </div>
            <div className="flex flex-col gap-5">
              <p className="font-display text-[17px] font-semibold tracking-[-0.01em] text-ink">
                {item.role}
              </p>
              <ul className="flex flex-col gap-3">
                {item.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-4 font-body text-[15px] leading-[1.65] text-ink-muted">
                    <span className="mt-2.5 h-px w-4 shrink-0 bg-ink-muted" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
              {item.tech && item.tech.length > 0 && (
                <p className="font-display text-[12px] text-ink-muted">{item.tech.join(" · ")}</p>
              )}
            </div>
          </div>
        ))}

        {EDUCATION.map((item) => (
          <div key={item.school} className="grid gap-6 border-t border-line py-10 md:grid-cols-[200px_1fr]">
            <div className="flex flex-col gap-1">
              <p className="font-display text-[13px] text-signal">{item.period}</p>
              <p className="font-body text-[15px] font-medium text-ink">Education</p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-display text-[17px] font-semibold tracking-[-0.01em] text-ink">
                {item.school}
              </p>
              <p className="font-body text-[15px] leading-[1.65] text-ink-muted">{item.credential}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

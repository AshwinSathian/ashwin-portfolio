"use client";

import { RECENT_EXPERIENCE } from "@/app/data/experience";
import { EDUCATION } from "@/app/data/education";
import Skills from "@/components/Skills";
import { Reveal, RevealGroup } from "@/components/Reveal";

const introText =
  "Eight years across seven roles and five companies, from junior programmer to lead engineer directing a twelve-person team. Every line below is a fact, not a claim — dates and the stack that shipped them.";

export default function ExperienceContent() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-24 pt-32 md:px-16 md:py-32 md:pt-40">
      <RevealGroup onMount amount={0} className="flex flex-col gap-4">
        <Reveal>
          <p className="font-ui text-micro font-medium uppercase tracking-[0.14em] text-ink-muted">Experience</p>
        </Reveal>
        <Reveal>
          <h1 className="font-display text-display-2 font-medium italic leading-[1.02] tracking-[-0.01em] text-ink">
            The record behind the résumé.
          </h1>
        </Reveal>
        <Reveal>
          <p className="max-w-2xl font-body text-body-lg leading-[1.7] text-ink-muted">{introText}</p>
        </Reveal>
      </RevealGroup>

      {/* Stack — compact, functional, not a filler badge wall */}
      <h2 className="sr-only">Stack</h2>
      <div className="mt-14 border-t border-line pt-10">
        <Skills variant="grid" />
      </div>

      {/* Roles */}
      <div className="mt-16 flex flex-col">
        {RECENT_EXPERIENCE.map((item) => (
          <RevealGroup
            key={`${item.company}-${item.role}`}
            className="grid gap-6 border-t border-line py-10 first:border-t-0 first:pt-0 md:grid-cols-[200px_1fr]"
          >
            <Reveal className="flex flex-col gap-1">
              <p className="font-data text-small text-accent">{item.dates}</p>
              <p className="font-body text-body font-medium text-ink">{item.company}</p>
            </Reveal>
            <Reveal className="flex flex-col gap-5">
              <p className="font-display text-heading font-medium text-ink">{item.role}</p>
              <ul className="flex flex-col gap-3">
                {item.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-4 font-body text-body leading-[1.65] text-ink-muted">
                    <span className="mt-2.5 h-px w-4 shrink-0 bg-ink-muted" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
              {item.tech && item.tech.length > 0 && (
                <p className="font-data text-[12px] text-ink-muted">{item.tech.join(" · ")}</p>
              )}
            </Reveal>
          </RevealGroup>
        ))}

        {EDUCATION.map((item) => (
          <RevealGroup key={item.school} className="grid gap-6 border-t border-line py-10 md:grid-cols-[200px_1fr]">
            <Reveal className="flex flex-col gap-1">
              <p className="font-data text-small text-accent">{item.period}</p>
              <p className="font-body text-body font-medium text-ink">Education</p>
            </Reveal>
            <Reveal className="flex flex-col gap-2">
              <p className="font-display text-heading font-medium text-ink">{item.school}</p>
              <p className="font-body text-body leading-[1.65] text-ink-muted">{item.credential}</p>
            </Reveal>
          </RevealGroup>
        ))}
      </div>
    </div>
  );
}

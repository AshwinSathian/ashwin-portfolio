"use client";

import { motion } from "framer-motion";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { Timeline } from "primereact/timeline";
import { EXPERIENCE, type ExperienceItem } from "@/app/data/experience";
import { fadeInUp } from "@/lib/motion";

function ExperienceCard({
  item,
  showDates,
}: {
  item: ExperienceItem;
  showDates: boolean;
}) {
  return (
    <Card className="rounded-2xl bg-bg-soft/35 p-6 shadow-soft">
      <div className="flex flex-wrap items-baseline gap-3">
        <h3 className="font-[var(--font-heading)] text-2xl text-text-primary">
          {item.role}
        </h3>
        <span className="text-sm uppercase tracking-[0.35em] text-text-muted">
          {item.company}
        </span>
      </div>
      {showDates ? (
        <p className="mt-2 text-xs uppercase tracking-[0.3em] text-text-muted">
          {item.dates}
        </p>
      ) : null}
      <p className="mt-4 text-sm font-semibold uppercase tracking-[0.3em] text-accent">
        {item.metric}
      </p>
      <ul className="mt-4 space-y-2 text-base text-text-secondary">
        {item.bullets.map((bullet) => (
          <li key={bullet} className="flex gap-3">
            <span className="mt-2 h-1 w-8 rounded-full bg-accent/50" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
      {item.tech?.length ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {item.tech.map((tech) => (
            <Tag
              key={tech}
              value={tech}
              className="bg-bg px-3 py-1 text-xs uppercase tracking-[0.25em] text-text-muted"
            />
          ))}
        </div>
      ) : null}
    </Card>
  );
}

export default function Experience() {
  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mb-8 space-y-3"
        >
          <h2
            id="experience-heading"
            className="font-[var(--font-heading)] text-3xl font-semibold text-text-primary md:text-4xl"
          >
            Experience
          </h2>
          <p className="text-sm uppercase tracking-[0.3em] text-text-muted">
            IMPACT BY ROLE
          </p>
        </motion.div>

        <div className="space-y-6 lg:hidden">
          {EXPERIENCE.map((item) => (
            <ExperienceCard key={`${item.company}-${item.role}`} item={item} showDates />
          ))}
        </div>

        <div className="hidden lg:block">
          <Timeline
            value={EXPERIENCE}
            align="alternate"
            opposite={(item) => (
              <span className="text-sm uppercase tracking-[0.3em] text-text-muted">
                {(item as ExperienceItem).dates}
              </span>
            )}
            marker={() => (
              <span className="mt-1 flex h-3 w-3 items-center justify-center rounded-full border-2 border-accent bg-accent" />
            )}
            content={(item) => (
              <ExperienceCard item={item as ExperienceItem} showDates={false} />
            )}
            className="experience-timeline"
          />
        </div>
      </div>
    </section>
  );
}

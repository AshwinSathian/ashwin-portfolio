"use client";

import { RECENT_EXPERIENCE, type ExperienceItem } from "@/app/data/experience";
import { fadeInUp, stagger } from "@/lib/motion";
import { motion } from "framer-motion";
import { Card } from "primereact/card";
import { Timeline } from "primereact/timeline";

function ExperienceCard({
  item,
  showDates,
}: {
  item: ExperienceItem;
  showDates: boolean;
}) {
  return (
    <Card className="rounded-3xl bg-bg-glass p-6 shadow-glass backdrop-blur-soft">
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
          <li key={bullet} className="flex items-start gap-3">
            <span className="mt-2 h-1 w-8 rounded-full bg-accent/50" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default function Experience() {
  const fullExperience: ExperienceItem[] = [...RECENT_EXPERIENCE];

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
            Impact by role
          </p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="space-y-6 lg:hidden"
        >
          {fullExperience.map((item, index) => (
            <motion.div
              key={`${item.company}-${item.role}`}
              variants={fadeInUp}
            >
              <div className="relative pl-10">
                {index < fullExperience.length - 1 && (
                  <span className="pointer-events-none absolute left-[14px] top-10 h-[calc(100%-2.5rem)] w-px bg-gradient-to-b from-accent/70 via-accent/10 to-transparent" />
                )}
                <span className="pointer-events-none absolute left-0 top-6 flex h-7 w-7 items-center justify-center rounded-full border border-accent/40 bg-bg text-xs font-semibold text-accent">
                  {index + 1}
                </span>
                <ExperienceCard item={item} showDates />
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="hidden lg:block">
          <Timeline
            value={fullExperience}
            align="alternate"
            opposite={(item) => (
              <span className="text-sm uppercase tracking-[0.3em] text-text-muted">
                {(item as ExperienceItem).dates}
              </span>
            )}
            marker={() => (
              <motion.span
                className="mt-1 flex h-3 w-3 items-center justify-center rounded-full border-2 border-accent bg-accent"
                initial={{ boxShadow: "0 0 0 rgba(139,92,246,0)" }}
                whileInView={{ boxShadow: "0 0 12px rgba(139,92,246,0.45)" }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ type: "spring", stiffness: 140, damping: 18 }}
              />
            )}
            content={(item) => (
              <ExperienceCard item={item as ExperienceItem} showDates={false} />
            )}
          />
        </div>
      </div>
    </section>
  );
}

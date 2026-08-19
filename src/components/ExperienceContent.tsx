"use client";

import { motion } from "framer-motion";
import { RECENT_EXPERIENCE } from "@/app/data/experience";
import { EDUCATION } from "@/app/data/education";
import Skills from "@/components/Skills";
import { fadeInUp, stagger } from "@/lib/motion";

const introText =
  "Eight years across seven roles and five companies, from junior programmer to lead engineer directing a twelve-person team. Every line below is a fact, not a claim — dates and the stack that shipped them.";

export default function ExperienceContent() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-24 pt-32 md:px-16 md:py-32 md:pt-40">
      <motion.div
        initial="hidden"
        animate="show"
        variants={stagger}
        className="flex flex-col gap-4"
      >
        <motion.p variants={fadeInUp} className="font-ui text-[11px] font-medium uppercase tracking-[0.12em] text-ink-muted">
          Experience
        </motion.p>
        <motion.h1 variants={fadeInUp} className="font-display text-[clamp(32px,5vw,52px)] font-bold leading-[1.02] tracking-[-0.02em] text-ink">
          The record behind the résumé.
        </motion.h1>
        <motion.p variants={fadeInUp} className="max-w-2xl font-body text-[16px] leading-[1.7] text-ink-muted">
          {introText}
        </motion.p>
      </motion.div>

      {/* Stack — compact, functional, not a filler badge wall */}
      <h2 className="sr-only">Stack</h2>
      <div className="mt-14 border-t border-line pt-10">
        <Skills variant="grid" />
      </div>

      {/* Roles */}
      <div className="mt-16 flex flex-col">
        {RECENT_EXPERIENCE.map((item) => (
          <motion.div
            key={`${item.company}-${item.role}`}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
            className="grid gap-6 border-t border-line py-10 first:border-t-0 first:pt-0 md:grid-cols-[200px_1fr]"
          >
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
          </motion.div>
        ))}

        {EDUCATION.map((item) => (
          <motion.div
            key={item.school}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
            className="grid gap-6 border-t border-line py-10 md:grid-cols-[200px_1fr]"
          >
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
          </motion.div>
        ))}
      </div>
    </div>
  );
}

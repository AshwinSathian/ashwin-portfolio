"use client";

import { motion } from "framer-motion";
import { RECENT_EXPERIENCE } from "@/app/data/experience";
import { fadeIn, stagger } from "@/lib/motion";

export default function Experience() {
  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="bg-surface-1 px-6 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto max-w-5xl">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="flex flex-col gap-12"
        >
          <div className="flex flex-col gap-4">
            <motion.p
              variants={fadeIn}
              className="text-xs font-medium uppercase tracking-[0.08em] text-label-3"
            >
              Experience
            </motion.p>
            <motion.h2
              id="experience-heading"
              variants={fadeIn}
              className="text-[clamp(32px,5vw,56px)] font-extralight leading-[1.1] tracking-[-0.03em] text-label-1"
            >
              The story.
            </motion.h2>
          </div>

          {/* Timeline */}
          <div className="relative flex flex-col gap-0">
            {RECENT_EXPERIENCE.map((item, index) => (
              <motion.div
                key={`${item.company}-${item.role}`}
                variants={fadeIn}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.1 }}
                className="relative flex gap-8 pb-12 last:pb-0"
              >
                {/* Timeline line + dot */}
                <div className="relative flex flex-col items-center pt-1">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent" />
                  {index < RECENT_EXPERIENCE.length - 1 && (
                    <span className="mt-2 w-px grow bg-white/8" />
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col gap-4 pb-2">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h3 className="text-[17px] font-medium text-label-1">
                      {item.company}
                    </h3>
                    <span className="text-[13px] text-label-3">{item.dates}</span>
                  </div>
                  <p className="text-[15px] text-label-2">{item.role}</p>
                  <p className="text-[13px] font-medium text-metric">
                    {item.metric}
                  </p>
                  <ul className="flex flex-col gap-2">
                    {item.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex gap-3 text-[15px] leading-[1.6] text-label-2"
                      >
                        <span className="mt-2 h-px w-4 shrink-0 bg-label-4" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

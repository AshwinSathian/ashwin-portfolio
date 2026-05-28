"use client";

import { motion } from "framer-motion";
import { RECENT_EXPERIENCE } from "@/app/data/experience";
import { fadeInUp, stagger } from "@/lib/motion";

export default function Experience() {
  return (
    <section
      id="experience"
      aria-label="Experience"
      className="bg-surface-1 px-6 py-24 md:px-16 md:py-32"
    >
      <div className="mx-auto max-w-5xl">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.05 }}
          className="flex flex-col gap-16"
        >
          <div className="flex flex-col gap-3">
            <motion.p
              variants={fadeInUp}
              className="text-xs font-medium uppercase tracking-[0.08em] text-label-3"
            >
              Experience
            </motion.p>
          </div>

          <div className="flex flex-col">
            {RECENT_EXPERIENCE.map((item) => (
              <motion.div
                key={`${item.company}-${item.role}`}
                variants={fadeInUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.1 }}
                className="grid gap-6 border-t border-white/8 py-10 first:border-t-0 first:pt-0 md:grid-cols-[200px_1fr]"
              >
                {/* Left: dates + company */}
                <div className="flex flex-col gap-1">
                  <p className="text-[13px] text-label-3">{item.dates}</p>
                  <p className="text-[15px] font-medium text-label-2">
                    {item.company}
                  </p>
                </div>

                {/* Right: role + bullets */}
                <div className="flex flex-col gap-5">
                  <p className="text-[17px] font-medium tracking-[-0.01em] text-label-1">
                    {item.role}
                  </p>
                  <ul className="flex flex-col gap-3">
                    {item.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex gap-4 text-[15px] leading-[1.65] text-label-2"
                      >
                        <span className="mt-2.5 h-px w-4 shrink-0 bg-label-4" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                  {item.tech && item.tech.length > 0 && (
                    <p className="text-[13px] text-label-4">
                      {item.tech.join("  ·  ")}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

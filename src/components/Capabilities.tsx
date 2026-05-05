"use client";

import { motion } from "framer-motion";
import { SKILL_COLUMNS } from "@/app/data/skills";
import { fadeInUp, stagger } from "@/lib/motion";

export default function Capabilities() {
  return (
    <section
      id="skills"
      aria-labelledby="capabilities-heading"
      className="bg-canvas px-6 py-24 md:px-16 md:py-32"
    >
      <div className="mx-auto max-w-5xl">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="flex flex-col gap-16"
        >
          <div className="flex flex-col gap-4">
            <motion.p
              variants={fadeInUp}
              className="text-xs font-medium uppercase tracking-[0.08em] text-label-3"
            >
              Capabilities
            </motion.p>
            <motion.h2
              id="capabilities-heading"
              variants={fadeInUp}
              className="text-[clamp(36px,5.5vw,64px)] font-thin leading-none tracking-[-0.035em] text-label-1"
            >
              The stack.
            </motion.h2>
          </div>

          <motion.div
            variants={stagger}
            className="grid gap-12 sm:grid-cols-2"
          >
            {SKILL_COLUMNS.map((column, colIdx) => (
              <div key={colIdx} className="flex flex-col gap-10">
                {column.map((group) => (
                  <motion.div
                    key={group.title}
                    variants={fadeInUp}
                    className="flex flex-col gap-2"
                  >
                    <h3 className="text-[13px] font-medium uppercase tracking-[0.06em] text-label-3">
                      {group.title}
                    </h3>
                    <p className="text-[17px] leading-[1.6] tracking-[-0.005em] text-label-1">
                      {group.items.map((s) => s.name).join("  ·  ")}
                    </p>
                  </motion.div>
                ))}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

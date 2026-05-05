"use client";

import { motion } from "framer-motion";
import { SKILL_COLUMNS } from "@/app/data/skills";
import { fadeIn, stagger } from "@/lib/motion";

export default function Capabilities() {
  return (
    <section
      id="skills"
      aria-labelledby="capabilities-heading"
      className="bg-canvas px-6 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto max-w-5xl">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="flex flex-col gap-12"
        >
          <div className="flex flex-col gap-4">
            <motion.p
              variants={fadeIn}
              className="text-xs font-medium uppercase tracking-[0.08em] text-label-3"
            >
              Capabilities
            </motion.p>
            <motion.h2
              id="capabilities-heading"
              variants={fadeIn}
              className="text-[clamp(32px,5vw,56px)] font-extralight leading-[1.1] tracking-[-0.03em] text-label-1"
            >
              Full-stack.
              <br />
              End to end.
            </motion.h2>
          </div>

          <motion.p
            variants={fadeIn}
            className="max-w-3xl text-[17px] leading-[1.7] text-label-2"
          >
            Angular and Next.js on the frontend. NestJS and Node.js on the
            backend. MongoDB and DynamoDB for data. AWS for cloud
            infrastructure. TypeScript throughout. The goal is always the same:
            systems that stay fast, stay maintainable, and don&apos;t surprise
            the team at 2am.
          </motion.p>

          <motion.div
            variants={stagger}
            className="grid gap-10 sm:grid-cols-2"
          >
            {SKILL_COLUMNS.map((column, colIdx) => (
              <div key={colIdx} className="flex flex-col gap-8">
                {column.map((group) => (
                  <motion.div
                    key={group.title}
                    variants={fadeIn}
                    className="flex flex-col gap-2"
                  >
                    <h3 className="text-[15px] font-medium text-label-1">
                      {group.title}
                    </h3>
                    <p className="text-[15px] leading-[1.6] text-label-3">
                      {group.items.map((s) => s.name).join(" · ")}
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

"use client";

import { motion } from "framer-motion";
import { EDUCATION } from "@/app/data/education";
import { fadeIn, stagger } from "@/lib/motion";

const [bachelors] = EDUCATION;

export default function Education() {
  return (
    <section
      id="education"
      aria-labelledby="education-heading"
      className="bg-canvas px-6 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto max-w-5xl">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="flex flex-col gap-10"
        >
          <div className="flex flex-col gap-4">
            <motion.p
              variants={fadeIn}
              className="text-xs font-medium uppercase tracking-[0.08em] text-label-3"
            >
              Education
            </motion.p>
          </div>

          <motion.div
            variants={fadeIn}
            className="rounded-2xl border border-white/8 bg-surface-2 px-8 py-7"
          >
            <h2
              id="education-heading"
              className="text-[17px] font-medium text-label-1"
            >
              {bachelors.school}
            </h2>
            <p className="mt-2 text-[15px] text-label-2">
              {bachelors.credential}
            </p>
            <p className="mt-1 text-[13px] text-label-3">{bachelors.period}</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

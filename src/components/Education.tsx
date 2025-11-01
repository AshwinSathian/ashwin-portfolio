"use client";

import { motion } from "framer-motion";
import { EDUCATION } from "@/app/data/education";
import { fadeInUp } from "@/lib/motion";

const [bachelors] = EDUCATION;

export default function Education() {
  return (
    <section
      id="education"
      aria-labelledby="education-heading"
      className="py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mb-6 space-y-3"
        >
          <h2
            id="education-heading"
            className="font-[var(--font-heading)] text-3xl font-semibold text-text-primary md:text-4xl"
          >
            Education
          </h2>
          <p className="text-sm uppercase tracking-[0.3em] text-text-muted">
            Foundations
          </p>
        </motion.div>

        <motion.p
          variants={fadeInUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="rounded-full bg-bg-glass px-6 py-4 text-sm text-center text-text-secondary shadow-glass backdrop-blur-soft md:text-base p-5"
        >
          <strong className="font-semibold text-text-primary uppercase tracking-[0.35em]">
            {`${bachelors.school}`}
          </strong>
          <br />
          <span className="font-normal text-text-primary">
            {`${bachelors.credential}`}
          </span>
          <br />
          <span className="font-normal text-text-primary">
            {`${bachelors.period}`}
          </span>
        </motion.p>
      </div>
    </section>
  );
}

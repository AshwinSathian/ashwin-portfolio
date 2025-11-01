"use client";

import { motion } from "framer-motion";
import { Card } from "primereact/card";
import { EDUCATION } from "@/app/data/education";
import { fadeInUp, stagger } from "@/lib/motion";

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
          className="mb-8 space-y-3"
        >
          <h2
            id="education-heading"
            className="font-[var(--font-heading)] text-3xl font-semibold text-text-primary md:text-4xl"
          >
            Education
          </h2>
          <p className="text-sm uppercase tracking-[0.3em] text-text-muted">
            FOUNDATIONS
          </p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-6 md:grid-cols-3"
        >
          {EDUCATION.map((item) => (
            <motion.div key={`${item.school}-${item.credential}`} variants={fadeInUp}>
              <Card className="h-full rounded-2xl bg-bg-soft/30 p-6 shadow-soft">
                <h3 className="font-[var(--font-heading)] text-xl text-text-primary">
                  {item.school}
                </h3>
                <p className="mt-3 text-sm text-text-muted">{item.period}</p>
                <p className="mt-4 text-base text-text-secondary">
                  {item.credential}
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

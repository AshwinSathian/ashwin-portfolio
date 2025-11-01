"use client";

import { motion } from "framer-motion";
import { Card } from "primereact/card";
import { Chip } from "primereact/chip";
import { ABOUT } from "@/app/data/about";
import { fadeInUp, stagger } from "@/lib/motion";

export default function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
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
            id="about-heading"
            className="font-[var(--font-heading)] text-3xl font-semibold text-text-primary md:text-4xl"
          >
            About
          </h2>
          <p className="text-sm uppercase tracking-[0.3em] text-text-muted">
            Purpose & Proof
          </p>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          <Card className="rounded-3xl bg-bg-glass p-8 shadow-glass backdrop-blur-soft">
            <div className="space-y-6 text-base leading-relaxed text-text-secondary md:text-lg">
              {ABOUT.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-balance">
                  {paragraph}
                </p>
              ))}
            </div>
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
              className="mt-8 flex gap-3 overflow-x-auto pb-2"
            >
              {(ABOUT.focusAreas ?? []).map((item) => (
                <motion.div key={item} variants={fadeInUp}>
                  <Chip
                    label={item}
                    className="whitespace-nowrap rounded-full bg-bg px-4 py-2 text-sm text-text-secondary shadow-soft/40"
                  />
                </motion.div>
              ))}
            </motion.div>
            <div className="mt-8 h-[2px] w-full bg-gradient-to-r from-transparent via-accent-soft/60 to-transparent" />
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

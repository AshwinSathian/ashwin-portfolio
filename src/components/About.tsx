"use client";

import { ABOUT } from "@/app/data/about";
import { fadeInUp } from "@/lib/motion";
import { motion } from "framer-motion";
import { Card } from "primereact/card";

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
            PURPOSE & PRACTICE
          </p>
        </motion.div>

        <Card className="rounded-2xl bg-bg-soft/40 p-8 shadow-soft">
          <div className="space-y-6 text-base leading-relaxed text-text-secondary md:text-lg">
            {ABOUT.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-balance">
                {paragraph}
              </p>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}

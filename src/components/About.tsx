"use client";

import { motion } from "framer-motion";
import { ABOUT } from "@/app/data/about";
import { fadeIn, stagger } from "@/lib/motion";

export default function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="bg-surface-1 px-6 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto max-w-5xl">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="flex flex-col gap-10"
        >
          <motion.p
            variants={fadeIn}
            className="text-xs font-medium uppercase tracking-[0.08em] text-label-3"
          >
            About
          </motion.p>

          <motion.h2
            id="about-heading"
            variants={fadeIn}
            className="text-[clamp(32px,5vw,56px)] font-extralight leading-[1.1] tracking-[-0.03em] text-label-1"
          >
            Complex systems.
            <br />
            Calm delivery.
          </motion.h2>

          <motion.blockquote
            variants={fadeIn}
            className="border-l-[3px] border-accent pl-6 py-1"
          >
            <p className="text-[17px] leading-[1.7] text-label-2">
              {ABOUT.pullQuote}
            </p>
          </motion.blockquote>

          <motion.div
            variants={stagger}
            className="flex flex-col gap-5 max-w-3xl"
          >
            {ABOUT.paragraphs.map((para, i) => (
              <motion.p
                key={i}
                variants={fadeIn}
                className="text-[17px] leading-[1.7] text-label-2"
              >
                {para}
              </motion.p>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

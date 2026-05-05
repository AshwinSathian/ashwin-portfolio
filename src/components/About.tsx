"use client";

import { motion } from "framer-motion";
import { ABOUT } from "@/app/data/about";
import { fadeInUp, stagger } from "@/lib/motion";

export default function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="flex min-h-svh items-center bg-light-bg px-6 py-24 md:px-16 md:py-32"
    >
      <div className="mx-auto w-full max-w-5xl">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-16 md:grid-cols-[5fr_6fr] md:items-start md:gap-24"
        >
          {/* Left: headline */}
          <motion.h2
            id="about-heading"
            variants={fadeInUp}
            className="text-[clamp(32px,4.5vw,52px)] font-extralight leading-[1.1] tracking-[-0.03em] text-light-1"
          >
            {ABOUT.headline}
          </motion.h2>

          {/* Right: body */}
          <motion.div variants={stagger} className="flex flex-col gap-6">
            {ABOUT.paragraphs.map((para, i) => (
              <motion.p
                key={i}
                variants={fadeInUp}
                className="text-[17px] leading-[1.75] text-light-2"
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

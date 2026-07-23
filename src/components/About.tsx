"use client";

import { motion } from "framer-motion";
import { ABOUT } from "@/app/data/about";
import { fadeInUp, stagger } from "@/lib/motion";

export default function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="flex min-h-svh items-center bg-surface-1 px-6 py-24 md:px-16 md:py-32"
    >
      <div className="mx-auto w-full max-w-5xl">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="flex flex-col gap-16"
        >
          <motion.p
            variants={fadeInUp}
            className="text-xs font-medium uppercase tracking-[0.08em] text-label-3"
          >
            About
          </motion.p>

          <div className="grid gap-16 md:grid-cols-[5fr_6fr] md:items-start md:gap-24">
            {/* Left: headline */}
            <motion.h2
              id="about-heading"
              variants={fadeInUp}
              className="text-[clamp(36px,5.5vw,60px)] font-thin leading-[1.05] tracking-[-0.035em] text-label-1"
            >
              {ABOUT.headline}
            </motion.h2>

            {/* Right: body */}
            <motion.div variants={stagger} className="flex flex-col gap-6">
              {ABOUT.paragraphs.map((para, i) => (
                <motion.p
                  key={i}
                  variants={fadeInUp}
                  className="text-[17px] leading-[1.75] text-label-2"
                >
                  {para}
                </motion.p>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

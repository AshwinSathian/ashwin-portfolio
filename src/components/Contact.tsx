"use client";

import { motion } from "framer-motion";
import { SITE } from "@/app/data/site";
import { fadeIn, stagger } from "@/lib/motion";

export default function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="bg-surface-1 px-6 py-24 text-center md:px-8 md:py-32"
    >
      <div className="mx-auto max-w-5xl">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="flex flex-col items-center gap-8"
        >
          <motion.p
            variants={fadeIn}
            className="text-xs font-medium uppercase tracking-[0.08em] text-label-3"
          >
            Contact
          </motion.p>

          <motion.h2
            id="contact-heading"
            variants={fadeIn}
            className="text-[clamp(40px,8vw,80px)] font-extralight leading-[1.05] tracking-[-0.04em] text-label-1"
          >
            Let&apos;s talk.
          </motion.h2>

          <motion.div variants={fadeIn} className="flex flex-col gap-2">
            <p className="text-[17px] text-label-3">
              Open to engineering leadership roles.
            </p>
            <p className="text-[17px] text-label-3">Reach out directly.</p>
          </motion.div>

          <motion.a
            variants={fadeIn}
            href={`mailto:${SITE.email}`}
            className="text-[clamp(17px,2.5vw,28px)] font-normal text-accent transition-colors duration-200 hover:text-accent-hover hover:underline"
          >
            {SITE.email}
          </motion.a>

          <motion.div
            variants={fadeIn}
            className="flex flex-wrap items-center justify-center gap-1 text-[15px] text-label-3"
          >
            <a
              href={SITE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-200 hover:text-label-1"
            >
              LinkedIn
            </a>
            <span className="text-label-4">·</span>
            <a
              href={SITE.github}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-200 hover:text-label-1"
            >
              GitHub
            </a>
            <span className="text-label-4">·</span>
            <a
              href={SITE.phoneHref}
              className="transition-colors duration-200 hover:text-label-1"
            >
              {SITE.phone}
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

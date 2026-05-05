"use client";

import { motion } from "framer-motion";
import { SITE } from "@/app/data/site";
import { fadeInUp, stagger } from "@/lib/motion";

export default function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="flex min-h-svh flex-col items-center justify-center bg-canvas px-6 py-24 text-center md:px-16 md:py-32"
    >
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="flex flex-col items-center gap-10"
      >
        <motion.h2
          id="contact-heading"
          variants={fadeInUp}
          className="text-[clamp(48px,8vw,96px)] font-thin leading-none tracking-[-0.045em] text-label-1"
        >
          Let&apos;s talk.
        </motion.h2>

        <motion.a
          variants={fadeInUp}
          href={`mailto:${SITE.email}`}
          className="text-[clamp(17px,2vw,24px)] font-light tracking-[-0.01em] text-accent transition-colors duration-200 hover:text-accent-hover hover:underline underline-offset-4"
        >
          {SITE.email}
        </motion.a>

        <motion.p
          variants={fadeInUp}
          className="text-[15px] text-label-3"
        >
          Engineering, ideas, or interesting problems welcome.
        </motion.p>

        <motion.div
          variants={fadeInUp}
          className="flex items-center gap-2 text-[14px] text-label-4"
        >
          <a
            href={SITE.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-200 hover:text-label-2"
          >
            LinkedIn
          </a>
          <span>·</span>
          <a
            href={SITE.github}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-200 hover:text-label-2"
          >
            GitHub
          </a>
          <span>·</span>
          <a
            href={SITE.phoneHref}
            className="transition-colors duration-200 hover:text-label-2"
          >
            {SITE.phone}
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}

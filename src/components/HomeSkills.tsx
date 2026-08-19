"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Skills from "@/components/Skills";
import { SITE } from "@/app/data/site";
import { fadeInUp, stagger } from "@/lib/motion";

export default function HomeSkills() {
  return (
    <section aria-labelledby="stack-heading" className="border-t border-line px-6 py-16 md:px-16 md:py-20">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        variants={stagger}
        className="mx-auto flex max-w-3xl flex-col gap-6"
      >
        <motion.p
          variants={fadeInUp}
          id="stack-heading"
          className="font-ui text-[11px] font-medium uppercase tracking-[0.12em] text-ink-muted"
        >
          Stack
        </motion.p>
        <Skills variant="compact" />
        <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2">
          <Link
            href="/writing"
            className="font-ui text-[14px] text-ink transition-colors duration-200 hover:text-accent"
          >
            Writing →
          </Link>
          <a
            href={`mailto:${SITE.email}`}
            className="font-ui text-[14px] text-ink transition-colors duration-200 hover:text-accent"
          >
            Get in touch →
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}

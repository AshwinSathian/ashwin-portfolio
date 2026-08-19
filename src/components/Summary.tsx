"use client";

import { motion } from "framer-motion";
import { SUMMARY } from "@/app/data/summary";
import { fadeInUp, stagger } from "@/lib/motion";

export default function Summary() {
  return (
    <section aria-labelledby="summary-heading" className="border-t border-line px-6 py-16 md:px-16 md:py-20">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        variants={stagger}
        className="mx-auto flex max-w-3xl flex-col gap-4"
      >
        <motion.p
          variants={fadeInUp}
          id="summary-heading"
          className="font-ui text-[11px] font-medium uppercase tracking-[0.12em] text-ink-muted"
        >
          Summary
        </motion.p>
        <motion.p variants={fadeInUp} className="font-body text-[17px] leading-[1.75] text-ink">
          {SUMMARY}
        </motion.p>
      </motion.div>
    </section>
  );
}

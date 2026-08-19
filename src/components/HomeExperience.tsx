"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { RECENT_EXPERIENCE } from "@/app/data/experience";
import { fadeInUp, stagger } from "@/lib/motion";

export default function HomeExperience() {
  const [latest] = RECENT_EXPERIENCE;

  return (
    <section aria-labelledby="experience-heading" className="border-t border-line px-6 py-16 md:px-16 md:py-20">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={stagger}
        className="mx-auto flex max-w-3xl flex-col gap-6"
      >
        <motion.p
          variants={fadeInUp}
          id="experience-heading"
          className="font-ui text-[11px] font-medium uppercase tracking-[0.12em] text-ink-muted"
        >
          Experience
        </motion.p>

        <motion.div variants={fadeInUp} className="flex flex-col gap-1.5">
          <p className="font-display text-[13px] text-signal">{latest.dates}</p>
          <p className="font-display text-[17px] font-semibold tracking-[-0.01em] text-ink">
            {latest.role}
          </p>
          <p className="font-body text-[14px] text-ink-muted">{latest.company}</p>
        </motion.div>

        <motion.p variants={fadeInUp} className="max-w-2xl font-body text-[15px] leading-[1.7] text-ink-muted">
          Eight years, seven roles, five companies — from junior programmer to lead engineer
          directing a twelve-person team.
        </motion.p>

        <motion.div variants={fadeInUp}>
          <Link
            href="/experience"
            className="inline-flex items-center gap-2 font-ui text-[14px] text-ink transition-colors duration-200 hover:text-accent"
          >
            Full record, all seven roles →
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

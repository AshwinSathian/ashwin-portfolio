"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { RECENT_EXPERIENCE } from "@/app/data/experience";
import { fadeInUp, stagger } from "@/lib/motion";

const STATS = [
  { value: "7 yrs", label: "leading SaaS platforms" },
  { value: "$1B+", label: "GTV, Penny Software" },
  { value: "12", label: "engineers mentored" },
  { value: "1.5×", label: "faster release cadence" },
];

export default function HomeExperience() {
  const [latest] = RECENT_EXPERIENCE;

  return (
    <section aria-labelledby="experience-heading" className="border-t border-line px-6 py-16 md:px-16 md:py-20">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={stagger}
        className="mx-auto flex max-w-3xl flex-col gap-8"
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

        <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-6 border-t border-line pt-6 sm:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1">
              <span className="font-display text-[24px] font-bold text-ink">{stat.value}</span>
              <span className="font-ui text-[12px] leading-tight text-ink-muted">{stat.label}</span>
            </div>
          ))}
        </motion.div>

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

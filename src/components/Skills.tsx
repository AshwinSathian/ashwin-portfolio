"use client";

import { motion } from "framer-motion";
import { SKILL_GROUPS } from "@/app/data/skills";
import { fadeInUp, stagger } from "@/lib/motion";

export type SkillsProps = {
  /** "grid" (full detail, used on /experience) or "compact" (chip cloud, used on home). */
  variant?: "grid" | "compact";
};

export default function Skills({ variant = "grid" }: SkillsProps) {
  if (variant === "compact") {
    return (
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="flex flex-wrap gap-2"
      >
        {SKILL_GROUPS.flatMap((group) => group.items).map((item) => (
          <motion.span
            key={item.name}
            variants={fadeInUp}
            className="rounded-full border border-line px-3 py-1.5 font-ui text-[13px] text-ink-muted"
          >
            {item.name}
          </motion.span>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="grid gap-x-12 gap-y-8 sm:grid-cols-3"
    >
      {SKILL_GROUPS.map((group) => (
        <motion.div key={group.title} variants={fadeInUp} className="flex flex-col gap-3">
          <h2 className="font-ui text-[12px] uppercase tracking-[0.06em] text-ink-muted">
            {group.title}
          </h2>
          <p className="font-body text-[14px] leading-relaxed text-ink">
            {group.items.map((item) => item.name).join(", ")}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
}

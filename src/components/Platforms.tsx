"use client";

import { motion } from "framer-motion";
import { fadeInUp, stagger } from "@/lib/motion";

export type PlatformItem = {
  company: string;
  title: string;
  description: string;
};

export type PlatformsProps = {
  platform: PlatformItem;
};

export default function Platforms({ platform }: PlatformsProps) {
  return (
    <section
      id="platforms"
      aria-label="At work"
      className="bg-surface-1 px-6 py-20 md:px-16 md:py-24"
    >
      <div className="mx-auto max-w-5xl">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="flex flex-col gap-10"
        >
          <motion.p
            variants={fadeInUp}
            className="text-xs font-medium uppercase tracking-[0.08em] text-label-3"
          >
            At work
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex max-w-xl flex-col gap-3 rounded-2xl border border-white/6 bg-surface-2 p-8"
          >
            <p className="text-[11px] font-medium uppercase tracking-widest text-label-4">
              {platform.company}
            </p>
            <h3 className="text-[20px] font-medium leading-snug tracking-[-0.015em] text-label-1">
              {platform.title}
            </h3>
            <p className="text-[14px] leading-[1.65] text-label-3">{platform.description}</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

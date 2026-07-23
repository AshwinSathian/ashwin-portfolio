"use client";

import { motion } from "framer-motion";
import { fadeInUp, stagger } from "@/lib/motion";

export type PlatformItem = {
  company: string;
  title: string;
  description: string;
};

export type PlatformsProps = {
  platforms: PlatformItem[];
};

export default function Platforms({ platforms }: PlatformsProps) {
  if (platforms.length === 0) return null;

  return (
    <section
      id="platforms"
      aria-label="Platforms"
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

          <div className="grid gap-6 md:grid-cols-2">
            {platforms.map((platform, i) => (
              <motion.div
                key={platform.company}
                variants={fadeInUp}
                className={
                  i === 0
                    ? "flex flex-col gap-3 rounded-2xl border border-accent/20 bg-surface-2 p-8"
                    : "flex flex-col gap-2.5 rounded-2xl border border-white/6 bg-surface-1 p-7"
                }
              >
                <p
                  className={
                    i === 0
                      ? "text-[11px] font-medium uppercase tracking-widest text-accent"
                      : "text-[11px] font-medium uppercase tracking-widest text-label-4"
                  }
                >
                  {platform.company}
                </p>
                <h3
                  className={
                    i === 0
                      ? "text-[20px] font-medium leading-snug tracking-[-0.015em] text-label-1"
                      : "text-[17px] font-medium leading-snug tracking-[-0.01em] text-label-2"
                  }
                >
                  {platform.title}
                </h3>
                <p
                  className={
                    i === 0
                      ? "text-[14px] leading-[1.65] text-label-3"
                      : "text-[13px] leading-[1.65] text-label-4"
                  }
                >
                  {platform.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

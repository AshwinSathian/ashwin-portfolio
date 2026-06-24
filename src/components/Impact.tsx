"use client";

import { motion } from "framer-motion";
import { HIGHLIGHTS } from "@/app/data/highlights";
import { fadeInUp, stagger } from "@/lib/motion";

function getItemBorderClasses(i: number): string {
  if (i === 0) return "";
  if (i === 1) return "border-t border-white/8 sm:border-t-0 sm:border-l sm:pl-8";
  if (i === 2) return "border-t border-white/8 lg:border-t-0 lg:border-l lg:pl-8";
  return "border-t border-white/8 sm:border-l sm:pl-8 lg:border-t-0";
}

export default function Impact() {
  return (
    <section
      id="impact"
      aria-label="By the numbers"
      className="flex min-h-svh items-center bg-canvas px-6 py-24 md:px-16"
    >
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      >
        {HIGHLIGHTS.map((h, i) => (
          <motion.div
            key={h.id}
            variants={fadeInUp}
            className={`flex flex-col items-center text-center py-12 px-8 ${getItemBorderClasses(i)}`}
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-label-4 mb-4">
              {h.title}
            </p>
            <p
              className="font-thin leading-none tracking-[-0.045em] text-label-1"
              style={{ fontSize: "clamp(64px, 9vw, 112px)" }}
            >
              {h.metric}
            </p>
            <p className="text-[13px] leading-[1.6] text-label-3 mt-4 max-w-50 mx-auto">
              {h.summary}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

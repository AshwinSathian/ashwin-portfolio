"use client";

import { motion } from "framer-motion";
import { fadeInUp, stagger } from "@/lib/motion";

const METRICS = [
  { value: "$1B+", label: "Procurement GTV" },
  { value: "<200ms", label: "Query latency" },
  { value: "12", label: "Engineers mentored" },
];

export default function Impact() {
  return (
    <section
      id="impact"
      aria-label="Key metrics"
      className="flex min-h-svh items-center bg-canvas px-6 md:px-16"
    >
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="w-full"
      >
        {/* Desktop: three columns separated by hairline dividers */}
        <div className="hidden md:grid md:grid-cols-3">
          {METRICS.map((m, i) => (
            <motion.div
              key={m.value}
              variants={fadeInUp}
              className={`flex flex-col gap-4 py-12 ${
                i > 0 ? "border-l border-white/8 pl-12" : "pr-12"
              } ${i === 1 ? "pr-12" : ""}`}
            >
              <span
                className="font-thin leading-none tracking-[-0.04em] text-label-1"
                style={{ fontSize: "clamp(64px, 10vw, 112px)" }}
              >
                {m.value}
              </span>
              <span className="text-[15px] font-normal text-label-3">
                {m.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Mobile: stacked */}
        <div className="flex flex-col gap-12 md:hidden">
          {METRICS.map((m) => (
            <motion.div
              key={m.value}
              variants={fadeInUp}
              className="flex flex-col gap-3 border-t border-white/8 pt-8 first:border-t-0 first:pt-0"
            >
              <span className="text-[72px] font-thin leading-none tracking-[-0.04em] text-label-1">
                {m.value}
              </span>
              <span className="text-[15px] text-label-3">{m.label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

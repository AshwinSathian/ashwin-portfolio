"use client";

import { motion } from "framer-motion";
import { HIGHLIGHTS } from "@/app/data/highlights";
import { fadeIn, stagger } from "@/lib/motion";

const METRICS = [
  { value: "$1B+", qualifier: "Procurement", noun: "GTV" },
  { value: "1.5×", qualifier: "Faster", noun: "Releases" },
  { value: "<200ms", qualifier: "Critical", noun: "Queries" },
  { value: "12", qualifier: "Engineers", noun: "Mentored" },
];

export default function Impact() {
  return (
    <section
      id="impact"
      aria-labelledby="impact-heading"
      className="bg-canvas px-6 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto max-w-5xl">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="flex flex-col gap-16"
        >
          <div className="flex flex-col gap-4">
            <motion.p
              variants={fadeIn}
              className="text-xs font-medium uppercase tracking-[0.08em] text-label-3"
            >
              Impact
            </motion.p>
            <motion.h2
              id="impact-heading"
              variants={fadeIn}
              className="text-[clamp(32px,5vw,56px)] font-extralight leading-[1.1] tracking-[-0.03em] text-label-1"
            >
              By the numbers.
            </motion.h2>
          </div>

          {/* Large metric display */}
          <motion.div
            variants={stagger}
            className="grid grid-cols-2 gap-px bg-white/8 md:grid-cols-4"
          >
            {METRICS.map((m) => (
              <motion.div
                key={m.value}
                variants={fadeIn}
                className="flex flex-col gap-1 bg-canvas px-6 py-8 md:px-8"
              >
                <span className="text-[clamp(36px,4vw,56px)] font-extralight leading-none tracking-[-0.03em] text-metric">
                  {m.value}
                </span>
                <span className="mt-2 text-[13px] text-label-3">
                  {m.qualifier}
                </span>
                <span className="text-[13px] font-medium text-label-2">
                  {m.noun}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Supporting statements */}
          <motion.div
            variants={stagger}
            className="grid gap-8 sm:grid-cols-2"
          >
            {HIGHLIGHTS.map((h) => (
              <motion.div
                key={h.id}
                variants={fadeIn}
                className="flex flex-col gap-3"
              >
                <p className="text-[15px] font-medium text-label-1">
                  {h.metric} —{" "}
                  <span className="font-normal text-label-2">{h.summary}</span>
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

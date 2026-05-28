"use client";

import { motion } from "framer-motion";
import { fadeInUp, stagger } from "@/lib/motion";

const PRINCIPLES = [
  {
    word: "Craft",
    description:
      "Good software has clear edges. Everything inside is what it claims to be.",
  },
  {
    word: "Ownership",
    description:
      "The kind of understanding that only comes from staying long enough for your early decisions to catch up with you.",
  },
  {
    word: "Clarity",
    description:
      "Making something feel simple is harder than making it work. It's also the part that lasts.",
  },
];

export default function Impact() {
  return (
    <section
      id="principles"
      aria-label="Principles"
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
          {PRINCIPLES.map((p, i) => (
            <motion.div
              key={p.word}
              variants={fadeInUp}
              className={`flex flex-col gap-6 py-12 ${
                i > 0 ? "border-l border-white/8 pl-12" : "pr-12"
              } ${i === 1 ? "pr-12" : ""}`}
            >
              <span
                className="font-thin leading-none tracking-[-0.04em] text-label-1"
                style={{ fontSize: "clamp(56px, 8vw, 96px)" }}
              >
                {p.word}
              </span>
              <span className="max-w-xs text-[15px] leading-[1.65] text-label-3">
                {p.description}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Mobile: stacked */}
        <div className="flex flex-col gap-12 md:hidden">
          {PRINCIPLES.map((p) => (
            <motion.div
              key={p.word}
              variants={fadeInUp}
              className="flex flex-col gap-4 border-t border-white/8 pt-8 first:border-t-0 first:pt-0"
            >
              <span className="text-[64px] font-thin leading-none tracking-[-0.04em] text-label-1">
                {p.word}
              </span>
              <span className="text-[15px] leading-[1.65] text-label-3">
                {p.description}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

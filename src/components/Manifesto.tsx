"use client";

import { motion } from "framer-motion";

const WORDS = [
  "The",
  "systems",
  "I've",
  "built",
  "handle",
  "$1B+",
  "in",
  "transactions.",
  "Calm",
  "under",
  "load.",
  "Precise",
  "by",
  "design.",
];

export default function Manifesto() {
  return (
    <section
      aria-label="Statement"
      className="flex min-h-svh items-center justify-center bg-canvas px-6 md:px-16"
    >
      <motion.p
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
        }}
        className="max-w-4xl text-[clamp(24px,3.5vw,40px)] font-light leading-[1.3] tracking-[-0.015em] text-label-1"
        aria-label="The systems I've built handle $1B+ in transactions. Calm under load. Precise by design."
      >
        {WORDS.map((word, i) => (
          <motion.span
            key={i}
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { duration: 0.4, ease: [0, 0, 0.2, 1] } },
            }}
            className="inline-block"
          >
            {word}
            {i < WORDS.length - 1 ? " " : ""}
          </motion.span>
        ))}
      </motion.p>
    </section>
  );
}

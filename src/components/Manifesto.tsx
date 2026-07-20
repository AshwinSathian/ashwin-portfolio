"use client";

import { Fragment, useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/motion";

const WORDS = [
  "I've",
  "always",
  "cared",
  "more",
  "about",
  "the",
  "structure",
  "underneath",
  "than",
  "the",
  "feature",
  "on",
  "top.",
  "One",
  "is",
  "temporary.",
  "The",
  "other",
  "has",
  "to",
  "last.",
];

const FULL_TEXT = WORDS.join(" ");

function Word({
  word,
  index,
  progress,
  reduced,
}: {
  word: string;
  index: number;
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  // Each word brightens over its own slice of the section's scroll range —
  // the sentence reads itself in as the section is scrolled through.
  const start = (index / WORDS.length) * 0.75;
  const end = start + 0.6 / WORDS.length;
  const opacity = useTransform(progress, [start, end], [0.18, 1]);

  return (
    <motion.span style={{ opacity: reduced ? 1 : opacity }} className="inline-block">
      {word}
    </motion.span>
  );
}

export default function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  return (
    <section
      ref={sectionRef}
      aria-label="Statement"
      className={prefersReducedMotion ? "flex min-h-svh items-center justify-center bg-canvas px-6 md:px-16" : "relative h-[220vh] bg-canvas"}
    >
      <div
        className={
          prefersReducedMotion
            ? "contents"
            : "sticky top-0 flex h-svh items-center justify-center px-6 md:px-16"
        }
      >
        <p
          className="max-w-4xl text-[clamp(24px,3.5vw,40px)] font-light leading-[1.3] tracking-[-0.015em] text-label-1"
          aria-label={FULL_TEXT}
        >
          {WORDS.map((word, i) => (
            <Fragment key={i}>
              <Word word={word} index={i} progress={scrollYProgress} reduced={prefersReducedMotion} />
              {i < WORDS.length - 1 && " "}
            </Fragment>
          ))}
        </p>
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { HERO } from "@/app/data/hero";
import { fadeInUp, usePrefersReducedMotion } from "@/lib/motion";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const exitOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const exitY = useTransform(scrollYProgress, [0, 0.8], [0, -48]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-labelledby="hero-name"
      className="relative flex min-h-svh flex-col justify-between bg-canvas px-6 pt-13 pb-28 md:px-16 md:pb-20"
    >
      {/* Name + title, anchored to the bottom-left of the hero, drifts out on scroll */}
      <div className="flex flex-1 flex-col justify-end">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.2, delayChildren: 0.1 } },
          }}
          style={{ opacity: prefersReducedMotion ? 1 : exitOpacity, y: prefersReducedMotion ? 0 : exitY }}
          className="flex flex-col gap-3"
        >
          <motion.h1
            id="hero-name"
            variants={fadeInUp}
            className="text-[clamp(52px,9vw,100px)] font-semibold leading-none tracking-[-0.03em] text-ink-1"
          >
            {HERO.name}
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-[clamp(22px,3vw,32px)] font-medium leading-none tracking-[-0.015em] text-ink-2"
          >
            {HERO.title}
          </motion.p>
          <motion.p
            variants={fadeInUp}
            className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-4 mt-2"
          >
            {HERO.eyebrow}
          </motion.p>
          {/* Count must match PROJECTS.length in data/projects.ts */}
          <motion.p
            variants={fadeInUp}
            className="mt-1 font-mono text-[11px] text-ink-4 md:hidden"
          >
            {`// ${HERO.eyebrow.toLowerCase()} · 5 shipped projects, verified`}
          </motion.p>
        </motion.div>
      </div>

      {/* Scroll indicator, absolute bottom-center, independent of flex layout */}
      <motion.div
        aria-hidden
        style={{ opacity: prefersReducedMotion ? 1 : exitOpacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="flex flex-col items-center gap-3"
        >
          <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-4">
            Scroll
          </span>
          <div className="relative h-8 w-px overflow-hidden bg-ink-4/30">
            <motion.span
              className="absolute inset-x-0 top-0 bg-ink-2"
              animate={{ y: ["-100%", "200%"] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              style={{ height: "50%" }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

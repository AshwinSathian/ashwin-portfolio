"use client";

import { motion } from "framer-motion";
import { HERO } from "@/app/data/hero";
import { fadeInUp } from "@/lib/motion";

export default function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-name"
      className="relative flex min-h-svh flex-col justify-between bg-canvas px-6 pt-13 pb-16 md:px-16 md:pb-20"
    >
      {/* Name + title — anchored to the bottom-left of the hero */}
      <div className="flex flex-1 flex-col justify-end">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.2, delayChildren: 0.1 } },
          }}
          className="flex flex-col gap-3"
        >
          <motion.h1
            id="hero-name"
            variants={fadeInUp}
            className="text-[clamp(52px,9vw,100px)] font-thin leading-none tracking-[-0.045em] text-label-1"
          >
            {HERO.name}
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-[clamp(22px,3vw,32px)] font-light leading-none tracking-[-0.02em] text-label-3"
          >
            {HERO.title}
          </motion.p>
        </motion.div>
      </div>

      {/* Scroll indicator — absolute bottom-center, independent of flex layout */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        aria-hidden
      >
        <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-label-4">
          Scroll
        </span>
        <div className="relative h-8 w-px overflow-hidden bg-label-4/30">
          <motion.span
            className="absolute inset-x-0 top-0 bg-label-3"
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            style={{ height: "50%" }}
          />
        </div>
      </motion.div>
    </section>
  );
}

"use client";

import { useCallback } from "react";
import { motion } from "framer-motion";
import { HERO } from "@/app/data/hero";
import { SITE } from "@/app/data/site";
import { fadeIn, stagger } from "@/lib/motion";

export default function Hero() {
  const scrollTo = useCallback((href: string) => {
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative flex min-h-svh flex-col justify-center bg-canvas px-6 pt-13 md:px-8"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 70%, rgba(41,151,255,0.04), transparent)",
        }}
      />

      <div className="relative mx-auto w-full max-w-5xl py-24 md:py-32">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-8"
        >
          <motion.p
            variants={fadeIn}
            className="text-xs font-medium uppercase tracking-[0.08em] text-label-3"
          >
            {HERO.eyebrow}
          </motion.p>

          <motion.h1
            id="hero-heading"
            variants={fadeIn}
            className="text-[clamp(40px,8vw,80px)] font-extralight leading-[1.05] tracking-[-0.04em] text-label-1"
          >
            {HERO.headline.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </motion.h1>

          <motion.p variants={fadeIn} className="text-[17px] text-label-3">
            {HERO.identity}
          </motion.p>

          <motion.hr
            variants={fadeIn}
            className="w-120 max-w-full border-0 border-t border-white/8"
          />

          <motion.p
            variants={fadeIn}
            className="text-[17px] font-medium text-label-2"
          >
            {HERO.metricsLine}
          </motion.p>

          <motion.div
            variants={fadeIn}
            className="flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <button
              onClick={() => scrollTo(HERO.primaryCta.href)}
              className="inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 text-[15px] font-medium text-white transition-colors duration-200 hover:bg-accent-hover sm:w-auto"
            >
              {HERO.primaryCta.label}
            </button>
            <a
              href={HERO.secondaryCta.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center rounded-full border border-white/15 px-6 text-[15px] font-medium text-label-2 transition-colors duration-200 hover:border-white/25 hover:text-label-1 sm:w-auto"
            >
              {HERO.secondaryCta.label}
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { useCallback, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { HERO } from "@/app/data/hero";
import { SITE } from "@/app/data/site";
import { useIsMounted } from "@/lib/hooks";
import { fadeInUp, stagger } from "@/lib/motion";

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const isMounted = useIsMounted();
  const parallaxX = useMotionValue(0.5);
  const parallaxY = useMotionValue(0.5);

  const springX = useSpring(parallaxX, { stiffness: 90, damping: 26 });
  const springY = useSpring(parallaxY, { stiffness: 90, damping: 26 });

  useEffect(() => {
    if (prefersReducedMotion) {
      parallaxX.set(0.5);
      parallaxY.set(0.5);
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      const { innerWidth, innerHeight } = window;
      parallaxX.set(event.clientX / innerWidth);
      parallaxY.set(event.clientY / innerHeight);
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [parallaxX, parallaxY, prefersReducedMotion]);

  const scrollToSelector = useCallback((selector: string) => {
    const target = document.querySelector(selector);
    if (target instanceof HTMLElement) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.location.hash = selector;
    }
  }, []);

  const resumeClick = useCallback(() => {
    window.open(SITE.resumePath, "_blank", "noopener,noreferrer");
  }, []);

  const metrics = HERO.metrics ?? [];

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-bg py-24 md:py-32"
    >
      {isMounted && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-40 h-[640px] rounded-full"
          style={{
            opacity: prefersReducedMotion ? 0.5 : 0.65,
            background:
              "radial-gradient(400px at 20% 20%, rgba(124,58,237,0.28), transparent), radial-gradient(480px at 80% 10%, rgba(59,130,246,0.22), transparent)",
          }}
          animate={
            prefersReducedMotion ? undefined : { opacity: [0.5, 0.7, 0.5] }
          }
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {isMounted && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(circle at ${springX.get() * 100}% ${
              springY.get() * 100
            }%, rgba(139,92,246,0.28), transparent 55%)`,
          }}
        />
      )}

      <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-6 md:px-8">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="max-w-3xl space-y-6"
        >
          <motion.p
            variants={fadeInUp}
            className="text-sm uppercase tracking-[0.4em] text-text-muted"
          >
            Engineering Leadership · SaaS Architecture
          </motion.p>
          <motion.h1
            id="hero-heading"
            variants={fadeInUp}
            className="font-[var(--font-heading)] text-5xl font-semibold leading-tight text-text-primary md:text-7xl"
          >
            {HERO.title}
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="max-w-2xl text-lg text-text-secondary md:text-2xl"
          >
            {HERO.subhead}
          </motion.p>
          <motion.p
            variants={fadeInUp}
            className="text-base text-text-muted md:text-lg"
          >
            {HERO.tagline}
          </motion.p>
          <motion.div
            variants={fadeInUp}
            className="flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <Button
              label={HERO.primaryCta.label}
              className="min-w-[200px] justify-center rounded-full bg-accent px-6 py-3 text-base font-semibold shadow-glow transition-transform duration-200 ease-out hover:shadow-[0_0_45px_rgba(139,92,246,0.35)] active:scale-95"
              onClick={resumeClick}
            />
            <Button
              label={HERO.secondaryCta.label}
              outlined
              className="min-w-[200px] justify-center rounded-full border-accent/50 px-6 py-3 text-text-secondary transition-transform duration-200 ease-out hover:border-accent hover:text-text-primary active:scale-95"
              onClick={() => scrollToSelector(HERO.secondaryCta.href)}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

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
import { fadeInUp, stagger } from "@/lib/motion";

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const parallaxX = useMotionValue(0);
  const parallaxY = useMotionValue(0);

  const springX = useSpring(parallaxX, { stiffness: 60, damping: 20 });
  const springY = useSpring(parallaxY, { stiffness: 60, damping: 20 });

  useEffect(() => {
    if (prefersReducedMotion) {
      parallaxX.set(0);
      parallaxY.set(0);
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = ((event.clientX - innerWidth / 2) / (innerWidth / 2)) * 40;
      const y = ((event.clientY - innerHeight / 2) / (innerHeight / 2)) * 22;
      parallaxX.set(x);
      parallaxY.set(y);
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
      className="relative overflow-hidden bg-[radial-gradient(1000px_600px_at_60%_-10%,rgba(139,92,246,.22),transparent)] bg-bg py-24 md:py-32"
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 mx-auto h-[560px] w-[560px] rounded-full bg-accent/15 blur-3xl"
        style={{ x: springX, y: springY }}
      />

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
            SENIOR ENGINEERING LEADERSHIP
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
              icon={HERO.primaryCta.icon}
              severity="primary"
              className="min-w-[200px] justify-center shadow-soft"
              onClick={resumeClick}
            />
            <Button
              label={HERO.secondaryCta.label}
              iconPos="right"
              icon={HERO.secondaryCta.icon}
              outlined
              className="min-w-[200px] justify-center text-text-secondary hover:text-text-primary"
              onClick={() => scrollToSelector(HERO.secondaryCta.href)}
            />
          </motion.div>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="show"
          className="grid gap-3 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-stretch lg:gap-4"
        >
          {metrics.map((metric) => (
            <Tag
              key={metric.label}
              value={
                <span className="flex items-center gap-3 text-left">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 text-accent">
                    <i className={metric.icon} aria-hidden="true" />
                  </span>
                  <span className="flex flex-col">
                    <span className="text-base font-semibold text-text-primary">
                      {metric.value}
                    </span>
                    <span className="text-[11px] uppercase tracking-[0.35em] text-text-muted">
                      {metric.label}
                    </span>
                  </span>
                </span>
              }
              className="w-full rounded-xl bg-bg-soft/40 px-4 py-3 shadow-soft"
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

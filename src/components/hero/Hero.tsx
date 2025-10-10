"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "primereact/button";
import type { ButtonProps } from "primereact/button";
import { Tag } from "primereact/tag";
import { HERO, type HeroContent } from "@/data/hero";
import { SITE } from "@/data/site";

type CtaButton = {
  key: string;
  label: string;
  icon: string;
  ariaLabel: string;
  onClick: () => void;
  severity?: ButtonProps["severity"];
  outlined?: boolean;
};

const createCtaButtons = (handlers: {
  onResumeClick: () => void;
  onContactClick: () => void;
}): CtaButton[] => [
  {
    key: "resume",
    label: "Download Résumé",
    icon: "pi pi-download",
    ariaLabel: "Download résumé as PDF",
    severity: "primary" as ButtonProps["severity"],
    onClick: handlers.onResumeClick,
  },
  {
    key: "contact",
    label: "Contact",
    icon: "pi pi-envelope",
    outlined: true,
    ariaLabel: `Contact ${SITE.name}`,
    onClick: handlers.onContactClick,
  },
];

export default function Hero() {
  const heroContent: HeroContent = HERO;

  const scrollToContact = () => {
    const section = document.getElementById("contact");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    window.location.hash = "#contact";
  };

  const ctaButtons = createCtaButtons({
    onResumeClick: () =>
      window.open(SITE.resumePath, "_blank", "noopener,noreferrer"),
    onContactClick: scrollToContact,
  });

  return (
    <>
      <motion.h1
        id="hero-heading"
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="text-5xl sm:text-6xl font-normal tracking-tight uppercase"
      >
        {heroContent.title}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="text-xl sm:text-2xl mt-4 text-gray-400 tracking-wide uppercase"
      >
        {heroContent.subtitle}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.45 }}
        className="mt-8 flex flex-col items-center gap-4 sm:flex-row"
      >
        {ctaButtons.map((button) => (
          <Button
            key={button.key}
            label={button.label}
            icon={button.icon}
            severity={button.severity}
            outlined={button.outlined}
            aria-label={button.ariaLabel}
            className="px-5 py-3 text-sm font-medium uppercase tracking-wide"
            onClick={button.onClick}
          />
        ))}
      </motion.div>

      {heroContent.metrics?.length ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.45 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-3"
        >
          {heroContent.metrics.map((metric) => (
            <Tag
              key={`${metric.label}-${metric.value}`}
              value={`${metric.value} ${metric.label}`}
              className="px-3 py-2 text-xs uppercase tracking-wide"
            />
          ))}
        </motion.div>
      ) : null}
    </>
  );
}

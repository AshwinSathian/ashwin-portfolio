"use client";

import React from "react";
import { motion } from "framer-motion";

type PageSectionProps = {
  id: string;
  labelledBy: string;
  className?: string;
  children: React.ReactNode;
};

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function PageSection({
  id,
  labelledBy,
  className,
  children,
}: PageSectionProps) {
  if (id === "home") {
    return (
      <section
        id={id}
        role="region"
        aria-labelledby={labelledBy}
        className={className}
      >
        {children}
      </section>
    );
  }

  return (
    <motion.section
      id={id}
      role="region"
      aria-labelledby={labelledBy}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={sectionVariants}
      className={className}
    >
      {children}
    </motion.section>
  );
}

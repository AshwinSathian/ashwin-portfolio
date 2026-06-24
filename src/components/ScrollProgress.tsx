"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const width = useSpring(scrollYProgress, {
    damping: 40,
    stiffness: 200,
    mass: 0.4,
  });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-60 h-0.5 origin-left bg-accent"
      style={{ scaleX: width }}
    />
  );
}

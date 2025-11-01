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
      className="fixed inset-x-0 top-0 z-50 h-[2px] bg-gradient-to-r from-accent via-accent-soft to-accent-warm"
      style={{ scaleX: width, transformOrigin: "0% 50%" }}
    />
  );
}

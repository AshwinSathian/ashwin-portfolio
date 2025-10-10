"use client";

import React from "react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <>
      <motion.h1
        id="hero-heading"
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="text-5xl sm:text-6xl font-extrabold tracking-tight"
      >
        Ashwin Sathian
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="text-xl sm:text-2xl mt-4 text-gray-400"
      >
        Full-Stack Engineer • SaaS Architecture
      </motion.p>
    </>
  );
}

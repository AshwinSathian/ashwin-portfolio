"use client";

import { motion } from "framer-motion";
import { useIsMounted } from "@/lib/hooks";

export default function BreathingBackground() {
  const isMounted = useIsMounted();

  if (!isMounted) {
    return null;
  }

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 select-none"
      initial={{ opacity: 0.75 }}
      animate={{
        opacity: [0.65, 0.85, 0.65],
        backgroundPosition: ["0% 0%", "100% 50%", "0% 0%"],
      }}
      transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      style={{
        backgroundImage:
          "radial-gradient(900px at 20% 10%, rgba(139,92,246,0.35), transparent), radial-gradient(800px at 80% 0%, rgba(59,130,246,0.18), transparent)",
        backgroundSize: "200% 200%",
      }}
    />
  );
}

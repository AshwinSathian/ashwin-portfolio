import { useEffect, useState } from "react";
import type { Variants } from "framer-motion";

/** Tracks prefers-reduced-motion so components can skip transform/opacity animation. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const onChange = () => setReduced(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0, 0, 0.2, 1] } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5, ease: [0, 0, 0.2, 1] } },
};

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

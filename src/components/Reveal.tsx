"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode, HTMLAttributes } from "react";
import { fadeInUp, stagger } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/motion";

type RevealGroupProps = Omit<HTMLMotionProps<"div">, "children"> & {
  children?: ReactNode;
  amount?: number;
  /** Play once the group first mounts instead of on scroll into view (e.g. above-the-fold content). */
  onMount?: boolean;
};

/** Stagger container: wraps a set of <Reveal> children and orchestrates their entrance. */
export function RevealGroup({ amount = 0.2, onMount = false, children, ...props }: RevealGroupProps) {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return <div {...(props as HTMLAttributes<HTMLDivElement>)}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      {...(onMount ? { animate: "show" } : { whileInView: "show", viewport: { once: true, amount } })}
      variants={stagger}
      {...props}
    >
      {children}
    </motion.div>
  );
}

type RevealProps = Omit<HTMLMotionProps<"div">, "children"> & {
  children?: ReactNode;
};

/** A single fade-up item; use inside <RevealGroup> so entrances stagger together. */
export function Reveal({ children, ...props }: RevealProps) {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return <div {...(props as HTMLAttributes<HTMLDivElement>)}>{children}</div>;
  }

  return (
    <motion.div variants={fadeInUp} {...props}>
      {children}
    </motion.div>
  );
}

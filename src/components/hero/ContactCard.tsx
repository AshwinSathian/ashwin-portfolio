"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";
import { SITE } from "@/data/site";

const stagger = {
  hidden: { opacity: 0, y: 6 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 * i, duration: 0.35 },
  }),
};

const firstName = SITE.name.split(" ")[0];

const contactLinks = [
  {
    href: `mailto:${SITE.email}`,
    ariaLabel: `Email ${SITE.name}`,
    className:
      "inline-flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-400",
    label: "Email",
    icon: <FaEnvelope aria-hidden suppressHydrationWarning />,
  },
  {
    href: SITE.linkedin,
    ariaLabel: `Open ${firstName}'s LinkedIn`,
    className:
      "inline-flex items-center gap-2 rounded-md border border-blue-400/40 px-4 py-2 text-sm font-medium text-blue-300 transition-all hover:-translate-y-0.5 hover:border-blue-400 hover:text-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400/60",
    label: "LinkedIn",
    icon: <FaLinkedin aria-hidden suppressHydrationWarning />,
    target: "_blank" as const,
    rel: "noopener noreferrer",
  },
  {
    href: SITE.github,
    ariaLabel: `Open ${firstName}'s GitHub`,
    className:
      "inline-flex items-center gap-2 rounded-md border border-gray-600 px-4 py-2 text-sm font-medium text-gray-200 transition-all hover:-translate-y-0.5 hover:border-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500/60",
    label: "GitHub",
    icon: <FaGithub aria-hidden suppressHydrationWarning />,
    target: "_blank" as const,
    rel: "noopener noreferrer",
  },
];

export default function ContactCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="mt-8 rounded-xl border border-gray-800 bg-gray-800/50 backdrop-blur px-5 py-4"
    >
      <ul className="flex flex-col gap-3 sm:flex-row sm:gap-4">
        {contactLinks.map((link, index) => (
          <motion.li
            key={link.label}
            variants={stagger}
            initial="hidden"
            animate="visible"
            custom={index + 1}
          >
            <a
              href={link.href}
              aria-label={link.ariaLabel}
              className={link.className}
              target={link.target}
              rel={link.rel}
            >
              {link.icon}
              {link.label}
            </a>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

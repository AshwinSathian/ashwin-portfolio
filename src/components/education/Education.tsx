"use client";

import { EDUCATION } from "@/data/education";
import { motion, useReducedMotion } from "framer-motion";
import { Timeline } from "primereact/timeline";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

type EducationItem = (typeof EDUCATION)[number];

export default function Education() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className="w-full mx-auto px-3 sm:px-6 lg:px-8"
      variants={prefersReducedMotion ? undefined : fadeUp}
    >
      <Timeline
        value={EDUCATION}
        layout="vertical"
        align="left"
        marker={() => (
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-700 bg-gray-900 shadow-sm">
            <span
              className="pi pi-graduation-cap text-sm text-sky-300"
              aria-hidden
            />
          </span>
        )}
        content={(item) => (
          <div className="w-full">
            <EducationEntry item={item as EducationItem} />
          </div>
        )}
        className="!gap-4 w-full"
        pt={{
          event: { className: "flex items-stretch w-full" },
          content: { className: "flex-1 w-full" },
          separator: { className: "min-h-full" },
        }}
      />
    </motion.div>
  );
}

function EducationEntry({ item }: { item: EducationItem }) {
  return (
    <div className="w-full">
      <div className="mx-auto max-w-[72ch] rounded-lg border border-gray-800/60 bg-gray-900/70 p-5 shadow-sm">
        <h3 className="text-base sm:text-lg font-semibold text-white">
          {item.school}
        </h3>
        <div className="mt-2 flex flex-wrap items-center gap-2 uppercase text-white tracking-wide text-sm">
          {item.credential}
          <span className="text-xs sm:text-sm text-gray-400">
            {item.period}
          </span>
        </div>

        {item.details?.length ? (
          <ul className="mt-3 list-disc ml-5 space-y-1 text-sm leading-relaxed text-gray-300">
            {item.details.map((detail, index) => (
              <li key={`${item.school}-detail-${index}`}>{detail}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

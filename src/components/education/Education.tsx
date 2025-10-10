"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { EDUCATION } from "@/data/education";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

type EducationItem = (typeof EDUCATION)[number];

export default function Education() {
  const shouldReduceMotion = Boolean(useReducedMotion());

  return (
    <section className="w-full mx-auto px-3 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-5">
        {EDUCATION.map((item) => (
          <EducationCard
            key={`${item.school}-${item.period}`}
            item={item}
            shouldReduceMotion={shouldReduceMotion}
          />
        ))}
      </div>
    </section>
  );
}

function EducationCard({
  item,
  shouldReduceMotion,
}: {
  item: EducationItem;
  shouldReduceMotion: boolean;
}) {
  return (
    <motion.div
      variants={shouldReduceMotion ? undefined : fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      <Card className="w-full border border-surface-300/20 shadow-none bg-gray-900/70">
        <div className="mx-auto max-w-[72ch]">
          <h3 className="text-base sm:text-lg font-semibold text-white">
            {item.school}
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-gray-300">
            <Tag
              value={item.credential}
              rounded
              className="px-3 py-1 text-xs bg-gray-800/60 border border-gray-700 text-gray-100"
            />
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
      </Card>
    </motion.div>
  );
}

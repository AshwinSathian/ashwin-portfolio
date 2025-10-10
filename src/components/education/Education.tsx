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
    <section className="w-full mx-auto px-3">
      <div className="w-full flex flex-col gap-2">
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
      <Card className="w-full rounded-xl bg-gray-900/60 shadow-lg">
        <h3 className="text-base sm:text-lg font-semibold text-white">
          {item.school}
        </h3>

        <div className="mt-2 flex flex-col gap-2 text-gray-300">
          <span className="px-3 text-sm text-gray-100">{item.credential}</span>
          <span className="px-3 text-xs sm:text-sm text-gray-400">
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
      </Card>
    </motion.div>
  );
}

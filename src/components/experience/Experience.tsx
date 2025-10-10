"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { EXPERIENCE } from "@/data/experience";
import type { ExperienceItem as ExperienceItemType } from "@/data/experience";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

type ItemWithYear = ExperienceItemType & { year?: string | null };

export default function Experience() {
  const prefersReducedMotion = useReducedMotion();
  const reduceMotion = !!prefersReducedMotion;

  const items: ItemWithYear[] = useMemo(
    () =>
      EXPERIENCE.map((experience) => ({
        ...experience,
        year: extractYear(experience.period),
      })),
    []
  );

  return (
    <section className="w-full mx-auto px-3 sm:px-6 lg:px-8">
      <div className="relative grid grid-cols-[28px_1fr] sm:grid-cols-[36px_1fr] gap-x-4 sm:gap-x-6">
        <div className="relative">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-primary/25 to-primary/10"
          />
        </div>

        <div className="space-y-6">
          {items.map((item, idx) => (
            <RailRow
              key={`${item.company}-${item.role}-${idx}`}
              item={item}
              index={idx}
              prefersReducedMotion={reduceMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function RailRow({
  item,
  index,
  prefersReducedMotion,
}: {
  item: ItemWithYear;
  index: number;
  prefersReducedMotion: boolean;
}) {
  return (
    <div className="grid grid-cols-[28px_1fr] sm:grid-cols-[36px_1fr] gap-x-4 sm:gap-x-6 items-start">
      <div className="relative h-full">
        <span
          className="absolute mt-2 left-1/2 -translate-x-1/2 inline-block h-3.5 w-3.5 rounded-full ring-2 ring-primary/50"
          style={{ background: markerColor(index) }}
          aria-hidden="true"
        />
        {item.year ? (
          <span className="absolute -top-2 left-1/2 -translate-x-1/2 translate-y-[-100%] text-[10px] tracking-wide opacity-70">
            {item.year}
          </span>
        ) : null}
      </div>

      <motion.div
        variants={prefersReducedMotion ? undefined : fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
      >
        <Card className="w-full shadow-none border border-surface-300/20">
          <div className="mx-auto max-w-[72ch]">
            <header className="mb-1">
              <h3 className="text-base sm:text-lg font-semibold">
                {item.role} <span className="opacity-80">• {item.company}</span>
              </h3>
              <p className="text-xs sm:text-sm opacity-70">
                {item.period}
                {item.location ? ` • ${item.location}` : ""}
              </p>
            </header>

            <ul className="list-disc ml-5 space-y-1 text-sm leading-relaxed">
              {item.bullets.map((bullet, bulletIndex) => (
                <li key={bulletIndex}>{bullet}</li>
              ))}
            </ul>

            {item.tech?.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {item.tech.map((tech) => (
                  <Tag key={tech} value={tech} rounded className="px-3 py-1 text-xs" />
                ))}
              </div>
            ) : null}

            {item.link ? (
              <div className="mt-3">
                <Button
                  label="View"
                  icon="pi pi-external-link"
                  text
                  onClick={() =>
                    window.open(item.link as string, "_blank", "noopener,noreferrer")
                  }
                  aria-label={`Open ${item.company}`}
                />
              </div>
            ) : null}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

function extractYear(period: string): string | null {
  const match = period?.match(/(20\\d{2}|19\\d{2})/);
  return match ? match[1] : null;
}

function markerColor(index: number) {
  const palette = [
    "var(--primary-500)",
    "var(--primary-400)",
    "var(--primary-300)",
    "var(--primary-600)",
  ];
  return palette[index % palette.length] ?? palette[0];
}

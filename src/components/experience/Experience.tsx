"use client";

import React, { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Timeline } from "primereact/timeline";
import { EXPERIENCE } from "@/data/experience";
import type { ExperienceItem as ExperienceItemType } from "@/data/experience";
import ExperienceCard from "./ExperienceItem";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function Experience() {
  const prefersReducedMotion = useReducedMotion();

  const timelineItems = useMemo<TimelineItem[]>(() => {
    return EXPERIENCE.map((item, index) => ({
      ...item,
      timelineIndex: index,
    }));
  }, []);

  return (
    <motion.div
      className="w-full mx-auto px-3 sm:px-6 lg:px-8"
      variants={prefersReducedMotion ? undefined : fadeUp}
    >
      <Timeline
        value={timelineItems}
        layout="vertical"
        align="left"
        marker={(item) => (
          <TimelineMarker index={(item as TimelineItem).timelineIndex} />
        )}
        content={(item) => (
          <div className="w-full flex-1">
            <ExperienceCard item={item as ExperienceItemType} />
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

type TimelineItem = ExperienceItemType & { timelineIndex: number };

const markerPalette = [
  "text-blue-400",
  "text-emerald-400",
  "text-purple-400",
  "text-amber-400",
  "text-rose-400",
  "text-cyan-400",
];

function TimelineMarker({ index }: { index: number }) {
  const color = markerPalette[index % markerPalette.length];
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-700 bg-gray-900 shadow-sm">
      <span className={`pi pi-briefcase text-sm ${color}`} aria-hidden />
    </span>
  );
}

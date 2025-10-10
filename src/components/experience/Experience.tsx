import React from "react";
import { EXPERIENCE } from "@/data/experience";
import ExperienceItem from "./ExperienceItem";

export default function Experience() {
  return (
    <div className="space-y-8">
      {EXPERIENCE.map((item) => (
        <ExperienceItem
          key={`${item.role}-${item.company}-${item.period}`}
          item={item}
        />
      ))}
    </div>
  );
}

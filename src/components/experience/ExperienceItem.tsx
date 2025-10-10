import React from "react";
import type { ExperienceItem as ExperienceItemType } from "@/data/experience";

type ExperienceItemProps = {
  item: ExperienceItemType;
};

export default function ExperienceItem({ item }: ExperienceItemProps) {
  return (
    <div className="hover:bg-gray-800 p-6 rounded-lg transition-colors">
      <h3 className="font-semibold text-white text-xl">
        {item.role} | {item.company}
      </h3>
      <p className="text-sm text-gray-400">{item.period}</p>
      <ul className="list-disc pl-5 mt-2 text-gray-300 space-y-1">
        {item.bullets.map((bullet, index) => (
          <li key={index}>{bullet}</li>
        ))}
      </ul>
    </div>
  );
}

import React from "react";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import type { ExperienceItem as ExperienceItemType } from "@/data/experience";

type ExperienceCardProps = {
  item: ExperienceItemType;
};

export default function ExperienceCard({ item }: ExperienceCardProps) {
  return (
    <Card className="border border-gray-800/60 bg-gray-900/70 shadow-sm">
      <header className="mb-2">
        <h3 className="text-base sm:text-lg font-semibold text-white">
          {item.role} <span className="opacity-80">• {item.company}</span>
        </h3>
        <p className="text-xs sm:text-sm text-gray-400">
          {item.period}
          {item.location ? ` • ${item.location}` : ""}
        </p>
      </header>

      <ul className="list-disc ml-5 space-y-1 text-sm leading-relaxed text-gray-300">
        {item.bullets.map((bullet, index) => (
          <li key={index}>{bullet}</li>
        ))}
      </ul>

      {item.tech?.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {item.tech.map((tech) => (
            <Tag
              key={tech}
              value={tech}
              rounded
              className="px-3 py-1 text-xs bg-gray-800/60 border border-gray-700 text-gray-100"
            />
          ))}
        </div>
      ) : null}

      {item.link ? (
        <div className="mt-4">
          <Button
            label="View"
            icon="pi pi-external-link"
            text
            aria-label={`Open ${item.company}`}
            onClick={() => {
              window.open(item.link as string, "_blank", "noopener,noreferrer");
            }}
          />
        </div>
      ) : null}
    </Card>
  );
}

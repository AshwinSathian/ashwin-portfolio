"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { EXPERIENCE } from "@/data/experience";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function Experience() {
  const shouldReduceMotion = Boolean(useReducedMotion());

  return (
    <section className="w-full mx-auto px-3">
      <div className="w-full flex flex-col gap-2">
        {EXPERIENCE.map((item, index) => (
          <motion.div
            key={`${item.company}-${item.role}-${item.period}-${index}`}
            variants={shouldReduceMotion ? undefined : fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <Card className="w-full rounded-xl bg-gray-900/60 shadow-lg">
              <header className="mb-1">
                <h3 className="text-base sm:text-lg font-semibold text-white">
                  {item.role}{" "}
                  <span className="opacity-80">• {item.company}</span>
                </h3>
                <p className="text-xs sm:text-sm text-gray-400">
                  {item.period}
                  {"location" in item && item.location
                    ? ` • ${item.location}`
                    : ""}
                </p>
              </header>

              <ul className="list-disc ml-5 space-y-1 text-sm leading-relaxed text-gray-300">
                {item.bullets.map((bullet, bulletIndex) => (
                  <li key={bulletIndex}>{bullet}</li>
                ))}
              </ul>

              {(() => {
                const techStack = "tech" in item ? item.tech : undefined;
                return Array.isArray(techStack) && techStack.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {techStack.map((tech) => (
                      <Tag
                        key={tech}
                        value={tech}
                        rounded
                        className="px-3 py-1 text-xs bg-gray-800/60 border border-gray-700 text-gray-100"
                      />
                    ))}
                  </div>
                ) : null;
              })()}

              {"link" in item && item.link ? (
                <div className="mt-3">
                  <Button
                    label="View"
                    icon="pi pi-external-link"
                    text
                    aria-label={`Open ${item.company}`}
                    onClick={() =>
                      window.open(
                        item.link as string,
                        "_blank",
                        "noopener,noreferrer"
                      )
                    }
                  />
                </div>
              ) : null}
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

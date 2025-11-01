"use client";

import { motion } from "framer-motion";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { Tooltip } from "primereact/tooltip";
import { SKILL_GROUPS } from "@/app/data/skills";
import { fadeInUp, stagger } from "@/lib/motion";

export default function Skills() {
  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="py-16 md:py-24"
    >
      <Tooltip target=".skill-tag" position="top" showDelay={150} />
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mb-8 space-y-3"
        >
          <h2
            id="skills-heading"
            className="font-[var(--font-heading)] text-3xl font-semibold text-text-primary md:text-4xl"
          >
            Skills
          </h2>
          <p className="text-sm uppercase tracking-[0.3em] text-text-muted">
            SYSTEMS & TOOLING
          </p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-6 md:grid-cols-2"
        >
          {SKILL_GROUPS.map((group) => (
            <motion.div key={group.title} variants={fadeInUp}>
              <Card className="h-full rounded-2xl bg-bg-soft/30 p-6 shadow-soft">
                <div className="space-y-4">
                  <h3 className="font-[var(--font-heading)] text-xl text-text-primary">
                    {group.title}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {group.items.map((skill) => (
                      <Tag
                        key={skill.name}
                        value={skill.name}
                        severity={skill.severity}
                        className="skill-tag bg-bg px-3 py-2 text-sm text-text-secondary"
                        data-pr-tooltip={skill.note}
                      />
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

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
      <Tooltip target=".skill-chip" position="top" showDelay={150} />
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
            Systems & tooling
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
              <Card className="h-full rounded-3xl bg-bg-glass p-6 shadow-glass backdrop-blur-soft">
                <h3 className="font-[var(--font-heading)] text-xl text-text-primary">
                  {group.title}
                </h3>
                <div className="mt-5 flex flex-wrap gap-3">
                  {group.items.map((skill) => (
                    <motion.div
                      key={skill.name}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                      className="skill-chip"
                      data-pr-tooltip={skill.note}
                    >
                      <Tag
                        value={skill.name}
                        className="rounded-full bg-bg px-4 py-2 text-sm text-text-secondary shadow-soft/30"
                      />
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { ProjectCard, type ProjectCardProps } from "@/components/ProjectCard";
import { fadeIn, stagger } from "@/lib/motion";

export type WorkProps = {
  projects: ProjectCardProps[];
};

export default function Work({ projects }: WorkProps) {
  return (
    <section
      id="projects"
      aria-labelledby="work-heading"
      className="bg-surface-1 px-6 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto max-w-5xl">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="flex flex-col gap-12"
        >
          <div className="flex flex-col gap-4">
            <motion.p
              variants={fadeIn}
              className="text-xs font-medium uppercase tracking-[0.08em] text-label-3"
            >
              Work
            </motion.p>
            <motion.h2
              id="work-heading"
              variants={fadeIn}
              className="text-[clamp(32px,5vw,56px)] font-extralight leading-[1.1] tracking-[-0.03em] text-label-1"
            >
              Open source.
            </motion.h2>
          </div>

          {projects.length > 0 ? (
            <motion.div
              variants={stagger}
              className="flex flex-col gap-4"
            >
              {projects.map((project) => (
                <motion.div
                  key={`${project.owner}/${project.repo}`}
                  variants={fadeIn}
                >
                  <ProjectCard {...project} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.p
              variants={fadeIn}
              className="text-[15px] text-label-3"
            >
              Projects loading…
            </motion.p>
          )}
        </motion.div>
      </div>
    </section>
  );
}

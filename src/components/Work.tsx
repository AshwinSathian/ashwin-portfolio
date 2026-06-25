"use client";

import { motion } from "framer-motion";
import { ProjectCard, type ProjectCardProps } from "@/components/ProjectCard";
import { fadeInUp, stagger } from "@/lib/motion";

export type WorkProps = {
  projects: ProjectCardProps[];
};

export default function Work({ projects }: WorkProps) {
  if (projects.length === 0) return null;

  return (
    <section
      id="projects"
      aria-label="Work"
      className="bg-surface-1 px-6 py-24 md:px-16 md:py-32"
    >
      <div className="mx-auto max-w-5xl">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="flex flex-col gap-12"
        >
          <motion.p
            variants={fadeInUp}
            className="text-xs font-medium uppercase tracking-[0.08em] text-label-3"
          >
            Open source
          </motion.p>

          <motion.div variants={stagger} className="flex flex-col gap-4">
            {projects.map((project) => (
              <motion.div
                key={`${project.owner}/${project.repo}`}
                variants={fadeInUp}
              >
                <ProjectCard {...project} />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

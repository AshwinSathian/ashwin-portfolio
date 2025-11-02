"use client";

import { motion } from "framer-motion";
import { ProjectCard, type ProjectCardProps } from "@/components/ProjectCard";
import { fadeInUp, stagger } from "@/lib/motion";

export type TopProjectsProps = {
  projects: ProjectCardProps[];
};

export default function TopProjects({ projects }: TopProjectsProps) {
  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mb-8 space-y-3"
        >
          <h2
            id="projects-heading"
            className="font-[var(--font-heading)] text-3xl font-semibold text-text-primary md:text-4xl"
          >
            Top Projects
          </h2>
          <p className="text-sm uppercase tracking-[0.3em] text-text-muted">
            Selected repos
          </p>
        </motion.div>

        {projects.length > 0 ? (
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {projects.map((project) => (
              <motion.div
                key={`${project.owner}/${project.repo}`}
                variants={fadeInUp}
              >
                <ProjectCard {...project} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="rounded-3xl bg-bg-glass p-8 text-center text-text-muted shadow-glass backdrop-blur-soft"
          >
            Projects are loading. Please check back in a moment.
          </motion.div>
        )}
      </div>
    </section>
  );
}

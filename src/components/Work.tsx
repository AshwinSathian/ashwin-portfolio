"use client";

import { motion } from "framer-motion";
import { PLATFORM } from "@/app/data/work";
import { ProjectCard, type ProjectCardProps } from "@/components/ProjectCard";
import { fadeInUp, stagger } from "@/lib/motion";

export type WorkProps = {
  projects: ProjectCardProps[];
};

export default function Work({ projects }: WorkProps) {
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
          className="flex flex-col gap-20"
        >
          {/* Section header */}
          <div className="flex flex-col gap-3">
            <motion.p
              variants={fadeInUp}
              className="text-xs font-medium uppercase tracking-[0.08em] text-label-3"
            >
              Work
            </motion.p>
          </div>

          {/* Professional platform card */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col gap-6 rounded-2xl border border-white/6 bg-surface-2 p-8 md:p-10"
          >
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-label-3">
              {PLATFORM.company}
            </p>
            <h3 className="text-[clamp(22px,3vw,32px)] font-extralight leading-snug tracking-[-0.02em] text-label-1">
              {PLATFORM.title}
            </h3>
            <p className="max-w-2xl text-[17px] leading-[1.7] text-label-2">
              {PLATFORM.description}
            </p>
          </motion.div>

          {/* Open source */}
          {projects.length > 0 && (
            <div className="flex flex-col gap-6">
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
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

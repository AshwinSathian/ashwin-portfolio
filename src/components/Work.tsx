"use client";

import { motion } from "framer-motion";
import { ProjectCard, type ProjectCardProps } from "@/components/ProjectCard";
import { fadeInUp, stagger } from "@/lib/motion";

export type PlatformItem = {
  company: string;
  title: string;
  description: string;
};

export type WorkProps = {
  platforms: PlatformItem[];
  projects: ProjectCardProps[];
};

export default function Work({ platforms, projects }: WorkProps) {
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
          viewport={{ once: true, amount: 0.05 }}
          className="flex flex-col gap-20"
        >
          {/* Professional platform work */}
          {platforms.length > 0 && (
            <motion.div variants={stagger} className="flex flex-col gap-12">
              <motion.p
                variants={fadeInUp}
                className="text-xs font-medium uppercase tracking-[0.08em] text-label-3"
              >
                Platforms
              </motion.p>

              <div className="flex flex-col gap-6">
                {platforms.map((platform, i) => (
                  <motion.div
                    key={platform.company}
                    variants={fadeInUp}
                    className={`flex flex-col gap-5 rounded-2xl border border-white/8 bg-surface-2 p-8 md:p-10 ${
                      i === 0 ? "border-accent/20" : ""
                    }`}
                  >
                    <p
                      className={`text-[11px] font-medium uppercase tracking-widest ${
                        i === 0 ? "text-accent" : "text-label-4"
                      }`}
                    >
                      {platform.company}
                    </p>
                    <h3 className="text-[clamp(20px,2.5vw,28px)] font-extralight leading-[1.2] tracking-[-0.02em] text-label-1">
                      {platform.title}
                    </h3>
                    <p className="text-[15px] leading-[1.7] text-label-2 max-w-2xl">
                      {platform.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Open source projects */}
          {projects.length > 0 && (
            <motion.div variants={stagger} className="flex flex-col gap-12">
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
          )}
        </motion.div>
      </div>
    </section>
  );
}

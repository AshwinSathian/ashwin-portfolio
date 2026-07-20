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
                    className={
                      i === 0
                        ? "flex flex-col gap-6 rounded-2xl border border-accent/20 bg-surface-2 p-10 md:p-12"
                        : "flex flex-col gap-4 rounded-2xl border border-white/6 bg-surface-1 p-7 md:p-8"
                    }
                  >
                    <p
                      className={
                        i === 0
                          ? "text-[11px] font-medium uppercase tracking-widest text-accent"
                          : "text-[11px] font-medium uppercase tracking-widest text-label-4"
                      }
                    >
                      {platform.company}
                    </p>
                    <h3
                      className={
                        i === 0
                          ? "text-[clamp(24px,3vw,34px)] font-extralight leading-[1.15] tracking-[-0.025em] text-label-1"
                          : "text-[clamp(18px,2vw,22px)] font-extralight leading-tight tracking-[-0.015em] text-label-2"
                      }
                    >
                      {platform.title}
                    </h3>
                    <p
                      className={
                        i === 0
                          ? "text-[16px] leading-[1.7] text-label-2 max-w-2xl"
                          : "text-[14px] leading-[1.7] text-label-3 max-w-xl"
                      }
                    >
                      {platform.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <motion.div variants={stagger} className="flex flex-col gap-12">
              <motion.p
                variants={fadeInUp}
                className="text-xs font-medium uppercase tracking-[0.08em] text-label-3"
              >
                Projects
              </motion.p>

              <motion.div
                variants={stagger}
                className="grid grid-cols-1 gap-4 md:grid-cols-3"
              >
                {projects.map((project) => (
                  <motion.div key={project.slug} variants={fadeInUp}>
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

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { ProjectWithStats } from "@/app/(helpers)/projects";
import ProjectMedia from "@/components/ProjectMedia";
import VerifiedTag from "@/components/VerifiedTag";
import { fadeInScale, fadeInUp, stagger } from "@/lib/motion";

export type ProjectsProps = {
  projects: ProjectWithStats[];
};

export default function Projects({ projects }: ProjectsProps) {
  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="bg-canvas px-6 py-24 md:px-16 md:py-32"
    >
      <div className="mx-auto max-w-5xl">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="flex flex-col gap-4"
        >
          <motion.p
            variants={fadeInUp}
            className="motion-safe-reveal font-mono text-xs uppercase tracking-[0.08em] text-ink-3"
          >
            Projects
          </motion.p>
          <motion.h2
            id="projects-heading"
            variants={fadeInUp}
            className="motion-safe-reveal text-[clamp(36px,5.5vw,64px)] font-semibold leading-none tracking-[-0.02em] text-ink-1"
          >
            Built end to end.
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="motion-safe-reveal max-w-xl text-[16px] leading-[1.7] text-ink-3"
          >
            Most of what I ship at work isn&apos;t mine to show. These are designed,
            built, and run by me alone, outside of it.
          </motion.p>
        </motion.div>

        <div className="mt-16 flex flex-col">
          {projects.map((project, i) => (
            <motion.div
              key={project.slug}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
              variants={stagger}
              className="border-t border-white/8 py-12 first:border-t-0 first:pt-0 md:py-14"
            >
              <div className="grid gap-8 md:grid-cols-[minmax(0,340px)_1fr] md:gap-12">
                {/* Left: real product media + meta strip */}
                <motion.div variants={fadeInScale} className="motion-safe-reveal flex flex-col gap-3">
                  <ProjectMedia media={project.media} />
                  <div className="flex items-center gap-3 font-mono text-[12px] uppercase tracking-wider text-ink-3">
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    <span>{project.category}</span>
                    {(project.language || typeof project.stars === "number") && (
                      <span className="ml-auto normal-case tracking-normal text-ink-3">
                        {project.language}
                        {typeof project.stars === "number" && project.stars > 0 && ` · ★ ${project.stars}`}
                      </span>
                    )}
                  </div>
                </motion.div>

                {/* Right: name, tagline, stack, verified facts, links */}
                <div className="flex flex-col gap-5">
                  <motion.div variants={fadeInUp} className="motion-safe-reveal">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="group inline-flex items-baseline gap-3 focus-visible:outline-none"
                    >
                      <h3 className="text-[clamp(26px,3.5vw,40px)] font-semibold leading-[1.1] tracking-[-0.02em] text-ink-1 transition-colors duration-200 group-hover:text-signal">
                        {project.name}
                      </h3>
                      <span className="text-signal opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100">
                        →
                      </span>
                    </Link>
                  </motion.div>

                  <motion.p
                    variants={fadeInUp}
                    className="motion-safe-reveal max-w-xl text-[16px] leading-[1.7] text-ink-2"
                  >
                    {project.tagline}
                  </motion.p>

                  {project.highlights[0] && (
                    <motion.p
                      variants={fadeInUp}
                      className="motion-safe-reveal max-w-xl text-[14px] leading-[1.6] text-ink-3"
                    >
                      <span className="text-ink-2">{project.highlights[0].title}.</span>{" "}
                      {project.highlights[0].detail}
                    </motion.p>
                  )}

                  <motion.div variants={fadeInUp} className="motion-safe-reveal flex flex-wrap gap-2">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full bg-surface-2 px-3 py-1 text-[12px] font-medium text-ink-3"
                      >
                        {tech}
                      </span>
                    ))}
                  </motion.div>

                  <motion.div variants={fadeInUp} className="motion-safe-reveal flex flex-wrap gap-2">
                    {project.facts.map((fact) => (
                      <VerifiedTag key={fact.label} pill text={fact.value} />
                    ))}
                  </motion.div>

                  <motion.div variants={fadeInUp} className="motion-safe-reveal flex flex-wrap items-center gap-5 pt-1">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="text-[14px] text-ink-2 transition-colors duration-200 hover:text-ink-1"
                    >
                      Case study →
                    </Link>
                    {project.links.live && (
                      <a
                        href={project.links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[14px] text-ink-3 transition-colors duration-200 hover:text-ink-1"
                      >
                        Live ↗
                      </a>
                    )}
                    {project.links.github && (
                      <a
                        href={project.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[14px] text-ink-3 transition-colors duration-200 hover:text-ink-1"
                      >
                        GitHub ↗
                      </a>
                    )}
                    {project.links.npm && (
                      <a
                        href={project.links.npm}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[14px] text-ink-3 transition-colors duration-200 hover:text-ink-1"
                      >
                        npm ↗
                      </a>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { ProjectWithStats } from "@/app/(helpers)/projects";
import { fadeInUp, stagger } from "@/lib/motion";

export type HomeProjectsProps = {
  projects: ProjectWithStats[];
};

export default function HomeProjects({ projects }: HomeProjectsProps) {
  return (
    <section aria-labelledby="projects-heading" className="border-t border-line px-6 py-16 md:px-16 md:py-20">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="flex flex-col gap-2"
        >
          <motion.p
            variants={fadeInUp}
            id="projects-heading"
            className="font-ui text-[11px] font-medium uppercase tracking-[0.12em] text-ink-muted"
          >
            Projects
          </motion.p>
          <motion.p variants={fadeInUp} className="font-body text-[15px] leading-relaxed text-ink-muted">
            Eight independent products, designed and run end to end, outside of a full-time lead role.
          </motion.p>
        </motion.div>

        <motion.ol
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.05 }}
          variants={stagger}
          className="mt-8 flex flex-col"
        >
          {projects.map((project, i) => (
            <motion.li key={project.slug} variants={fadeInUp}>
              <Link
                href={`/projects/${project.slug}`}
                className="group flex flex-col gap-1.5 border-t border-line py-6 first:border-t-0 first:pt-0 focus-visible:outline-none md:flex-row md:items-baseline md:gap-6"
              >
                <span className="shrink-0 font-display text-[13px] text-ink-muted md:w-8">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="flex items-baseline gap-2">
                    <span className="font-display text-[16px] font-semibold text-ink transition-colors duration-200 group-hover:text-signal">
                      {project.name}
                    </span>
                    {project.decisionRecord && (
                      <span className="font-ui text-[11px] normal-case tracking-normal text-diff-add">
                        ± decision record
                      </span>
                    )}
                  </span>
                  <span className="font-body text-[14px] leading-relaxed text-ink-muted">
                    {project.tagline}
                  </span>
                </span>
                <span className="shrink-0 font-ui text-[13px] text-ink-muted opacity-0 transition-opacity duration-200 group-hover:opacity-100 md:opacity-0">
                  Case study →
                </span>
              </Link>
            </motion.li>
          ))}
        </motion.ol>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeInUp}
        >
          <Link
            href="/projects"
            className="mt-6 inline-flex items-center gap-2 font-ui text-[14px] text-ink transition-colors duration-200 hover:text-accent"
          >
            All projects, with the full write-up →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

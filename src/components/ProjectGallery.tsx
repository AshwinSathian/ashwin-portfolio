"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";
import { ViewTransition } from "react";
import type { Project } from "@/app/data/projects";
import ArrowLink from "@/components/ArrowLink";
import ProjectMedia from "@/components/ProjectMedia";
import { StatusTag } from "@/components/ProjectRow";

export type ProjectGalleryProps = {
  projects: Project[];
};

/**
 * Featured work as a Finder-style gallery: one large preview, a strip of
 * thumbnails to pick from, and the selected project's facts beside it.
 * Built as an ARIA tab set, so arrow keys move through the strip.
 */
export default function ProjectGallery({ projects }: ProjectGalleryProps) {
  const [selected, setSelected] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const project = projects[selected];
  const href = `/projects/${project.slug}`;

  const select = (i: number, focus = false) => {
    const next = (i + projects.length) % projects.length;
    setSelected(next);
    const tab = tabs.current[next];
    if (focus) tab?.focus();
    tab?.scrollIntoView({ block: "nearest", inline: "nearest" });
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const moves: Record<string, number> = {
      ArrowRight: selected + 1,
      ArrowLeft: selected - 1,
      Home: 0,
      End: projects.length - 1,
    };
    if (!(e.key in moves)) return;
    e.preventDefault();
    select(moves[e.key], true);
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start lg:gap-12">
      <div className="flex min-w-0 flex-col gap-4 lg:col-span-8">
        {/* Stage: visual only. The panel beside it carries the name and the
            case-study link, so the stage is hidden from assistive tech. */}
        <div aria-hidden className="relative mb-[clamp(2.5rem,7vw,4.5rem)]">
          <Link href={href} tabIndex={-1} className="stage block">
            <ViewTransition name={`project-media-${project.slug}`} share="morph">
              <div key={project.slug} className="stage-in aspect-[16/10] [&>*]:h-full [&>figure]:[mask-image:linear-gradient(to_bottom,black_65%,transparent)]">
                <ProjectMedia
                  media={project.media}
                  priority={selected === 0}
                  sizes="(min-width: 1200px) 736px, (min-width: 1024px) 62vw, 100vw"
                />
              </div>
            </ViewTransition>
          </Link>

          {/* The one glass surface: it floats over the screenshot, so it has
              real content to blur. */}
          <div className="glass pointer-events-none absolute bottom-3 left-3 max-w-[calc(100%-1.5rem)] px-4 py-3 sm:bottom-5 sm:left-5 sm:px-5 sm:py-4">
            <p className="text-meta text-fg-2">{project.category}</p>
            <p className="text-title font-semibold tracking-[-0.02em] text-fg wrap-anywhere sm:text-[1.625rem] sm:leading-tight">
              {project.name}
            </p>
          </div>
        </div>

        <div
          role="tablist"
          aria-label="Featured projects"
          onKeyDown={onKeyDown}
          className="-mx-5 flex snap-x scroll-px-5 gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:mx-0 sm:px-0 lg:gap-4"
        >
          {projects.map((p, i) => (
            <button
              key={p.slug}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`gallery-tab-${p.slug}`}
              aria-selected={i === selected}
              aria-controls="gallery-panel"
              tabIndex={i === selected ? 0 : -1}
              onClick={() => select(i)}
              className="thumb group flex w-36 shrink-0 snap-start flex-col gap-2 p-1.5 text-left sm:w-44 lg:w-auto lg:min-w-0 lg:flex-1 lg:basis-0"
            >
              <span className="block aspect-[16/10] overflow-hidden rounded-[8px] border border-line bg-surface">
                {p.media.kind === "screenshot" ? (
                  <Image
                    src={p.media.src}
                    alt=""
                    width={p.media.width}
                    height={p.media.height}
                    sizes="176px"
                    className="h-full w-full object-cover object-top"
                  />
                ) : (
                  // Code-only projects get a file tile instead of a screenshot.
                  <span className="flex h-full flex-col justify-between p-3 font-mono text-meta text-fg-3">
                    <span className="text-fg-2">{p.media.caption}</span>
                    <span className="self-end text-[1.25rem] font-semibold text-fg">.{p.media.language}</span>
                  </span>
                )}
              </span>
              <span className="truncate px-1 text-meta text-fg-2 group-aria-selected:text-fg">{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div
        role="tabpanel"
        id="gallery-panel"
        aria-labelledby={`gallery-tab-${project.slug}`}
        className="flex min-w-0 flex-col gap-5 lg:col-span-4"
      >
        {project.status && (
          <p>
            <StatusTag>{project.status}</StatusTag>
          </p>
        )}
        <h3 className="sr-only">{project.name}</h3>
        <p className="text-fg-2">{project.tagline}</p>
        <dl className="flex flex-col border-t border-line">
          {project.facts.map((fact) => (
            <div key={fact.label} className="grid grid-cols-[6.5rem_1fr] gap-4 border-b border-line py-3 text-small">
              <dt className="text-fg-3">{fact.label}</dt>
              <dd className="min-w-0 text-fg wrap-anywhere">{fact.value}</dd>
            </div>
          ))}
        </dl>
        <ArrowLink href={href}>
          Read the case study<span className="sr-only">: {project.name}</span>
        </ArrowLink>
      </div>
    </div>
  );
}

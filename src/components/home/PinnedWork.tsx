import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/app/data/projects";
import { HERO } from "@/app/data/hero";

type Props = { projects: Project[]; total: string };

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/**
 * The pinned poster. The lowercase name holds the top of the screen while
 * live screens of the shipped work scroll under it, one plate at a time.
 * Plain position: sticky (desktop only); on a phone the name scrolls away.
 */
export default function PinnedWork({ projects, total }: Props) {
  const [first, ...rest] = projects;
  const words = ["ashwin", "sathian."];

  return (
    <section aria-labelledby="hero-heading" className="relative pb-24 md:pt-16 lg:pb-40">
      <div className="pin-title bg-night pt-24 pb-4 md:pt-6 md:pb-5">
        <h1
          id="hero-heading"
          className="shell kinetic wordmark text-[clamp(3.75rem,17vw,8rem)] leading-[0.86] text-fg md:whitespace-nowrap md:text-[clamp(4rem,9.2vw,8.25rem)]"
        >
          <span className="sr-only">Ashwin Sathian, senior full-stack engineer</span>
          {words.map((word, i) => (
            <span key={word} aria-hidden>
              <span className="w" data-w={word} style={{ "--i": i } as CSSProperties}>
                <span>{word}</span>
              </span>{" "}
            </span>
          ))}
        </h1>
      </div>

      {/* First screen: the supporting line and the action beside the first plate. */}
      <div className="shell mt-8 grid gap-8 md:mt-10 lg:mt-14 lg:grid-cols-12 lg:items-end lg:gap-12">
        <div className="load-rise flex flex-col gap-6 lg:col-span-4 lg:pb-14" style={delay(500)}>
          <p className="text-title font-medium tracking-[-0.01em] text-fg">{HERO.title}</p>
          <p className="text-fg-2">
            Senior full-stack engineer in Kochi, eight years in, five of them as a founding engineer.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href="/projects"
              className="inline-flex min-h-12 items-center rounded-control bg-fg px-6 text-small font-semibold text-night transition-colors duration-200 hover:bg-fg-2 active:bg-fg-2"
            >
              See all {total} projects
            </Link>
          </div>
        </div>
        <Plate project={first} priority className="load-rise lg:col-span-8" style={delay(250)} />
      </div>

      <ol className="shell mt-24 flex flex-col gap-24 lg:mt-40 lg:gap-40" aria-label="Featured projects">
        {rest.map((project) => (
          <li key={project.slug} className="lg:mx-[8.333%]">
            <Plate project={project} className="reveal-media" />
          </li>
        ))}
      </ol>
    </section>
  );
}

function Plate({
  project,
  priority,
  className = "",
  style,
}: {
  project: Project;
  priority?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const host = project.links.live?.replace(/^https?:\/\//, "");
  return (
    <Link href={`/projects/${project.slug}`} className={`plate group block ${className}`} style={style}>
      <span className="block aspect-[16/10] overflow-hidden rounded-panel bg-surface">
        <Image
          src={`/projects/${project.slug}/live.webp`}
          alt={`The live ${project.name} site${host ? ` at ${host}` : ""}`}
          width={2400}
          height={1500}
          priority={priority}
          sizes="(min-width: 1200px) 736px, (min-width: 1024px) 62vw, 100vw"
          className="h-full w-full object-cover object-top"
        />
      </span>
      <span className="mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <span className="flex flex-wrap items-baseline gap-x-3">
          <span className="text-title font-semibold tracking-[-0.02em] text-fg">{project.name}</span>
          <span className="text-small text-fg-2">{project.category}</span>
        </span>
        <span className="inline-flex items-center gap-2 text-small text-fg">
          <span className="link">{project.caseStudy ? "Read the case study" : "See the project"}</span>
          <span aria-hidden className="arrow">→</span>
        </span>
      </span>
    </Link>
  );
}

import type { CSSProperties } from "react";
import { HERO } from "@/app/data/hero";
import { SITE } from "@/app/data/site";
import ArrowLink from "@/components/ArrowLink";
import KineticHeading from "@/components/KineticHeading";

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export default function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="relative overflow-clip border-b border-line">
      <div aria-hidden className="glow -right-[35%] -top-[12%] h-[130vmin] w-[130vmin] sm:-right-[20%] sm:-top-[30%] sm:h-[110vmin] sm:w-[110vmin]" />
      <div aria-hidden className="glow -bottom-[55%] -left-[25%] h-[90vmin] w-[90vmin] [animation-delay:-8s]" />

      <div className="hero-away shell relative flex min-h-svh flex-col justify-end pb-10 pt-28 lg:pb-16">
        <p className="load-rise mb-6 flex flex-col gap-x-3 gap-y-1 text-small text-fg-2 sm:flex-row sm:items-baseline lg:mb-8">
          <span className="font-medium text-fg">{HERO.name}</span>
          <span aria-hidden className="hidden text-fg-3 sm:inline">/</span>
          <span>{HERO.eyebrow}</span>
        </p>

        <KineticHeading
          id="hero-heading"
          text={HERO.title}
          className="max-w-[15ch] text-display-xl font-bold tracking-[-0.045em]"
        />

        <div
          className="load-rise mt-10 flex flex-col gap-6 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between lg:mt-16"
          style={delay(900)}
        >
          <p className="text-title font-medium tracking-[-0.01em] text-fg">{HERO.thesis}</p>
          <div className="flex flex-wrap gap-x-8">
            <ArrowLink href="/projects">See the work</ArrowLink>
            <ArrowLink href={SITE.resumePath} external>
              Résumé
            </ArrowLink>
          </div>
        </div>
      </div>
    </section>
  );
}

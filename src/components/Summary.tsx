"use client";

import { SUMMARY } from "@/app/data/summary";
import { Reveal, RevealGroup } from "@/components/Reveal";

export default function Summary() {
  return (
    <section aria-labelledby="summary-heading" className="border-t border-line px-6 py-16 md:px-16 md:py-20">
      <RevealGroup className="mx-auto grid max-w-5xl gap-6 md:grid-cols-12 md:gap-8">
        <Reveal>
          <p
            id="summary-heading"
            className="font-ui text-micro font-medium uppercase tracking-[0.14em] text-ink-muted md:col-span-3"
          >
            Summary
          </p>
        </Reveal>
        <Reveal className="md:col-span-8 md:col-start-4">
          <p className="font-body text-body-lg leading-[1.75] text-ink">{SUMMARY}</p>
        </Reveal>
      </RevealGroup>
    </section>
  );
}

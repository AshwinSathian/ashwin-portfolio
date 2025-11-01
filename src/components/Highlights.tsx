"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import { HIGHLIGHTS, type Highlight } from "@/app/data/highlights";
import { fadeInUp, stagger } from "@/lib/motion";

export default function Highlights() {
  const [activeHighlight, setActiveHighlight] = useState<Highlight | null>(
    null,
  );

  return (
    <section
      id="highlights"
      aria-labelledby="highlights-heading"
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
            id="highlights-heading"
            className="font-[var(--font-heading)] text-3xl font-semibold text-text-primary md:text-4xl"
          >
            Highlights
          </h2>
          <p className="text-sm uppercase tracking-[0.3em] text-text-muted">
            IMPACT SNAPSHOTS
          </p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
        >
          {HIGHLIGHTS.map((highlight) => (
            <motion.div key={highlight.id} variants={fadeInUp}>
              <Card className="flex h-full flex-col justify-between rounded-2xl bg-bg-soft/40 p-6 shadow-soft transition hover:shadow-lg">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-accent">
                    <i className={`${highlight.icon} text-2xl`} aria-hidden="true" />
                    <span className="text-xs font-semibold uppercase tracking-[0.4em]">
                      {highlight.metric}
                    </span>
                  </div>
                  <h3 className="font-[var(--font-heading)] text-2xl font-semibold text-text-primary">
                    {highlight.title}
                  </h3>
                  <p className="text-base text-text-secondary">
                    {highlight.summary}
                  </p>
                </div>
                <div className="mt-6">
                  <Button
                    label="View Details"
                    icon="pi pi-arrow-right"
                    iconPos="right"
                    outlined
                    className="w-full justify-between"
                    onClick={() => setActiveHighlight(highlight)}
                  />
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <Dialog
        header={
          <div className="flex flex-col gap-1">
            <span className="text-sm uppercase tracking-widest text-text-muted">
              {activeHighlight?.metric}
            </span>
            <span className="font-[var(--font-heading)] text-2xl text-text-primary">
              {activeHighlight?.title}
            </span>
          </div>
        }
        visible={Boolean(activeHighlight)}
        onHide={() => setActiveHighlight(null)}
        className="max-w-2xl"
        breakpoints={{ "960px": "75vw", "640px": "90vw" }}
      >
        <div className="space-y-4">
          <p className="text-base text-text-secondary">
            {activeHighlight?.summary}
          </p>
          <ul className="list-disc space-y-2 pl-5 text-sm text-text-muted md:text-base">
            {activeHighlight?.details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        </div>
      </Dialog>
    </section>
  );
}

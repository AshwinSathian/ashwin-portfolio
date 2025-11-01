"use client";

import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { SITE } from "@/app/data/site";

const actions = [
  {
    label: "Email",
    icon: "pi pi-envelope",
    severity: "primary" as const,
    onClick: () => window.open(`mailto:${SITE.email}`, "_blank", "noopener"),
  },
  {
    label: "Mobile",
    icon: "pi pi-phone",
    outlined: true,
    onClick: () => window.open(SITE.phoneHref, "_self"),
  },
  {
    label: "LinkedIn",
    icon: "pi pi-linkedin",
    outlined: true,
    onClick: () => window.open(SITE.linkedin, "_blank", "noopener,noreferrer"),
  },
  {
    label: "GitHub",
    icon: "pi pi-github",
    outlined: true,
    onClick: () => window.open(SITE.github, "_blank", "noopener,noreferrer"),
  },
];

export default function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="py-16 md:py-24"
    >
      <div className="mx-auto max-w-4xl px-6 md:px-8">
        <div className="mb-8 space-y-3 text-center">
          <h2
            id="contact-heading"
            className="font-[var(--font-heading)] text-3xl font-semibold text-text-primary md:text-4xl"
          >
            Contact
          </h2>
          <p className="text-sm uppercase tracking-[0.3em] text-text-muted">
            Let&apos;s build something remarkable.
          </p>
        </div>

        <Card className="rounded-3xl bg-bg-glass p-8 text-center shadow-glass backdrop-blur-soft">
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
            {actions.map((action) => (
              <Button
                key={action.label}
                label={action.label}
                icon={action.icon}
                outlined={action.outlined}
                className="group min-w-[160px] justify-center rounded-full px-6 py-3 transition-transform duration-200 ease-out hover:scale-105"
                onClick={action.onClick}
              />
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}

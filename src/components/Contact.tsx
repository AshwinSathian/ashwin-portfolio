"use client";

import { useRef } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { SITE } from "@/app/data/site";

type ContactAction = {
  label: string;
  icon: string;
  severity?:
    | "primary"
    | "success"
    | "info"
    | "warning"
    | "danger"
    | "secondary";
  outlined?: boolean;
  onClick: () => void;
};

export default function Contact() {
  const toastRef = useRef<Toast>(null);

  const copyToClipboard = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toastRef.current?.show({
        severity: "success",
        summary: "Copied",
        detail: `${label} copied to clipboard`,
        life: 1800,
      });
    } catch {
      toastRef.current?.show({
        severity: "warn",
        summary: "Couldn’t copy",
        detail: "Please copy it manually.",
        life: 1800,
      });
    }
  };

  const actions: ContactAction[] = [
    {
      label: "Email",
      icon: "pi pi-envelope",
      severity: "primary",
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
      onClick: () =>
        window.open(SITE.linkedin, "_blank", "noopener,noreferrer"),
    },
    {
      label: "GitHub",
      icon: "pi pi-github",
      outlined: true,
      onClick: () => window.open(SITE.github, "_blank", "noopener,noreferrer"),
    },
  ];

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="py-16 md:py-24"
    >
      <Toast ref={toastRef} position="bottom-center" />
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <div className="mb-8 space-y-3">
          <h2
            id="contact-heading"
            className="font-[var(--font-heading)] text-3xl font-semibold text-text-primary md:text-4xl"
          >
            Contact
          </h2>
          <p className="text-sm uppercase tracking-[0.3em] text-text-muted">
            LET’S BUILD SOMETHING REMARKABLE
          </p>
        </div>

        <Card className="flex rounded-2xl bg-bg-soft/35 p-8 shadow-soft items-center justify-center">
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap md:w-auto md:justify-end">
            {actions.map((action) => (
              <Button
                key={action.label}
                label={action.label}
                icon={action.icon}
                severity={action.severity}
                outlined={action.outlined}
                className="min-w-[160px] justify-center"
                onClick={action.onClick}
              />
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}

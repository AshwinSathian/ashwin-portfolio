"use client";

import React, { useRef } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Tooltip } from "primereact/tooltip";
import { SITE } from "@/data/site";

export default function ContactCard() {
  const toastRef = useRef<Toast>(null);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SITE.email);
      toastRef.current?.show({
        severity: "success",
        summary: "Copied",
        detail: "Email address copied",
        life: 1600,
      });
    } catch {
      toastRef.current?.show({
        severity: "warn",
        summary: "Unable to copy",
        detail: "Please copy manually",
        life: 1600,
      });
    }
  };

  return (
    <>
      <Toast ref={toastRef} position="bottom-center" />
      <Tooltip target=".has-tip" />

      <Card className="mt-8 rounded-xl bg-gray-800/50 p-3 backdrop-blur">
        <div className="flex items-center justify-center">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <Button
              label="Email"
              icon="pi pi-envelope"
              className="has-tip focus-visible:ring-2 focus-visible:ring-blue-400"
              aria-label={`Email ${SITE.name}`}
              data-pr-tooltip="Email me"
              outlined={true}
              onClick={() => {
                window.location.href = `mailto:${SITE.email}`;
              }}
            />

            <Button
              label="LinkedIn"
              icon="pi pi-linkedin"
              className="has-tip focus-visible:ring-2 focus-visible:ring-blue-400"
              aria-label={`Open ${SITE.name}'s LinkedIn profile`}
              data-pr-tooltip="View LinkedIn"
              outlined={true}
              onClick={() => {
                window.open(SITE.linkedin, "_blank", "noopener,noreferrer");
              }}
            />

            <Button
              label="GitHub"
              icon="pi pi-github"
              className="has-tip focus-visible:ring-2 focus-visible:ring-blue-400"
              aria-label={`Open ${SITE.name}'s GitHub profile`}
              data-pr-tooltip="View GitHub"
              outlined={true}
              onClick={() => {
                window.open(SITE.github, "_blank", "noopener,noreferrer");
              }}
            />

            <Button
              label="Copy Email"
              icon="pi pi-copy"
              text
              className="has-tip focus-visible:ring-2 focus-visible:ring-blue-400"
              aria-label="Copy email address"
              data-pr-tooltip="Copy email address"
              onClick={copyEmail}
            />
          </div>
        </div>
      </Card>
    </>
  );
}

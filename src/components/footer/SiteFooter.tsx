"use client";

import React from "react";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import { ScrollTop } from "primereact/scrolltop";
import { Tooltip } from "primereact/tooltip";
import { SITE } from "@/data/site";

export default function SiteFooter() {
  return (
    <footer className="mt-12 px-3 sm:px-6 lg:px-8">
      <Divider className="border-gray-800" />

      <div className="mx-auto max-w-6xl py-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-sm text-gray-300">
        <Button
          label="Download Résumé"
          icon="pi pi-download"
          outlined
          className="w-full sm:w-auto"
          onClick={() =>
            window.open(SITE.resumePath, "_blank", "noopener,noreferrer")
          }
        />

        <div className="text-xs opacity-70 text-center sm:text-right">
          © {new Date().getFullYear()} {SITE.name}
        </div>
      </div>

      <Tooltip target=".has-tip" />
      <ScrollTop />
    </footer>
  );
}

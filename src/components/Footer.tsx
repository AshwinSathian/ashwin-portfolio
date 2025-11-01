"use client";

import { Button } from "primereact/button";
import { SITE } from "@/app/data/site";

export default function Footer() {
  return (
    <footer className="border-t border-outline/30 bg-bg/80 backdrop-blur-soft">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-6 text-center md:flex-row md:justify-between md:text-left">
        <span className="text-sm text-text-muted">
          © {new Date().getFullYear()} {SITE.name}. All rights reserved.
        </span>
        <Button
          label="Download Resume"
          outlined
          className="rounded-full px-5"
          onClick={() =>
            window.open(SITE.resumePath, "_blank", "noopener,noreferrer")
          }
        />
      </div>
    </footer>
  );
}

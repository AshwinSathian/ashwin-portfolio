"use client";

import { useRouter } from "next/navigation";
import { Button } from "primereact/button";

export default function BackToProjectsButton() {
  const router = useRouter();

  return (
    <Button
      icon="pi pi-arrow-left"
      label="Back"
      text
      className="text-text-secondary flex items-center gap-3 uppercase tracking-wider"
      onClick={() => router.push("/#projects")}
    />
  );
}

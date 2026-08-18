"use client";

import { useRouter } from "next/navigation";

export default function BackToProjectsButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/#projects")}
      className="transition-colors duration-200 hover:text-ink-1"
    >
      Projects
    </button>
  );
}

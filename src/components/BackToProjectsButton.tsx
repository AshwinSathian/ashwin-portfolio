"use client";

import { useRouter } from "next/navigation";

export default function BackToProjectsButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/#projects")}
      className="text-[15px] text-label-3 transition-colors duration-200 hover:text-label-1"
    >
      ← Work
    </button>
  );
}

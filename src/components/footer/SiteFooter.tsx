import React from "react";
import { SITE } from "@/data/site";

export default function SiteFooter() {
  return (
    <footer className="py-8 px-6 text-center border-t border-gray-800 text-gray-500 text-sm">
      <a
        href={SITE.resumePath}
        download
        className="text-blue-400 hover:underline"
      >
        Download Resume (PDF)
      </a>
      <p className="mt-2">© {new Date().getFullYear()} {SITE.name}</p>
    </footer>
  );
}

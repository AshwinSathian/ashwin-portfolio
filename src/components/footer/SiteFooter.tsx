import React from "react";

export default function SiteFooter() {
  return (
    <footer className="py-8 px-6 text-center border-t border-gray-800 text-gray-500 text-sm">
      <a href="/Resume.pdf" download className="text-blue-400 hover:underline">
        Download Resume (PDF)
      </a>
      <p className="mt-2">© {new Date().getFullYear()} Ashwin Sathian</p>
    </footer>
  );
}

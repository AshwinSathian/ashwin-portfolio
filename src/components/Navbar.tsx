"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SITE } from "@/app/data/site";

const NAV_LINKS = [
  { label: "Work", href: "#experience" },
  { label: "Impact", href: "#impact" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const sectionIds = NAV_LINKS.map((l) => l.href.replace("#", ""));
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.3 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 h-[52px]"
        style={{
          background: "rgba(0,0,0,0.80)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="mx-auto flex h-full max-w-[1080px] items-center justify-between px-6 md:px-8">
          {/* Monogram */}
          <button
            onClick={() => scrollTo("#hero")}
            className="text-[17px] font-semibold text-label-1 hover:text-label-2 transition-colors duration-200"
            aria-label="Scroll to top"
          >
            AS
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {NAV_LINKS.map((link) => {
              const id = link.href.replace("#", "");
              return (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className={`text-[14px] transition-colors duration-200 ${
                    activeSection === id
                      ? "text-accent"
                      : "text-label-2 hover:text-label-1"
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
            <a
              href={SITE.resumePath}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[14px] font-medium text-label-2 hover:text-label-1 transition-colors duration-200 px-4 py-1.5 rounded-full border border-white/[0.15] hover:border-white/[0.25]"
            >
              Resume
            </a>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px]"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span
              className={`block h-px w-5 bg-label-2 transition-all duration-200 ${
                menuOpen ? "translate-y-[6px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-px w-5 bg-label-2 transition-all duration-200 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-px w-5 bg-label-2 transition-all duration-200 ${
                menuOpen ? "-translate-y-[6px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 bg-canvas flex flex-col justify-center items-center gap-10 transition-opacity duration-300 md:hidden ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {NAV_LINKS.map((link) => (
          <button
            key={link.href}
            onClick={() => scrollTo(link.href)}
            className="text-[32px] font-extralight text-label-1 hover:text-accent transition-colors duration-200"
          >
            {link.label}
          </button>
        ))}
        <a
          href={SITE.resumePath}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[17px] font-medium text-label-2 mt-4"
          onClick={() => setMenuOpen(false)}
        >
          Resume ↓
        </a>
      </div>
    </>
  );
}

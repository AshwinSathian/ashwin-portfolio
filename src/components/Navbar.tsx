"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { SITE } from "@/app/data/site";

const SCROLL_LINKS = [
  { label: "Work", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const isWritingRoute = pathname?.startsWith("/writing");
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (isWritingRoute) return;

    const ids = ["projects", "about", "experience", "contact"];
    const observers: IntersectionObserver[] = [];

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.3 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [isWritingRoute]);

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    toggleRef.current?.focus();
    const el = document.getElementById(href.replace("#", ""));
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 h-13 transition-colors duration-300"
        style={{
          background: scrolled ? "rgba(0,0,0,0.85)" : "rgba(0,0,0,0)",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        }}
      >
        <div className="mx-auto flex h-full max-w-5xl items-center justify-between px-6 md:px-16">
          <button
            onClick={() => scrollTo("#hero")}
            className="text-[15px] font-medium text-label-2 transition-colors duration-200 hover:text-label-1"
            aria-label="Back to top"
          >
            AS
          </button>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
            {!isWritingRoute && SCROLL_LINKS.map(({ label, href }) => {
              const id = href.replace("#", "");
              return (
                <button
                  key={href}
                  onClick={() => scrollTo(href)}
                  className={`text-[14px] transition-colors duration-200 ${
                    activeSection === id ? "text-accent" : "text-label-3 hover:text-label-1"
                  }`}
                >
                  {label}
                </button>
              );
            })}
            {isWritingRoute && (
              <Link
                href="/"
                className="text-[14px] text-label-3 transition-colors duration-200 hover:text-label-1"
              >
                Home
              </Link>
            )}
            <Link
              href="/writing"
              className={`text-[14px] transition-colors duration-200 ${
                isWritingRoute ? "text-accent" : "text-label-3 hover:text-label-1"
              }`}
            >
              Writing
            </Link>
            <a
              href={SITE.resumePath}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/15 px-4 py-1.5 text-[13px] text-label-3 transition-colors duration-200 hover:border-white/25 hover:text-label-1"
            >
              Résumé
            </a>
          </nav>

          <button
            ref={toggleRef}
            className="flex h-8 w-8 flex-col items-center justify-center gap-1.25 md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span className={`block h-px w-5 bg-label-2 transition-all duration-200 ${menuOpen ? "translate-y-1.5 rotate-45" : ""}`} />
            <span className={`block h-px w-5 bg-label-2 transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-px w-5 bg-label-2 transition-all duration-200 ${menuOpen ? "-translate-y-1.5 -rotate-45" : ""}`} />
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 flex flex-col items-center justify-center gap-10 bg-canvas transition-opacity duration-300 md:hidden ${
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {!isWritingRoute && SCROLL_LINKS.map(({ label, href }) => (
          <button
            key={href}
            onClick={() => scrollTo(href)}
            className="text-[36px] font-thin tracking-[-0.02em] text-label-1 transition-colors duration-200 hover:text-accent"
          >
            {label}
          </button>
        ))}
        {isWritingRoute && (
          <Link
            href="/"
            className="text-[36px] font-thin tracking-[-0.02em] text-label-1 transition-colors duration-200 hover:text-accent"
            onClick={() => { setMenuOpen(false); toggleRef.current?.focus(); }}
          >
            Home
          </Link>
        )}
        <Link
          href="/writing"
          className={`text-[36px] font-thin tracking-[-0.02em] transition-colors duration-200 hover:text-accent ${
            isWritingRoute ? "text-accent" : "text-label-1"
          }`}
          onClick={() => { setMenuOpen(false); toggleRef.current?.focus(); }}
        >
          Writing
        </Link>
        <a
          href={SITE.resumePath}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 text-[15px] text-label-3"
          onClick={() => { setMenuOpen(false); toggleRef.current?.focus(); }}
        >
          Résumé ↓
        </a>
      </div>
    </>
  );
}

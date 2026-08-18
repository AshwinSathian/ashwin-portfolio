"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { SITE } from "@/app/data/site";

const NAV_LINKS = [
  { label: "Projects", href: "/projects" },
  { label: "Experience", href: "/experience" },
  { label: "Writing", href: "/writing" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  const closeMenu = () => {
    setMenuOpen(false);
    toggleRef.current?.focus();
  };

  return (
    <>
      <header
        suppressHydrationWarning
        className={`fixed inset-x-0 top-0 z-50 transition-[height,background-color,border-color] duration-300 ${
          scrolled ? "h-14" : "h-16"
        }`}
        style={{
          background: scrolled ? "color-mix(in srgb, var(--color-paper) 92%, transparent)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled ? "1px solid var(--color-line)" : "1px solid transparent",
        }}
      >
        <div className="mx-auto flex h-full max-w-5xl items-center justify-between px-6 md:px-16">
          <Link
            href="/"
            className="font-display text-[15px] font-semibold text-ink transition-colors duration-200 hover:text-accent"
            aria-label="Ashwin Sathian, home"
          >
            AS
          </Link>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className={`font-ui text-[14px] transition-colors duration-200 ${
                  isActive(href) ? "text-signal" : "text-ink-muted hover:text-ink"
                }`}
              >
                {label}
              </Link>
            ))}
            <a
              href={SITE.resumePath}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-line px-4 py-1.5 font-ui text-[13px] text-ink-muted transition-colors duration-200 hover:border-ink-muted hover:text-ink"
            >
              Résumé
            </a>
          </nav>

          <button
            ref={toggleRef}
            className="flex h-8 w-8 flex-col items-center justify-center gap-1.5 md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span className={`block h-px w-5 bg-ink transition-all duration-200 ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-px w-5 bg-ink transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-px w-5 bg-ink transition-all duration-200 ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 flex flex-col items-center justify-center gap-10 bg-paper transition-opacity duration-300 md:hidden ${
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {NAV_LINKS.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            onClick={closeMenu}
            className={`font-display text-[32px] font-semibold tracking-[-0.01em] transition-colors duration-200 hover:text-signal ${
              isActive(href) ? "text-signal" : "text-ink"
            }`}
          >
            {label}
          </Link>
        ))}
        <a
          href={SITE.resumePath}
          target="_blank"
          rel="noopener noreferrer"
          onClick={closeMenu}
          className="mt-4 font-ui text-[15px] text-ink-muted"
        >
          Résumé ↓
        </a>
      </div>
    </>
  );
}

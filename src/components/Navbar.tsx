"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { SITE } from "@/app/data/site";

const NAV_LINKS = [
  { label: "Work", href: "/projects" },
  { label: "Experience", href: "/experience" },
  { label: "Writing", href: "/writing" },
];

export default function Navbar() {
  const pathname = usePathname();
  // Native <dialog>: showModal() gives focus trapping, Escape to close and an
  // inert page behind it without any of that being reimplemented here.
  const sheetRef = useRef<HTMLDialogElement>(null);

  const current = (href: string) => (pathname?.startsWith(href) ? "page" : undefined);
  const close = () => sheetRef.current?.close();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-night/75 backdrop-blur-xl">
      <div className="shell flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex min-h-11 items-center font-display text-[1.0625rem] font-semibold tracking-[-0.02em] text-fg"
        >
          Ashwin Sathian
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              aria-current={current(href)}
              className="flex min-h-11 items-center text-small text-fg-2 transition-colors duration-200 hover:text-fg active:text-fg aria-[current=page]:text-fg"
            >
              <span className="link" aria-current={current(href)}>
                {label}
              </span>
            </Link>
          ))}
          <a
            href={SITE.resumePath}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-10 items-center rounded-control border border-line-strong px-4 text-small text-fg transition-colors duration-200 hover:bg-fg hover:text-night active:bg-fg active:text-night"
          >
            Résumé
          </a>
        </nav>

        <button
          type="button"
          onClick={() => sheetRef.current?.showModal()}
          aria-haspopup="dialog"
          className="-mr-3 flex h-12 items-center gap-2.5 rounded-control px-3 text-small text-fg active:bg-surface-2 md:hidden"
        >
          Menu
          <span aria-hidden className="flex flex-col gap-[5px]">
            <span className="block h-px w-5 bg-fg" />
            <span className="block h-px w-5 bg-fg" />
          </span>
        </button>
      </div>

      <dialog
        ref={sheetRef}
        aria-label="Menu"
        className="sheet md:hidden"
        // A click that lands on the dialog element itself is on the backdrop.
        onClick={(e) => e.target === e.currentTarget && close()}
      >
        <div aria-hidden className="mx-auto mb-3 h-1 w-10 rounded-full bg-line-strong" />
        <nav aria-label="Main" className="flex flex-col">
          {[{ label: "Home", href: "/" }, ...NAV_LINKS].map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={close}
              aria-current={href === "/" ? (pathname === "/" ? "page" : undefined) : current(href)}
              className="flex min-h-14 items-center justify-between border-b border-line font-display text-[1.75rem] font-semibold tracking-[-0.02em] text-fg-2 active:text-fg aria-[current=page]:text-fg"
            >
              {label}
              <span aria-hidden className="arrow text-fg-3">→</span>
            </Link>
          ))}
          <a
            href={SITE.resumePath}
            target="_blank"
            rel="noopener noreferrer"
            onClick={close}
            className="flex min-h-14 items-center justify-between border-b border-line font-display text-[1.75rem] font-semibold tracking-[-0.02em] text-fg-2 active:text-fg"
          >
            Résumé
            <span aria-hidden className="arrow arrow-out text-fg-3">↗</span>
          </a>
        </nav>
        <button
          type="button"
          onClick={close}
          className="mt-5 flex h-12 w-full items-center justify-center rounded-control border border-line-strong text-small text-fg active:bg-surface-2"
        >
          Close
        </button>
      </dialog>
    </header>
  );
}

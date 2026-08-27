import { SITE } from "@/app/data/site";

export default function Footer() {
  return (
    <footer className="border-t border-line px-6 py-8 md:px-16">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 font-ui text-[13px] text-ink-muted md:flex-row md:items-center md:justify-between">
        <span>© {new Date().getFullYear()} {SITE.name}</span>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <a
            href={`mailto:${SITE.email}`}
            className="transition-colors duration-200 hover:text-ink"
          >
            {SITE.email}
          </a>
          <a
            href={SITE.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-200 hover:text-ink"
          >
            LinkedIn
          </a>
          <a
            href={SITE.github}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-200 hover:text-ink"
          >
            GitHub
          </a>
          <a
            href={SITE.resumePath}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-200 hover:text-ink"
          >
            Résumé ↓
          </a>
        </div>
      </div>
    </footer>
  );
}

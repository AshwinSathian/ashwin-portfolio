import { SITE } from "@/app/data/site";

export default function Footer() {
  return (
    <footer className="bg-paper px-6 py-6 md:px-8">
      <div className="mx-auto flex max-w-5xl items-center justify-between font-ui text-[13px] text-ink-muted">
        <span>© {new Date().getFullYear()} {SITE.name}</span>
        <a
          href={SITE.resumePath}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors duration-200 hover:text-ink"
        >
          Résumé ↓
        </a>
      </div>
    </footer>
  );
}

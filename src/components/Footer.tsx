import { SITE } from "@/app/data/site";

const LINKS = [
  { label: "Email", href: `mailto:${SITE.email}` },
  { label: "LinkedIn", href: SITE.linkedin, external: true },
  { label: "GitHub", href: SITE.github, external: true },
  { label: "Résumé", href: SITE.resumePath, external: true },
];

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="shell flex flex-col gap-2 py-6 text-meta text-fg-3 sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} {SITE.name}</span>
        <ul className="-mx-2 flex flex-wrap">
          {LINKS.map(({ label, href, external }) => (
            <li key={label}>
              <a
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="flex min-h-11 items-center px-2 transition-colors duration-200 hover:text-fg active:text-fg"
              >
                <span className="link">{label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}

import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/app/data/site";

const MENU = [
  { label: "Projects", href: "/projects" },
  { label: "Experience", href: "/experience" },
  { label: "Writing", href: "/writing" },
  { label: "Résumé", href: SITE.resumePath, external: true },
];

const ELSEWHERE = [
  { label: "Email", href: `mailto:${SITE.email}` },
  { label: "LinkedIn", href: SITE.linkedin, external: true },
  { label: "GitHub", href: SITE.github, external: true },
  { label: "RSS", href: "/writing/feed.xml" },
];

/** A designed close: the place on one half, the menu set large on the other. */
export default function Footer() {
  return (
    <footer className="grid bg-surface lg:min-h-[86svh] lg:grid-cols-2">
      <figure className="relative h-[46svh] lg:h-auto">
        <Image
          src="/place/kochi-net.webp"
          alt="A Chinese fishing net raised over the backwater in Kochi"
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover object-[60%_50%]"
        />
      </figure>

      <div className="flex flex-col justify-between gap-14 px-5 py-14 sm:px-8 lg:px-12 lg:py-16 xl:pr-[max(3rem,calc((100vw-1200px)/2+3rem))]">
        <div className="flex flex-col gap-10">
          <Link href="/" aria-label={`${SITE.name}, home`} className="wordmark self-start text-title text-fg">
            ashwin sathian.
          </Link>
          <nav aria-label="Footer">
            <ul className="flex flex-col gap-1">
              {MENU.map(({ label, href, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="footer-item inline-flex min-h-12 items-center text-display-m font-semibold leading-none tracking-[-0.03em] text-fg"
                  >
                    {label}
                    {external && <span className="sr-only"> (opens in new tab)</span>}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col gap-8">
          <ul className="flex flex-wrap gap-x-6 gap-y-1 text-small text-fg-2">
            {ELSEWHERE.map(({ label, href, external }) => (
              <li key={label}>
                <a
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="inline-flex min-h-11 items-center transition-colors duration-200 hover:text-fg active:text-fg"
                >
                  <span className="link">{label}</span>
                  {external && <span className="sr-only"> (opens in new tab)</span>}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-1 text-meta text-fg-3">
            <p>© {new Date().getFullYear()} {SITE.name}. Kochi, Kerala, India.</p>
            <p>
              Photo:{" "}
              <a
                href="https://commons.wikimedia.org/w/index.php?curid=4062876"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-fg-3/50 underline-offset-2 hover:text-fg-2"
              >
                Hans A. Rosbach
              </a>
              , CC BY-SA 3.0, via Wikimedia Commons, shown in greyscale.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

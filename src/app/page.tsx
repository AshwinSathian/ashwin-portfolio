import Link from "next/link";
import Hero from "@/components/Hero";
import RecentLog from "@/components/RecentLog";
import { RECENT_LOG } from "@/app/data/log";
import { SITE } from "@/app/data/site";

export const revalidate = 3600;

const PATHS = [
  { label: "Projects", href: "/projects", description: "Eight products, designed and run end to end." },
  { label: "Experience", href: "/experience", description: "The professional record, with the numbers behind it." },
  { label: "Writing", href: "/writing", description: "Notes on engineering, architecture, and shipping." },
  { label: "About", href: "/about", description: "Who this is, and why the side projects exist." },
];

export default function Page() {
  const profilePageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${SITE.website}/#profilepage`,
    url: SITE.website,
    name: `${SITE.name}, Engineer`,
    mainEntity: { "@id": `${SITE.website}/#person` },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }}
      />
      <Hero />
      <RecentLog entries={RECENT_LOG} />
      <section aria-label="Site sections" className="border-t border-line px-6 py-16 md:px-16 md:py-20">
        <div className="mx-auto grid max-w-3xl gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
          {PATHS.map((path) => (
            <Link
              key={path.href}
              href={path.href}
              className="group flex flex-col gap-2 bg-paper p-8 transition-colors duration-200 hover:bg-paper-raised"
            >
              <span className="font-display text-[20px] font-semibold text-ink transition-colors duration-200 group-hover:text-signal">
                {path.label}
              </span>
              <span className="font-body text-[14px] leading-relaxed text-ink-muted">
                {path.description}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

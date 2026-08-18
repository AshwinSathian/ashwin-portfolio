import type { Metadata } from "next";
import Projects from "@/components/Projects";
import { getProjects } from "@/app/(helpers)/projects";
import { ALSO_SHIPPED } from "@/app/data/projects";
import { SITE } from "@/app/data/site";

const description =
  "Eight independent products, designed and run end to end, outside of a full-time lead role.";

export const metadata: Metadata = {
  title: "Projects",
  description,
  alternates: { canonical: `${SITE.website}/projects` },
  openGraph: {
    title: "Projects | Ashwin Sathian",
    description,
    url: `${SITE.website}/projects`,
    type: "website",
    images: [{ url: "/og?label=Projects", width: 1200, height: 630, alt: "Projects | Ashwin Sathian" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects | Ashwin Sathian",
    description,
    creator: "@ashwinsathian",
    images: ["/og?label=Projects"],
  },
};

export const revalidate = 3600;

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <Projects projects={projects} />
      <section aria-labelledby="also-shipped-heading" className="mx-auto max-w-5xl px-6 pb-24 md:px-16 md:pb-32">
        <p id="also-shipped-heading" className="font-ui text-[11px] font-medium uppercase tracking-[0.12em] text-ink-muted">
          Also shipped
        </p>
        <ul className="mt-6 flex flex-col">
          {ALSO_SHIPPED.map((item) => (
            <li key={item.href} className="border-t border-line py-5 first:border-t-0 first:pt-0">
              <a href={item.href} target="_blank" rel="noopener noreferrer" className="group flex flex-col gap-1 md:flex-row md:items-baseline md:gap-6">
                <span className="font-display text-[15px] font-semibold text-ink transition-colors duration-200 group-hover:text-accent">
                  {item.name} ↗
                </span>
                <span className="font-body text-[14px] leading-relaxed text-ink-muted">
                  {item.description}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

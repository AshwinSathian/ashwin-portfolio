import type { Metadata } from "next";
import ProjectRow from "@/components/ProjectRow";
import { PageHeader } from "@/components/Section";
import { ALSO_SHIPPED, PROJECTS } from "@/app/data/projects";
import { SITE } from "@/app/data/site";

const NUMBER_WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
const total = NUMBER_WORDS[PROJECTS.length] ?? String(PROJECTS.length);
const capitalized = total[0].toUpperCase() + total.slice(1);

const description = `${capitalized} independent products, designed and run end to end.`;

const ogImageUrl = `/og?title=Projects&description=${encodeURIComponent(description)}&label=Projects`;

export const metadata: Metadata = {
  title: "Projects",
  description,
  alternates: { canonical: `${SITE.website}/projects` },
  openGraph: {
    title: "Projects | Ashwin Sathian",
    description,
    url: `${SITE.website}/projects`,
    type: "website",
    images: [{ url: ogImageUrl, width: 1200, height: 630, alt: "Projects | Ashwin Sathian" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects | Ashwin Sathian",
    description,
    creator: "@ashwinsathian",
    images: [ogImageUrl],
  },
};

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        title={`${capitalized} products, designed and run end to end.`}
        intro="Products I built on my own time, each checked against its repo. Where I got something wrong, the correction is public."
      />

      <div className="shell pb-24 lg:pb-40">
        <div className="flex flex-col border-b border-line">
          {PROJECTS.map((project) => (
            <ProjectRow
              key={project.slug}
              href={`/projects/${project.slug}`}
              name={project.name}
              description={project.tagline}
              status={project.status}
              marker={project.category}
              as="h2"
            />
          ))}
          {ALSO_SHIPPED.map((item) => (
            <ProjectRow
              key={item.href}
              href={item.href}
              name={item.name}
              description={item.description}
              status={item.status}
              marker="Also"
              as="h2"
            />
          ))}
        </div>
      </div>
    </>
  );
}

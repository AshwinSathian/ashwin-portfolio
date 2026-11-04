import type { Metadata } from "next";
import ProjectRow from "@/components/ProjectRow";
import { PageHeader } from "@/components/Section";
import { ALSO_SHIPPED, PROJECTS } from "@/app/data/projects";
import { SITE } from "@/app/data/site";
import { capitalize, numberWord } from "@/lib/text";

const capitalized = capitalize(numberWord(PROJECTS.length));

const description = `${capitalized} projects I built: a Markdown publisher, Go, Angular and TypeScript libraries, an encrypted messenger, an API client, a typing game and a Claude skill.`;

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
    images: [ogImageUrl],
  },
};

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        title={`${capitalized} projects, built and shipped end to end.`}
        intro="Products and libraries I built on my own time. Each page covers what it does and how it is built."
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

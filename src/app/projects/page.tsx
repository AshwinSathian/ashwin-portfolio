import type { Metadata } from "next";
import ProjectPanel from "@/components/ProjectPanel";
import ProjectRow from "@/components/ProjectRow";
import { PageHeader } from "@/components/Section";
import { ALSO_SHIPPED, PROJECTS } from "@/app/data/projects";
import { SITE } from "@/app/data/site";

const description =
  "Eight independent products, designed and run end to end, outside of a full-time lead role.";

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
  const featured = PROJECTS.filter((p) => p.featured);
  const rest = PROJECTS.filter((p) => !p.featured);

  return (
    <>
      <PageHeader
        title="Eight products, designed and run end to end."
        intro="Most of what I ship at work isn't mine to show. Everything here is. I built it, I run it, and where I got something wrong, the correction is public."
      />

      <div className="shell flex flex-col gap-20 pb-20 lg:gap-36 lg:pb-36">
        {featured.map((project, i) => (
          <ProjectPanel
            key={project.slug}
            project={project}
            index={i}
            flip={i % 2 === 1}
            priority={i === 0}
            as="h2"
          />
        ))}
      </div>

      <div className="shell pb-24 lg:pb-40">
        <div className="flex flex-col border-b border-line">
          {rest.map((project, i) => (
            <ProjectRow
              key={project.slug}
              href={`/projects/${project.slug}`}
              name={project.name}
              description={project.tagline}
              status={project.status}
              marker={String(featured.length + i + 1).padStart(2, "0")}
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

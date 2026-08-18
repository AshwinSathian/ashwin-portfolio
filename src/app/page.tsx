import Capabilities from "@/components/Capabilities";
import Contact from "@/components/Contact";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Platforms from "@/components/Platforms";
import Projects from "@/components/Projects";
import { getProjects } from "@/app/(helpers)/projects";
import { PLATFORM } from "@/app/data/work";
import { SITE } from "@/app/data/site";

export const revalidate = 3600;

export default async function Page() {
  const projects = await getProjects();

  // ProfilePage schema mirrors the page itself; no markup without matching content.
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
      <Hero projectCount={projects.length} />
      <Projects projects={projects} />
      <Platforms platform={PLATFORM} />
      <Capabilities />
      <Experience />
      <Contact />
      <Footer />
    </>
  );
}

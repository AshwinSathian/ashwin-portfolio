import Hero from "@/components/Hero";
import Summary from "@/components/Summary";
import HomeProjects from "@/components/HomeProjects";
import HomeExperience from "@/components/HomeExperience";
import HomeSkills from "@/components/HomeSkills";
import { getProjects } from "@/app/(helpers)/projects";
import { SITE } from "@/app/data/site";

export const revalidate = 3600;

export default async function Page() {
  const projects = await getProjects();

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
      <Summary />
      <HomeProjects projects={projects} />
      <HomeExperience />
      <HomeSkills />
    </>
  );
}

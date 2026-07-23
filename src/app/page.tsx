import About from "@/components/About";
import Capabilities from "@/components/Capabilities";
import Contact from "@/components/Contact";
import Experience from "@/components/Experience";
import FAQSection from "@/components/FAQ";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Platforms from "@/components/Platforms";
import Projects from "@/components/Projects";
import { getProjects } from "@/app/(helpers)/projects";
import { HIGHLEVEL_PLATFORM, PLATFORM } from "@/app/data/work";
import { FAQ } from "@/app/data/faq";
import { SITE } from "@/app/data/site";

export const revalidate = 3600;

export default async function Page() {
  const projects = await getProjects();
  const platforms = [HIGHLEVEL_PLATFORM, PLATFORM];

  // FAQPage and ProfilePage schema mirror what's actually rendered below
  // (the FAQSection and the page itself) — no markup without matching content.
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  const profilePageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${SITE.website}/#profilepage`,
    url: SITE.website,
    name: `${SITE.name} — Engineer`,
    mainEntity: { "@id": `${SITE.website}/#person` },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Hero />
      <Projects projects={projects} />
      <About />
      <Platforms platforms={platforms} />
      <Capabilities />
      <Experience />
      <FAQSection />
      <Contact />
      <Footer />
    </>
  );
}

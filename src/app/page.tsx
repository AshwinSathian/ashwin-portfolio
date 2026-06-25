import About from "@/components/About";
import Capabilities from "@/components/Capabilities";
import Contact from "@/components/Contact";
import Education from "@/components/Education";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Impact from "@/components/Impact";
import Manifesto from "@/components/Manifesto";
import Work from "@/components/Work";
import WritingTeaser from "@/components/WritingTeaser";
import { getTopProjects } from "@/app/(helpers)/projects";
import { HIGHLEVEL_PLATFORM, PLATFORM } from "@/app/data/work";

export const revalidate = 3600;

export default async function Page() {
  const topProjects = await getTopProjects();
  const platforms = [HIGHLEVEL_PLATFORM, PLATFORM];

  return (
    <>
      <Hero />
      <Manifesto />
      <Impact />
      <About />
      <Work platforms={platforms} projects={topProjects} />
      <Capabilities />
      <WritingTeaser />
      <Experience />
      <Education />
      <Contact />
      <Footer />
    </>
  );
}

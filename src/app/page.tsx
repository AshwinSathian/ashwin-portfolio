import About from "@/components/About";
import Capabilities from "@/components/Capabilities";
import Contact from "@/components/Contact";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Platforms from "@/components/Platforms";
import Projects from "@/components/Projects";
import { getProjects } from "@/app/(helpers)/projects";
import { HIGHLEVEL_PLATFORM, PLATFORM } from "@/app/data/work";

export const revalidate = 3600;

export default async function Page() {
  const projects = await getProjects();
  const platforms = [HIGHLEVEL_PLATFORM, PLATFORM];

  return (
    <>
      <Hero />
      <Projects projects={projects} />
      <About />
      <Platforms platforms={platforms} />
      <Capabilities />
      <Experience />
      <Contact />
      <Footer />
    </>
  );
}

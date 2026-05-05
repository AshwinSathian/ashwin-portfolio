import About from "@/components/About";
import Capabilities from "@/components/Capabilities";
import Contact from "@/components/Contact";
import Education from "@/components/Education";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Impact from "@/components/Impact";
import Work from "@/components/Work";
import { getTopProjects } from "@/app/(helpers)/projects";

export const revalidate = 3600;

export default async function Page() {
  const topProjects = await getTopProjects();

  return (
    <>
      <Hero />
      <About />
      <Impact />
      <Work projects={topProjects} />
      <Capabilities />
      <Experience />
      <Education />
      <Contact />
      <Footer />
    </>
  );
}

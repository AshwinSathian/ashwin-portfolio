import About from "@/components/About";
import Contact from "@/components/Contact";
import Education from "@/components/Education";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Highlights from "@/components/Highlights";
import Skills from "@/components/Skills";
import TopProjects from "@/components/TopProjects";
import { getTopProjects } from "@/app/(helpers)/projects";

export const revalidate = 3600;

export default async function Page() {
  const topProjects = await getTopProjects();

  return (
    <main id="main">
      <Hero />
      <About />
      <Highlights />
      <TopProjects projects={topProjects} />
      <Skills />
      <Experience />
      <Education />
      <Contact />
      <Footer />
    </main>
  );
}

import About from "@/components/About";
import Contact from "@/components/Contact";
import Education from "@/components/Education";
import Experience from "@/components/Experience";
import Hero from "@/components/Hero";
import Highlights from "@/components/Highlights";
import Skills from "@/components/Skills";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <main id="main">
      <Hero />
      <About />
      <Highlights />
      <Skills />
      <Experience />
      <Education />
      <Contact />
      <Footer />
    </main>
  );
}

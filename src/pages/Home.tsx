import Hero from "../components/Hero";
import About from "../components/About";
import Work from "../components/Work";
import Projects from "../components/Projects";
import Process from "../components/Process";
import Achievements from "../components/Achievements";
import Contact from "../components/Contact";

/** The landing page: every portfolio section, in page order. */
export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Work />
      <Projects />
      <Process />
      <Achievements />
      <Contact />
    </>
  );
}

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import About from "./components/About";
import Skills from "./components/Skills";
import Work from "./components/Work";
import Process from "./components/Process";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { useRevealOnScroll } from "./hooks/usePortfolio";

export default function App() {
  useRevealOnScroll();

  return (
    <div className="grain relative min-h-screen bg-cream font-body text-ink antialiased">
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Skills />
        <Work />
        <Process />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

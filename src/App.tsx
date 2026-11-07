import { useLayoutEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Work from "./components/Work";
import Process from "./components/Process";
import Achievements from "./components/Achievements";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { SmoothScrollProvider } from "./components/SmoothScroll";

export default function App() {
  // index.html hides the pre-rendered page for motion users until GSAP has set
  // its start states. Layout effects run child-first, so by now every section's
  // useGSAP has run: reveal in the same frame, with no flash of final positions.
  useLayoutEffect(() => {
    document.documentElement.classList.remove("intro-pending");
  }, []);

  return (
    <SmoothScrollProvider>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main" tabIndex={-1}>
        <Hero />
        <About />
        <Work />
        <Process />
        <Achievements />
        <Contact />
      </main>
      <Footer />
    </SmoothScrollProvider>
  );
}

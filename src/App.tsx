import { useLayoutEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import RouteScroll from "./components/RouteScroll";
import { SmoothScrollProvider } from "./components/SmoothScroll";
import { useRouter } from "./lib/router";
import Home from "./pages/Home";
import ProjectPage from "./pages/ProjectPage";
import NotFound from "./pages/NotFound";

export default function App() {
  const { route } = useRouter();

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
        {route.kind === "home" ? (
          <Home />
        ) : route.kind === "project" ? (
          <ProjectPage key={route.project.id} project={route.project} />
        ) : (
          <NotFound />
        )}
      </main>
      <Footer />
      <RouteScroll />
    </SmoothScrollProvider>
  );
}

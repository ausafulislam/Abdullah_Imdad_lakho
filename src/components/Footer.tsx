import { ArrowUp, ExternalLink, Mail } from "lucide-react";
import { useEffect, useState } from "react";

const EMAIL = "abdullah17.imdad@gmail.com";

export default function Footer() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <footer className="border-t border-ink/10 bg-cream">
        <div className="mx-auto max-w-7xl px-5 pb-[calc(2.5rem+env(safe-area-inset-bottom,0px))] pt-12 sm:px-6 sm:pb-12 sm:pt-16 md:px-10">
          <div className="flex flex-col items-center gap-8 text-center md:flex-row md:items-start md:justify-between md:text-left">
            <div>
              <p className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
                ABDULLAH<span className="text-coral">.</span>IMDAD
              </p>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink/45">
                BS Artificial Intelligence at Dawood University of Engineering
                &amp; Technology, Karachi.
              </p>
            </div>

            <a
              href={`mailto:${EMAIL}`}
              className="group inline-flex items-center gap-2.5 rounded-full border border-ink/15 px-5 py-2.5 text-sm text-ink/70 transition-colors hover:border-coral hover:text-coral"
            >
              <Mail className="h-4 w-4 text-ink/40 transition-colors group-hover:text-coral" />
              {EMAIL}
            </a>
          </div>

          <div className="mt-10 flex flex-col items-center gap-4 border-t border-ink/10 pt-6 text-center sm:flex-row sm:justify-between sm:text-left">
            <p className="text-xs text-ink/40">
              &copy; {new Date().getFullYear()} Abdullah Imdad. All rights
              reserved.
            </p>
            <a
              href="https://ausafulislam.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2 text-xs text-ink/60 transition-colors hover:border-coral hover:text-coral"
            >
              <span className="text-ink/40">Built by</span>
              <span className="font-display font-medium text-ink group-hover:text-coral">
                Ausaf
              </span>
              <ExternalLink className="h-3 w-3 opacity-50 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      </footer>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        className={`fixed bottom-5 right-5 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-ink text-cream shadow-xl transition-all duration-300 hover:bg-coral hover:text-ink sm:bottom-6 sm:right-6 sm:h-12 sm:w-12 ${
          show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </>
  );
}

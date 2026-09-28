import { ArrowUp, Mail } from "lucide-react";
import { useEffect, useState } from "react";

export default function Footer() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <footer className="safe-b border-t border-ink/10 bg-cream pb-28 pt-8 sm:py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-5 text-center sm:px-6 md:flex-row md:justify-between md:px-10 md:text-left">
          <p className="font-display text-base font-semibold text-ink sm:text-lg">
            ABDULLAH<span className="text-coral">.</span>IMDAD
          </p>

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {[
              { label: "Interest", href: "#work" },
              { label: "About", href: "#about" },
              { label: "Skills", href: "#services" },
              { label: "Approach", href: "#process" },
              { label: "Contact", href: "#contact" },
            ].map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-ink/50 transition-colors hover:text-coral"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <a
              href="mailto:abdullah17.imdad@gmail.com"
              className="inline-flex items-center gap-2 text-sm text-ink/50 transition-colors hover:text-coral"
            >
              <Mail className="h-4 w-4" /> abdullah17.imdad@gmail.com
            </a>
          </div>
        </div>

        <div className="mx-auto mt-6 max-w-7xl border-t border-ink/10 px-5 pt-6 sm:px-6 md:px-10">
          <p className="text-center text-xs text-ink/40 md:text-left">
            © {new Date().getFullYear()} Abdullah Imdad. Built with care in Karachi, Pakistan.
          </p>
        </div>
      </footer>

      {/* Floating action buttons */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        className={`fixed bottom-24 right-5 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-ink text-cream shadow-xl transition-all duration-300 hover:bg-coral hover:text-ink sm:bottom-6 sm:right-6 sm:h-12 sm:w-12 ${
          show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <ArrowUp className="h-5 w-5" />
      </button>

      {/* Mobile sticky contact bar */}
      <div
        className={`safe-b fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-cream/95 px-4 py-3 backdrop-blur-lg transition-transform duration-300 sm:hidden ${
          show ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex items-center gap-3">
          <a
            href="mailto:abdullah17.imdad@gmail.com"
            className="flex-1 rounded-full border border-ink/20 py-3 text-center font-display text-sm font-medium text-ink"
          >
            Email me
          </a>
          <a
            href="#contact"
            className="flex-1 rounded-full bg-ink py-3 text-center font-display text-sm font-medium text-cream"
          >
            Start a conversation
          </a>
        </div>
      </div>
    </>
  );
}

import { useEffect, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { useBodyLock, useScrollSpy } from "../hooks/usePortfolio";

const links = [
  { href: "#work", label: "Interest", id: "work" },
  { href: "#about", label: "About", id: "about" },
  { href: "#services", label: "Skills", id: "services" },
  { href: "#process", label: "Approach", id: "process" },
  { href: "#testimonials", label: "Awards", id: "testimonials" },
  { href: "#contact", label: "Contact", id: "contact" },
];

const IDS = links.map((l) => l.id);

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const active = useScrollSpy(IDS);
  useBodyLock(open);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 16);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? (window.scrollY / h) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled || open
            ? "bg-cream/85 backdrop-blur-xl shadow-[0_1px_0_rgba(20,18,15,0.10)]"
            : "bg-transparent"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6 md:px-10 md:py-5">
          <a
            href="#top"
            className="font-display text-lg font-semibold tracking-tight text-ink sm:text-xl"
          >
            ABDULLAH<span className="text-coral">.</span>IMDAD
          </a>

          {/* Desktop / large tablet nav */}
          <ul className="hidden items-center gap-6 lg:flex xl:gap-9">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className={`relative font-display text-[0.8rem] font-medium uppercase tracking-wide transition-colors hover:text-coral ${
                    active === l.id ? "text-coral" : "text-ink/70"
                  }`}
                >
                  {l.label}
                  <span
                    className={`absolute -bottom-1.5 left-0 h-[2px] rounded-full bg-coral transition-all duration-300 ${
                      active === l.id ? "w-full" : "w-0"
                    }`}
                  />
                </a>
              </li>
            ))}
          </ul>

          <a
            href="#contact"
            className="group hidden items-center gap-1.5 rounded-full border border-ink/15 bg-ink px-5 py-2.5 font-display text-sm font-medium text-cream transition-colors hover:bg-coral hover:text-ink sm:inline-flex"
          >
            Let's talk
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>

          <button
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors active:bg-ink/5 sm:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

        {/* Scroll progress */}
        <div className="h-[3px] w-full bg-transparent">
          <div
            className="h-full bg-coral transition-[width] duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 sm:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`safe-b absolute inset-x-0 top-0 rounded-b-[2rem] bg-cream px-6 pb-10 pt-24 shadow-2xl transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            open ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <ul className="flex flex-col">
            {links.map((l, i) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  style={{ transitionDelay: open ? `${80 + i * 45}ms` : "0ms" }}
                  className={`flex items-center justify-between border-b border-ink/10 py-4 font-display text-2xl font-medium transition-all duration-500 ${
                    active === l.id ? "text-coral" : "text-ink"
                  } ${open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}
                >
                  {l.label}
                  <ArrowUpRight className="h-5 w-5 text-ink/30" />
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="mt-8 flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-4 font-display text-base font-medium text-cream"
          >
            Start a project <ArrowUpRight className="h-4 w-4" />
          </a>
          <p className="mt-6 text-center text-sm text-ink/50">abdullah17.imdad@gmail.com</p>
        </div>
      </div>
    </>
  );
}

import { useRef } from "react";
import { ArrowUp, ExternalLink, Mail, Phone } from "lucide-react";
import { CONTACT, MAILTO_URL, NAV_LINKS, PROFILE } from "../data/portfolio";
import { useScrolledPast } from "../hooks/usePortfolio";
import { gsap, useGSAP, MOTION_OK } from "../lib/gsap";
import { useSmoothScroll } from "./SmoothScroll";
import { useRouter, useSectionHref } from "../lib/router";
import { LinkedInIcon } from "./icons";
import { cn } from "../utils/cn";

const SOCIALS = [
  { label: "LinkedIn", href: CONTACT.linkedin, external: true, Icon: LinkedInIcon },
  { label: "Email", href: MAILTO_URL, external: false, Icon: Mail },
  { label: "Phone", href: CONTACT.phoneHref, external: false, Icon: Phone },
];

export default function Footer() {
  const showBackToTop = useScrolledPast(700);
  const { scrollTo } = useSmoothScroll();
  const { route } = useRouter();
  const sectionHref = useSectionHref();
  const footerRef = useRef<HTMLElement>(null);

  // The oversized name rises out of the bottom edge once (it stays fully visible
  // without JavaScript and for reduced motion).
  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.from("[data-footer='word']", {
          yPercent: 28,
          opacity: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: { trigger: "[data-footer='mark']", start: "top bottom", once: true },
        });
      });
    },
    { scope: footerRef },
  );

  return (
    <>
      <footer ref={footerRef} className="border-t border-line pb-[env(safe-area-inset-bottom,0px)]">
        <div className="shell pt-10 sm:pt-12">
          <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center">
            <a href={route.kind === "home" ? "#top" : "/"} className="flex w-fit items-center gap-4 rounded-md">
              <img src="/logo.svg" alt="" width={252} height={183} className="h-7 w-auto" />
              <span>
                <span className="block text-base font-semibold tracking-[-0.015em]">{PROFILE.name}</span>
                <span className="block text-[0.8125rem] text-muted">{PROFILE.title}</span>
              </span>
            </a>

            <nav aria-label="Footer">
              <ul className="flex flex-wrap gap-x-7 gap-y-2">
                {NAV_LINKS.map((link) => (
                  <li key={link.id}>
                    <a
                      href={sectionHref(link.href)}
                      className="text-sm font-medium text-[#4d4d4d] transition-colors hover:text-ink"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <ul className="flex gap-2 lg:justify-end">
              {SOCIALS.map(({ label, href, external, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    aria-label={external ? `${label} (opens in a new tab)` : label}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-ink"
                  >
                    <Icon className="h-[1.125rem] w-[1.125rem]" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex flex-col gap-4 border-t border-line pt-6 text-[0.8125rem] sm:flex-row sm:items-center sm:justify-between">
            {/* The year is rendered at build time and refreshed on hydration. */}
            <p className="text-muted" suppressHydrationWarning>
              &copy; {new Date().getFullYear()} {PROFILE.name}. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <a
                href="https://ausafulislam.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 text-muted transition-colors hover:text-ink"
              >
                Built by <span className="font-semibold text-ink">Ausaf</span>
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
              <p className="inline-flex items-center gap-3 font-medium text-ink">
                <span aria-hidden="true" className="h-[2px] w-8 rounded-full bg-lime" />
                Build. Learn. Grow.
              </p>
            </div>
          </div>
        </div>

        {/* Oversized first name, bottom-aligned and slightly cropped by the page edge.
            Decorative: the full name is already in the footer above. */}
        <div data-footer="mark" aria-hidden="true" className="footer-mark shell mt-10 sm:mt-14">
          <span data-footer="word" className="footer-word">
            {PROFILE.firstName}
          </span>
        </div>
      </footer>

      <button
        type="button"
        onClick={() => scrollTo(0)}
        aria-label="Back to top"
        tabIndex={showBackToTop ? 0 : -1}
        className={cn(
          "fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-ink shadow-[0_8px_24px_-12px_rgb(0_0_0/0.25)] transition-[opacity,translate,background-color,border-color] duration-300 hover:border-lime hover:bg-lime sm:bottom-6 sm:right-6",
          showBackToTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
        )}
      >
        <ArrowUp className="h-[1.125rem] w-[1.125rem]" aria-hidden="true" />
      </button>
    </>
  );
}

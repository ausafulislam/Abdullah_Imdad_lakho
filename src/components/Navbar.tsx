import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { useActiveSection, useScrolledPast } from "../hooks/usePortfolio";
import { CONTACT, NAV_ALIAS, NAV_LINKS, SPY_SECTIONS } from "../data/portfolio";
import { gsap, useGSAP, MOTION_OK } from "../lib/gsap";
import { useSmoothScroll } from "./SmoothScroll";
import { cn } from "../utils/cn";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const scrolled = useScrolledPast(8);
  const spied = useActiveSection(SPY_SECTIONS);
  const active = NAV_ALIAS[spied] ?? spied;
  const { setLocked } = useSmoothScroll();

  const navRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null);
  const menuId = useId();

  // ---- Entrance (first beat of the hero sequence) ----
  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.from(navRef.current, { y: -14, opacity: 0, duration: 0.7, delay: 0.1, ease: "power2.out" });
      });
    },
    { scope: navRef },
  );

  // ---- Sliding active indicator ----
  const [indicator, setIndicator] = useState<{ x: number; w: number } | null>(null);
  const hasPositioned = useRef(false);

  useLayoutEffect(() => {
    const update = () => {
      const link = listRef.current?.querySelector<HTMLElement>(`[data-nav-id="${active}"]`);
      if (!link || link.offsetWidth === 0) return; // hidden on mobile
      setIndicator({ x: link.offsetLeft, w: link.offsetWidth });
    };
    update();
    let cancelled = false;
    document.fonts?.ready.then(() => !cancelled && update());
    window.addEventListener("resize", update);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", update);
    };
  }, [active]);

  useEffect(() => {
    if (indicator) hasPositioned.current = true;
  }, [indicator]);

  // ---- Mobile menu: scroll lock, Escape, focus, auto-close on desktop ----
  useEffect(() => {
    setLocked(open);
    if (!open) return;

    firstMobileLinkRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    const desktop = window.matchMedia("(min-width: 48rem)");
    const onBreakpoint = () => desktop.matches && setOpen(false);

    document.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onBreakpoint);
    return () => {
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onBreakpoint);
      setLocked(false);
    };
  }, [open, setLocked]);

  const close = () => setOpen(false);
  const solid = scrolled || open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-300",
        solid ? "border-line bg-white" : "border-transparent bg-transparent",
      )}
    >
      <nav
        ref={navRef}
        aria-label="Primary"
        className="shell grid h-[var(--header-h)] grid-cols-[1fr_auto] items-center md:grid-cols-[1fr_auto_1fr]"
      >
        <a href="#top" className="-m-2 inline-flex w-fit items-center rounded-md p-2">
          <img
            src="/logo.svg"
            alt="Abdullah Imdad Lakho, home"
            width={252}
            height={183}
            className="h-[1.4rem] w-auto md:h-6"
          />
        </a>

        {/* Desktop links */}
        <ul ref={listRef} className="relative hidden items-center md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = active === link.id;
            return (
              <li key={link.id}>
                <a
                  href={link.href}
                  data-nav-id={link.id}
                  aria-current={isActive ? "location" : undefined}
                  className={cn(
                    "block rounded-md px-3 py-2.5 text-sm font-medium transition-colors lg:px-4",
                    isActive ? "text-ink" : "text-[#4d4d4d] hover:text-ink",
                  )}
                >
                  {link.label}
                </a>
              </li>
            );
          })}
          {indicator && (
            <span
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute bottom-0 left-0 h-[2px] rounded-full bg-lime",
                hasPositioned.current && "transition-[transform,width] duration-500 ease-[var(--ease-out-expo)]",
              )}
              style={{ width: indicator.w, transform: `translateX(${indicator.x}px)` }}
            />
          )}
        </ul>

        <div className="flex items-center justify-end gap-2">
          <a href="#contact" onClick={close} className="btn btn-dark btn-sm">
            Let&apos;s Talk
            <ArrowRight className="btn-arrow h-4 w-4" aria-hidden="true" />
          </a>
          <button
            ref={toggleRef}
            type="button"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-mist md:hidden"
          >
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 top-[var(--header-h)] bg-black/25 transition-opacity duration-300 md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden="true"
        onClick={close}
      />
      <div
        id={menuId}
        className={cn(
          "absolute inset-x-0 top-full border-b border-line bg-white shadow-[0_12px_24px_-12px_rgb(0_0_0/0.12)] duration-300 ease-[var(--ease-out-expo)] md:hidden",
          // Opening doesn't transition `visibility`, so the panel is focusable at once
          // (the first link receives focus); closing keeps it visible until the fade ends.
          open
            ? "visible translate-y-0 opacity-100 transition-[opacity,transform]"
            : "invisible -translate-y-2 opacity-0 transition-[opacity,transform,visibility]",
        )}
      >
        <div className="shell pb-6 pt-2">
          <ul>
            {NAV_LINKS.map((link, i) => {
              const isActive = active === link.id;
              return (
                <li key={link.id} className="border-b border-line">
                  <a
                    ref={i === 0 ? firstMobileLinkRef : undefined}
                    href={link.href}
                    onClick={close}
                    aria-current={isActive ? "location" : undefined}
                    className="flex items-center justify-between py-3.5 text-base font-semibold text-ink"
                  >
                    {link.label}
                    <span
                      aria-hidden="true"
                      className={cn("h-2 w-2 rounded-full", isActive ? "bg-lime" : "bg-transparent")}
                    />
                  </a>
                </li>
              );
            })}
          </ul>
          <a
            href={`mailto:${CONTACT.email}`}
            className="mt-5 block text-center text-sm text-muted transition-colors hover:text-ink"
          >
            {CONTACT.email}
          </a>
        </div>
      </div>
    </header>
  );
}

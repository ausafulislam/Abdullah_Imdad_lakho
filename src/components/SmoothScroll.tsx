import { createContext, useCallback, useContext, useEffect, useMemo, useRef, type ReactNode } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap, ScrollTrigger, REDUCED_MOTION } from "../lib/gsap";
import { useMediaQuery } from "../hooks/usePortfolio";

type ScrollTarget = Element | number;

type SmoothScrollApi = {
  /** Smoothly scroll to an element (respecting the navbar offset) or a pixel value. */
  scrollTo: (target: ScrollTarget, options?: { immediate?: boolean }) => void;
  /** Freeze page scrolling, e.g. while the mobile menu is open. */
  setLocked: (locked: boolean) => void;
};

const SmoothScrollContext = createContext<SmoothScrollApi | null>(null);

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

function resolveHash(hash: string): HTMLElement | null {
  const id = decodeURIComponent(hash.replace(/^#/, ""));
  return document.getElementById(id || "top");
}

/**
 * Owns the page's single Lenis instance and keeps it in lockstep with GSAP:
 * Lenis is advanced from gsap.ticker (one RAF loop for everything) and every
 * Lenis scroll event updates ScrollTrigger. Also owns in-page anchor
 * navigation so there is exactly one smooth-scroll mechanism on the page.
 *
 * With prefers-reduced-motion, Lenis is not created at all and the page uses
 * plain native scrolling with instant jumps.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const lockedRef = useRef(false);
  const reducedMotion = useMediaQuery(REDUCED_MOTION);
  const reducedRef = useRef(reducedMotion);
  reducedRef.current = reducedMotion;

  // ---- Lenis lifecycle -------------------------------------------------
  useEffect(() => {
    if (reducedMotion) return;

    const lenis = new Lenis({ autoRaf: false, lerp: 0.1 });
    lenisRef.current = lenis;
    if (lockedRef.current) lenis.stop();

    const offScroll = lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      offScroll();
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33); // GSAP default
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reducedMotion]);

  const setLocked = useCallback((locked: boolean) => {
    lockedRef.current = locked;
    const lenis = lenisRef.current;
    if (lenis) {
      if (locked) lenis.stop();
      else lenis.start();
    }
    document.documentElement.style.overflow = locked ? "hidden" : "";
  }, []);

  const scrollTo = useCallback(
    (target: ScrollTarget, { immediate = false }: { immediate?: boolean } = {}) => {
      // Navigation always wins over a scroll lock (e.g. a link inside the open menu).
      if (lockedRef.current) setLocked(false);

      const lenis = lenisRef.current;
      if (lenis) {
        // Instant jumps follow route changes: measure the new page first, or Lenis
        // would clamp the target to the previous page's height.
        if (immediate) lenis.resize();
        lenis.scrollTo(target, { duration: 1.15, easing: easeOutExpo, immediate, force: true });
        return;
      }
      const behavior: ScrollBehavior = immediate || reducedRef.current ? "auto" : "smooth";
      if (typeof target === "number") window.scrollTo({ top: target, behavior });
      else target.scrollIntoView({ behavior, block: "start" });
    },
    [setLocked],
  );

  // ---- In-page anchor links (delegated, works for every a[href^="#"]) ----
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const link = (event.target as Element | null)?.closest?.('a[href^="#"]');
      if (!link) return;
      const hash = link.getAttribute("href") ?? "#";
      const target = resolveHash(hash);
      if (!target) return;

      event.preventDefault();
      scrollTo(target);
      if (window.location.hash !== hash) window.history.pushState(null, "", hash);
      // Move focus to the destination (without a second scroll) so keyboard and
      // screen-reader users continue from the section they jumped to.
      if (target.tabIndex < 0 && !target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [scrollTo]);

  // ---- Keep ScrollTrigger positions true when the page height changes -------
  // ScrollTrigger re-measures on window resize, not when content grows or
  // shrinks (a route change, tasks added in a project app, an error message).
  // Stale start positions could leave a once-only reveal, such as the footer
  // name, waiting below the end of the page.
  useEffect(() => {
    if (typeof ResizeObserver === "undefined") return;
    let height = document.body.offsetHeight;
    let timer = 0;
    const observer = new ResizeObserver(() => {
      const next = document.body.offsetHeight;
      if (Math.abs(next - height) < 2) return;
      height = next;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 150);
    });
    observer.observe(document.body);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  // ---- Deep links (/#contact) and post-font-load refresh ----------------
  useEffect(() => {
    let cancelled = false;
    const fontsReady = document.fonts?.ready ?? Promise.resolve();

    fontsReady.then(() => {
      if (cancelled) return;
      ScrollTrigger.refresh();
      const target = window.location.hash.length > 1 ? resolveHash(window.location.hash) : null;
      if (target) requestAnimationFrame(() => scrollTo(target, { immediate: true }));
    });

    return () => {
      cancelled = true;
    };
  }, [scrollTo]);

  const api = useMemo(() => ({ scrollTo, setLocked }), [scrollTo, setLocked]);

  return <SmoothScrollContext.Provider value={api}>{children}</SmoothScrollContext.Provider>;
}

export function useSmoothScroll() {
  const ctx = useContext(SmoothScrollContext);
  if (!ctx) throw new Error("useSmoothScroll must be used inside <SmoothScrollProvider>");
  return ctx;
}

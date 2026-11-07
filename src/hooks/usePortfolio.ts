import { useEffect, useState } from "react";

/** Media query hook, initialised synchronously so the first render is correct. */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false,
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = () => setMatches(mql.matches);
    handler();
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

/** Runs `measure` at most once per frame on scroll/resize (Lenis drives native scroll, so this stays in sync). */
function useFrameThrottledScroll(measure: () => void, deps: unknown[]) {
  useEffect(() => {
    let frame = 0;
    const run = () => {
      frame = 0;
      measure();
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(run);
    };
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, deps);
}

/**
 * Scroll-spy: returns the id of the section that currently crosses a line
 * ~35% down the viewport. At the very bottom of the page the last section wins,
 * so short final sections still get highlighted.
 */
export function useActiveSection<T extends string>(ids: readonly T[], lineRatio = 0.35): T {
  const [active, setActive] = useState<T>(ids[0]);

  useFrameThrottledScroll(() => {
    const line = window.innerHeight * lineRatio;
    let current = ids[0];
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= line) current = id;
    }
    const doc = document.documentElement;
    if (window.innerHeight + window.scrollY >= doc.scrollHeight - 2) current = ids[ids.length - 1];
    setActive(current);
  }, [ids, lineRatio]);

  return active;
}

/** True once the page has scrolled past `threshold` pixels. */
export function useScrolledPast(threshold: number) {
  const [past, setPast] = useState(false);
  useFrameThrottledScroll(() => setPast(window.scrollY > threshold), [threshold]);
  return past;
}

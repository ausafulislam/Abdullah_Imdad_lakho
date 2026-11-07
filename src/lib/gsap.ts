/**
 * The one place GSAP is configured. Import gsap / ScrollTrigger / useGSAP from
 * here (never straight from the packages) so plugins are registered exactly
 * once, before any component animates.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

gsap.defaults({ ease: "power3.out", duration: 0.8 });

// Mobile browsers resize the viewport when the address bar shows/hides. Those
// height-only changes shouldn't trigger a full refresh (it causes jumps).
ScrollTrigger.config({ ignoreMobileResize: true });

/** Wrap every animation in gsap.matchMedia().add(MOTION_OK, …) */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
export const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/** Shared reveal settings so every section feels the same. */
export const REVEAL = { y: 24, opacity: 0, duration: 0.8, ease: "power3.out" } as const;
export const REVEAL_START = "top 82%";

/**
 * Staggered reveal for repeated items (cards, rows) using ScrollTrigger.batch:
 * items that enter together animate together; each trigger fires once.
 * Call inside a useGSAP/matchMedia callback and pass its `contextSafe` so the
 * tweens created later (on enter) are still reverted on cleanup.
 */
export function batchReveal(
  targets: gsap.DOMTarget,
  contextSafe: gsap.ContextSafeFunc | undefined,
  { start = "top 88%", y = 24, stagger = 0.08 }: { start?: string; y?: number; stagger?: number } = {},
) {
  const items = gsap.utils.toArray<HTMLElement>(targets);
  if (!items.length) return;
  gsap.set(items, { opacity: 0, y });
  const show = (batch: Element[]) =>
    gsap.to(batch, { opacity: 1, y: 0, duration: 0.7, stagger, ease: "power3.out", overwrite: true });
  const safeShow = (contextSafe ? contextSafe(show) : show) as typeof show;
  ScrollTrigger.batch(items, { start, once: true, onEnter: (batch) => safeShow(batch) });
}

if (import.meta.env.DEV) {
  // Handy for debugging in the console: ScrollTrigger.getAll().length, etc.
  Object.assign(window, { gsap, ScrollTrigger });
}

export { gsap, ScrollTrigger, useGSAP };

import { useLayoutEffect } from "react";
import { useRouter } from "../lib/router";
import { ScrollTrigger } from "../lib/gsap";
import { useSmoothScroll } from "./SmoothScroll";

/**
 * Scroll and focus handling after in-app navigation. Rendered after <main>, so
 * this layout effect runs once the new page (and its GSAP setup) is in the DOM
 * and before the browser paints it.
 *
 * - Link to another page: jump to its #section, or to the top.
 * - Same-page "/#section" link: smooth-scroll there.
 * - Back/Forward: restore the position saved for that history entry.
 * - Focus moves to the destination, as it would after a full page load.
 */
export default function RouteScroll() {
  const { location } = useRouter();
  const { scrollTo } = useSmoothScroll();

  useLayoutEffect(() => {
    if (location.action === "load") return; // first paint: the browser and SmoothScrollProvider handle it
    const pageChanged = location.from !== location.path;

    // Elements that stay mounted (the footer) moved with the new page: re-measure.
    if (pageChanged) ScrollTrigger.refresh();

    if (location.action === "pop" && location.scrollY !== undefined) {
      scrollTo(location.scrollY, { immediate: true });
      return;
    }

    const id = location.hash.length > 1 ? decodeURIComponent(location.hash.slice(1)) : "";
    const target = id ? document.getElementById(id) : null;
    scrollTo(target ?? 0, { immediate: pageChanged });

    if (location.action !== "push") return;
    const focusTarget = target ?? document.querySelector<HTMLElement>("#main h1") ?? document.getElementById("main");
    if (!focusTarget) return;
    if (!focusTarget.hasAttribute("tabindex")) focusTarget.setAttribute("tabindex", "-1");
    focusTarget.focus({ preventScroll: true });
    // Only when a navigation happens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);

  return null;
}

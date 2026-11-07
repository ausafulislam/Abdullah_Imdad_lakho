/**
 * A small History API router for the portfolio's few routes ("/" and
 * "/projects/<id>"), so there is no extra dependency.
 *
 * - Every route is also pre-rendered to its own HTML file at build time, so
 *   direct visits and reloads work without any server rewrites.
 * - Same-origin clicks on <a href> that point at a known route are handled
 *   in-app; everything else (files, external links, new-tab clicks) is left to
 *   the browser. Same-page "#section" links stay with SmoothScrollProvider.
 * - Scroll positions are stored per history entry, so Back returns to the
 *   exact spot (see RouteScroll.tsx).
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { isAppPath, matchRoute, normalizePath, pageMeta, type PageMeta, type Route } from "../data/routes";

export type RouterLocation = {
  path: string;
  hash: string;
  /** Changes on every in-app navigation. */
  key: number;
  action: "load" | "push" | "pop";
  /** The path before this navigation. */
  from: string;
  /** Scroll position saved for this history entry (Back/Forward). */
  scrollY?: number;
};

type RouterValue = {
  location: RouterLocation;
  route: Route;
  navigate: (to: string, options?: { replace?: boolean }) => void;
};

const RouterContext = createContext<RouterValue | null>(null);

function savedScroll(state: unknown): number | undefined {
  const y = (state as { scrollY?: unknown } | null)?.scrollY;
  return typeof y === "number" && Number.isFinite(y) ? y : undefined;
}

function applyPageMeta(meta: PageMeta) {
  document.title = meta.title;
  const set = (selector: string, attribute: string, value: string) =>
    document.head.querySelector(selector)?.setAttribute(attribute, value);
  set('meta[name="description"]', "content", meta.description);
  set('link[rel="canonical"]', "href", meta.url);
  set('meta[property="og:url"]', "content", meta.url);
  set('meta[property="og:title"]', "content", meta.title);
  set('meta[property="og:description"]', "content", meta.description);
  set('meta[name="twitter:title"]', "content", meta.title);
  set('meta[name="twitter:description"]', "content", meta.description);
}

/**
 * @param initialPath Used by the build-time renderer; in the browser the
 *   current URL is read instead.
 */
export function RouterProvider({ initialPath, children }: { initialPath?: string; children: ReactNode }) {
  const [location, setLocation] = useState<RouterLocation>(() => {
    const inBrowser = typeof window !== "undefined" && initialPath === undefined;
    const path = normalizePath(inBrowser ? window.location.pathname : (initialPath ?? "/"));
    return { path, hash: inBrowser ? window.location.hash : "", key: 0, action: "load", from: path };
  });
  const keyRef = useRef(0);
  const pathRef = useRef(location.path);
  pathRef.current = location.path;

  const navigate = useCallback((to: string, { replace = false }: { replace?: boolean } = {}) => {
    const url = new URL(to, window.location.href);
    const path = normalizePath(url.pathname);
    const from = pathRef.current;
    const href = `${path}${url.search}${url.hash}`;
    // Remember how far the current entry was scrolled, for Back.
    window.history.replaceState({ ...(window.history.state ?? {}), scrollY: window.scrollY }, "");
    // Re-visiting the current page without a hash shouldn't stack history entries.
    if (replace || (path === from && !url.hash)) window.history.replaceState(null, "", href);
    else window.history.pushState(null, "", href);
    keyRef.current += 1;
    setLocation({ path, hash: url.hash, key: keyRef.current, action: "push", from });
  }, []);

  // Back / Forward between routes. Rendered synchronously so RouteScroll can
  // restore the saved position before the browser paints.
  useEffect(() => {
    const onPopState = (event: PopStateEvent) => {
      const path = normalizePath(window.location.pathname);
      // Hash-only steps on the same page keep the browser's native behaviour.
      if (path === pathRef.current) return;
      keyRef.current += 1;
      const next: RouterLocation = {
        path,
        hash: window.location.hash,
        key: keyRef.current,
        action: "pop",
        from: pathRef.current,
        scrollY: savedScroll(event.state),
      };
      flushSync(() => setLocation(next));
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // In-app links: plain <a href="/projects/…"> anywhere on the page.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement)) return;
      if ((link.target && link.target !== "_self") || link.hasAttribute("download")) return;
      if ((link.getAttribute("href") ?? "").startsWith("#")) return; // SmoothScrollProvider
      const url = new URL(link.href);
      if (url.origin !== window.location.origin || !isAppPath(url.pathname)) return;
      event.preventDefault();
      navigate(url.href);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [navigate]);

  const route = useMemo(() => matchRoute(location.path), [location.path]);

  useEffect(() => {
    const meta = pageMeta(route);
    // On first load the pre-rendered <head> already matches, unless the host
    // served another route's HTML for this URL (an SPA fallback, the dev server).
    if (location.action !== "load" || document.title !== meta.title) applyPageMeta(meta);
    // Only when the page itself changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route]);

  const value = useMemo(() => ({ location, route, navigate }), [location, route, navigate]);
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error("useRouter must be used inside <RouterProvider>");
  return ctx;
}

/** Link target for a home-page section from any route: "#about" on the home page, "/#about" elsewhere. */
export function useSectionHref() {
  const { route } = useRouter();
  const onHome = route.kind === "home";
  return useCallback((hash: `#${string}`) => (onHome ? hash : `/${hash}`), [onHome]);
}

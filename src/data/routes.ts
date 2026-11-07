/**
 * Routes and per-page metadata used at runtime by the client router.
 *
 * The home page's <head> lives in index.html (hand-written). Project pages get
 * their own <head> at build time (see pageHead.ts), and the router updates the
 * title, description and canonical URL when navigating inside the app.
 */
import { PROFILE } from "./portfolio";
import { getProject, type Project } from "./projects";

export const SITE_URL = PROFILE.siteUrl;

export const HOME_META = {
  title: "Abdullah Imdad Lakho | BS Artificial Intelligence Student at DUET Karachi",
  description:
    "Explore the academic journey, technical interests, programming skills, achievements, and learning progress of Abdullah Imdad Lakho, a BS Artificial Intelligence student at DUET Karachi.",
} as const;

export type Route = { kind: "home" } | { kind: "project"; project: Project } | { kind: "not-found" };

/** "/projects/task-manager/", "/index.html", "/projects/task-manager.html" → canonical path. */
export function normalizePath(pathname: string): string {
  const path = pathname
    .replace(/\/{2,}/g, "/")
    .replace(/\/index\.html$/i, "/")
    .replace(/\.html$/i, "")
    .replace(/\/+$/, "");
  return path || "/";
}

export function matchRoute(pathname: string): Route {
  const path = normalizePath(pathname);
  if (path === "/") return { kind: "home" };
  const match = /^\/projects\/([a-z0-9-]+)$/.exec(path);
  const project = match ? getProject(match[1]) : undefined;
  return project ? { kind: "project", project } : { kind: "not-found" };
}

/** Paths the client router handles without a full page load. */
export function isAppPath(pathname: string): boolean {
  return matchRoute(pathname).kind !== "not-found";
}

export type PageMeta = { title: string; description: string; url: string };

export function pageMeta(route: Route): PageMeta {
  if (route.kind === "project") {
    return { ...route.project.seo, url: `${SITE_URL}${route.project.path}` };
  }
  if (route.kind === "not-found") {
    return { title: `Page not found | ${PROFILE.name}`, description: HOME_META.description, url: `${SITE_URL}/` };
  }
  return { ...HOME_META, url: `${SITE_URL}/` };
}

/**
 * Build-time <head> for the project pages. Imported only by src/entry-server.tsx
 * (the pre-render step in vite.config.ts), so none of this ships to browsers.
 */
import { PROFILE } from "./portfolio";
import { PROJECTS, type Project } from "./projects";
import { SITE_URL } from "./routes";

const OG_IMAGE = `${SITE_URL}/images/og-image.png?v=4`;
const OG_IMAGE_ALT = "Abdullah Imdad Lakho, BS Artificial Intelligence student at DUET Karachi";

const escapeAttr = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** JSON inside <script> must never contain "</script>" or "<!--". */
const safeJson = (value: unknown) => JSON.stringify(value, null, 2).replace(/</g, "\\u003c");

function projectJsonLd(project: Project) {
  const url = `${SITE_URL}${project.path}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: project.seo.title,
        description: project.seo.description,
        inLanguage: "en",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        author: { "@id": `${SITE_URL}/#person` },
        breadcrumb: { "@id": `${url}#breadcrumb` },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: PROFILE.name,
      },
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: PROFILE.name,
        url: `${SITE_URL}/`,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Projects", item: `${SITE_URL}/#projects` },
          { "@type": "ListItem", position: 3, name: project.name, item: url },
        ],
      },
    ],
  };
}

/** Replacement content for the marked regions in index.html (see vite.config.ts). */
export type HeadRegions = { meta: string; preload: string; jsonld: string };

function projectHead(project: Project): HeadRegions {
  const url = `${SITE_URL}${project.path}`;
  const { title, description } = project.seo;
  const tag = (html: string) => `    ${html}`;
  const meta = [
    `<title>${escapeAttr(title)}</title>`,
    `<meta name="description" content="${escapeAttr(description)}" />`,
    `<meta name="author" content="${escapeAttr(PROFILE.name)}" />`,
    `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${escapeAttr(PROFILE.name)}" />`,
    `<meta property="og:locale" content="en_US" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${escapeAttr(title)}" />`,
    `<meta property="og:description" content="${escapeAttr(description)}" />`,
    `<meta property="og:image" content="${OG_IMAGE}" />`,
    `<meta property="og:image:type" content="image/png" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${escapeAttr(OG_IMAGE_ALT)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeAttr(title)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(description)}" />`,
    `<meta name="twitter:image" content="${OG_IMAGE}" />`,
    `<meta name="twitter:image:alt" content="${escapeAttr(OG_IMAGE_ALT)}" />`,
  ]
    .map(tag)
    .join("\n");
  const jsonld = tag(`<script type="application/ld+json">\n${safeJson(projectJsonLd(project))}\n    </script>`);
  // Project pages have no hero portrait, so the home page's image preload is dropped.
  return { meta: `\n${meta}\n    `, preload: "\n    ", jsonld: `\n${jsonld}\n    ` };
}

export type PrerenderRoute = {
  path: string;
  /** Output file, relative to dist/. Served at the clean URL (see vercel.json). */
  file: string;
  /** null keeps index.html's own <head> (the home page). */
  head: HeadRegions | null;
};

export const PRERENDER_ROUTES: PrerenderRoute[] = [
  { path: "/", file: "index.html", head: null },
  ...PROJECTS.map((project) => ({
    path: project.path,
    file: `${project.path.slice(1)}.html`,
    head: projectHead(project),
  })),
];

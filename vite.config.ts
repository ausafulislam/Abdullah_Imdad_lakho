import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { build, defineConfig, type Plugin } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_MARKER = '<div id="root"></div>';
const HEAD_REGIONS = ["meta", "preload", "jsonld"] as const;

type HeadRegions = Record<(typeof HEAD_REGIONS)[number], string>;
type PrerenderRoute = { path: string; file: string; head: HeadRegions | null };

/**
 * Replaces each `<!-- head:<name>:start --> … <!-- head:<name>:end -->` region
 * of index.html: with the route's own tags, or (home page) with what was there.
 * The markers themselves are removed from the output.
 */
function applyHead(html: string, head: HeadRegions | null): string {
  let out = html;
  for (const name of HEAD_REGIONS) {
    const start = `<!-- head:${name}:start -->`;
    const end = `<!-- head:${name}:end -->`;
    const from = out.indexOf(start);
    const to = out.indexOf(end);
    if (from === -1 || to === -1 || to < from) throw new Error(`[prerender] head region "${name}" not found in index.html`);
    const inner = head ? head[name] : out.slice(from + start.length, to);
    out = out.slice(0, from) + inner.trim() + out.slice(to + end.length);
  }
  // Drop the blank line a removed region leaves behind.
  return out.replace(/\n[ \t]*\n([ \t]*\n)+/g, "\n\n");
}

/**
 * Static pre-rendering (no extra dependencies).
 *
 * After the client build has written dist/index.html, this renders every route
 * in PRERENDER_ROUTES (src/data/routes.ts) with React's server renderer: the
 * home page into dist/index.html and each project page into
 * dist/projects/<id>.html, with its own title, description, canonical URL,
 * social tags and structured data. Crawlers and AI tools that don't run
 * JavaScript receive the full page content, direct visits to any route get a
 * real page, and the browser hydrates that markup (see src/main.tsx). It runs
 * as part of `vite build`, so it works with any build command.
 */
function prerender(): Plugin {
  let outDir = "";
  return {
    name: "portfolio:prerender",
    apply: (_config, env) => env.command === "build" && !env.isSsrBuild,
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    async closeBundle() {
      const ssrDir = path.resolve(__dirname, "dist-ssr");
      await build({
        configFile: path.resolve(__dirname, "vite.config.ts"),
        logLevel: "warn",
        build: { ssr: "src/entry-server.tsx", outDir: ssrDir, emptyOutDir: true, copyPublicDir: false },
      });
      try {
        const { render, PRERENDER_ROUTES } = (await import(pathToFileURL(path.join(ssrDir, "entry-server.js")).href)) as {
          render: (path: string) => string;
          PRERENDER_ROUTES: PrerenderRoute[];
        };
        const template = await readFile(path.join(outDir, "index.html"), "utf8");
        if (!template.includes(ROOT_MARKER)) throw new Error(`[prerender] ${ROOT_MARKER} not found in index.html`);

        for (const route of PRERENDER_ROUTES) {
          const appHtml = render(route.path);
          if (!appHtml) throw new Error(`[prerender] ${route.path} rendered no HTML`);
          const html = applyHead(template, route.head);
          const at = html.lastIndexOf(ROOT_MARKER);
          const out =
            html.slice(0, at) +
            `<div id="root" data-route="${route.path}">${appHtml}</div>` +
            html.slice(at + ROOT_MARKER.length);
          const file = path.join(outDir, route.file);
          await mkdir(path.dirname(file), { recursive: true });
          await writeFile(file, out);
          console.log(`[prerender] ${route.path} → dist/${route.file} (${(appHtml.length / 1024).toFixed(1)} kB of HTML)`);
        }
      } finally {
        await rm(ssrDir, { recursive: true, force: true });
      }
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  // The client build is a single self-contained index.html (JS and CSS inlined);
  // the server build only exists for pre-rendering and stays a plain module.
  plugins: [react(), tailwindcss(), ...(isSsrBuild ? [] : [viteSingleFile(), prerender()])],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  ssr: {
    // Bundle these into the server build: GSAP ships ESM files without "type": "module".
    noExternal: ["gsap", "@gsap/react", "lenis"],
  },
}));

import { readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { build, defineConfig, type Plugin } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_MARKER = '<div id="root"></div>';

/**
 * Static pre-rendering (no extra dependencies).
 *
 * After the client build has written dist/index.html, this renders <App /> to
 * HTML with React's server renderer and places it inside #root. Crawlers and
 * AI tools that don't run JavaScript then receive the full page content, and
 * the browser hydrates that markup instead of building it from scratch
 * (see src/main.tsx). It runs as part of `vite build`, so it works no matter
 * which build command the hosting platform is configured with.
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
        const { render } = (await import(pathToFileURL(path.join(ssrDir, "entry-server.js")).href)) as {
          render: () => string;
        };
        const appHtml = render();
        const file = path.join(outDir, "index.html");
        const html = await readFile(file, "utf8");
        const at = html.lastIndexOf(ROOT_MARKER);
        if (at === -1 || !appHtml) throw new Error(`[prerender] ${ROOT_MARKER} not found in index.html`);
        const out = html.slice(0, at) + `<div id="root">${appHtml}</div>` + html.slice(at + ROOT_MARKER.length);
        await writeFile(file, out);
        console.log(`[prerender] dist/index.html now ships ${(appHtml.length / 1024).toFixed(1)} kB of rendered HTML`);
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

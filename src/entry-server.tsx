/**
 * Build-time entry used only by the pre-render step in vite.config.ts.
 * It renders the same tree as src/main.tsx for a given route, so the browser
 * can hydrate the generated HTML without mismatches.
 */
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { RouterProvider } from "./lib/router";

export { PRERENDER_ROUTES } from "./data/pageHead";

export function render(path: string): string {
  return renderToString(
    <StrictMode>
      <ErrorBoundary>
        <RouterProvider initialPath={path}>
          <App />
        </RouterProvider>
      </ErrorBoundary>
    </StrictMode>,
  );
}

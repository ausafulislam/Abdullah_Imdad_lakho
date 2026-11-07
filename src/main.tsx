import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { RouterProvider } from "./lib/router";
import { normalizePath } from "./data/routes";

const container = document.getElementById("root")!;
const app = (
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider>
        <App />
      </RouterProvider>
    </ErrorBoundary>
  </StrictMode>
);

// Production HTML is pre-rendered at build time for every route (see
// vite.config.ts), so React attaches to the existing markup. #root records which
// route that markup belongs to: if a host serves it for a different URL (an SPA
// fallback, a trailing slash), render fresh instead of hydrating mismatched HTML.
// The dev server serves an empty #root.
const prerendered = container.dataset.route;
if (container.firstElementChild && prerendered === normalizePath(window.location.pathname)) {
  hydrateRoot(container, app);
} else {
  container.replaceChildren();
  createRoot(container).render(app);
}

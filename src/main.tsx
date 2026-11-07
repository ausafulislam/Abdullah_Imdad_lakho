import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { ErrorBoundary } from "./components/ErrorBoundary";

const container = document.getElementById("root")!;
const app = (
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);

// Production HTML is pre-rendered at build time (see vite.config.ts), so React
// attaches to the existing markup. The dev server serves an empty #root.
if (container.firstElementChild) hydrateRoot(container, app);
else createRoot(container).render(app);

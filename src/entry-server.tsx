/**
 * Build-time entry used only by the pre-render step in vite.config.ts.
 * It renders the same tree as src/main.tsx, so the browser can hydrate the
 * generated HTML without mismatches.
 */
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";
import { ErrorBoundary } from "./components/ErrorBoundary";

export function render(): string {
  return renderToString(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  );
}

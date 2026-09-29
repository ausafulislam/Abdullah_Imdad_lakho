import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { hasError: boolean };

/**
 * Catches render-time errors anywhere below it and shows a styled fallback
 * instead of a blank white page. React 19 has no hook equivalent, so this
 * must stay a class component.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Unhandled render error:", error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 py-20 text-center text-cream">
        <p className="font-display text-xs font-medium uppercase tracking-widest text-coral">
          Something went wrong
        </p>
        <h1 className="t-h2 mt-4 max-w-lg font-display font-semibold">
          This page hit an unexpected error.
        </h1>
        <p className="t-body mt-5 max-w-md text-cream/60">
          It happens. Reloading usually fixes it. If it keeps happening, the
          email link below is the fastest way to reach Abdullah directly.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 rounded-full bg-coral px-7 py-4 font-display text-sm font-medium text-ink transition-colors hover:bg-cream"
          >
            Reload the page
          </button>
          <a
            href="mailto:abdullah17.imdad@gmail.com?subject=Portfolio%20error%20report"
            className="inline-flex items-center gap-2 rounded-full border border-cream/20 px-7 py-4 font-display text-sm font-medium transition-colors hover:border-coral hover:text-coral"
          >
            Email Abdullah
          </a>
        </div>

        <p className="mt-10 text-xs text-cream/35">
          abdullah17.imdad@gmail.com
        </p>
      </div>
    );
  }
}

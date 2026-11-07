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
      <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 py-20 text-center text-ink">
        <p className="eyebrow">Something went wrong</p>
        <h1 className="t-h2 mt-4 max-w-lg">This page hit an unexpected error.</h1>
        <p className="t-body mt-4 max-w-md text-muted">
          It happens. Reloading usually fixes it. If it keeps happening, the email link below is the fastest way to
          reach Abdullah directly.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button type="button" onClick={() => window.location.reload()} className="btn btn-lime">
            Reload the page
          </button>
          <a href="mailto:abdullah17.imdad@gmail.com?subject=Portfolio%20error%20report" className="btn btn-outline">
            Email Abdullah
          </a>
        </div>

        <p className="mt-10 text-xs text-muted">abdullah17.imdad@gmail.com</p>
      </div>
    );
  }
}

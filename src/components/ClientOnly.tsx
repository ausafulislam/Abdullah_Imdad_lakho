import { Component, useLayoutEffect, useState, type ErrorInfo, type ReactNode } from "react";

/**
 * Renders `fallback` on the server and during hydration, then `children` in the
 * browser. The project apps depend on localStorage and live APIs, so they are
 * not pre-rendered (that would only produce markup that can't match the
 * visitor's own data). The swap happens in a layout effect, before paint.
 */
export function ClientOnly({ children, fallback }: { children: ReactNode; fallback: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useLayoutEffect(() => setMounted(true), []);
  return <>{mounted ? children : fallback}</>;
}

type BoundaryProps = { name: string; children: ReactNode };

/** Keeps a crashing app from taking the rest of the page down with it. */
export class AppErrorBoundary extends Component<BoundaryProps, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`${this.props.name} crashed:`, error, info.componentStack);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div role="alert" className="rounded-[16px] border border-line bg-white px-6 py-12 text-center">
        <p className="text-[0.9375rem] font-semibold">The {this.props.name} stopped working.</p>
        <p className="mx-auto mt-1.5 max-w-[26rem] text-sm leading-relaxed text-muted">
          Reloading the page usually fixes it. Anything you saved is still stored in this browser.
        </p>
        <button type="button" onClick={() => window.location.reload()} className="btn btn-dark btn-sm mt-5">
          Reload the page
        </button>
      </div>
    );
  }
}

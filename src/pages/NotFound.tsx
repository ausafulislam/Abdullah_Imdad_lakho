import { ArrowLeft } from "lucide-react";

/**
 * Shown for unknown paths that reach the app (e.g. on the dev server). In
 * production, unknown URLs are answered by the static public/404.html.
 */
export default function NotFound() {
  return (
    <section className="pb-20 pt-[calc(var(--header-h)+3.5rem)] sm:pt-[calc(var(--header-h)+5rem)]">
      <div className="shell max-w-[40rem] text-center">
        <h1 className="t-h1">
          <span className="eyebrow-line mb-4">
            <span className="eyebrow">Error 404</span>
          </span>
          <span className="sr-only">: </span>
          Page not found.
        </h1>
        <p className="t-lead mt-4 text-muted">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href="/" className="btn btn-dark">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to home
          </a>
          <a href="/#projects" className="btn btn-outline">
            See the projects
          </a>
        </div>
      </div>
    </section>
  );
}

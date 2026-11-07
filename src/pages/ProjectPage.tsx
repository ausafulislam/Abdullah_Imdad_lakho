import { useRef, type ComponentType } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, LoaderCircle } from "lucide-react";
import { nextProject, type Project, type ProjectId } from "../data/projects";
import { batchReveal, gsap, useGSAP, MOTION_OK, REVEAL, REVEAL_START } from "../lib/gsap";
import { AppErrorBoundary, ClientOnly } from "../components/ClientOnly";
import TaskManager from "../projects/task-manager/TaskManager";
import ExpenseTracker from "../projects/expense-tracker/ExpenseTracker";
import WeatherDashboard from "../projects/weather/WeatherDashboard";

const APPS: Record<ProjectId, ComponentType> = {
  "task-manager": TaskManager,
  "expense-tracker": ExpenseTracker,
  "weather-dashboard": WeatherDashboard,
};

function AppLoading() {
  return (
    <div className="flex min-h-[30rem] items-center justify-center rounded-[16px] border border-dashed border-[#d6d6d6] bg-white px-6 text-center text-sm text-muted">
      <span className="inline-flex items-center gap-2">
        <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
        Loading the app…
      </span>
      <noscript>
        <span className="block">This app runs in your browser and needs JavaScript.</span>
      </noscript>
    </div>
  );
}

/** Shared layout for /projects/<id>: intro, the working app, features and stack. */
export default function ProjectPage({ project }: { project: Project }) {
  const root = useRef<HTMLDivElement>(null);
  const App = APPS[project.id];
  const next = nextProject(project);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, (_context, contextSafe) => {
        gsap.from("[data-pp='intro'] > *", { y: 16, opacity: 0, duration: 0.7, stagger: 0.07, delay: 0.15 });
        gsap.from("[data-pp='app']", { y: 20, opacity: 0, duration: 0.8, delay: 0.3 });
        batchReveal("[data-pp='block']", contextSafe, { start: REVEAL_START });
        gsap.from("[data-pp='next']", {
          ...REVEAL,
          scrollTrigger: { trigger: "[data-pp='next']", start: "top 95%", once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      <section className="pb-8 pt-[calc(var(--header-h)+1.75rem)] sm:pb-10 sm:pt-[calc(var(--header-h)+2.75rem)]">
        <div data-pp="intro" className="shell">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.8125rem] text-muted">
              <li>
                <a href="/" className="rounded-sm transition-colors hover:text-ink">
                  Home
                </a>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <a href="/#projects" className="rounded-sm transition-colors hover:text-ink">
                  Projects
                </a>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-medium text-ink">
                {project.name}
              </li>
            </ol>
          </nav>

          <div className="mt-6 flex flex-col gap-6 sm:mt-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
            <div className="max-w-[46rem]">
              <h1 className="t-h1">
                <span className="eyebrow-line mb-4">
                  <span className="eyebrow">Project {project.number}</span>
                </span>
                <span className="sr-only">: </span>
                {project.name}
              </h1>
              <p className="t-lead mt-4 text-muted">{project.intro}</p>
            </div>
            <a href="/#projects" className="btn btn-outline btn-sm w-fit shrink-0">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to Projects
            </a>
          </div>

          <ul aria-label="Technologies" className="mt-6 flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <li key={tag} className="rounded-full border border-line bg-white px-2.5 py-1 text-xs font-medium text-[#4d4d4d]">
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="app-title">
        <div className="shell">
          <h2 id="app-title" className="sr-only">
            {project.name} app
          </h2>
          <div data-pp="app" className="rounded-[20px] border border-line bg-[#fafafa] p-2 sm:p-3 lg:p-4">
            <ClientOnly fallback={<AppLoading />}>
              <AppErrorBoundary name={project.name}>
                <App />
              </AppErrorBoundary>
            </ClientOnly>
          </div>
        </div>
      </section>

      <section aria-label="About this project" className="section-y mt-4 sm:mt-6">
        <div className="shell grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div data-pp="block">
            <h2 className="t-h2">
              <span className="eyebrow-line mb-4">
                <span className="eyebrow">Main Features</span>
              </span>
              <span className="sr-only">: </span>
              What it can do.
            </h2>
            <ul className="mt-6 grid gap-x-8 gap-y-3.5 sm:grid-cols-2 lg:grid-cols-1">
              {project.features.map((feature) => (
                <li key={feature} className="flex gap-3 text-[0.9375rem] leading-snug">
                  <span className="mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-lime text-ink">
                    <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div data-pp="block">
            <h2 className="t-h2">
              <span className="eyebrow-line mb-4">
                <span className="eyebrow">Technologies</span>
              </span>
              <span className="sr-only">: </span>
              How it&apos;s built.
            </h2>
            <dl className="mt-6 divide-y divide-line border-y border-line">
              {project.stack.map((item) => (
                <div key={item.name} className="grid gap-1 py-3 sm:grid-cols-[12rem_1fr] sm:gap-4">
                  <dt className="text-[0.9375rem] font-semibold">{item.name}</dt>
                  <dd className="text-sm leading-relaxed text-muted">{item.detail}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 rounded-[14px] bg-mist p-4 sm:p-5">
              <h3 className="text-[0.875rem] font-semibold">Your data</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-strong">{project.dataNote}</p>
              {project.apis.length > 0 && (
                <ul className="mt-4 space-y-2 border-t border-[#e2e2e2] pt-4">
                  {project.apis.map((api) => (
                    <li key={api.name} className="text-sm leading-relaxed">
                      <a
                        href={api.docs}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-semibold text-ink underline decoration-[#c4c4c4] underline-offset-4 transition-colors hover:decoration-ink"
                      >
                        {api.name} docs
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                        <span className="sr-only">(opens in a new tab)</span>
                      </a>
                      <span className="text-muted-strong"> · {api.detail}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>

      <nav aria-label="More projects" data-pp="next" className="border-t border-line">
        <div className="shell flex flex-col gap-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:py-10">
          <a href="/#projects" className="btn btn-outline btn-sm w-fit">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Portfolio
          </a>
          <a href={next.path} className="group inline-flex w-fit items-center gap-4 rounded-md sm:text-right">
            <span>
              <span className="block text-[0.8125rem] text-muted">Next project</span>
              <span className="block text-[1.0625rem] font-bold tracking-[-0.015em]">{next.name}</span>
            </span>
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-line transition-colors group-hover:border-lime group-hover:bg-lime">
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </span>
          </a>
        </div>
      </nav>
    </div>
  );
}

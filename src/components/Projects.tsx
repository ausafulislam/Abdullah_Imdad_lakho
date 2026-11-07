import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { PROJECTS, type Project } from "../data/projects";
import { batchReveal, gsap, useGSAP, MOTION_OK, REVEAL, REVEAL_START } from "../lib/gsap";
import { PROJECT_PREVIEWS } from "./ProjectPreviews";

function ProjectCard({ project }: { project: Project }) {
  const Preview = PROJECT_PREVIEWS[project.id];
  return (
    <article className="group flex h-full flex-col rounded-[14px] border border-line bg-white p-3 transition-[translate,border-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-[#d6d6d6] hover:shadow-[0_16px_32px_-22px_rgb(0_0_0/0.3)] sm:p-4 md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:items-center md:gap-6 lg:flex">
      <div className="overflow-hidden rounded-[10px] bg-mist">
        <Preview className="block h-auto w-full transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-[1.025]" />
      </div>

      <div className="flex flex-1 flex-col px-1 pb-1 pt-5 md:py-2 lg:pt-5">
        <p className="text-[0.8125rem] font-semibold tabular-nums text-muted">{project.number}</p>
        <h3 className="mt-1 text-[1.1875rem] font-bold leading-tight tracking-[-0.02em]">{project.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{project.summary}</p>
        <ul aria-label={`Technologies used in ${project.name}`} className="mt-4 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <li key={tag} className="rounded-full border border-line px-2.5 py-1 text-xs font-medium text-[#4d4d4d]">
              {tag}
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-5">
          <a href={project.path} className="btn btn-outline btn-sm">
            View Project<span className="sr-only">: {project.name}</span>
            <ArrowRight className="btn-arrow h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  );
}

/** Landing-page section linking to the three project pages. */
export default function Projects() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, (_context, contextSafe) => {
        gsap.from("[data-projects='head'] > *", {
          ...REVEAL,
          stagger: 0.1,
          scrollTrigger: { trigger: "[data-projects='head']", start: REVEAL_START, once: true },
        });
        batchReveal("[data-projects='card']", contextSafe);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="projects" aria-labelledby="projects-title" className="section-y">
      <div className="shell">
        <div data-projects="head" className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-10">
          <h2 id="projects-title" className="t-h2">
            <span className="eyebrow-line mb-4">
              <span className="eyebrow">Projects</span>
            </span>
            <span className="sr-only">: </span>
            Working apps you can try right here.
          </h2>
          <p className="max-w-[24rem] text-sm leading-relaxed text-muted">
            Practice projects built with React and TypeScript. Each one runs on its own page and works with your own
            entries or live data.
          </p>
        </div>

        <ul className="mt-8 grid gap-4 lg:mt-10 lg:grid-cols-3">
          {PROJECTS.map((project) => (
            <li key={project.id} data-projects="card">
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

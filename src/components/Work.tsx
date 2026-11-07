import { useRef } from "react";
import { ChartNoAxesColumn, CodeXml, Cpu, Database, Laptop, Lightbulb, type LucideIcon } from "lucide-react";
import { interests, SKILL_GROUPS, type InterestIcon } from "../data/portfolio";
import { batchReveal, gsap, useGSAP, MOTION_OK, REVEAL, REVEAL_START } from "../lib/gsap";

const ICONS: Record<InterestIcon, LucideIcon> = {
  cpu: Cpu,
  code: CodeXml,
  laptop: Laptop,
  chart: ChartNoAxesColumn,
  database: Database,
  bulb: Lightbulb,
};

/** "Work" = Areas of Interest + the skills being built. */
export default function Work() {
  const root = useRef<HTMLElement>(null);

  // Scroll reveals (each trigger fires once).
  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, (_context, contextSafe) => {
        gsap.from("[data-work='head'] > *", {
          ...REVEAL,
          stagger: 0.1,
          scrollTrigger: { trigger: "[data-work='head']", start: REVEAL_START, once: true },
        });
        batchReveal("[data-work='card']", contextSafe);
        gsap.from("[data-work='skills']", {
          ...REVEAL,
          scrollTrigger: { trigger: "[data-work='skills']", start: REVEAL_START, once: true },
        });
        batchReveal("[data-work='skill-group']", contextSafe, { y: 16, start: "top 92%" });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="work" aria-labelledby="work-title" className="section-y">
      <div className="shell">
        <div data-work="head">
          <h2 id="work-title" className="t-h2">
            <span className="eyebrow-line mb-4">
              <span className="eyebrow">Areas of Interest</span>
            </span>
            <span className="sr-only">: </span>
            Where my curiosity is heading.
          </h2>
        </div>

        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3 lg:gap-4">
          {interests.map((item) => {
            const Icon = ICONS[item.icon];
            return (
              <li key={item.id} data-work="card">
                <article className="group flex h-full items-center gap-4 rounded-[14px] border border-line bg-white p-4 transition-[translate,border-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-[#d6d6d6] hover:shadow-[0_16px_32px_-22px_rgb(0_0_0/0.3)] sm:p-5">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-mist text-ink transition-colors duration-300 group-hover:bg-lime">
                    <Icon className="h-[1.375rem] w-[1.375rem]" strokeWidth={1.6} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="t-h3">{item.title}</h3>
                    <p className="mt-1 text-sm leading-snug text-muted">{item.summary}</p>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>

        {/* Skills in progress — compact summary of what's being learned right now */}
        <div
          id="skills"
          data-work="skills"
          className="mt-10 rounded-[18px] border border-line bg-[#fafafa] p-5 sm:p-8 lg:mt-12"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-10">
            <div>
              <h3 className="text-[1.25rem] font-bold leading-tight tracking-[-0.025em] sm:text-[1.375rem]">
                <span className="eyebrow-line mb-3">
                  <span className="eyebrow">Skills in Progress</span>
                </span>
                <span className="sr-only">: </span>
                Skills I&apos;m building, one concept at a time.
              </h3>
            </div>
            <p className="max-w-[22rem] text-sm leading-relaxed text-muted">
              Learned through coursework, practice and steady, continuous learning.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-7 border-t border-line pt-6 xs:grid-cols-2 lg:grid-cols-4 lg:gap-x-8">
            {SKILL_GROUPS.map((group) => (
              <div key={group.title} data-work="skill-group">
                <h4 className="text-[0.9375rem] font-semibold tracking-[-0.01em]">{group.title}</h4>
                <ul className="mt-3 space-y-2">
                  {group.items.map((skill) => (
                    <li key={skill} className="flex gap-2.5 text-sm leading-snug text-muted">
                      <span aria-hidden="true" className="mt-[0.5em] h-1 w-1 shrink-0 rounded-full bg-[#b3b3b3]" />
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

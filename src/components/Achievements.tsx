import { useRef } from "react";
import { Award, BookOpenCheck } from "lucide-react";
import { ACHIEVEMENTS } from "../data/portfolio";
import { batchReveal, gsap, useGSAP, MOTION_OK, REVEAL, REVEAL_START } from "../lib/gsap";

const ICONS = { award: Award, result: BookOpenCheck } as const;

export default function Achievements() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, (_context, contextSafe) => {
        gsap.from("[data-ach='head'] > *", {
          ...REVEAL,
          stagger: 0.1,
          scrollTrigger: { trigger: "[data-ach='head']", start: REVEAL_START, once: true },
        });
        batchReveal("[data-ach='card']", contextSafe, { stagger: 0.1 });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="achievements" aria-labelledby="achievements-title" className="section-y">
      <div className="shell">
        <div data-ach="head">
          <h2 id="achievements-title" className="t-h2">
            <span className="eyebrow-line mb-4">
              <span className="eyebrow">Achievements</span>
            </span>
            <span className="sr-only">: </span>
            Certifications and academic results.
          </h2>
        </div>

        <ul className="mt-8 grid gap-3 lg:mt-10 lg:grid-cols-3 lg:gap-4">
          {ACHIEVEMENTS.map((item) => {
            const Icon = ICONS[item.icon];
            return (
              <li key={item.id} data-ach="card">
                <article className="flex h-full items-start gap-4 rounded-[14px] border border-line bg-white p-5 transition-[border-color,box-shadow] duration-300 hover:border-[#d6d6d6] hover:shadow-[0_16px_32px_-22px_rgb(0_0_0/0.3)] sm:gap-5 sm:p-6 lg:flex-col lg:gap-0">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-mist text-ink">
                    <Icon className="h-5 w-5" strokeWidth={1.6} aria-hidden="true" />
                  </span>
                  <div className="min-w-0 lg:mt-5">
                    <p className="text-[0.8125rem] font-medium text-muted">{item.kicker}</p>
                    <h3 className="mt-1.5 text-[0.9875rem] font-semibold leading-snug tracking-[-0.01em] sm:text-base">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.detail}</p>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

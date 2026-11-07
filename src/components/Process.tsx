import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { LEARNING_STEPS } from "../data/portfolio";
import { gsap, useGSAP, MOTION_OK, REVEAL, REVEAL_START } from "../lib/gsap";
import { cn } from "../utils/cn";

const DESKTOP = "(min-width: 64rem)";

/** "How I Learn" — linked from the nav as Experience. */
export default function Process() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add({ motion: MOTION_OK, desktop: DESKTOP }, (context) => {
        const { motion, desktop } = context.conditions as { motion: boolean; desktop: boolean };
        if (!motion) return;

        gsap.from("[data-learn='head'] > *", {
          ...REVEAL,
          stagger: 0.1,
          scrollTrigger: { trigger: "[data-learn='head']", start: REVEAL_START, once: true },
        });

        const steps = gsap.utils.toArray<HTMLElement>("[data-learn='step']");

        // One step = number appears → text rises → connector draws toward the next
        // number. Positions are absolute (`at` = the step's start), so on desktop the
        // steps overlap: ~2s for the whole row instead of waiting on each arrow.
        const addStep = (tl: gsap.core.Timeline, step: HTMLElement, at: number) => {
          const line = step.querySelector("[data-learn='line']");
          const arrow = step.querySelector("[data-learn='arrow']");
          tl.from(step.querySelector("[data-learn='dot']"), { scale: 0.6, opacity: 0, duration: 0.5, ease: "power3.out" }, at)
            .from(step.querySelector("[data-learn='text']"), { y: 14, opacity: 0, duration: 0.55 }, at + 0.08);
          if (line) {
            tl.from(
              line,
              desktop
                ? { scaleX: 0, transformOrigin: "left center", duration: 0.5, ease: "power2.inOut" }
                : { scaleY: 0, transformOrigin: "center top", duration: 0.5, ease: "power2.inOut" },
              at + 0.2,
            );
          }
          if (arrow && desktop) tl.from(arrow, { x: -8, opacity: 0, duration: 0.3 }, at + 0.5);
        };

        if (desktop) {
          // Horizontal row: one progressive sequence across all four steps.
          const tl = gsap.timeline({ scrollTrigger: { trigger: "[data-learn='steps']", start: "top 80%", once: true } });
          steps.forEach((step, i) => addStep(tl, step, i * 0.45));
        } else {
          // Vertical timeline: each step reveals as it reaches the viewport.
          steps.forEach((step) => {
            const tl = gsap.timeline({ scrollTrigger: { trigger: step, start: "top 86%", once: true } });
            addStep(tl, step, 0);
          });
        }
      });
    },
    { scope: root },
  );

  const last = LEARNING_STEPS.length - 1;

  return (
    <section ref={root} id="experience" aria-labelledby="learn-title" className="section-y">
      {/* Phone: heading over a card timeline · tablet: heading beside it · lg: horizontal row · xl: heading left */}
      <div className="shell grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-start md:gap-12 lg:grid-cols-1 xl:grid-cols-[0.9fr_2.1fr] xl:gap-0">
        <div data-learn="head" className="xl:pr-10">
          <h2 id="learn-title" className="t-h2 max-w-[22rem]">
            <span className="eyebrow-line mb-4">
              <span className="eyebrow">How I Learn</span>
            </span>
            <span className="sr-only">: </span>
            A simple, honest approach to learning.
          </h2>
        </div>

        <ol data-learn="steps" className="grid lg:grid-cols-4 lg:gap-x-6 xl:border-l xl:border-line xl:pl-12">
          {LEARNING_STEPS.map((step, i) => (
            <li key={step.n} data-learn="step" className="grid grid-cols-[auto_1fr] gap-x-4 sm:gap-x-5 lg:block">
              {/* Number + connector (vertical below lg, horizontal with an arrow from lg) */}
              <div className="flex flex-col items-center lg:flex-row">
                <span
                  data-learn="dot"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lime text-[0.8125rem] font-bold tracking-[-0.01em] text-ink lg:h-11 lg:w-11"
                >
                  {step.n}
                </span>
                {i < last && (
                  <>
                    <span
                      data-learn="line"
                      aria-hidden="true"
                      className="my-1.5 w-px flex-1 bg-[#d9d9d9] lg:mx-3 lg:my-0 lg:h-px lg:w-auto"
                    />
                    <span data-learn="arrow" aria-hidden="true" className="hidden text-[#a3a3a3] lg:block">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </>
                )}
              </div>

              {/* Card below lg; plain text under the number from lg */}
              <div
                data-learn="text"
                className={cn(
                  "rounded-[14px] border border-line bg-white px-4 py-3 sm:px-5 sm:py-4 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:pt-5",
                  i < last && "mb-3 lg:mb-0",
                )}
              >
                <h3 className="t-h3">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted lg:mt-1.5 lg:max-w-[17rem]">{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

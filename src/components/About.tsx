import { useRef } from "react";
import { ArrowUpRight, BookOpen, GraduationCap, Trophy, Users, type LucideIcon } from "lucide-react";
import { ABOUT, CONTACT, EDUCATION, type EducationIcon } from "../data/portfolio";
import { gsap, useGSAP, MOTION_OK, REVEAL, REVEAL_START } from "../lib/gsap";

const ICONS: Record<EducationIcon, LucideIcon> = {
  graduation: GraduationCap,
  book: BookOpen,
  award: Trophy,
  community: Users,
};

export default function About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        // Portrait: card fades up while the photo settles from a slight zoom.
        gsap
          .timeline({ scrollTrigger: { trigger: "[data-about='media']", start: REVEAL_START, once: true } })
          .from("[data-about='media']", { ...REVEAL, y: 32, duration: 0.9 })
          .from("[data-about='media'] img", { scale: 1.08, duration: 1.4, ease: "power2.out" }, 0);

        gsap.from("[data-about='copy'] > *", {
          ...REVEAL,
          stagger: 0.08,
          scrollTrigger: { trigger: "[data-about='copy']", start: REVEAL_START, once: true },
        });

        gsap.from("[data-about='row']", {
          ...REVEAL,
          y: 18,
          stagger: 0.08,
          scrollTrigger: { trigger: "[data-about='rows']", start: REVEAL_START, once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="about" aria-labelledby="about-title" className="section-y">
      <div className="shell grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-x-10 lg:grid-cols-[0.92fr_1.28fr_1fr] lg:gap-x-12 xl:gap-x-14">
        <figure
          data-about="media"
          className="relative aspect-[4/3] overflow-hidden rounded-[18px] bg-mist md:aspect-auto md:min-h-[24rem]"
        >
          <picture>
            <source type="image/webp" srcSet="/images/abdullah-about.webp" />
            <img
              src="/images/avatar.jpeg"
              alt="Abdullah Imdad Lakho standing on a staircase"
              width={720}
              height={960}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-[50%_26%] grayscale"
            />
          </picture>
        </figure>

        <div data-about="copy" className="self-center">
          <p className="eyebrow">About Me</p>
          <h2 id="about-title" className="t-h2 mt-4">
            Building a strong foundation,{" "}
            <span className="relative isolate whitespace-nowrap">
              <span
                aria-hidden="true"
                className="absolute -inset-x-[0.08em] bottom-[0.08em] -z-10 h-[0.4em] rounded-[3px] bg-lime"
              />
              one
            </span>{" "}
            concept at a time.
          </h2>
          {ABOUT.paragraphs.map((text) => (
            <p key={text.slice(0, 24)} className="t-body mt-4 text-muted">
              {text}
            </p>
          ))}
          <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm mt-7">
            Learn More<span className="sr-only"> on LinkedIn (opens in a new tab)</span>
            <ArrowUpRight className="btn-arrow h-4 w-4" aria-hidden="true" />
          </a>
        </div>

        <div className="md:col-span-2 lg:col-span-1 lg:border-l lg:border-line lg:pl-10 xl:pl-12">
          <h3 className="sr-only">Education and community</h3>
          <ul data-about="rows" className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-1 lg:gap-y-7">
            {EDUCATION.map(({ icon, title, meta }) => {
              const Icon = ICONS[icon];
              return (
                <li key={title} data-about="row" className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line bg-white text-ink">
                    <Icon className="h-[1.125rem] w-[1.125rem]" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <p className="text-[0.9375rem] font-semibold leading-snug tracking-[-0.01em]">{title}</p>
                    <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted">{meta.join(" · ")}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

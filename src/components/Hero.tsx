import { ArrowDown, ArrowRight, Sparkles, Star } from "lucide-react";
import { useCountUp } from "../hooks/usePortfolio";

function Stat({
  target,
  suffix,
  label,
}: {
  target: number;
  suffix: string;
  label: string;
}) {
  const { ref, value } = useCountUp(target);
  return (
    <div className="flex-1">
      <p className="t-stat font-display font-semibold tracking-tight text-ink">
        <span ref={ref}>{value}</span>
        {suffix}
      </p>
      <p className="mt-1 text-[0.72rem] leading-snug text-ink/55 sm:text-[0.8rem]">{label}</p>
    </div>
  );
}

export default function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden pb-14 pt-24 sm:pb-16 sm:pt-28 lg:pb-20 lg:pt-36"
    >
      {/* soft background washes */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-28 top-6 h-60 w-60 rounded-full bg-coral/15 blur-3xl sm:h-72 sm:w-72"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 top-1/4 h-60 w-60 rounded-full bg-gold/15 blur-3xl sm:h-72 sm:w-72"
      />
      {/* subtle dotted texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40 opacity-[0.35] [mask-image:linear-gradient(to_bottom,black,transparent)]"
        style={{
          backgroundImage: "radial-gradient(rgba(20,18,15,0.18) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 md:px-10">
        <div className="grid grid-cols-1 items-center gap-10 sm:gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14 xl:gap-20">
          {/* ---------- Left : copy ---------- */}
          <div className="max-w-xl animate-fade-up lg:max-w-none">
            <div className="inline-flex items-center gap-2 rounded-full border border-ink/12 bg-white/70 py-1.5 pl-2 pr-4 shadow-sm backdrop-blur">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-70" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-600" />
              </span>
              <span className="font-display text-[0.68rem] font-medium uppercase tracking-[0.14em] text-ink/70 sm:text-[0.72rem]">
                Available for internships &amp; collaboration
              </span>
            </div>

            <h1 className="t-hero mt-5 font-display font-semibold text-ink sm:mt-6">
              Building my foundation in Artificial Intelligence,{" "}
              <span className="relative inline-block font-serif-display font-medium italic text-coral">
                one step
                <svg
                  aria-hidden
                  viewBox="0 0 120 12"
                  className="absolute -bottom-1 left-0 w-full text-coral/60"
                  fill="none"
                >
                  <path
                    d="M3 9C30 3 70 3 117 7"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{" "}
              at a time.
            </h1>

            <p className="t-lead mt-5 max-w-md text-ink/65 sm:mt-6">
              I&apos;m Abdullah — a BS Artificial Intelligence student in my first
              semester at DUET, Karachi. I&apos;m at the beginning of my journey,
              focused on getting the fundamentals of programming, AI and
              analytical thinking right.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#work"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 font-display text-sm font-medium text-cream transition-all hover:bg-coral hover:text-ink sm:w-auto"
              >
                Areas of Interest
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-full border border-ink/20 px-6 py-3.5 font-display text-sm font-medium text-ink transition-colors hover:border-ink hover:bg-ink hover:text-cream"
              >
                Get in Touch
              </a>
            </div>

            {/* compact stats with dividers */}
            <div className="mt-9 flex items-stretch gap-5 border-t border-ink/10 pt-6 sm:mt-10 sm:gap-7">
              <Stat target={6} suffix="" label="Areas of focus" />
              <div aria-hidden className="w-px bg-ink/10" />
              <Stat target={18} suffix="" label="Skills in progress" />
              <div aria-hidden className="w-px bg-ink/10" />
              <Stat target={3} suffix="" label="Academic certificates" />
            </div>
          </div>

          {/* ---------- Right : visual ---------- */}
          <div className="animate-fade-up [animation-delay:140ms] lg:justify-self-end lg:pl-2">
            <div className="relative mx-auto w-full max-w-[20rem] sm:max-w-[24rem] lg:mx-0 lg:max-w-[25rem] xl:max-w-[27rem]">
              {/* offset frame */}
              <div
                aria-hidden
                className="absolute -inset-0 translate-x-3 translate-y-3 rounded-[1.6rem] border-2 border-ink/10"
              />
              <div className="relative overflow-hidden rounded-[1.6rem] shadow-[0_24px_60px_-20px_rgba(20,18,15,0.35)] ring-1 ring-ink/10">
                <img
                  src="/images/hero-portrait.png"
                  alt="Abstract artwork representing artificial intelligence"
                  width={1145}
                  height={1374}
                  loading="eager"
                  className="aspect-[5/6] w-full object-cover"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent"
                />
              </div>

              {/* floating rating badge — top */}
              <div className="absolute -right-3 top-5 flex items-center gap-2.5 rounded-2xl border border-ink/10 bg-cream/95 px-3.5 py-2.5 shadow-lg backdrop-blur sm:-right-5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/20">
                  <Sparkles className="h-4 w-4 text-gold" />
                </span>
                <span>
                  <span className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} className="h-2.5 w-2.5 fill-gold text-gold" />
                    ))}
                  </span>
                  <span className="mt-0.5 block text-[0.68rem] font-medium text-ink/70">
                    Grade A1 · 80.36%
                  </span>
                </span>
              </div>

              {/* floating quote — bottom */}
              <div className="absolute -bottom-5 -left-3 flex max-w-[15rem] items-start gap-2.5 rounded-2xl bg-ink px-4 py-3.5 text-cream shadow-xl sm:-left-6">
                <span className="font-serif-display text-3xl italic leading-[0.8] text-coral">
                  &ldquo;
                </span>
                <p className="pt-1 text-[0.72rem] leading-snug text-cream/85 sm:text-xs">
                  Learn → Build → Improve → Repeat.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* scroll cue */}
        <div className="mt-14 hidden justify-center lg:mt-16 lg:flex">
          <a
            href="#work"
            className="group flex flex-col items-center gap-2 text-ink/35 transition-colors hover:text-coral"
            aria-label="Scroll to work"
          >
            <span className="font-display text-[0.65rem] font-medium uppercase tracking-[0.25em]">
              Scroll
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 transition-colors group-hover:border-coral">
              <ArrowDown className="h-4 w-4 animate-bounce" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

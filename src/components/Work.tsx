import { useRef, useState, useEffect } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { categories, projects } from "../data/portfolio";

export default function Work() {
  const [active, setActive] = useState<(typeof categories)[number]>("All");
  const scroller = useRef<HTMLDivElement | null>(null);
  const [showArrows, setShowArrows] = useState(false);

  const filtered = active === "All" ? projects : projects.filter((p) => p.category === active);

  useEffect(() => {
    const check = () => setShowArrows((scroller.current?.scrollWidth ?? 0) > (scroller.current?.clientWidth ?? 0) + 8);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const nudge = (dir: 1 | -1) =>
    scroller.current?.scrollBy({ left: dir * 220, behavior: "smooth" });

  return (
    <section id="work" className="section-y scroll-mt-20 bg-ink text-cream">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 md:px-10">
        <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="reveal max-w-xl">
            <p className="font-display text-xs font-medium uppercase tracking-widest text-coral sm:text-sm">
              Areas of Interest
            </p>
            <h2 className="t-h2 mt-4 font-display font-semibold">Where my curiosity is heading.</h2>
          </div>

          <div className="reveal flex w-full items-center gap-2 lg:w-auto">
            <div
              ref={scroller}
              className="no-scrollbar -mx-1 flex w-full flex-nowrap gap-2 overflow-x-auto px-1 py-1 lg:mx-0 lg:flex-wrap lg:justify-end lg:overflow-visible lg:px-0"
            >
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setActive(c)}
                  aria-pressed={active === c}
                  className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 font-display text-[0.7rem] font-medium uppercase tracking-wide transition-colors sm:px-4 sm:text-xs ${
                    active === c
                      ? "border-coral bg-coral text-ink"
                      : "border-cream/20 text-cream/70 hover:border-cream/50 hover:text-cream"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {showArrows && (
              <div className="hidden shrink-0 gap-1 pl-2 sm:flex lg:hidden">
                <button
                  onClick={() => nudge(-1)}
                  aria-label="Scroll filters left"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/20 text-cream/70"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => nudge(1)}
                  aria-label="Scroll filters right"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/20 text-cream/70"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 xs:grid-cols-2 sm:mt-14 sm:gap-6 lg:grid-cols-3 lg:gap-8">
          {filtered.map((p, i) => (
            <article
              key={`${active}-${p.id}`}
              style={{ animationDelay: `${i * 70}ms` }}
              className="group relative animate-fade-up overflow-hidden rounded-2xl bg-ink-soft ring-1 ring-cream/10 transition-transform duration-300 hover:-translate-y-1.5 active:translate-y-0"
            >
              <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[4/3] lg:aspect-[3/4]">
                <img
                  src={p.image}
                  alt={p.title}
                  width={800}
                  height={1000}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.08]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/5 to-transparent" />
                <div className="absolute right-3 top-3 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-coral text-ink opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <ArrowUpRight className="h-5 w-5" />
                </div>
              </div>
              <div className="p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-display text-[0.65rem] font-medium uppercase tracking-widest text-coral sm:text-xs">
                    {p.category}
                  </span>
                  <span className="text-[0.7rem] text-cream/40 sm:text-xs">{p.year}</span>
                </div>
                <h3 className="t-h3 mt-2.5 font-display font-semibold text-cream sm:mt-3">{p.title}</h3>
                <p className="t-body mt-2 text-cream/60">{p.blurb}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

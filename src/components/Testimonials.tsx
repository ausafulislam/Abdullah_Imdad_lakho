import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "Certificate of Participation at the 15th Maarif Inter-School Maths Olympiad, organised by Pak-Turk Maarif International Schools.",
    name: "MISMO",
    role: "15th Maarif Inter-School Maths Olympiad · November 2019",
    initials: "M",
  },
  {
    quote:
      "Certificate of Participation at the ICATS English Linguistics Contest 2020, organised by International CATS Contests.",
    name: "ICATS",
    role: "English Linguistics Contest · 21–22 October 2020",
    initials: "IC",
  },
  {
    quote:
      "Scored 884 out of 1100 in the S.S.C.-II Annual Examination 2024 — 80.36%, earning Grade A1.",
    name: "S.S.C.-II",
    role: "Noor Eastern Collegiate, Nawabshah · 2024",
    initials: "A1",
  },
];

export default function Testimonials() {
  const [i, setI] = useState(0);
  const touchX = useRef<number | null>(null);
  const count = testimonials.length;

  const next = useCallback(() => setI((v) => (v + 1) % count), [count]);
  const prev = useCallback(() => setI((v) => (v - 1 + count) % count), [count]);

  // Auto-advance, paused on interaction for a calmer UX
  useEffect(() => {
    const id = setInterval(next, 7000);
    return () => clearInterval(id);
  }, [next, i]);

  return (
    <section
      id="testimonials"
      className="section-y scroll-mt-24 overflow-hidden bg-cream"
    >
      <div className="mx-auto max-w-4xl px-5 text-center sm:px-6 md:px-10">
        <p className="font-display text-xs font-medium uppercase tracking-widest text-coral sm:text-sm">
          Achievements
        </p>
        <h2 className="t-h2 mt-4 font-display font-semibold text-ink">
          Certifications and academic results.
        </h2>

        <div
          className="mt-10 flex touch-pan-y flex-col items-center select-none sm:mt-14"
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 48) (dx < 0 ? next : prev)();
            touchX.current = null;
          }}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-coral sm:h-14 sm:w-14">
            <Quote className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>

          <div className="mt-6 flex gap-1 text-coral">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Star key={idx} className="h-4 w-4 fill-coral sm:h-5 sm:w-5" />
            ))}
          </div>

          <div className="relative mt-6 min-h-[19.5rem] w-full xs:min-h-[17.5rem] sm:min-h-[16rem] md:min-h-[14rem]">
            {testimonials.map((item, idx) => (
              <blockquote
                key={item.name}
                aria-hidden={idx !== i}
                className={`absolute inset-0 flex flex-col items-center justify-start transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  idx === i
                    ? "translate-y-0 opacity-100"
                    : "pointer-events-none translate-y-3 opacity-0"
                }`}
              >
                <p className="mx-auto max-w-2xl font-serif-display text-xl italic leading-relaxed text-ink sm:text-2xl md:text-3xl">
                  "{item.quote}"
                </p>
                <footer className="mt-7 flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink font-display text-sm font-semibold text-cream">
                    {item.initials}
                  </span>
                  <span className="text-left">
                    <span className="block font-display text-sm font-semibold text-ink sm:text-base">
                      {item.name}
                    </span>
                    <span className="block text-xs text-ink/50 sm:text-sm">{item.role}</span>
                  </span>
                </footer>
              </blockquote>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-3 sm:mt-10 sm:gap-4">
            <button
              onClick={prev}
              aria-label="Previous testimonial"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors hover:border-ink hover:bg-ink hover:text-cream active:bg-ink/10 sm:h-12 sm:w-12"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2">
              {testimonials.map((item, idx) => (
                <button
                  key={item.name}
                  onClick={() => setI(idx)}
                  aria-label={`Go to testimonial ${idx + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    idx === i ? "w-7 bg-coral" : "w-2.5 bg-ink/20 hover:bg-ink/40"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              aria-label="Next testimonial"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors hover:border-ink hover:bg-ink hover:text-cream active:bg-ink/10 sm:h-12 sm:w-12"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-3 text-xs text-ink/35 sm:hidden">Swipe for more</p>
        </div>
      </div>
    </section>
  );
}

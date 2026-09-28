const steps = [
  {
    n: "01",
    title: "Learn",
    desc: "Understanding programming, AI and computing concepts properly — not just memorising them for an exam.",
  },
  {
    n: "02",
    title: "Build",
    desc: "Turning what I learn in the classroom into practical skill through exercises, coursework and small builds.",
  },
  {
    n: "03",
    title: "Improve",
    desc: "Seeking feedback, fixing weak spots and refining how I approach each new problem.",
  },
  {
    n: "04",
    title: "Repeat",
    desc: "Continuous learning and steady practice — the cycle that compounds over a degree and beyond.",
  },
];

export default function Process() {
  return (
    <section id="process" className="section-y scroll-mt-24 bg-cream-soft">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 md:px-10">
        <div className="reveal max-w-2xl">
          <p className="font-display text-xs font-medium uppercase tracking-widest text-coral sm:text-sm">
            How I Learn
          </p>
          <h2 className="t-h2 mt-4 font-display font-semibold text-ink">
            A simple, honest approach to learning.
          </h2>
        </div>

        {/* Mobile: vertical timeline with rail · Desktop: 4 columns */}
        <div className="relative mt-10 sm:mt-16">
          <div
            aria-hidden
            className="absolute left-[1.375rem] top-2 bottom-2 w-px bg-gradient-to-b from-coral/60 via-ink/15 to-transparent sm:hidden"
          />
          <ol className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-12 lg:grid-cols-4 lg:gap-8">
            {steps.map((s, i) => (
              <li
                key={s.n}
                style={{ transitionDelay: `${i * 100}ms` }}
                className="reveal relative flex gap-5 sm:block"
              >
                <span className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink/15 bg-cream font-display text-sm font-semibold text-ink sm:h-auto sm:w-auto sm:border-0 sm:bg-transparent sm:text-transparent">
                  <span className="sm:hidden">{s.n}</span>
                  <span aria-hidden className="t-num hidden font-display font-semibold leading-none text-ink/10 sm:block">
                    {s.n}
                  </span>
                </span>
                <div>
                  <h3 className="t-h3 font-display font-semibold text-ink sm:mt-3">{s.title}</h3>
                  <p className="t-body mt-2 max-w-xs text-ink/60">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

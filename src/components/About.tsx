export default function About() {
  return (
    <section id="about" className="section-y mx-auto max-w-7xl scroll-mt-24 px-5 sm:px-6 md:px-10">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="reveal lg:col-span-4">
          <p className="font-display text-xs font-medium uppercase tracking-widest text-coral sm:text-sm">
            About Me
          </p>
          <h2 className="t-h2 mt-4 font-display font-semibold text-ink">
            Building a strong foundation, one concept at a time.
          </h2>

          <div className="mt-8 overflow-hidden rounded-2xl ring-1 ring-ink/10">
            <img
              src="/images/avatar.jpeg"
              alt="Portrait of Abdullah Imdad"
              width={1147}
              height={1530}
              loading="lazy"
              className="aspect-[4/3] w-full object-cover sm:aspect-square lg:aspect-[4/3]"
            />
          </div>
        </div>

        <div className="reveal lg:col-span-8" style={{ transitionDelay: "120ms" }}>
          <p className="t-lead max-w-2xl text-ink/70">
            I&apos;m Abdullah Imdad Lakho, a BS Artificial Intelligence student at
            Dawood University of Engineering and Technology (DUET), Karachi. I&apos;m
            at the beginning of my journey in technology, focused on developing a
            strong foundation in programming, artificial intelligence,
            problem-solving, analytical thinking, mathematics and digital
            technology.
          </p>
          <p className="t-lead mt-5 max-w-2xl text-ink/70">
            My interest in AI comes from curiosity about how computers,
            algorithms, data and intelligent systems can be used to understand
            problems and create practical solutions. Alongside technical
            development, I value communication, collaboration, adaptability,
            logical thinking and continuous learning — professional growth comes
            from consistently learning, practicing, building and improving.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-7 border-t border-ink/10 pt-8 sm:mt-12 sm:grid-cols-4 sm:pt-10">
            {[
              ["BS Artificial Intelligence", "DUET, Karachi · 2026 – Present"],
              ["Intermediate", "D.J. Sindh Science College · Completed"],
              ["S.S.C.-II · Grade A1", "Noor Eastern Collegiate · 2024 · 80.36%"],
              ["AI Community / AICP – DUET", "Interested in participation & coordination"],
            ].map(([tool, level]) => (
              <div key={tool}>
                <p className="font-display text-sm font-semibold text-ink sm:text-base">{tool}</p>
                <p className="mt-1 text-xs text-ink/50 sm:text-sm">{level}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 sm:mt-14">
            <p className="mb-5 font-display text-xs font-medium uppercase tracking-widest text-ink/50 sm:text-sm">
              Currently Learning
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-3 sm:gap-x-10 sm:gap-y-4">
              {[
                "Programming & Problem-Solving",
                "AI Fundamentals",
                "Intelligent Systems",
                "Maths for Computing",
                "Computing & Technology",
                "Practical Technical Skills",
              ].map((c) => (
                <span
                  key={c}
                  className="font-serif-display text-lg italic text-ink/40 transition-colors hover:text-ink sm:text-xl"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { Palette, PenTool, Layers, Sparkles } from "lucide-react";

const skills = [
  {
    icon: Palette,
    title: "Programming Fundamentals",
    desc: "C programming fundamentals — variables, loops, conditionals, functions and basic problem-solving logic.",
  },
  {
    icon: Sparkles,
    title: "AI & Computing Foundations",
    desc: "Artificial Intelligence fundamentals, foundations of intelligent systems, and university-level computing concepts.",
  },
  {
    icon: Layers,
    title: "Data & Productivity Tools",
    desc: "Data-analysis fundamentals, plus Microsoft Word, Excel and PowerPoint for real coursework and reports.",
  },
  {
    icon: PenTool,
    title: "Thinking & Collaboration",
    desc: "Analytical thinking, logical reasoning, decision-making, communication, teamwork, adaptability, time management and continuous learning.",
  },
];

export default function Skills() {
  return (
    <section
      id="services"
      className="section-y mx-auto max-w-7xl scroll-mt-24 px-5 sm:px-6 md:px-10"
    >
      <div className="reveal max-w-2xl">
        <p className="font-display text-xs font-medium uppercase tracking-widest text-coral sm:text-sm">
          Core Skills
        </p>
        <h2 className="t-h2 mt-4 font-display font-semibold text-ink">
          Skills I'm building, one concept at a time.
        </h2>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-px sm:overflow-hidden sm:rounded-3xl sm:bg-ink/10 lg:grid-cols-4">
        {skills.map(({ icon: Icon, title, desc }, i) => (
          <div
            key={title}
            style={{ transitionDelay: `${i * 90}ms` }}
            className="reveal group rounded-2xl border border-ink/10 bg-white/50 p-6 transition-colors duration-300 hover:border-ink hover:bg-ink sm:rounded-none sm:border-0 sm:bg-cream sm:p-8 sm:hover:bg-ink"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink text-cream transition-colors group-hover:bg-coral group-hover:text-ink sm:h-12 sm:w-12">
              <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <h3 className="t-h3 mt-5 font-display font-semibold text-ink group-hover:text-cream sm:mt-6">
              {title}
            </h3>
            <p className="t-body mt-3 text-ink/60 group-hover:text-cream/70">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

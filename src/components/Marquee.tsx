const words = [
  "Artificial Intelligence",
  "Programming",
  "Problem Solving",
  "Data & Analytics",
  "Analytical Thinking",
  "Communication",
];

export default function Marquee() {
  const loop = [...words, ...words];
  return (
    <div className="marquee-wrap overflow-hidden border-y border-ink/10 bg-ink py-4 sm:py-5">
      <div className="flex w-max animate-marquee gap-6 sm:gap-10">
        {loop.map((w, i) => (
          <div
            key={i}
            className="flex items-center gap-6 whitespace-nowrap font-display text-base font-medium text-cream/90 sm:gap-10 sm:text-xl"
          >
            {w}
            <span className="text-coral">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useState } from "react";
import { Mail, MapPin, Phone, Send, Check } from "lucide-react";

const socialIcons = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/abdullah-imdad-lakho-150347364/",
    external: true,
    wrapped: true,
    path: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <line x1="7.5" y1="9.5" x2="7.5" y2="16.5" />
        <circle cx="7.5" cy="6.7" r="0.6" fill="currentColor" stroke="none" />
        <path d="M11 16.5v-4a2.2 2.2 0 0 1 4.4 0v4" />
        <line x1="11" y1="9.5" x2="11" y2="16.5" />
      </>
    ),
  },
  {
    label: "Email",
    href: "mailto:abdullah17.imdad@gmail.com",
    external: false,
    wrapped: false,
    path: <Mail className="h-5 w-5" />,
  },
  {
    label: "Phone",
    href: "tel:03033313312",
    external: false,
    wrapped: false,
    path: <Phone className="h-5 w-5" />,
  },
];

const SocialIcon = ({ children }: { children: React.ReactNode }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.6}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
  >
    {children}
  </svg>
);

const fieldClass =
  "w-full rounded-xl border border-cream/15 bg-cream/5 px-4 py-3.5 text-base text-cream placeholder:text-cream/30 outline-none transition-colors focus:border-coral focus:bg-cream/10";
const labelClass = "text-[0.7rem] font-medium uppercase tracking-widest text-cream/50";

export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <section id="contact" className="section-y scroll-mt-20 bg-ink text-cream">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-5 sm:px-6 md:px-10 lg:grid-cols-12 lg:gap-16">
        <div className="reveal lg:col-span-5">
          <p className="font-display text-xs font-medium uppercase tracking-widest text-coral sm:text-sm">
            Get In Touch
          </p>
          <h2 className="t-h2 mt-4 font-display font-semibold">
            Let's connect, collaborate and keep learning.
          </h2>
          <p className="t-lead mt-5 max-w-md text-cream/60">
            Have a project, an idea, or just a question? Feel free to reach out —
            I&apos;m always happy to talk technology, collaborate, or help where I can.
          </p>

          <div className="mt-9 space-y-4">
            <a
              href="mailto:abdullah17.imdad@gmail.com"
              className="flex items-center gap-3 rounded-xl px-2 py-2 text-sm text-cream/80 transition-colors hover:text-coral sm:text-base"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cream/15">
                <Mail className="h-4 w-4" />
              </span>
              abdullah17.imdad@gmail.com
            </a>
            <a
              href="tel:03033313312"
              className="flex items-center gap-3 rounded-xl px-2 py-2 text-sm text-cream/80 transition-colors hover:text-coral sm:text-base"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cream/15">
                <Phone className="h-4 w-4" />
              </span>
              0303-3313312
            </a>
            <div className="flex items-center gap-3 px-2 py-2 text-sm text-cream/80 sm:text-base">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cream/15">
                <MapPin className="h-4 w-4" />
              </span>
              Karachi, Pakistan
            </div>
          </div>

          <div className="mt-9 flex gap-3">
            {socialIcons.map(({ label, href, external, wrapped, path }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/20 text-cream transition-colors hover:border-coral hover:bg-coral hover:text-ink active:bg-coral/20"
              >
                {wrapped ? <SocialIcon>{path}</SocialIcon> : path}
              </a>
            ))}
          </div>
        </div>

        <div className="reveal lg:col-span-7" style={{ transitionDelay: "120ms" }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="grid grid-cols-1 gap-5 rounded-3xl bg-ink-soft p-6 ring-1 ring-cream/10 sm:grid-cols-2 sm:gap-6 sm:p-8 md:p-10"
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="c-name" className={labelClass}>
                Name
              </label>
              <input
                id="c-name"
                required
                type="text"
                autoComplete="name"
                placeholder="Your name"
                className={fieldClass}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="c-email" className={labelClass}>
                Email
              </label>
              <input
                id="c-email"
                required
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder="you@email.com"
                className={fieldClass}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="c-type" className={labelClass}>
                Project Type
              </label>
              <select id="c-type" className={`${fieldClass} appearance-none bg-ink-soft`} defaultValue="Academic Project">
                <option>Academic Project</option>
                <option>Internship / Exposure</option>
                <option>Collaboration</option>
                <option>Something Else</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="c-timeframe" className={labelClass}>
                Timeframe
              </label>
              <select id="c-timeframe" className={`${fieldClass} appearance-none bg-ink-soft`} defaultValue="Flexible">
                <option>This week</option>
                <option>Within a month</option>
                <option>Flexible</option>
              </select>
            </div>
            <div className="flex flex-col gap-2 sm:col-span-2">
              <label htmlFor="c-msg" className={labelClass}>
                Message
              </label>
              <textarea
                id="c-msg"
                required
                rows={5}
                placeholder="Tell me a bit about your project..."
                className={`${fieldClass} resize-none`}
              />
            </div>

            <button
              type="submit"
              className={`group mt-1 inline-flex w-full items-center justify-center gap-2 rounded-full px-7 py-4 font-display text-sm font-medium transition-colors sm:col-span-2 sm:w-auto sm:self-start ${
                sent ? "bg-sage text-cream" : "bg-coral text-ink hover:bg-cream"
              }`}
            >
              {sent ? (
                <>
                  Thanks for reaching out! <Check className="h-4 w-4" />
                </>
              ) : (
                <>
                  Send Message
                  <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
            {sent && (
              <p className="text-sm text-cream/50 sm:col-span-2">
                I usually reply within a day or two.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

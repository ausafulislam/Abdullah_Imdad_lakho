import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  Mail,
  MapPin,
  Phone,
  Send,
  Check,
  Copy,
  ExternalLink,
  RotateCcw,
} from "lucide-react";

const EMAIL = "abdullah17.imdad@gmail.com";
const PHONE_LOCAL = "03033313312";
/** wa.me needs country code + number, with no "+", spaces, or leading zero. */
const WHATSAPP_NUMBER = "923033313312";
const WHATSAPP_BASE = `https://wa.me/${WHATSAPP_NUMBER}`;
const SITE_URL = "https://abdullah-imdad-lakho.vercel.app";
/** Keeps the composed URL comfortably inside what wa.me will accept. */
const MESSAGE_LIMIT = 1200;

type Enquiry = {
  name: string;
  email: string;
  type: string;
  timeframe: string;
  message: string;
};

function buildMessage(d: Enquiry) {
  return [
    "*New enquiry from the portfolio*",
    "",
    `Name: ${d.name}`,
    `Email: ${d.email}`,
    `Project type: ${d.type}`,
    `Timeframe: ${d.timeframe}`,
    "",
    "Message:",
    d.message,
    "",
    `— Sent from ${SITE_URL}`,
  ].join("\n");
}

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
  const [waUrl, setWaUrl] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [openFailed, setOpenFailed] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sent) panelRef.current?.focus();
  }, [sent]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fd = new FormData(e.currentTarget);
    const text = buildMessage({
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      type: String(fd.get("type") ?? "").trim(),
      timeframe: String(fd.get("timeframe") ?? "").trim(),
      message: String(fd.get("message") ?? "").trim(),
    }).slice(0, MESSAGE_LIMIT);

    const url = `${WHATSAPP_BASE}?text=${encodeURIComponent(text)}`;
    setMessage(text);
    setWaUrl(url);
    setOpenFailed(false);
    setSent(true);

    // Runs inside the click gesture, so popup blockers allow it. If it is
    // blocked, the confirmation panel still offers a manual link.
    const win = window.open(url, "_blank", "noopener,noreferrer");
    if (!win) setOpenFailed(true);
  };

  const copyMessage = async () => {
    const ok = await (async () => {
      try {
        await navigator.clipboard.writeText(message);
        return true;
      } catch {
        // Clipboard API blocked or unavailable — fall back to execCommand.
        const ta = document.createElement("textarea");
        ta.value = message;
        ta.setAttribute("readonly", "");
        ta.style.cssText = "position:fixed;top:0;left:0;opacity:0";
        document.body.appendChild(ta);
        ta.select();
        try {
          return document.execCommand("copy");
        } catch {
          return false;
        } finally {
          document.body.removeChild(ta);
        }
      }
    })();

    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const reset = () => {
    setSent(false);
    setWaUrl("");
    setMessage("");
    setCopied(false);
    setOpenFailed(false);
  };

  const mailtoHref = `mailto:${EMAIL}?subject=${encodeURIComponent(
    "Portfolio enquiry",
  )}&body=${encodeURIComponent(message)}`;

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
              href={`mailto:${EMAIL}`}
              className="flex items-center gap-3 rounded-xl px-2 py-2 text-sm text-cream/80 transition-colors hover:text-coral sm:text-base"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cream/15">
                <Mail className="h-4 w-4" />
              </span>
              {EMAIL}
            </a>
            <a
              href={`tel:${PHONE_LOCAL}`}
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
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-5 rounded-3xl bg-ink-soft p-6 ring-1 ring-cream/10 sm:grid-cols-2 sm:gap-6 sm:p-8 md:p-10"
          >
            {!sent && (
              <>
                <div className="flex flex-col gap-2">
                  <label htmlFor="c-name" className={labelClass}>
                    Name
                  </label>
                  <input
                    id="c-name"
                    name="name"
                    required
                    type="text"
                    autoComplete="name"
                    maxLength={80}
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
                    name="email"
                    required
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    maxLength={120}
                    placeholder="you@email.com"
                    className={fieldClass}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="c-type" className={labelClass}>
                    Project Type
                  </label>
                  <select
                    id="c-type"
                    name="type"
                    className={`${fieldClass} appearance-none bg-ink-soft`}
                    defaultValue="Academic Project"
                  >
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
                  <select
                    id="c-timeframe"
                    name="timeframe"
                    className={`${fieldClass} appearance-none bg-ink-soft`}
                    defaultValue="Flexible"
                  >
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
                    name="message"
                    required
                    rows={5}
                    maxLength={MESSAGE_LIMIT}
                    placeholder="Tell me a bit about your project..."
                    className={`${fieldClass} resize-none`}
                  />
                </div>

                <button
                  type="submit"
                  className="group mt-1 inline-flex w-full items-center justify-center gap-2 rounded-full bg-coral px-7 py-4 font-display text-sm font-medium text-ink transition-colors hover:bg-cream sm:col-span-2 sm:w-auto sm:self-start"
                >
                  Send via WhatsApp
                  <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </>
            )}

            {sent && (
              <div ref={panelRef} tabIndex={-1} className="sm:col-span-2">
                <div
                  role="status"
                  aria-live="polite"
                  className="rounded-2xl border border-sage/40 bg-sage/10 p-5 outline-none sm:p-6"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sage text-cream">
                      <Check className="h-4 w-4" />
                    </span>
                    <div>
                      <h3 className="font-display text-base font-semibold text-cream">
                        {openFailed
                          ? "Your browser blocked the WhatsApp tab"
                          : "WhatsApp should have opened in a new tab"}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-cream/60">
                        Press send in WhatsApp to deliver this. If nothing
                        opened, use the buttons below &mdash; nothing is sent
                        until you do.
                      </p>
                    </div>
                  </div>

                  <pre className="mt-5 max-h-56 overflow-y-auto whitespace-pre-wrap break-words rounded-xl border border-cream/10 bg-ink/50 p-4 font-body text-xs leading-relaxed text-cream/70">
                    {message}
                  </pre>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-coral px-6 py-3 font-display text-sm font-medium text-ink transition-colors hover:bg-cream"
                    >
                      Open WhatsApp
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <button
                      type="button"
                      onClick={copyMessage}
                      className="inline-flex items-center gap-2 rounded-full border border-cream/20 px-6 py-3 font-display text-sm font-medium text-cream transition-colors hover:border-coral hover:text-coral"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      {copied ? "Copied" : "Copy message"}
                    </button>
                    <a
                      href={mailtoHref}
                      className="inline-flex items-center gap-2 rounded-full border border-cream/20 px-6 py-3 font-display text-sm font-medium text-cream transition-colors hover:border-coral hover:text-coral"
                    >
                      <Mail className="h-4 w-4" />
                      Email instead
                    </a>
                    <button
                      type="button"
                      onClick={reset}
                      className="inline-flex items-center gap-2 rounded-full border border-cream/20 px-6 py-3 font-display text-sm font-medium text-cream transition-colors hover:border-coral hover:text-coral"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Edit message
                    </button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

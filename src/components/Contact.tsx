import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import {
  ArrowRight,
  Check,
  Copy,
  ExternalLink,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  RotateCcw,
  Send,
  X,
} from "lucide-react";
import { CONTACT, MAILTO_URL, PROFILE, WHATSAPP_URL } from "../data/portfolio";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from "../lib/gsap";
import { cn } from "../utils/cn";

/** Keeps the composed URL comfortably inside what wa.me will accept. */
const MESSAGE_LIMIT = 1200;

const ENQUIRY_TYPES = ["Academic Project", "Internship / Exposure", "Collaboration", "Something Else"];
const TIMEFRAMES = ["This week", "Within a month", "Flexible"];

type Enquiry = { name: string; email: string; type: string; timeframe: string; message: string };

const EMPTY: Enquiry = { name: "", email: "", type: ENQUIRY_TYPES[0], timeframe: "Flexible", message: "" };

function buildMessage(d: Enquiry) {
  return [
    "*New enquiry from the portfolio*",
    "",
    `Name: ${d.name.trim()}`,
    `Email: ${d.email.trim()}`,
    `Enquiry type: ${d.type}`,
    `Timeframe: ${d.timeframe}`,
    "",
    "Message:",
    d.message.trim(),
    "",
    `— Sent from ${PROFILE.siteUrl}`,
  ]
    .join("\n")
    .slice(0, MESSAGE_LIMIT);
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Clipboard API blocked or unavailable — fall back to execCommand.
    const ta = document.createElement("textarea");
    ta.value = text;
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
}

const fieldClass =
  "w-full rounded-xl border border-white/12 bg-white/[0.04] px-4 py-3 text-[0.9375rem] text-white placeholder:text-white/35 outline-none transition-colors focus:border-lime focus:bg-white/[0.07]";
const labelClass = "text-[0.8125rem] font-medium text-white/70";

export default function Contact() {
  const root = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [values, setValues] = useState<Enquiry>(EMPTY);
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [openFailed, setOpenFailed] = useState(false);

  const waUrl = `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`;
  const mailtoHref = `${MAILTO_URL}?subject=${encodeURIComponent("Portfolio enquiry")}&body=${encodeURIComponent(message)}`;

  // ---- Scroll reveal: banner rises, then its content, then the CTA settles ----
  const { contextSafe } = useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap
          .timeline({ scrollTrigger: { trigger: "[data-contact='banner']", start: "top 85%", once: true } })
          .from("[data-contact='banner']", { y: 40, opacity: 0, duration: 0.9 })
          .from("[data-contact='item']", { y: 18, opacity: 0, duration: 0.6, stagger: 0.08 }, "-=0.45")
          .from("[data-contact='cta']", { scale: 0.94, opacity: 0, duration: 0.6, ease: "power2.out" }, "-=0.35");
      });
    },
    { scope: root },
  );

  // Panel open/close changes the page height: re-measure triggers, fade the panel in.
  // (contextSafe returns a new wrapper per call, so create it once.)
  const revealPanel = useMemo(
    () =>
      contextSafe(() => {
        ScrollTrigger.refresh();
        if (!panelRef.current || !window.matchMedia(MOTION_OK).matches) return;
        gsap.fromTo(panelRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" });
      }),
    [contextSafe],
  );

  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (!formOpen) {
      ScrollTrigger.refresh();
      return;
    }
    revealPanel();
    if (sent) statusRef.current?.focus();
    else firstFieldRef.current?.focus({ preventScroll: true });
  }, [formOpen, sent, revealPanel]);

  const update = (key: keyof Enquiry) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = buildMessage(values);
    const url = `${WHATSAPP_URL}?text=${encodeURIComponent(text)}`;
    setMessage(text);
    setCopied(false);
    setOpenFailed(false);
    setSent(true);
    // Runs inside the submit gesture, so popup blockers allow it. If it is
    // blocked, the confirmation panel still offers a manual link.
    const win = window.open(url, "_blank", "noopener,noreferrer");
    if (!win) setOpenFailed(true);
  };

  const handleCopy = async () => {
    if (await copyText(message)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    }
  };

  const editMessage = () => {
    setSent(false);
    setCopied(false);
    setOpenFailed(false);
  };

  return (
    <section ref={root} id="contact" aria-labelledby="contact-title" className="section-y">
      <div className="shell">
        <div
          data-contact="banner"
          className="on-dark rounded-[24px] bg-night px-6 py-10 text-white sm:px-10 sm:py-12 lg:px-14 lg:py-14"
        >
          <div className="grid gap-7 lg:grid-cols-[1.2fr_auto_1fr_auto] lg:items-center lg:gap-10">
            <h2 id="contact-title" data-contact="item" className="t-h2 max-w-[28rem] text-white">
              Let&apos;s connect, collaborate and <span className="text-lime">keep learning.</span>
            </h2>
            <span aria-hidden="true" className="hidden h-20 w-px bg-white/15 lg:block" />
            <p data-contact="item" className="max-w-[28rem] text-[0.9375rem] leading-relaxed text-white/65">
              Have a project, an idea, or just a question? Feel free to reach out. I&apos;m always happy to talk
              technology, collaborate, or help where I can.
            </p>
            <div data-contact="cta" className="flex flex-wrap gap-3 lg:flex-col lg:items-stretch">
              <button
                type="button"
                aria-expanded={formOpen}
                aria-controls="contact-panel"
                onClick={() => setFormOpen((v) => !v)}
                className="btn btn-lime"
              >
                {formOpen ? "Close form" : "Get In Touch"}
                {formOpen ? (
                  <X className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <ArrowRight className="btn-arrow h-4 w-4" aria-hidden="true" />
                )}
              </button>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-dark">
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Send via WhatsApp<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </div>

          <ul
            data-contact="item"
            className="mt-9 flex flex-col gap-3 border-t border-white/10 pt-7 text-[0.9375rem] sm:flex-row sm:flex-wrap sm:gap-x-9"
          >
            <li>
              <a href={MAILTO_URL} className="group inline-flex items-center gap-3 text-white/80 transition-colors hover:text-white">
                <Mail className="h-4 w-4 text-lime" aria-hidden="true" />
                <span className="break-all">{CONTACT.email}</span>
              </a>
            </li>
            <li>
              <a href={CONTACT.phoneHref} className="inline-flex items-center gap-3 text-white/80 transition-colors hover:text-white">
                <Phone className="h-4 w-4 text-lime" aria-hidden="true" />
                {CONTACT.phoneDisplay}
              </a>
            </li>
            <li className="inline-flex items-center gap-3 text-white/80">
              <MapPin className="h-4 w-4 text-lime" aria-hidden="true" />
              {CONTACT.location}
            </li>
          </ul>

          {/* Enquiry form → hands the composed message to WhatsApp (nothing is sent from this site). */}
          <div id="contact-panel" ref={panelRef} hidden={!formOpen} className="mt-8 border-t border-white/10 pt-8">
            {!sent ? (
              <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="c-name" className={labelClass}>
                    Name
                  </label>
                  <input
                    ref={firstFieldRef}
                    id="c-name"
                    name="name"
                    required
                    type="text"
                    autoComplete="name"
                    maxLength={80}
                    placeholder="Your name"
                    value={values.name}
                    onChange={update("name")}
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
                    value={values.email}
                    onChange={update("email")}
                    className={fieldClass}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="c-type" className={labelClass}>
                    Enquiry type
                  </label>
                  <select
                    id="c-type"
                    name="type"
                    value={values.type}
                    onChange={update("type")}
                    className={cn(fieldClass, "appearance-none [&>option]:bg-night")}
                  >
                    {ENQUIRY_TYPES.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="c-timeframe" className={labelClass}>
                    Timeframe
                  </label>
                  <select
                    id="c-timeframe"
                    name="timeframe"
                    value={values.timeframe}
                    onChange={update("timeframe")}
                    className={cn(fieldClass, "appearance-none [&>option]:bg-night")}
                  >
                    {TIMEFRAMES.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <div className="flex items-baseline justify-between gap-3">
                    <label htmlFor="c-msg" className={labelClass}>
                      Message
                    </label>
                    <span className="text-xs text-white/40" aria-hidden="true">
                      {values.message.length}/{MESSAGE_LIMIT}
                    </span>
                  </div>
                  <textarea
                    id="c-msg"
                    name="message"
                    required
                    rows={5}
                    maxLength={MESSAGE_LIMIT}
                    placeholder="Tell me a bit about your idea or question..."
                    value={values.message}
                    onChange={update("message")}
                    data-lenis-prevent
                    className={cn(fieldClass, "resize-none")}
                  />
                </div>
                <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center">
                  <button type="submit" className="btn btn-lime">
                    Send enquiry
                    <Send className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <p className="text-sm text-white/50">Opens WhatsApp with your message pre-filled.</p>
                </div>
              </form>
            ) : (
              <div
                ref={statusRef}
                tabIndex={-1}
                role="status"
                aria-live="polite"
                className="rounded-2xl border border-white/12 bg-white/[0.03] p-5 sm:p-6"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lime text-ink">
                    <Check className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-white">
                      {openFailed
                        ? "Your browser blocked the WhatsApp tab"
                        : "WhatsApp should have opened in a new tab"}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/60">
                      Press send in WhatsApp to deliver this. If nothing opened, use the buttons below — nothing is
                      sent until you do.
                    </p>
                  </div>
                </div>

                <pre
                  data-lenis-prevent
                  className="mt-5 max-h-56 overflow-y-auto whitespace-pre-wrap break-words rounded-xl border border-white/10 bg-black/40 p-4 font-sans text-xs leading-relaxed text-white/70"
                >
                  {message}
                </pre>

                <div className="mt-5 flex flex-wrap gap-3">
                  <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn btn-lime btn-sm">
                    Open WhatsApp
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </a>
                  <button type="button" onClick={handleCopy} className="btn btn-ghost-dark btn-sm">
                    {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
                    {copied ? "Copied" : "Copy message"}
                  </button>
                  <a href={mailtoHref} className="btn btn-ghost-dark btn-sm">
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    Email instead
                  </a>
                  <button type="button" onClick={editMessage} className="btn btn-ghost-dark btn-sm">
                    <RotateCcw className="h-4 w-4" aria-hidden="true" />
                    Edit message
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

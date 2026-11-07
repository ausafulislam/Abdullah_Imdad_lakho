import { useRef } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { HERO_STATS, PROFILE } from "../data/portfolio";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from "../lib/gsap";
import { cn } from "../utils/cn";

/** When the stats fade in, in seconds on the intro timeline. */
const STATS_AT = 0.95;

/** 1×1 transparent GIF: what phones "load" instead of the portrait (see <picture> below). */
const BLANK =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  // Entrance: pill → heading → title/description → CTAs → stats → portrait.
  // Selectors are scoped to this section by useGSAP; matchMedia skips it all
  // for reduced motion, and everything is reverted on unmount.
  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        const tl = gsap.timeline({ delay: 0.2, defaults: { ease: "power3.out" } });
        tl.from("[data-hero='pill']", { y: 12, opacity: 0, duration: 0.6 })
          .from("[data-hero='line']", { yPercent: 110, duration: 1, stagger: 0.09, ease: "power4.out" }, 0.2)
          .from("[data-hero='copy']", { y: 18, opacity: 0, duration: 0.7, stagger: 0.08 }, 0.55)
          .from("[data-hero='cta']", { y: 16, opacity: 0, duration: 0.6, stagger: 0.08 }, 0.8)
          .from("[data-hero='stat']", { y: 16, opacity: 0, duration: 0.6, stagger: 0.1 }, STATS_AT)
          .from("[data-hero='portrait']", { y: 32, opacity: 0, duration: 1.2 }, 0.75);

        // ---- Stats count-up: 0 → real value, once, when the stats are revealed AND on screen.
        // The HTML always holds the final numbers (crawlers, no-JS, reduced motion);
        // they are zeroed here, before the first paint, and restored on cleanup.
        const stats = root.current?.querySelector<HTMLElement>("[data-hero='stats']");
        const counters = gsap.utils
          .toArray<HTMLElement>("[data-hero='count']")
          .map((el) => ({ el, end: Number(el.dataset.value), v: 0 }));
        const showFinal = () => counters.forEach((c) => (c.el.textContent = String(c.end)));
        if (!stats || counters.some((c) => !Number.isFinite(c.end))) return showFinal;

        counters.forEach((c) => (c.el.textContent = "0"));
        const count = gsap.timeline({ paused: true });
        counters.forEach((c, i) => {
          count.to(
            c,
            {
              v: c.end,
              duration: 1.8,
              ease: "power2.out",
              onUpdate: () => {
                c.el.textContent = String(Math.round(c.v));
              },
            },
            i * 0.12,
          );
        });

        let revealed = false;
        let seen = false;
        const maybeStart = () => {
          if (revealed && seen && !count.isActive() && count.progress() === 0) count.play();
        };
        const markSeen = () => {
          seen = true;
          maybeStart();
        };
        tl.call(
          () => {
            revealed = true;
            // Page opened below the hero (e.g. /#contact): count now, so the numbers
            // are final by the time the visitor scrolls back up.
            if (stats.getBoundingClientRect().bottom < 0) seen = true;
            maybeStart();
          },
          undefined,
          STATS_AT,
        );
        ScrollTrigger.create({ trigger: stats, start: "top 90%", once: true, onEnter: markSeen, onLeave: markSeen });

        return showFinal;
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="top" aria-labelledby="hero-title" className="relative pt-[var(--header-h)]">
      <div className="shell grid items-end gap-x-10 md:grid-cols-[1.1fr_0.9fr] lg:gap-x-14">
        {/* Copy */}
        <div className="pb-8 pt-8 sm:pt-12 md:self-center md:pb-16 md:pt-10 lg:pb-20">
          <p
            data-hero="pill"
            className="inline-flex items-center gap-2 rounded-full border border-line bg-[#fafafa] py-1.5 pl-3 pr-3.5 text-[0.8125rem] font-medium text-ink"
          >
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-lime" />
            Available for internships &amp; collaboration
          </p>

          <h1 id="hero-title" className="t-display mt-6 md:mt-7">
            <span className="block overflow-hidden pb-[0.07em]">
              <span data-hero="line" className="block">
                {PROFILE.firstName}
              </span>
            </span>{" "}
            <span className="-mt-[0.07em] block overflow-hidden pb-[0.07em]">
              <span data-hero="line" className="block text-muted">
                {PROFILE.lastName}
              </span>
            </span>
          </h1>

          <p
            data-hero="copy"
            className="mt-5 text-[1.1875rem] font-semibold tracking-[-0.02em] sm:text-[1.3125rem] lg:mt-6 lg:text-[1.4375rem]"
          >
            {PROFILE.title}
          </p>
          <p data-hero="copy" className="t-lead mt-3 max-w-[25rem] text-muted">
            {PROFILE.tagline}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a data-hero="cta" href="#work" className="btn btn-lime max-sm:px-[1.125rem] max-sm:text-[0.875rem]">
              Areas of Interest
              <ArrowRight className="btn-arrow h-4 w-4" aria-hidden="true" />
            </a>
            <a data-hero="cta" href="#about" className="btn btn-outline group pl-1.5 max-sm:pr-[1.125rem] max-sm:text-[0.875rem]">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-line transition-colors group-hover:border-ink sm:h-9 sm:w-9">
                <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </span>
              Scroll Down
            </a>
          </div>

          <dl data-hero="stats" className="mt-10 grid max-w-[30rem] grid-cols-3 lg:mt-12">
            {HERO_STATS.map((stat, i) => (
              <div
                key={stat.label}
                data-hero="stat"
                className={cn("flex flex-col", i > 0 && "border-l border-line pl-4 sm:pl-6", i < 2 && "pr-3")}
              >
                <dt className="order-2 mt-1 text-[0.8125rem] leading-snug text-muted">{stat.label}</dt>
                <dd className="order-1 text-[1.5rem] font-bold leading-none tracking-[-0.03em] tabular-nums sm:text-[1.625rem]">
                  <span className="sr-only">
                    {stat.value}
                    {stat.suffix}
                  </span>
                  <span aria-hidden="true">
                    <span data-hero="count" data-value={stat.value}>
                      {stat.value}
                    </span>
                    {stat.suffix}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Portrait — tablet and up. Phones get a text-only hero and download nothing:
            the WebP <source> is media-gated and the <img> fallback is an inline 1×1 GIF.
            The light disc is part of the image, so the hoodie is trimmed exactly on its arc. */}
        <div data-hero="portrait" className="hidden md:block md:self-center md:py-8 lg:py-10">
          <picture>
            <source
              media="(min-width: 48rem)"
              type="image/webp"
              srcSet="/images/abdullah-hero-portrait-640.webp 640w, /images/abdullah-hero-portrait.webp 960w"
              sizes="(min-width: 80rem) 33rem, 42vw"
            />
            <img
              src={BLANK}
              alt="Black-and-white portrait of Abdullah Imdad Lakho, BS Artificial Intelligence student at DUET Karachi"
              width={960}
              height={1200}
              fetchPriority="high"
              decoding="async"
              className="ml-auto block h-auto w-full max-w-[33rem]"
            />
          </picture>
        </div>
      </div>
    </section>
  );
}

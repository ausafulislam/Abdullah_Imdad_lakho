<div align="center">

# Abdullah Imdad

**BS Artificial Intelligence student at DUET, Karachi** — a single-page personal portfolio
built with React, TypeScript and Tailwind CSS.

[![Live](https://img.shields.io/badge/live-abdullah--imdad--lakho.vercel.app-b7f332?style=flat-square)](https://abdullah-imdad-lakho.vercel.app/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vercel](https://img.shields.io/badge/hosted-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com)
[![Audit](https://img.shields.io/badge/npm_audit-0_vulnerabilities-4CAF50?style=flat-square)](https://github.com/ausafulislam/Abdullah_Imdad_lakho)
[![License](https://img.shields.io/badge/license-all_rights_reserved-8a8a8a?style=flat-square)](#license)

[**View the site**](https://abdullah-imdad-lakho.vercel.app/) ·
[**Source**](https://github.com/ausafulislam/Abdullah_Imdad_lakho) ·
[**Report an issue**](https://github.com/ausafulislam/Abdullah_Imdad_lakho/issues)

</div>

---

## Why this build is unusual

The whole application compiles into **one self-contained `index.html`** — every byte of
JavaScript and CSS is inlined (~448 kB, ~146 kB gzipped, including GSAP and Lenis). There is
no server runtime, no chunk loading, and no `dist/assets/` directory; images, the font and
icons are plain files copied from `public/`. Drop `dist/` on any static host and it works.

## Stack

| Concern | Choice |
| --- | --- |
| UI | [React](https://react.dev) 19.2.6 |
| Language | [TypeScript](https://www.typescriptlang.org) 5.9.3 (strict) |
| Build | [Vite](https://vite.dev) 7.3.7 + `vite-plugin-singlefile` |
| Styling | [Tailwind CSS](https://tailwindcss.com) 4.1.17 (CSS-first) |
| Motion | [GSAP](https://gsap.com) 3.15 + ScrollTrigger, via `@gsap/react` 2.1 (`useGSAP`) |
| Smooth scroll | [Lenis](https://github.com/darkroomengineering/lenis) 1.3, driven by GSAP's ticker |
| Font | Plus Jakarta Sans (variable, self-hosted, SIL OFL) |
| Icons | [lucide-react](https://lucide.dev) 1.44.0 |
| Hosting | [Vercel](https://vercel.com) |

Tailwind v4 is configured **CSS-first** — there is no `tailwind.config.js`. Design tokens live
in `@theme` at the top of `src/index.css`.

## Getting started

Requires **Node 20.19+ or 22.12+** (Vite 7) and **npm 10+**.

```bash
npm install     # install dependencies
npm run dev     # dev server on http://localhost:5173
```

```bash
npx tsc --noEmit   # 1. type-check
npm run build      # 2. build to dist/
npm run preview    # 3. serve dist/ as production will
```

> **`npm run build` does not type-check.** Vite strips types with esbuild, so a type error will
> not fail the build. Always run `npx tsc --noEmit` first.

| Script | Does |
| --- | --- |
| `npm run dev` | Dev server with HMR on `localhost` only |
| `npm run build` | Bundles to `dist/` |
| `npm run preview` | Serves the built `dist/` |

## Structure

```
index.html            # SEO head: meta, Open Graph, JSON-LD, font + hero preloads
public/
  404.html            # self-contained 404 (no JS, no external CSS)
  robots.txt  sitemap.xml  favicon.svg  apple-touch-icon.png
  llms.txt            # AI-assistant overview
  llms-full.txt       # AI-assistant extended reference
  fonts/              # Plus Jakarta Sans variable woff2 + OFL licence
  images/             # see "Images" below
src/
  main.tsx            # entry point, wrapped in ErrorBoundary
  App.tsx             # section order, smooth-scroll provider
  index.css           # Tailwind import, @theme tokens, component classes
  data/portfolio.ts   # <- edit this first
  hooks/usePortfolio.ts
  lib/gsap.ts         # GSAP + ScrollTrigger setup, shared reveal presets
  components/
    Navbar Hero About Work Process Achievements Contact Footer
    SmoothScroll ErrorBoundary icons
```

### Images

| File | Used for |
| --- | --- |
| `abdullah-hero-portrait.webp` (+ `-640`) | Hero, tablet and desktop. An AI-generated black-and-white studio portrait, created with Abdullah's own photo (`avatar.jpeg`) as the reference; background removed and the light disc baked in. Phones show a text-only hero and never download it. |
| `abdullah-about.webp` | About section — his real photo (`avatar.jpeg`), cropped and converted to black and white |
| `avatar.jpeg` | Original photo; also the `Person` image in the JSON-LD |
| `og-image.png` | 1200×630 social card |
| `hero-portrait.png`, `interest-*.svg` | Artwork from the previous design — kept, currently unused |

## Customising

**Start with `src/data/portfolio.ts`** — almost all copy reads from it: profile, hero stats,
About text and education, Areas of Interest, skill groups, learning steps, achievements and
contact details. Section headings live in their components.

| Want to change | Edit |
| --- | --- |
| Any profile, section or contact content | `src/data/portfolio.ts` |
| Email, phone, WhatsApp number, LinkedIn | `CONTACT` in `src/data/portfolio.ts` |
| Colours, type scale, buttons | `@theme` and component classes in `src/index.css` |
| Animation presets | `src/lib/gsap.ts`; each section's `useGSAP` block |
| Builder credit | `Footer.tsx` |

### Contact form

The form has **no backend**. Submitting composes the enquiry and opens
`https://wa.me/923033313312` in a new tab, where the visitor presses send. The site transmits
nothing itself, and the confirmation panel offers copy-to-clipboard and `mailto:` fallbacks
for blocked tabs or missing WhatsApp. To use a real form service instead, replace
`handleSubmit` in `src/components/Contact.tsx`.

## SEO

Hand-written metadata in `index.html`: canonical URL, Open Graph and Twitter cards, and
JSON-LD describing a `WebSite` plus a `Person`. Paired with `public/sitemap.xml`,
`public/robots.txt` and a 1200×630 `og-image.png`.

There are also `llms.txt` and `llms-full.txt`, an experimental format that helps AI assistants
describe the owner accurately. It does **not** affect Google rankings.

When changing the domain, update all three: the canonical and `og:url` tags in `index.html`,
every URL in `sitemap.xml`, and both `llms` files.

**If you replace `og-image.png`, bump the `?v=` query string** on `og:image` and
`twitter:image` in `index.html`. LinkedIn, Facebook and WhatsApp cache these images for a long
time and will keep serving the old card otherwise.

## Design system

Minimal and monochrome, with one accent.

| Token | Value | Used for |
| --- | --- | --- |
| `ink` | `#111111` | Text, dark buttons |
| `muted` | `#767676` | Secondary text (AA on white) |
| `line` | `#eaeaea` | Borders and dividers |
| `mist` | `#f4f4f4` | Icon tiles, the hero disc |
| `lime` | `#b7f332` | Accent only: primary buttons, active nav indicator, small lines — never text on white |
| `night` | `#080808` | Contact banner |

Type: **Plus Jakarta Sans** (variable 200–800, self-hosted and preloaded, with a
metric-matched fallback). Radii: cards 14px, images 18px, banner 24px, buttons fully rounded.

**Motion.** GSAP + ScrollTrigger run through `useGSAP` (automatic cleanup, StrictMode-safe),
and Lenis smooth scrolling is driven by GSAP's ticker, so there is a single animation loop.
Every animation lives inside `gsap.matchMedia()` behind a `prefers-reduced-motion:
no-preference` query: with reduced motion there is no Lenis and no animation. Nothing is
hidden by CSS — initial states are set by GSAP at runtime — and only transform and opacity
animate (no pinning, no scroll-jacking on touch).

## Accessibility and performance

- One `<h1>`, then a logical `h2` → `h3` hierarchy; nav marks the current section with
  `aria-current`.
- On tablet and desktop the hero portrait is the LCP image: preloaded (media-gated
  `imagesrcset`) with `fetchPriority="high"`, served as 640/960 px WebP. Phones get a
  text-only hero and download no portrait at all. Below-fold images are lazy and
  `decoding="async"`.
- Form inputs use real `<label for>` with native validation, and the WhatsApp confirmation
  panel is announced via `aria-live`.
- A render crash shows a styled recovery page instead of a blank screen; an unknown URL shows
  a branded 404.

## Security

- The dev server binds to `localhost` only. Do not pass `--host` on an untrusted network.
- No analytics, tracking, cookies or third-party scripts, and no external resources at all —
  the font is self-hosted.
- The contact form posts nowhere; it only builds a `wa.me` link from text the visitor typed.
- Content was audited for Trojan Source, hidden Unicode and XSS sinks — none found.
- `npm audit` reports 0 vulnerabilities (101 packages audited). Use `npm ci` in CI to
  install exactly the locked tree.

## FAQ

**The contact form says "sent" but nothing arrives. Why?**
It doesn't claim to send. It opens WhatsApp with your message written out, and you press send
there. The site has no server.

**Does `llms.txt` improve Google rankings?**
No. It is an experimental proposal no search engine uses for ranking.

**I broke a link. What should I do?**
Send it to [abdullah17.imdad@gmail.com](mailto:abdullah17.imdad@gmail.com) and it will be fixed.

## Acknowledgements

[Vite](https://vite.dev), [React](https://react.dev), [Tailwind CSS](https://tailwindcss.com),
[lucide](https://lucide.dev), [GSAP](https://gsap.com),
[Lenis](https://github.com/darkroomengineering/lenis), and Plus Jakarta Sans (Tokotype,
SIL Open Font License).
Built by [Ausaf](https://ausafulislam.vercel.app).

## Author

**Abdullah Imdad** (Abdullah Imdad Lakho) — BS Artificial Intelligence, Dawood University of
Engineering & Technology, Karachi. Open to internships and collaboration.

- Website: <https://abdullah-imdad-lakho.vercel.app/>
- Email: [abdullah17.imdad@gmail.com](mailto:abdullah17.imdad@gmail.com)
- LinkedIn: [linkedin.com/in/abdullah-imdad-lakho-150347364](https://www.linkedin.com/in/abdullah-imdad-lakho-150347364/)
- Phone: +92-303-3313312

## License

Personal portfolio. **All rights reserved** by the author — not published under an open-source
licence.

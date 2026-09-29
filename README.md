<div align="center">

# Abdullah Imdad

**BS Artificial Intelligence student at DUET, Karachi** — a single-page personal portfolio
built with React, TypeScript and Tailwind CSS.

[![Live](https://img.shields.io/badge/live-abdullah--imdad--lakho.vercel.app-ff5a3c?style=flat-square)](https://abdullah-imdad-lakho.vercel.app/)
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
JavaScript and CSS is inlined (~301 kB, ~86 kB gzipped). There is no server runtime, no
chunk loading, and no `dist/assets/` directory. Drop the file on any static host and it
works.

## Stack

| Concern | Choice |
| --- | --- |
| UI | [React](https://react.dev) 19.2.6 |
| Language | [TypeScript](https://www.typescriptlang.org) 5.9.3 (strict) |
| Build | [Vite](https://vite.dev) 7.3.6 + `vite-plugin-singlefile` |
| Styling | [Tailwind CSS](https://tailwindcss.com) 4.1.17 (CSS-first) |
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
index.html            # SEO head: meta, Open Graph, JSON-LD, fonts
public/
  404.html            # self-contained 404 (no JS, no external CSS)
  robots.txt  sitemap.xml  favicon.svg
  llms.txt            # AI-assistant overview
  llms-full.txt       # AI-assistant extended reference
  images/             # avatar.jpeg, hero-portrait.png, og-image.png, interest-*.svg
src/
  main.tsx            # entry point, wrapped in ErrorBoundary
  App.tsx             # section order
  index.css           # Tailwind import, @theme tokens, component classes
  data/portfolio.ts   # <- edit this first
  hooks/usePortfolio.ts
  components/
    Navbar Hero Marquee About Skills Work Process Testimonials
    Contact ErrorBoundary Footer
```

## Customising

**Start with `src/data/portfolio.ts`** — Areas of Interest cards, skill groups and social
links all read from it. Prose that lives inside a component is edited in that component.

| Want to change | Edit |
| --- | --- |
| Interest cards, skills, socials | `src/data/portfolio.ts` |
| Hero, About, achievements copy | the matching file in `src/components/` |
| Colours and fonts | `@theme` in `src/index.css` |
| Email, phone, WhatsApp number | `Contact.tsx` constants; `Footer.tsx` |
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

## Design system

| Token | Value | Used for |
| --- | --- | --- |
| `ink` | `#14120f` | Dark section backgrounds |
| `cream` | `#f6f1e7` | Light backgrounds, text on dark |
| `coral` | `#ff5a3c` | Accent, hover states |
| `gold` | `#d9a441` | Eyebrow labels |
| `sage` | `#7c8b6f` | Success states |

Type: **Space Grotesk** for display, **Inter** for body, **Playfair Display** for serif accents.
Reveal animations respect `prefers-reduced-motion`.

## Accessibility and performance

- One `<h1>`, then a logical `h2` → `h3` hierarchy; nav marks the current section with
  `aria-current`.
- The hero is the LCP element, so it loads eagerly with `fetchPriority="high"`; below-fold
  images are lazy and `decoding="async"`.
- Form inputs use real `<label for>` with native validation, and the WhatsApp confirmation
  panel is announced via `aria-live`.
- A render crash shows a styled recovery page instead of a blank screen; an unknown URL shows
  a branded 404.

## Security

- The dev server binds to `localhost` only. Do not pass `--host` on an untrusted network.
- No analytics, tracking, cookies or third-party scripts. The only external resource is the
  Google Fonts stylesheet.
- The contact form posts nowhere; it only builds a `wa.me` link from text the visitor typed.
- Content was audited for Trojan Source, hidden Unicode and XSS sinks — none found.
- `npm audit` reports 0 vulnerabilities across 166 locked packages. Use `npm ci` in CI to
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
[lucide](https://lucide.dev), and Google Fonts for Space Grotesk, Inter and Playfair Display.
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

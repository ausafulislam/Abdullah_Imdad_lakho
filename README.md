# Abdullah Imdad — Personal Portfolio

A single-page portfolio site for **Abdullah Imdad** (also written as **Abdullah Imdad Lakho**), a
Bachelor of Science student in **Artificial Intelligence** at **Dawood University of Engineering &
Technology (DUET), Karachi**.

Live site: <https://abdullah-imdad-lakho.vercel.app/>

The build compiles the entire app into **one self-contained `index.html`** — JavaScript and CSS are
inlined — so it can be hosted anywhere static (Vercel, Netlify, GitHub Pages, S3, or plain nginx)
with no server runtime.

---

## Table of contents

- [Tech stack](#tech-stack)
- [Requirements](#requirements)
- [Quick start](#quick-start)
- [Available scripts](#available-scripts)
- [Project structure](#project-structure)
- [Customising the content](#customising-the-content)
- [Images](#images)
- [SEO](#seo)
- [Deploying](#deploying)
- [Design system](#design-system)
- [Accessibility notes](#accessibility-notes)
- [Performance notes](#performance-notes)
- [Troubleshooting](#troubleshooting)
- [Security](#security)
- [License](#license)

---

## Tech stack

| Concern | Choice | Version |
| --- | --- | --- |
| Build tool | [Vite](https://vite.dev) | 7.3.6 |
| UI library | [React](https://react.dev) | 19.2.6 |
| Language | TypeScript | 5.9.3 |
| Styling | [Tailwind CSS](https://tailwindcss.com) | 4.1.17 |
| Icons | [lucide-react](https://lucide.dev) | 1.44.0 |
| Class merging | `clsx` + `tailwind-merge` | 2.1.1 / 3.4.0 |
| Single-file output | [vite-plugin-singlefile](https://github.com/MattDevStudio/vite-plugin-singlefile) | 2.3.0 |

Tailwind v4 is configured **CSS-first** — there is no `tailwind.config.js`. The design tokens live in
`@theme` at the top of `src/index.css`.

---

## Requirements

- **Node.js 20.19+ or 22.12+** (Vite 7 requirement). Verified on Node `v24.14.1`.
- **npm 10+** (ships with Node 20/22). Verified on npm `11.14.0`.

Check your versions:

```bash
node -v
npm -v
```

---

## Quick start

```bash
# 1. install dependencies
npm install

# 2. start the dev server with hot module replacement
npm run dev
```

Vite prints a local URL, normally <http://localhost:5173>. Click it to view the site.

The dev server only listens on `localhost` by default, which is what you want — do not expose it to a
public or untrusted network. See [Security](#security).

### Production build and local preview

```bash
# type-check (no emit)
npx tsc --noEmit

# build to dist/
npm run build

# serve dist/ locally to verify the real output
npm run preview
```

---

## Available scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with HMR on `localhost:5173`. |
| `npm run build` | Type-checks nothing — run `npx tsc --noEmit` first — then bundles to `dist/`. |
| `npm run preview` | Serves the built `dist/` exactly as production would. |

> **Note:** `npm run build` does **not** run the TypeScript compiler. `vite` only strips types via
> esbuild. Always run `npx tsc --noEmit` before shipping so type errors fail the build.

---

## Project structure

```
.
├── index.html              # SEO head: title, meta, OG, JSON-LD, font loading
├── vite.config.ts          # Vite + React + Tailwind + single-file plugins
├── tsconfig.json           # strict mode, "@/*" -> "src/*" path alias
├── public/                 # copied verbatim into dist/ — not processed by Vite
│   ├── favicon.svg
│   ├── robots.txt
│   ├── sitemap.xml
│   └── images/
│       ├── avatar.jpeg             # About section photo
│       ├── hero-portrait.png       # Hero artwork (1145 x 1374, 5:6)
│       ├── og-image.png            # social share card (1200 x 630)
│       └── interest-*.svg          # six card illustrations
└── src/
    ├── main.tsx            # React entry point
    ├── App.tsx             # section order
    ├── index.css           # Tailwind import + @theme tokens + component classes
    ├── data/
    │   └── portfolio.ts    # <-- Areas of Interest data (edit this first)
    ├── hooks/
    │   └── usePortfolio.ts # scroll spy, reveal, count-up, body lock, media query
    ├── utils/
    │   └── cn.ts           # clsx + tailwind-merge helper
    └── components/
        ├── Navbar.tsx      # sticky nav, mobile drawer, scroll spy
        ├── Hero.tsx        # h1, lead, stat counters, portrait
        ├── Marquee.tsx     # scrolling keyword strip
        ├── About.tsx       # biography, education facts, photo
        ├── Skills.tsx      # four skill cards
        ├── Work.tsx        # filterable "Areas of Interest" grid
        ├── Process.tsx     # numbered "how I learn" steps
        ├── Testimonials.tsx# achievements carousel
        ├── Contact.tsx     # contact details, socials, form
        └── Footer.tsx      # nav, copyright
```

Anything in `public/` is served at the site root. `public/images/avatar.jpeg` becomes
`/images/avatar.jpeg`. Use an **absolute** path (`/images/...`) when referencing it from JSX — a
relative path will break once the app is inlined into `index.html`.

---

## Customising the content

**Almost all copy changes are safe to make directly in the component files.** The one exception is
the Areas of Interest grid, which is data-driven.

### 1. Areas of Interest cards → `src/data/portfolio.ts`

```ts
export const projects: Project[] = [
  {
    id: "ai-foundations",
    title: "Foundations of Intelligent Systems",
    category: "Artificial Intelligence",   // must match a value in `categories`
    year: "2026",
    image: "/images/interest-ai-systems.svg",
    blurb: "How algorithms, data and intelligent systems can be used…",
  },
];
```

`category` is a TypeScript union type, so an unrecognised value is a **compile error**, not a silent
bug. If you add a new category, add it to the `Project["category"]` union **and** to the `categories`
array below it, or the filter buttons will not match any card.

### 2. Everything else

Open the relevant file in `src/components/`:

| To change | Edit |
| --- | --- |
| Name, headline, lead paragraph, stats | `Hero.tsx` |
| Biography, education facts | `About.tsx` |
| The four skill cards | `Skills.tsx` (top-of-file `skills` array) |
| Section headings and eyebrows | the component itself |
| Email, phone, location, LinkedIn URL | `Contact.tsx`, plus `Navbar.tsx` and `Footer.tsx` |
| Achievements carousel | `Testimonials.tsx` (top-of-file `testimonials` array) |
| Navigation links and labels | `Navbar.tsx` and `Footer.tsx` |
| Marquee words | `Marquee.tsx` |
| Section order | `App.tsx` |

> **Keep it honest.** The content is deliberately written to match Abdullah's actual level
> (first-semester undergraduate). Avoid adding employers, projects, frameworks, certifications or
> years of experience that are not real — recruiters and automated reviewers do check, and it
> undermines the rest of the page.

### 3. `testimonials` is a misleading variable name

`Testimonials.tsx` renders **achievements**, not client quotes. The array is still called
`testimonials` from the original template. Renaming it is safe and touches only that one file.

---

## Images

Place new files in `public/images/`, then reference them with an absolute path.

| File | Used in | Required size |
| --- | --- | --- |
| `avatar.jpeg` | `About.tsx` | 1147 × 1530 (3:4) |
| `hero-portrait.png` | `Hero.tsx` | 1145 × 1374 (5:6) |
| `og-image.png` | `index.html` only | 1200 × 630 |
| `interest-*.svg` | `portfolio.ts` | 800 × 1000 (4:3) |

**Always set `width` and `height` on `<img>`** to match the real file. They are inert here because
Tailwind `aspect-*` and `object-cover` override the layout, but they are what stops the page from
shifting while images load — and a wrong value is a silent bug.

**Alt text is descriptive, not keyword-stuffed.** Describe what is actually shown. Do not repeat the
name into every `alt`; the name already appears in the `h1` and the biography.

### The hero PNG is large

`hero-portrait.png` is ~1.2 MB and is loaded eagerly, so it is your Largest Contentful Paint
element. If you swap it, consider re-encoding it:

```bash
# WebP, roughly 70-80% smaller at the same visual quality
npx @squoosh/cli --input public/images/hero-portrait.png \
  --output public/images/hero-portrait.webp --width 1145
```

Then update the `src`, `width` and `height` in `Hero.tsx`.

---

## SEO

SEO is implemented in three files. **If you change the domain, update all three.**

| File | Controls |
| --- | --- |
| `index.html` | title, meta description, keywords, canonical, Open Graph, Twitter card, JSON-LD |
| `public/robots.txt` | crawl directives + sitemap pointer |
| `public/sitemap.xml` | the canonical URL list |

### Changing the domain

Search this list and replace the old domain everywhere:

1. `index.html` — `rel="canonical"`, `og:url`, the two `og:image` / `twitter:image` URLs, and the
   `"@id"` / `"url"` values in the JSON-LD `@graph`
2. `public/robots.txt` — the `Sitemap:` line
3. `public/sitemap.xml` — the `<loc>` value

```bash
# from the project root
grep -rl "old-domain.example" index.html public/
```

### Target keywords

| Keyword | Where it is placed |
| --- | --- |
| `abdullah imdad` | `<title>`, meta description, `h1`/`lead`, About, `Person.name`, OG title |
| `abdullah imdad lakho` | `<title>` (leads with the full name), Hero, About, `Person.alternateName` |
| `bs artificial intelligence student` | `<title>`, description, Hero, About, `jobTitle` |
| `duet karachi` | `<title>`, description, Hero, About, Footer |
| `c programming`, `machine learning`, `data analysis` | description, Skills, portfolio data, `knowsAbout` |

The full name appears in visible copy as well as metadata, because on-page text is what actually
signals relevance — meta tags alone do not.

### What this does and does not do

- The `<meta name="keywords">` tag is **ignored by Google**. It is kept only for other engines. Do
  not spend effort optimising it, and do not expect it to move rankings.
- The JSON-LD `Person` schema describes real, visible content, which helps search engines build an
  accurate entity. A `Person` schema on a personal portfolio does **not** generate a rich result on
  its own — do not add types you do not display just to chase one.
- Rankings depend on indexation, competition and links to the page, none of which this repo controls.
  Submit `https://abdullah-imdad-lakho.vercel.app/sitemap.xml` in
  [Google Search Console](https://search.google.com/search-console) and verify the
  [Rich Results Test](https://search.google.com/test/rich-results).

### Validate before deploying

```bash
npm run build && npm run preview
# then open the printed URL and check:
#  - view-source for the JSON-LD block
#  - /robots.txt and /sitemap.xml return 200
#  - the Open Graph image URL is absolute and returns 200
```

Third-party validators (paste the deployed URL):

- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org validator](https://validator.schema.org/)
- [Lighthouse](https://pagespeed.web.dev/) — the **SEO** category

---

## Deploying

### Vercel (current host)

The repository needs no special configuration — Vercel detects Vite automatically.

- Build command: `npm run build`
- Output directory: `dist`

For a **static** single-page app, add a rewrite so client-side routes resolve to `index.html`.
With hash anchors (`#about`, `#skills`) this is not currently required, but add it if you ever move
to history routing:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Any static host

`npm run build` produces a self-contained `dist/`. Upload the whole folder.

Security headers are **not** set by this repo because static hosts configure them per platform. If
you control the server, add:

```nginx
Strict-Transport-Security: "max-age=31536000; includeSubDomains"
X-Content-Type-Options: "nosniff"
X-Frame-Options: "DENY"
Referrer-Policy: "strict-origin-when-cross-origin"
```

---

## Design system

Tokens are defined once in `src/index.css` under `@theme` and consumed as Tailwind utilities.

| Token | Value | Use |
| --- | --- | --- |
| `--color-ink` | `#14120f` | Primary text, dark surfaces |
| `--color-ink-soft` | — | Secondary dark surfaces |
| `--color-cream` | `#f6f1e7` | Page background, text on dark |
| `--color-coral` | `#e2431f` | Primary accent, highlights |
| `--color-gold` | `#d9a441` | Secondary accent |
| `--color-sage` | `#7c8b6f` | Tertiary accent |

Fonts: **Space Grotesk** (display), **Inter** (body), **Playfair Display** (serif accents) — loaded
from Google Fonts in `index.html`.

Utility classes worth knowing: `t-hero`, `t-h2`, `t-h3`, `t-body`, `t-lead`, `t-num`, `section-y`,
`reveal`.

- `reveal` starts hidden and is un-hidden by `useRevealOnScroll()` adding `.is-visible`. **New
  animated elements need the `reveal` class or they will simply appear.**
- The `.grain` wrapper on `App.tsx` adds a noise texture; it is disabled below 640px for performance.

---

## Accessibility notes

- One `<h1>` (in `Hero.tsx`), then a logical `h2` → `h3` sequence. Keep it that way.
- The nav marks the current section via `aria-current`; the mobile drawer locks body scroll.
- All images have descriptive `alt` text; decorative glyphs are `aria-hidden`.
- Reveal animations respect `prefers-reduced-motion` — do not add motion that bypasses it.
- Form inputs are associated with `<label htmlFor>`, and validation uses native `required` /
  `type="email"`.

> **The contact form has no backend.** Submitting only sets local React state and shows a success
> message — nothing is sent, stored or emailed. Wire it to a form service (Formspree, Basin, a
> serverless function) before relying on it, and do not imply that a message was delivered until
> it genuinely is.

---

## Performance notes

- The whole app ships as **one inlined `index.html`** (~287 KB, ~84 KB gzipped). There is no
  code-splitting to configure, and no runtime chunk loading.
- The hero image is `loading="eager"` + `fetchpriority` high because it is the LCP element;
  below-fold images use `loading="lazy"`.
- Fonts are `preconnect`-ed to avoid a handshake stall.
- For further gains, serve images as WebP/AVIF and add explicit `Cache-Control` headers for
  `/images/*`.

---

## Troubleshooting

**`npm run dev` fails with a port error**
Another process holds the port. Use a different one: `npm run dev -- --port 5174`, or
`npx vite --port 5174 --strictPort` to fail loudly instead of silently incrementing.

**The site works in dev but breaks after `npm run build`**
Almost always a relative image path. In an inlined single-file build, `images/foo.png` resolves
relative to the document, not the component. Use `/images/foo.png`.

**A section never becomes visible**
The element is missing the `reveal` class, or `IntersectionObserver` never fired. Confirm
`useRevealOnScroll()` is called in `App.tsx`.

**`tsc` complains about `noUnusedLocals`**
`tsconfig.json` enables it. Remove the unused import or variable rather than loosening the rule.

**`npm run preview` 404s on a sub-path**
`dist/` is served from the root. A sub-path deployment needs `base` in `vite.config.ts`.

---

## Security

Current status: **`npm audit` reports 0 vulnerabilities.**

Resolved during setup:

| Advisory | Severity | Fix |
| --- | --- | --- |
| [GHSA-fx2h-pf6j-xcff](https://github.com/advisories/GHSA-fx2h-pf6j-xcff) — `server.fs.deny` bypass via Windows alternate paths | high | Vite → 7.3.6 |
| [GHSA-v6wh-96g9-6wx3](https://github.com/advisories/GHSA-v6wh-96g9-6wx3) — `launch-editor` NTLMv2 hash disclosure via UNC paths | moderate | Vite → 7.3.6 |
| [GHSA-g7r4-m6w7-qqqr](https://github.com/advisories/GHSA-g7r4-m6w7-qqqr) — arbitrary file read via dev server on Windows | low | esbuild → 0.28.2 |

These affect the **dev server only**. The deployed `dist/` is a static bundle with no server
runtime, so production is unaffected.

```bash
npm audit
```

Guidance:

- Keep the dev server on `localhost`. Do not pass `--host` on an untrusted network.
- All 166 locked packages resolve from `registry.npmjs.org` with sha512 integrity. Run
  `npm ci` rather than `npm install` in CI to install exactly the locked tree.
- The site makes **no** network calls except the Google Fonts stylesheet. There is no analytics, no
  tracking, no cookie banner and no third-party script.
- The contact form posts nowhere.
- `lucide-react` is the only icon dependency and has no install hook; the sole `postinstall` in the
  tree is esbuild's own binary installer.

---

## License

Personal portfolio. Not published with an open-source licence — all rights reserved by the author.

The code is MIT-style in spirit and free to read and adapt for learning purposes; please ask before
republishing the design or the content.

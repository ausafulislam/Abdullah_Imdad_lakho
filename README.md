<div align="center">

# Abdullah Imdad — Personal Portfolio

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Vercel](https://img.shields.io/badge/deployed-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)
![Audited](https://img.shields.io/badge/npm_audit-0_vulnerabilities-4CAF50?style=flat-square)

**Live site:** <https://abdullah-imdad-lakho.vercel.app/>

Personal portfolio of **Abdullah Imdad** (also written **Abdullah Imdad Lakho**), a Bachelor of
Science student in **Artificial Intelligence** at **Dawood University of Engineering & Technology
(DUET), Karachi, Pakistan**.

</div>

---

The build compiles the entire application into a **single self-contained `index.html`** — all
JavaScript and CSS are inlined — so it can be hosted on any static platform with no server runtime.

---

## Table of contents

- [About this project](#about-this-project)
- [Tech stack](#tech-stack)
- [Requirements](#requirements)
- [Quick start](#quick-start)
- [Available scripts](#available-scripts)
- [Project structure](#project-structure)
- [Customising the content](#customising-the-content)
- [Images](#images)
- [SEO](#seo)
- [AI discoverability (llms.txt)](#ai-discoverability-llmstxt)
- [Deploying](#deploying)
- [Design system](#design-system)
- [Accessibility](#accessibility)
- [Performance](#performance)
- [Troubleshooting](#troubleshooting)
- [Security](#security)
- [Contributing](#contributing)
- [FAQ](#faq)
- [Changelog](#changelog)
- [Acknowledgements](#acknowledgements)
- [Author](#author)
- [License](#license)

---

## About this project

A single-page portfolio for a first-semester undergraduate, built to be fast, accessible and easy
to maintain without a framework team.

**What it does:**

- Presents education, skills, areas of interest, learning approach and academic achievements
- Renders as one HTML file — no client-side chunk loading, no runtime dependencies
- Ships full technical SEO: canonical URLs, Open Graph, Twitter cards, JSON-LD, sitemap, robots
- Publishes `llms.txt` and `llms-full.txt` so AI assistants describe the owner accurately
- Uses no analytics, no tracking, no cookies and no third-party scripts beyond Google Fonts

**Who it is for:** a student building a first version of a personal site, or a developer
customising a well-documented starter.

> **The content is deliberately factual.** There are no invented projects, employers,
> certifications or years of experience. The "Areas of Interest" section lists **study topics, not
> completed work**, and two of the three award entries are participation certificates. Please keep
> it that way — reviewers verify claims, and inflating them undoes the rest of the page.

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

Tailwind v4 is configured **CSS-first** — there is no `tailwind.config.js`. Design tokens are defined
in `@theme` at the top of `src/index.css`.

---

## Requirements

- **Node.js 20.19+ or 22.12+** (Vite 7 requirement). Verified on Node `v24.14.1`.
- **npm 10+**. Verified on npm `11.14.0`.

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

Vite prints a local URL, normally <http://localhost:5173>.

The dev server binds to `localhost` only, which is what you want. Do not expose it to a public or
untrusted network — see [Security](#security).

### Production build and preview

```bash
# 1. type-check (no emit)
npx tsc --noEmit

# 2. build to dist/
npm run build

# 3. serve dist/ exactly as production will
npm run preview
```

---

## Available scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with HMR on `localhost:5173`. |
| `npm run build` | Bundles to `dist/`. **Does not type-check.** |
| `npm run preview` | Serves the built `dist/` as production would. |

> **`npm run build` does not run TypeScript.** Vite only strips types via esbuild, so a type error
> will not fail the build. Always run `npx tsc --noEmit` before shipping.

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
│   ├── llms.txt            # AI-assistant overview
│   ├── llms-full.txt       # AI-assistant extended reference
│   └── images/
│       ├── avatar.jpeg             # About photo          (1147 x 1530, 3:4)
│       ├── hero-portrait.png       # Hero artwork         (1145 x 1374, 5:6)
│       ├── og-image.png            # social share card    (1200 x 630)
│       └── interest-*.svg          # six card illustrations
└── src/
    ├── main.tsx            # React entry point
    ├── App.tsx             # section order
    ├── index.css           # Tailwind import, @theme tokens, component classes
    ├── data/
    │   └── portfolio.ts    # <-- Areas of Interest data (edit this first)
    ├── hooks/
    │   └── usePortfolio.ts # scroll spy, reveal, count-up, body lock, media query
    ├── utils/
    │   └── cn.ts           # clsx + tailwind-merge helper
    └── components/
        ├── Navbar.tsx        # sticky nav, mobile drawer, scroll spy
        ├── Hero.tsx          # h1, lead, stat counters, portrait
        ├── Marquee.tsx       # scrolling keyword strip
        ├── About.tsx         # biography, education facts, photo
        ├── Skills.tsx        # four skill cards
        ├── Work.tsx          # filterable "Areas of Interest" grid
        ├── Process.tsx       # numbered learning-cycle steps
        ├── Testimonials.tsx  # achievements carousel
        ├── Contact.tsx       # contact details, socials, form
        └── Footer.tsx        # nav, copyright
```

Anything in `public/` is served from the site root: `public/images/avatar.jpeg` becomes
`/images/avatar.jpeg`. **Always reference these with an absolute path** (`/images/...`) — a
relative path breaks once the app is inlined into `index.html`.

---

## Customising the content

Most copy can be edited directly in the component files. The exception is the Areas of Interest
grid, which is data-driven.

### 1. Areas of Interest → `src/data/portfolio.ts`

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

`category` is a TypeScript union type, so an unrecognised value is a **compile error** rather than a
silent bug. If you add a category, add it to the `Project["category"]` union **and** to the
`categories` array below it, or the filter buttons will match nothing.

### 2. Everything else

| To change | Edit |
| --- | --- |
| Name, headline, lead, stats | `Hero.tsx` |
| Biography, education facts | `About.tsx` |
| The four skill cards | `Skills.tsx` (`skills` array at the top) |
| Achievements carousel | `Testimonials.tsx` (`testimonials` array at the top) |
| Email, phone, location, LinkedIn | `Contact.tsx`, plus `Navbar.tsx` and `Footer.tsx` |
| Navigation links and labels | `Navbar.tsx` and `Footer.tsx` |
| Marquee words | `Marquee.tsx` |
| Learning-cycle steps | `Process.tsx` |
| Section order | `App.tsx` |

### 3. Renaming variables

`Testimonials.tsx` renders **achievements**, not client quotes — the array name `testimonials` is
inherited from the original template. Renaming it touches only that file and is safe.

### 4. Updating a person, not just text

If you fork this for someone else, search and replace the identity in **five** places, not one:

| Location | What to change |
| --- | --- |
| `index.html` | `<title>`, description, `og:title`, JSON-LD `name` / `alternateName` / `url` / `sameAs` |
| `public/robots.txt` | `Sitemap:` line |
| `public/sitemap.xml` | `<loc>` |
| `public/llms.txt` | entire file — name, contact, accuracy notes |
| `public/llms-full.txt` | entire file — identity, education, achievements |

Skipping the last two leaves AI assistants describing the original person, which is worse than
having no `llms.txt` at all.

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
Tailwind `aspect-*` and `object-cover` override layout, but they are what prevents layout shift
while loading, and a wrong value is a silent bug.

**Write descriptive alt text, not keywords.** Describe what is actually shown. Do not repeat the
name into every `alt` — it is already in the `h1` and the biography.

### The hero PNG is large

`hero-portrait.png` is ~1.2 MB and loads eagerly, making it the Largest Contentful Paint element. To
reduce it:

```bash
npx @squoosh/cli --input public/images/hero-portrait.png \
  --output public/images/hero-portrait.webp --width 1145
```

Then update `src`, `width` and `height` in `Hero.tsx`.

### Regenerating the OG image

`og-image.png` is a 1200×630 social card built from the site palette, because the portrait hero is
5:6 and would be cropped badly in link previews. Regenerate it whenever the name, role or palette
changes, and re-upload to LinkedIn/Vercel so the preview cache refreshes.

---

## SEO

Implemented in three files. **If the domain changes, update all three.**

| File | Controls |
| --- | --- |
| `index.html` | title, description, keywords, canonical, Open Graph, Twitter card, JSON-LD |
| `public/robots.txt` | crawl directives, sitemap pointer |
| `public/sitemap.xml` | the canonical URL list |

### Changing the domain

```bash
grep -rl "old-domain.example" index.html public/
```

Replace the old domain in: `index.html` (`rel="canonical"`, `og:url`, both image URLs, and the
`"@id"` / `"url"` values in the JSON-LD `@graph`), `robots.txt` (`Sitemap:`) and `sitemap.xml`
(`<loc>`).

### Current metadata

| Field | Value |
| --- | --- |
| Title | `Abdullah Imdad Lakho — BS AI Student at DUET Karachi` (52 chars) |
| Description | 159 chars, covering the academic keywords |
| Canonical | self-referencing, absolute HTTPS |
| Structured data | `WebSite` + `Person` in a single JSON-LD `@graph` |

### Target keywords

| Keyword | Placement |
| --- | --- |
| `abdullah imdad` | `<title>`, description, Hero, About, `Person.name`, OG title |
| `abdullah imdad lakho` | `<title>` (leads with the full name), Hero, About, `Person.alternateName` |
| `bs artificial intelligence student` | `<title>`, description, Hero, About, `jobTitle` |
| `duet karachi` | `<title>`, description, Hero, About, Footer |
| `c programming`, `machine learning`, `data analysis` | description, Skills, portfolio data, `knowsAbout` |

The full name appears in **visible copy** as well as metadata, because on-page text is what actually
signals relevance. Meta tags alone do not.

### What this does and does not do

- **The `<meta name="keywords">` tag is ignored by Google.** It is kept for other engines only. Do
  not spend effort optimising it or expect it to move rankings.
- **A `Person` schema does not generate a rich result** on a portfolio like this. It helps search
  engines build an accurate entity. Do not add types you do not display just to chase a rich result.
- **Rankings depend on indexation, competition and links**, none of which this repo controls.

### Validate before deploying

```bash
npm run build && npm run preview
```

Check `/robots.txt`, `/sitemap.xml`, the JSON-LD block in view-source, and that the OG image URL is
absolute and returns 200.

Then, against the deployed URL:

- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org validator](https://validator.schema.org/)
- [Lighthouse / PageSpeed](https://pagespeed.web.dev/) — check the **SEO** category

Submit `https://abdullah-imdad-lakho.vercel.app/sitemap.xml` in
[Google Search Console](https://search.google.com/search-console).

---

## AI discoverability (llms.txt)

[`llms.txt`](https://llmstxt.org/) is a proposed convention for giving AI assistants a concise,
machine-readable summary of a site — the counterpart to `robots.txt`, which says what *not* to
crawl. Two files are published at the domain root:

| File | Size | Purpose |
| --- | --- | --- |
| [`/llms.txt`](https://abdullah-imdad-lakho.vercel.app/llms.txt) | ~4 KB | Concise overview: identity, key facts, contact, section map, accuracy notes |
| [`/llms-full.txt`](https://abdullah-imdad-lakho.vercel.app/llms-full.txt) | ~7 KB | Extended reference: full biography, education, all six interest areas, certifications |

**Both end with accuracy notes.** They explicitly state that the owner has no employment history, no
shipped projects, and that the MISMO and ICATS entries are participation certificates rather than
wins. This is deliberate: it stops AI assistants from inflating a beginner's profile, which is the
main risk of publishing machine-readable claims about a real person.

**When you edit content, update these too.** A stale `llms.txt` is worse than none. The same
five-file checklist in [Customising the content](#4-updating-a-person-not-just-text) applies.

**Be measured about this.** `llms.txt` is an experimental proposal, not a cross-vendor standard. No
search engine ranks on it. It is cheap to maintain and reduces misrepresentation, but it is not a
substitute for semantic HTML, accurate metadata, or being genuinely findable.

---

## Deploying

### Vercel (current host)

No configuration needed — Vercel detects Vite automatically.

- Build command: `npm run build`
- Output directory: `dist`

For a **static** single-page app, add a rewrite so client routes resolve to `index.html`. Not
required while navigation uses hash anchors, but add it if you ever move to history routing:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Any static host

`npm run build` produces a self-contained `dist/`. Upload the whole folder.

Security headers are not set by this repo because each platform configures them separately. On a
server you control:

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
| `--color-coral` | `#e2431f` | Primary accent |
| `--color-gold` | `#d9a441` | Secondary accent |
| `--color-sage` | `#7c8b6f` | Tertiary accent |

Fonts: **Space Grotesk** (display), **Inter** (body), **Playfair Display** (serif accents), loaded
from Google Fonts in `index.html`.

Utility classes worth knowing: `t-hero`, `t-h2`, `t-h3`, `t-body`, `t-lead`, `t-num`, `section-y`,
`reveal`.

- **`reveal`** starts hidden and is revealed by `useRevealOnScroll()` adding `.is-visible`. New
  animated elements need this class or they simply appear with no animation.
- **`.grain`** (on the `App.tsx` wrapper) adds a noise texture, disabled below 640px for performance.

---

## Accessibility

- One `<h1>` (in `Hero.tsx`), then a logical `h2` → `h3` hierarchy.
- The nav marks the current section with `aria-current`; the mobile drawer locks body scroll.
- All images have descriptive `alt` text; decorative glyphs are `aria-hidden`.
- Reveal animations respect `prefers-reduced-motion` — do not add motion that bypasses it.
- Form inputs use `<label htmlFor>` with native `required` and `type="email"` validation.

> **The contact form has no backend.** Submitting sets local React state and shows a success
> message — nothing is sent, stored or emailed. Connect a form service (Formspree, Basin, a
> serverless function) before relying on it, and do not imply a message was delivered until it
> genuinely is. The same caveat is stated in `llms.txt`.

---

## Performance

- The whole app ships as **one inlined `index.html`** (~294 KB, ~84 KB gzipped). No code splitting
  to configure, no runtime chunk loading.
- The hero is `loading="eager"` with `fetchPriority="high"` because it is the LCP element;
  below-fold images use `loading="lazy"` and `decoding="async"`.
- Fonts are `preconnect`-ed to avoid a handshake stall.
- Next gains: serve images as WebP/AVIF, and add long-lived `Cache-Control` for `/images/*`.

---

## Troubleshooting

**`npm run dev` fails with a port error**
Use another port: `npm run dev -- --port 5174`, or `npx vite --port 5174 --strictPort` to fail
loudly instead of silently incrementing.

**Works in dev, breaks after `npm run build`**
Almost always a relative image path. In an inlined build, `images/foo.png` resolves relative to the
document, not the component. Use `/images/foo.png`.

**A section never becomes visible**
The element is missing the `reveal` class, or `IntersectionObserver` never fired. Confirm
`useRevealOnScroll()` is called in `App.tsx`.

**`tsc` reports `noUnusedLocals`**
`tsconfig.json` enables it. Remove the unused import rather than loosening the rule.

**`npm run preview` 404s on a sub-path**
`dist/` is served from the root. A sub-path deployment needs `base` in `vite.config.ts`.

**A type error ships anyway**
`npm run build` does not type-check. Run `npx tsc --noEmit` in CI.

---

## Security

**`npm audit` currently reports 0 vulnerabilities.**

Advisories resolved during setup:

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

**Guidance:**

- Keep the dev server on `localhost`. Do not pass `--host` on an untrusted network.
- All 166 locked packages resolve from `registry.npmjs.org` with sha512 integrity. Use `npm ci` in
  CI to install exactly the locked tree.
- The site makes **no** network calls except the Google Fonts stylesheet — no analytics, no
  tracking, no cookies, no third-party scripts.
- The contact form posts nowhere.
- Content contains no hidden text, zero-width characters, bidi overrides or prompt-injection
  strings; all 18 source files were audited for Trojan Source and XSS vectors.

---

## Contributing

Contributions are welcome — bug reports, accessibility fixes, performance work, and clearer
documentation.

**Before opening a pull request:**

```bash
npx tsc --noEmit     # must pass
npm run build        # must pass
npm audit            # must report 0 vulnerabilities
```

**Guidelines:**

- Match the existing code style. No new runtime dependencies without discussion.
- Do not add invented content — no fake projects, employers, certifications or metrics.
- Keep the `h1` hierarchy intact and preserve `prefers-reduced-motion` support.
- If you change visible content, update `llms.txt` and `llms-full.txt` in the same commit.
- If you change the domain, update the three SEO files listed under [SEO](#seo).

**Commit messages** follow Conventional Commits:

```
feat(skills): add Tailwind and Postgres to the data tools card
fix(nav): prevent body scroll leaking when the mobile drawer closes
docs(readme): document the llms.txt update requirement
```

---

## FAQ

**Why does the build produce a single HTML file?**
So the site can be hosted anywhere with no configuration, and so there is no client-side chunk
loading on a slow connection. `vite-plugin-singlefile` inlines the JS and CSS.

**Why is the hero a picture and not a photo of the owner?**
The image is AI-themed artwork. Alt text describes it accurately rather than claiming a portrait.

**Why are there no projects?**
The owner is a first-semester undergraduate and has not built any commercial work. Inventing
projects would misrepresent him. The "Areas of Interest" section lists study topics instead.

**Can I use this template?**
Yes, for learning and for your own portfolio. Replace all identity content — see the
[five-file checklist](#4-updating-a-person-not-just-text) — and do not republish the original
design or copy.

**Why does `npm run build` not catch type errors?**
Vite strips types without checking them. `npx tsc --noEmit` is the type-check step; run both before
deploying.

**Does `llms.txt` improve Google rankings?**
No. It is an experimental proposal that no search engine uses for ranking. It helps AI assistants
describe the owner accurately, which is a different goal.

**The contact form says "sent" but nothing arrives. Why?**
There is no backend. The form only updates local React state. Wire it to a form service first.

---

## Changelog

### 1.1.0 — AI discoverability and documentation

- Added `llms.txt` and `llms-full.txt` with accuracy notes
- Referenced both files in `robots.txt`
- Rewrote `README.md` with badges, contributing guide, FAQ and changelog

### 1.0.1 — Security

- Bumped Vite `7.3.2 → 7.3.6` and esbuild `0.27.7 → 0.28.2`; `npm audit` clean

### 1.0.0 — Content migration and SEO

- Replaced the template persona with the real owner's details; removed inherited claims and imagery
- Swapped hero and About images; added six topic-matched card illustrations
- Added canonical, Open Graph, Twitter cards and JSON-LD `WebSite` + `Person` schema
- Added `robots.txt`, `sitemap.xml`, `favicon.svg` and a 1200×630 OG image
- Added `fetchPriority="high"` to the LCP element

---

## Acknowledgements

- [Vite](https://vite.dev), [React](https://react.dev), [Tailwind CSS](https://tailwindcss.com)
- [lucide](https://lucide.dev) for icons
- [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk),
  [Inter](https://fonts.google.com/specimen/Inter) and
  [Playfair Display](https://fonts.google.com/specimen/Playfair+Display) on Google Fonts
- The `seo` and `geo-llmstxt` agent skills in `.agents/skills/` for the SEO and `llms.txt` work
- Dawood University of Engineering & Technology, Karachi

---

## Author

**Abdullah Imdad** (Abdullah Imdad Lakho)
BS Artificial Intelligence student, Dawood University of Engineering & Technology, Karachi

- Website: <https://abdullah-imdad-lakho.vercel.app/>
- Email: [abdullah17.imdad@gmail.com](mailto:abdullah17.imdad@gmail.com)
- LinkedIn: [linkedin.com/in/abdullah-imdad-lakho-150347364](https://www.linkedin.com/in/abdullah-imdad-lakho-150347364/)
- Phone: +92-303-3313312

Open to internships and collaboration.

---

## License

Personal portfolio. **All rights reserved** by the author — not published under an open-source
licence.

The source is free to read and adapt for learning purposes. Please ask before republishing the
design, the copy, or the personal details it contains.

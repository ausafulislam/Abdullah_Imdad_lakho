<div align="center">

<img src="public/favicon.svg" alt="Abdullah Imdad Lakho logo" width="72" />

# Abdullah Imdad Lakho: Portfolio

**BS Artificial Intelligence student at DUET Karachi.** This repository is the source code of his
personal portfolio website.

[![Live](https://img.shields.io/badge/live-abdullah--imdad--lakho.vercel.app-b7f332?style=flat-square)](https://abdullah-imdad-lakho.vercel.app/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vercel](https://img.shields.io/badge/hosted-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com)

[**View the site**](https://abdullah-imdad-lakho.vercel.app/) ·
[**Source**](https://github.com/ausafulislam/Abdullah_Imdad_lakho) ·
[**Report an issue**](https://github.com/ausafulislam/Abdullah_Imdad_lakho/issues)

</div>

---

## Project overview

A portfolio website that presents Abdullah's academic journey: who he is, his education, the
areas he is interested in, the skills he is building, three practice web projects, how he learns,
his certificates, and how to get in touch. Each project is a working app on its own page.

It is a fully static site. At build time React renders every page into **its own self-contained
HTML file** (`index.html` and `projects/<name>.html`), with all JavaScript and CSS inlined and the
page content already in the HTML. The interactive apps start in the browser, because they work
with the visitor's own saved data. It needs no server and runs on any static host. In the
browser, React takes over that HTML (hydration), and GSAP adds subtle animations on top.

## About the portfolio owner

**Abdullah Imdad Lakho** (also written Abdullah Imdad or Abdullah Lakho) is a first-semester
BS Artificial Intelligence student at Dawood University of Engineering and Technology (DUET),
Karachi, Pakistan.

- **Education:** BS Artificial Intelligence, DUET (2026 – present); HSC, completed from D.J. Sindh
  Science College; SSC, completed from Noor Eastern Collegiate, Nawabshah
- **Interests:** artificial intelligence, software development, programming, machine learning,
  data and analytics, technology
- **Currently learning:** C programming, AI fundamentals, maths for computing, data-analysis
  fundamentals and Microsoft Office tools
- **Achievements:** Certificate of Participation, 15th Maarif Inter-School Maths Olympiad (2019);
  Certificate of Participation, ICATS English Linguistics Contest 2020; Secondary School
  Certificate (SSC), 2024
- **Projects:** three practice web apps (see [Projects](#projects))
- **Open to** internships and collaboration

This content lives in `src/data/portfolio.ts`; the project texts live in `src/data/projects.ts`.

## Features

- **Sections:** Hero, About (with an education timeline), Areas of Interest and Skills in
  Progress, Projects, How I Learn, Achievements, Contact, and Footer.
- **Three working projects,** each on its own page (see [Projects](#projects)).
- **Pre-rendered HTML.** The full page content is in the HTML file, so it is readable without
  JavaScript (search engines, link previews, assistive technology, slow devices).
- **Animated hero statistics.** The numbers count up from 0 to 6+, 18+ and 3+ when they come into
  view.
- **Oversized footer wordmark.** "Abdullah" set across the full content width, under the logo,
  navigation and contact links.
- **Smooth scrolling and navigation.** Lenis smooth scrolling; the navbar marks the current
  section, and in-page links move keyboard focus to the section they open.
- **WhatsApp contact form** (no backend, see below).
- **Accessible:** skip link, one `<h1>`, logical headings, labelled form fields, visible focus
  styles, `aria-current` in the navigation, alt text on every image, and full support for
  `prefers-reduced-motion`.
- **Resilient:** an error boundary shows a recovery screen instead of a blank page, and unknown
  URLs get a branded `404.html`.
- **Private by default:** no analytics, cookies or trackers, and the font is self-hosted. The
  portfolio itself makes no third-party requests. Two project pages call public APIs straight from
  the browser: the Expense Tracker's currency converter (Frankfurter) and the Weather Dashboard
  (Open-Meteo, only after you search for a place).

### Contact form

The form has **no backend**. Submitting it composes the enquiry and opens
`https://wa.me/923033313312` in a new tab, where the visitor presses send. The site transmits
nothing itself. The confirmation panel also offers copy-to-clipboard and `mailto:` fallbacks in
case the tab is blocked or WhatsApp is missing. To use a form service instead, replace
`handleSubmit` in `src/components/Contact.tsx`.

## Projects

Three practice apps built with React and TypeScript inside this codebase. Each page has a short
introduction, the working app, its features, the technologies used and links back to the
portfolio. None of them needs an account, a server or an API key, and none of them ships with
sample data: everything shown comes from the visitor's own entries or from a live API response.

| Project | Page | Data |
| --- | --- | --- |
| Personal Task Manager | [`/projects/task-manager`](https://abdullah-imdad-lakho.vercel.app/projects/task-manager) | Browser only (`localStorage`) |
| Expense Tracker | [`/projects/expense-tracker`](https://abdullah-imdad-lakho.vercel.app/projects/expense-tracker) | Browser only (`localStorage`), plus optional live exchange rates |
| Weather Dashboard | [`/projects/weather-dashboard`](https://abdullah-imdad-lakho.vercel.app/projects/weather-dashboard) | Live from the Open-Meteo APIs |

**Personal Task Manager** (`src/projects/task-manager/`)

- Add, edit and delete tasks with a title, an optional description, a priority (Low, Medium or
  High) and an optional due date. The form validates its fields.
- Mark tasks as completed or pending. Overdue and due-today tasks are highlighted.
- Filter by All, Pending or Completed, search by title, and sort.
- The totals and the progress bar are calculated from the saved tasks.
- Saved in `localStorage` and kept in sync across open tabs. Unreadable saved data is ignored
  instead of breaking the app.

**Expense Tracker** (`src/projects/expense-tracker/`)

- Add, edit and delete income and expense entries with an amount, a description, a category and a
  date. Expense categories: Food, Education, Shopping, Transport and Others. Income categories:
  Allowance, Scholarship, Part-time job, Gift and Others.
- Total income, total expenses and balance, and a history you can filter by type, category and
  date range.
- A monthly summary with a month picker, spending by category, and an income-against-expenses
  chart for six months. The charts are hand-written SVG, each with a data table for screen
  readers.
- Amounts are stored as whole paisa, so totals have no floating-point rounding errors.
- Optional currency conversion of the totals with live rates from Frankfurter, cached for six
  hours in the browser session. If the service can't be reached, only the converter shows an
  error; the tracker keeps working.

**Weather Dashboard** (`src/projects/weather/`)

- Search for a city (at least two characters). Matching places are listed with their region and
  country so you can pick the right one, and quick picks cover a few cities.
- Current temperature, feels-like, humidity, wind, precipitation and a day or night condition
  icon; hourly temperatures for the next 24 hours; a 7-day forecast with highs, lows and the
  chance of precipitation; sunrise and sunset in the place's local time.
- A new search replaces everything. Outdated requests are cancelled, and requests time out after
  12 seconds.
- Loading, error, no-results and timeout states. When a request fails, no weather values are
  shown: nothing is cached, estimated or made up.
- The last five places are remembered in `localStorage` for quick access.

### APIs used

| API | Used by | Documentation | Key | Notes |
| --- | --- | --- | --- | --- |
| Open-Meteo Geocoding API | Weather Dashboard (city search) | [open-meteo.com/en/docs/geocoding-api](https://open-meteo.com/en/docs/geocoding-api) | None | Location data based on GeoNames |
| Open-Meteo Forecast API | Weather Dashboard (weather) | [open-meteo.com/en/docs](https://open-meteo.com/en/docs) | None | Free for non-commercial use within its daily limits; data under CC BY 4.0, credited on the page |
| Frankfurter | Expense Tracker (currency converter) | [frankfurter.dev/docs](https://frankfurter.dev/docs/) | None | Free and open source; caching is encouraged |

Open-Meteo's free tier is for non-commercial use. A commercial version of the site would need one
of its paid plans.

### Routing

- A small router in `src/lib/router.tsx` (History API, no extra dependency) handles `/`, the
  three `/projects/<name>` pages and a not-found page. On each navigation it updates the title,
  description, canonical URL and social tags.
- Every route is pre-rendered at build time, so opening or reloading a project URL directly serves
  complete HTML.
- Links back to `/#projects` land on the Projects section, and the browser's Back button restores
  the previous scroll position.

## Technologies used

| Concern | Choice |
| --- | --- |
| UI | [React](https://react.dev) 19.2.6 (pre-rendered with `react-dom/server`, hydrated with `hydrateRoot`) |
| Language | [TypeScript](https://www.typescriptlang.org) 5.9.3, strict mode |
| Build | [Vite](https://vite.dev) 7.3.7 + `vite-plugin-singlefile` 2.3.0 |
| Styling | [Tailwind CSS](https://tailwindcss.com) 4.1.17, CSS-first (no `tailwind.config.js`) |
| Animation | [GSAP](https://gsap.com) 3.15 + ScrollTrigger, via `@gsap/react` 2.1 (`useGSAP`) |
| Smooth scrolling | [Lenis](https://github.com/darkroomengineering/lenis) 1.3.27 |
| Icons | [lucide-react](https://lucide.dev) 1.44.0 |
| Class names | `clsx` + `tailwind-merge`, combined in `src/utils/cn.ts` |
| Routing | A small History API router in `src/lib/router.tsx` (no router dependency) |
| Charts | Hand-written SVG (no chart library) |
| Data APIs | [Open-Meteo](https://open-meteo.com/) (weather) and [Frankfurter](https://frankfurter.dev/) (exchange rates), both without keys |
| Font | Plus Jakarta Sans (variable, self-hosted, SIL OFL 1.1) |
| Hosting | [Vercel](https://vercel.com) |

### Design tokens

Defined in `@theme` at the top of `src/index.css`. Minimal and monochrome, with one accent.

| Token | Value | Used for |
| --- | --- | --- |
| `ink` | `#111111` | Text, dark buttons |
| `muted` | `#767676` | Secondary text (AA contrast on white) |
| `line` | `#eaeaea` | Borders and dividers |
| `mist` | `#f4f4f4` | Icon tiles, the hero disc |
| `lime` | `#b7f332` | Accent only: primary buttons, active nav indicator, small lines. Never used for text on white |
| `night` | `#080808` | Contact banner |

## Project structure

```
index.html                 # home <head>: SEO meta, Open Graph, icons, JSON-LD, preloads, intro guard
vite.config.ts             # Vite config + the build-time pre-render plugin (every route)
vercel.json                # clean URLs (/projects/x serves projects/x.html), no trailing slash
public/                    # copied to dist/ as is
  logo.svg                 # official logo (vector)
  favicon.ico favicon.svg apple-touch-icon.png
  icon-192.png icon-512.png icon-maskable-512.png site.webmanifest
  robots.txt sitemap.xml   # crawl rules and sitemap
  llms.txt llms-full.txt   # plain-text summaries for AI assistants
  404.html                 # self-contained not-found page
  fonts/                   # Plus Jakarta Sans variable woff2 + OFL licence
  images/                  # photos, hero portrait, social card (see below)
src/
  main.tsx                 # browser entry: hydrates the pre-rendered HTML
  entry-server.tsx         # build-time entry: renders each route to HTML
  App.tsx                  # skip link, smooth-scroll provider, navbar, current page, footer
  index.css                # Tailwind import, @theme tokens, component classes
  data/portfolio.ts        # all portfolio content (edit this first)
  data/projects.ts         # project names, descriptions, features, technologies and APIs
  data/routes.ts           # site URL, route matching, per-page title and description
  data/pageHead.ts         # build-time <head> and JSON-LD for the project pages
  lib/gsap.ts              # GSAP + ScrollTrigger setup and shared reveal presets
  lib/router.tsx           # small History API router
  lib/storage.ts           # validated localStorage state with cross-tab sync
  lib/dates.ts             # local-date helpers
  hooks/usePortfolio.ts    # useMediaQuery, useScrolledPast
  utils/cn.ts              # class-name helper
  pages/                   # Home, ProjectPage, NotFound
  components/              # Navbar Hero About Work Projects Process Achievements Contact Footer
                           # ProjectPreviews RouteScroll ClientOnly SmoothScroll ErrorBoundary icons
  projects/
    shared/                # form controls, panels, stat cards and the dialog used by the apps
    task-manager/          # Personal Task Manager
    expense-tracker/       # Expense Tracker, SVG charts, currency converter
    weather/               # Weather Dashboard, Open-Meteo client, weather codes
```

| Image | Used for |
| --- | --- |
| `abdullah-hero-portrait.webp` (+ `-640`) | Hero on tablet and desktop. An AI-generated black-and-white studio portrait, made with Abdullah's own photo (`avatar.jpeg`) as the reference. Phones show a text-only hero and never download it. |
| `abdullah-about.webp` | About section: his real photo, cropped and converted to black and white |
| `avatar.jpeg` | Original photo; also the `Person` image in the structured data |
| `og-image.png` | 1200×630 social preview card |
| `hero-portrait.png`, `interest-*.svg` | Artwork from the previous design, kept but currently unused |

**Where to edit**

| To change | Edit |
| --- | --- |
| Any profile, section or contact content | `src/data/portfolio.ts` |
| Project cards and project page texts | `src/data/projects.ts` |
| The apps themselves | `src/projects/` |
| Section headings | the section's component in `src/components/` |
| Colours, type, buttons | `@theme` and component classes in `src/index.css` |
| Animation presets | `src/lib/gsap.ts`, plus each section's `useGSAP` block |
| Home page title, description, structured data | `index.html` (keep `HOME_META` in `src/data/routes.ts` in step) |
| Project page titles and descriptions; their structured data | `seo` in `src/data/projects.ts`; `src/data/pageHead.ts` |

## Getting started

You need:

- **Node.js 20.19+ or 22.12+** (required by Vite 7)
- **npm** (bundled with Node)
- **Git**

```bash
git clone https://github.com/ausafulislam/Abdullah_Imdad_lakho.git
cd Abdullah_Imdad_lakho
```

## Installation

```bash
npm ci
```

`npm ci` installs exactly the versions recorded in `package-lock.json`. Use `npm install` only when
adding or upgrading packages. `npm audit` reported 0 vulnerabilities on 7 November 2026.

## Development commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the Vite dev server with hot reload at <http://localhost:5173> (localhost only) |
| `npm run typecheck` | Type-checks the project with TypeScript (`tsc --noEmit`, strict mode) |
| `npm run build` | Builds the production site into `dist/`, including pre-rendering |
| `npm run preview` | Serves the built `dist/` folder at <http://localhost:4173> |

- The dev server renders in the browser only, so "View source" in development shows an empty
  `#root`. That is expected; the production build contains the full HTML.
- No linter is configured. `npm run typecheck` is the static check: strict mode with
  `noUnusedLocals` and `noUnusedParameters`.

## Production build

```bash
npm run typecheck   # 1. Vite strips types without checking them, so check first
npm run build       # 2. build and pre-render into dist/
npm run preview     # 3. review the result locally
```

What `npm run build` does:

1. **Bundles the app.** `vite-plugin-singlefile` inlines all JavaScript and CSS into
   `dist/index.html`, and files from `public/` are copied alongside it.
2. **Pre-renders every route.** The `portfolio:prerender` plugin in `vite.config.ts` builds
   `src/entry-server.tsx` for Node and renders each route (`/` and the three project pages) to
   HTML inside `<div id="root">`. The home page keeps the `<head>` from `index.html`; each project
   page gets its own title, description, canonical URL, social tags and JSON-LD and is written to
   `dist/projects/<name>.html`. The plugin then deletes its temporary `dist-ssr/` folder. If this
   step fails, the whole build fails, so a page without content is never deployed. No extra
   dependency is involved.
3. **Hydrates in the browser.** `src/main.tsx` attaches React to the existing markup with
   `hydrateRoot` when the pre-rendered page matches the URL, and renders from scratch otherwise.

The output is `dist/index.html` (about 657 kB, or 195 kB gzipped, including the pre-rendered
markup), one file per project page (about 610 kB, or 186 kB gzipped, each) and the public assets.
Every file is self-contained, so each page carries the code for the whole site. Components must stay safe to render on the server: browser-only
code (`window`, `document`, GSAP, Lenis) belongs in `useGSAP` or `useEffect`, never in the render
body.

## Environment variables

None. The site has no API keys or secrets and no `.env` file, and the public APIs used by the
projects (Open-Meteo and Frankfurter) need no key. The code only reads Vite's
built-in `import.meta.env.DEV` flag, which exposes GSAP in the browser console during
development.

## SEO implementation

The setup follows Google's [Search Essentials](https://developers.google.com/search/docs/essentials),
[SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide) and
[JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics).

| What | Where |
| --- | --- |
| Title, meta description, self-referencing canonical, robots directives, `lang` | `index.html` (home); `src/data/projects.ts` and `src/data/pageHead.ts` (project pages) |
| Open Graph and Twitter/X card with a 1200×630 image | `index.html`, `public/images/og-image.png` |
| Favicons and web app manifest, generated from the official logo | `public/favicon.*`, `apple-touch-icon.png`, `icon-*.png`, `site.webmanifest` |
| Structured data (JSON-LD) | `index.html` (home); `src/data/pageHead.ts` (project pages) |
| Crawl rules and sitemap | `public/robots.txt`, `public/sitemap.xml` |
| Pre-rendered content | `vite.config.ts`, `src/entry-server.tsx` |

- **Content in the HTML.** Because the page is pre-rendered, its headings, text, links and image
  alt text arrive in the first HTML response. Google can render JavaScript, but pre-rendering is
  faster for visitors and works for every crawler, including link-preview bots that don't run
  scripts.
- **Descriptive headings.** One `<h1>` per page (his name on the home page, the project name on a
  project page), one `<h2>` per section and `<h3>`/`<h4>` for
  items. Each section heading includes its label, for example "About Me: Building a strong
  foundation, one concept at a time."
- **Structured data.** A single `@graph` with `WebSite`, `ProfilePage` (Google's markup for a
  page about one person), `Person` and `CollegeOrUniversity`. The `Person` covers his name and
  alternate names, photo, LinkedIn, email, phone, city, his DUET affiliation, previous schools
  and the topics he is learning. DUET is identified by its official website and Wikipedia
  article. The markup describes only what the page shows. Valid markup makes a page *eligible*
  for rich results; Google decides whether to show them. Each project page has its own graph:
  `WebPage`, `WebSite`, `Person` and a `BreadcrumbList` (Home, then the project).
- **Crawl rules.** `robots.txt` lets every crawler access everything, including CSS, JavaScript
  and images, and points to the sitemap. The sitemap lists the four real URLs (the home page and
  the three project pages) and the date each last changed.
- **What is deliberately absent:** a `keywords` meta tag (Google ignores it), hidden text, and
  keyword repetition. Names and keywords appear only where they read naturally.
- The title (73 characters) and description (185 characters) are longer than Google typically
  displays, so results may shorten or rewrite them. The most important words come first.

**Keeping it accurate**

- When content changes, update `dateModified` in the JSON-LD, `<lastmod>` in `sitemap.xml`, and
  the llms files if any facts changed.
- When `og-image.png` changes, bump the `?v=` query on `og:image` and `twitter:image`. LinkedIn,
  WhatsApp and Facebook cache preview images for a long time.
- If the domain ever changes, update the canonical, `og:url`, `og:image`, `twitter:image` and
  every JSON-LD URL in `index.html`, `SITE_URL` in `src/data/routes.ts`, the `Sitemap:` line in
  `robots.txt`, the `<loc>` entries in `sitemap.xml`, and the URLs in both llms files.

**After deploying (owner steps)**

1. [Google Search Console](https://search.google.com/search-console): verify the site, submit
   `sitemap.xml` and use URL Inspection to request indexing.
2. Test the structured data with the [Rich Results Test](https://search.google.com/test/rich-results)
   and the [Schema Markup Validator](https://validator.schema.org/).
3. Check real-device performance with [PageSpeed Insights](https://pagespeed.web.dev/).
4. Add the site to [Bing Webmaster Tools](https://www.bing.com/webmasters), which can import it
   from Search Console.

No setup can guarantee rankings, indexing or rich results. Search engines decide those.

## GEO/AEO implementation

Generative engine optimisation (GEO) and answer engine optimisation (AEO) aim to help AI
assistants and answer features describe Abdullah correctly. Google's
[guidance on AI features](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
says AI Overviews and AI Mode rely on the same systems as regular Search: there is no special
markup or file to add. The work here is therefore about clarity and consistency.

- **One consistent identity.** Name, title ("BS Artificial Intelligence student at DUET
  Karachi"), university, location and contact details match across the visible page, the
  metadata, the JSON-LD and the llms files.
- **Plain factual statements on the page:** who he is, what and where he studies, his stage
  (first semester), his interests, the skills he is learning (presented as in progress),
  achievements with dates and details, and that he is open to internships and collaboration.
- **Clear entity links.** `sameAs` points to his LinkedIn, and DUET is identified by its official
  website and Wikipedia article.
- **Readable without JavaScript or motion.** The content is pre-rendered, and the animations
  only enhance it. They are switched off for reduced motion.
- **`llms.txt` and `llms-full.txt`** follow the [llmstxt.org](https://llmstxt.org/) format: a
  short Markdown summary and an extended reference, linked from the page head with
  `rel="describedby"`. Some AI tools read these files. **Google Search does not use `llms.txt`**,
  so treat it as a convenience for other tools, not a ranking factor.
- **No FAQ block.** Every answer it would give (who he is, what and where he studies, his
  interests, his availability) is already stated in the visible sections. Repeating them would
  add text only for search engines.
- **Honesty guardrails.** There are no invented roles, clients or awards. The three projects are
  real, working code in this repository, presented as practice projects with no claims of users
  or results. The olympiad and contest certificates are labelled as participation, and the llms
  files ask AI tools not to present him as a professional.

To see how the site appears in Google's AI features, use Search Console's
[Generative AI performance report](https://support.google.com/webmasters/answer/16984139).

## GSAP and ScrollTrigger usage

- **One setup point.** `src/lib/gsap.ts` registers ScrollTrigger and `useGSAP` once, and
  components import GSAP from there. It also holds the shared reveal presets, including a
  `ScrollTrigger.batch` helper for staggered cards.
- **One pattern.** Every animation lives in `useGSAP`, which cleans up automatically and is safe
  under StrictMode, inside `gsap.matchMedia()` with `(prefers-reduced-motion: no-preference)`.
  With reduced motion nothing animates and everything shows in its final state.
- **Light by design.** Only transform and opacity animate. There is no pinning and no
  scroll-jacking, and section reveals fire once.
- **Hero intro.** A short timeline reveals the badge, headline, text, buttons and portrait.
- **Hero statistics count-up.** The final numbers are in the pre-rendered HTML. On load, the
  script sets them to 0, then tweens a plain numeric object and writes the rounded value in
  `onUpdate` (1.8 s, `power2.out`, 0.12 s stagger). Counting starts once the intro has revealed
  the stats *and* they are in view (ScrollTrigger, `once: true`). If the visitor scrolls past
  without seeing them, they still finish, so they never stay at 0. Cleanup restores the final
  values.
- **Projects.** On the home page the heading reveals and the three cards use the shared batch
  helper. On a project page the introduction and the app fade up once on arrival, and the
  details below reveal on scroll. Inside the apps, motion is limited to short CSS transitions.
- **Footer wordmark.** "Abdullah" rises slightly (`yPercent: 28` → 0) and fades in once, when it
  enters the viewport.
- **No flash on load.** Pre-rendered content would otherwise be visible for a moment before
  GSAP sets the intro's start states. An inline script in `index.html` adds `intro-pending` to
  `<html>` (only for visitors who allow motion), CSS hides `#root` while it is set, and
  `App.tsx` removes it as soon as GSAP is ready. If scripts fail, a CSS animation reveals the
  page after 2.5 s. Without JavaScript the class is never added.

## Lenis smooth scrolling

`src/components/SmoothScroll.tsx` owns the page's single Lenis instance:

- Lenis runs with `lerp: 0.1` and `autoRaf: false`. It is advanced from `gsap.ticker`, so GSAP
  and Lenis share one animation loop. Every Lenis scroll event calls `ScrollTrigger.update`, and
  `lagSmoothing(0)` keeps the two in sync.
- It is created only when the visitor allows motion. With reduced motion the page uses native
  scrolling with instant jumps.
- It handles all in-page links (`a[href^="#"]`). They scroll smoothly (1.15 s, ease-out expo),
  stop below the fixed navbar thanks to `scroll-padding-top`, update the URL, and move keyboard
  focus to the target section.
- Deep links such as `/#contact` jump straight to their section once the fonts have loaded.
- `setLocked` freezes scrolling while the mobile menu is open.
- Lenis's recommended stylesheet, `lenis/dist/lenis.css`, is imported.

## Responsive design

- Mobile-first Tailwind with the default breakpoints (`sm` 640 px, `md` 768 px, `lg` 1024 px,
  `xl` 1280 px). The content width is `min(100% − 2 × gutter, 75rem)`.
- **Phones** get a text-only hero, and the portrait is never downloaded: the `<picture>` source
  and its preload are both media-gated. The menu manages focus and closes with Escape, and
  "Let's Talk" stays visible in the header.
- Type scales fluidly with `clamp()`. The footer wordmark uses container query units (`cqw`) to
  fill the content width exactly at any size, with no horizontal overflow.
- Safe-area insets are respected on notched phones.
- **Performance:** the font is preloaded, self-hosted and a single variable file. Images are WebP.
  On tablet and desktop the hero portrait (640/960 px) is preloaded with high priority. On phones
  the About photo is the first image on screen, so it is not lazy-loaded. Every image declares
  its width and height, so the layout doesn't shift.
- **The apps on phones.** Stat cards and summaries adapt to their own width with container
  queries, the expense chart redraws at its real width so its labels stay readable, and dialogs
  fit small screens.
- The home page was tested at 360, 390, 480, 768, 1024, 1280, 1440 and 1920 px wide, with and
  without reduced motion, and the project pages at 360, 390, 768, 1024 and 1440 px.

## Deployment

The production site is <https://abdullah-imdad-lakho.vercel.app/>, hosted on Vercel.

- Vercel detects Vite automatically: the build command is `npm run build` and the output
  directory is `dist`. Pre-rendering is part of `vite build`.
- `vercel.json` sets `cleanUrls: true`, so `/projects/task-manager` serves
  `projects/task-manager.html`, and `trailingSlash: false`, so each page has one URL.
- Use Node.js 20.x or 22.x in the project settings (Vite needs 20.19+ or 22.12+).
- Vercel serves `dist/404.html` for unknown URLs.
- Any other static host works too: run `npm run build` and upload the `dist/` folder. The host
  must serve `projects/<name>.html` for `/projects/<name>` (often called clean URLs).

## Contact and social links

- Website: <https://abdullah-imdad-lakho.vercel.app/>
- Email: [abdullah17.imdad@gmail.com](mailto:abdullah17.imdad@gmail.com)
- Phone and WhatsApp: [+92 303 3313312](https://wa.me/923033313312)
- LinkedIn: [linkedin.com/in/abdullah-imdad-lakho-150347364](https://www.linkedin.com/in/abdullah-imdad-lakho-150347364/)

## License

This is a personal portfolio. **All rights reserved** by Abdullah Imdad Lakho; the code and
content are not published under an open-source licence. His name, photos, logo and written
content may not be reused without permission.

Third-party software keeps its own licence: Plus Jakarta Sans is under the SIL Open Font
License 1.1 (`public/fonts/OFL.txt`), and each npm package is under the licence in its own
package. Built with [Vite](https://vite.dev), [React](https://react.dev),
[Tailwind CSS](https://tailwindcss.com), [GSAP](https://gsap.com),
[Lenis](https://github.com/darkroomengineering/lenis) and [lucide](https://lucide.dev).

Website built by [Ausaf](https://ausafulislam.vercel.app).

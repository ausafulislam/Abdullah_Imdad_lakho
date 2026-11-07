/**
 * The three practice projects shown on the landing page and on their own pages
 * (/projects/<id>). Keep this factual: every feature listed here exists in
 * src/projects/, and nothing claims users, clients or results.
 */

export type ProjectId = "task-manager" | "expense-tracker" | "weather-dashboard";

export type ProjectApi = {
  name: string;
  href: string;
  docs: string;
  detail: string;
};

export type Project = {
  id: ProjectId;
  number: string;
  path: `/projects/${ProjectId}`;
  name: string;
  /** Card copy on the landing page. */
  summary: string;
  /** Intro paragraph under the project page title. */
  intro: string;
  features: string[];
  /** Short tags for the card and the page header. */
  tags: string[];
  /** "Technologies used" on the project page. */
  stack: { name: string; detail: string }[];
  /** How the app stores or requests data. */
  dataNote: string;
  apis: ProjectApi[];
  seo: { title: string; description: string };
};

export const PROJECTS: Project[] = [
  {
    id: "task-manager",
    number: "01",
    path: "/projects/task-manager",
    name: "Personal Task Manager",
    summary:
      "Plan tasks with priorities, due dates, search and filters. Progress updates as you tick tasks off, and everything is saved in your browser.",
    intro:
      "A to-do app for planning and tracking personal tasks. Add a task with a priority and a due date, edit or delete it, mark it as done, and the overview updates instantly. Tasks are saved in this browser, so they are still here next time.",
    features: [
      "Add, edit and delete tasks with a title and description",
      "Mark tasks as completed or pending",
      "Low, Medium and High priority levels",
      "Due dates with overdue and due-today highlights",
      "Filter by All, Pending or Completed",
      "Search tasks by title and sort them",
      "Live totals and a progress indicator",
      "Saved automatically in localStorage",
    ],
    tags: ["React", "TypeScript", "Tailwind CSS", "localStorage"],
    stack: [
      { name: "React 19", detail: "Components, state and derived statistics" },
      { name: "TypeScript", detail: "A typed task model and validated saved data" },
      { name: "Tailwind CSS 4", detail: "Responsive layout and the portfolio's design tokens" },
      { name: "Web Storage API", detail: "Tasks persist in localStorage and sync across tabs" },
      { name: "HTML <dialog>", detail: "An accessible form for adding and editing tasks" },
    ],
    dataNote:
      "Tasks are stored only in your browser (localStorage). Nothing is sent to a server, and clearing your browser data removes them.",
    apis: [],
    seo: {
      title: "Personal Task Manager | Abdullah Imdad Lakho",
      description:
        "A working task manager built with React and TypeScript: add, edit and complete tasks, set priorities and due dates, search, filter and track progress. Saved in your browser.",
    },
  },
  {
    id: "expense-tracker",
    number: "02",
    path: "/projects/expense-tracker",
    name: "Expense Tracker",
    summary:
      "Record income and expenses by category and date. The balance, monthly summary and charts are calculated from your own entries.",
    intro:
      "A simple money tracker for income and expenses. Add a transaction with a category and a date, and the balance, monthly summary and charts update straight away. Transactions stay in this browser; live exchange rates are an optional extra.",
    features: [
      "Add, edit and delete income and expense entries",
      "Categories: Food, Education, Shopping, Transport and Others",
      "Total income, total expenses and remaining balance",
      "Filter the history by type, category and date range",
      "Monthly summary with a month picker",
      "Charts for income against expenses and spending by category",
      "Balance conversion with live rates from the Frankfurter API",
      "Saved automatically in localStorage",
    ],
    tags: ["React", "TypeScript", "SVG charts", "Frankfurter API"],
    stack: [
      { name: "React 19", detail: "Components, state and memoised calculations" },
      { name: "TypeScript", detail: "Typed transactions, stored in whole paisa to avoid rounding errors" },
      { name: "SVG", detail: "Hand-built, accessible charts with no chart library" },
      { name: "Intl API", detail: "Currency and date formatting" },
      { name: "Frankfurter API", detail: "Optional live exchange rates for converting totals" },
      { name: "Web Storage API", detail: "Transactions persist in localStorage" },
    ],
    dataNote:
      "Transactions are stored only in your browser (localStorage), and every total and chart is calculated from them. The only network request goes to Frankfurter for exchange rates; if it is unavailable, everything else keeps working.",
    apis: [
      {
        name: "Frankfurter",
        href: "https://frankfurter.dev/",
        docs: "https://frankfurter.dev/docs/",
        detail: "Free, open-source exchange-rate API. No key required.",
      },
    ],
    seo: {
      title: "Expense Tracker | Abdullah Imdad Lakho",
      description:
        "A working expense tracker built with React and TypeScript: record income and expenses, filter by category and date, see monthly summaries and charts, and convert totals with live exchange rates.",
    },
  },
  {
    id: "weather-dashboard",
    number: "03",
    path: "/projects/weather-dashboard",
    name: "Weather Dashboard",
    summary:
      "Search any city for live conditions, the next 24 hours and a 7-day forecast, with data from the Open-Meteo API.",
    intro:
      "Search for a city, pick the right match, and see its current weather, the next 24 hours and a 7-day forecast. Every value is requested live from Open-Meteo when you search; nothing is stored or made up.",
    features: [
      "City search that lists matching places with their country",
      "Current temperature, feels-like, humidity, wind and precipitation",
      "Condition icons for day and night",
      "Hourly temperatures for the next 24 hours",
      "7-day forecast with highs, lows and chance of rain",
      "Sunrise and sunset times",
      "Loading, error and no-results states",
      "Recent cities remembered for quick access",
    ],
    tags: ["React", "TypeScript", "Open-Meteo API", "Fetch API"],
    stack: [
      { name: "React 19", detail: "Components and request state" },
      { name: "TypeScript", detail: "Typed and validated API responses" },
      { name: "Fetch API", detail: "Requests with timeouts; AbortController cancels outdated searches" },
      { name: "Open-Meteo Geocoding API", detail: "Finds places that match a city name" },
      { name: "Open-Meteo Forecast API", detail: "Current, hourly and daily weather" },
      { name: "SVG", detail: "The hourly temperature line" },
    ],
    dataNote:
      "Searches go straight from your browser to Open-Meteo. Only your recent city choices are remembered in localStorage; weather data is always fetched fresh.",
    apis: [
      {
        name: "Open-Meteo Forecast API",
        href: "https://open-meteo.com/",
        docs: "https://open-meteo.com/en/docs",
        detail: "Free for non-commercial use, no key required. Data licensed under CC BY 4.0.",
      },
      {
        name: "Open-Meteo Geocoding API",
        href: "https://open-meteo.com/",
        docs: "https://open-meteo.com/en/docs/geocoding-api",
        detail: "City search based on GeoNames data. No key required.",
      },
    ],
    seo: {
      title: "Weather Dashboard | Abdullah Imdad Lakho",
      description:
        "A working weather dashboard built with React and TypeScript: search any city and see live conditions, hourly temperatures and a 7-day forecast from the Open-Meteo API.",
    },
  },
];

export function getProject(id: string): Project | undefined {
  return PROJECTS.find((project) => project.id === id);
}

export function nextProject(project: Project): Project {
  const index = PROJECTS.findIndex((p) => p.id === project.id);
  return PROJECTS[(index + 1) % PROJECTS.length];
}

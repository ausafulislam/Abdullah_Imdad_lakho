/**
 * Single source of truth for portfolio content and contact details.
 * Components only render what is defined here — keep it factual: no invented
 * experience, clients or achievements. The projects (src/data/projects.ts) are
 * real, working apps in this repository.
 */

/* ------------------------------------------------------------------ */
/* Identity & contact                                                  */
/* ------------------------------------------------------------------ */

export const PROFILE = {
  name: "Abdullah Imdad Lakho",
  firstName: "Abdullah",
  lastName: "Imdad Lakho",
  title: "BS AI Student at DUET Karachi",
  tagline: "Building my foundation in Artificial Intelligence, one step at a time.",
  siteUrl: "https://abdullah-imdad-lakho.vercel.app",
} as const;

export const CONTACT = {
  email: "abdullah17.imdad@gmail.com",
  phoneDisplay: "0303-3313312",
  /** Dialable local number for tel: links. */
  phoneHref: "tel:03033313312",
  location: "Karachi, Pakistan",
  /** wa.me needs country code + number, with no "+", spaces, or leading zero. */
  whatsappNumber: "923033313312",
  linkedin: "https://www.linkedin.com/in/abdullah-imdad-lakho-150347364/",
} as const;

export const WHATSAPP_URL = `https://wa.me/${CONTACT.whatsappNumber}`;
export const MAILTO_URL = `mailto:${CONTACT.email}`;

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */

export type SectionId = "top" | "about" | "work" | "projects" | "experience" | "achievements" | "contact";

export const NAV_LINKS: { label: string; href: `#${SectionId}`; id: SectionId }[] = [
  { label: "Home", href: "#top", id: "top" },
  { label: "About", href: "#about", id: "about" },
  { label: "Work", href: "#work", id: "work" },
  { label: "Projects", href: "#projects", id: "projects" },
  { label: "Experience", href: "#experience", id: "experience" },
  { label: "Contact", href: "#contact", id: "contact" },
];

/** Sections that drive the active nav indicator, in page order. */
export const SPY_SECTIONS: SectionId[] = ["top", "about", "work", "projects", "experience", "achievements", "contact"];

/** Sections without their own nav item highlight the closest related one. */
export const NAV_ALIAS: Partial<Record<SectionId, SectionId>> = {
  achievements: "experience",
};

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

export const HERO_STATS = [
  { value: 6, suffix: "+", label: "Areas of Focus" },
  { value: 18, suffix: "+", label: "Skills in Progress" },
  { value: 3, suffix: "+", label: "Academic Certificates" },
] as const;

/* ------------------------------------------------------------------ */
/* About                                                               */
/* ------------------------------------------------------------------ */

export const ABOUT = {
  paragraphs: [
    "I'm Abdullah Imdad Lakho, a BS Artificial Intelligence student at Dawood University of Engineering and Technology (DUET), Karachi. I'm at the beginning of my journey in technology, focused on developing a strong foundation in programming, artificial intelligence, problem-solving, analytical thinking, mathematics and digital technology.",
    "My interest in AI comes from curiosity about how computers, algorithms, data and intelligent systems can be used to understand problems and create practical solutions.",
  ],
} as const;

export type EducationIcon = "graduation" | "book" | "school" | "community";

export const EDUCATION: { icon: EducationIcon; title: string; meta: string[] }[] = [
  { icon: "graduation", title: "BS Artificial Intelligence", meta: ["DUET, Karachi", "2026 – Present"] },
  { icon: "book", title: "HSC", meta: ["Completed from D.J. Sindh Science College"] },
  { icon: "school", title: "SSC", meta: ["Completed from Noor Eastern Collegiate, Nawabshah"] },
  { icon: "community", title: "AI Community / AICP – DUET", meta: ["Interested in participation & coordination"] },
];

/* ------------------------------------------------------------------ */
/* Areas of interest                                                  */
/* ------------------------------------------------------------------ */

export type InterestIcon = "cpu" | "code" | "laptop" | "chart" | "database" | "bulb";

export type Interest = {
  id: string;
  title: string;
  icon: InterestIcon;
  summary: string;
};

export const interests: Interest[] = [
  {
    id: "ai-foundations",
    title: "Artificial Intelligence",
    icon: "cpu",
    summary: "Exploring intelligent systems.",
  },
  {
    id: "software-dev",
    title: "Software Development",
    icon: "code",
    summary: "Turning ideas into real projects.",
  },
  {
    id: "programming",
    title: "Programming",
    icon: "laptop",
    summary: "Strengthening core programming skills.",
  },
  {
    id: "machine-learning",
    title: "Machine Learning",
    icon: "chart",
    summary: "Learning the mathematics behind intelligent models.",
  },
  {
    id: "data-analytics",
    title: "Data & Analytics",
    icon: "database",
    summary: "Understanding and finding insights in data.",
  },
  {
    id: "technology",
    title: "Technology",
    icon: "bulb",
    summary: "Exploring computing and digital technologies.",
  },
];

/* ------------------------------------------------------------------ */
/* Skills in progress (compact block inside the Work section)          */
/* ------------------------------------------------------------------ */

export const SKILL_GROUPS: { title: string; items: string[] }[] = [
  {
    title: "Programming Fundamentals",
    items: ["C programming", "Variables, loops & conditionals", "Functions", "Problem-solving logic"],
  },
  {
    title: "AI & Computing Foundations",
    items: ["AI fundamentals", "Intelligent systems", "Maths for computing", "University computing concepts"],
  },
  {
    title: "Data & Productivity Tools",
    items: ["Data-analysis fundamentals", "Microsoft Word", "Microsoft Excel", "Microsoft PowerPoint"],
  },
  {
    title: "Thinking & Collaboration",
    items: [
      "Analytical thinking & logical reasoning",
      "Decision-making",
      "Communication & teamwork",
      "Adaptability & time management",
      "Continuous learning",
    ],
  },
];

/* ------------------------------------------------------------------ */
/* How I learn                                                         */
/* ------------------------------------------------------------------ */

export const LEARNING_STEPS = [
  { n: "01", title: "Learn", desc: "Understanding programming, AI and computing concepts properly." },
  { n: "02", title: "Build", desc: "Turning what I learn into practical skills through exercises and coursework." },
  { n: "03", title: "Improve", desc: "Seeking feedback, fixing weak spots and refining my approach." },
  { n: "04", title: "Repeat", desc: "Continuous learning and steady practice." },
] as const;

/* ------------------------------------------------------------------ */
/* Achievements                                                        */
/* ------------------------------------------------------------------ */

export type Achievement = {
  id: string;
  icon: "award" | "result";
  kicker: string;
  title: string;
  detail: string;
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "mismo-2019",
    icon: "award",
    kicker: "MISMO · November 2019",
    title: "Certificate of Participation at the 15th Maarif Inter-School Maths Olympiad.",
    detail: "Organised by Pak-Turk Maarif International Schools.",
  },
  {
    id: "icats-2020",
    icon: "award",
    kicker: "ICATS · 21–22 October 2020",
    title: "Certificate of Participation at the ICATS English Linguistics Contest 2020.",
    detail: "Organised by International CATS Contests.",
  },
  {
    id: "ssc-2024",
    icon: "result",
    kicker: "SSC · 2024",
    title: "Secondary School Certificate (SSC).",
    detail: "Completed from Noor Eastern Collegiate, Nawabshah.",
  },
];

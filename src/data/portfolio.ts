export type Project = {
  id: string;
  title: string;
  category:
    | "Artificial Intelligence"
    | "Software Development"
    | "Programming"
    | "Machine Learning"
    | "Data & Analytics"
    | "Technology";
  year: string;
  image: string;
  blurb: string;
};

export const projects: Project[] = [
  {
    id: "ai-foundations",
    title: "Foundations of Intelligent Systems",
    category: "Artificial Intelligence",
    year: "2026",
    image: "/images/interest-ai-systems.svg",
    blurb: "How algorithms, data and intelligent systems can be used to understand problems and create practical solutions.",
  },
  {
    id: "software-dev",
    title: "From Theory to Working Code",
    category: "Software Development",
    year: "2026",
    image: "/images/interest-software.svg",
    blurb: "Turning what I learn in the classroom into practical skills and meaningful, working software.",
  },
  {
    id: "programming",
    title: "C, Loops, Functions & Logic",
    category: "Programming",
    year: "2026",
    image: "/images/interest-programming.svg",
    blurb: "C programming fundamentals — variables, loops, conditionals, functions and basic problem-solving logic.",
  },
  {
    id: "machine-learning",
    title: "The Maths Behind ML",
    category: "Machine Learning",
    year: "2026",
    image: "/images/interest-machine-learning.svg",
    blurb: "A long-term interest in machine learning, starting with the mathematics and analytical thinking underneath it.",
  },
  {
    id: "data-analytics",
    title: "Data-Analysis Fundamentals",
    category: "Data & Analytics",
    year: "2026",
    image: "/images/interest-data-analytics.svg",
    blurb: "Analytical thinking, logical reasoning and data fundamentals applied to real, concrete problems.",
  },
  {
    id: "technology",
    title: "University Computing Concepts",
    category: "Technology",
    year: "2026",
    image: "/images/interest-computing.svg",
    blurb: "University-level computing and technology concepts for future AI and software projects.",
  },
];

export const categories = [
  "All",
  "Artificial Intelligence",
  "Software Development",
  "Programming",
  "Machine Learning",
  "Data & Analytics",
  "Technology",
] as const;

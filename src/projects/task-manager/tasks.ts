/** Task model, validation and the pure helpers behind the Task Manager UI. */
import { daysBetween, formatDate, isISODate } from "../../lib/dates";

export type Priority = "low" | "medium" | "high";

export type Task = {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  /** "YYYY-MM-DD", or "" for no due date */
  dueDate: string;
  completed: boolean;
  createdAt: number;
  updatedAt: number;
  completedAt: number | null;
};

export type TaskView = "all" | "pending" | "completed";
export type TaskSort = "due" | "priority" | "newest";

export const STORAGE_KEY = "abdullah-portfolio:task-manager:v1";
export const TITLE_MAX = 120;
export const DESCRIPTION_MAX = 500;
export const NO_TASKS: Task[] = [];

export const PRIORITIES: { value: Priority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const PRIORITY_RANK: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

const isPriority = (value: unknown): value is Priority => value === "low" || value === "medium" || value === "high";
const timestamp = (value: unknown, fallback: number) =>
  typeof value === "number" && Number.isFinite(value) && value > 0 ? value : fallback;

/** Validates stored data: anything malformed is dropped or repaired, never trusted. */
export function parseTasks(value: unknown): Task[] {
  if (!Array.isArray(value)) return NO_TASKS;
  const seen = new Set<string>();
  const tasks: Task[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const raw = item as Record<string, unknown>;
    const title = typeof raw.title === "string" ? raw.title.trim().slice(0, TITLE_MAX) : "";
    if (typeof raw.id !== "string" || !raw.id || seen.has(raw.id) || !title) continue;
    seen.add(raw.id);
    const createdAt = timestamp(raw.createdAt, Date.now());
    const completed = raw.completed === true;
    tasks.push({
      id: raw.id,
      title,
      description: typeof raw.description === "string" ? raw.description.trim().slice(0, DESCRIPTION_MAX) : "",
      priority: isPriority(raw.priority) ? raw.priority : "medium",
      dueDate: isISODate(raw.dueDate) ? raw.dueDate : "",
      completed,
      createdAt,
      updatedAt: timestamp(raw.updatedAt, createdAt),
      completedAt: completed ? timestamp(raw.completedAt, createdAt) : null,
    });
  }
  return tasks;
}

/* ---- Form ---- */

export type TaskDraft = {
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
  completed: boolean;
};

export type DraftErrors = Partial<Record<"title" | "description" | "dueDate", string>>;

export const EMPTY_DRAFT: TaskDraft = { title: "", description: "", priority: "medium", dueDate: "", completed: false };

export function toDraft(task: Task): TaskDraft {
  const { title, description, priority, dueDate, completed } = task;
  return { title, description, priority, dueDate, completed };
}

export function validateDraft(draft: TaskDraft, today: string, original?: Task): DraftErrors {
  const errors: DraftErrors = {};
  const title = draft.title.trim();
  if (!title) errors.title = "Enter a title for the task.";
  else if (title.length > TITLE_MAX) errors.title = `Keep the title to ${TITLE_MAX} characters or fewer.`;

  if (draft.description.trim().length > DESCRIPTION_MAX) {
    errors.description = `Keep the description to ${DESCRIPTION_MAX} characters or fewer.`;
  }

  if (draft.dueDate) {
    if (!isISODate(draft.dueDate)) errors.dueDate = "Enter a valid date.";
    // A new deadline can't already be in the past (an existing one may be kept).
    else if (draft.dueDate < today && draft.dueDate !== original?.dueDate && !draft.completed) {
      errors.dueDate = "Choose today or a later date.";
    }
  }
  return errors;
}

/* ---- Derived data ---- */

export type DueInfo = { tone: "overdue" | "today" | "soon" | "later" | "done"; label: string };

export function dueInfo(task: Task, today: string): DueInfo | null {
  if (!task.dueDate) return null;
  const date = formatDate(task.dueDate);
  if (task.completed) return { tone: "done", label: `Due ${date}` };
  const days = daysBetween(today, task.dueDate);
  if (days < 0) return { tone: "overdue", label: `Overdue · was due ${date}` };
  if (days === 0) return { tone: "today", label: "Due today" };
  if (days === 1) return { tone: "soon", label: "Due tomorrow" };
  return { tone: "later", label: `Due ${date}` };
}

export function isOverdue(task: Task, today: string) {
  return !task.completed && task.dueDate !== "" && task.dueDate < today;
}

export function taskStats(tasks: Task[], today: string) {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const overdue = tasks.filter((task) => isOverdue(task, today)).length;
  return {
    total,
    completed,
    pending: total - completed,
    overdue,
    progress: total === 0 ? 0 : Math.round((completed / total) * 100),
  };
}

/** Pending tasks first, then completed ones; each group in the chosen order. */
export function sortTasks(tasks: Task[], sort: TaskSort): Task[] {
  const byDue = (a: Task, b: Task) => (a.dueDate || "9999-12-31").localeCompare(b.dueDate || "9999-12-31");
  const byPriority = (a: Task, b: Task) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
  const byNewest = (a: Task, b: Task) => b.createdAt - a.createdAt;
  const compare =
    sort === "due"
      ? (a: Task, b: Task) => byDue(a, b) || byPriority(a, b) || byNewest(a, b)
      : sort === "priority"
        ? (a: Task, b: Task) => byPriority(a, b) || byDue(a, b) || byNewest(a, b)
        : byNewest;
  const pending = tasks.filter((task) => !task.completed).sort(compare);
  const done = tasks.filter((task) => task.completed).sort(compare);
  return [...pending, ...done];
}

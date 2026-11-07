/**
 * Calendar-date helpers. Dates are stored as "YYYY-MM-DD" strings in the
 * user's local calendar (what <input type="date"> produces), so a due date or
 * transaction date never shifts by a day because of time zones.
 */

const pad = (n: number) => String(n).padStart(2, "0");

export function toISODate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function todayISO(): string {
  return toISODate(new Date());
}

export function isISODate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
}

function parseISODate(value: string): Date {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** "7 Nov 2026" */
export function formatDate(value: string, options: Intl.DateTimeFormatOptions = {}): string {
  return parseISODate(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", ...options });
}

/** "Saturday, 7 November" */
export function formatLongDate(date: Date): string {
  return date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
}

/** Whole days from `from` to `to` (negative when `to` is earlier). */
export function daysBetween(from: string, to: string): number {
  const utc = (value: string) => {
    const [y, m, d] = value.split("-").map(Number);
    return Date.UTC(y, m - 1, d);
  };
  return Math.round((utc(to) - utc(from)) / 86_400_000);
}

/* ---- Months ("YYYY-MM") ---- */

export function isMonthKey(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-(0[1-9]|1[0-2])$/.test(value);
}

export function currentMonth(): string {
  return todayISO().slice(0, 7);
}

export function shiftMonth(month: string, delta: number): string {
  const [y, m] = month.split("-").map(Number);
  const date = new Date(y, m - 1 + delta, 1);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
}

/** Inclusive list of months from `start` to `end`. */
export function monthRange(start: string, end: string): string[] {
  const months: string[] = [];
  for (let month = start; month <= end && months.length < 1200; month = shiftMonth(month, 1)) months.push(month);
  return months;
}

/** "November 2026" (long) or "Nov" (short) */
export function formatMonth(month: string, style: "long" | "short" = "long"): string {
  const [y, m] = month.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString(
    "en-GB",
    style === "long" ? { month: "long", year: "numeric" } : { month: "short" },
  );
}

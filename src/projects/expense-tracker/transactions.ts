/**
 * Transaction model, validation and calculations for the Expense Tracker.
 * Amounts are stored as whole paisa (1/100 of a rupee) so sums never pick up
 * floating-point errors. Every number in the UI is derived from stored entries.
 */
import { isISODate, monthRange, shiftMonth } from "../../lib/dates";

export type TxType = "income" | "expense";

export type Transaction = {
  id: string;
  type: TxType;
  /** Whole paisa, > 0 */
  amount: number;
  description: string;
  category: string;
  /** "YYYY-MM-DD" */
  date: string;
  createdAt: number;
  updatedAt: number;
};

export const CURRENCY = "PKR";
export const STORAGE_KEY = "abdullah-portfolio:expense-tracker:v1";
export const DESCRIPTION_MAX = 80;
export const MIN_DATE = "2000-01-01";
/** Rs 100,000,000 */
export const MAX_AMOUNT = 10_000_000_000;
export const NO_TRANSACTIONS: Transaction[] = [];

export const EXPENSE_CATEGORIES = ["Food", "Education", "Shopping", "Transport", "Others"];
export const INCOME_CATEGORIES = ["Allowance", "Scholarship", "Part-time job", "Gift", "Others"];
export const ALL_CATEGORIES = [...new Set([...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES])];

export function categoriesFor(type: TxType): string[] {
  return type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
}

/** Validates stored data: malformed entries are dropped, never trusted. */
export function parseTransactions(value: unknown): Transaction[] {
  if (!Array.isArray(value)) return NO_TRANSACTIONS;
  const seen = new Set<string>();
  const list: Transaction[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const raw = item as Record<string, unknown>;
    const type = raw.type === "income" || raw.type === "expense" ? raw.type : null;
    const description = typeof raw.description === "string" ? raw.description.trim().slice(0, DESCRIPTION_MAX) : "";
    if (typeof raw.id !== "string" || !raw.id || seen.has(raw.id) || !type || !description) continue;
    if (typeof raw.amount !== "number" || !Number.isInteger(raw.amount) || raw.amount <= 0 || raw.amount > MAX_AMOUNT) continue;
    if (!isISODate(raw.date)) continue;
    seen.add(raw.id);
    const createdAt = typeof raw.createdAt === "number" && raw.createdAt > 0 ? raw.createdAt : Date.now();
    list.push({
      id: raw.id,
      type,
      amount: raw.amount,
      description,
      category:
        typeof raw.category === "string" && categoriesFor(type).includes(raw.category) ? raw.category : "Others",
      date: raw.date,
      createdAt,
      updatedAt: typeof raw.updatedAt === "number" && raw.updatedAt > 0 ? raw.updatedAt : createdAt,
    });
  }
  return list;
}

/* ------------------------------------------------------------------ */
/* Money                                                               */
/* ------------------------------------------------------------------ */

const formatters = new Map<string, Intl.NumberFormat>();

function formatter(key: string, options: Intl.NumberFormatOptions) {
  let cached = formatters.get(key);
  if (!cached) {
    cached = new Intl.NumberFormat("en", options);
    formatters.set(key, cached);
  }
  return cached;
}

/** Rupee amount from paisa: "Rs 1,500" or "Rs 1,500.50". */
export function formatMoney(paisa: number): string {
  const amount = paisa / 100;
  // CLDR formats PKR without decimals, which would round real paisa away.
  const digits = Number.isInteger(amount) ? 0 : 2;
  return formatter(`PKR:${digits}`, {
    style: "currency",
    currency: CURRENCY,
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
    .format(amount)
    .replace("-", "\u2212"); // a true minus sign, matching the transaction list
}

/** Compact axis label from paisa: "12K", "1.5M". */
export function formatCompact(paisa: number): string {
  return formatter("compact", { notation: "compact", maximumFractionDigits: 1 }).format(paisa / 100);
}

/** An amount in another currency (already converted), using that currency's usual decimals. */
export function formatForeign(amount: number, currency: string): string {
  return formatter(`fx:${currency}`, { style: "currency", currency, currencyDisplay: "narrowSymbol" }).format(amount);
}

/** "1,500.50" → 150050 paisa, with a human-readable error otherwise. */
export function parseAmount(input: string): { paisa: number; error?: undefined } | { error: string; paisa?: undefined } {
  const cleaned = input.replace(/[,\s]/g, "");
  if (!cleaned) return { error: "Enter an amount." };
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return { error: "Enter a number with up to 2 decimal places, like 1500 or 1500.50." };
  const [whole, fraction = ""] = cleaned.split(".");
  if (whole.replace(/^0+/, "").length > 9) return { error: "That amount is too large." };
  const paisa = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  if (paisa <= 0) return { error: "The amount must be more than zero." };
  if (paisa > MAX_AMOUNT) return { error: "That amount is too large." };
  return { paisa };
}

export function amountToInput(paisa: number): string {
  const amount = paisa / 100;
  return Number.isInteger(amount) ? String(amount) : amount.toFixed(2);
}

/* ------------------------------------------------------------------ */
/* Form                                                                */
/* ------------------------------------------------------------------ */

export type TxDraft = { type: TxType; amount: string; description: string; category: string; date: string };
export type TxErrors = Partial<Record<"amount" | "description" | "category" | "date", string>>;

export function validateDraft(draft: TxDraft, today: string): { errors: TxErrors; paisa?: number } {
  const errors: TxErrors = {};
  const amount = parseAmount(draft.amount);
  if (amount.error) errors.amount = amount.error;

  const description = draft.description.trim();
  if (!description) errors.description = "Add a short description, e.g. “Bus fare”.";
  else if (description.length > DESCRIPTION_MAX) errors.description = `Keep it to ${DESCRIPTION_MAX} characters or fewer.`;

  if (!categoriesFor(draft.type).includes(draft.category)) errors.category = "Choose a category.";

  if (!draft.date) errors.date = "Choose a date.";
  else if (!isISODate(draft.date)) errors.date = "Enter a valid date.";
  else if (draft.date > today) errors.date = "The date can't be in the future.";
  else if (draft.date < MIN_DATE) errors.date = "Choose a date from the year 2000 onwards.";

  return { errors, paisa: amount.paisa };
}

/* ------------------------------------------------------------------ */
/* Calculations                                                        */
/* ------------------------------------------------------------------ */

export type Totals = { income: number; expense: number; balance: number; count: number };

export function totals(list: Transaction[]): Totals {
  let income = 0;
  let expense = 0;
  for (const tx of list) {
    if (tx.type === "income") income += tx.amount;
    else expense += tx.amount;
  }
  return { income, expense, balance: income - expense, count: list.length };
}

export function inMonth(list: Transaction[], month: string): Transaction[] {
  return list.filter((tx) => tx.date.startsWith(month));
}

export type CategoryShare = { category: string; amount: number; share: number };

/** Expenses for one month grouped by category, largest first. */
export function categoryBreakdown(list: Transaction[], month: string): CategoryShare[] {
  const sums = new Map<string, number>();
  let total = 0;
  for (const tx of list) {
    if (tx.type !== "expense" || !tx.date.startsWith(month)) continue;
    sums.set(tx.category, (sums.get(tx.category) ?? 0) + tx.amount);
    total += tx.amount;
  }
  return [...sums.entries()]
    .map(([category, amount]) => ({ category, amount, share: total ? amount / total : 0 }))
    .sort((a, b) => b.amount - a.amount);
}

export type MonthPoint = { month: string; income: number; expense: number };

/** Income and expenses for `count` months ending with `endMonth`. */
export function monthlySeries(list: Transaction[], endMonth: string, count = 6): MonthPoint[] {
  const months = monthRange(shiftMonth(endMonth, -(count - 1)), endMonth);
  const points = new Map(months.map((month) => [month, { month, income: 0, expense: 0 }]));
  for (const tx of list) {
    const point = points.get(tx.date.slice(0, 7));
    if (point) point[tx.type] += tx.amount;
  }
  return months.map((month) => points.get(month)!);
}

/** Newest first; entries on the same day by the order they were added. */
export function sortTransactions(list: Transaction[]): Transaction[] {
  return [...list].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt);
}

export type TxFilters = { type: "all" | TxType; category: string; from: string; to: string };
export const NO_FILTERS: TxFilters = { type: "all", category: "all", from: "", to: "" };

export function applyFilters(list: Transaction[], filters: TxFilters): Transaction[] {
  return list.filter(
    (tx) =>
      (filters.type === "all" || tx.type === filters.type) &&
      (filters.category === "all" || tx.category === filters.category) &&
      (!filters.from || tx.date >= filters.from) &&
      (!filters.to || tx.date <= filters.to),
  );
}

export function hasFilters(filters: TxFilters): boolean {
  return filters.type !== "all" || filters.category !== "all" || Boolean(filters.from) || Boolean(filters.to);
}

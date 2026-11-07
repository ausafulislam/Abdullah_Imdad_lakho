import { useEffect, useId, useMemo, useRef, useState, type FormEvent, type RefObject } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Award,
  Briefcase,
  Bus,
  ChartColumn,
  ChevronLeft,
  ChevronRight,
  Coins,
  Gift,
  GraduationCap,
  HandCoins,
  Package,
  Pencil,
  Plus,
  ReceiptText,
  SearchX,
  ShoppingBag,
  Trash2,
  Utensils,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { createId, usePersistentState } from "../../lib/storage";
import { currentMonth, formatDate, formatMonth, monthRange, shiftMonth } from "../../lib/dates";
import { cn } from "../../utils/cn";
import { useToday } from "../shared/useToday";
import {
  describedBy,
  EmptyState,
  Field,
  IconButton,
  inputClass,
  labelClass,
  Modal,
  Panel,
  SegmentedRadio,
  Select,
  StatCard,
  ToggleGroup,
  useAnnouncer,
} from "../shared/ui";
import { CategoryBreakdown, Legend, MonthlyChart } from "./charts";
import CurrencyConverter from "./CurrencyConverter";
import {
  ALL_CATEGORIES,
  amountToInput,
  applyFilters,
  categoriesFor,
  categoryBreakdown,
  DESCRIPTION_MAX,
  formatMoney,
  hasFilters,
  inMonth,
  monthlySeries,
  NO_FILTERS,
  NO_TRANSACTIONS,
  parseTransactions,
  sortTransactions,
  STORAGE_KEY,
  totals,
  validateDraft,
  type Transaction,
  type TxDraft,
  type TxErrors,
  type TxFilters,
  type TxType,
} from "./transactions";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Food: Utensils,
  Education: GraduationCap,
  Shopping: ShoppingBag,
  Transport: Bus,
  Allowance: HandCoins,
  Scholarship: Award,
  "Part-time job": Briefcase,
  Gift: Gift,
};

const iconFor = (tx: Transaction) => CATEGORY_ICONS[tx.category] ?? (tx.type === "income" ? Coins : Package);

/* ------------------------------------------------------------------ */
/* Transaction row                                                     */
/* ------------------------------------------------------------------ */

function TransactionRow({
  tx,
  confirming,
  onEdit,
  onAskDelete,
  onCancelDelete,
  onDelete,
}: {
  tx: Transaction;
  confirming: boolean;
  onEdit: () => void;
  onAskDelete: () => void;
  onCancelDelete: () => void;
  onDelete: () => void;
}) {
  const Icon = iconFor(tx);
  const income = tx.type === "income";
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (confirming) cancelRef.current?.focus();
  }, [confirming]);

  return (
    <li className="py-3 first:pt-0 last:pb-0">
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            income ? "bg-lime text-ink" : "bg-mist text-ink",
          )}
        >
          <Icon className="h-[1.125rem] w-[1.125rem]" strokeWidth={1.8} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 break-words text-[0.9375rem] font-semibold leading-snug sm:line-clamp-1">{tx.description}</p>
          <p className="truncate text-xs text-muted">
            {tx.category} · {formatDate(tx.date)}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[0.9375rem] font-semibold tabular-nums">
            <span aria-hidden="true">{income ? "+" : "−"}</span>
            <span className="sr-only">{income ? "Income of " : "Expense of "}</span>
            {formatMoney(tx.amount)}
          </p>
          <p className="text-xs text-muted">{income ? "Income" : "Expense"}</p>
        </div>
        {!confirming && (
          <div className="-mr-1.5 hidden shrink-0 items-center sm:flex">
            <IconButton label={`Edit “${tx.description}”`} icon={Pencil} onClick={onEdit} />
            <IconButton label={`Delete “${tx.description}”`} icon={Trash2} tone="danger" onClick={onAskDelete} />
          </div>
        )}
      </div>

      {confirming ? (
        <div
          role="group"
          aria-label={`Delete “${tx.description}”?`}
          onKeyDown={(event) => event.key === "Escape" && onCancelDelete()}
          className="mt-2 flex items-center justify-end gap-1.5"
        >
          <span className="text-xs font-semibold text-[#b42318]">Delete this entry?</span>
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancelDelete}
            className="h-8 rounded-full px-3 text-xs font-semibold text-[#4d4d4d] hover:bg-mist hover:text-ink"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="h-8 rounded-full bg-[#b42318] px-3 text-xs font-semibold text-white hover:bg-[#93190f]"
          >
            Delete
          </button>
        </div>
      ) : (
        <div className="mt-1 flex justify-end sm:hidden">
          <IconButton label={`Edit “${tx.description}”`} icon={Pencil} onClick={onEdit} className="h-8 w-8" />
          <IconButton
            label={`Delete “${tx.description}”`}
            icon={Trash2}
            tone="danger"
            onClick={onAskDelete}
            className="h-8 w-8"
          />
        </div>
      )}
    </li>
  );
}

/* ------------------------------------------------------------------ */
/* Add / edit form                                                     */
/* ------------------------------------------------------------------ */

function TransactionForm({
  initial,
  mode,
  today,
  amountRef,
  onSubmit,
  onCancel,
}: {
  initial: TxDraft;
  mode: "add" | "edit";
  today: string;
  amountRef: RefObject<HTMLInputElement | null>;
  onSubmit: (draft: TxDraft, paisa: number) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState(initial);
  const [errors, setErrors] = useState<TxErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const refs = {
    description: useRef<HTMLInputElement>(null),
    category: useRef<HTMLSelectElement>(null),
    date: useRef<HTMLInputElement>(null),
  };

  const update = (patch: Partial<TxDraft>) => {
    const next = { ...draft, ...patch };
    // Switching type: keep the category only if it exists for the new type.
    if (patch.type && !categoriesFor(patch.type).includes(next.category)) next.category = categoriesFor(patch.type)[0];
    setDraft(next);
    if (submitted) setErrors(validateDraft(next, today).errors);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    const { errors: found, paisa } = validateDraft(draft, today);
    setErrors(found);
    if (found.amount) return amountRef.current?.focus();
    if (found.description) return refs.description.current?.focus();
    if (found.category) return refs.category.current?.focus();
    if (found.date) return refs.date.current?.focus();
    onSubmit(draft, paisa!);
  };

  const income = draft.type === "income";

  return (
    <form noValidate onSubmit={submit} className="space-y-4">
      <SegmentedRadio
        name="tx-type"
        legend="Type"
        value={draft.type}
        onChange={(type) => update({ type })}
        options={[
          { value: "expense", label: "Expense", icon: <ArrowUpRight className="h-4 w-4" aria-hidden="true" /> },
          { value: "income", label: "Income", icon: <ArrowDownLeft className="h-4 w-4" aria-hidden="true" /> },
        ]}
      />

      <Field id="tx-amount" label="Amount (PKR)" error={errors.amount}>
        <div className="relative">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[0.9375rem] font-medium text-muted">
            Rs
          </span>
          <input
            ref={amountRef}
            id="tx-amount"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={draft.amount}
            placeholder="0"
            aria-invalid={Boolean(errors.amount)}
            aria-describedby={describedBy("tx-amount", errors.amount)}
            onChange={(event) => update({ amount: event.target.value })}
            className={cn(inputClass, "pl-11 tabular-nums")}
          />
        </div>
      </Field>

      <Field
        id="tx-description"
        label="Description"
        error={errors.description}
        aside={`${draft.description.length}/${DESCRIPTION_MAX}`}
      >
        <input
          ref={refs.description}
          id="tx-description"
          type="text"
          value={draft.description}
          maxLength={DESCRIPTION_MAX}
          autoComplete="off"
          placeholder={income ? "e.g. Monthly allowance" : "e.g. Lunch at the canteen"}
          aria-invalid={Boolean(errors.description)}
          aria-describedby={describedBy("tx-description", errors.description)}
          onChange={(event) => update({ description: event.target.value })}
          className={inputClass}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="tx-category" label="Category" error={errors.category}>
          <Select
            ref={refs.category}
            id="tx-category"
            value={draft.category}
            aria-invalid={Boolean(errors.category)}
            aria-describedby={describedBy("tx-category", errors.category)}
            onChange={(event) => update({ category: event.target.value })}
          >
            {categoriesFor(draft.type).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
        </Field>
        <Field id="tx-date" label="Date" error={errors.date}>
          <input
            ref={refs.date}
            id="tx-date"
            type="date"
            value={draft.date}
            max={today}
            aria-invalid={Boolean(errors.date)}
            aria-describedby={describedBy("tx-date", errors.date)}
            onChange={(event) => update({ date: event.target.value })}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancel} className="btn btn-outline btn-sm">
          Cancel
        </button>
        <button type="submit" className="btn btn-dark btn-sm">
          {mode === "edit" ? "Save changes" : income ? "Add income" : "Add expense"}
        </button>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* App                                                                 */
/* ------------------------------------------------------------------ */

type Editor = { mode: "add"; type: TxType } | { mode: "edit"; tx: Transaction } | null;

export default function ExpenseTracker() {
  const [transactions, setTransactions, saveFailed] = usePersistentState(
    STORAGE_KEY,
    parseTransactions,
    NO_TRANSACTIONS,
  );
  const today = useToday();
  const [filters, setFilters] = useState<TxFilters>(NO_FILTERS);
  const [month, setMonth] = useState(currentMonth);
  const [editor, setEditor] = useState<Editor>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const { region, announce } = useAnnouncer();
  const amountRef = useRef<HTMLInputElement>(null);
  const listHeadingRef = useRef<HTMLHeadingElement>(null);
  const ids = { category: useId(), from: useId(), to: useId(), month: useId() };

  const overall = useMemo(() => totals(transactions), [transactions]);
  const sorted = useMemo(() => sortTransactions(transactions), [transactions]);
  const filtered = useMemo(() => applyFilters(sorted, filters), [sorted, filters]);
  const filteredTotals = useMemo(() => totals(filtered), [filtered]);
  const monthTotals = useMemo(() => totals(inMonth(transactions, month)), [transactions, month]);
  const breakdown = useMemo(() => categoryBreakdown(transactions, month), [transactions, month]);
  const series = useMemo(() => monthlySeries(transactions, month, 6), [transactions, month]);

  // Months that can be summarised: from the earliest entry to the latest, always
  // including this month and the one currently selected.
  const months = useMemo(() => {
    const keys = [currentMonth(), month, ...transactions.map((tx) => tx.date.slice(0, 7))];
    const first = keys.reduce((min, key) => (key < min ? key : min));
    const last = keys.reduce((max, key) => (key > max ? key : max));
    return monthRange(first, last);
  }, [transactions, month]);
  const monthIndex = months.indexOf(month);

  const filtering = hasFilters(filters);
  const rangeInvalid = Boolean(filters.from && filters.to && filters.from > filters.to);
  const categoryOptions = filters.type === "all" ? ALL_CATEGORIES : categoriesFor(filters.type);

  const setFilter = (patch: Partial<TxFilters>) =>
    setFilters((prev) => {
      const next = { ...prev, ...patch };
      if (patch.type && next.category !== "all" && !(patch.type === "all" ? ALL_CATEGORIES : categoriesFor(patch.type)).includes(next.category)) {
        next.category = "all";
      }
      return next;
    });

  const save = (draft: TxDraft, paisa: number) => {
    const now = Date.now();
    const description = draft.description.trim();
    const label = draft.type === "income" ? "Income" : "Expense";
    if (editor?.mode === "edit") {
      const id = editor.tx.id;
      setTransactions((prev) =>
        prev.map((tx) =>
          tx.id === id
            ? { ...tx, type: draft.type, amount: paisa, description, category: draft.category, date: draft.date, updatedAt: now }
            : tx,
        ),
      );
      announce(`${label} “${description}” updated.`);
    } else {
      const tx: Transaction = {
        id: createId(),
        type: draft.type,
        amount: paisa,
        description,
        category: draft.category,
        date: draft.date,
        createdAt: now,
        updatedAt: now,
      };
      setTransactions((prev) => [...prev, tx]);
      // Show the new entry: reset filters that would hide it, and summarise its month.
      if (applyFilters([tx], filters).length === 0) setFilters(NO_FILTERS);
      setMonth(tx.date.slice(0, 7));
      announce(`${label} of ${formatMoney(paisa)} added.`);
    }
    setEditor(null);
  };

  const remove = (tx: Transaction) => {
    setTransactions((prev) => prev.filter((t) => t.id !== tx.id));
    setConfirmingId(null);
    announce(`“${tx.description}” deleted.`);
    listHeadingRef.current?.focus();
  };

  const draftFor = (current: Editor): TxDraft =>
    current?.mode === "edit"
      ? {
          type: current.tx.type,
          amount: amountToInput(current.tx.amount),
          description: current.tx.description,
          category: current.tx.category,
          date: current.tx.date,
        }
      : {
          type: current?.type ?? "expense",
          amount: "",
          description: "",
          category: categoriesFor(current?.type ?? "expense")[0],
          date: today,
        };

  return (
    <div className="flex flex-col gap-2 sm:gap-3 lg:gap-4">
      {region}

      {/* ---- Header ---- */}
      <div className="flex flex-col gap-3 rounded-[16px] border border-line bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div>
          <h3 className="text-[1.0625rem] font-bold tracking-[-0.02em]">My Money</h3>
          <p className="mt-0.5 text-[0.8125rem] text-muted">All amounts in Pakistani rupees (PKR)</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex">
          <button type="button" onClick={() => setEditor({ mode: "add", type: "income" })} className="btn btn-outline btn-sm">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Income
          </button>
          <button type="button" onClick={() => setEditor({ mode: "add", type: "expense" })} className="btn btn-dark btn-sm">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Expense
          </button>
        </div>
      </div>

      {/* ---- Totals ---- */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:gap-4">
        <StatCard
          label="Total income"
          value={formatMoney(overall.income)}
          icon={ArrowDownLeft}
          hint={`${transactions.filter((t) => t.type === "income").length} entries`}
        />
        <StatCard
          label="Total expenses"
          value={formatMoney(overall.expense)}
          icon={ArrowUpRight}
          hint={`${transactions.filter((t) => t.type === "expense").length} entries`}
        />
        <div className="col-span-2 sm:col-span-1">
          <StatCard
            label="Balance"
            value={formatMoney(overall.balance)}
            icon={Wallet}
            accent
            hint={
              overall.balance < 0 ? (
                <span className="font-semibold text-[#b42318]">Spending is more than income</span>
              ) : (
                "Income minus expenses"
              )
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:gap-3 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-4">
        {/* ---- History ---- */}
        <section aria-labelledby="tx-list-title" className="min-w-0 rounded-[16px] border border-line bg-white lg:self-start">
          <div className="flex flex-wrap items-baseline justify-between gap-2 px-4 pt-4 sm:px-5 sm:pt-5">
            <h3
              id="tx-list-title"
              ref={listHeadingRef}
              tabIndex={-1}
              className="flex items-center gap-2 text-[1rem] font-bold tracking-[-0.015em]"
            >
              <ReceiptText className="h-[1.0625rem] w-[1.0625rem]" aria-hidden="true" />
              Transaction history
            </h3>
            <p aria-live="polite" className="text-xs tabular-nums text-muted">
              {transactions.length === 0
                ? ""
                : filtering
                  ? `${filtered.length} of ${transactions.length} shown`
                  : `${transactions.length} ${transactions.length === 1 ? "entry" : "entries"}`}
            </p>
          </div>

          {transactions.length > 0 && (
            <div className="mt-4 space-y-3 px-4 sm:px-5">
              <ToggleGroup
                label="Filter by type"
                value={filters.type}
                onChange={(type) => setFilter({ type })}
                className="flex w-full sm:w-auto"
                options={[
                  { value: "all", label: "All" },
                  { value: "income", label: "Income" },
                  { value: "expense", label: "Expenses" },
                ]}
              />
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)]">
                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor={ids.category} className={labelClass}>
                    Category
                  </label>
                  <Select id={ids.category} value={filters.category} onChange={(event) => setFilter({ category: event.target.value })}>
                    <option value="all">All categories</option>
                    {categoryOptions.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <label htmlFor={ids.from} className={labelClass}>
                    From
                  </label>
                  <input
                    id={ids.from}
                    type="date"
                    value={filters.from}
                    max={filters.to || undefined}
                    aria-invalid={rangeInvalid}
                    onChange={(event) => setFilter({ from: event.target.value })}
                    className={cn(inputClass, "px-3 text-sm")}
                  />
                </div>
                <div>
                  <label htmlFor={ids.to} className={labelClass}>
                    To
                  </label>
                  <input
                    id={ids.to}
                    type="date"
                    value={filters.to}
                    min={filters.from || undefined}
                    aria-invalid={rangeInvalid}
                    onChange={(event) => setFilter({ to: event.target.value })}
                    className={cn(inputClass, "px-3 text-sm")}
                  />
                </div>
              </div>
              {rangeInvalid && (
                <p role="alert" className="text-[0.8125rem] text-[#b42318]">
                  The “From” date is after the “To” date, so nothing can match.
                </p>
              )}
              {filtering && (
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-mist px-3.5 py-2.5 text-[0.8125rem]">
                  <p className="tabular-nums text-[#4d4d4d]">
                    In view: <span className="font-semibold text-ink">+{formatMoney(filteredTotals.income)}</span> income ·{" "}
                    <span className="font-semibold text-ink">−{formatMoney(filteredTotals.expense)}</span> expenses
                  </p>
                  <button
                    type="button"
                    onClick={() => setFilters(NO_FILTERS)}
                    className="font-semibold text-ink underline decoration-[#c4c4c4] underline-offset-2 hover:decoration-ink"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="p-4 sm:p-5">
            {transactions.length === 0 ? (
              <EmptyState
                icon={Wallet}
                title="No transactions yet"
                action={
                  <button type="button" onClick={() => setEditor({ mode: "add", type: "expense" })} className="btn btn-dark btn-sm">
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    Add your first entry
                  </button>
                }
              >
                Add income or an expense to see your balance, monthly summary and charts. Entries are saved in this browser.
              </EmptyState>
            ) : filtered.length === 0 ? (
              <EmptyState
                icon={SearchX}
                title="No transactions match these filters"
                action={
                  <button type="button" onClick={() => setFilters(NO_FILTERS)} className="btn btn-outline btn-sm">
                    Clear filters
                  </button>
                }
              >
                Try another category or date range.
              </EmptyState>
            ) : (
              <ul className="divide-y divide-line">
                {filtered.map((tx) => (
                  <TransactionRow
                    key={tx.id}
                    tx={tx}
                    confirming={confirmingId === tx.id}
                    onEdit={() => setEditor({ mode: "edit", tx })}
                    onAskDelete={() => setConfirmingId(tx.id)}
                    onCancelDelete={() => setConfirmingId(null)}
                    onDelete={() => remove(tx)}
                  />
                ))}
              </ul>
            )}
            {saveFailed && (
              <p role="alert" className="mt-4 rounded-xl bg-[#fdf2f1] px-3.5 py-2.5 text-[0.8125rem] text-[#b42318]">
                Your browser blocked saving, so changes will be lost when you leave this page.
              </p>
            )}
          </div>
        </section>

        {/* ---- Insights ---- */}
        <div className="flex min-w-0 flex-col gap-2 sm:gap-3 lg:gap-4">
          <Panel
            title="Monthly summary"
            actions={
              <div className="flex items-center gap-1">
                <IconButton
                  label="Previous month"
                  icon={ChevronLeft}
                  onClick={() => setMonth(shiftMonth(month, -1))}
                  disabled={monthIndex <= 0}
                />
                <label htmlFor={ids.month} className="sr-only">
                  Month
                </label>
                <Select
                  id={ids.month}
                  value={month}
                  onChange={(event) => setMonth(event.target.value)}
                  className="h-9 w-[10.5rem] rounded-full text-sm font-semibold"
                >
                  {[...months].reverse().map((m) => (
                    <option key={m} value={m}>
                      {formatMonth(m)}
                    </option>
                  ))}
                </Select>
                <IconButton
                  label="Next month"
                  icon={ChevronRight}
                  onClick={() => setMonth(shiftMonth(month, 1))}
                  disabled={monthIndex >= months.length - 1}
                />
              </div>
            }
          >
            {/* Rows in a narrow panel, three tiles once there is room (container query). */}
            <div className="@container">
              <dl className="grid gap-1.5 @[26rem]:grid-cols-3 @[26rem]:gap-2">
                {[
                  { label: "Income", value: monthTotals.income },
                  { label: "Expenses", value: monthTotals.expense },
                  { label: "Net", value: monthTotals.balance },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-baseline justify-between gap-3 rounded-xl bg-mist px-3 py-2.5 @[26rem]:block"
                  >
                    <dt className="text-xs text-muted-strong">{item.label}</dt>
                    <dd className="whitespace-nowrap text-[0.9375rem] font-bold tabular-nums tracking-[-0.01em] @[26rem]:mt-0.5">
                      {formatMoney(item.value)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <p className="mt-2 text-xs text-muted">
              {monthTotals.count === 0
                ? `Nothing recorded in ${formatMonth(month)}.`
                : `${monthTotals.count} ${monthTotals.count === 1 ? "entry" : "entries"} in ${formatMonth(month)}${
                    monthTotals.income > 0
                      ? ` · ${Math.abs(Math.round((monthTotals.balance / monthTotals.income) * 100))}% of income ${monthTotals.balance >= 0 ? "left" : "overspent"}`
                      : ""
                  }`}
            </p>

            <h4 className="mt-5 text-[0.875rem] font-semibold">Spending by category</h4>
            <div className="mt-3">
              {breakdown.length > 0 ? (
                <CategoryBreakdown items={breakdown} />
              ) : (
                <p className="rounded-xl border border-dashed border-[#dcdcdc] px-4 py-5 text-center text-[0.8125rem] text-muted">
                  No expenses in {formatMonth(month)}.
                </p>
              )}
            </div>
          </Panel>

          <Panel
            title={
              <span className="flex items-center gap-2">
                <ChartColumn className="h-[1.0625rem] w-[1.0625rem]" aria-hidden="true" />
                Income vs expenses
              </span>
            }
            description={`Six months to ${formatMonth(month)}`}
            actions={<Legend />}
          >
            <MonthlyChart series={series} selected={month} />
          </Panel>

          <CurrencyConverter totals={overall} />
        </div>
      </div>

      <Modal
        open={editor !== null}
        onClose={() => setEditor(null)}
        title={
          editor?.mode === "edit"
            ? `Edit ${editor.tx.type === "income" ? "income" : "expense"}`
            : editor?.type === "income"
              ? "Add income"
              : "Add expense"
        }
        description="Amounts are in Pakistani rupees (PKR)."
        initialFocusRef={amountRef}
      >
        {editor && (
          <TransactionForm
            key={editor.mode === "edit" ? editor.tx.id : `new-${editor.type}`}
            initial={draftFor(editor)}
            mode={editor.mode}
            today={today}
            amountRef={amountRef}
            onSubmit={save}
            onCancel={() => setEditor(null)}
          />
        )}
      </Modal>
    </div>
  );
}

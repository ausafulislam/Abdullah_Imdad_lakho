import { useEffect, useId, useMemo, useRef, useState, type FormEvent, type RefObject } from "react";
import {
  CalendarDays,
  CircleAlert,
  CircleCheck,
  CircleDashed,
  Clock,
  Flag,
  ListChecks,
  ListTodo,
  Pencil,
  Plus,
  Search,
  SearchX,
  Trash2,
} from "lucide-react";
import { createId, usePersistentState } from "../../lib/storage";
import { formatLongDate } from "../../lib/dates";
import { cn } from "../../utils/cn";
import { useToday } from "../shared/useToday";
import {
  describedBy,
  EmptyState,
  Field,
  IconButton,
  inputClass,
  Modal,
  SegmentedRadio,
  Select,
  StatCard,
  textareaClass,
  useAnnouncer,
} from "../shared/ui";
import {
  DESCRIPTION_MAX,
  dueInfo,
  EMPTY_DRAFT,
  NO_TASKS,
  parseTasks,
  PRIORITIES,
  sortTasks,
  STORAGE_KEY,
  taskStats,
  TITLE_MAX,
  toDraft,
  validateDraft,
  type DraftErrors,
  type Priority,
  type Task,
  type TaskDraft,
  type TaskSort,
  type TaskView,
} from "./tasks";

const VIEW_LABELS: Record<TaskView, string> = { all: "All tasks", pending: "Pending", completed: "Completed" };

const PRIORITY_STYLE: Record<Priority, string> = {
  high: "bg-ink text-white",
  medium: "bg-lime text-ink",
  low: "bg-mist text-[#4d4d4d]",
};

/* ------------------------------------------------------------------ */
/* Pieces                                                              */
/* ------------------------------------------------------------------ */

function PriorityBadge({ priority }: { priority: Priority }) {
  const label = PRIORITIES.find((p) => p.value === priority)?.label ?? priority;
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[0.6875rem] font-semibold",
        PRIORITY_STYLE[priority],
      )}
    >
      <Flag className="h-3 w-3" aria-hidden="true" />
      {label}
      <span className="sr-only"> priority</span>
    </span>
  );
}

function ProgressRing({ value }: { value: number }) {
  const r = 34;
  const circumference = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 80 80" className="h-20 w-20 shrink-0" aria-hidden="true">
      <circle cx="40" cy="40" r={r} fill="none" stroke="#f0f0f0" strokeWidth="8" />
      <circle
        cx="40"
        cy="40"
        r={r}
        fill="none"
        stroke="var(--color-lime)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={`${(value / 100) * circumference} ${circumference}`}
        transform="rotate(-90 40 40)"
        className="transition-[stroke-dasharray] duration-500 ease-out"
        opacity={value === 0 ? 0 : 1}
      />
      <text x="40" y="45" textAnchor="middle" className="fill-ink text-[15px] font-bold tabular-nums">
        {value}%
      </text>
    </svg>
  );
}

function TaskItem({
  task,
  today,
  confirming,
  onToggle,
  onEdit,
  onAskDelete,
  onCancelDelete,
  onDelete,
}: {
  task: Task;
  today: string;
  confirming: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onAskDelete: () => void;
  onCancelDelete: () => void;
  onDelete: () => void;
}) {
  const id = useId();
  const due = dueInfo(task, today);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (confirming) cancelRef.current?.focus();
  }, [confirming]);

  return (
    <li
      className={cn(
        "rounded-[12px] border p-3.5 transition-colors sm:p-4",
        task.completed ? "border-line bg-white" : "border-line bg-white hover:border-[#d6d6d6]",
        due?.tone === "overdue" && "border-l-2 border-l-[#b42318]",
      )}
    >
      <div className="flex items-start gap-3">
        <input
          id={`${id}-check`}
          type="checkbox"
          checked={task.completed}
          onChange={onToggle}
          aria-describedby={`${id}-meta`}
          className="check-round mt-px"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <label
              htmlFor={`${id}-check`}
              className={cn(
                "min-w-0 cursor-pointer break-words text-[0.9375rem] font-semibold leading-snug",
                task.completed && "text-muted line-through decoration-[#b3b3b3]",
              )}
            >
              {task.title}
            </label>
            <PriorityBadge priority={task.priority} />
          </div>
          {task.description && (
            <p className="mt-1 line-clamp-3 whitespace-pre-line break-words text-sm leading-relaxed text-muted">
              {task.description}
            </p>
          )}

          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
            <p id={`${id}-meta`} className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
              {due ? (
                <span
                  className={cn(
                    "inline-flex items-center gap-1",
                    due.tone === "overdue" && "font-semibold text-[#b42318]",
                    due.tone === "today" && "font-semibold text-ink",
                    (due.tone === "soon" || due.tone === "later" || due.tone === "done") && "text-muted",
                  )}
                >
                  {due.tone === "overdue" ? (
                    <CircleAlert className="h-3.5 w-3.5" aria-hidden="true" />
                  ) : due.tone === "today" ? (
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                  ) : (
                    <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                  {due.label}
                </span>
              ) : (
                <span className="text-muted">No due date</span>
              )}
              <span className={cn("inline-flex items-center gap-1", task.completed ? "text-ink" : "text-muted")}>
                {task.completed ? (
                  <CircleCheck className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <CircleDashed className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                {task.completed ? "Completed" : "Pending"}
              </span>
            </p>

            {confirming ? (
              <div
                role="group"
                aria-label={`Delete “${task.title}”?`}
                className="ml-auto flex items-center gap-1.5"
                onKeyDown={(event) => event.key === "Escape" && onCancelDelete()}
              >
                <span className="text-xs font-semibold text-[#b42318]">Delete this task?</span>
                <button
                  ref={cancelRef}
                  type="button"
                  onClick={onCancelDelete}
                  className="h-8 rounded-full px-3 text-xs font-semibold text-[#4d4d4d] transition-colors hover:bg-mist hover:text-ink"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onDelete}
                  className="h-8 rounded-full bg-[#b42318] px-3 text-xs font-semibold text-white transition-colors hover:bg-[#93190f]"
                >
                  Delete
                </button>
              </div>
            ) : (
              <div className="-mr-1.5 ml-auto flex items-center">
                <IconButton label={`Edit “${task.title}”`} icon={Pencil} onClick={onEdit} />
                <IconButton label={`Delete “${task.title}”`} icon={Trash2} tone="danger" onClick={onAskDelete} />
              </div>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}

function TaskForm({
  mode,
  initial,
  original,
  today,
  titleRef,
  onSubmit,
  onCancel,
}: {
  mode: "add" | "edit";
  initial: TaskDraft;
  original?: Task;
  today: string;
  titleRef: RefObject<HTMLInputElement | null>;
  onSubmit: (draft: TaskDraft) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState(initial);
  const [errors, setErrors] = useState<DraftErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const dueRef = useRef<HTMLInputElement>(null);

  const update = (patch: Partial<TaskDraft>) => {
    const next = { ...draft, ...patch };
    setDraft(next);
    if (submitted) setErrors(validateDraft(next, today, original));
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    const found = validateDraft(draft, today, original);
    setErrors(found);
    if (found.title) return titleRef.current?.focus();
    if (found.description) return descriptionRef.current?.focus();
    if (found.dueDate) return dueRef.current?.focus();
    onSubmit(draft);
  };

  return (
    <form noValidate onSubmit={submit} className="space-y-4">
      <Field id="task-title" label="Title" error={errors.title} aside={`${draft.title.length}/${TITLE_MAX}`}>
        <input
          ref={titleRef}
          id="task-title"
          type="text"
          value={draft.title}
          maxLength={TITLE_MAX}
          autoComplete="off"
          placeholder="e.g. Revise calculus notes"
          aria-invalid={Boolean(errors.title)}
          aria-describedby={describedBy("task-title", errors.title)}
          onChange={(event) => update({ title: event.target.value })}
          className={inputClass}
        />
      </Field>

      <Field
        id="task-description"
        label="Description"
        optional
        error={errors.description}
        aside={`${draft.description.length}/${DESCRIPTION_MAX}`}
      >
        <textarea
          ref={descriptionRef}
          id="task-description"
          value={draft.description}
          maxLength={DESCRIPTION_MAX}
          placeholder="Add details, links or steps"
          aria-invalid={Boolean(errors.description)}
          aria-describedby={describedBy("task-description", errors.description)}
          onChange={(event) => update({ description: event.target.value })}
          className={textareaClass}
        />
      </Field>

      <SegmentedRadio
        name="task-priority"
        legend="Priority"
        value={draft.priority}
        onChange={(priority) => update({ priority })}
        options={PRIORITIES}
      />

      <Field id="task-due" label="Due date" optional error={errors.dueDate}>
        <input
          ref={dueRef}
          id="task-due"
          type="date"
          value={draft.dueDate}
          min={mode === "add" ? today : undefined}
          aria-invalid={Boolean(errors.dueDate)}
          aria-describedby={describedBy("task-due", errors.dueDate)}
          onChange={(event) => update({ dueDate: event.target.value })}
          className={inputClass}
        />
      </Field>

      {mode === "edit" && (
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-line px-3.5 py-3 text-sm font-medium">
          <input
            type="checkbox"
            checked={draft.completed}
            onChange={(event) => update({ completed: event.target.checked })}
            className="check-round"
          />
          Mark as completed
        </label>
      )}

      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancel} className="btn btn-outline btn-sm">
          Cancel
        </button>
        <button type="submit" className="btn btn-dark btn-sm">
          {mode === "add" ? "Add task" : "Save changes"}
        </button>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* App                                                                 */
/* ------------------------------------------------------------------ */

type Editor = { mode: "add" } | { mode: "edit"; task: Task } | null;

export default function TaskManager() {
  const [tasks, setTasks, saveFailed] = usePersistentState(STORAGE_KEY, parseTasks, NO_TASKS);
  const [view, setView] = useState<TaskView>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<TaskSort>("due");
  const [editor, setEditor] = useState<Editor>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [confirmingClear, setConfirmingClear] = useState(false);
  const { region, announce } = useAnnouncer();
  const today = useToday();
  const titleRef = useRef<HTMLInputElement>(null);
  const listHeadingRef = useRef<HTMLHeadingElement>(null);
  const searchId = useId();
  const sortId = useId();

  const stats = useMemo(() => taskStats(tasks, today), [tasks, today]);
  const search = query.trim().toLowerCase();
  const visible = useMemo(() => {
    const inView = tasks.filter((task) =>
      view === "all" ? true : view === "completed" ? task.completed : !task.completed,
    );
    const matching = search ? inView.filter((task) => task.title.toLowerCase().includes(search)) : inView;
    return sortTasks(matching, sort);
  }, [tasks, view, search, sort]);

  const counts: Record<TaskView, number> = { all: stats.total, pending: stats.pending, completed: stats.completed };

  const saveTask = (draft: TaskDraft) => {
    const now = Date.now();
    const title = draft.title.trim();
    const description = draft.description.trim();
    if (editor?.mode === "edit") {
      const id = editor.task.id;
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id
            ? {
                ...task,
                title,
                description,
                priority: draft.priority,
                dueDate: draft.dueDate,
                completed: draft.completed,
                completedAt: draft.completed ? (task.completedAt ?? now) : null,
                updatedAt: now,
              }
            : task,
        ),
      );
      announce(`Task “${title}” updated.`);
    } else {
      const task: Task = {
        id: createId(),
        title,
        description,
        priority: draft.priority,
        dueDate: draft.dueDate,
        completed: false,
        createdAt: now,
        updatedAt: now,
        completedAt: null,
      };
      setTasks((prev) => [task, ...prev]);
      // Make sure the new task is visible.
      if (view === "completed") setView("all");
      if (search && !title.toLowerCase().includes(search)) setQuery("");
      announce(`Task “${title}” added.`);
    }
    setEditor(null);
  };

  const toggleTask = (task: Task) => {
    const completed = !task.completed;
    const now = Date.now();
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, completed, completedAt: completed ? now : null, updatedAt: now } : t)),
    );
    announce(`“${task.title}” marked as ${completed ? "completed" : "pending"}.`);
  };

  const deleteTask = (task: Task) => {
    setTasks((prev) => prev.filter((t) => t.id !== task.id));
    setConfirmingId(null);
    announce(`Task “${task.title}” deleted.`);
    listHeadingRef.current?.focus();
  };

  const clearCompleted = () => {
    const removed = stats.completed;
    setTasks((prev) => prev.filter((t) => !t.completed));
    setConfirmingClear(false);
    announce(`${removed} completed ${removed === 1 ? "task" : "tasks"} cleared.`);
    listHeadingRef.current?.focus();
  };

  const openAdd = () => setEditor({ mode: "add" });

  const emptyState =
    tasks.length === 0 ? (
      <EmptyState
        icon={ListTodo}
        title="No tasks yet"
        action={
          <button type="button" onClick={openAdd} className="btn btn-dark btn-sm">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add your first task
          </button>
        }
      >
        Add a task to start planning. Everything you add is saved in this browser.
      </EmptyState>
    ) : search ? (
      <EmptyState
        icon={SearchX}
        title={`No tasks match “${query.trim()}”`}
        action={
          <button type="button" onClick={() => setQuery("")} className="btn btn-outline btn-sm">
            Clear search
          </button>
        }
      >
        Try a different title, or clear the search to see {view === "all" ? "all tasks" : `${view} tasks`}.
      </EmptyState>
    ) : view === "pending" ? (
      <EmptyState icon={CircleCheck} title="Nothing pending">
        Every task is completed. Add a new one whenever you are ready.
      </EmptyState>
    ) : (
      <EmptyState icon={CircleDashed} title="No completed tasks yet">
        Tick a task&apos;s checkbox when it&apos;s done and it will show up here.
      </EmptyState>
    );

  return (
    <div className="grid grid-cols-1 gap-2 sm:gap-3 lg:grid-cols-[15.5rem_minmax(0,1fr)] lg:gap-4">
      {region}

      {/* ---- Sidebar (a compact header below lg) ---- */}
      <aside aria-label="Task overview" className="min-w-0 rounded-[16px] border border-line bg-white p-4 sm:p-5 lg:self-start">
        <div className="flex items-start justify-between gap-3 lg:block">
          <div>
            <h3 className="text-[1.0625rem] font-bold tracking-[-0.02em]">My Tasks</h3>
            <p className="mt-0.5 text-[0.8125rem] text-muted">{formatLongDate(new Date(`${today}T00:00`))}</p>
          </div>
          <button type="button" onClick={openAdd} className="btn btn-dark btn-sm shrink-0 lg:mt-5 lg:w-full">
            <Plus className="h-4 w-4" aria-hidden="true" />
            New task
          </button>
        </div>

        <div role="group" aria-label="Show" className="mt-4 flex gap-1 rounded-full bg-mist p-1 lg:mt-6 lg:flex-col lg:rounded-none lg:bg-transparent lg:p-0">
          <p className="hidden px-3 pb-1 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-muted lg:block">
            Views
          </p>
          {(Object.keys(VIEW_LABELS) as TaskView[]).map((key) => {
            const active = view === key;
            return (
              <button
                key={key}
                type="button"
                aria-pressed={active}
                onClick={() => setView(key)}
                className={cn(
                  "relative flex min-h-9 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full px-2 text-[0.8125rem] font-semibold transition-colors sm:gap-2 sm:px-3 lg:min-h-10 lg:flex-none lg:justify-between lg:rounded-lg lg:text-sm",
                  active
                    ? "bg-white text-ink shadow-[0_1px_2px_rgb(0_0_0/0.08)] lg:bg-mist lg:shadow-none"
                    : "text-[#4d4d4d] hover:text-ink lg:hover:bg-[#fafafa]",
                )}
              >
                {active && (
                  <span aria-hidden="true" className="absolute inset-y-2.5 left-0 hidden w-[3px] rounded-full bg-lime lg:block" />
                )}
                <span className="whitespace-nowrap">{key === "all" ? "All" : VIEW_LABELS[key]}</span>
                <span className="rounded-full text-[0.75rem] tabular-nums text-muted-strong lg:bg-white lg:px-2 lg:py-px">
                  {counts[key]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Progress: a ring in the sidebar, a bar in the compact header */}
        <div className="mt-6 hidden items-center gap-4 border-t border-line pt-5 lg:flex">
          <div
            role="progressbar"
            aria-label="Tasks completed"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={stats.progress}
            aria-valuetext={`${stats.progress}% (${stats.completed} of ${stats.total} tasks)`}
          >
            <ProgressRing value={stats.progress} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold">Progress</p>
            <p className="mt-0.5 text-[0.8125rem] leading-snug text-muted">
              {stats.total === 0 ? "No tasks yet" : `${stats.completed} of ${stats.total} completed`}
            </p>
          </div>
        </div>
        <div className="mt-4 lg:hidden">
          <div className="flex items-center justify-between text-[0.8125rem]">
            <span className="font-semibold">Progress</span>
            <span className="tabular-nums text-muted">
              {stats.completed} of {stats.total} · {stats.progress}%
            </span>
          </div>
          <div
            role="progressbar"
            aria-label="Tasks completed"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={stats.progress}
            aria-valuetext={`${stats.progress}% (${stats.completed} of ${stats.total} tasks)`}
            className="mt-2 h-2 overflow-hidden rounded-full bg-mist"
          >
            <div
              className="h-full rounded-full bg-lime transition-[width] duration-500 ease-out"
              style={{ width: `${stats.progress}%` }}
            />
          </div>
        </div>
      </aside>

      {/* ---- Main ---- */}
      <div className="flex min-w-0 flex-col gap-2 sm:gap-3 lg:gap-4">
        <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
          <StatCard label="Total tasks" value={stats.total} icon={ListTodo} />
          <StatCard label="Completed" value={stats.completed} icon={CircleCheck} accent />
          <StatCard
            label="Pending"
            value={stats.pending}
            icon={CircleDashed}
            hint={stats.overdue > 0 ? <span className="font-semibold text-[#b42318]">{stats.overdue} overdue</span> : undefined}
          />
        </div>

        <section aria-labelledby="task-list-title" className="rounded-[16px] border border-line bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-4 sm:px-5 sm:pt-5">
            <h3
              id="task-list-title"
              ref={listHeadingRef}
              tabIndex={-1}
              className="flex items-center gap-2 text-[1rem] font-bold tracking-[-0.015em]"
            >
              <ListChecks className="h-[1.125rem] w-[1.125rem]" aria-hidden="true" />
              {VIEW_LABELS[view]}
            </h3>
            {stats.completed > 0 && view !== "pending" && (
              <div className="flex items-center gap-1.5">
                {confirmingClear ? (
                  <>
                    <span className="text-xs font-semibold text-[#b42318]">
                      Remove {stats.completed} completed {stats.completed === 1 ? "task" : "tasks"}?
                    </span>
                    <button
                      type="button"
                      onClick={() => setConfirmingClear(false)}
                      className="h-8 rounded-full px-3 text-xs font-semibold text-[#4d4d4d] hover:bg-mist hover:text-ink"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={clearCompleted}
                      className="h-8 rounded-full bg-[#b42318] px-3 text-xs font-semibold text-white hover:bg-[#93190f]"
                    >
                      Clear
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmingClear(true)}
                    className="h-8 rounded-full px-3 text-xs font-semibold text-[#4d4d4d] transition-colors hover:bg-mist hover:text-ink"
                  >
                    Clear completed
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-col gap-2 px-4 sm:flex-row sm:px-5">
            <div className="relative flex-1">
              <label htmlFor={searchId} className="sr-only">
                Search tasks by title
              </label>
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                aria-hidden="true"
              />
              <input
                id={searchId}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by title"
                autoComplete="off"
                className={cn(inputClass, "pl-10")}
              />
            </div>
            <div className="sm:w-[11.5rem]">
              <label htmlFor={sortId} className="sr-only">
                Sort tasks
              </label>
              <Select id={sortId} value={sort} onChange={(event) => setSort(event.target.value as TaskSort)}>
                <option value="due">Sort: Due date</option>
                <option value="priority">Sort: Priority</option>
                <option value="newest">Sort: Newest</option>
              </Select>
            </div>
          </div>

          <p aria-live="polite" className="px-4 pt-3 text-xs text-muted sm:px-5">
            {tasks.length > 0 && (search || view !== "all")
              ? `Showing ${visible.length} of ${tasks.length} ${tasks.length === 1 ? "task" : "tasks"}`
              : ""}
          </p>

          <div className="p-4 pt-2 sm:p-5 sm:pt-2">
            {visible.length > 0 ? (
              <ul className="space-y-2">
                {visible.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    today={today}
                    confirming={confirmingId === task.id}
                    onToggle={() => toggleTask(task)}
                    onEdit={() => setEditor({ mode: "edit", task })}
                    onAskDelete={() => setConfirmingId(task.id)}
                    onCancelDelete={() => setConfirmingId(null)}
                    onDelete={() => deleteTask(task)}
                  />
                ))}
              </ul>
            ) : (
              emptyState
            )}
          </div>

          {saveFailed && (
            <p role="alert" className="mx-4 mb-4 rounded-xl bg-[#fdf2f1] px-3.5 py-2.5 text-[0.8125rem] text-[#b42318] sm:mx-5 sm:mb-5">
              Your browser blocked saving, so changes will be lost when you leave this page.
            </p>
          )}
        </section>
      </div>

      <Modal
        open={editor !== null}
        onClose={() => setEditor(null)}
        title={editor?.mode === "edit" ? "Edit task" : "New task"}
        description={editor?.mode === "edit" ? "Update the details and save." : "Add a title, then set a priority and an optional due date."}
        initialFocusRef={titleRef}
      >
        {editor && (
          <TaskForm
            key={editor.mode === "edit" ? editor.task.id : "new"}
            mode={editor.mode}
            initial={editor.mode === "edit" ? toDraft(editor.task) : EMPTY_DRAFT}
            original={editor.mode === "edit" ? editor.task : undefined}
            today={today}
            titleRef={titleRef}
            onSubmit={saveTask}
            onCancel={() => setEditor(null)}
          />
        )}
      </Modal>
    </div>
  );
}

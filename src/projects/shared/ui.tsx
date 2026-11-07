/**
 * Small UI kit shared by the three project apps. It uses the portfolio's design
 * tokens (ink, muted, line, mist, lime) so the apps read as part of the site.
 */
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentProps,
  type ComponentType,
  type ReactNode,
  type RefObject,
} from "react";
import { ChevronDown, CircleAlert, X } from "lucide-react";
import { useSmoothScroll } from "../../components/SmoothScroll";
import { cn } from "../../utils/cn";

type IconType = ComponentType<{ className?: string; strokeWidth?: number; "aria-hidden"?: boolean | "true" }>;

/* ------------------------------------------------------------------ */
/* Form controls                                                       */
/* ------------------------------------------------------------------ */

export const controlClass =
  "block w-full rounded-xl border border-[#dcdcdc] bg-white text-[0.9375rem] text-ink outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-[#8f8f8f] hover:border-[#c4c4c4] focus:border-ink focus:shadow-[0_0_0_3px_rgb(183_243_50/0.55)] focus-visible:outline-none aria-[invalid=true]:border-[#b42318] aria-[invalid=true]:focus:shadow-[0_0_0_3px_rgb(180_35_24/0.14)] disabled:cursor-not-allowed disabled:opacity-60";

export const inputClass = cn(controlClass, "h-11 px-3.5");
export const textareaClass = cn(controlClass, "min-h-[6.5rem] resize-y px-3.5 py-2.5 leading-relaxed");
export const labelClass = "mb-1.5 block text-[0.8125rem] font-semibold text-ink";

/** Native <select> with the shared styling (React 19 passes `ref` through as a prop). */
export function Select({ className, children, ...props }: ComponentProps<"select">) {
  return (
    <div className="relative">
      <select {...props} className={cn(controlClass, "h-11 cursor-pointer appearance-none pl-3.5 pr-10", className)}>
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
        aria-hidden="true"
      />
    </div>
  );
}

type FieldProps = {
  id: string;
  label: ReactNode;
  error?: string;
  hint?: ReactNode;
  optional?: boolean;
  /** e.g. a character counter, shown at the end of the label row */
  aside?: ReactNode;
  children: ReactNode;
};

/** Label + control + message. Give the control aria-describedby={describedBy(id, error, hint)}. */
export function Field({ id, label, error, hint, optional, aside, children }: FieldProps) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className={labelClass}>
          {label}
          {optional && <span className="ml-1.5 font-normal text-muted">(optional)</span>}
        </label>
        {aside && <span className="text-xs tabular-nums text-muted">{aside}</span>}
      </div>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 flex items-start gap-1.5 text-[0.8125rem] leading-snug text-[#b42318]">
          <CircleAlert className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-[0.8125rem] leading-snug text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function describedBy(id: string, error?: string, hint?: ReactNode) {
  return error ? `${id}-error` : hint ? `${id}-hint` : undefined;
}

/** Radio buttons styled as a segmented control (native keyboard behaviour). */
export function SegmentedRadio<T extends string>({
  name,
  legend,
  value,
  onChange,
  options,
}: {
  name: string;
  legend: string;
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string; icon?: ReactNode }[];
}) {
  return (
    <fieldset>
      <legend className={labelClass}>{legend}</legend>
      <div
        className="grid gap-1 rounded-xl border border-[#dcdcdc] bg-white p-1"
        style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
      >
        {options.map((option) => (
          <label key={option.value} className="relative cursor-pointer">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="peer sr-only"
            />
            <span className="flex h-9 items-center justify-center gap-2 rounded-lg text-sm font-semibold text-[#4d4d4d] transition-colors hover:text-ink peer-checked:bg-ink peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink">
              {option.icon}
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** A row of mutually exclusive toggle buttons (filters). */
export function ToggleGroup<T extends string>({
  label,
  value,
  onChange,
  options,
  className,
}: {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string; count?: number }[];
  className?: string;
}) {
  return (
    <div role="group" aria-label={label} className={cn("inline-flex rounded-full border border-line bg-white p-1", className)}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "inline-flex min-h-9 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3.5 text-[0.8125rem] font-semibold transition-colors",
              active ? "bg-ink text-white" : "text-[#4d4d4d] hover:text-ink",
            )}
          >
            {option.label}
            {option.count !== undefined && (
              <span
                className={cn(
                  "min-w-5 rounded-full px-1.5 py-px text-center text-[0.6875rem] tabular-nums",
                  active ? "bg-white/15 text-white" : "bg-mist text-[#4d4d4d]",
                )}
              >
                {option.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Surfaces                                                            */
/* ------------------------------------------------------------------ */

export function Panel({
  title,
  description,
  actions,
  children,
  className,
  bodyClassName,
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  const titleId = useId();
  return (
    <section aria-labelledby={titleId} className={cn("rounded-[16px] border border-line bg-white", className)}>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 px-4 pt-4 sm:px-5 sm:pt-5">
        <div className="min-w-0">
          <h3 id={titleId} className="text-[1rem] font-bold tracking-[-0.015em]">
            {title}
          </h3>
          {description && <p className="mt-0.5 text-[0.8125rem] text-muted">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
      <div className={cn("p-4 sm:p-5", bodyClassName)}>{children}</div>
    </section>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  accent = false,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  icon?: IconType;
  accent?: boolean;
}) {
  return (
    <div className="@container flex min-w-0 flex-col rounded-[14px] border border-line bg-white p-3.5 sm:p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="min-w-0 text-xs font-medium leading-snug text-muted sm:text-[0.8125rem]">{label}</p>
        {Icon && (
          <span
            className={cn(
              "hidden h-7 w-7 shrink-0 items-center justify-center rounded-lg sm:flex",
              accent ? "bg-lime text-ink" : "bg-mist text-ink",
            )}
          >
            <Icon className="h-[0.9375rem] w-[0.9375rem]" strokeWidth={1.8} aria-hidden="true" />
          </span>
        )}
      </div>
      {/* Scales with the card (cqi) so amounts fit narrow cards without breaking. */}
      <p className="mt-auto break-words pt-2 text-[clamp(1.0625rem,11cqi,1.5rem)] font-bold leading-tight tracking-[-0.03em] tabular-nums">
        {value}
      </p>
      {hint && <p className="mt-1 truncate text-xs text-muted">{hint}</p>}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  children,
  action,
}: {
  icon: IconType;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center px-4 py-10 text-center sm:py-12">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-mist text-ink">
        <Icon className="h-[1.375rem] w-[1.375rem]" strokeWidth={1.6} aria-hidden="true" />
      </span>
      <p className="mt-4 text-[0.9375rem] font-semibold">{title}</p>
      {children && <p className="mt-1.5 max-w-[24rem] text-sm leading-relaxed text-muted">{children}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function IconButton({
  label,
  icon: Icon,
  onClick,
  className,
  tone = "default",
  disabled = false,
}: {
  label: string;
  icon: IconType;
  onClick: () => void;
  className?: string;
  tone?: "default" | "danger";
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      disabled={disabled}
      className={cn(
        "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#4d4d4d] transition-colors hover:bg-mist disabled:pointer-events-none disabled:opacity-30",
        tone === "danger" ? "hover:text-[#b42318]" : "hover:text-ink",
        className,
      )}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Modal (native <dialog>)                                             */
/* ------------------------------------------------------------------ */

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  initialFocusRef,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  initialFocusRef?: RefObject<HTMLElement | null>;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const { setLocked } = useSmoothScroll();
  const pressStartedOnBackdrop = useRef(false);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !open) return;
    const opener = document.activeElement as HTMLElement | null;
    if (!dialog.open) dialog.showModal();
    setLocked(true);
    initialFocusRef?.current?.focus();
    return () => {
      // Close first: the page behind a modal dialog is inert and can't take focus.
      if (dialog.open) dialog.close();
      setLocked(false);
      // Return focus to whatever opened the dialog, if it still exists.
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, [open, setLocked, initialFocusRef]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      data-lenis-prevent
      onClose={() => onCloseRef.current()}
      onPointerDown={(event) => {
        pressStartedOnBackdrop.current = event.target === dialogRef.current;
      }}
      onClick={(event) => {
        // Clicks on the backdrop target the <dialog> itself (its content fills the box).
        if (pressStartedOnBackdrop.current && event.target === dialogRef.current) onCloseRef.current();
      }}
      className="m-auto max-h-[min(calc(100dvh-2rem),52rem)] w-[min(calc(100vw-2rem),34rem)] overflow-y-auto overscroll-contain rounded-[18px] border border-line bg-white p-0 text-ink shadow-[0_32px_80px_-32px_rgb(0_0_0/0.45)] backdrop:bg-black/45 open:animate-[dialog-in_0.22s_var(--ease-out-expo)]"
    >
      {open && (
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id={titleId} className="text-[1.1875rem] font-bold tracking-[-0.02em]">
                {title}
              </h2>
              {description && (
                <p id={descriptionId} className="mt-1 text-sm text-muted">
                  {description}
                </p>
              )}
            </div>
            <IconButton label="Close" icon={X} onClick={() => onCloseRef.current()} className="-mr-2 -mt-1" />
          </div>
          <div className="mt-5">{children}</div>
        </div>
      )}
    </dialog>
  );
}

/* ------------------------------------------------------------------ */
/* Screen-reader announcements                                         */
/* ------------------------------------------------------------------ */

/** Polite live region: announce("Task added."). Render {region} once per app. */
export function useAnnouncer() {
  const [message, setMessage] = useState("");
  const timer = useRef(0);
  const announce = useCallback((text: string) => {
    // Clear first so repeating the same message is announced again.
    setMessage("");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setMessage(text), 60);
  }, []);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const region = (
    <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
      {message}
    </p>
  );
  return { region, announce };
}

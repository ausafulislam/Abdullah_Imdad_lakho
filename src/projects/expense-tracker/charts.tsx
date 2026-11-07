/**
 * Hand-built SVG/HTML charts (no chart library). Every value comes from the
 * user's own transactions; each chart also has a text equivalent for screen
 * readers.
 */
import { useId, useLayoutEffect, useRef, useState } from "react";
import { formatMonth } from "../../lib/dates";
import { cn } from "../../utils/cn";
import { formatCompact, formatMoney, type CategoryShare, type MonthPoint } from "./transactions";

/** A round axis maximum at or above `value`. */
function niceMax(value: number): number {
  if (value <= 0) return 1;
  const base = 10 ** Math.floor(Math.log10(value));
  for (const step of [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]) {
    if (step * base >= value) return step * base;
  }
  return 10 * base;
}

export function Legend() {
  return (
    <div className="flex items-center gap-4 text-xs font-medium text-[#4d4d4d]">
      <span className="inline-flex items-center gap-1.5">
        <span aria-hidden="true" className="h-2.5 w-2.5 rounded-[3px] border border-ink bg-lime" />
        Income
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span aria-hidden="true" className="h-2.5 w-2.5 rounded-[3px] bg-ink" />
        Expenses
      </span>
    </div>
  );
}

/** Width of an element, kept up to date (client-only components). */
function useWidth<T extends HTMLElement>(fallback: number) {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(fallback);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setWidth(Math.round(el.clientWidth) || fallback);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [fallback]);
  return [ref, width] as const;
}

/** Grouped bars: income against expenses for each month. */
export function MonthlyChart({ series, selected }: { series: MonthPoint[]; selected: string }) {
  const titleId = useId();
  // Drawn at its real width, so labels stay 11px on phones instead of shrinking.
  const [frameRef, measured] = useWidth<HTMLElement>(560);
  const width = Math.max(260, measured);
  const height = width < 420 ? 200 : 230;
  const pad = { top: 14, right: 8, bottom: 30, left: 46 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;
  const peak = Math.max(0, ...series.flatMap((p) => [p.income, p.expense]));
  const yMax = niceMax(peak);
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * yMax);
  const group = plotW / series.length;
  const barW = Math.min(20, group * 0.28);
  const y = (value: number) => pad.top + plotH - (value / yMax) * plotH;
  const range = series.length ? `${formatMonth(series[0].month)} to ${formatMonth(series[series.length - 1].month)}` : "";

  return (
    <figure ref={frameRef}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height={height}
        className="block"
        role="img"
        aria-labelledby={titleId}
      >
        <title id={titleId}>{`Income and expenses by month, ${range}. Exact values are listed in the table below.`}</title>
        {ticks.map((tick) => (
          <g key={tick}>
            <line
              x1={pad.left}
              x2={width - pad.right}
              y1={y(tick)}
              y2={y(tick)}
              stroke={tick === 0 ? "#d6d6d6" : "#efefef"}
              strokeWidth="1"
            />
            <text x={pad.left - 8} y={y(tick) + 4} textAnchor="end" className="fill-[#767676] text-[11px] tabular-nums">
              {peak === 0 ? (tick === 0 ? "0" : "") : formatCompact(tick)}
            </text>
          </g>
        ))}
        {series.map((point, i) => {
          const center = pad.left + group * i + group / 2;
          const isSelected = point.month === selected;
          return (
            <g key={point.month}>
              {isSelected && (
                <rect x={center - group / 2 + 4} y={pad.top} width={group - 8} height={plotH} rx="8" fill="#f6f6f6" />
              )}
              {point.income > 0 && (
                <rect
                  x={center - barW - 2}
                  y={y(point.income)}
                  width={barW}
                  height={Math.max(1.5, y(0) - y(point.income))}
                  rx="3"
                  fill="var(--color-lime)"
                  stroke="var(--color-ink)"
                  strokeWidth="1"
                >
                  <title>{`Income, ${formatMonth(point.month)}: ${formatMoney(point.income)}`}</title>
                </rect>
              )}
              {point.expense > 0 && (
                <rect
                  x={center + 2}
                  y={y(point.expense)}
                  width={barW}
                  height={Math.max(1.5, y(0) - y(point.expense))}
                  rx="3"
                  fill="var(--color-ink)"
                >
                  <title>{`Expenses, ${formatMonth(point.month)}: ${formatMoney(point.expense)}`}</title>
                </rect>
              )}
              <text
                x={center}
                y={height - 9}
                textAnchor="middle"
                className={cn("text-[11px]", isSelected ? "fill-ink font-bold" : "fill-[#767676]")}
              >
                {formatMonth(point.month, "short")}
              </text>
            </g>
          );
        })}
      </svg>
      {peak === 0 && (
        <figcaption className="mt-1 text-center text-[0.8125rem] text-muted">
          No income or expenses recorded in these six months yet.
        </figcaption>
      )}
      <table className="sr-only">
        <caption>Income and expenses by month</caption>
        <thead>
          <tr>
            <th scope="col">Month</th>
            <th scope="col">Income</th>
            <th scope="col">Expenses</th>
          </tr>
        </thead>
        <tbody>
          {series.map((point) => (
            <tr key={point.month}>
              <th scope="row">{formatMonth(point.month)}</th>
              <td>{formatMoney(point.income)}</td>
              <td>{formatMoney(point.expense)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

/** Horizontal bars: share of the month's spending per category. */
export function CategoryBreakdown({ items }: { items: CategoryShare[] }) {
  return (
    <ul className="space-y-3.5">
      {items.map((item) => {
        const percent = Math.round(item.share * 100);
        return (
          <li key={item.category}>
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="font-medium">{item.category}</span>
              <span className="text-right tabular-nums text-muted">
                <span className="font-semibold text-ink">{formatMoney(item.amount)}</span> · {percent < 1 ? "<1" : percent}%
              </span>
            </div>
            <div aria-hidden="true" className="mt-1.5 h-2 overflow-hidden rounded-full bg-mist">
              <div
                className="h-full rounded-full bg-ink transition-[width] duration-500 ease-out"
                style={{ width: `${Math.max(item.share * 100, 1.5)}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

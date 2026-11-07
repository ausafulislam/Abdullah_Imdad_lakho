/**
 * Optional currency conversion with live rates from Frankfurter
 * (https://frankfurter.dev/docs/): free, open source, no API key.
 *
 * One request fetches PKR rates for a short list of currencies:
 *   GET https://api.frankfurter.dev/v2/rates?base=PKR&quotes=USD,EUR,…
 *   → [{ "date": "2026-11-07", "base": "PKR", "quote": "USD", "rate": 0.0036 }, …]
 * Rates are cached for the session (Frankfurter encourages caching). If the API
 * can't be reached, only this panel shows an error; the tracker keeps working.
 */
import { useCallback, useEffect, useId, useState } from "react";
import { ArrowRightLeft, CloudOff, RefreshCw } from "lucide-react";
import { formatDate } from "../../lib/dates";
import { usePersistentState } from "../../lib/storage";
import { Panel, Select } from "../shared/ui";
import { CURRENCY, formatForeign, formatMoney, type Totals } from "./transactions";

const API = "https://api.frankfurter.dev/v2/rates";
const CACHE_KEY = "abdullah-portfolio:fx-rates:v1";
const CACHE_MS = 6 * 60 * 60 * 1000;
const TIMEOUT_MS = 10_000;

const CURRENCIES: Record<string, string> = {
  USD: "US dollar",
  EUR: "Euro",
  GBP: "British pound",
  AED: "UAE dirham",
  SAR: "Saudi riyal",
  CNY: "Chinese yuan",
  INR: "Indian rupee",
  CAD: "Canadian dollar",
  AUD: "Australian dollar",
  TRY: "Turkish lira",
  MYR: "Malaysian ringgit",
  JPY: "Japanese yen",
};

type Rate = { rate: number; date: string };
type Rates = Record<string, Rate>;
type State = { status: "loading" } | { status: "ready"; rates: Rates } | { status: "error"; message: string };

const parseTarget = (value: unknown) => (typeof value === "string" && value in CURRENCIES ? value : "USD");

function readCache(): Rates | null {
  try {
    const cached = JSON.parse(window.sessionStorage.getItem(CACHE_KEY) ?? "null") as { at: number; rates: Rates } | null;
    if (cached && Date.now() - cached.at < CACHE_MS && cached.rates && Object.keys(cached.rates).length) return cached.rates;
  } catch {
    /* no usable cache */
  }
  return null;
}

async function fetchRates(signal: AbortSignal): Promise<Rates> {
  const url = `${API}?base=${CURRENCY}&quotes=${Object.keys(CURRENCIES).join(",")}`;
  const response = await fetch(url, { signal });
  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message = (body as { message?: unknown } | null)?.message;
    throw new Error(typeof message === "string" ? message : `HTTP ${response.status}`);
  }
  if (!Array.isArray(body)) throw new Error("unexpected response");
  const rates: Rates = {};
  for (const row of body as Record<string, unknown>[]) {
    if (
      row?.base === CURRENCY &&
      typeof row.quote === "string" &&
      row.quote in CURRENCIES &&
      typeof row.rate === "number" &&
      row.rate > 0 &&
      typeof row.date === "string"
    ) {
      rates[row.quote] = { rate: row.rate, date: row.date };
    }
  }
  if (!Object.keys(rates).length) throw new Error("no rates returned");
  return rates;
}

export default function CurrencyConverter({ totals }: { totals: Totals }) {
  const [state, setState] = useState<State>(() => {
    const cached = readCache();
    return cached ? { status: "ready", rates: cached } : { status: "loading" };
  });
  const [target, setTarget] = usePersistentState("abdullah-portfolio:fx-target:v1", parseTarget, "USD");
  const [attempt, setAttempt] = useState(0);
  const selectId = useId();

  useEffect(() => {
    if (attempt === 0 && state.status === "ready") return; // served from the session cache
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(new DOMException("Timed out", "TimeoutError")), TIMEOUT_MS);
    setState({ status: "loading" });
    fetchRates(controller.signal)
      .then((rates) => {
        try {
          window.sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), rates }));
        } catch {
          /* caching is optional */
        }
        setState({ status: "ready", rates });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted && controller.signal.reason?.name !== "TimeoutError") return; // unmounted
        const timedOut = controller.signal.reason?.name === "TimeoutError";
        setState({
          status: "error",
          message: timedOut
            ? "The exchange-rate service took too long to respond."
            : error instanceof TypeError
              ? "Couldn't reach the exchange-rate service. Check your connection."
              : "The exchange-rate service returned an error.",
        });
      })
      .finally(() => window.clearTimeout(timer));
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
    // Re-run only for explicit retries.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  const available = state.status === "ready" ? Object.keys(CURRENCIES).filter((code) => state.rates[code]) : [];
  const code = available.includes(target) ? target : available[0];
  const rate = state.status === "ready" && code ? state.rates[code] : undefined;
  const convert = (paisa: number) => (rate ? formatForeign((paisa / 100) * rate.rate, code!) : "");

  return (
    <Panel
      title={
        <span className="flex items-center gap-2">
          <ArrowRightLeft className="h-[1.0625rem] w-[1.0625rem]" aria-hidden="true" />
          Currency converter
        </span>
      }
      description="Your totals in another currency, at today's rates"
    >
      {state.status === "loading" && (
        <div role="status" className="space-y-3" aria-label="Loading exchange rates">
          <div className="h-11 animate-pulse rounded-xl bg-mist" />
          <div className="h-24 animate-pulse rounded-xl bg-mist" />
          <span className="sr-only">Loading exchange rates…</span>
        </div>
      )}

      {state.status === "error" && (
        <div role="alert" className="rounded-xl bg-mist px-4 py-4 text-sm">
          <p className="flex items-center gap-2 font-semibold">
            <CloudOff className="h-4 w-4 shrink-0" aria-hidden="true" />
            Live exchange rates are unavailable
          </p>
          <p className="mt-1 leading-relaxed text-muted-strong">
            {state.message} Your tracker still works as usual; only conversion is paused.
          </p>
          <button type="button" onClick={retry} className="btn btn-outline btn-sm mt-3">
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            Try again
          </button>
        </div>
      )}

      {state.status === "ready" && rate && code && (
        <div>
          <label htmlFor={selectId} className="mb-1.5 block text-[0.8125rem] font-semibold">
            Convert to
          </label>
          <Select id={selectId} value={code} onChange={(event) => setTarget(event.target.value)}>
            {available.map((c) => (
              <option key={c} value={c}>
                {c} · {CURRENCIES[c]}
              </option>
            ))}
          </Select>

          <dl className="mt-4 divide-y divide-line rounded-xl border border-line">
            {[
              { label: "Balance", value: totals.balance },
              { label: "Total income", value: totals.income },
              { label: "Total expenses", value: totals.expense },
            ].map((row) => (
              <div key={row.label} className="flex items-baseline justify-between gap-3 px-3.5 py-2.5">
                <dt className="text-[0.8125rem] text-muted">{row.label}</dt>
                <dd className="text-right">
                  <span className="block text-[0.9375rem] font-semibold tabular-nums">{convert(row.value)}</span>
                  <span className="block text-xs tabular-nums text-muted">{formatMoney(row.value)}</span>
                </dd>
              </div>
            ))}
          </dl>

          <p className="mt-3 text-xs leading-relaxed text-muted">
            1 {CURRENCY} = {rate.rate.toPrecision(4)} {code} · 1 {code} = {(1 / rate.rate).toFixed(2)} {CURRENCY}
            <br />
            Mid-market rate from{" "}
            <a
              href="https://frankfurter.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-ink underline decoration-[#c4c4c4] underline-offset-2 hover:decoration-ink"
            >
              Frankfurter<span className="sr-only"> (opens in a new tab)</span>
            </a>
            , dated {formatDate(rate.date)}. For reference only.
          </p>
        </div>
      )}
    </Panel>
  );
}

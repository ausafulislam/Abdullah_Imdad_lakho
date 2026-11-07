import { useCallback, useEffect, useId, useRef, useState, type FormEvent } from "react";
import {
  ChevronRight,
  CloudOff,
  Droplet,
  Droplets,
  History,
  LoaderCircle,
  MapPin,
  RefreshCw,
  Search,
  SearchX,
  Sunrise,
  Sunset,
  Thermometer,
  Umbrella,
  Wind,
  type LucideIcon,
} from "lucide-react";
import { usePersistentState } from "../../lib/storage";
import { cn } from "../../utils/cn";
import { EmptyState, IconButton, inputClass, labelClass, useAnnouncer } from "../shared/ui";
import {
  fetchForecast,
  formatClock,
  formatHour,
  formatLongDay,
  formatTemp,
  formatValue,
  formatWeekday,
  isAbort,
  searchPlaces,
  WeatherApiError,
  type Forecast,
  type Place,
} from "./api";
import { describeWeather } from "./codes";

const RECENT_KEY = "abdullah-portfolio:weather:recent:v1";
const RECENT_MAX = 5;
const NO_RECENTS: Place[] = [];
const QUERY_MAX = 100;

/** Shortcuts; each is still looked up live through the geocoding API. */
const QUICK_PICKS = [
  { name: "Karachi", countryCode: "PK" },
  { name: "Lahore", countryCode: "PK" },
  { name: "Islamabad", countryCode: "PK" },
  { name: "London", countryCode: "GB" },
  { name: "Dubai", countryCode: "AE" },
  { name: "Istanbul", countryCode: "TR" },
];

function parseRecents(value: unknown): Place[] {
  if (!Array.isArray(value)) return NO_RECENTS;
  return value
    .filter(
      (p): p is Place =>
        p &&
        typeof p === "object" &&
        typeof p.id === "number" &&
        typeof p.name === "string" &&
        p.name.length > 0 &&
        typeof p.latitude === "number" &&
        typeof p.longitude === "number" &&
        typeof p.country === "string" &&
        typeof p.countryCode === "string" &&
        typeof p.admin1 === "string",
    )
    .slice(0, RECENT_MAX);
}

const placeRegion = (place: Place) => [place.admin1, place.country].filter(Boolean).join(", ");
const coordinates = (place: Place) =>
  `${Math.abs(place.latitude).toFixed(2)}°${place.latitude >= 0 ? "N" : "S"} ${Math.abs(place.longitude).toFixed(2)}°${place.longitude >= 0 ? "E" : "W"}`;
const errorMessage = (error: unknown) =>
  error instanceof WeatherApiError ? error.message : "Something went wrong. Please try again.";

type SearchState =
  | { status: "idle" }
  | { status: "searching"; query: string }
  | { status: "results"; query: string; places: Place[] }
  | { status: "empty"; query: string }
  | { status: "error"; query: string; message: string; countryCode?: string; autoSelect: boolean };

type ForecastState =
  | { status: "idle" }
  | { status: "loading"; place: Place }
  | { status: "ready"; place: Place; forecast: Forecast }
  | { status: "error"; place: Place; message: string };

/* ------------------------------------------------------------------ */
/* Dashboard pieces                                                    */
/* ------------------------------------------------------------------ */

function Metric({ icon: Icon, label, value, hint }: { icon: LucideIcon; label: string; value: string; hint?: string }) {
  return (
    <div className="min-w-0 rounded-xl bg-mist px-3 py-2.5">
      <dt className="flex items-center gap-1.5 text-xs text-muted-strong">
        <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        {label}
      </dt>
      <dd className="mt-1 text-[1rem] font-bold tabular-nums tracking-[-0.01em]">
        {value}
        {hint && <span className="ml-1 text-[0.6875rem] font-medium tracking-normal text-muted-strong">{hint}</span>}
      </dd>
    </div>
  );
}

const CELL = 64;

function HourlyForecast({ hours }: { hours: Forecast["hourly"] }) {
  const temps = hours.map((h) => h.temperature).filter((t): t is number => t !== null);
  const min = Math.min(...temps);
  const max = Math.max(...temps);
  const height = 76;
  const top = 26;
  const bottom = 10;
  const y = (t: number) => (max === min ? (top + height - bottom) / 2 : top + (1 - (t - min) / (max - min)) * (height - top - bottom));
  const x = (i: number) => i * CELL + CELL / 2;

  // Split the line wherever a value is missing rather than inventing one.
  const segments: string[] = [];
  let current: string[] = [];
  hours.forEach((h, i) => {
    if (h.temperature === null) {
      if (current.length) segments.push(current.join(" "));
      current = [];
    } else current.push(`${x(i)},${y(h.temperature)}`);
  });
  if (current.length) segments.push(current.join(" "));

  return (
    <div
      role="region"
      aria-label="Hourly forecast (scrolls sideways)"
      tabIndex={0}
      className="-mx-4 overflow-x-auto px-4 pb-1 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:-mx-5 sm:px-5"
      data-lenis-prevent
    >
      <div className="relative" style={{ width: hours.length * CELL }}>
        <svg width={hours.length * CELL} height={height} aria-hidden="true" className="block">
          {segments.map((points) => (
            <polyline
              key={points}
              points={points}
              fill="none"
              stroke="var(--color-ink)"
              strokeWidth="1.75"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          ))}
          {hours.map((h, i) =>
            h.temperature === null ? null : (
              <g key={h.time}>
                <circle
                  cx={x(i)}
                  cy={y(h.temperature)}
                  r={i === 0 ? 4.5 : 3}
                  fill={i === 0 ? "var(--color-lime)" : "white"}
                  stroke="var(--color-ink)"
                  strokeWidth="1.5"
                />
                <text x={x(i)} y={y(h.temperature) - 10} textAnchor="middle" className="fill-ink text-[12px] font-semibold tabular-nums">
                  {formatTemp(h.temperature)}
                </text>
              </g>
            ),
          )}
        </svg>
        <ol className="flex">
          {hours.map((h, i) => {
            const { label, Icon } = describeWeather(h.code, h.isDay);
            return (
              <li key={h.time} className="flex shrink-0 flex-col items-center gap-1.5 pt-2" style={{ width: CELL }}>
                <span className={cn("text-xs tabular-nums", i === 0 ? "font-bold text-ink" : "text-muted")}>
                  {i === 0 ? "Now" : formatHour(h.time)}
                </span>
                <Icon className="h-[1.125rem] w-[1.125rem] text-ink" strokeWidth={1.7} aria-hidden="true" />
                <span className="inline-flex items-center gap-0.5 text-[0.6875rem] tabular-nums text-muted">
                  <Droplet className="h-2.5 w-2.5" aria-hidden="true" />
                  {h.precipitationProbability === null ? "—" : `${h.precipitationProbability}%`}
                </span>
                <span className="sr-only">
                  {`${formatTemp(h.temperature)}, ${label}, ${
                    h.precipitationProbability === null ? "no precipitation data" : `${h.precipitationProbability}% chance of precipitation`
                  }`}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

function DailyForecast({ days }: { days: Forecast["daily"] }) {
  const lows = days.map((d) => d.min).filter((t): t is number => t !== null);
  const highs = days.map((d) => d.max).filter((t): t is number => t !== null);
  const weekMin = Math.min(...lows, ...highs);
  const weekMax = Math.max(...lows, ...highs);
  const span = weekMax - weekMin || 1;

  return (
    <ul className="divide-y divide-line">
      {days.map((day, i) => {
        const { label, Icon } = describeWeather(day.code, true);
        const hasRange = day.min !== null && day.max !== null;
        return (
          <li
            key={day.date}
            className="grid grid-cols-[3.25rem_1.5rem_2.75rem_2.25rem_minmax(2.5rem,1fr)_2.25rem] items-center gap-2 py-2.5 first:pt-0 last:pb-0 sm:gap-3"
          >
            <span className={cn("text-sm", i === 0 ? "font-bold" : "font-medium")}>{i === 0 ? "Today" : formatWeekday(day.date)}</span>
            <span title={label} className="flex">
              <Icon className="h-[1.125rem] w-[1.125rem]" strokeWidth={1.7} aria-hidden="true" />
              <span className="sr-only">{label}</span>
            </span>
            <span className="inline-flex items-center gap-0.5 text-xs tabular-nums text-muted">
              <Droplet className="h-3 w-3" aria-hidden="true" />
              <span className="sr-only">Chance of precipitation </span>
              {day.precipitationProbability === null ? "—" : `${day.precipitationProbability}%`}
            </span>
            <span className="text-right text-sm tabular-nums text-muted">
              <span className="sr-only">Low </span>
              {formatTemp(day.min)}
            </span>
            <span aria-hidden="true" className="relative h-1.5 rounded-full bg-mist">
              {hasRange && (
                <span
                  className={cn("absolute inset-y-0 rounded-full", i === 0 ? "bg-lime outline outline-1 outline-ink" : "bg-ink")}
                  style={{
                    left: `${((day.min! - weekMin) / span) * 100}%`,
                    width: `${Math.max(((day.max! - day.min!) / span) * 100, 4)}%`,
                  }}
                />
              )}
            </span>
            <span className="text-sm font-semibold tabular-nums">
              <span className="sr-only">High </span>
              {formatTemp(day.max)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function Dashboard({ place, forecast, onRefresh }: { place: Place; forecast: Forecast; onRefresh: () => void }) {
  const { current, units, daily, hourly } = forecast;
  const { label, Icon } = describeWeather(current.code, current.isDay);
  const today = daily[0];
  const unitLetter = units.temperature.replace("°", "");

  return (
    <div className="grid grid-cols-1 gap-2 sm:gap-3 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-4">
      <section aria-labelledby="wx-place" className="min-w-0 rounded-[16px] border border-line bg-white p-4 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 id="wx-place" className="flex items-center gap-1.5 text-[1.25rem] font-bold tracking-[-0.02em]">
              <MapPin className="h-[1.125rem] w-[1.125rem] shrink-0" aria-hidden="true" />
              <span className="truncate">{place.name}</span>
            </h3>
            <p className="mt-0.5 truncate text-[0.8125rem] text-muted">{placeRegion(place) || coordinates(place)}</p>
          </div>
          <IconButton label="Refresh weather" icon={RefreshCw} onClick={onRefresh} className="-mr-1.5 -mt-1" />
        </div>

        <div className="mt-6 flex items-center gap-4">
          <span className={cn("flex h-[4.25rem] w-[4.25rem] shrink-0 items-center justify-center rounded-2xl", current.isDay ? "bg-lime" : "bg-ink text-white")}>
            <Icon className="h-9 w-9" strokeWidth={1.6} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="flex items-start text-[3.25rem] font-extrabold leading-none tracking-[-0.05em] tabular-nums">
              {formatTemp(current.temperature)}
              {current.temperature !== null && (
                <span className="ml-0.5 mt-1.5 text-[1.125rem] font-bold tracking-normal">{unitLetter}</span>
              )}
            </p>
            <p className="mt-1.5 text-[0.9375rem] font-semibold">{label}</p>
          </div>
        </div>
        <p className="mt-3 text-[0.8125rem] text-muted">
          {formatLongDay(current.time)} · updated {formatClock(current.time)} local time
          {forecast.timezoneAbbreviation ? ` (${forecast.timezoneAbbreviation})` : ""}
        </p>

        <dl className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          <Metric icon={Thermometer} label="Feels like" value={formatTemp(current.apparent)} />
          <Metric icon={Droplets} label="Humidity" value={current.humidity === null ? "—" : `${current.humidity}%`} />
          <Metric icon={Wind} label="Wind" value={formatValue(current.wind, units.wind, 1)} />
          <Metric icon={Umbrella} label="Precipitation" value={formatValue(current.precipitation, units.precipitation, 1)} hint="15 min" />
        </dl>
        <dl className="mt-2 grid grid-cols-2 gap-2">
          <Metric icon={Sunrise} label="Sunrise" value={formatClock(today?.sunrise ?? null)} />
          <Metric icon={Sunset} label="Sunset" value={formatClock(today?.sunset ?? null)} />
        </dl>
      </section>

      <section aria-labelledby="wx-daily" className="min-w-0 rounded-[16px] border border-line bg-white p-4 sm:p-5">
        <h3 id="wx-daily" className="text-[1rem] font-bold tracking-[-0.015em]">
          {daily.length}-day forecast
        </h3>
        <p className="mt-0.5 text-[0.8125rem] text-muted">Daily low and high, with the chance of precipitation</p>
        <div className="mt-4">
          {daily.length ? <DailyForecast days={daily} /> : <p className="text-sm text-muted">No daily forecast was returned.</p>}
        </div>
      </section>

      <section aria-labelledby="wx-hourly" className="min-w-0 rounded-[16px] border border-line bg-white p-4 sm:p-5 lg:col-span-2">
        <h3 id="wx-hourly" className="text-[1rem] font-bold tracking-[-0.015em]">
          Next 24 hours
        </h3>
        <p className="mt-0.5 text-[0.8125rem] text-muted">Temperature and chance of precipitation, in local time</p>
        <div className="mt-3">
          {hourly.some((h) => h.temperature !== null) ? (
            <HourlyForecast hours={hourly} />
          ) : (
            <p className="text-sm text-muted">No hourly forecast was returned.</p>
          )}
        </div>
      </section>
    </div>
  );
}

function DashboardSkeleton({ place }: { place: Place }) {
  return (
    <div role="status" className="grid grid-cols-1 gap-2 sm:gap-3 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-4">
      <span className="sr-only">Loading the weather for {place.name}…</span>
      <div aria-hidden="true" className="rounded-[16px] border border-line bg-white p-4 sm:p-6">
        <p className="flex items-center gap-1.5 text-[1.25rem] font-bold tracking-[-0.02em]">
          <MapPin className="h-[1.125rem] w-[1.125rem]" />
          {place.name}
        </p>
        <p className="mt-0.5 text-[0.8125rem] text-muted">{placeRegion(place)}</p>
        <div className="mt-6 flex items-center gap-4">
          <div className="h-[4.25rem] w-[4.25rem] animate-pulse rounded-2xl bg-mist" />
          <div className="space-y-2">
            <div className="h-11 w-28 animate-pulse rounded-lg bg-mist" />
            <div className="h-4 w-24 animate-pulse rounded bg-mist" />
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-[3.75rem] animate-pulse rounded-xl bg-mist" />
          ))}
        </div>
      </div>
      <div aria-hidden="true" className="space-y-3 rounded-[16px] border border-line bg-white p-4 sm:p-5">
        <div className="h-5 w-32 animate-pulse rounded bg-mist" />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-6 animate-pulse rounded bg-mist" />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* App                                                                 */
/* ------------------------------------------------------------------ */

export default function WeatherDashboard() {
  const [query, setQuery] = useState("");
  const [queryError, setQueryError] = useState("");
  const [search, setSearch] = useState<SearchState>({ status: "idle" });
  const [weather, setWeather] = useState<ForecastState>({ status: "idle" });
  const [recents, setRecents] = usePersistentState(RECENT_KEY, parseRecents, NO_RECENTS);
  const { region, announce } = useAnnouncer();
  const searchAbort = useRef<AbortController | null>(null);
  const forecastAbort = useRef<AbortController | null>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const inputId = useId();
  const resultsLabelId = useId();

  const loadPlace = useCallback(
    async (place: Place) => {
      forecastAbort.current?.abort();
      const controller = new AbortController();
      forecastAbort.current = controller;
      // A new place replaces the whole dashboard: never show the old city's data.
      setWeather({ status: "loading", place });
      setRecents((prev) => [place, ...prev.filter((p) => p.id !== place.id)].slice(0, RECENT_MAX));
      try {
        const forecast = await fetchForecast(place, controller.signal);
        if (controller.signal.aborted) return;
        setWeather({ status: "ready", place, forecast });
        announce(`Weather for ${place.name} loaded.`);
      } catch (error) {
        if (isAbort(error) || controller.signal.aborted) return;
        setWeather({ status: "error", place, message: errorMessage(error) });
      }
    },
    [announce, setRecents],
  );

  const runSearch = useCallback(
    async (text: string, countryCode?: string, autoSelect = false) => {
      searchAbort.current?.abort();
      const controller = new AbortController();
      searchAbort.current = controller;
      setSearch({ status: "searching", query: text });
      try {
        const places = await searchPlaces(text, controller.signal, countryCode);
        if (controller.signal.aborted) return;
        if (places.length === 0) {
          setSearch({ status: "empty", query: text });
          announce(`No places found for ${text}.`);
        } else if (autoSelect) {
          setSearch({ status: "idle" });
          void loadPlace(places[0]);
        } else {
          setSearch({ status: "results", query: text, places });
          announce(`${places.length} ${places.length === 1 ? "place" : "places"} found. Choose one to see its weather.`);
        }
      } catch (error) {
        if (isAbort(error) || controller.signal.aborted) return;
        setSearch({ status: "error", query: text, message: errorMessage(error), countryCode, autoSelect });
      }
    },
    [announce, loadPlace],
  );

  // Returning visitors see their most recent place straight away.
  useEffect(() => {
    if (recents[0]) void loadPlace(recents[0]);
    return () => {
      searchAbort.current?.abort();
      forecastAbort.current?.abort();
    };
    // Mount only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const text = query.trim();
    if (text.length < 2) {
      setQueryError("Enter at least 2 characters of a city name.");
      return;
    }
    setQueryError("");
    void runSearch(text);
  };

  const choose = (place: Place) => {
    setSearch({ status: "idle" });
    setQuery("");
    dashboardRef.current?.focus({ preventScroll: true });
    void loadPlace(place);
  };

  const searching = search.status === "searching";

  return (
    <div className="flex flex-col gap-2 sm:gap-3 lg:gap-4">
      {region}

      {/* ---- Search ---- */}
      <section aria-label="Find a place" className="rounded-[16px] border border-line bg-white p-4 sm:p-5">
        <form role="search" noValidate onSubmit={submit}>
          <label htmlFor={inputId} className={labelClass}>
            Search for a city
          </label>
          <div className="flex gap-2">
            <div className="relative min-w-0 flex-1">
              <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
              <input
                id={inputId}
                type="search"
                value={query}
                maxLength={QUERY_MAX}
                autoComplete="off"
                placeholder="e.g. Karachi, Hyderabad or London"
                aria-invalid={Boolean(queryError)}
                aria-describedby={queryError ? `${inputId}-error` : undefined}
                onChange={(event) => {
                  setQuery(event.target.value);
                  if (queryError) setQueryError("");
                }}
                className={cn(inputClass, "pl-10")}
              />
            </div>
            <button type="submit" disabled={searching} className="btn btn-dark btn-sm h-11 shrink-0 disabled:opacity-70">
              {searching ? (
                <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Search className="h-4 w-4" aria-hidden="true" />
              )}
              <span className="max-xs:sr-only">Search</span>
            </button>
          </div>
          {queryError && (
            <p id={`${inputId}-error`} className="mt-1.5 text-[0.8125rem] text-[#b42318]">
              {queryError}
            </p>
          )}
        </form>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[0.8125rem]">
          <span className="text-muted">Try</span>
          {QUICK_PICKS.map((pick) => (
            <button
              key={pick.name}
              type="button"
              disabled={searching}
              onClick={() => void runSearch(pick.name, pick.countryCode, true)}
              className="font-semibold text-ink underline decoration-[#c4c4c4] underline-offset-[3px] transition-colors hover:decoration-ink disabled:opacity-50"
            >
              {pick.name}
            </button>
          ))}
        </div>
        {recents.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[0.8125rem]">
            <span className="inline-flex items-center gap-1 text-muted">
              <History className="h-3.5 w-3.5" aria-hidden="true" />
              Recent
            </span>
            {recents.map((place) => (
              <button
                key={place.id}
                type="button"
                onClick={() => void loadPlace(place)}
                title={placeRegion(place)}
                className="font-semibold text-ink underline decoration-[#c4c4c4] underline-offset-[3px] transition-colors hover:decoration-ink"
              >
                {place.name}
                <span className="sr-only">, {placeRegion(place)}</span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => setRecents(NO_RECENTS)}
              className="text-muted underline decoration-transparent underline-offset-[3px] hover:text-ink hover:decoration-current"
            >
              Clear
            </button>
          </div>
        )}

        {search.status === "searching" && (
          <p role="status" className="mt-4 flex items-center gap-2 text-sm text-muted">
            <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
            Searching for “{search.query}”…
          </p>
        )}

        {search.status === "results" && (
          <div className="mt-4">
            <p id={resultsLabelId} className="text-[0.8125rem] font-semibold">
              Choose a location · {search.places.length} found for “{search.query}”
            </p>
            <ul aria-labelledby={resultsLabelId} className="mt-2 divide-y divide-line overflow-hidden rounded-xl border border-line">
              {search.places.map((place) => (
                <li key={place.id}>
                  <button
                    type="button"
                    onClick={() => choose(place)}
                    className="flex w-full items-center gap-3 px-3.5 py-3 text-left transition-colors hover:bg-[#fafafa] focus-visible:bg-[#fafafa]"
                  >
                    <MapPin className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[0.9375rem] font-semibold">{place.name}</span>
                      <span className="block truncate text-xs text-muted-strong">{placeRegion(place) || "Region not listed"}</span>
                    </span>
                    <span className="hidden shrink-0 text-xs tabular-nums text-muted sm:block">{coordinates(place)}</span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {search.status === "empty" && (
          <div role="status" className="mt-4 flex gap-3 rounded-xl border border-dashed border-[#dcdcdc] px-4 py-3.5 text-sm">
            <SearchX className="mt-0.5 h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
            <p className="leading-relaxed">
              <span className="font-semibold">No places found for “{search.query}”.</span>{" "}
              <span className="text-muted">Check the spelling, or try a larger nearby city.</span>
            </p>
          </div>
        )}

        {search.status === "error" && (
          <div role="alert" className="mt-4 rounded-xl bg-mist px-4 py-3.5 text-sm">
            <p className="flex items-center gap-2 font-semibold">
              <CloudOff className="h-4 w-4 shrink-0" aria-hidden="true" />
              Location search failed
            </p>
            <p className="mt-1 leading-relaxed text-muted-strong">{search.message}</p>
            <button
              type="button"
              onClick={() => void runSearch(search.query, search.countryCode, search.autoSelect)}
              className="btn btn-outline btn-sm mt-3"
            >
              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
              Try again
            </button>
          </div>
        )}
      </section>

      {/* ---- Weather ---- */}
      <div ref={dashboardRef} tabIndex={-1} className="outline-none">
        {weather.status === "idle" && (
          <div className="rounded-[16px] border border-line bg-white">
            <EmptyState icon={MapPin} title="Search for a city to see its weather">
              Current conditions, the next 24 hours and a 7-day forecast, straight from Open-Meteo.
            </EmptyState>
          </div>
        )}
        {weather.status === "loading" && <DashboardSkeleton place={weather.place} />}
        {weather.status === "error" && (
          <div role="alert" className="rounded-[16px] border border-line bg-white px-4 py-10 text-center sm:py-12">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-mist">
              <CloudOff className="h-[1.375rem] w-[1.375rem]" strokeWidth={1.6} aria-hidden="true" />
            </span>
            <p className="mt-4 text-[0.9375rem] font-semibold">Couldn&apos;t load the weather for {weather.place.name}</p>
            <p className="mx-auto mt-1.5 max-w-[26rem] text-sm leading-relaxed text-muted">
              {weather.message} Nothing is shown rather than out-of-date or estimated numbers.
            </p>
            <button type="button" onClick={() => void loadPlace(weather.place)} className="btn btn-dark btn-sm mt-5">
              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
              Try again
            </button>
          </div>
        )}
        {weather.status === "ready" && (
          <Dashboard place={weather.place} forecast={weather.forecast} onRefresh={() => void loadPlace(weather.place)} />
        )}
      </div>

      <p className="px-1 text-xs leading-relaxed text-muted-strong">
        <a
          href="https://open-meteo.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-ink underline decoration-[#c4c4c4] underline-offset-2 hover:decoration-ink"
        >
          Weather data by Open-Meteo.com
        </a>
        , licensed under{" "}
        <a
          href="https://creativecommons.org/licenses/by/4.0/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-[#c4c4c4] underline-offset-2 hover:text-ink hover:decoration-ink"
        >
          CC BY 4.0
        </a>
        . Location search based on{" "}
        <a
          href="https://www.geonames.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-[#c4c4c4] underline-offset-2 hover:text-ink hover:decoration-ink"
        >
          GeoNames
        </a>
        .
      </p>
    </div>
  );
}

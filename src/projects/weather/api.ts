/**
 * Open-Meteo clients (free for non-commercial use, no API key):
 *  - Geocoding: https://open-meteo.com/en/docs/geocoding-api
 *  - Forecast:  https://open-meteo.com/en/docs
 * Responses are validated before use. Missing values become `null` and are
 * shown as "—"; nothing is ever filled in with made-up numbers.
 */

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
const TIMEOUT_MS = 12_000;

export type Place = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  countryCode: string;
  admin1: string;
};

export type Forecast = {
  timezone: string;
  timezoneAbbreviation: string;
  current: {
    /** Local wall-clock time at the place, e.g. "2026-11-07T11:30" */
    time: string;
    temperature: number | null;
    apparent: number | null;
    humidity: number | null;
    isDay: boolean;
    /** Precipitation over the preceding 15 minutes */
    precipitation: number | null;
    code: number | null;
    wind: number | null;
  };
  units: { temperature: string; wind: string; precipitation: string };
  hourly: { time: string; temperature: number | null; precipitationProbability: number | null; code: number | null; isDay: boolean }[];
  daily: {
    date: string;
    code: number | null;
    max: number | null;
    min: number | null;
    sunrise: string | null;
    sunset: string | null;
    precipitationProbability: number | null;
  }[];
};

export type ApiErrorKind = "network" | "timeout" | "rate-limit" | "http" | "invalid";

export class WeatherApiError extends Error {
  constructor(
    public kind: ApiErrorKind,
    message: string,
  ) {
    super(message);
    this.name = "WeatherApiError";
  }
}

export const isAbort = (error: unknown) => error instanceof DOMException && error.name === "AbortError";

/** GET + JSON with a timeout; `signal` cancels superseded requests. */
async function getJson(url: string, signal: AbortSignal): Promise<unknown> {
  const controller = new AbortController();
  const forwardAbort = () => controller.abort();
  signal.addEventListener("abort", forwardAbort);
  let timedOut = false;
  const timer = window.setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, TIMEOUT_MS);

  try {
    const response = await fetch(url, { signal: controller.signal });
    const body: unknown = await response.json().catch(() => null);
    if (!response.ok) {
      if (response.status === 429) {
        throw new WeatherApiError("rate-limit", "Too many requests right now. Please wait a minute and try again.");
      }
      const reason = (body as { reason?: unknown } | null)?.reason;
      throw new WeatherApiError(
        "http",
        typeof reason === "string" ? `The weather service rejected the request: ${reason}` : `The weather service returned an error (HTTP ${response.status}).`,
      );
    }
    if (body === null) throw new WeatherApiError("invalid", "The weather service sent a response that couldn't be read.");
    return body;
  } catch (error) {
    if (error instanceof WeatherApiError) throw error;
    if (signal.aborted) throw new DOMException("Request superseded", "AbortError");
    if (timedOut) throw new WeatherApiError("timeout", "The weather service took too long to respond.");
    throw new WeatherApiError("network", "Couldn't reach the weather service. Check your internet connection.");
  } finally {
    window.clearTimeout(timer);
    signal.removeEventListener("abort", forwardAbort);
  }
}

const num = (value: unknown): number | null => (typeof value === "number" && Number.isFinite(value) ? value : null);
const str = (value: unknown): string => (typeof value === "string" ? value : "");

function parsePlace(value: unknown): Place | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as Record<string, unknown>;
  const latitude = num(raw.latitude);
  const longitude = num(raw.longitude);
  if (typeof raw.id !== "number" || !str(raw.name) || latitude === null || longitude === null) return null;
  return {
    id: raw.id,
    name: str(raw.name),
    latitude,
    longitude,
    country: str(raw.country),
    countryCode: str(raw.country_code),
    admin1: str(raw.admin1),
  };
}

/** Up to five places matching `name` (an empty list when nothing matches). */
export async function searchPlaces(name: string, signal: AbortSignal, countryCode?: string): Promise<Place[]> {
  const params = new URLSearchParams({ name, count: "5", language: "en", format: "json" });
  if (countryCode) params.set("countryCode", countryCode);
  const body = await getJson(`${GEOCODING_URL}?${params}`, signal);
  if (typeof body !== "object") throw new WeatherApiError("invalid", "Unexpected response from the location search.");
  // Open-Meteo omits `results` entirely when there are no matches.
  const results = (body as { results?: unknown }).results;
  if (results === undefined) return [];
  if (!Array.isArray(results)) throw new WeatherApiError("invalid", "Unexpected response from the location search.");
  return results.map(parsePlace).filter((place): place is Place => place !== null);
}

export async function fetchForecast(place: Place, signal: AbortSignal): Promise<Forecast> {
  const params = new URLSearchParams({
    latitude: String(place.latitude),
    longitude: String(place.longitude),
    current:
      "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m",
    hourly: "temperature_2m,precipitation_probability,weather_code,is_day",
    daily: "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max",
    timezone: "auto",
    forecast_hours: "24",
  });
  const body = (await getJson(`${FORECAST_URL}?${params}`, signal)) as Record<string, unknown>;
  const current = body?.current as Record<string, unknown> | undefined;
  const hourly = body?.hourly as Record<string, unknown[]> | undefined;
  const daily = body?.daily as Record<string, unknown[]> | undefined;
  if (!current || !str(current.time) || !Array.isArray(hourly?.time) || !Array.isArray(daily?.time)) {
    throw new WeatherApiError("invalid", "The forecast response was missing expected data.");
  }
  const units = (body.current_units ?? {}) as Record<string, unknown>;
  const at = (list: unknown[] | undefined, i: number) => (Array.isArray(list) ? list[i] : undefined);

  return {
    timezone: str(body.timezone),
    timezoneAbbreviation: str(body.timezone_abbreviation),
    current: {
      time: str(current.time),
      temperature: num(current.temperature_2m),
      apparent: num(current.apparent_temperature),
      humidity: num(current.relative_humidity_2m),
      isDay: current.is_day !== 0,
      precipitation: num(current.precipitation),
      code: num(current.weather_code),
      wind: num(current.wind_speed_10m),
    },
    units: {
      temperature: str(units.temperature_2m) || "°C",
      wind: str(units.wind_speed_10m) || "km/h",
      precipitation: str(units.precipitation) || "mm",
    },
    hourly: hourly.time.map((time, i) => ({
      time: str(time),
      temperature: num(at(hourly.temperature_2m, i)),
      precipitationProbability: num(at(hourly.precipitation_probability, i)),
      code: num(at(hourly.weather_code, i)),
      isDay: at(hourly.is_day, i) !== 0,
    })),
    daily: daily.time.map((date, i) => ({
      date: str(date),
      code: num(at(daily.weather_code, i)),
      max: num(at(daily.temperature_2m_max, i)),
      min: num(at(daily.temperature_2m_min, i)),
      sunrise: str(at(daily.sunrise, i)) || null,
      sunset: str(at(daily.sunset, i)) || null,
      precipitationProbability: num(at(daily.precipitation_probability_max, i)),
    })),
  };
}

/* ------------------------------------------------------------------ */
/* Formatting (times are local to the place, without an offset)        */
/* ------------------------------------------------------------------ */

/** "2026-11-07T17:48" → "5:48 PM" */
export function formatClock(iso: string | null): string {
  const match = iso?.match(/T(\d{2}):(\d{2})/);
  if (!match) return "—";
  const hours = Number(match[1]);
  return `${hours % 12 || 12}:${match[2]} ${hours < 12 ? "AM" : "PM"}`;
}

/** "2026-11-07T17:00" → "5 PM" */
export function formatHour(iso: string): string {
  const match = iso.match(/T(\d{2})/);
  if (!match) return "—";
  const hours = Number(match[1]);
  return `${hours % 12 || 12} ${hours < 12 ? "AM" : "PM"}`;
}

// en-GB to match the date style used across the site ("Saturday 7 November").
const weekday = new Intl.DateTimeFormat("en-GB", { weekday: "short", timeZone: "UTC" });
const longDay = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });

function utcDate(iso: string): Date | null {
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return match ? new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]))) : null;
}

/** "2026-11-08" → "Sun" */
export function formatWeekday(iso: string): string {
  const date = utcDate(iso);
  return date ? weekday.format(date) : "—";
}

/** "2026-11-07T11:30" → "Saturday 7 November" */
export function formatLongDay(iso: string): string {
  const date = utcDate(iso);
  return date ? longDay.format(date) : "";
}

export function formatTemp(value: number | null): string {
  // `|| 0` turns a rounded -0 into 0.
  return value === null ? "—" : `${Math.round(value) || 0}°`;
}

export function formatValue(value: number | null, unit: string, digits = 0): string {
  return value === null ? "—" : `${value.toFixed(digits)} ${unit}`;
}

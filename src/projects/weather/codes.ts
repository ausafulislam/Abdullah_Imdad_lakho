/**
 * WMO weather interpretation codes, as listed in the Open-Meteo forecast docs
 * (https://open-meteo.com/en/docs#weather_variable_documentation).
 */
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudHail,
  CloudLightning,
  CloudMoon,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  CloudSun,
  Cloudy,
  Moon,
  Snowflake,
  Sun,
  type LucideIcon,
} from "lucide-react";

const LABELS: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  56: "Light freezing drizzle",
  57: "Dense freezing drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  66: "Light freezing rain",
  67: "Heavy freezing rain",
  71: "Slight snowfall",
  73: "Moderate snowfall",
  75: "Heavy snowfall",
  77: "Snow grains",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  85: "Slight snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with slight hail",
  97: "Heavy thunderstorm",
  99: "Thunderstorm with heavy hail",
};

function iconFor(code: number, isDay: boolean): LucideIcon {
  if (code === 0) return isDay ? Sun : Moon;
  if (code === 1 || code === 2) return isDay ? CloudSun : CloudMoon;
  if (code === 3) return Cloudy;
  if (code === 45 || code === 48) return CloudFog;
  if (code >= 51 && code <= 57) return CloudDrizzle;
  if (code === 65 || code === 67 || code === 82) return CloudRainWind;
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return CloudRain;
  if (code === 77) return Snowflake;
  if ((code >= 71 && code <= 75) || code === 85 || code === 86) return CloudSnow;
  if (code === 96 || code === 99) return CloudHail;
  if (code === 95 || code === 97) return CloudLightning;
  return Cloud;
}

export function describeWeather(code: number | null, isDay = true): { label: string; Icon: LucideIcon } {
  if (code === null) return { label: "Condition unavailable", Icon: Cloud };
  return { label: LABELS[code] ?? `Weather code ${code}`, Icon: iconFor(code, isDay) };
}

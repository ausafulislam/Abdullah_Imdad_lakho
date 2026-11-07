/**
 * Illustrated previews for the project cards: simplified sketches of each
 * app's interface drawn in SVG. They are decorative (aria-hidden) and contain
 * no numbers, so they never suggest data the apps don't have.
 */
import type { JSX, ReactNode } from "react";
import type { ProjectId } from "../data/projects";

const INK = "#111111";
const LINE = "#e4e4e4";
const SOFT = "#f4f4f4";
const GRAY = "#d4d4d4";
const LIME = "#b7f332";

type PreviewProps = { className?: string };

function Frame({ children, className }: PreviewProps & { children: ReactNode }) {
  return (
    <svg viewBox="0 0 320 200" className={className} aria-hidden="true" focusable="false">
      {/* Window, cropped by the bottom edge of the card */}
      <rect x="18.5" y="18.5" width="283" height="200" rx="10" fill="#fff" stroke={LINE} />
      {children}
    </svg>
  );
}

function TaskPreview({ className }: PreviewProps) {
  const rows = [
    { y: 92, done: true, w: 96, tag: GRAY },
    { y: 118, done: true, w: 72, tag: LIME },
    { y: 144, done: false, w: 110, tag: INK },
    { y: 170, done: false, w: 84, tag: LIME },
  ];
  return (
    <Frame className={className}>
      {/* Sidebar */}
      <path d="M19 28.5a10 10 0 0 1 10-10H86v200H19Z" fill="#fafafa" />
      <line x1="86.5" y1="19" x2="86.5" y2="200" stroke={LINE} />
      <rect x="30" y="34" width="44" height="12" rx="6" fill={INK} />
      <rect x="30" y="56" width="40" height="5" rx="2.5" fill={GRAY} />
      <rect x="30" y="70" width="32" height="5" rx="2.5" fill={GRAY} />
      <rect x="30" y="84" width="36" height="5" rx="2.5" fill={GRAY} />
      {/* Progress ring */}
      <circle cx="52" cy="134" r="16" fill="none" stroke={SOFT} strokeWidth="6" />
      <circle
        cx="52"
        cy="134"
        r="16"
        fill="none"
        stroke={LIME}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray="60 100.5"
        transform="rotate(-90 52 134)"
      />
      {/* Stat tiles */}
      {[100, 168, 236].map((x, i) => (
        <g key={x}>
          <rect x={x} y="32" width="56" height="40" rx="7" fill="#fff" stroke={LINE} />
          <rect x={x + 9} y="42" width="24" height="4" rx="2" fill={GRAY} />
          <rect x={x + 9} y="53" width={i === 1 ? 20 : 28} height="9" rx="3" fill={INK} />
        </g>
      ))}
      {/* Task rows */}
      {rows.map(({ y, done, w, tag }) => (
        <g key={y}>
          <rect x="100" y={y - 10} width="192" height="20" rx="6" fill="#fff" stroke={LINE} />
          {done ? (
            <>
              <circle cx="111" cy={y} r="5" fill={LIME} />
              <path d={`M108.6 ${y}l1.7 1.7 3.2-3.4`} fill="none" stroke={INK} strokeWidth="1.4" strokeLinecap="round" />
              <rect x="122" y={y - 2.5} width={w} height="5" rx="2.5" fill={GRAY} />
            </>
          ) : (
            <>
              <circle cx="111" cy={y} r="4.5" fill="#fff" stroke="#bdbdbd" strokeWidth="1.3" />
              <rect x="122" y={y - 2.5} width={w} height="5" rx="2.5" fill={INK} />
            </>
          )}
          <rect x="262" y={y - 4} width="20" height="8" rx="4" fill={tag} />
        </g>
      ))}
    </Frame>
  );
}

function ExpensePreview({ className }: PreviewProps) {
  const bars = [
    [30, 22],
    [38, 30],
    [26, 34],
    [44, 28],
    [36, 40],
    [48, 32],
  ];
  const baseline = 182;
  return (
    <Frame className={className}>
      {/* Summary tiles */}
      {[32, 122, 212].map((x, i) => (
        <g key={x}>
          <rect x={x} y="32" width="78" height="40" rx="7" fill={i === 2 ? INK : "#fff"} stroke={i === 2 ? INK : LINE} />
          <rect x={x + 10} y="42" width="30" height="4" rx="2" fill={i === 2 ? "#5a5a5a" : GRAY} />
          <rect x={x + 10} y="53" width={i === 1 ? 34 : 44} height="9" rx="3" fill={i === 2 ? LIME : INK} />
        </g>
      ))}
      {/* Bar chart: income (lime) against expenses (ink) */}
      <rect x="32" y="84" width="168" height="108" rx="7" fill="#fff" stroke={LINE} />
      {[112, 140].map((y) => (
        <line key={y} x1="42" y1={y} x2="190" y2={y} stroke={SOFT} strokeWidth="1" />
      ))}
      <line x1="42" y1={baseline + 0.5} x2="190" y2={baseline + 0.5} stroke={LINE} />
      {bars.map(([income, expense], i) => {
        const x = 50 + i * 23.5;
        return (
          <g key={x}>
            <rect x={x} y={baseline - income * 1.6} width="8" height={income * 1.6} rx="2" fill={LIME} stroke={INK} strokeWidth="0.8" />
            <rect x={x + 9} y={baseline - expense * 1.6} width="8" height={expense * 1.6} rx="2" fill={INK} />
          </g>
        );
      })}
      {/* Category breakdown */}
      <rect x="208" y="84" width="82" height="108" rx="7" fill="#fff" stroke={LINE} />
      {[62, 46, 34, 22, 14].map((w, i) => (
        <g key={i}>
          <rect x="218" y={98 + i * 18} width="26" height="4" rx="2" fill={GRAY} />
          <rect x="218" y={105 + i * 18} width="62" height="4" rx="2" fill={SOFT} />
          <rect x="218" y={105 + i * 18} width={w} height="4" rx="2" fill={INK} />
        </g>
      ))}
    </Frame>
  );
}

function WeatherPreview({ className }: PreviewProps) {
  const days = [
    { icon: "sun", top: 10, bottom: 26 },
    { icon: "sun", top: 6, bottom: 24 },
    { icon: "cloud", top: 12, bottom: 28 },
    { icon: "rain", top: 16, bottom: 30 },
    { icon: "cloud", top: 10, bottom: 26 },
    { icon: "sun", top: 4, bottom: 22 },
  ];
  return (
    <Frame className={className}>
      {/* Search field */}
      <rect x="32" y="30" width="256" height="20" rx="10" fill={SOFT} />
      <circle cx="45" cy="39.5" r="4" fill="none" stroke="#8a8a8a" strokeWidth="1.4" />
      <path d="M48 42.5l2.6 2.6" stroke="#8a8a8a" strokeWidth="1.4" strokeLinecap="round" />
      <rect x="56" y="37.5" width="60" height="4" rx="2" fill={GRAY} />
      {/* Current conditions: sun and cloud */}
      <g>
        <circle cx="66" cy="88" r="15" fill={LIME} />
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i * Math.PI) / 4;
          return (
            <line
              key={i}
              x1={66 + Math.cos(a) * 20}
              y1={88 + Math.sin(a) * 20}
              x2={66 + Math.cos(a) * 25}
              y2={88 + Math.sin(a) * 25}
              stroke={INK}
              strokeWidth="2"
              strokeLinecap="round"
            />
          );
        })}
        <path d="M60 110a10 10 0 0 1 9.6-12.8 13 13 0 0 1 24.6 3.8A8.5 8.5 0 0 1 93 118H66a8 8 0 0 1-6-8Z" fill="#fff" stroke={INK} strokeWidth="2" />
      </g>
      <rect x="112" y="76" width="40" height="18" rx="5" fill={INK} />
      <rect x="112" y="100" width="56" height="5" rx="2.5" fill={GRAY} />
      <rect x="112" y="111" width="40" height="5" rx="2.5" fill={GRAY} />
      {/* Hourly temperature line */}
      <path d="M186 112c12 0 14-26 30-26s16 14 28 14 14-20 32-20" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
      {[
        [216, 86],
        [244, 100],
        [276, 80],
      ].map(([cx, cy]) => (
        <circle key={cx} cx={cx} cy={cy} r="3" fill="#fff" stroke={INK} strokeWidth="1.6" />
      ))}
      {/* Daily forecast */}
      <line x1="32" y1="134.5" x2="288" y2="134.5" stroke={LINE} />
      {days.map(({ icon, top, bottom }, i) => {
        const cx = 52 + i * 43;
        return (
          <g key={cx}>
            {icon === "sun" && <circle cx={cx} cy="150" r="5" fill={LIME} stroke={INK} strokeWidth="1.2" />}
            {icon !== "sun" && (
              <path
                d={`M${cx - 6} 153a3.5 3.5 0 0 1 2-6.6 5 5 0 0 1 9.4 1.4A3 3 0 0 1 ${cx + 6} 153Z`}
                fill="#fff"
                stroke={INK}
                strokeWidth="1.2"
              />
            )}
            {icon === "rain" && (
              <path d={`M${cx - 2} 157l-1 3M${cx + 2} 157l-1 3`} stroke={INK} strokeWidth="1.2" strokeLinecap="round" />
            )}
            <rect x={cx - 2.5} y="166" width="5" height="26" rx="2.5" fill={SOFT} />
            <rect x={cx - 2.5} y={166 + top * 0.6} width="5" height={(bottom - top) * 0.9} rx="2.5" fill={INK} />
          </g>
        );
      })}
    </Frame>
  );
}

export const PROJECT_PREVIEWS: Record<ProjectId, (props: PreviewProps) => JSX.Element> = {
  "task-manager": TaskPreview,
  "expense-tracker": ExpensePreview,
  "weather-dashboard": WeatherPreview,
};

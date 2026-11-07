type IconProps = { className?: string };

/** LinkedIn mark in the same 24px / 1.6 stroke style as the lucide icons. */
export function LinkedInIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <line x1="7.5" y1="9.5" x2="7.5" y2="16.5" />
      <circle cx="7.5" cy="6.7" r="0.6" fill="currentColor" stroke="none" />
      <path d="M11 16.5v-4a2.2 2.2 0 0 1 4.4 0v4" />
      <line x1="11" y1="9.5" x2="11" y2="16.5" />
    </svg>
  );
}

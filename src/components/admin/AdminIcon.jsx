// Compact stroke icon set for the admin UI (24px grid, Lucide-style).
const icons = {
  grid: <><rect x="3" y="3" width="7.5" height="7.5" rx="1.8" /><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.8" /><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.8" /><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.8" /></>,
  inbox: <><path d="M3.5 13.5 6 5.5h12l2.5 8" /><path d="M3.5 13.5V18a1.5 1.5 0 0 0 1.5 1.5h14a1.5 1.5 0 0 0 1.5-1.5v-4.5h-5.2a2.8 2.8 0 0 1-5.6 0z" /></>,
  logout: <><path d="M10 4H6.5A2.5 2.5 0 0 0 4 6.5v11A2.5 2.5 0 0 0 6.5 20H10" /><path d="M15 16.5 19.5 12 15 7.5" /><path d="M19.5 12H9.5" /></>,
  search: <><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></>,
  filter: <path d="M4 5.5h16L14 13v5.5l-4 2V13z" />,
  refresh: <><path d="M20 11.5A8 8 0 0 0 6.3 6.3L4 8.5" /><path d="M4 4v4.5h4.5" /><path d="M4 12.5a8 8 0 0 0 13.7 5.2l2.3-2.2" /><path d="M20 20v-4.5h-4.5" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m3.5 7.5 8.5 6 8.5-6" /></>,
  phone: <path d="M5.5 3.5h3l1.8 4.5-2.2 1.6a11 11 0 0 0 6.3 6.3l1.6-2.2 4.5 1.8v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 3.5 5.7a2 2 0 0 1 2-2.2z" />,
  globe: <><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17" /><path d="M12 3.5c2.6 2.6 3.9 5.4 3.9 8.5S14.6 17.9 12 20.5c-2.6-2.6-3.9-5.4-3.9-8.5S9.4 6.1 12 3.5z" /></>,
  external: <><path d="M14 4h6v6" /><path d="m20 4-9 9" /><path d="M19 13.5V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4.5" /></>,
  copy: <><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15H4.8A1.8 1.8 0 0 1 3 13.2V4.8A1.8 1.8 0 0 1 4.8 3h8.4A1.8 1.8 0 0 1 15 4.8V5" /></>,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  calendar: <><rect x="3.5" y="5" width="17" height="15.5" rx="2.5" /><path d="M3.5 10h17" /><path d="M8 3v4M16 3v4" /></>,
  notes: <><path d="M6 3.5h9l4 4V18a2.5 2.5 0 0 1-2.5 2.5h-10A2.5 2.5 0 0 1 4 18V6a2.5 2.5 0 0 1 2-2.5z" /><path d="M15 3.5V8h4" /><path d="M8 12.5h8M8 16h5" /></>,
  clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
  user: <><circle cx="12" cy="8.5" r="4" /><path d="M4.5 20a7.5 7.5 0 0 1 15 0" /></>,
  alert: <><path d="M12 3.5 21 19.5H3z" /><path d="M12 10v4" /><path d="M12 17.2h.01" /></>,
  back: <><path d="M15 5.5 8.5 12l6.5 6.5" /></>,
  close: <><path d="M6 6l12 12M18 6 6 18" /></>,
  eye: <><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" /><circle cx="12" cy="12" r="3" /></>,
  eyeOff: <><path d="M3 3l18 18" /><path d="M10.6 5.8A9.8 9.8 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-3.3 4.2" /><path d="M6.4 6.9A17 17 0 0 0 2.5 12s3.5 6.5 9.5 6.5a9.6 9.6 0 0 0 4.1-.9" /><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" /></>,
  sort: <><path d="M7 4v16" /><path d="m3.5 7.5 3.5-3.5L10.5 7.5" /><path d="M17 20V4" /><path d="m13.5 16.5 3.5 3.5 3.5-3.5" /></>,
  lock: <><rect x="5" y="10.5" width="14" height="10" rx="2.5" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /></>,
  shield: <><path d="M12 3.5 5 6.2v5.3c0 4.3 3 7.9 7 9 4-1.1 7-4.7 7-9V6.2z" /><path d="m9.3 12.2 1.9 1.9 3.6-3.8" /></>,
  arrowRight: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
  link: <><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" /><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" /></>,
  building: <><rect x="4" y="3.5" width="16" height="17" rx="2" /><path d="M8 8h2M14 8h2M8 12h2M14 12h2M8 16h2M14 16h2" /></>,
  tag: <><path d="M3.5 12.5v-8a1 1 0 0 1 1-1h8L20.5 11.5 12 20z" /><circle cx="8" cy="8" r="1.2" /></>,
  chevronDown: <path d="m6 9.5 6 6 6-6" />,
  spark: <><path d="M12 3.5v4M12 16.5v4M3.5 12h4M16.5 12h4M6 6l2.8 2.8M15.2 15.2 18 18M18 6l-2.8 2.8M8.8 15.2 6 18" /></>,
  trend: <><path d="m3.5 17 5.5-5.5 4 4L20.5 7" /><path d="M15 7h5.5v5.5" /></>,
};

export default function AdminIcon({ name, size = 18, strokeWidth = 1.8, className = "", ...rest }) {
  const shape = icons[name];
  if (!shape) return null;
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {shape}
    </svg>
  );
}

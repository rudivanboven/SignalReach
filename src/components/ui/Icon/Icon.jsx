// Lightweight stroke icon set (Lucide-style, 24px grid).
// Every shape carries pathLength={1} so CSS can "draw" icons with
// stroke-dasharray: 1 / stroke-dashoffset: 1 -> 0.

const L = { pathLength: 1 };

const icons = {
  cursor: (
    <>
      <path {...L} d="M4.5 4.5 11 20l2.3-6.7L20 11z" />
      <path {...L} d="m13.4 13.4 5.1 5.1" />
      <path {...L} d="M17 3.5v2.2M20.5 7h-2.2M19.4 4.6l-1.5 1.5" />
    </>
  ),
  smartphone: (
    <>
      <rect {...L} x="6.5" y="2.5" width="11" height="19" rx="2.6" />
      <path {...L} d="M10.5 18.3h3" />
      <path {...L} d="M2.8 9.5v5M21.2 9.5v5" />
    </>
  ),
  gauge: (
    <>
      <path {...L} d="M4.3 17.5a8.6 8.6 0 1 1 15.4 0" />
      <path {...L} d="m12 14 4.3-4.8" />
      <circle {...L} cx="12" cy="14.3" r="1.4" />
      <path {...L} d="M6.8 9.4 8 10.4M12 6.6v1.6" />
    </>
  ),
  target: (
    <>
      <circle {...L} cx="11" cy="13" r="8" />
      <circle {...L} cx="11" cy="13" r="4.4" />
      <circle {...L} cx="11" cy="13" r="1" />
      <path {...L} d="m11 13 9-9" />
      <path {...L} d="M16.5 3.5H20.5V7.5" />
    </>
  ),
  seo: (
    <>
      <circle {...L} cx="10.5" cy="10.5" r="6.8" />
      <path {...L} d="m15.5 15.5 5 5" />
      <path {...L} d="M8 12.8v-1.6M10.5 12.8V8.4M13 12.8V10" />
    </>
  ),
  layout: (
    <>
      <rect {...L} x="3" y="4" width="18" height="16" rx="2.6" />
      <path {...L} d="M3 8.6h18" />
      <path {...L} d="M9.2 8.6V20" />
      <path {...L} d="M12.6 12.4h5M12.6 15.6h3.4" />
    </>
  ),
  clock: (
    <>
      <circle {...L} cx="12" cy="12" r="8.8" />
      <path {...L} d="M12 7v5.2l3.4 2" />
    </>
  ),
  star: (
    <path
      {...L}
      d="m12 3.2 2.7 5.5 6 .9-4.35 4.25 1.03 6-5.38-2.83-5.38 2.83 1.03-6L3.3 9.6l6-.9z"
    />
  ),
  report: (
    <>
      <path {...L} d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path {...L} d="M14 3v5h5" />
      <path {...L} d="M9 17v-2.5M12 17v-5M15 17v-3.5" />
    </>
  ),
  scan: (
    <>
      <path {...L} d="M4 8.5V6a2 2 0 0 1 2-2h2.5M15.5 4H18a2 2 0 0 1 2 2v2.5M20 15.5V18a2 2 0 0 1-2 2h-2.5M8.5 20H6a2 2 0 0 1-2-2v-2.5" />
      <path {...L} d="M4 12h16" />
    </>
  ),
  arrowRight: (
    <>
      <path {...L} d="M5 12h14" />
      <path {...L} d="m13 6 6 6-6 6" />
    </>
  ),
  arrowUpRight: (
    <>
      <path {...L} d="M7 17 17 7" />
      <path {...L} d="M8 7h9v9" />
    </>
  ),
  play: (
    <>
      <circle {...L} cx="12" cy="12" r="9" />
      <path {...L} d="M10.2 8.6v6.8l5.4-3.4z" />
    </>
  ),
  check: <path {...L} d="m5 12.5 4.2 4.2L19 7" />,
  image: (
    <>
      <rect {...L} x="3" y="4.5" width="18" height="15" rx="2.6" />
      <circle {...L} cx="8.6" cy="9.4" r="1.7" />
      <path {...L} d="m21 15.2-4.6-4.4-6.1 6.1-2.4-2.2L3 19" />
    </>
  ),
  form: (
    <>
      <rect {...L} x="3.5" y="4" width="17" height="16" rx="2.6" />
      <path {...L} d="M7 9h6M7 12.5h10" />
      <rect {...L} x="7" y="15.2" width="5.5" height="2.2" rx="1.1" />
    </>
  ),
  text: (
    <>
      <path {...L} d="M4 6.5h16M4 11h11M4 15.5h16M4 20h8" />
    </>
  ),
  alert: (
    <>
      <path {...L} d="M12 3.6 2.9 19.2a1 1 0 0 0 .9 1.5h16.4a1 1 0 0 0 .9-1.5z" />
      <path {...L} d="M12 9.5v4.6" />
      <circle {...L} cx="12" cy="17.2" r=".6" />
    </>
  ),
  sparkle: (
    <>
      <path {...L} d="M12 3.5 13.9 9.2 19.5 11l-5.6 1.9L12 18.6l-1.9-5.7L4.5 11l5.6-1.8z" />
      <path {...L} d="M19 3.5v3M20.5 5h-3" />
    </>
  ),
  arrowUp: (
    <>
      <path {...L} d="M12 19V5" />
      <path {...L} d="m6 11 6-6 6 6" />
    </>
  ),
  ruler: (
    <>
      <path {...L} d="m3.5 15.5 12-12 5 5-12 12z" />
      <path {...L} d="m8 11 1.8 1.8M11 8l1.8 1.8M14 5l1.8 1.8" />
    </>
  ),
  user: (
    <>
      <circle {...L} cx="12" cy="8" r="3.8" />
      <path {...L} d="M4.5 20.5a7.5 7.5 0 0 1 15 0" />
    </>
  ),
  code: (
    <>
      <path {...L} d="m8.5 7.5-5 4.5 5 4.5M15.5 7.5l5 4.5-5 4.5" />
      <path {...L} d="m13.4 4.5-2.8 15" />
    </>
  ),
  link: (
    <>
      <path {...L} d="M10 14a3.6 3.6 0 0 0 5.1 0l3-3a3.6 3.6 0 0 0-5.1-5.1l-1.2 1.2" />
      <path {...L} d="M14 10a3.6 3.6 0 0 0-5.1 0l-3 3a3.6 3.6 0 0 0 5.1 5.1l1.2-1.2" />
    </>
  ),
  download: (
    <>
      <path {...L} d="M12 4v11" />
      <path {...L} d="m7 10 5 5 5-5" />
      <path {...L} d="M5 19.5h14" />
    </>
  ),
  fileText: (
    <>
      <path {...L} d="M14 3.5H7.5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V8z" />
      <path {...L} d="M14 3.5V8h4.5" />
      <path {...L} d="M9 12.5h6M9 16h4" />
    </>
  ),
};

export default function Icon({ name, size, strokeWidth = 1.8, className = "", ...rest }) {
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

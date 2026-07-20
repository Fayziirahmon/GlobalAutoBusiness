/*
 * Minimal monochrome line icons. All use currentColor + stroke so they
 * inherit text color and stay strictly grayscale in both themes.
 */
const base = {
  width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none',
  stroke: 'currentColor', strokeWidth: 1.6,
  strokeLinecap: 'round', strokeLinejoin: 'round',
}

export function Icon({ name, size = 24, strokeWidth, style, className }) {
  const props = { ...base, width: size, height: size, style, className }
  if (strokeWidth) props.strokeWidth = strokeWidth
  return <svg {...props}>{paths[name] ?? paths.fallback}</svg>
}

const paths = {
  /* ── Categories ── */
  engine: (<>
    <path d="M5 12h2l1-2h4l1 2h3l2-2v6l-2-2h-3l-1 2H8l-1-2H5z" />
    <path d="M9 8V5h4v3M12 5h4M3 12v3M19 14l2 1" />
  </>),
  transmission: (<>
    <circle cx="12" cy="12" r="3.2" />
    <path d="M12 4v3M12 17v3M4 12h3M17 12h3M6.5 6.5l2 2M15.5 15.5l2 2M17.5 6.5l-2 2M8.5 15.5l-2 2" />
  </>),
  suspension: (<>
    <path d="M8 3v3M16 3v3M8 18v3M16 18v3" />
    <path d="M8 6c3 1.5 5 3 8 0M8 9c3 1.5 5 3 8 0M8 12c3 1.5 5 3 8 0M8 15c3 1.5 5 3 8 0" />
  </>),
  brakes: (<>
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="3" />
    <path d="M12 4v3M12 17v3M4 12h3M17 12h3" />
  </>),
  electrical: (<>
    <path d="M13 2L4 14h6l-1 8 9-12h-6z" />
  </>),
  filters: (<>
    <path d="M4 4h16l-6 7v7l-4 2v-9z" />
  </>),
  fuel: (<>
    <path d="M12 3s6 6.4 6 10.2A6 6 0 016 13.2C6 9.4 12 3 12 3z" />
  </>),
  exhaust: (<>
    <rect x="3" y="11" width="11" height="5" rx="2" />
    <path d="M14 12l4-2v7l-4-2M19 8c1 .6 1 1.4 0 2M20.5 7c1.4.9 1.4 2.1 0 3" />
  </>),
  cog: (<>
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="2.4" />
    <path d="M12 4v4M12 16v4M4 12h4M16 12h4" />
  </>),
  axle: (<>
    <circle cx="6" cy="12" r="3" /><circle cx="18" cy="12" r="3" />
    <path d="M9 12h6" />
  </>),
  driveshaft: (<>
    <path d="M4 12h4M16 12h4" />
    <circle cx="6" cy="12" r="2" /><circle cx="18" cy="12" r="2" />
    <rect x="9" y="9.8" width="6" height="4.4" rx="1" />
  </>),
  gauge: (<>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 12l4-2.5" />
    <circle cx="12" cy="12" r="1" />
    <path d="M12 4v1.5M20 12h-1.5M4 12h1.5" />
  </>),
  steering: (<>
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="2.4" />
    <path d="M12 4v5.6M12.5 14.3c3.4.6 5.4 2 6.8 4M11.5 14.3c-3.4.6-5.4 2-6.8 4" />
  </>),
  wheel: (<>
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="4.6" />
    <circle cx="12" cy="12" r="1.4" />
  </>),
  bearing: (<>
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="3.6" />
    <circle cx="12" cy="4.6" r="0.7" /><circle cx="12" cy="19.4" r="0.7" />
    <circle cx="4.6" cy="12" r="0.7" /><circle cx="19.4" cy="12" r="0.7" />
  </>),
  bolt: (<>
    <path d="M9 3.5h6l3 5.2-3 5.2H9l-3-5.2z" />
    <path d="M12 14v6.5" />
  </>),
  wrench: (<>
    <path d="M15 5.5a3.6 3.6 0 00-1.2 6.9L5.5 20.7 3.3 18.5l8.3-8.3A3.6 3.6 0 0115 5.5z" />
  </>),

  /* ── Trust / UI ── */
  truck: (<>
    <path d="M3 7h11v8H3zM14 10h4l3 3v2h-7z" />
    <circle cx="7" cy="18" r="1.6" /><circle cx="17.5" cy="18" r="1.6" />
  </>),
  shield: (<>
    <path d="M12 3l7 3v5c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6z" />
    <path d="M9 12l2 2 4-4" />
  </>),
  globe: (<>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18" />
  </>),
  support: (<>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </>),

  /* ── Arrows / misc ── */
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  arrowUpRight: <path d="M7 17L17 7M8 7h9v9" />,
  star: <path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.6l1-5.8L3.5 9.2l5.9-.9z" />,
  check: <path d="M5 12l5 5 9-11" />,
  search: (<><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></>),
  cart: (<>
    <circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" />
    <path d="M2 3h3l2.5 12h11l2-8H6.5" />
  </>),
  box: (<>
    <path d="M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5 9-5V8M12 13v8" />
  </>),
  mail: (<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>),
  phone: <path d="M5 3h4l2 5-3 2a14 14 0 006 6l2-3 5 2v4a2 2 0 01-2 2A17 17 0 013 5a2 2 0 012-2z" />,
  pin: (<><path d="M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></>),
  sun: (<>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.4 1.4M17.6 17.6L19 19M19 5l-1.4 1.4M6.4 17.6L5 19" />
  </>),
  moon: <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" />,
  fallback: <circle cx="12" cy="12" r="8" />,
}

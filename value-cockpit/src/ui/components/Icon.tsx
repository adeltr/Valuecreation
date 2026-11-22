/** Hand-drawn stroke icons (24 grid, 1.75 stroke): the only icon set of the app (DESIGN.md). */
const PATHS = {
  refresh: 'M20 11a8 8 0 0 0-14.3-4.9L4 8m0-4v4h4M4 13a8 8 0 0 0 14.3 4.9L20 16m0 4v-4h-4',
  close: 'M6 6l12 12M18 6L6 18',
  arrowRight: 'M5 12h14m-6-6 6 6-6 6',
  download: 'M12 4v11m-5-5 5 5 5-5M5 20h14',
  upload: 'M12 15V4M7 9l5-5 5 5M5 20h14',
  check: 'M5 12.5 10 17 19 7',
  open: 'M4 7a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z',
  trash: 'M5 7h14M10 7V5h4v2m-7 0 1 12h8l1-12',
  lock: 'M7 11V8a5 5 0 0 1 10 0v3M6 11h12v9H6z',
  info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zm0-10v6m0-9.5v.01',
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({ name, size = 16 }: { name: IconName; size?: number }) {
  return (
    <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d={PATHS[name]} />
    </svg>
  );
}

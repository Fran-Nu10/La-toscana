import type { ReactNode } from 'react'

/** Trazos inline sobre currentColor — no vale una dependencia por veinte iconos. */
const icon = (path: ReactNode, size = 18, width = 1.75) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={width}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {path}
  </svg>
)

export const ShopIcons = {
  close: icon(<path d="M6 6l12 12M18 6L6 18" />, 18),
  plus: icon(<path d="M12 5v14M5 12h14" />, 18),
  minus: icon(<path d="M5 12h14" />, 18),
  check: icon(<path d="m5 12 5 5 9-10" />, 14, 2.4),
  arrow: icon(<path d="M5 12h14M13 6l6 6-6 6" />, 18),
  arrowUpRight: icon(<path d="M7 17 17 7M8 7h9v9" />, 16),
  chevronDown: icon(<path d="m6 9 6 6 6-6" />, 16),
  bag: icon(
    <>
      <path d="M6 8h12l-1 12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </>,
    20,
  ),
  alert: icon(
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5M12 16h.01" />
    </>,
    17,
  ),
  plate: icon(
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
    </>,
    40,
    1.2,
  ),
  edit: icon(<path d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17v3Z" />, 15),
  trash: icon(<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />, 15),
  menu: icon(<path d="M4 7h16M4 12h16M4 17h10" />, 22),
  pin: icon(
    <>
      <path d="M12 21s-6-5.4-6-11a6 6 0 1 1 12 0c0 5.6-6 11-6 11Z" />
      <circle cx="12" cy="10" r="2.2" />
    </>,
    18,
  ),
  clock: icon(
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>,
    18,
  ),
  phone: icon(
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />,
    18,
  ),
  whatsapp: icon(
    <>
      <path d="M4 20l1.3-4A8.5 8.5 0 1 1 8 19.1L4 20Z" />
      <path d="M9.5 9.5c0 3 2 5 5 5l1-1.2-1.6-1-1 .6a4 4 0 0 1-1.8-1.8l.6-1-1-1.6-1.2 1Z" />
    </>,
    18,
  ),
  instagram: icon(
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="3.8" />
      <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" stroke="none" />
    </>,
    18,
  ),
  delivery: icon(
    <>
      <circle cx="6" cy="17" r="2.5" />
      <circle cx="18" cy="17" r="2.5" />
      <path d="M6 17h6l3-7h4M12 17l-2-7H7M15 10l1.5-3H19" />
    </>,
    22,
  ),
  store: icon(
    <>
      <path d="M4 10 5.5 5h13L20 10" />
      <path d="M4 10v10h16V10" />
      <path d="M4 10c0 1.5 1.2 2.5 2.7 2.5S9.3 11.5 9.3 10c0 1.5 1.2 2.5 2.7 2.5s2.7-1 2.7-2.5c0 1.5 1.2 2.5 2.7 2.5S20 11.5 20 10" />
      <path d="M10 20v-5h4v5" />
    </>,
    22,
  ),
  star: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.8l2.8 6 6.5.7-4.9 4.4 1.4 6.4L12 17l-5.8 3.3 1.4-6.4L2.7 9.5l6.5-.7L12 2.8Z" />
    </svg>
  ),
  quote: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6.5 5C4 7 3 9.5 3 12.5V19h7v-7H6.2c0-1.8.9-3.3 2.6-4.5L6.5 5Zm10 0C14 7 13 9.5 13 12.5V19h7v-7h-3.8c0-1.8.9-3.3 2.6-4.5L16.5 5Z" />
    </svg>
  ),
  cake: icon(
    <>
      <path d="M4 20h16M5 20v-6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6" />
      <path d="M5 15c1.5 1.5 3 1.5 4.5 0s3-1.5 4.5 0 3 1.5 4.5 0" />
      <path d="M8 12V9M12 12V8M16 12V9M12 5v1" />
    </>,
    20,
  ),
  glass: icon(
    <>
      <path d="M8 3h8l-1 7a3 3 0 0 1-6 0L8 3Z" />
      <path d="M12 13v7M8 20h8" />
    </>,
    20,
  ),
  users: icon(
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 20a6 6 0 0 1 12 0" />
      <path d="M16 4.5a3.2 3.2 0 0 1 0 6.4M21 20a6 6 0 0 0-4.5-5.8" />
    </>,
    20,
  ),
  music: icon(<path d="M9 18a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm11-2a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM9 18V6l11-2v12" />, 20),
  external: icon(<path d="M14 4h6v6M20 4l-9 9M18 14v5H5V6h5" />, 15),
}

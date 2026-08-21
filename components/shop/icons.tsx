import type { ReactNode } from 'react'

/** Trazos inline sobre currentColor — no vale una dependencia por seis iconos. */
const icon = (path: ReactNode, size = 18, width = 1.7) => (
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
  close: icon(<path d="M6 6l12 12M18 6L6 18" />, 19),
  plus: icon(<path d="M12 5v14M5 12h14" />, 18),
  minus: icon(<path d="M5 12h14" />, 18),
  check: icon(<path d="m5 12 5 5 9-10" />, 13, 2.4),
  bag: icon(
    <>
      <path d="M6 8h12l-1 12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </>,
    22,
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
}

'use client'

import { createElement, useEffect, useRef, type ReactNode } from 'react'

type Props = {
  children: ReactNode
  /** Element to render — sections pass 'section' so the DOM stays semantic. */
  as?: 'div' | 'section' | 'footer'
  id?: string
  className?: string
  /** Stagger, in ms, for items revealed as a row. */
  delay?: number
}

/**
 * Fades its contents up the first time they enter the viewport, then stops
 * observing. Children are passed through from Server Components, so wrapping a
 * section in this doesn't pull its markup into the client bundle.
 */
export function Reveal({ children, as = 'div', id, className, delay = 0 }: Props) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reveal = () => el.classList.add('is-visible')

    // No IntersectionObserver (or reduced motion): show it and move on.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || typeof IntersectionObserver === 'undefined') {
      reveal()
      return
    }

    // Anything already reached by the time this hydrates — including sections
    // the reader has scrolled past — is shown outright. Without this, a section
    // scrolled by before hydration would never get an intersection event and
    // would stay invisible for the rest of the visit.
    if (el.getBoundingClientRect().top < window.innerHeight) {
      reveal()
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          window.setTimeout(reveal, delay)
          observer.unobserve(el)
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  return createElement(
    as,
    { ref, id, className: ['reveal', className].filter(Boolean).join(' ') },
    children,
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'
import type { NavLink } from '@/content'
import styles from './Header.module.css'

type Props = {
  brand: string
  nav: NavLink[]
  order: { label: string; href: string }
  reserve: { label: string; href: string }
  /** Shown at the foot of the open menu: the "where / when / how" answers a
   *  visitor arriving from Instagram wants without scrolling the page. */
  contact: {
    hours: string
    closed: string
    whatsappHref: string
    whatsappLabel: string
    instagramHref: string
    instagramHandle: string
  }
}

export function Header({ brand, nav, order, reserve, contact }: Props) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  // The bar gains its rule and a denser ground once the hero is behind it.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // While the menu is open the page underneath stays put, Escape closes it, and
  // focus moves into and back out of the panel.
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.inner}>
          <a href="#inicio" className={styles.brand}>
            {brand}
          </a>

          <nav className={styles.nav} aria-label="Navegación principal">
            {nav.map((link) => (
              <a key={link.href} href={link.href} className={styles.navLink}>
                {link.label}
              </a>
            ))}
          </nav>

          <div className={styles.actions}>
            {/* Reservar is the desktop-only companion; on a phone it lives in
                the menu so the bar keeps one unmistakable action. */}
            <a href={reserve.href} className={`btn btn-secondary ${styles.reserve}`}>
              {reserve.label}
            </a>
            <a href={order.href} className={`btn btnPrimary ${styles.order}`}>
              {order.label}
            </a>
          </div>

          <button
            ref={triggerRef}
            type="button"
            className={styles.trigger}
            aria-expanded={open}
            aria-controls="menu-principal"
            aria-label="Abrir el menú"
            onClick={() => setOpen(true)}
          >
            <span className={styles.bar} />
            <span className={styles.bar} />
          </button>
        </div>
      </header>

      <div
        id="menu-principal"
        className={`${styles.panel} ${open ? styles.panelOpen : ''}`}
        /* El panel queda en el DOM para poder animarse, pero sólo se anuncia
           como diálogo modal mientras está abierto: si no, le dice al lector de
           pantalla que el resto de la página está inerte todo el tiempo. */
        {...(open ? { role: 'dialog', 'aria-modal': true, 'aria-label': 'Menú' } : {})}
        inert={!open}
      >
        <div className={styles.panelHead}>
          <span className={styles.brand}>{brand}</span>
          <button
            ref={closeRef}
            type="button"
            className={styles.close}
            onClick={() => {
              setOpen(false)
              triggerRef.current?.focus()
            }}
            aria-label="Cerrar el menú"
          >
            <span className={styles.closeBar} />
            <span className={styles.closeBar} />
          </button>
        </div>

        <nav className={styles.panelNav} aria-label="Secciones">
          {nav.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={styles.panelLink}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className={styles.panelActions}>
          <a
            href={order.href}
            className={`btn btnPrimary ${styles.panelCta}`}
            onClick={() => setOpen(false)}
          >
            {order.label}
          </a>
          <a
            href={reserve.href}
            className={`btn btn-secondary ${styles.panelCta}`}
            onClick={() => setOpen(false)}
          >
            {reserve.label}
          </a>
        </div>

        <div className={styles.panelContact}>
          <div className={styles.panelHours}>
            <span>{contact.hours}</span>
            <span className={styles.panelClosed}>{contact.closed}</span>
          </div>
          <div className={styles.panelLinks}>
            <a href={contact.whatsappHref} target="_blank" rel="noopener noreferrer">
              WhatsApp · {contact.whatsappLabel}
            </a>
            <a href={contact.instagramHref} target="_blank" rel="noopener noreferrer">
              {contact.instagramHandle}
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

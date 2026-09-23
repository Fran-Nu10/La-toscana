'use client'

import { useEffect, useRef, useState } from 'react'
import type { NavLink } from '@/content'
import { ShopIcons } from './shop/icons'
import styles from './Header.module.css'

type Props = {
  brand: string
  nav: NavLink[]
  order: { label: string; href: string }
  reserve: { label: string; href: string }
  /** Al pie del menú abierto: horario, WhatsApp e Instagram, para quien
   *  llega desde una historia y quiere la respuesta sin scrollear. */
  contact: {
    hours: string
    closed: string
    whatsappHref: string
    whatsappLabel: string
    instagramHref: string
    instagramHandle: string
  }
}

/**
 * Barra fija. Sobre el hero es transparente con tinta clara; en cuanto la
 * página se mueve, gana superficie, desenfoque y la tinta espresso. "Pedir"
 * viaja siempre en la barra: es la acción comercial y queda a un pulgar de
 * distancia en cualquier punto del recorrido.
 */
export function Header({ brand, nav, order, reserve, contact }: Props) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    document.body.setAttribute('data-lock', '')
    closeRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.removeAttribute('data-lock')
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.inner}>
          <a href="#inicio" className={styles.brand} aria-label={`${brand}, inicio`}>
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
            <a href={reserve.href} className={`btn ${styles.reserve}`}>
              {reserve.label}
            </a>
            <a href={order.href} className={`btn ${styles.order}`}>
              {order.label}
            </a>
            <button
              ref={triggerRef}
              type="button"
              className={styles.trigger}
              aria-expanded={open}
              aria-controls="menu-principal"
              aria-label="Abrir el menú"
              onClick={() => setOpen(true)}
            >
              {ShopIcons.menu}
            </button>
          </div>
        </div>
      </header>

      <div
        id="menu-principal"
        className={`${styles.panel} ${open ? styles.panelOpen : ''}`}
        {...(open ? { role: 'dialog', 'aria-modal': true, 'aria-label': 'Menú' } : {})}
        inert={!open}
      >
        <div className={styles.panelHead}>
          <span className={styles.panelBrand}>{brand}</span>
          <button
            ref={closeRef}
            type="button"
            className={`iconBtn ${styles.close}`}
            onClick={() => {
              close()
              triggerRef.current?.focus()
            }}
            aria-label="Cerrar el menú"
          >
            {ShopIcons.close}
          </button>
        </div>

        <nav className={styles.panelNav} aria-label="Secciones">
          {nav.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              className={styles.panelLink}
              style={{ transitionDelay: open ? `${60 + index * 35}ms` : '0ms' }}
              onClick={close}
            >
              <span className={`${styles.panelIndex} tnum`}>{String(index + 1).padStart(2, '0')}</span>
              {link.label}
            </a>
          ))}
        </nav>

        <div className={styles.panelActions}>
          <a href={order.href} className="btn btn--primary btn--lg btn--block" onClick={close}>
            {order.label}
          </a>
          <a href={reserve.href} className="btn btn--secondary btn--lg btn--block" onClick={close}>
            {reserve.label}
          </a>
        </div>

        <div className={styles.panelContact}>
          <div className={styles.panelHours}>
            <span className={styles.panelHoursIcon}>{ShopIcons.clock}</span>
            <span>
              {contact.hours}
              <span className={styles.panelClosed}> · {contact.closed}</span>
            </span>
          </div>
          <div className={styles.panelLinks}>
            <a href={contact.whatsappHref} target="_blank" rel="noopener noreferrer" className={styles.panelLinkRow}>
              {ShopIcons.whatsapp}
              {contact.whatsappLabel}
            </a>
            <a href={contact.instagramHref} target="_blank" rel="noopener noreferrer" className={styles.panelLinkRow}>
              {ShopIcons.instagram}
              {contact.instagramHandle}
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

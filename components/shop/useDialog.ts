'use client'

import { useEffect, useRef, type RefObject } from 'react'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Comportamiento de diálogo, en un solo lugar para la hoja de producto y el
 * carrito: bloquea el scroll del fondo, atrapa el foco, cierra con Escape y
 * devuelve el foco al elemento que lo abrió.
 *
 * @param ref      contenedor del diálogo
 * @param onClose  se llama con Escape
 * @param active   si el diálogo está montado/abierto
 */
export function useDialog(ref: RefObject<HTMLElement | null>, onClose: () => void, active = true) {
  // El elemento que tenía el foco antes de abrir, para devolvérselo al cerrar.
  const opener = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!active) return
    const node = ref.current
    if (!node) return

    opener.current = document.activeElement as HTMLElement | null

    const previousOverflow = document.body.style.overflow
    const previousPadding = document.body.style.paddingRight
    // Compensa la barra de scroll para que el fondo no salte al bloquearlo.
    const gap = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (gap > 0) document.body.style.paddingRight = `${gap}px`

    const focusables = () =>
      Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetWidth > 0 || el.offsetHeight > 0,
      )

    // El primer control del diálogo recibe el foco al abrir.
    const first = focusables()[0]
    ;(first ?? node).focus({ preventScroll: true })

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
        return
      }
      if (event.key !== 'Tab') return
      const items = focusables()
      if (items.length === 0) {
        event.preventDefault()
        return
      }
      const firstItem = items[0]
      const lastItem = items[items.length - 1]
      const current = document.activeElement
      if (event.shiftKey && (current === firstItem || !node.contains(current))) {
        event.preventDefault()
        lastItem.focus()
      } else if (!event.shiftKey && current === lastItem) {
        event.preventDefault()
        firstItem.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown, true)
    return () => {
      document.removeEventListener('keydown', onKeyDown, true)
      document.body.style.overflow = previousOverflow
      document.body.style.paddingRight = previousPadding
      opener.current?.focus?.({ preventScroll: true })
    }
  }, [ref, onClose, active])
}

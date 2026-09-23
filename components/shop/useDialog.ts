'use client'

import { useEffect, useRef, type RefObject } from 'react'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/* Pila de diálogos abiertos. Sólo el de arriba responde a Escape: antes, con
   el detalle de producto abierto encima del carrito, Escape cerraba el carrito
   de atrás y dejaba la hoja huérfana con el scroll bloqueado. */
const stack: symbol[] = []

function lockBody() {
  const gap = window.innerWidth - document.documentElement.clientWidth
  document.body.setAttribute('data-lock', '')
  if (gap > 0) document.body.style.paddingRight = `${gap}px`
}
function unlockBody() {
  if (stack.length > 0) return
  document.body.removeAttribute('data-lock')
  document.body.style.paddingRight = ''
}

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
  const opener = useRef<HTMLElement | null>(null)
  // onClose cambia en cada render del padre; leerlo por ref evita re-registrar
  // el diálogo (y perder su lugar en la pila) con cada cambio de estado.
  const closeRef = useRef(onClose)
  useEffect(() => {
    closeRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!active) return
    const node = ref.current
    if (!node) return

    const id = Symbol('dialog')
    stack.push(id)
    opener.current = document.activeElement as HTMLElement | null
    lockBody()

    const focusables = () =>
      Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetWidth > 0 || el.offsetHeight > 0,
      )

    // El foco entra al contenedor, no al primer control: así el lector de
    // pantalla anuncia el título antes de que el usuario toque nada.
    node.focus({ preventScroll: true })

    const onKeyDown = (event: KeyboardEvent) => {
      if (stack[stack.length - 1] !== id) return
      if (event.key === 'Escape') {
        event.preventDefault()
        closeRef.current()
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
      if (event.shiftKey && (current === firstItem || current === node || !node.contains(current))) {
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
      const index = stack.indexOf(id)
      if (index >= 0) stack.splice(index, 1)
      unlockBody()
      opener.current?.focus?.({ preventScroll: true })
    }
  }, [ref, active])
}

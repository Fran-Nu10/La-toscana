'use client'

import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import type { OrderStatus } from '@/data/types'
import styles from './admin.module.css'

/* ── Estados de pedido ─────────────────────────────────────────────────────
   Un solo lugar define el nombre y el color de cada estado, así la lista, el
   detalle y los filtros no pueden desincronizarse. */

export const ORDER_STATUSES: OrderStatus[] = [
  'pending', 'confirmed', 'preparing', 'ready', 'delivering', 'completed', 'cancelled',
]

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Nuevo',
  confirmed: 'Confirmado',
  preparing: 'Preparando',
  ready: 'Listo',
  delivering: 'En camino',
  completed: 'Finalizado',
  cancelled: 'Cancelado',
}

const STATUS_CLASS: Record<OrderStatus, string> = {
  pending: styles.stPending,
  confirmed: styles.stConfirmed,
  preparing: styles.stPreparing,
  ready: styles.stReady,
  delivering: styles.stDelivering,
  completed: styles.stCompleted,
  cancelled: styles.stCancelled,
}

export function StatusPill({ status }: { status: OrderStatus }) {
  return (
    <span className={`${styles.pill} ${STATUS_CLASS[status]}`}>
      <span className={styles.pillDot} aria-hidden="true" />
      {STATUS_LABELS[status]}
    </span>
  )
}

/* ── Tiempo relativo ───────────────────────────────────────────────────────
   "hace 6 min" le dice al cocinero lo que necesita; una fecha completa, no. */

export function timeAgo(iso: string): string {
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60000)
  if (!Number.isFinite(minutes)) return ''
  if (minutes < 1) return 'recién'
  if (minutes < 60) return `hace ${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `hace ${hours} h`
  const days = Math.floor(hours / 24)
  return days === 1 ? 'ayer' : `hace ${days} días`
}

export function shortTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' })
}

/* ── Campos ────────────────────────────────────────────────────────────────
   El label siempre existe y siempre está asociado: nada de placeholders
   haciendo de etiqueta. */

type FieldProps = { label: string; hint?: string; children: ReactNode }

export function Field({ label, hint, children }: FieldProps) {
  return (
    <label className={styles.field}>
      <span className={styles.label}>{label}</span>
      {children}
      {hint && <span className={styles.hint}>{hint}</span>}
    </label>
  )
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={styles.input} />
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={styles.textarea} />
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={styles.select} />
}

/** Campo de dinero: prefijo fijo y cifras tabulares. */
export function MoneyInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <span className={styles.inputPrefix}>
      <span aria-hidden="true">$</span>
      <input {...props} type="number" min="0" step="1" inputMode="numeric" className={styles.input} />
    </span>
  )
}

/* ── Interruptor ───────────────────────────────────────────────────────────
   Un checkbox nativo debajo (accesible, funciona con teclado y con formularios)
   y la pista dibujada encima. */

type SwitchProps = {
  label: string
  hint?: string
  checked: boolean
  onChange: (checked: boolean) => void
  name?: string
}

export function Switch({ label, hint, checked, onChange, name }: SwitchProps) {
  return (
    <label className={styles.switchRow}>
      <span className={styles.switchText}>
        <span className={styles.switchLabel}>{label}</span>
        {hint && <span className={styles.hint}>{hint}</span>}
      </span>
      <input
        type="checkbox"
        role="switch"
        name={name}
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className={styles.switchInput}
      />
      <span className={`${styles.switch} ${checked ? styles.switchOn : ''}`} aria-hidden="true" />
    </label>
  )
}

/* ── Estado vacío ─────────────────────────────────────────────────────────── */

export function EmptyState({
  title,
  text,
  icon,
  action,
}: {
  title: string
  text: string
  icon?: ReactNode
  action?: ReactNode
}) {
  return (
    <div className={styles.empty}>
      {icon && <span className={styles.emptyMark}>{icon}</span>}
      <span className={styles.emptyTitle}>{title}</span>
      <p className={styles.emptyText}>{text}</p>
      {action}
    </div>
  )
}

/* ── Iconos ────────────────────────────────────────────────────────────────
   Inline y con currentColor — no vale la pena una dependencia por seis trazos. */

const icon = (path: ReactNode, size = 18) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {path}
  </svg>
)

export const Icons = {
  search: icon(<><circle cx="11" cy="11" r="7" /><path d="m20 20-3.2-3.2" /></>, 16),
  plus: icon(<><path d="M12 5v14M5 12h14" /></>),
  trash: icon(<><path d="M4 7h16M10 11v6M14 11v6" /><path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" /><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></>, 17),
  close: icon(<><path d="M6 6l12 12M18 6L6 18" /></>, 20),
  receipt: icon(<><path d="M6 3v18l3-2 3 2 3-2 3 2V3l-3 2-3-2-3 2Z" /><path d="M9 9h6M9 13h4" /></>, 22),
  box: icon(<><path d="M21 8 12 3 3 8v8l9 5 9-5Z" /><path d="m3 8 9 5 9-5M12 13v8" /></>, 22),
  tag: icon(<><path d="M3 12V5a2 2 0 0 1 2-2h7l9 9-9 9-9-9Z" /><circle cx="7.5" cy="7.5" r="1.2" /></>, 22),
  chevron: icon(<><path d="m9 6 6 6-6 6" /></>, 16),
  check: icon(<><path d="m5 12 5 5 9-10" /></>, 16),
}

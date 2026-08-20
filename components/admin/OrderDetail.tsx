'use client'

import { useEffect, useRef } from 'react'
import { useCommerce } from '../CommerceProvider'
import type { Order, OrderStatus } from '@/data/types'
import { formatUyu } from '@/lib/order'
import { Icons, ORDER_STATUSES, STATUS_LABELS, StatusPill, shortTime, timeAgo } from './ui'
import styles from './admin.module.css'

/**
 * Detalle del pedido: hoja inferior en teléfono, diálogo centrado desde 700px.
 * Todo lo que hace falta para preparar y entregar, en orden de uso: estado,
 * quién es y cómo llega, qué pidió, cuánto es.
 */
export function OrderDetail({ order, onClose }: { order: Order; onClose: () => void }) {
  const commerce = useCommerce()
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose])

  const phone = order.customer.phone.replace(/\s/g, '')

  return (
    <div className={styles.sheetBackdrop} role="presentation" onClick={onClose}>
      <section
        className={styles.sheet}
        role="dialog"
        aria-modal="true"
        aria-labelledby="detalle-pedido"
        onClick={(event) => event.stopPropagation()}
      >
        <header className={styles.sheetHead}>
          <div>
            <h2 className={styles.sheetTitle} id="detalle-pedido">
              Pedido #{order.number}
            </h2>
            <p className={styles.cardNote}>
              {shortTime(order.createdAt)} · {timeAgo(order.createdAt)}
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            className={styles.iconBtn}
            onClick={onClose}
            aria-label="Cerrar el detalle"
          >
            {Icons.close}
          </button>
        </header>

        <div className={styles.sheetBody}>
          {/* Estado arriba de todo: es lo que se viene a cambiar. */}
          <div className={`${styles.card} ${styles.cardPad}`}>
            <div className={styles.detailPair} style={{ marginBottom: 10 }}>
              <span className={styles.detailKey}>Estado actual</span>
              <span>
                <StatusPill status={order.status} />
              </span>
            </div>
            <label className={styles.field}>
              <span className={styles.label}>Cambiar estado</span>
              <select
                className={styles.select}
                value={order.status}
                onChange={(event) =>
                  commerce.updateOrderStatus(order.id, event.target.value as OrderStatus)
                }
              >
                {ORDER_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className={`${styles.card} ${styles.cardPad}`}>
            <div className={styles.detailGrid}>
              <div className={styles.detailPair}>
                <span className={styles.detailKey}>Cliente</span>
                <span className={styles.detailValue}>{order.customer.name}</span>
              </div>
              <div className={styles.detailPair}>
                <span className={styles.detailKey}>Teléfono</span>
                <span className={styles.detailValue}>
                  <a href={`tel:${phone}`}>{order.customer.phone}</a>
                </span>
              </div>
              <div className={styles.detailPair}>
                <span className={styles.detailKey}>Entrega</span>
                <span className={styles.detailValue}>
                  {order.fulfillment === 'delivery' ? 'Delivery' : 'Retiro en el local'}
                </span>
              </div>
              {order.fulfillment === 'delivery' && (
                <div className={styles.detailPair}>
                  <span className={styles.detailKey}>Dirección</span>
                  <span className={styles.detailValue}>{order.address}</span>
                </div>
              )}
              {order.notes && (
                <div className={styles.detailPair}>
                  <span className={styles.detailKey}>Observaciones del pedido</span>
                  <span className={styles.detailValue}>{order.notes}</span>
                </div>
              )}
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHead}>
              <h3 className={styles.cardTitle}>
                Productos ({order.items.reduce((sum, item) => sum + item.quantity, 0)})
              </h3>
            </div>
            <div className={styles.cardPad}>
              {order.items.map((item, index) => (
                <article className={styles.lineItem} key={`${item.productId}-${index}`}>
                  <span className={styles.lineName}>
                    {item.quantity} × {item.productName}
                  </span>
                  <span className={styles.lineTotal}>{formatUyu(item.lineTotalCents)}</span>
                  {item.choices.length > 0 && (
                    <ul className={styles.lineChoices}>
                      {item.choices.map((choice) => (
                        <li key={`${choice.optionId}-${choice.choiceId}`}>
                          {choice.optionName}: {choice.choiceName}
                          {choice.priceDeltaCents
                            ? ` (+${formatUyu(choice.priceDeltaCents)})`
                            : ''}
                        </li>
                      ))}
                    </ul>
                  )}
                  {item.notes && <p className={styles.lineNote}>“{item.notes}”</p>}
                </article>
              ))}
            </div>
          </div>

          <dl className={`${styles.card} ${styles.cardPad} ${styles.totals}`}>
            <div className={styles.totalRow}>
              <dt>Subtotal</dt>
              <dd>{formatUyu(order.subtotalCents)}</dd>
            </div>
            <div className={styles.totalRow}>
              <dt>Delivery</dt>
              <dd>{order.deliveryFeeCents ? formatUyu(order.deliveryFeeCents) : '—'}</dd>
            </div>
            <div className={`${styles.totalRow} ${styles.totalGrand}`}>
              <dt>Total</dt>
              <dd>{formatUyu(order.totalCents)}</dd>
            </div>
          </dl>

          <a className={`${styles.btn} ${styles.btnBlock}`} href={`tel:${phone}`}>
            Llamar a {order.customer.name.split(' ')[0]}
          </a>
        </div>
      </section>
    </div>
  )
}

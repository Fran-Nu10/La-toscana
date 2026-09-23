'use client'

import Link from 'next/link'
import { useCommerce } from './CommerceProvider'
import type { OrderStatus } from '@/data/types'
import { formatUyu } from '@/lib/order'
import { ShopIcons } from './shop/icons'
import { ShopShell } from './shop/ShopShell'
import styles from './OrderTracking.module.css'

const FLOW: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'delivering', 'completed']

const LABELS: Record<OrderStatus, string> = {
  pending: 'Recibido',
  confirmed: 'Confirmado',
  preparing: 'Preparando',
  ready: 'Listo',
  delivering: 'En camino',
  completed: 'Entregado',
  cancelled: 'Cancelado',
}

const DETAIL: Record<OrderStatus, string> = {
  pending: 'Ya nos llegó. En un momento lo confirmamos.',
  confirmed: 'Confirmado por el restaurante. Enseguida entra a la cocina.',
  preparing: 'La cocina está con tu pedido.',
  ready: 'Está listo.',
  delivering: 'Salió del restaurante y va para tu casa.',
  completed: 'Entregado. ¡Que lo disfrutes!',
  cancelled: 'Este pedido fue cancelado.',
}

/**
 * Seguimiento del pedido. El estado actual manda la pantalla —grande, con su
 * explicación— y la línea de tiempo muestra el camino recorrido y el que
 * falta. Retiro no pasa por "En camino".
 */
export function OrderTracking({ token }: { token: string }) {
  const { orders, ready, settings } = useCommerce()
  const order = orders.find((item) => item.trackingToken === token)

  if (!ready) {
    return (
      <ShopShell back={{ label: 'Inicio', href: '/' }}>
        <p className={styles.state}>Cargando pedido…</p>
      </ShopShell>
    )
  }

  if (!order) {
    return (
      <ShopShell back={{ label: 'Inicio', href: '/' }}>
        <div className={`card ${styles.missing}`}>
          <span className={styles.missingMark}>{ShopIcons.alert}</span>
          <h1 className={styles.missingTitle}>No encontramos ese pedido</h1>
          <p className={styles.missingText}>
            Revisá el enlace que te dimos al confirmar, o escribinos por WhatsApp y lo buscamos juntos.
          </p>
          <Link href="/" className="btn btn--primary">
            Volver al inicio
          </Link>
        </div>
      </ShopShell>
    )
  }

  const steps = FLOW.filter((status) => order.fulfillment === 'delivery' || status !== 'delivering')
  const currentIndex = steps.indexOf(order.status)
  const cancelled = order.status === 'cancelled'
  const done = order.status === 'completed'
  const detail =
    order.status === 'ready'
      ? order.fulfillment === 'delivery'
        ? 'Está listo y sale en un momento.'
        : `Está listo para retirar en ${settings.address}.`
      : DETAIL[order.status]

  return (
    <ShopShell back={{ label: 'Inicio', href: '/' }}>
      <div className={styles.head}>
        <p className="kicker">Seguimiento</p>
        <h1 className={styles.title}>
          Pedido <span className="tnum">#{order.number}</span>
        </h1>
      </div>

      <section
        className={`card ${styles.status} ${cancelled ? styles.statusCancelled : ''} ${done ? styles.statusDone : ''}`}
        aria-live="polite"
      >
        <div className={styles.statusTop}>
          <span className={styles.statusPulse} aria-hidden="true" />
          <span className={styles.statusLabel}>Estado actual</span>
        </div>
        <p className={styles.statusName}>{LABELS[order.status]}</p>
        <p className={styles.statusDetail}>{detail}</p>

        {!cancelled && (
          <ol className={styles.timeline}>
            {steps.map((status, index) => {
              const state = index < currentIndex ? 'done' : index === currentIndex ? 'current' : 'next'
              return (
                <li key={status} className={styles.stepItem} data-state={state}>
                  <span className={styles.stepDot} aria-hidden="true">
                    {state === 'done' && ShopIcons.check}
                  </span>
                  <span className={styles.stepLabel}>
                    {LABELS[status]}
                    {state === 'current' && <span className="srOnly"> (actual)</span>}
                  </span>
                </li>
              )
            })}
          </ol>
        )}
      </section>

      <section className={`card ${styles.summary}`} aria-labelledby="resumen-pedido">
        <h2 className={styles.summaryTitle} id="resumen-pedido">
          Resumen
        </h2>
        <ul className={styles.lines}>
          {order.items.map((item, index) => (
            <li key={`${item.productId}-${index}`} className={styles.line}>
              <span>
                <span className={`${styles.lineQty} tnum`}>{item.quantity}×</span> {item.productName}
                {item.choices.length > 0 && (
                  <span className={styles.lineMeta}> · {item.choices.map((c) => c.choiceName).join(', ')}</span>
                )}
                {item.notes && <span className={styles.lineMeta}> · “{item.notes}”</span>}
              </span>
              <span className="tnum">{formatUyu(item.lineTotalCents)}</span>
            </li>
          ))}
        </ul>
        <dl className={styles.facts}>
          <div>
            <dt>{order.fulfillment === 'delivery' ? 'Delivery a' : 'Retiro en'}</dt>
            <dd>{order.fulfillment === 'delivery' ? order.address : settings.address}</dd>
          </div>
          {order.deliveryFeeCents > 0 && (
            <div>
              <dt>Envío</dt>
              <dd className="tnum">{formatUyu(order.deliveryFeeCents)}</dd>
            </div>
          )}
          <div className={styles.total}>
            <dt>Total</dt>
            <dd className="tnum">{formatUyu(order.totalCents)}</dd>
          </div>
        </dl>
      </section>

      <p className={styles.help}>
        ¿Necesitás cambiar algo? Escribinos al <span className="tnum">{settings.phone}</span>.
      </p>
    </ShopShell>
  )
}

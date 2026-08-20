'use client'

import { useMemo, useState } from 'react'
import { useCommerce } from '../CommerceProvider'
import type { Order, OrderStatus } from '@/data/types'
import { formatUyu } from '@/lib/order'
import { OrderDetail } from './OrderDetail'
import { EmptyState, Icons, ORDER_STATUSES, STATUS_LABELS, StatusPill, timeAgo } from './ui'
import styles from './admin.module.css'

type OrderFilter = 'all' | 'pending' | 'confirmed' | 'preparing' | 'ready' | 'finished'

const FILTERS: [OrderFilter, string][] = [
  ['all', 'Todos'],
  ['pending', 'Nuevos'],
  ['confirmed', 'Confirmados'],
  ['preparing', 'Preparando'],
  ['ready', 'Listos'],
  ['finished', 'Finalizados'],
]

const FINISHED: OrderStatus[] = ['completed', 'cancelled']
const IN_PROGRESS: OrderStatus[] = ['confirmed', 'preparing', 'delivering']

/** Mismo criterio que usaba el panel anterior: "finalizados" agrupa completados
 *  y cancelados; el resto filtra por estado exacto. */
function matches(order: Order, filter: OrderFilter): boolean {
  if (filter === 'all') return true
  if (filter === 'finished') return FINISHED.includes(order.status)
  return order.status === filter
}

const isToday = (iso: string) => new Date(iso).toDateString() === new Date().toDateString()

export function OrdersPanel() {
  const commerce = useCommerce()
  const [filter, setFilter] = useState<OrderFilter>('all')
  const [detailId, setDetailId] = useState<string | null>(null)

  const orders = commerce.orders
  const visible = useMemo(() => orders.filter((order) => matches(order, filter)), [orders, filter])

  const counts = useMemo(() => {
    const by = (predicate: (order: Order) => boolean) => orders.filter(predicate).length
    const soldToday = orders
      .filter((order) => isToday(order.createdAt) && order.status !== 'cancelled')
      .reduce((sum, order) => sum + order.totalCents, 0)
    return {
      pending: by((order) => order.status === 'pending'),
      inProgress: by((order) => IN_PROGRESS.includes(order.status)),
      ready: by((order) => order.status === 'ready'),
      soldToday,
    }
  }, [orders])

  const detail = detailId ? orders.find((order) => order.id === detailId) : undefined

  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>Pedidos</h1>
          <p className={styles.pageSubtitle}>
            {counts.pending > 0
              ? `${counts.pending} ${counts.pending === 1 ? 'pedido nuevo sin confirmar' : 'pedidos nuevos sin confirmar'}`
              : 'Sin pedidos nuevos por ahora'}
          </p>
        </div>
      </div>

      {/* Cuatro números, los que se miran de reojo en plena noche de servicio. */}
      <div className={styles.summary}>
        <div className={`${styles.stat} ${counts.pending ? styles.statAlert : ''}`}>
          <div className={styles.statValue}>{counts.pending}</div>
          <div className={styles.statLabel}>Nuevos</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statValue}>{counts.inProgress}</div>
          <div className={styles.statLabel}>En curso</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statValue}>{counts.ready}</div>
          <div className={styles.statLabel}>Listos</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statValue}>{formatUyu(counts.soldToday)}</div>
          <div className={styles.statLabel}>Vendido hoy</div>
        </div>
      </div>

      <div className={styles.filters} role="group" aria-label="Filtrar pedidos por estado">
        {FILTERS.map(([value, label]) => {
          const count = orders.filter((order) => matches(order, value)).length
          return (
            <button
              key={value}
              type="button"
              className={`${styles.chip} ${filter === value ? styles.chipActive : ''}`}
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}
            >
              {label}
              <span className={styles.chipCount}>{count}</span>
            </button>
          )
        })}
      </div>

      {orders.length === 0 ? (
        <EmptyState
          icon={Icons.receipt}
          title="Todavía no entró ningún pedido"
          text="Cuando alguien complete una compra desde la carta, va a aparecer acá con su estado y su detalle."
          action={
            <a className={`${styles.btn} ${styles.btnSmall}`} href="/#menu" style={{ marginTop: 8 }}>
              Ver la carta pública
            </a>
          }
        />
      ) : visible.length === 0 ? (
        <EmptyState
          icon={Icons.receipt}
          title="Nada en este filtro"
          text="No hay pedidos en este estado. Probá con otro filtro para ver el resto."
        />
      ) : (
        <ul className={styles.orders}>
          {visible.map((order) => (
            <li
              key={order.id}
              className={`${styles.order} ${order.status === 'pending' ? styles.orderNew : ''}`}
            >
              <div className={styles.orderTop}>
                <div className={styles.orderId}>
                  <span className={styles.orderNumber}>#{order.number}</span>
                  <span className={styles.orderTime}>{timeAgo(order.createdAt)}</span>
                  <StatusPill status={order.status} />
                </div>
                <p className={styles.orderCustomer}>{order.customer.name}</p>
                <p className={styles.orderMeta}>
                  <a href={`tel:${order.customer.phone.replace(/\s/g, '')}`}>
                    {order.customer.phone}
                  </a>
                  <span className={styles.dot} aria-hidden="true" />
                  <span>{order.fulfillment === 'delivery' ? 'Delivery' : 'Retiro'}</span>
                  <span className={styles.dot} aria-hidden="true" />
                  <span>
                    {order.items.length} {order.items.length === 1 ? 'ítem' : 'ítems'}
                  </span>
                </p>
              </div>

              <div className={styles.orderActions}>
                <span className={`${styles.orderTotal} ${styles.orderTotalCell}`}>
                  {formatUyu(order.totalCents)}
                </span>
                {/* El nativo es lo mejor en teléfono: abre el selector del
                    sistema y no hace falta ningún menú propio. */}
                <select
                  className={styles.select}
                  value={order.status}
                  aria-label={`Cambiar estado del pedido ${order.number}`}
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
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnSmall}`}
                  onClick={() => setDetailId(order.id)}
                >
                  Detalle
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {detail && <OrderDetail order={detail} onClose={() => setDetailId(null)} />}
    </>
  )
}

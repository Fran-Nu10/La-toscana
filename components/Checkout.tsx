'use client'

import { useEffect, useState, type FormEvent } from 'react'
import Link from 'next/link'
import type { FulfillmentType, Order } from '@/data/types'
import { formatUyu, lineTotal } from '@/lib/order'
import { validFulfillment } from '@/services/fulfillment'
import { productPhoto } from '@/content/productPhotos'
import { useCart } from './CartProvider'
import { useCommerce } from './CommerceProvider'
import { Photo } from './Photo'
import { ShopIcons } from './shop/icons'
import { ShopShell } from './shop/ShopShell'
import styles from './Checkout.module.css'

const CONTACT_KEY = 'la-toscana-contact'

/**
 * Finalizar pedido. Tres pasos en tarjetas —contacto, entrega, tu pedido— y
 * un resumen que en escritorio acompaña al costado y en teléfono cierra la
 * página con el botón siempre a mano. Menos formulario, más "completar".
 *
 * La lógica es la misma: `placeOrder` valida contra el catálogo y la
 * configuración; acá sólo se arma el input.
 */
export function Checkout() {
  const cart = useCart()
  const commerce = useCommerce()
  const [fulfillment, setFulfillment] = useState<FulfillmentType | null>(null)
  const [error, setError] = useState('')
  const [order, setOrder] = useState<Order | null>(null)
  const [savedContact, setSavedContact] = useState({ name: '', phone: '' })

  useEffect(() => {
    if (commerce.ready) setFulfillment((current) => validFulfillment(commerce.settings, current ?? undefined))
  }, [commerce.ready, commerce.settings])

  useEffect(() => {
    try {
      setSavedContact(JSON.parse(localStorage.getItem(CONTACT_KEY) ?? '{"name":"","phone":""}'))
    } catch {}
  }, [])

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    if (!fulfillment) return setError('No hay una modalidad de entrega habilitada.')
    const form = new FormData(event.currentTarget)
    try {
      const created = commerce.placeOrder(cart.lines, {
        customer: {
          name: String(form.get('name')),
          phone: String(form.get('phone')),
          email: String(form.get('email') ?? ''),
        },
        fulfillment,
        address: String(form.get('address') ?? ''),
        notes: String(form.get('notes') ?? ''),
      })
      if (form.get('remember') === 'on') {
        localStorage.setItem(
          CONTACT_KEY,
          JSON.stringify({ name: String(form.get('name')), phone: String(form.get('phone')) }),
        )
      } else localStorage.removeItem(CONTACT_KEY)
      setOrder(created)
      cart.clear()
      window.scrollTo({ top: 0 })
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'No pudimos crear el pedido.')
    }
  }

  if (order) return <Confirmation order={order} pickupAddress={commerce.settings.address} />

  const settings = commerce.settings
  const fee = fulfillment === 'delivery' ? settings.deliveryFeeCents : 0
  const total = cart.total + fee
  const blocked = !commerce.ready || !settings.orderingOpen || cart.lines.length === 0

  return (
    <ShopShell back={{ label: 'Volver a la carta', href: '/#menu' }} width="wide">
      <div className={styles.head}>
        <p className="kicker">Tu pedido</p>
        <h1 className={styles.title}>Finalizar pedido</h1>
      </div>

      {!commerce.ready ? (
        <p className={styles.state}>Cargando…</p>
      ) : !settings.orderingOpen ? (
        <EmptyState
          title="Ahora no estamos tomando pedidos"
          text={`Horario de pedidos: ${settings.orderHours}.`}
        />
      ) : cart.lines.length === 0 ? (
        <EmptyState title="Tu pedido está vacío" text="Elegí algo de la carta y volvé por acá." />
      ) : (
        <div className={styles.layout}>
          <form id="checkout-form" className={styles.form} onSubmit={submit} noValidate={false}>
            {/* 1 · Contacto */}
            <section className={`card ${styles.step}`} aria-labelledby="paso-contacto">
              <header className={styles.stepHead}>
                <span className={`${styles.stepIndex} tnum`}>1</span>
                <div>
                  <h2 className={styles.stepTitle} id="paso-contacto">
                    Tus datos
                  </h2>
                  <p className={styles.stepHint}>Para avisarte cuando esté listo.</p>
                </div>
              </header>
              <div className={styles.fields}>
                <div className="field">
                  <label className="label" htmlFor="co-name">
                    Nombre
                  </label>
                  <input
                    id="co-name"
                    className="input"
                    required
                    minLength={2}
                    name="name"
                    autoComplete="name"
                    defaultValue={savedContact.name}
                    placeholder="Como te conocemos"
                  />
                </div>
                <div className="field">
                  <label className="label" htmlFor="co-phone">
                    Teléfono
                  </label>
                  <input
                    id="co-phone"
                    className="input tnum"
                    required
                    minLength={6}
                    name="phone"
                    inputMode="tel"
                    autoComplete="tel"
                    defaultValue={savedContact.phone}
                    placeholder="099 000 000"
                  />
                </div>
                <div className={`field ${styles.fieldWide}`}>
                  <label className="label" htmlFor="co-email">
                    Email <small>(opcional)</small>
                  </label>
                  <input id="co-email" className="input" name="email" type="email" autoComplete="email" />
                </div>
                <label className={`${styles.remember} ${styles.fieldWide}`}>
                  <input type="checkbox" name="remember" defaultChecked={!!savedContact.name} className={styles.checkbox} />
                  <span>Recordar mis datos en este dispositivo</span>
                </label>
              </div>
            </section>

            {/* 2 · Entrega */}
            <section className={`card ${styles.step}`} aria-labelledby="paso-entrega">
              <header className={styles.stepHead}>
                <span className={`${styles.stepIndex} tnum`}>2</span>
                <div>
                  <h2 className={styles.stepTitle} id="paso-entrega">
                    Entrega
                  </h2>
                  <p className={styles.stepHint}>Pago al recibir o al retirar.</p>
                </div>
              </header>

              <div className={styles.modes} role="radiogroup" aria-label="Modalidad de entrega">
                {settings.pickupEnabled && (
                  <label className={`${styles.mode} ${fulfillment === 'pickup' ? styles.modeActive : ''}`}>
                    <input
                      type="radio"
                      name="fulfillment"
                      className={styles.modeInput}
                      checked={fulfillment === 'pickup'}
                      onChange={() => setFulfillment('pickup')}
                    />
                    <span className={styles.modeIcon}>{ShopIcons.store}</span>
                    <span className={styles.modeText}>
                      <span className={styles.modeName}>Retiro</span>
                      <span className={styles.modeMeta}>Sin costo · {settings.address}</span>
                    </span>
                  </label>
                )}
                {settings.deliveryEnabled && (
                  <label className={`${styles.mode} ${fulfillment === 'delivery' ? styles.modeActive : ''}`}>
                    <input
                      type="radio"
                      name="fulfillment"
                      className={styles.modeInput}
                      checked={fulfillment === 'delivery'}
                      onChange={() => setFulfillment('delivery')}
                    />
                    <span className={styles.modeIcon}>{ShopIcons.delivery}</span>
                    <span className={styles.modeText}>
                      <span className={styles.modeName}>Delivery</span>
                      <span className={`${styles.modeMeta} tnum`}>
                        {formatUyu(settings.deliveryFeeCents)} · mínimo {formatUyu(settings.deliveryMinimumCents)}
                      </span>
                    </span>
                  </label>
                )}
              </div>

              {!fulfillment && (
                <p role="alert" className="notice notice--danger">
                  {ShopIcons.alert}
                  No hay modalidades de entrega habilitadas.
                </p>
              )}

              {fulfillment === 'delivery' && (
                <div className="field">
                  <label className="label" htmlFor="co-address">
                    Dirección de entrega
                  </label>
                  <input
                    id="co-address"
                    className="input"
                    required
                    name="address"
                    autoComplete="street-address"
                    placeholder="Calle, número y referencias"
                  />
                </div>
              )}

              <div className="field">
                <label className="label" htmlFor="co-notes">
                  Indicaciones <small>(opcional)</small>
                </label>
                <textarea
                  id="co-notes"
                  className="input"
                  name="notes"
                  maxLength={500}
                  rows={2}
                  placeholder="Timbre, piso, horario preferido…"
                />
              </div>
            </section>

            {/* 3 · Tu pedido */}
            <section className={`card ${styles.step}`} aria-labelledby="paso-pedido">
              <header className={styles.stepHead}>
                <span className={`${styles.stepIndex} tnum`}>3</span>
                <div>
                  <h2 className={styles.stepTitle} id="paso-pedido">
                    Tu pedido
                  </h2>
                  <p className={styles.stepHint}>
                    {cart.count} {cart.count === 1 ? 'producto' : 'productos'}
                  </p>
                </div>
                <Link href="/#menu" className={`btn btn--ghost btn--sm ${styles.stepAction}`}>
                  Agregar más
                </Link>
              </header>
              <ul className={styles.lines}>
                {cart.lines.map((line) => {
                  const photo = productPhoto(line.productId)
                  return (
                    <li key={line.key} className={styles.line}>
                      <span className={styles.lineMedia} aria-hidden="true">
                        {photo && <Photo photo={photo} sizes="48px" />}
                      </span>
                      <span className={styles.lineText}>
                        <span className={styles.lineName}>
                          <span className={`${styles.lineQty} tnum`}>{line.quantity}×</span> {line.name}
                        </span>
                        {(line.selections.length > 0 || line.notes) && (
                          <span className={styles.lineMeta}>
                            {line.selections.map((choice) => choice.name).join(' · ')}
                            {line.notes ? ` · “${line.notes}”` : ''}
                          </span>
                        )}
                      </span>
                      <span className={`${styles.linePrice} tnum`}>{formatUyu(lineTotal(line))}</span>
                    </li>
                  )
                })}
              </ul>
            </section>
          </form>

          <aside className={styles.summary} aria-label="Resumen">
            <div className={`card ${styles.summaryCard}`}>
              <h2 className={styles.summaryTitle}>Resumen</h2>
              <dl className={styles.totals}>
                <div className={styles.totalRow}>
                  <dt>Subtotal</dt>
                  <dd className="tnum">{formatUyu(cart.total)}</dd>
                </div>
                <div className={styles.totalRow}>
                  <dt>{fulfillment === 'delivery' ? 'Envío' : 'Retiro en el local'}</dt>
                  <dd className="tnum">{fee > 0 ? formatUyu(fee) : 'Sin costo'}</dd>
                </div>
                <div className={`${styles.totalRow} ${styles.totalGrand}`}>
                  <dt>Total</dt>
                  <dd className="tnum">{formatUyu(total)}</dd>
                </div>
              </dl>
              {error && (
                <p role="alert" className="notice notice--danger">
                  {ShopIcons.alert}
                  {error}
                </p>
              )}
              <button
                type="submit"
                form="checkout-form"
                className="btn btn--primary btn--lg btn--block"
                disabled={!fulfillment || blocked}
              >
                Confirmar pedido
                {ShopIcons.arrow}
              </button>
              <p className={styles.summaryHint}>
                {settings.orderHours}. Pago al {fulfillment === 'delivery' ? 'recibir' : 'retirar'}.
              </p>
            </div>
          </aside>
        </div>
      )}
    </ShopShell>
  )
}

function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className={`card ${styles.empty}`}>
      <span className={styles.emptyMark}>{ShopIcons.bag}</span>
      <h2 className={styles.emptyTitle}>{title}</h2>
      <p className={styles.emptyText}>{text}</p>
      <Link href="/#menu" className="btn btn--primary">
        Ver la carta
      </Link>
    </div>
  )
}

/** Después de confirmar: éxito claro, número, resumen, modalidad y seguimiento. */
function Confirmation({ order, pickupAddress }: { order: Order; pickupAddress: string }) {
  return (
    <ShopShell back={{ label: 'Volver al inicio', href: '/' }}>
      <div className={styles.confirm}>
        <span className={styles.confirmMark}>{ShopIcons.check}</span>
        <p className="kicker">Pedido recibido</p>
        <h1 className={styles.confirmTitle}>¡Gracias, {order.customer.name.split(' ')[0]}!</h1>
        <p className={styles.confirmText}>
          Ya tenemos tu pedido. Te avisamos al <span className="tnum">{order.customer.phone}</span>{' '}
          cuando lo confirmemos.
        </p>

        <div className={`card ${styles.receipt}`}>
          <div className={styles.receiptHead}>
            <span className={styles.receiptLabel}>Pedido</span>
            <span className={`${styles.receiptNumber} tnum`}>#{order.number}</span>
          </div>
          <ul className={styles.receiptLines}>
            {order.items.map((item, index) => (
              <li key={`${item.productId}-${index}`} className={styles.receiptLine}>
                <span>
                  <span className="tnum">{item.quantity}×</span> {item.productName}
                  {item.choices.length > 0 && (
                    <span className={styles.receiptMeta}> · {item.choices.map((c) => c.choiceName).join(', ')}</span>
                  )}
                </span>
                <span className="tnum">{formatUyu(item.lineTotalCents)}</span>
              </li>
            ))}
          </ul>
          <dl className={styles.receiptFacts}>
            <div>
              <dt>Modalidad</dt>
              <dd>{order.fulfillment === 'delivery' ? `Delivery a ${order.address}` : `Retiro en ${pickupAddress}`}</dd>
            </div>
            {order.deliveryFeeCents > 0 && (
              <div>
                <dt>Envío</dt>
                <dd className="tnum">{formatUyu(order.deliveryFeeCents)}</dd>
              </div>
            )}
            <div className={styles.receiptTotal}>
              <dt>Total</dt>
              <dd className="tnum">{formatUyu(order.totalCents)}</dd>
            </div>
          </dl>
        </div>

        <Link className="btn btn--primary btn--lg btn--block" href={`/pedido/${order.trackingToken}`}>
          Seguir mi pedido
          {ShopIcons.arrow}
        </Link>
        <p className={styles.confirmHint}>Guardá ese enlace: ahí vas a ver el estado en tiempo real.</p>
      </div>
    </ShopShell>
  )
}

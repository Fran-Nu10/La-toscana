'use client'

import { useEffect, useState, type FormEvent } from 'react'
import Link from 'next/link'
import type { FulfillmentType, Order } from '@/data/types'
import { formatUyu, lineTotal } from '@/lib/order'
import { validFulfillment } from '@/services/fulfillment'
import { useCart } from './CartProvider'
import { useCommerce } from './CommerceProvider'
import styles from './Checkout.module.css'

export function Checkout() {
  const cart = useCart()
  const commerce = useCommerce()
  const [fulfillment, setFulfillment] = useState<FulfillmentType | null>(null)
  const [error, setError] = useState('')
  const [order, setOrder] = useState<Order | null>(null)
  const [savedContact, setSavedContact] = useState({name:'',phone:''})

  useEffect(() => {
    if (commerce.ready) setFulfillment(current => validFulfillment(commerce.settings, current ?? undefined))
  }, [commerce.ready, commerce.settings])

  useEffect(()=>{try{setSavedContact(JSON.parse(localStorage.getItem('la-toscana-contact')??'{\"name\":\"\",\"phone\":\"\"}'))}catch{}},[])

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    if (!fulfillment) return setError('No hay una modalidad de entrega habilitada.')
    const form = new FormData(event.currentTarget)
    try {
      const created = commerce.placeOrder(cart.lines, {
        customer: { name: String(form.get('name')), phone: String(form.get('phone')), email: String(form.get('email') ?? '') },
        fulfillment,
        address: String(form.get('address') ?? ''),
        notes: String(form.get('notes') ?? ''),
      })
      if(form.get('remember')==='on')localStorage.setItem('la-toscana-contact',JSON.stringify({name:String(form.get('name')),phone:String(form.get('phone'))}));else localStorage.removeItem('la-toscana-contact')
      setOrder(created)
      cart.clear()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'No pudimos crear el pedido.')
    }
  }

  if (order) return <main className={styles.shell}><section className={styles.confirm}><p className="kicker">Pedido recibido</p><h1>¡Gracias!</h1><p className={styles.orderNumber}>Pedido <strong>#{order.number}</strong></p><div className={styles.confirmFacts}><span>{order.fulfillment==='delivery'?'Delivery':'Retiro en el local'}</span><strong>{formatUyu(order.totalCents)}</strong></div><div className={styles.shortSummary}>{order.items.slice(0,3).map((item,index)=><p key={`${item.productId}-${index}`}>{item.quantity} × {item.productName}</p>)}</div><Link className="btn btnPrimary" href={`/pedido/${order.trackingToken}`}>Seguir mi pedido →</Link><p className={styles.hint}>Guardá este enlace para consultar el estado.</p></section></main>
  const fee = fulfillment === 'delivery' ? commerce.settings.deliveryFeeCents : 0
  return <main className={styles.shell}>
    <Link href="/#menu" className="ruleLink">← Volver a la carta</Link><h1>Finalizar pedido</h1><ol className={styles.steps}><li>1 · Contacto</li><li>2 · Entrega</li><li>3 · Resumen</li></ol>
    {!commerce.ready ? <p>Cargando configuración…</p> : !commerce.settings.orderingOpen ? <p>Los pedidos están cerrados. Horario: {commerce.settings.orderHours}</p> : !cart.lines.length ? <p>Tu carrito está vacío.</p> : <form onSubmit={submit}>
      <section><p className={styles.stepLabel}>Paso 1</p><h2>Datos de contacto</h2><label>Nombre completo<input required minLength={2} name="name" autoComplete="name" defaultValue={savedContact.name} /></label><label>Teléfono<input required minLength={6} name="phone" inputMode="tel" autoComplete="tel" defaultValue={savedContact.phone} /></label><label>Email (opcional)<input name="email" type="email" autoComplete="email" /></label><label className={styles.remember}><input type="checkbox" name="remember" defaultChecked={!!savedContact.name}/> Recordar nombre y teléfono en este dispositivo</label></section>
      <section><p className={styles.stepLabel}>Paso 2</p><h2>Entrega</h2><div className={styles.choice}>{commerce.settings.pickupEnabled && <label><input type="radio" checked={fulfillment === 'pickup'} onChange={() => setFulfillment('pickup')} /> Retiro en el local</label>}{commerce.settings.deliveryEnabled && <label><input type="radio" checked={fulfillment === 'delivery'} onChange={() => setFulfillment('delivery')} /> Delivery</label>}</div>
        {!fulfillment && <p role="alert" className={styles.error}>No hay modalidades de entrega habilitadas.</p>}
        {fulfillment === 'pickup' && <div className={styles.fulfillmentInfo}><strong>Retirá en</strong><span>{commerce.settings.address}</span></div>}{fulfillment === 'delivery' && <><div className={styles.fulfillmentInfo}><strong>Delivery</strong><span>Costo {formatUyu(fee)} · Pedido mínimo {formatUyu(commerce.settings.deliveryMinimumCents)}</span></div><label>Dirección completa<input required name="address" autoComplete="street-address" placeholder="Calle, número y referencias" /></label></>}
        <label>Observaciones generales<textarea name="notes" maxLength={500} /></label></section>
      <section><p className={styles.stepLabel}>Paso 3</p><h2>Resumen</h2>{cart.lines.map(line => <div className={styles.summary} key={line.key}><span>{line.quantity} × {line.name}{line.selections.map(choice => <small key={choice.choiceId}> · {choice.name}</small>)}</span><span>{formatUyu(lineTotal(line))}</span></div>)}{fee > 0 && <div className={styles.summary}><span>Delivery</span><span>{formatUyu(fee)}</span></div>}<div className={styles.total}><strong>Total</strong><strong>{formatUyu(cart.total + fee)}</strong></div><p className={styles.hint}>{commerce.settings.orderHours} · Pago al recibir o retirar.</p>{error && <p role="alert" className={styles.error}>{error}</p>}<button className="btn btnPrimary" disabled={!fulfillment}>Confirmar pedido</button></section>
    </form>}
  </main>
}

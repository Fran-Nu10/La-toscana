'use client'

import Link from 'next/link'
import { useCart } from './CartProvider'
import { formatUyu } from '@/lib/order'
import styles from './Cart.module.css'

export function Cart() {
  const cart = useCart()
  return <>
    <button type="button" className={styles.fab} onClick={() => cart.setOpen(true)} aria-label={`Abrir carrito, ${cart.count} productos`}>
      Pedido <span>{cart.count}</span>
    </button>
    {cart.open && <div className={styles.backdrop} onClick={() => cart.setOpen(false)} />}
    <aside className={`${styles.drawer} ${cart.open ? styles.open : ''}`} aria-hidden={!cart.open} aria-label="Carrito">
      <header><div><p className="kicker">Tu pedido</p><h2>Carrito</h2></div><button type="button" onClick={() => cart.setOpen(false)} aria-label="Cerrar">×</button></header>
      <div className={styles.lines}>
        {!cart.lines.length && <p>Tu carrito está vacío. Elegí algo de la carta.</p>}
        {cart.lines.map(line => <article key={line.key}>
          <div className={styles.lineHead}><strong>{line.name}</strong><span>{formatUyu(line.unitPriceCents * line.quantity)}</span></div>
          <div className={styles.controls}><button onClick={() => cart.quantity(line.key, line.quantity - 1)} aria-label="Quitar uno">−</button><span>{line.quantity}</span><button onClick={() => cart.quantity(line.key, line.quantity + 1)} aria-label="Agregar uno">+</button><button className={styles.remove} onClick={() => cart.remove(line.key)}>Eliminar</button></div>
          <label>Observaciones<input value={line.notes} maxLength={300} placeholder="Sin cebolla, bien cocido…" onChange={event => cart.notes(line.key, event.target.value)} /></label>
        </article>)}
      </div>
      {!!cart.lines.length && <footer><div><span>Total</span><strong>{formatUyu(cart.total)}</strong></div><Link href="/checkout" className="btn btnPrimary" onClick={() => cart.setOpen(false)}>Continuar</Link></footer>}
    </aside>
  </>
}

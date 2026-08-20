'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useCart } from './CartProvider'
import { useCommerce } from './CommerceProvider'
import { formatUyu, lineTotal } from '@/lib/order'
import { ProductConfigurator } from './ProductConfigurator'
import styles from './Cart.module.css'

export function Cart() {
  const cart = useCart(); const commerce = useCommerce(); const [editingKey,setEditingKey]=useState<string|null>(null)
  const editingLine=cart.lines.find(line=>line.key===editingKey); const editingProduct=commerce.products.find(product=>product.id===editingLine?.productId)
  return <><button type="button" className={styles.fab} onClick={() => cart.setOpen(true)} aria-label={`Abrir carrito, ${cart.count} productos`}>Pedido <span>{cart.count}</span></button>{cart.open && <div className={styles.backdrop} onClick={() => cart.setOpen(false)} />}<aside className={`${styles.drawer} ${cart.open ? styles.open : ''}`} aria-hidden={!cart.open} aria-label="Carrito"><header><div><p className="kicker">Tu pedido</p><h2>Carrito</h2></div><button type="button" onClick={() => cart.setOpen(false)} aria-label="Cerrar">×</button></header><div className={styles.lines}>{!cart.lines.length && <p>Tu carrito está vacío. Elegí algo de la carta.</p>}{cart.lines.map(line => <article key={line.key}><div className={styles.lineHead}><strong>{line.name}</strong><span>{formatUyu(lineTotal(line))}</span></div>{!!line.selections.length && <ul className={styles.variants}>{line.selections.map(choice => <li key={choice.choiceId}>{choice.name}{choice.priceCents ? ` (+${formatUyu(choice.priceCents)})` : ''}</li>)}</ul>}{line.notes && <p className={styles.notes}>“{line.notes}”</p>}<div className={styles.controls}><button onClick={() => cart.quantity(line.key, line.quantity - 1)} aria-label="Quitar uno">−</button><span>{line.quantity}</span><button onClick={() => cart.quantity(line.key, line.quantity + 1)} aria-label="Agregar uno">+</button><button className={styles.remove} onClick={() => cart.remove(line.key)}>Eliminar</button></div><button className={styles.edit} type="button" onClick={() => setEditingKey(line.key)}>Editar producto</button></article>)}</div>{!!cart.lines.length && <footer><div><span>Subtotal</span><strong>{formatUyu(cart.total)}</strong></div><Link href="/checkout" className="btn btnPrimary" onClick={() => cart.setOpen(false)}>Continuar al checkout</Link></footer>}</aside>{editingLine && editingProduct && <ProductConfigurator line={editingLine} product={editingProduct} onClose={()=>setEditingKey(null)} onConfirm={(selections,quantity,notes)=>cart.update(editingLine.key,editingProduct,selections,quantity,notes)}/>}</>
}

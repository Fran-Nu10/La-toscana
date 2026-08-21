'use client'

import { useRef, useState } from 'react'
import type { SiteContent } from '@/content'
import type { Product } from '@/data/types'
import { formatUyu } from '@/lib/order'
import { useCart } from './CartProvider'
import { useCommerce } from './CommerceProvider'
import styles from './Menu.module.css'
import shop from './shop/shop.module.css'
import { ShopIcons } from './shop/icons'
import { ProductSheet } from './shop/ProductSheet'

function nextIndex(key: string, current: number, total: number) { if (key === 'ArrowDown' || key === 'ArrowRight') return (current + 1) % total; if (key === 'ArrowUp' || key === 'ArrowLeft') return (current - 1 + total) % total; if (key === 'Home') return 0; if (key === 'End') return total - 1; return null }
/** Una fila de la carta: el botón ocupa la fila entera y abre el mismo detalle
 *  de producto que la tarjeta con foto. */
function CartaRow({ product, onOpen }: { product: Product; onOpen(product: Product): void }) {
  return (
    <li className={styles.item}>
      <button
        type="button"
        className={shop.row}
        onClick={() => onOpen(product)}
        aria-label={`${product.name}, ${formatUyu(product.priceCents)}. Ver el plato`}
      >
        <span className={styles.itemRow}>
          <span className={styles.itemName}>{product.name}</span>
          <span className={styles.leader} aria-hidden="true" />
          <span className={`${styles.itemPrice} tnum`}>{formatUyu(product.priceCents)}</span>
          <span className={styles.itemGo} aria-hidden="true">
            {ShopIcons.plus}
          </span>
        </span>
        {product.description && (
          <span className={styles.itemDescription}>{product.description}</span>
        )}
        {product.options.length > 0 && (
          <span className={styles.customize}>
            {product.options.length} {product.options.length === 1 ? 'opción' : 'opciones'} a elección
          </span>
        )}
      </button>
    </li>
  )
}
export function Menu({ menu }: { menu: SiteContent['menu'] }) {
  const commerce = useCommerce(); const cart = useCart(); const [openProduct, setOpenProduct] = useState<Product | null>(null); const visible = commerce.categories.filter(category => category.available && commerce.products.some(product => product.categoryId === category.id && product.available)); const [activeId, setActiveId] = useState<string>(); const active = visible.find(category => category.id === activeId) ?? visible[0]; const tabsRef = useRef<HTMLDivElement>(null)
  function onKeyDown(event: React.KeyboardEvent, index: number) { const target = nextIndex(event.key, index, visible.length); if (target === null) return; event.preventDefault(); setActiveId(visible[target].id); tabsRef.current?.querySelector<HTMLButtonElement>(`#cat-${visible[target].id}`)?.focus() }
  return <section id="menu" className={styles.section}><div className={styles.inner}><div className={styles.head}><p className="kicker kicker--dark">{menu.kicker}</p><h2 className="sectionTitle sectionTitle--dark">{menu.title}</h2><p className={styles.body}>{menu.body}</p><div className={styles.categories} role="tablist" aria-label="Categorías de la carta" ref={tabsRef}>{visible.map((category,index) => { const isActive=category.id===active?.id; return <button key={category.id} type="button" role="tab" id={`cat-${category.id}`} aria-selected={isActive} aria-controls="carta" tabIndex={isActive?0:-1} className={`${styles.category} ${isActive?styles.categoryActive:''}`} onClick={()=>setActiveId(category.id)} onKeyDown={event=>onKeyDown(event,index)}><span className={styles.categoryName}>{category.name}</span><span className={`${styles.categoryCount} tnum`}>{String(commerce.products.filter(product=>product.categoryId===category.id&&product.available).length).padStart(2,'0')}</span></button>})}</div></div>{active && <div className={styles.card} id="carta" role="tabpanel" aria-labelledby={`cat-${active.id}`}><div className={styles.cardHead}><span className={styles.cardTitle}>{active.name}</span><span className={styles.cardMark}>La Toscana</span></div><ul className={styles.items}>{commerce.products.filter(product=>product.categoryId===active.id&&product.available).map(product=><CartaRow product={product} onOpen={setOpenProduct} key={product.id}/>)}</ul></div>}</div>{openProduct && <ProductSheet product={openProduct} orderingOpen={commerce.settings.orderingOpen} onClose={() => setOpenProduct(null)} onConfirm={(selections, quantity, notes) => cart.add(openProduct, selections, quantity, notes, false)} />}</section>
}

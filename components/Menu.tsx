'use client'

import { useEffect, useRef, useState } from 'react'
import type { SiteContent } from '@/content'
import type { Product } from '@/data/types'
import { formatUyu } from '@/lib/order'
import { useCart } from './CartProvider'
import { useCommerce } from './CommerceProvider'
import styles from './Menu.module.css'
import { ProductConfigurator } from './ProductConfigurator'

function nextIndex(key: string, current: number, total: number) { if (key === 'ArrowDown' || key === 'ArrowRight') return (current + 1) % total; if (key === 'ArrowUp' || key === 'ArrowLeft') return (current - 1 + total) % total; if (key === 'Home') return 0; if (key === 'End') return total - 1; return null }
function BuyProduct({ product }: { product: Product }) {
  const cart = useCart(); const [configuring, setConfiguring] = useState(false); const [added, setAdded] = useState(false)
  useEffect(() => { if (!added) return; const timer=setTimeout(()=>setAdded(false),1800); return()=>clearTimeout(timer) }, [added])
  function simpleAdd(){cart.add(product,[],1,'',false);setAdded(true)}
  return <div className={`${styles.item} ${product.options.length ? styles.configurable : ''}`} onClick={() => product.options.length && setConfiguring(true)}>
    <div className={styles.itemRow}><span className={styles.itemName}>{product.name}</span><span className={styles.leader} aria-hidden="true"/><span className={`${styles.itemPrice} tnum`}>{formatUyu(product.priceCents)}</span></div>
    <div className={styles.itemDescription}>{product.description}</div>
    {!!product.options.length && <p className={styles.customize}>Personalizable · {product.options.length} {product.options.length === 1 ? 'opción' : 'opciones'}</p>}
    <button type="button" className={`${styles.add} ${added ? styles.added : ''}`} onClick={event => {event.stopPropagation();product.options.length?setConfiguring(true):simpleAdd()}}>{added ? '✓ Agregado' : product.options.length ? 'Elegir opciones' : '+ Agregar'}</button>
    {configuring && <ProductConfigurator product={product} onClose={()=>setConfiguring(false)} onConfirm={(selections,quantity,notes)=>{cart.add(product,selections,quantity,notes,false);setAdded(true)}}/>}
  </div>
}
export function Menu({ menu }: { menu: SiteContent['menu'] }) {
  const commerce = useCommerce(); const visible = commerce.categories.filter(category => category.available && commerce.products.some(product => product.categoryId === category.id && product.available)); const [activeId, setActiveId] = useState<string>(); const active = visible.find(category => category.id === activeId) ?? visible[0]; const tabsRef = useRef<HTMLDivElement>(null)
  function onKeyDown(event: React.KeyboardEvent, index: number) { const target = nextIndex(event.key, index, visible.length); if (target === null) return; event.preventDefault(); setActiveId(visible[target].id); tabsRef.current?.querySelector<HTMLButtonElement>(`#cat-${visible[target].id}`)?.focus() }
  return <section id="menu" className={styles.section}><div className={styles.inner}><div className={styles.head}><p className="kicker kicker--dark">{menu.kicker}</p><h2 className="sectionTitle sectionTitle--dark">{menu.title}</h2><p className={styles.body}>{menu.body}</p><div className={styles.categories} role="tablist" aria-label="Categorías de la carta" ref={tabsRef}>{visible.map((category,index) => { const isActive=category.id===active?.id; return <button key={category.id} type="button" role="tab" id={`cat-${category.id}`} aria-selected={isActive} aria-controls="carta" tabIndex={isActive?0:-1} className={`${styles.category} ${isActive?styles.categoryActive:''}`} onClick={()=>setActiveId(category.id)} onKeyDown={event=>onKeyDown(event,index)}><span className={styles.categoryName}>{category.name}</span><span className={`${styles.categoryCount} tnum`}>{String(commerce.products.filter(product=>product.categoryId===category.id&&product.available).length).padStart(2,'0')}</span></button>})}</div></div>{active && <div className={styles.card} id="carta" role="tabpanel" aria-labelledby={`cat-${active.id}`}><div className={styles.cardHead}><span className={styles.cardTitle}>{active.name}</span><span className={styles.cardMark}>La Toscana</span></div><div>{commerce.products.filter(product=>product.categoryId===active.id&&product.available).map(product=><BuyProduct product={product} key={product.id}/>)}</div></div>}</div></section>
}

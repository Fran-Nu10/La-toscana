'use client'

import { useRef, useState } from 'react'
import type { SiteContent } from '@/content'
import type { Product } from '@/data/types'
import { formatUyu } from '@/lib/order'
import { useCart } from './CartProvider'
import { useCommerce } from './CommerceProvider'
import styles from './Menu.module.css'
import { useCart } from './CartProvider'

function nextIndex(key: string, current: number, total: number) { if (key === 'ArrowDown' || key === 'ArrowRight') return (current + 1) % total; if (key === 'ArrowUp' || key === 'ArrowLeft') return (current - 1 + total) % total; if (key === 'Home') return 0; if (key === 'End') return total - 1; return null }
function BuyProduct({ product }: { product: Product }) {
  const cart = useCart(); const [selected, setSelected] = useState<Record<string, string>>({})
  const missing = product.options.some(option => option.required && !selected[option.id])
  return <div className={styles.item}>
    <div className={styles.itemRow}><span className={styles.itemName}>{product.name}</span><span className={styles.leader} aria-hidden="true"/><span className={`${styles.itemPrice} tnum`}>{formatUyu(product.priceCents)}</span></div>
    <div className={styles.itemDescription}>{product.description}</div>
    {product.options.map(option => <label className={styles.option} key={option.id}>{option.name}{option.required && ' *'}<select value={selected[option.id] ?? ''} onChange={event => setSelected(value => ({ ...value, [option.id]: event.target.value }))}><option value="">Elegir</option>{option.choices.filter(choice => choice.available).map(choice => <option key={choice.id} value={choice.id}>{choice.name}{choice.priceDeltaCents ? ` (+${formatUyu(choice.priceDeltaCents)})` : ''}</option>)}</select></label>)}
    <button type="button" className={styles.add} disabled={missing} onClick={() => cart.add(product, Object.entries(selected).map(([optionId, choiceId]) => ({ optionId, choice: product.options.find(option => option.id === optionId)!.choices.find(choice => choice.id === choiceId)! })))}>{missing ? 'Elegí las opciones' : 'Agregar al pedido'}</button>
  </div>
}
export function Menu({ menu }: { menu: SiteContent['menu'] }) {
 codex/auditar-repositorio-y-proponer-arquitectura-backend-v5kzc4
  const commerce = useCommerce(); const visible = commerce.categories.filter(category => category.available && commerce.products.some(product => product.categoryId === category.id && product.available)); const [activeId, setActiveId] = useState<string>(); const active = visible.find(category => category.id === activeId) ?? visible[0]; const tabsRef = useRef<HTMLDivElement>(null)
  function onKeyDown(event: React.KeyboardEvent, index: number) { const target = nextIndex(event.key, index, visible.length); if (target === null) return; event.preventDefault(); setActiveId(visible[target].id); tabsRef.current?.querySelector<HTMLButtonElement>(`#cat-${visible[target].id}`)?.focus() }
  return <section id="menu" className={styles.section}><div className={styles.inner}><div className={styles.head}><p className="kicker kicker--dark">{menu.kicker}</p><h2 className="sectionTitle sectionTitle--dark">{menu.title}</h2><p className={styles.body}>{menu.body}</p><div className={styles.categories} role="tablist" aria-label="Categorías de la carta" ref={tabsRef}>{visible.map((category,index) => { const isActive=category.id===active?.id; return <button key={category.id} type="button" role="tab" id={`cat-${category.id}`} aria-selected={isActive} aria-controls="carta" tabIndex={isActive?0:-1} className={`${styles.category} ${isActive?styles.categoryActive:''}`} onClick={()=>setActiveId(category.id)} onKeyDown={event=>onKeyDown(event,index)}><span className={styles.categoryName}>{category.name}</span><span className={`${styles.categoryCount} tnum`}>{String(commerce.products.filter(product=>product.categoryId===category.id&&product.available).length).padStart(2,'0')}</span></button>})}</div></div>{active && <div className={styles.card} id="carta" role="tabpanel" aria-labelledby={`cat-${active.id}`}><div className={styles.cardHead}><span className={styles.cardTitle}>{active.name}</span><span className={styles.cardMark}>La Toscana</span></div><div>{commerce.products.filter(product=>product.categoryId===active.id&&product.available).map(product=><BuyProduct product={product} key={product.id}/>)}</div></div>}</div></section>

  const cart = useCart()
  const [activeId, setActiveId] = useState(menu.categories[0]?.id)
  const active = menu.categories.find((category) => category.id === activeId) ?? menu.categories[0]
  const tabsRef = useRef<HTMLDivElement>(null)

  function onKeyDown(event: React.KeyboardEvent, index: number) {
    const target = nextIndex(event.key, index, menu.categories.length)
    if (target === null) return
    event.preventDefault()
    const category = menu.categories[target]
    setActiveId(category.id)
    tabsRef.current?.querySelector<HTMLButtonElement>(`#cat-${category.id}`)?.focus()
  }

  return (
    <section id="menu" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.head}>
          <p className="kicker kicker--dark">{menu.kicker}</p>
          <h2 className="sectionTitle sectionTitle--dark">{menu.title}</h2>
          <p className={styles.body}>{menu.body}</p>

          <div
            className={styles.categories}
            role="tablist"
            aria-label="Categorías de la carta"
            ref={tabsRef}
          >
            {menu.categories.map((category, index) => {
              const isActive = category.id === active.id
              return (
                <button
                  key={category.id}
                  type="button"
                  role="tab"
                  id={`cat-${category.id}`}
                  aria-selected={isActive}
                  aria-controls="carta"
                  tabIndex={isActive ? 0 : -1}
                  className={`${styles.category} ${isActive ? styles.categoryActive : ''}`}
                  onClick={() => setActiveId(category.id)}
                  onKeyDown={(event) => onKeyDown(event, index)}
                >
                  <span className={styles.categoryName}>{category.name}</span>
                  <span className={`${styles.categoryCount} tnum`}>
                    {String(category.items.length).padStart(2, '0')}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div className={styles.card} id="carta" role="tabpanel" aria-labelledby={`cat-${active.id}`}>
          <div className={styles.cardHead}>
            <span className={styles.cardTitle}>{active.name}</span>
            <span className={styles.cardMark}>La Toscana</span>
          </div>

          <div>
            {active.items.map((item) => (
              <div key={item.name} className={styles.item}>
                <div className={styles.itemRow}>
                  <span className={styles.itemName}>{item.name}</span>
                  <span className={styles.leader} aria-hidden="true" />
                  <span className={`${styles.itemPrice} tnum`}>{item.price}</span>
                </div>
                <div className={styles.itemDescription}>{item.description}</div>
                <button type="button" className={styles.add} disabled={item.available === false} onClick={() => cart.add(item)}>{item.available === false ? 'No disponible' : 'Agregar al pedido'}</button>
              </div>
            ))}
          </div>

          <div className={styles.cardFoot}>
            <a href={menu.downloadHref} className={`btn ${styles.download}`}>
              {menu.downloadLabel}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
 main
}

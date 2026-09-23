'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { SiteContent } from '@/content'
import type { Product } from '@/data/types'
import { formatUyu } from '@/lib/order'
import { productPhoto } from '@/content/productPhotos'
import { useCart } from './CartProvider'
import { useCommerce } from './CommerceProvider'
import { Photo } from './Photo'
import { ShopIcons } from './shop/icons'
import { ProductSheet } from './shop/ProductSheet'
import styles from './Menu.module.css'

/** Una fila de la carta: foto chica, nombre, descripción, precio y el `+`.
 *  Toda la fila es el control y abre el mismo detalle que la tarjeta. */
function MenuRow({ product, onOpen }: { product: Product; onOpen(product: Product): void }) {
  const photo = productPhoto(product.id)
  const options = product.options.length
  return (
    <li className={styles.item}>
      <button
        type="button"
        className={styles.row}
        onClick={() => onOpen(product)}
        aria-label={`${product.name}, ${formatUyu(product.priceCents)}. Ver el plato`}
      >
        <span className={styles.thumb} aria-hidden="true">
          {photo ? (
            <Photo photo={photo} sizes="88px" />
          ) : (
            <span className={styles.thumbFallback}>{ShopIcons.plate}</span>
          )}
        </span>
        <span className={styles.rowBody}>
          <span className={styles.rowTop}>
            <span className={styles.rowName}>{product.name}</span>
            <span className={`${styles.rowPrice} tnum`}>{formatUyu(product.priceCents)}</span>
          </span>
          {product.description && (
            <span className={styles.rowDescription}>{product.description}</span>
          )}
          {options > 0 && (
            <span className={styles.rowMeta}>
              {options === 1 ? 'Con opciones a elección' : `${options} opciones a elección`}
            </span>
          )}
        </span>
        <span className={styles.rowPlus} aria-hidden="true">
          {ShopIcons.plus}
        </span>
      </button>
    </li>
  )
}

/**
 * La carta digital. Todas las categorías se leen de corrido —nadie tiene que
 * "cambiar de pestaña" para ver qué hay— y un riel de chips pegajoso marca en
 * qué categoría estás y salta a cualquier otra.
 */
export function Menu({ menu }: { menu: SiteContent['menu'] }) {
  const commerce = useCommerce()
  const cart = useCart()
  const [openProduct, setOpenProduct] = useState<Product | null>(null)
  const [activeId, setActiveId] = useState<string>()
  const railRef = useRef<HTMLDivElement>(null)

  const groups = useMemo(
    () =>
      commerce.categories
        .filter((category) => category.available)
        .map((category) => ({
          category,
          products: commerce.products.filter(
            (product) => product.categoryId === category.id && product.available,
          ),
        }))
        .filter((group) => group.products.length > 0),
    [commerce.categories, commerce.products],
  )

  const active = activeId ?? groups[0]?.category.id

  // Scrollspy: la categoría que cruza el tercio superior de la pantalla manda.
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined' || groups.length === 0) return
    const nodes = groups
      .map((group) => document.getElementById(`carta-${group.category.id}`))
      .filter((node): node is HTMLElement => Boolean(node))
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (hit) setActiveId(hit.target.id.replace('carta-', ''))
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: 0 },
    )
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [groups])

  // El chip activo se mantiene a la vista dentro del riel.
  useEffect(() => {
    if (!active || !railRef.current) return
    const chip = railRef.current.querySelector<HTMLElement>(`[data-id="${active}"]`)
    if (!chip) return
    const rail = railRef.current
    const left = chip.offsetLeft - rail.clientWidth / 2 + chip.clientWidth / 2
    rail.scrollTo({ left, behavior: 'smooth' })
  }, [active])

  const jump = (id: string) => {
    setActiveId(id)
    document.getElementById(`carta-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section id="menu" className={styles.section}>
      <div className={`container ${styles.head}`}>
        <div className="sectionHead">
          <p className="kicker">{menu.kicker}</p>
          <h2 className="title">{menu.title}</h2>
          <p className="lede">{menu.body}</p>
        </div>
      </div>

      {groups.length === 0 ? (
        <div className="container">
          <p className={`notice ${styles.empty}`}>
            {ShopIcons.alert}
            La carta se está actualizando. Volvé a mirar en un rato.
          </p>
        </div>
      ) : (
        <>
          <div className={styles.sticky}>
            <div className={`container ${styles.railWrap}`}>
              <div
                className={`rail ${styles.rail}`}
                ref={railRef}
                role="navigation"
                aria-label="Categorías de la carta"
              >
                {groups.map(({ category, products }) => (
                  <button
                    key={category.id}
                    type="button"
                    data-id={category.id}
                    className="chip"
                    aria-current={active === category.id ? 'true' : undefined}
                    onClick={() => jump(category.id)}
                  >
                    {category.name}
                    <span className={`${styles.chipCount} tnum`}>{products.length}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className={`container ${styles.groups}`}>
            {groups.map(({ category, products }) => (
              <div key={category.id} id={`carta-${category.id}`} className={styles.group}>
                <div className={styles.groupHead}>
                  <h3 className={styles.groupTitle}>{category.name}</h3>
                  <span className={styles.groupCount}>
                    {products.length} {products.length === 1 ? 'plato' : 'platos'}
                  </span>
                </div>
                <ul className={styles.items}>
                  {products.map((product) => (
                    <MenuRow product={product} onOpen={setOpenProduct} key={product.id} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </>
      )}

      {openProduct && (
        <ProductSheet
          product={openProduct}
          orderingOpen={commerce.settings.orderingOpen}
          onClose={() => setOpenProduct(null)}
          onConfirm={(selections, quantity, notes) =>
            cart.add(openProduct, selections, quantity, notes, false)
          }
        />
      )}
    </section>
  )
}

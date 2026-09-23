'use client'

import { useMemo, useState } from 'react'
import type { SiteContent } from '@/content'
import type { Product } from '@/data/types'
import { useCart } from './CartProvider'
import { useCommerce } from './CommerceProvider'
import { ProductCard } from './shop/ProductCard'
import { ProductSheet } from './shop/ProductSheet'
import { ShopIcons } from './shop/icons'
import styles from './Dishes.module.css'

/**
 * "Platos de la casa": el catálogo con fotos, directo del provider, así el
 * precio y la disponibilidad son los que el restaurante carga en el panel.
 *
 * Teléfono: riel con scroll-snap y la tarjeta siguiente asomando. Desde 640px
 * es una grilla que crece hasta cuatro columnas. "Ver más" trae el resto.
 */
export function Dishes({ dishes }: { dishes: SiteContent['dishes'] }) {
  const commerce = useCommerce()
  const cart = useCart()
  const [shown, setShown] = useState(dishes.initialCount)
  const [openProduct, setOpenProduct] = useState<Product | null>(null)

  const catalogue = useMemo(() => {
    const visibleCategories = new Set(
      commerce.categories.filter((category) => category.available).map((category) => category.id),
    )
    return commerce.products.filter((product) => visibleCategories.has(product.categoryId))
  }, [commerce.categories, commerce.products])

  const visible = catalogue.slice(0, shown)
  const hasMore = shown < catalogue.length

  return (
    <section id="platos" className={`section ${styles.section}`}>
      <div className="container">
        <div className="sectionHead sectionHead--split">
          <div className={styles.headText}>
            <p className="kicker">Lo más pedido</p>
            <h2 className="title">{dishes.title}</h2>
          </div>
          <a href="#menu" className="textLink">
            {dishes.menuLinkLabel}
            {ShopIcons.arrow}
          </a>
        </div>
      </div>

      <div className={`container ${styles.railWrap}`}>
        <ul className={`rail ${styles.cards}`}>
          {visible.map((product, index) => (
            <li
              key={product.id}
              className={styles.card}
              data-fresh={index >= dishes.initialCount ? '' : undefined}
              style={
                index >= dishes.initialCount
                  ? { animationDelay: `${((index - dishes.initialCount) % dishes.step) * 70}ms` }
                  : undefined
              }
            >
              <ProductCard
                product={product}
                sizes="(min-width: 1200px) 300px, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 76vw"
                onOpen={setOpenProduct}
              />
            </li>
          ))}
        </ul>
      </div>

      {hasMore && (
        <div className={`container ${styles.more}`}>
          <button
            type="button"
            className="btn btn--secondary btn--lg"
            onClick={() => setShown((value) => Math.min(catalogue.length, value + dishes.step))}
          >
            {dishes.loadMoreLabel}
            <span className={`${styles.moreCount} tnum`}>{catalogue.length - shown}</span>
          </button>
        </div>
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

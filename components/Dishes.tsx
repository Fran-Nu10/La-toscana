'use client'

import { useMemo, useState } from 'react'
import type { SiteContent } from '@/content'
import type { Product } from '@/data/types'
import { useCart } from './CartProvider'
import { useCommerce } from './CommerceProvider'
import { ProductCard } from './shop/ProductCard'
import { ProductSheet } from './shop/ProductSheet'
import styles from './Dishes.module.css'

/**
 * "Platos de la casa" — el catálogo con fotos.
 *
 * Antes eran tarjetas de contenido estático: linda foto, precio escrito a mano
 * y ningún comportamiento al tocarlas. Ahora salen del catálogo real, así que
 * el precio y la disponibilidad son los que el dueño carga en el panel, y cada
 * tarjeta abre el detalle del producto.
 *
 * El envoltorio no cambia: riel con scroll-snap en teléfono, grilla de dos y
 * después cuatro columnas, y "cargar más" para el resto.
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
    <section id="platos" className={styles.section}>
      <div className={styles.head}>
        <h2 className="sectionTitle sectionTitle--flush">{dishes.title}</h2>
        <a href="#menu" className="ruleLink">
          {dishes.menuLinkLabel}
        </a>
      </div>

      <ul className={styles.cards}>
        {visible.map((product, index) => (
          <li
            key={product.id}
            className={styles.card}
            /* Las tarjetas que trae el botón entran una detrás de otra. */
            data-fresh={index >= dishes.initialCount ? '' : undefined}
            style={
              index >= dishes.initialCount
                ? { animationDelay: `${((index - dishes.initialCount) % dishes.step) * 80}ms` }
                : undefined
            }
          >
            <ProductCard
              product={product}
              sizes="(min-width: 1200px) 300px, (min-width: 600px) 45vw, 78vw"
              onOpen={setOpenProduct}
            />
          </li>
        ))}
      </ul>

      {hasMore && (
        <div className={styles.more}>
          <button
            type="button"
            className={`btn btn-secondary ${styles.moreButton}`}
            onClick={() => setShown((value) => Math.min(catalogue.length, value + dishes.step))}
          >
            {dishes.loadMoreLabel}
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

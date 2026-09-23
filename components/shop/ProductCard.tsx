'use client'

import type { Product } from '@/data/types'
import { formatUyu } from '@/lib/order'
import { productPhoto } from '@/content/productPhotos'
import { Photo } from '../Photo'
import { ShopIcons } from './icons'
import styles from './shop.module.css'

/**
 * Tarjeta del catálogo: la foto manda.
 *
 * Toda la tarjeta se puede tocar: el botón del nombre se estira por encima de
 * la tarjeta entera con un ::after, así foto, precio y descripción son zona
 * clickeable, pero para el teclado y el lector de pantalla hay un solo control.
 */
export function ProductCard({
  product,
  sizes,
  onOpen,
}: {
  product: Product
  sizes: string
  onOpen(product: Product): void
}) {
  const photo = productPhoto(product.id)
  const optionCount = product.options.length

  return (
    <article className={`${styles.scope} ${styles.card} ${!product.available ? styles.cardUnavailable : ''}`}>
      <div className={styles.cardMedia}>
        {photo ? (
          <Photo photo={photo} sizes={sizes} />
        ) : (
          <div className={styles.mediaFallback} aria-hidden="true">
            {ShopIcons.plate}
          </div>
        )}
        {!product.available ? (
          <span className={`badge badge--glass ${styles.cardBadge}`}>Sin stock hoy</span>
        ) : optionCount > 0 ? (
          <span className={`badge badge--glass ${styles.cardBadge}`}>A elección</span>
        ) : null}
        <span className={styles.cardPlus} aria-hidden="true">
          {ShopIcons.plus}
        </span>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.cardNameRow}>
          <h3 className={styles.cardName}>
            <button
              type="button"
              className={styles.cardLink}
              onClick={() => onOpen(product)}
              aria-label={`${product.name}, ${formatUyu(product.priceCents)}${
                product.available ? '' : ', sin stock'
              }. Ver el plato`}
            >
              {product.name}
            </button>
          </h3>
          <span className={`${styles.cardPrice} tnum`}>{formatUyu(product.priceCents)}</span>
        </div>
        {product.description && <p className={styles.cardDescription}>{product.description}</p>}
      </div>
    </article>
  )
}

'use client'

import type { Product } from '@/data/types'
import { formatUyu } from '@/lib/order'
import { productPhoto } from '@/content/productPhotos'
import { Photo } from '../Photo'
import { ShopIcons } from './icons'
import styles from './shop.module.css'

/**
 * Tarjeta del catálogo.
 *
 * Toda la tarjeta se puede tocar: el botón del nombre se estira por encima de
 * la tarjeta entera con un ::after, así foto, precio y descripción son zona
 * clickeable, pero para el teclado y el lector de pantalla hay un solo control.
 * Antes había que apuntarle a un botón chico "Agregar" y la tarjeta no hacía
 * nada al tocarla.
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
    <div
      className={`${styles.scope} ${styles.card} ${
        !product.available ? styles.cardUnavailable : ''
      }`}
    >
      <div className={`plate ${styles.cardMedia}`}>
        {photo ? (
          <Photo photo={photo} sizes={sizes} />
        ) : (
          <div className={styles.mediaFallback} aria-hidden="true">
            {ShopIcons.plate}
          </div>
        )}
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
              /* El lector de pantalla anuncia plato, precio y qué va a pasar;
                 el estado agotado también, porque la tarjeta igual se abre. */
              aria-label={`${product.name}, ${formatUyu(product.priceCents)}${
                product.available ? '' : ', sin stock'
              }. Ver el plato`}
            >
              {product.name}
            </button>
          </h3>
          <span className={styles.cardPrice}>{formatUyu(product.priceCents)}</span>
        </div>

        {product.description && <p className={styles.cardDescription}>{product.description}</p>}

        <div className={styles.cardMeta}>
          {!product.available ? (
            <span className={`${styles.cardBadge} ${styles.cardSoldOut}`}>Sin stock</span>
          ) : optionCount > 0 ? (
            <span className={styles.cardBadge}>
              {optionCount} {optionCount === 1 ? 'opción' : 'opciones'} a elección
            </span>
          ) : (
            <span className={styles.cardBadge}>Ver plato</span>
          )}
        </div>
      </div>
    </div>
  )
}

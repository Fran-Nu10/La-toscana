'use client'

import { useMemo, useRef, useState } from 'react'
import type { Product, ProductChoice } from '@/data/types'
import { formatUyu, type CartLine } from '@/lib/order'
import { productPhoto } from '@/content/productPhotos'
import { Photo } from '../Photo'
import { ShopIcons } from './icons'
import { useDialog } from './useDialog'
import styles from './shop.module.css'

export type SheetSelection = { optionId: string; choice: ProductChoice }

type Props = {
  product: Product
  /** Presente cuando se edita una línea del carrito: precarga la configuración. */
  line?: CartLine
  /** Los pedidos pueden estar cerrados desde el panel. */
  orderingOpen?: boolean
  onClose(): void
  onConfirm(selections: SheetSelection[], quantity: number, notes: string): void
}

const MAX_QUANTITY = 20
const MAX_NOTES = 300

/**
 * Detalle de producto: hoja inferior en teléfono, modal a dos columnas desde
 * 880px. Es la única pantalla de producto — la abren la tarjeta del catálogo,
 * la fila de la carta y el botón "Editar" del carrito, siempre con el mismo
 * estado, así no hay dos interfaces para lo mismo.
 */
export function ProductSheet({ product, line, orderingOpen = true, onClose, onConfirm }: Props) {
  const sheetRef = useRef<HTMLElement>(null)
  useDialog(sheetRef, onClose)

  const [selected, setSelected] = useState<Record<string, string>>(() =>
    Object.fromEntries(line?.selections.map((item) => [item.optionId, item.choiceId]) ?? []),
  )
  const [quantity, setQuantity] = useState(line?.quantity ?? 1)
  const [notes, setNotes] = useState(line?.notes ?? '')

  const photo = productPhoto(product.id)
  const isEditing = Boolean(line)

  const selections = useMemo<SheetSelection[]>(
    () =>
      Object.entries(selected).flatMap(([optionId, choiceId]) => {
        const choice = product.options
          .find((option) => option.id === optionId)
          ?.choices.find((item) => item.id === choiceId)
        return choice ? [{ optionId, choice }] : []
      }),
    [selected, product.options],
  )

  const missing = product.options.find((option) => option.required && !selected[option.id])
  const unitPrice =
    product.priceCents + selections.reduce((sum, item) => sum + item.choice.priceDeltaCents, 0)
  const total = unitPrice * quantity

  const soldOut = !product.available
  const blocked = soldOut || !orderingOpen || Boolean(missing)

  /** El CTA explica siempre qué falta, en vez de quedar mudo y deshabilitado. */
  const ctaLabel = soldOut
    ? 'Sin stock por hoy'
    : !orderingOpen
      ? 'Pedidos cerrados'
      : missing
        ? `Elegí ${missing.name.toLowerCase()}`
        : isEditing
          ? 'Guardar cambios'
          : 'Agregar al pedido'

  return (
    <div
      className={`${styles.scope} ${styles.backdrop}`}
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        ref={sheetRef}
        className={styles.sheet}
        role="dialog"
        aria-modal="true"
        aria-labelledby="producto-titulo"
        tabIndex={-1}
      >
        <button type="button" className={styles.close} onClick={onClose} aria-label="Cerrar">
          {ShopIcons.close}
        </button>

        <div className={styles.media}>
          {photo ? (
            <Photo photo={photo} sizes="(min-width: 880px) 490px, 100vw" />
          ) : (
            <div className={styles.mediaFallback} aria-hidden="true">
              {ShopIcons.plate}
            </div>
          )}
        </div>

        <div className={styles.column}>
          <div className={styles.scroller}>
            <div className={styles.body}>
              <div className={styles.head}>
                <p className={styles.kicker}>{isEditing ? 'Editar del pedido' : 'Del menú'}</p>
                <h2 className={styles.title} id="producto-titulo">
                  {product.name}
                </h2>
                {product.description && (
                  <p className={styles.description}>{product.description}</p>
                )}
                <p className={styles.basePrice}>
                  {formatUyu(product.priceCents)}
                  {product.options.length > 0 && (
                    <span className={styles.basePriceLabel}>precio base</span>
                  )}
                </p>
              </div>

              {soldOut && (
                <p className={`${styles.notice} ${styles.noticeWarn}`}>
                  {ShopIcons.alert}
                  Este plato no está disponible en este momento.
                </p>
              )}
              {!orderingOpen && !soldOut && (
                <p className={`${styles.notice} ${styles.noticeInfo}`}>
                  {ShopIcons.alert}
                  Ahora no estamos tomando pedidos. Podés mirar la carta igual.
                </p>
              )}

              {product.options.map((option) => (
                <fieldset className={styles.group} key={option.id}>
                  <legend className={styles.groupHead}>
                    <span className={styles.groupName}>{option.name}</span>
                    <span
                      className={`${styles.required} ${option.required ? '' : styles.optional}`}
                    >
                      {option.required ? 'Obligatorio' : 'Opcional'}
                    </span>
                  </legend>

                  <div className={styles.choices}>
                    {option.choices.map((choice) => {
                      const isSelected = selected[option.id] === choice.id
                      const disabled = !choice.available
                      return (
                        <label
                          key={choice.id}
                          className={`${styles.choice} ${isSelected ? styles.choiceSelected : ''} ${
                            disabled ? styles.choiceDisabled : ''
                          }`}
                        >
                          <input
                            className={styles.choiceInput}
                            type="radio"
                            name={`${product.id}-${option.id}`}
                            value={choice.id}
                            checked={isSelected}
                            disabled={disabled}
                            onChange={() =>
                              setSelected((current) => ({ ...current, [option.id]: choice.id }))
                            }
                          />
                          <span className={styles.dot} aria-hidden="true" />
                          <span className={styles.choiceName}>{choice.name}</span>
                          {disabled ? (
                            <span className={styles.choiceOut}>Sin stock</span>
                          ) : (
                            <span
                              className={`${styles.choicePrice} ${
                                choice.priceDeltaCents ? '' : styles.choiceIncluded
                              }`}
                            >
                              {choice.priceDeltaCents
                                ? `+ ${formatUyu(choice.priceDeltaCents)}`
                                : 'Incluido'}
                            </span>
                          )}
                        </label>
                      )
                    })}
                  </div>
                </fieldset>
              ))}

              <div className={styles.field}>
                <label className={styles.label} htmlFor="producto-notas">
                  Observaciones
                </label>
                <textarea
                  id="producto-notas"
                  className={styles.textarea}
                  value={notes}
                  maxLength={MAX_NOTES}
                  placeholder="Ej. sin cebolla, punto de cocción…"
                  onChange={(event) => setNotes(event.target.value)}
                />
                <span className={styles.counter}>
                  {notes.length}/{MAX_NOTES}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.footer}>
            <div className={styles.footerRow}>
              <div className={styles.stepper}>
                <button
                  type="button"
                  className={styles.stepperBtn}
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  disabled={quantity <= 1}
                  aria-label="Quitar uno"
                >
                  {ShopIcons.minus}
                </button>
                <span className={styles.stepperValue} aria-live="polite">
                  {quantity}
                </span>
                <button
                  type="button"
                  className={styles.stepperBtn}
                  onClick={() => setQuantity((value) => Math.min(MAX_QUANTITY, value + 1))}
                  disabled={quantity >= MAX_QUANTITY}
                  aria-label="Agregar uno"
                >
                  {ShopIcons.plus}
                </button>
              </div>

              <button
                type="button"
                className={styles.cta}
                disabled={blocked}
                onClick={() => {
                  onConfirm(selections, quantity, notes)
                  onClose()
                }}
              >
                <span>{ctaLabel}</span>
                {!blocked && <span className={styles.ctaPrice}>· {formatUyu(total)}</span>}
              </button>
            </div>

            {missing && !soldOut && orderingOpen && (
              <p className={`${styles.ctaNote} ${styles.ctaWarn}`}>
                Falta elegir {missing.name.toLowerCase()} para continuar.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

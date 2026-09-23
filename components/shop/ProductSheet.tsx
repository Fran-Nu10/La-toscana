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
 * 900px. Es la única pantalla de producto — la abren la tarjeta del catálogo,
 * la fila de la carta y "Editar" del carrito, siempre con el mismo estado.
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
        <span className={styles.handle} aria-hidden="true" />
        <button type="button" className={`iconBtn ${styles.close}`} onClick={onClose} aria-label="Cerrar">
          {ShopIcons.close}
        </button>

        <div className={styles.media}>
          {photo ? (
            <Photo photo={photo} sizes="(min-width: 900px) 440px, 100vw" />
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
                <p className={styles.kicker}>{isEditing ? 'Editar del pedido' : 'De la carta'}</p>
                <h2 className={styles.title} id="producto-titulo">
                  {product.name}
                </h2>
                {product.description && <p className={styles.description}>{product.description}</p>}
                <p className={`${styles.basePrice} tnum`}>
                  {formatUyu(product.priceCents)}
                  {product.options.length > 0 && <span className={styles.basePriceLabel}>precio base</span>}
                </p>
              </div>

              {soldOut && (
                <p className="notice notice--warn">
                  {ShopIcons.alert}
                  Este plato no está disponible en este momento.
                </p>
              )}
              {!orderingOpen && !soldOut && (
                <p className="notice">
                  {ShopIcons.alert}
                  Ahora no estamos tomando pedidos. Podés mirar la carta igual.
                </p>
              )}

              {product.options.map((option) => (
                <fieldset className={styles.group} key={option.id}>
                  <legend className={styles.groupHead}>
                    <span className={styles.groupName}>{option.name}</span>
                    <span className={`badge ${option.required ? 'badge--accent' : ''}`}>
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
                          <span className={styles.dot} aria-hidden="true">
                            {ShopIcons.check}
                          </span>
                          <span className={styles.choiceName}>{choice.name}</span>
                          {disabled ? (
                            <span className={styles.choiceOut}>Sin stock</span>
                          ) : (
                            <span
                              className={`${styles.choicePrice} tnum ${
                                choice.priceDeltaCents ? '' : styles.choiceIncluded
                              }`}
                            >
                              {choice.priceDeltaCents ? `+ ${formatUyu(choice.priceDeltaCents)}` : 'Incluido'}
                            </span>
                          )}
                        </label>
                      )
                    })}
                  </div>
                </fieldset>
              ))}

              <div className={`field ${styles.field}`}>
                <label className="label" htmlFor="producto-notas">
                  Observaciones <small>(opcional)</small>
                </label>
                <textarea
                  id="producto-notas"
                  className={`input ${styles.textarea}`}
                  value={notes}
                  maxLength={MAX_NOTES}
                  rows={2}
                  placeholder="Ej. sin cebolla, punto de cocción…"
                  onChange={(event) => setNotes(event.target.value)}
                />
                <span className={`help tnum ${styles.counter}`}>
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
                <span className={`${styles.stepperValue} tnum`} aria-live="polite">
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
                className={`btn btn--primary btn--lg ${styles.cta}`}
                disabled={blocked}
                onClick={() => {
                  onConfirm(selections, quantity, notes)
                  onClose()
                }}
              >
                <span>{ctaLabel}</span>
                {!blocked && <span className={`${styles.ctaPrice} tnum`}>{formatUyu(total)}</span>}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

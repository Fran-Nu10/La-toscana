'use client'

import { useEffect, useState } from 'react'
import type { Product } from '@/data/types'
import type { CartLine } from '@/lib/order'
import { formatUyu } from '@/lib/order'
import styles from './ProductConfigurator.module.css'

export function ProductConfigurator({ product, line, onClose, onConfirm }: { product: Product; line?: CartLine; onClose(): void; onConfirm(selections: { optionId: string; choice: Product['options'][number]['choices'][number] }[], quantity: number, notes: string): void }) {
  const [selected, setSelected] = useState<Record<string,string>>(() => Object.fromEntries(line?.selections.map(item => [item.optionId, item.choiceId]) ?? []))
  const [quantity, setQuantity] = useState(line?.quantity ?? 1)
  const [notes, setNotes] = useState(line?.notes ?? '')
  useEffect(() => { const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose(); document.body.style.overflow = 'hidden'; addEventListener('keydown', onKey); return () => { document.body.style.overflow = ''; removeEventListener('keydown', onKey) } }, [onClose])
  const selections = Object.entries(selected).flatMap(([optionId, choiceId]) => { const choice = product.options.find(option => option.id === optionId)?.choices.find(item => item.id === choiceId); return choice ? [{ optionId, choice }] : [] })
  const missing = product.options.some(option => option.required && !selected[option.id])
  const total = (product.priceCents + selections.reduce((sum, item) => sum + item.choice.priceDeltaCents, 0)) * quantity
  return <div className={styles.backdrop} onMouseDown={event => event.target === event.currentTarget && onClose()}><section className={styles.sheet} role="dialog" aria-modal="true" aria-labelledby="config-title"><div className={styles.handle}/><header><div><p className="kicker">Personalizá tu plato</p><h2 id="config-title">{product.name}</h2></div><button type="button" onClick={onClose} aria-label="Cerrar">×</button></header><p className={styles.description}>{product.description}</p><p className={styles.base}>Precio base <strong>{formatUyu(product.priceCents)}</strong></p><div className={styles.content}>{product.options.map(option => <fieldset key={option.id}><legend>{option.name} {option.required && <span>Obligatorio</span>}</legend>{option.choices.filter(choice => choice.available).map(choice => <label key={choice.id} className={selected[option.id] === choice.id ? styles.selected : ''}><input type="radio" name={option.id} checked={selected[option.id] === choice.id} onChange={() => setSelected(value => ({...value,[option.id]:choice.id}))}/><span>{choice.name}</span><strong>{choice.priceDeltaCents ? `+ ${formatUyu(choice.priceDeltaCents)}` : 'Incluido'}</strong></label>)}</fieldset>)}<label className={styles.notes}>Observaciones<textarea value={notes} maxLength={300} placeholder="Ej. sin cebolla, punto de cocción…" onChange={event => setNotes(event.target.value)}/></label></div><footer><div className={styles.quantity}><button type="button" onClick={() => setQuantity(value => Math.max(1,value-1))} aria-label="Quitar uno">−</button><strong>{quantity}</strong><button type="button" onClick={() => setQuantity(value => Math.min(20,value+1))} aria-label="Agregar uno">+</button></div><button type="button" className="btn btnPrimary" disabled={missing} onClick={() => { onConfirm(selections,quantity,notes); onClose() }}>{missing ? 'Completá las opciones' : `${line ? 'Guardar cambios' : 'Agregar al pedido'} · ${formatUyu(total)}`}</button></footer></section></div>
}

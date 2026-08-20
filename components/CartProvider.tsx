'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Product, ProductChoice } from '@/data/types'
import { cartTotal, type CartLine } from '@/lib/order'

type Selection = { optionId: string; choice: ProductChoice }
type CartContextValue = { lines: CartLine[]; count: number; total: number; open: boolean; setOpen(value: boolean): void; add(product: Product, selections: Selection[]): void; quantity(key: string, value: number): void; remove(key: string): void; clear(): void; notes(key: string, value: string): void }
const Context = createContext<CartContextValue | null>(null)
const STORAGE_KEY = 'la-toscana-cart-v2'

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])
  const [open, setOpen] = useState(false)
  const [ready, setReady] = useState(false)
  useEffect(() => { try { setLines(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')) } catch { localStorage.removeItem(STORAGE_KEY) } setReady(true) }, [])
  useEffect(() => { if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify(lines)) }, [lines, ready])
  const value = useMemo<CartContextValue>(() => ({
    lines, open, setOpen, count: lines.reduce((sum, line) => sum + line.quantity, 0), total: cartTotal(lines),
    add(product, selections) {
      const normalized = selections.map(({ optionId, choice }) => ({ optionId, choiceId: choice.id, name: choice.name, priceCents: choice.priceDeltaCents }))
      const signature = normalized.map(item => `${item.optionId}:${item.choiceId}`).sort().join('|')
      setLines(current => { const found = current.find(line => line.productId === product.id && !line.notes && line.selections.map(item => `${item.optionId}:${item.choiceId}`).sort().join('|') === signature); return found ? current.map(line => line.key === found.key ? { ...line, quantity: line.quantity + 1 } : line) : [...current, { key: crypto.randomUUID(), productId: product.id, name: product.name, unitPriceCents: product.priceCents, quantity: 1, selections: normalized, notes: '' }] })
      setOpen(true)
    },
    quantity(key, quantity) { setLines(current => quantity < 1 ? current.filter(line => line.key !== key) : current.map(line => line.key === key ? { ...line, quantity: Math.min(quantity, 20) } : line)) },
    notes(key, notes) { setLines(current => current.map(line => line.key === key ? { ...line, notes: notes.slice(0, 300) } : line)) },
    remove(key) { setLines(current => current.filter(line => line.key !== key)) },
    clear() { setLines([]) },
  }), [lines, open, ready])
  return <Context.Provider value={value}>{children}</Context.Provider>
}
export function useCart() { const value = useContext(Context); if (!value) throw new Error('useCart debe usarse dentro de CartProvider'); return value }

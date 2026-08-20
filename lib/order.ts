import type { OrderStatus } from '@/data/types'

export type { OrderStatus }
export interface CartLine {
  key: string
  productId: string
  name: string
  unitPriceCents: number
  quantity: number
  selections: { optionId: string; choiceId: string; name: string; priceCents: number }[]
  notes: string
}

export const lineUnitPrice = (line: CartLine) => line.unitPriceCents + line.selections.reduce((sum, choice) => sum + choice.priceCents, 0)
export const lineTotal = (line: CartLine) => lineUnitPrice(line) * line.quantity
export const cartTotal = (lines: CartLine[]) => lines.reduce((sum, line) => sum + lineTotal(line), 0)
export const formatUyu = (cents: number) => new Intl.NumberFormat('es-UY', { style: 'currency', currency: 'UYU', maximumFractionDigits: 0 }).format(cents / 100)

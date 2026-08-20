export type Fulfillment = 'delivery' | 'pickup'
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'completed' | 'cancelled'

export interface CartLine {
  key: string
  productId: string
  name: string
  unitPriceCents: number
  quantity: number
  selections: { optionId: string; choiceId: string; name: string; priceCents: number }[]
  notes: string
}

export const lineTotal = (line: CartLine) =>
  (line.unitPriceCents + line.selections.reduce((sum, choice) => sum + choice.priceCents, 0)) * line.quantity

export const cartTotal = (lines: CartLine[]) => lines.reduce((sum, line) => sum + lineTotal(line), 0)

export const formatUyu = (cents: number) =>
  new Intl.NumberFormat('es-UY', { style: 'currency', currency: 'UYU', maximumFractionDigits: 0 }).format(cents / 100)

export function validCheckout(value: unknown): value is {
  customer: { name: string; phone: string; email?: string }
  fulfillment: Fulfillment
  address?: string
  notes?: string
  items: { productId: string; quantity: number; optionChoiceIds: string[]; notes?: string }[]
} {
  if (!value || typeof value !== 'object') return false
  const body = value as Record<string, unknown>
  const customer = body.customer as Record<string, unknown> | undefined
  const items = body.items as Record<string, unknown>[] | undefined
  return Boolean(customer && typeof customer.name === 'string' && customer.name.trim().length >= 2 &&
    typeof customer.phone === 'string' && customer.phone.trim().length >= 6 &&
    (body.fulfillment === 'delivery' || body.fulfillment === 'pickup') &&
    (body.fulfillment !== 'delivery' || (typeof body.address === 'string' && body.address.trim().length >= 5)) &&
    Array.isArray(items) && items.length > 0 && items.length <= 50 &&
    items.every((item) => typeof item.productId === 'string' && Number.isInteger(item.quantity) && (item.quantity as number) > 0 && (item.quantity as number) <= 20 && Array.isArray(item.optionChoiceIds)))
}

import type { CartLine } from '../lib/order'
import type { CommerceData, FulfillmentType, Order } from '../data/types'

export interface CheckoutInput { customer: { name: string; phone: string; email: string }; fulfillment: FulfillmentType; address: string; notes: string }
export function createOrder(data: CommerceData, cart: CartLine[], input: CheckoutInput): Order {
  if (!data.settings.orderingOpen) throw new Error('Los pedidos están cerrados en este momento.')
  if (!cart.length) throw new Error('El carrito está vacío.')
  if (input.fulfillment === 'delivery' && !data.settings.deliveryEnabled) throw new Error('Delivery no está disponible.')
  if (input.fulfillment === 'pickup' && !data.settings.pickupEnabled) throw new Error('Retiro no está disponible.')
  if (input.fulfillment === 'delivery' && input.address.trim().length < 5) throw new Error('Ingresá una dirección válida.')
  const items = cart.map(line => {
    const product = data.products.find(item => item.id === line.productId && item.available)
    if (!product) throw new Error(`${line.name} ya no está disponible.`)
    const choices = line.selections.map(selection => {
      const option = product.options.find(item => item.id === selection.optionId)
      const choice = option?.choices.find(item => item.id === selection.choiceId && item.available)
      if (!option || !choice) throw new Error(`Revisá las opciones de ${product.name}.`)
      return { optionId: option.id, choiceId: choice.id, optionName: option.name, choiceName: choice.name, priceDeltaCents: choice.priceDeltaCents }
    })
    for (const option of product.options.filter(item => item.required)) if (!choices.some(item => item.optionId === option.id)) throw new Error(`Elegí ${option.name} para ${product.name}.`)
    const unit = product.priceCents + choices.reduce((sum, choice) => sum + choice.priceDeltaCents, 0)
    return { productId: product.id, productName: product.name, unitPriceCents: product.priceCents, quantity: line.quantity, choices, notes: line.notes, lineTotalCents: unit * line.quantity }
  })
  const subtotalCents = items.reduce((sum, item) => sum + item.lineTotalCents, 0)
  if (input.fulfillment === 'delivery' && subtotalCents < data.settings.deliveryMinimumCents) throw new Error('El pedido no alcanza el mínimo de delivery.')
  const now = new Date().toISOString(); const deliveryFeeCents = input.fulfillment === 'delivery' ? data.settings.deliveryFeeCents : 0
  return { id: crypto.randomUUID(), number: String(data.orders.length + 1001), trackingToken: crypto.randomUUID(), status: 'pending', fulfillment: input.fulfillment, customer: input.customer, address: input.address.trim(), notes: input.notes.trim(), items, subtotalCents, deliveryFeeCents, totalCents: subtotalCents + deliveryFeeCents, createdAt: now, updatedAt: now }
}

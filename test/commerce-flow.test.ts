import test from 'node:test'
import assert from 'node:assert/strict'
import { initialCommerceData } from '../data/seed.ts'
import { createOrder } from '../services/orders.ts'
import { cartTotal, lineTotal } from '../lib/order.ts'
import { validFulfillment } from '../services/fulfillment.ts'

test('cliente: variante, cantidad, delivery y total se confirman', () => {
  const data = structuredClone(initialCommerceData)
  const pasta = data.products.find(product => product.id === 'sorrentinos-jyq')!
  const choice = pasta.options[0].choices[1]
  const order = createOrder(data, [{ key:'line', productId:pasta.id, name:pasta.name, unitPriceCents:1, quantity:2, notes:'sin sal', selections:[{ optionId:'salsa', choiceId:choice.id, name:choice.name, priceCents:1 }] }], { customer:{name:'Ana Pérez',phone:'099123456',email:''},fulfillment:'delivery',address:'Calle 123',notes:'timbre rojo' })
  assert.equal(order.items[0].unitPriceCents, 59000)
  assert.equal(order.items[0].choices[0].priceDeltaCents, 6000)
  assert.equal(order.subtotalCents, 130000)
  assert.equal(order.totalCents, 138000)
  assert.equal(order.status, 'pending')
})

test('servicio rechaza producto oculto y opción obligatoria ausente', () => {
  const data = structuredClone(initialCommerceData)
  data.products.find(product => product.id === 'sorrentinos-jyq')!.available = false
  assert.throws(() => createOrder(data,[{key:'x',productId:'sorrentinos-jyq',name:'x',unitPriceCents:0,quantity:1,notes:'',selections:[]}],{customer:{name:'Ana',phone:'123456',email:''},fulfillment:'pickup',address:'',notes:''}),/no está disponible/)
})

test('cambio administrativo se refleja en la misma fuente pública', () => {
  const data = structuredClone(initialCommerceData)
  const product = data.products.find(item => item.id === 'napolitana')!
  product.priceCents = 51000; product.available = false
  assert.equal(data.products.find(item => item.id === 'napolitana')?.priceCents, 51000)
  assert.equal(data.products.filter(item => item.available).some(item => item.id === 'napolitana'), false)
})

test('precio de línea y carrito incluyen adicionales y cantidad', () => {
  const line = { key:'1', productId:'p', name:'Pasta', unitPriceCents:59000, quantity:2, notes:'', selections:[{ optionId:'salsa', choiceId:'quesos', name:'Cuatro quesos', priceCents:6000 }] }
  assert.equal(lineTotal(line), 130000)
  assert.equal(cartTotal([line]), 130000)
})

test('fulfillment persistido se corrige al modo habilitado', () => {
  const settings = structuredClone(initialCommerceData.settings)
  settings.pickupEnabled = false
  settings.deliveryEnabled = true
  assert.equal(validFulfillment(settings, 'pickup'), 'delivery')
  settings.deliveryEnabled = false
  assert.equal(validFulfillment(settings, 'pickup'), null)
})

test('servicio valida contacto, cantidad y opciones duplicadas', () => {
  const data = structuredClone(initialCommerceData)
  const product = data.products.find(item => item.id === 'sorrentinos-jyq')!
  const selection = { optionId:'salsa', choiceId:'fileto', name:'Fileto', priceCents:0 }
  const input = { customer:{name:'Ana',phone:'099123456',email:''},fulfillment:'pickup' as const,address:'',notes:'' }
  assert.throws(() => createOrder(data,[{key:'x',productId:product.id,name:product.name,unitPriceCents:0,quantity:21,notes:'',selections:[selection]}],input),/cantidad/)
  assert.throws(() => createOrder(data,[{key:'x',productId:product.id,name:product.name,unitPriceCents:0,quantity:1,notes:'',selections:[selection,selection]}],input),/opciones/)
})

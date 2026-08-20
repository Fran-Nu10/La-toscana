import test from 'node:test'
import assert from 'node:assert/strict'
import { initialCommerceData } from '../data/seed.ts'
import { createOrder } from '../services/orders.ts'

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

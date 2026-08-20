import type { CommerceData, Product } from './types'

const product = (id: string, categoryId: string, name: string, description: string, priceCents: number, options: Product['options'] = []): Product => ({ id, categoryId, name, description, priceCents, available: true, options })
const salsa = [{ id: 'salsa', name: 'Salsa', required: true, choices: [
  { id: 'bolognesa', name: 'Bolognesa', priceDeltaCents: 0, available: true },
  { id: 'cuatro-quesos', name: 'Cuatro quesos', priceDeltaCents: 6000, available: true },
  { id: 'fileto', name: 'Fileto', priceDeltaCents: 0, available: true },
] }]
const vino = [{ id: 'presentacion', name: 'Presentación', required: true, choices: [
  { id: 'copa', name: 'Copa', priceDeltaCents: 0, available: true },
  { id: 'botella', name: 'Botella', priceDeltaCents: 76000, available: true },
] }]

export const initialCommerceData: CommerceData = {
  version: 1,
  categories: [
    { id: 'pastas', name: 'Pastas', available: true }, { id: 'pizzas', name: 'Pizzas', available: true },
    { id: 'carnes', name: 'Carnes', available: true }, { id: 'picadas', name: 'Picadas', available: true },
    { id: 'postres', name: 'Postres', available: true }, { id: 'vinos', name: 'Vinos', available: true },
  ],
  products: [
    product('sorrentinos-jyq','pastas','Sorrentinos de jamón y queso','Hechos en casa, salsa a elección',59000,salsa),
    product('tallarines-toscana','pastas','Tallarines a la Toscana','Crema, panceta y champiñones',54000,salsa),
    product('noquis-papa','pastas','Ñoquis de papa','Pasta fresca de la casa',52000,salsa),
    product('lasana-carne','pastas','Lasaña de carne','Gratinada al horno',62000),
    product('muzzarella-piedra','pizzas','Muzzarella a la piedra','Salsa de tomate y aceitunas',43000),
    product('napolitana','pizzas','Napolitana','Tomate fresco, ajo y albahaca',48000),
    product('toscana-especial','pizzas','Toscana especial','Jamón crudo, rúcula y parmesano',56000),
    product('entrecot-parrilla','carnes','Entrecot a la parrilla','Con papas rústicas',78000),
    product('pollo-champinon','carnes','Pollo al champiñón','Suprema con salsa cremosa',62000),
    product('picada-dos','picadas','Picada para dos','Fiambres, quesos y frituras',89000),
    product('tabla-mar','picadas','Tabla de mar','Rabas, langostinos y limón',98000),
    product('tiramisu','postres','Tiramisú','Receta clásica de la casa',32000),
    product('flan-casero','postres','Flan casero','Con dulce de leche',26000),
    product('tannat-reserva','vinos','Tannat Reserva','Copa o botella',38000,vino),
    product('chardonnay','vinos','Chardonnay','Copa o botella',36000,vino),
  ],
  orders: [],
  settings: { name: 'La Toscana', phone: '093 379 047', address: 'Florida, Uruguay', orderingOpen: true, orderHours: 'Martes a domingo · 20:00 – 00:30', deliveryEnabled: true, pickupEnabled: true, deliveryFeeCents: 8000, deliveryMinimumCents: 40000 },
}

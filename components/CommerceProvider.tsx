'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { BusinessSettings, Category, CommerceData, Order, OrderStatus, Product } from '@/data/types'
import { initialCommerceData } from '@/data/seed'
import { LocalCommerceRepository } from '@/repositories/commerce'
import { createOrder, type CheckoutInput } from '@/services/orders'
import type { CartLine } from '@/lib/order'

type CommerceContextValue = {
  ready: boolean; categories: Category[]; products: Product[]; orders: Order[]; settings: BusinessSettings
  placeOrder(lines: CartLine[], input: CheckoutInput): Order; updateOrderStatus(id: string, status: OrderStatus): void
  saveProduct(product: Product): void; deleteProduct(id: string): void; saveCategory(category: Category): void; deleteCategory(id: string): void
  saveSettings(settings: BusinessSettings): void; resetDemo(): void
}
const Context = createContext<CommerceContextValue | null>(null)
const repository = new LocalCommerceRepository()

export function CommerceProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<CommerceData>(initialCommerceData)
  const [ready, setReady] = useState(false)
  useEffect(() => { setData(repository.load()); setReady(true) }, [])
  function commit(change: (current: CommerceData) => CommerceData) { setData(current => { const next = change(current); repository.save(next); return next }) }
  const value = useMemo<CommerceContextValue>(() => ({
    ready, ...data,
    placeOrder(lines, input) { const order = createOrder(data, lines, input); commit(current => ({ ...current, orders: [order, ...current.orders] })); return order },
    updateOrderStatus(id, status) { commit(current => ({ ...current, orders: current.orders.map(order => order.id === id ? { ...order, status, updatedAt: new Date().toISOString() } : order) })) },
    saveProduct(product) { commit(current => ({ ...current, products: current.products.some(item => item.id === product.id) ? current.products.map(item => item.id === product.id ? product : item) : [...current.products, product] })) },
    deleteProduct(id) { commit(current => ({ ...current, products: current.products.filter(item => item.id !== id) })) },
    saveCategory(category) { commit(current => ({ ...current, categories: current.categories.some(item => item.id === category.id) ? current.categories.map(item => item.id === category.id ? category : item) : [...current.categories, category] })) },
    deleteCategory(id) { commit(current => ({ ...current, categories: current.categories.filter(item => item.id !== id), products: current.products.filter(item => item.categoryId !== id) })) },
    saveSettings(settings) { commit(current => ({ ...current, settings })) },
    resetDemo() { setData(repository.reset()) },
  }), [data, ready])
  return <Context.Provider value={value}>{children}</Context.Provider>
}
export function useCommerce() { const value = useContext(Context); if (!value) throw new Error('useCommerce debe usarse dentro de CommerceProvider'); return value }

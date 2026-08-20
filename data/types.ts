export type FulfillmentType = 'delivery' | 'pickup'
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'completed' | 'cancelled'

export interface ProductChoice { id: string; name: string; priceDeltaCents: number; available: boolean }
export interface ProductOption { id: string; name: string; required: boolean; choices: ProductChoice[] }
export interface Product { id: string; categoryId: string; name: string; description: string; priceCents: number; available: boolean; options: ProductOption[] }
export interface Category { id: string; name: string; available: boolean }
export interface BusinessSettings { name: string; phone: string; address: string; orderingOpen: boolean; orderHours: string; deliveryEnabled: boolean; pickupEnabled: boolean; deliveryFeeCents: number; deliveryMinimumCents: number }
export interface OrderItemChoice { optionId: string; choiceId: string; optionName: string; choiceName: string; priceDeltaCents: number }
export interface OrderItem { productId: string; productName: string; unitPriceCents: number; quantity: number; choices: OrderItemChoice[]; notes: string; lineTotalCents: number }
export interface Order { id: string; number: string; trackingToken: string; status: OrderStatus; fulfillment: FulfillmentType; customer: { name: string; phone: string; email: string }; address: string; notes: string; items: OrderItem[]; subtotalCents: number; deliveryFeeCents: number; totalCents: number; createdAt: string; updatedAt: string }
export interface CommerceData { version: 1; categories: Category[]; products: Product[]; orders: Order[]; settings: BusinessSettings }

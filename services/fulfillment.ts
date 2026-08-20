import type { BusinessSettings, FulfillmentType } from '../data/types'

export function validFulfillment(settings: BusinessSettings, current?: FulfillmentType): FulfillmentType | null {
  if (current === 'pickup' && settings.pickupEnabled) return current
  if (current === 'delivery' && settings.deliveryEnabled) return current
  if (settings.pickupEnabled) return 'pickup'
  if (settings.deliveryEnabled) return 'delivery'
  return null
}

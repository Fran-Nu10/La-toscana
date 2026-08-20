import type { CommerceData } from '../data/types'
import { initialCommerceData } from '../data/seed'

export interface CommerceRepository { load(): CommerceData; save(data: CommerceData): void; reset(): CommerceData }
const STORAGE_KEY = 'la-toscana-commerce-v1'
const cloneSeed = () => structuredClone(initialCommerceData)

export class LocalCommerceRepository implements CommerceRepository {
  load(): CommerceData {
    if (typeof window === 'undefined') return cloneSeed()
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '') as CommerceData
      return parsed?.version === 1 ? parsed : cloneSeed()
    } catch { return cloneSeed() }
  }
  save(data: CommerceData) { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) }
  reset() { const data = cloneSeed(); this.save(data); return data }
}

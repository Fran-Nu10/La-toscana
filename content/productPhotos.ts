import { real, stock } from './photos'
import type { Photo } from './types'

/**
 * Foto por producto del catálogo: la única fuente de verdad para tarjeta,
 * detalle y carrito.
 *
 * Sólo se asigna una foto real cuando hay evidencia de que es ese plato: la
 * muzzarella sale del flyer oficial de la promo del miércoles ("1 rueda
 * muzza"). El resto sigue con stock hasta tener foto propia. Un producto sin
 * entrada dibuja un fondo cálido de reemplazo.
 */
const byProductId: Record<string, Photo> = {
  'sorrentinos-jyq': stock.sorrentinos,
  'tallarines-toscana': stock.tallarines,
  'noquis-papa': stock.noquis,
  'lasana-carne': stock.lasagna,
  'muzzarella-piedra': real.muzzarella,
  'napolitana': stock.napolitana,
  'toscana-especial': stock.pizzaToscana,
  'entrecot-parrilla': stock.entrecot,
  'pollo-champinon': stock.pollo,
  'picada-dos': stock.picada,
  'tabla-mar': stock.tablaDeMar,
  'tiramisu': stock.tiramisu,
  'flan-casero': stock.flan,
  'tannat-reserva': stock.vino,
  'chardonnay': stock.vino,
}

export function productPhoto(productId: string): Photo | undefined {
  return byProductId[productId]
}

/** Si la foto del producto es material real del restaurante. */
export function isRealPhoto(photo: Photo | undefined): boolean {
  return Boolean(photo?.src.startsWith('/media/'))
}

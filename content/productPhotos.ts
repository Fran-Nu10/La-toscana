import { photos } from './photos'
import type { Photo } from './types'

/**
 * Foto por producto del catálogo.
 *
 * Los productos (`data/seed.ts`) son datos de comercio y no cargan imágenes; las
 * fotos viven en la capa de contenido. Este mapa une las dos cosas sin tocar el
 * modelo de datos: así la tarjeta y el detalle muestran el plato, y el día que
 * cada producto tenga su propia foto alcanza con cambiar acá.
 *
 * Un producto sin entrada no rompe nada: la tarjeta y el detalle dibujan un
 * fondo cálido de reemplazo.
 */
const byProductId: Record<string, Photo> = {
  'sorrentinos-jyq': photos.dishes.sorrentinos,
  'tallarines-toscana': photos.dishes.tallarines,
  'noquis-papa': photos.dishes.noquis,
  'lasana-carne': photos.dishes.lasagna,
  'muzzarella-piedra': photos.dishes.muzzarella,
  'napolitana': photos.dishes.muzzarella,
  'toscana-especial': photos.dishes.pizzaToscana,
  'entrecot-parrilla': photos.dishes.entrecot,
  'pollo-champinon': photos.dishes.pollo,
  'picada-dos': photos.dishes.picada,
  'tabla-mar': photos.dishes.tablaDeMar,
  'tiramisu': photos.dishes.tiramisu,
  'flan-casero': photos.dishes.flan,
  'tannat-reserva': photos.gallery[2],
  'chardonnay': photos.gallery[2],
}

export function productPhoto(productId: string): Photo | undefined {
  return byProductId[productId]
}

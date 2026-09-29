import type { Photo, PhotoTone } from './types'

/**
 * Fotografía, en un solo lugar.
 *
 * DESDE ESTA FASE LA FUENTE PRINCIPAL ES MATERIAL REAL DE LA TOSCANA
 * (`/public/media/…`): fotos de Instagram del restaurante, cuadros extraídos
 * del reel "Un día en La Toscana" y los flyers oficiales. Cada archivo se
 * inspeccionó a mano antes de ubicarlo; ningún plato recibe una foto que no
 * sea, con evidencia, ese plato.
 *
 * El stock de Unsplash queda sólo en `stock`, para los productos de la carta
 * que todavía no tienen foto propia. Cuando llegue una foto real de un plato,
 * se agrega en `real` y se apunta el producto en `productPhotos.ts`.
 *
 * `width`/`height` son las dimensiones del archivo: la galería y los flyers las
 * usan para respetar la proporción original en vez de recortar todo igual.
 */

const UNSPLASH = 'https://images.unsplash.com'

function unsplash(id: string): string {
  return `${UNSPLASH}/photo-${id}?auto=format&fit=crop&q=80`
}

function stockPhoto(id: string, alt: string, tone: PhotoTone, focal?: string): Photo {
  return {
    src: unsplash(id),
    alt,
    tone,
    ...(focal ? { focal } : {}),
    credit: { name: 'Unsplash', href: 'https://unsplash.com' },
  }
}

function local(
  path: string,
  alt: string,
  tone: PhotoTone,
  size: [number, number],
  focal?: string,
): Photo {
  return {
    src: `/media/${path}`,
    alt,
    tone,
    width: size[0],
    height: size[1],
    ...(focal ? { focal } : {}),
  }
}

/** Formatos de los archivos reales. */
const REEL: [number, number] = [1080, 1920]
const POST: [number, number] = [1351, 1689]
const FLYER: [number, number] = [640, 1137]

export const real = {
  /* ── Comida ─────────────────────────────────────────────────────────── */
  milanesa: local(
    'food/milanesa-gratinada-cartel.jpg',
    'Milanesa con queso fundido, panceta crocante, papas fritas y lechuga, sostenida frente al cartel dorado de La Toscana',
    'night',
    REEL,
    '50% 62%',
  ),
  ensalada: local(
    'food/ensalada-pollo-crocante.jpg',
    'Ensalada con tiras de pollo crocante, tomates cherry, queso en cubos y aderezo',
    'ember',
    [1440, 1800],
  ),
  trago: local(
    'food/trago-frutilla.jpg',
    'Trago con frutilla y frutos rojos en copa, con las luces del salón de noche detrás',
    'wine',
    [1440, 1477],
    '50% 45%',
  ),
  asado: local(
    'food/asado-de-tira-parrilla.jpg',
    'Asado de tira dorándose sobre la parrilla a leña',
    'ember',
    REEL,
    '50% 55%',
  ),
  sandwich: local(
    'food/sandwich-casero.jpg',
    'Sándwich en pan casero con jamón, queso, huevo y carne, con ensalada al costado',
    'ember',
    REEL,
    '50% 55%',
  ),
  tragosBarra: local(
    'food/tragos-de-la-barra.jpg',
    'Dos tragos frutales con hojas de menta recién servidos',
    'olive',
    REEL,
    '50% 55%',
  ),
  brasero: local(
    'food/brasero-cartel.jpg',
    'Brasero de carnes con morrón gratinado, en la mesa frente al cartel de La Toscana',
    'night',
    REEL,
    '50% 65%',
  ),
  muzzarella: local(
    'food/muzzarella-a-la-piedra.jpg',
    'Pizza de muzzarella con salsa de tomate y orégano',
    'ember',
    [460, 575],
  ),

  /* ── El lugar y la gente ────────────────────────────────────────────── */
  parrillero: local(
    'restaurant/parrillero-fuego.jpg',
    'El parrillero, con la remera de La Toscana, trabajando frente al fuego de leña',
    'ember',
    REEL,
    '42% 60%',
  ),
  fuegoCopas: local(
    'restaurant/fuego-copas.jpg',
    'Copas de vino frente al fuego de la parrilla',
    'ember',
    REEL,
    '50% 58%',
  ),
  salon: local(
    'restaurant/salon-lleno.jpg',
    'El salón de La Toscana de noche, con mesas ocupadas y guirnaldas de luces',
    'night',
    REEL,
    '50% 66%',
  ),
  cartel: local(
    'restaurant/cartel-salon.jpg',
    'El cartel de madera de La Toscana colgado sobre la pared del salón',
    'night',
    REEL,
    '50% 30%',
  ),
  flyerEventos: local(
    'restaurant/flyer-cumples-despedidas.jpg',
    'Flyer de La Toscana: "Cumples y despedidas en La Toscana. Brindis, menú especial y todo listo para festejar como te gusta. Reservá tu fecha por WhatsApp al 093 379 047". De fondo, una copa de vino y el salón de noche.',
    'night',
    POST,
  ),

  /* ── Flyers de promociones ──────────────────────────────────────────── */
  promoMartes: local(
    'promos/promo-martes-gramajo.jpg',
    'Flyer Promo Martes: gramajo para 2 con refresco de 1 litro de regalo. Sólo delivery, pedidos al +598 93 379 047.',
    'ember',
    FLYER,
  ),
  promoMiercoles: local(
    'promos/promo-miercoles-muzza.jpg',
    'Flyer Promo Miércoles: una rueda de muzza con refresco de 1 litro de regalo. Sólo delivery, pedidos al +598 93 379 047.',
    'ember',
    FLYER,
  ),
  promoJueves: local(
    'promos/promo-jueves-brasero.jpg',
    'Flyer Promo Jueves: brasero con guarnición y refresco de 1 litro de regalo. Sólo delivery, pedidos al +598 93 379 047.',
    'night',
    FLYER,
  ),
} as const

/** Stock provisorio: sólo para platos de la carta sin foto real todavía. */
export const stock = {
  sorrentinos: stockPhoto('1587740908075-9e245070dfaa', 'Sorrentinos de jamón y queso con salsa', 'ember'),
  entrecot: stockPhoto('1504674900247-0877df9cc836', 'Entrecot a la parrilla con papas rústicas', 'wine'),
  pizzaToscana: stockPhoto('1565299624946-b28f40a0ae38', 'Pizza a la piedra con jamón crudo y rúcula', 'ember'),
  tallarines: stockPhoto('1621996346565-e3dbc646d9a9', 'Tallarines con crema, panceta y champiñones', 'olive'),
  picada: stockPhoto('1541014741259-de529411b96a', 'Picada para dos con fiambres, quesos y frituras', 'parchment'),
  lasagna: stockPhoto('1574894709920-11b28e7367e3', 'Lasaña de carne gratinada al horno', 'wine'),
  tablaDeMar: stockPhoto('1559847844-5315695dadae', 'Tabla de mar con rabas y langostinos', 'olive'),
  noquis: stockPhoto('1551892374-ecf8754cf8b0', 'Ñoquis de papa con salsa bolognesa', 'ember'),
  tiramisu: stockPhoto('1571877227200-a0d98ea607e9', 'Tiramisú clásico de la casa', 'parchment'),
  napolitana: stockPhoto('1513104890138-7c749659a591', 'Pizza napolitana a la piedra', 'ember'),
  pollo: stockPhoto('1598515214211-89d3c73ae83b', 'Suprema de pollo con salsa de champiñones', 'olive'),
  flan: stockPhoto('1551024506-0bccd828d307', 'Flan casero con dulce de leche', 'parchment'),
  vino: stockPhoto('1510812431401-41d2bd2722f3', 'Copas y botellas de vino', 'ember'),
} as const

/** Alias de compatibilidad: `site.dishes.items` los sigue leyendo. */
export const photos = {
  dishes: {
    sorrentinos: stock.sorrentinos,
    entrecot: stock.entrecot,
    pizzaToscana: stock.pizzaToscana,
    tallarines: stock.tallarines,
    picada: stock.picada,
    lasagna: stock.lasagna,
    tablaDeMar: stock.tablaDeMar,
    noquis: stock.noquis,
    tiramisu: stock.tiramisu,
    muzzarella: real.muzzarella,
    pollo: stock.pollo,
    flan: stock.flan,
  },
} as const

import type { Photo, PhotoTone } from './types'

/**
 * Photography, in one place.
 *
 * These are free Unsplash stand-ins so the homepage can be shown finished. They
 * are placeholders for La Toscana's own photography — the layout is built to be
 * carried by real photos of the salón, la cocina y los platos.
 *
 * TO SWAP IN THE REAL PHOTOS: drop the files into `public/fotos/` and change
 * `src` below to `/fotos/sorrentinos.jpg`. Nothing else in the codebase needs to
 * change — `<Photo>` reads `src` directly and only builds a CDN srcset for URLs
 * that support Unsplash's `w=` parameter.
 *
 * Every photo carries a `tone`: a warm wash that fills the frame while the file
 * loads and stays there if it ever fails, so a missing image reads as a matted
 * plate rather than a broken box.
 */

const UNSPLASH = 'https://images.unsplash.com'

/** Builds a base Unsplash URL; `<Photo>` appends the width for each srcset entry. */
function unsplash(id: string): string {
  return `${UNSPLASH}/photo-${id}?auto=format&fit=crop&q=80`
}

/**
 * @param focal `object-position` for the crop. Frames run tall on a phone and
 *   wide on a desktop, so a photograph whose subject sits low or off-centre
 *   needs this to survive both. Omit for centred subjects.
 */
function photo(id: string, alt: string, tone: PhotoTone, focal?: string): Photo {
  return {
    src: unsplash(id),
    alt,
    tone,
    ...(focal ? { focal } : {}),
    credit: { name: 'Unsplash', href: 'https://unsplash.com' },
  }
}

export const photos = {
  /* El hero se recorta en vertical en el celular: el foco va algo por debajo
     del centro, donde está la mesa servida. */
  hero: photo(
    '1414235077428-338989a2e8c0',
    'Salón de La Toscana a la luz de las velas, mesas servidas',
    'night',
    '50% 58%',
  ),
  experienceRoom: photo(
    '1552566626-52f8b828add9',
    'Mesas del salón preparadas para la noche',
    'ember',
    '50% 45%',
  ),
  experienceKitchen: photo(
    '1556910103-1c02745aae4d',
    'La cocina de La Toscana en plena preparación',
    'night',
  ),
  reservations: photo(
    '1414235077428-338989a2e8c0',
    'Copas y velas en el ambiente nocturno del restaurante',
    'night',
    '50% 40%',
  ),
  events: photo(
    '1530103862676-de8c9debad1d',
    'Brindis en una mesa de celebración en La Toscana',
    'wine',
    '50% 42%',
  ),
  location: photo(
    '1517248135467-4c7edcad34c4',
    'Frente y ambiente de La Toscana en Florida, Uruguay',
    'ember',
  ),
  dishes: {
    sorrentinos: photo('1587740908075-9e245070dfaa', 'Sorrentinos de jamón y queso con salsa', 'ember'),
    entrecot: photo('1504674900247-0877df9cc836', 'Entrecot a la parrilla con papas rústicas', 'wine'),
    pizzaToscana: photo('1565299624946-b28f40a0ae38', 'Pizza a la piedra con jamón crudo y rúcula', 'ember'),
    tallarines: photo('1621996346565-e3dbc646d9a9', 'Tallarines con crema, panceta y champiñones', 'olive'),
    picada: photo('1541014741259-de529411b96a', 'Picada para dos con fiambres, quesos y frituras', 'parchment'),
    lasagna: photo('1574894709920-11b28e7367e3', 'Lasaña de carne gratinada al horno', 'wine'),
    tablaDeMar: photo('1559847844-5315695dadae', 'Tabla de mar con rabas y langostinos', 'olive'),
    noquis: photo('1551892374-ecf8754cf8b0', 'Ñoquis de papa con salsa bolognesa', 'ember'),
    tiramisu: photo('1571877227200-a0d98ea607e9', 'Tiramisú clásico de la casa', 'parchment'),
    muzzarella: photo('1513104890138-7c749659a591', 'Pizza de muzzarella a la piedra', 'ember'),
    pollo: photo('1598515214211-89d3c73ae83b', 'Suprema de pollo con salsa de champiñones', 'olive'),
    flan: photo('1551024506-0bccd828d307', 'Flan casero con dulce de leche', 'parchment'),
  },
  gallery: [
    photo('1517248135467-4c7edcad34c4', 'El salón completo de La Toscana', 'night'),
    photo('1544025162-d76694265947', 'Un plato servido en la mesa', 'wine'),
    photo('1510812431401-41d2bd2722f3', 'La barra y la carta de vinos', 'ember'),
    photo('1556910103-1c02745aae4d', 'La cocina durante el servicio', 'night'),
    photo('1543007630-9710e4a00a20', 'Una mesa de amigos compartiendo la cena', 'wine'),
    photo('1470124182917-cc6e71b22ecc', 'El postre de la casa', 'parchment'),
  ],
} as const

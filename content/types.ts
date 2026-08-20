/**
 * Content model for the La Toscana site.
 *
 * Every string the page renders comes from here — nothing is hard-coded in the
 * components. The shape is deliberately CMS-shaped: flat records with stable
 * `id`s, plain scalars, and no React or DOM types, so `getSiteContent()` can be
 * repointed at a headless CMS, a Sanity/Strapi query or a REST endpoint without
 * touching a single component.
 */

/** Warm fallback wash painted under a photograph while it loads, or in its place
 *  if the file is missing. Keeps the layout intentional instead of broken. */
export type PhotoTone = 'night' | 'ember' | 'wine' | 'olive' | 'parchment'

export interface Photo {
  /** Absolute CDN URL or a path under /public. */
  src: string
  /** Spanish alt text — this is a public restaurant site, it matters. */
  alt: string
  tone: PhotoTone
  /** `object-position` for the crop. Frames get tall on a phone and wide on a
   *  desktop; this keeps the subject in shot through both. Defaults to centre. */
  focal?: string
  /** Optional attribution, rendered nowhere today but carried for licensing. */
  credit?: { name: string; href: string }
}

export interface NavLink {
  label: string
  href: string
}

/** A "plato de la casa" — the photographic grid under Platos. */
export interface Dish {
  id: string
  name: string
  price: string
  description: string
  photo: Photo
}

export interface MenuItem {
  id: string
  name: string
  price: string
  priceCents: number
  description: string
  available?: boolean
  options?: { id: string; name: string; choices: { id: string; name: string; priceCents: number }[] }[]
}

export interface MenuCategory {
  id: string
  name: string
  items: MenuItem[]
}

export interface OrderWay {
  id: string
  /** Editorial numeral: 01, 02, 03. */
  index: string
  name: string
  description: string
  cta: string
  href: string
}

export interface Promo {
  id: string
  day: string
  name: string
  description: string
}

export interface EventType {
  name: string
  detail: string
}

export interface Review {
  id: string
  text: string
  name: string
  source: string
}

export interface InfoRow {
  label: string
  value: string
  href?: string
}

export interface Stat {
  value: string
  label: string
}

export interface SiteContent {
  brand: {
    name: string
    tagline: string
    description: string
    city: string
    hours: string
    closed: string
    phone: { display: string; tel: string }
    whatsapp: { display: string; href: string }
    instagram: { handle: string; href: string }
    address: string
    mapsHref: string
  }
  promoBar: { enabled: boolean; text: string }
  nav: NavLink[]
  hero: {
    kicker: string
    title: string
    /** One line saying what this place is — the first question a visitor
     *  arriving from Instagram or Google needs answered. */
    subtitle: string
    tagline: string
    primaryCta: { label: string; href: string }
    secondaryCta: { label: string; href: string }
    metaLeft: string
    metaRight: string
    photo: Photo
  }
  experience: {
    kicker: string
    title: string
    body: string
    stats: Stat[]
    photos: [Photo, Photo]
  }
  dishes: {
    title: string
    menuLinkLabel: string
    /** How many appear before "Cargar más platos". */
    initialCount: number
    /** How many more each press reveals. */
    step: number
    loadMoreLabel: string
    items: Dish[]
  }
  menu: {
    kicker: string
    title: string
    body: string
    downloadLabel: string
    downloadHref: string
    categories: MenuCategory[]
  }
  order: {
    kicker: string
    title: string
    ways: OrderWay[]
  }
  promos: {
    title: string
    subtitle: string
    items: Promo[]
  }
  reservations: {
    kicker: string
    title: string
    body: string
    whatsappCta: { label: string; href: string }
    phoneCta: { label: string; href: string }
    photo: Photo
  }
  events: {
    kicker: string
    title: string
    body: string
    types: EventType[]
    cta: { label: string; href: string }
    photo: Photo
  }
  gallery: {
    title: string
    linkLabel: string
    linkHref: string
    /** Six photographs; the 1st and 3rd span two rows in the editorial grid. */
    photos: Photo[]
  }
  reviews: {
    kicker: string
    items: Review[]
  }
  location: {
    kicker: string
    title: string
    rows: InfoRow[]
    photo: Photo
    mapHref: string
    mapLinkLabel: string
  }
  finalCta: {
    kicker: string
    title: string
    primaryCta: { label: string; href: string }
    secondaryCta: { label: string; href: string }
  }
  footer: {
    navHeading: string
    contactHeading: string
    hoursHeading: string
    legal: string
    colophon: string
  }
}

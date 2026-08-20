import { photos } from './photos'
import type { SiteContent } from './types'

const WHATSAPP_NUMBER = '59893379047'

/** Builds a wa.me link with the message already written for the guest. */
function whatsapp(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export const site: SiteContent = {
  brand: {
    name: 'La Toscana',
    tagline: 'Más que un plato, creamos experiencias únicas que te llenan de felicidad.',
    description:
      'Restaurante gastronómico en Florida, Uruguay. Pastas caseras, pizzas a la piedra y noches que se recuerdan.',
    city: 'Florida · Uruguay',
    hours: 'Martes a domingo · 20:00 – 00:30',
    closed: 'Lunes · cerrado',
    phone: { display: '093 379 047', tel: 'tel:+59893379047' },
    whatsapp: {
      display: '093 379 047',
      href: whatsapp('¡Hola La Toscana! Quería hacerles una consulta.'),
    },
    instagram: { handle: '@latoscanaflorida', href: 'https://www.instagram.com/latoscanaflorida' },
    address: 'Florida, Uruguay',
    mapsHref: 'https://www.google.com/maps/search/?api=1&query=La+Toscana+Florida+Uruguay',
  },

  promoBar: {
    enabled: true,
    /* Corto a propósito: entra en una línea en un teléfono de 360px. */
    text: 'Jueves · Picada para dos + copa de Tannat',
  },

  nav: [
    { label: 'Experiencia', href: '#experiencia' },
    { label: 'Menú', href: '#menu' },
    { label: 'Promos', href: '#promos' },
    { label: 'Eventos', href: '#eventos' },
    { label: 'Galería', href: '#galeria' },
    { label: 'Ubicación', href: '#ubicacion' },
  ],

  hero: {
    /* Las cuatro respuestas de la primera pantalla: qué es, qué se come,
       cuándo abre y dónde queda. */
    kicker: 'Restaurante gastronómico',
    title: 'La Toscana',
    subtitle: 'Pastas caseras, pizza a la piedra y parrilla.',
    tagline: 'Más que un plato, creamos experiencias únicas.',
    /* Pedir lidera, reservar acompaña — el mismo orden en toda la página. */
    primaryCta: { label: 'Pedir ahora', href: '#pedir' },
    secondaryCta: { label: 'Reservar mesa', href: '#reservas' },
    metaLeft: 'Martes a domingo · 20:00 – 00:30',
    metaRight: 'Florida · Uruguay',
    photo: photos.hero,
  },

  experience: {
    kicker: 'La experiencia',
    title: 'Cocina que se comparte, momentos que se recuerdan',
    body: 'En el corazón de Florida, La Toscana reúne pastas hechas en casa, pizzas a la piedra y carnes a la parrilla en un ambiente cálido pensado para quedarse. Cada mesa se prepara como si fuera la única de la noche.',
    stats: [
      { value: '15+', label: 'Años de cocina' },
      { value: '6.000', label: 'Seguidores' },
      { value: '100%', label: 'Pasta casera' },
    ],
    photos: [photos.experienceRoom, photos.experienceKitchen],
  },

  dishes: {
    title: 'Platos de la casa',
    menuLinkLabel: 'Menú completo',
    initialCount: 8,
    step: 4,
    loadMoreLabel: 'Cargar más platos',
    items: [
      {
        id: 'sorrentinos',
        name: 'Sorrentinos de la casa',
        price: '$U 590',
        description: 'Jamón y queso, masa fresca hecha cada mañana, salsa a elección.',
        photo: photos.dishes.sorrentinos,
      },
      {
        id: 'entrecot',
        name: 'Entrecot a la parrilla',
        price: '$U 780',
        description: 'Corte generoso a las brasas con papas rústicas y chimichurri.',
        photo: photos.dishes.entrecot,
      },
      {
        id: 'pizza-toscana',
        name: 'Pizza Toscana',
        price: '$U 560',
        description: 'A la piedra, jamón crudo, rúcula y parmesano en escamas.',
        photo: photos.dishes.pizzaToscana,
      },
      {
        id: 'tallarines',
        name: 'Tallarines a la Toscana',
        price: '$U 540',
        description: 'Crema, panceta y champiñones sobre pasta fresca.',
        photo: photos.dishes.tallarines,
      },
      {
        id: 'picada',
        name: 'Picada para dos',
        price: '$U 890',
        description: 'Fiambres, quesos y frituras para compartir sin apuro.',
        photo: photos.dishes.picada,
      },
      {
        id: 'lasagna',
        name: 'Lasaña de carne',
        price: '$U 620',
        description: 'Capas finas gratinadas al horno, receta de la casa.',
        photo: photos.dishes.lasagna,
      },
      {
        id: 'tabla-de-mar',
        name: 'Tabla de mar',
        price: '$U 980',
        description: 'Rabas, langostinos y limón, directo de la plancha.',
        photo: photos.dishes.tablaDeMar,
      },
      {
        id: 'noquis',
        name: 'Ñoquis de papa',
        price: '$U 520',
        description: 'Suaves y livianos, con bolognesa o cuatro quesos.',
        photo: photos.dishes.noquis,
      },
      {
        id: 'tiramisu',
        name: 'Tiramisú',
        price: '$U 320',
        description: 'El clásico de la casa para cerrar la noche.',
        photo: photos.dishes.tiramisu,
      },
      {
        id: 'muzzarella',
        name: 'Muzzarella a la piedra',
        price: '$U 430',
        description: 'Masa fina, salsa de tomate y aceitunas.',
        photo: photos.dishes.muzzarella,
      },
      {
        id: 'pollo',
        name: 'Pollo al champiñón',
        price: '$U 620',
        description: 'Suprema con salsa cremosa y guarnición.',
        photo: photos.dishes.pollo,
      },
      {
        id: 'flan',
        name: 'Flan casero',
        price: '$U 260',
        description: 'Con dulce de leche, como debe ser.',
        photo: photos.dishes.flan,
      },
    ],
  },

  menu: {
    kicker: 'El menú',
    title: 'Como una carta impresa, pero viva',
    body: 'Elegí una categoría para espiar la carta. Todo se cocina en el día, con productos de la zona.',
    downloadLabel: 'Descargar menú completo',
    downloadHref: '#menu',
    categories: [
      {
        id: 'pastas',
        name: 'Pastas',
        items: [
          {
            id: 'sorrentinos-jyq',
            name: 'Sorrentinos de jamón y queso',
            price: '$U 590',
            priceCents: 59000,
            description: 'Hechos en casa, salsa a elección',
          },
          {
            id: 'tallarines-toscana',
            name: 'Tallarines a la Toscana',
            price: '$U 540',
            priceCents: 54000,
            description: 'Crema, panceta y champiñones',
          },
          { id: 'noquis-papa', name: 'Ñoquis de papa', price: '$U 520', priceCents: 52000, description: 'Bolognesa o cuatro quesos' },
          { id: 'lasana-carne', name: 'Lasaña de carne', price: '$U 620', priceCents: 62000, description: 'Gratinada al horno' },
        ],
      },
      {
        id: 'pizzas',
        name: 'Pizzas',
        items: [
          {
            id: 'muzzarella-piedra',
            name: 'Muzzarella a la piedra',
            price: '$U 430',
            priceCents: 43000,
            description: 'Salsa de tomate y aceitunas',
          },
          { id: 'napolitana', name: 'Napolitana', price: '$U 480', priceCents: 48000, description: 'Tomate fresco, ajo y albahaca' },
          {
            id: 'toscana-especial',
            name: 'Toscana especial',
            price: '$U 560',
            priceCents: 56000,
            description: 'Jamón crudo, rúcula y parmesano',
          },
        ],
      },
      {
        id: 'carnes',
        name: 'Carnes',
        items: [
          { id: 'entrecot-parrilla', name: 'Entrecot a la parrilla', price: '$U 780', priceCents: 78000, description: 'Con papas rústicas' },
          { id: 'pollo-champinon', name: 'Pollo al champiñón', price: '$U 620', priceCents: 62000, description: 'Suprema con salsa cremosa' },
        ],
      },
      {
        id: 'picadas',
        name: 'Picadas',
        items: [
          { id: 'picada-dos', name: 'Picada para dos', price: '$U 890', priceCents: 89000, description: 'Fiambres, quesos y frituras' },
          { id: 'tabla-mar', name: 'Tabla de mar', price: '$U 980', priceCents: 98000, description: 'Rabas, langostinos y limón' },
        ],
      },
      {
        id: 'postres',
        name: 'Postres',
        items: [
          { id: 'tiramisu', name: 'Tiramisú', price: '$U 320', priceCents: 32000, description: 'Receta clásica de la casa' },
          { id: 'flan-casero', name: 'Flan casero', price: '$U 260', priceCents: 26000, description: 'Con dulce de leche' },
        ],
      },
      {
        id: 'vinos',
        name: 'Vinos',
        items: [
          { id: 'tannat-reserva', name: 'Tannat Reserva', price: '$U 380', priceCents: 38000, description: 'Copa o botella' },
          { id: 'chardonnay', name: 'Chardonnay', price: '$U 360', priceCents: 36000, description: 'Copa o botella' },
        ],
      },
    ],
  },

  order: {
    kicker: 'Pedí como quieras',
    title: 'La Toscana en tu mesa',
    ways: [
      {
        id: 'delivery',
        index: '01',
        name: 'Delivery',
        description: 'Llevamos La Toscana hasta tu casa, en Florida y alrededores.',
        cta: 'Pedir delivery',
        href: whatsapp('¡Hola! Quiero hacer un pedido con delivery.'),
      },
      {
        id: 'retiro',
        index: '02',
        name: 'Retiro',
        description: 'Pedí y pasá a buscarlo caliente por el restaurante, sin espera.',
        cta: 'Pedir para retirar',
        href: whatsapp('¡Hola! Quiero hacer un pedido para retirar por el local.'),
      },
      {
        id: 'whatsapp',
        index: '03',
        name: 'WhatsApp',
        description: 'Escribinos y armamos tu pedido en una conversación.',
        cta: 'Abrir WhatsApp',
        href: whatsapp('¡Hola La Toscana! Quería hacer un pedido.'),
      },
    ],
  },

  promos: {
    title: 'La semana en La Toscana',
    subtitle: 'Cada noche tiene su excusa',
    items: [
      {
        id: 'martes',
        day: 'Martes',
        name: 'Pizza + copa',
        description: 'Pizza a la piedra con copa de vino de la casa.',
      },
      {
        id: 'miercoles',
        day: 'Miércoles',
        name: 'Hamburguesa La Toscana',
        description: 'Nuestra hamburguesa insignia con papas.',
      },
      {
        id: 'jueves',
        day: 'Jueves',
        name: 'Picada para dos',
        description: 'Fiambres, quesos y frituras para compartir.',
      },
      {
        id: 'finde',
        day: 'Fin de semana',
        name: 'Cocina completa',
        description: 'La carta entera, música y sobremesa larga.',
      },
    ],
  },

  reservations: {
    kicker: 'Reservas',
    title: 'Tu mesa te espera',
    body: 'Reservá por WhatsApp en menos de un minuto. Para grupos grandes o fechas especiales, escribinos y lo armamos juntos.',
    whatsappCta: {
      label: 'Reservar por WhatsApp',
      href: whatsapp('¡Hola! Quiero reservar una mesa en La Toscana.'),
    },
    phoneCta: { label: 'Llamar al restaurante', href: 'tel:+59893379047' },
    photo: photos.reservations,
  },

  events: {
    kicker: 'Eventos y celebraciones',
    title: 'Festejá como te gusta',
    body: 'Cumpleaños, despedidas, cenas de empresa o una cata entre amigos: preparamos el brindis, el menú especial y todo lo demás. Vos solo traé a tu gente.',
    types: [
      { name: 'Cumpleaños', detail: 'Brindis y torta incluidos' },
      { name: 'Despedidas', detail: 'Menú por persona a medida' },
      { name: 'Cenas de empresa', detail: 'Salón reservado' },
      { name: 'Música en vivo y catas', detail: 'Fechas especiales' },
    ],
    cta: {
      label: 'Consultar por un evento',
      href: whatsapp('¡Hola! Quiero consultar por un evento en La Toscana.'),
    },
    photo: photos.events,
  },

  gallery: {
    title: 'Estar en La Toscana',
    linkLabel: '@latoscanaflorida',
    linkHref: 'https://www.instagram.com/latoscanaflorida',
    photos: [...photos.gallery],
  },

  reviews: {
    kicker: 'Lo que se dice',
    items: [
      {
        id: 'mariana',
        text: 'La mejor pasta de Florida, sin discusión. El ambiente te hace quedarte una hora más.',
        name: 'Mariana G.',
        source: 'Google',
      },
      {
        id: 'pablo',
        text: 'Fuimos por un cumpleaños y se encargaron de todo. Impecable atención.',
        name: 'Pablo F.',
        source: 'Instagram',
      },
      {
        id: 'lucia',
        text: 'Pedimos delivery casi todas las semanas. Llega siempre perfecto.',
        name: 'Lucía R.',
        source: 'WhatsApp',
      },
    ],
  },

  location: {
    kicker: 'Visitanos',
    title: 'Florida, Uruguay',
    rows: [
      {
        label: 'Dirección',
        value: 'Florida, Uruguay',
        href: 'https://www.google.com/maps/search/?api=1&query=La+Toscana+Florida+Uruguay',
      },
      { label: 'Horarios', value: 'Martes a domingo · 20:00 – 00:30' },
      { label: 'WhatsApp', value: '093 379 047', href: whatsapp('¡Hola La Toscana!') },
      {
        label: 'Instagram',
        value: '@latoscanaflorida',
        href: 'https://www.instagram.com/latoscanaflorida',
      },
    ],
    photo: photos.location,
    mapHref: 'https://www.google.com/maps/search/?api=1&query=La+Toscana+Florida+Uruguay',
    mapLinkLabel: 'Ver en Google Maps',
  },

  finalCta: {
    kicker: '¿Cenamos?',
    title: 'Descubrí momentos inolvidables',
    primaryCta: { label: 'Reservar', href: '#reservas' },
    secondaryCta: { label: 'Pedir ahora', href: '#pedir' },
  },

  footer: {
    navHeading: 'Navegación',
    contactHeading: 'Contacto',
    hoursHeading: 'Horarios',
    legal: '© 2026 La Toscana · Florida, Uruguay',
    colophon: 'Diseño editorial · hecho con cariño',
  },
}

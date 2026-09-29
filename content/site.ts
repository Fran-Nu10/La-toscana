import { photos, real } from './photos'
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
    /* Respaldo del chip del hero cuando hoy no hay promo (el chip muestra la
       promo del día cuando es martes, miércoles o jueves). */
    text: 'Martes a jueves · promos con refresco de regalo',
  },

  nav: [
    { label: 'Carta', href: '#menu' },
    { label: 'Experiencia', href: '#experiencia' },
    { label: 'Promos', href: '#promos' },
    { label: 'Eventos', href: '#eventos' },
    { label: 'Galería', href: '#galeria' },
    { label: 'Ubicación', href: '#ubicacion' },
  ],

  hero: {
    /* Las cuatro respuestas de la primera pantalla: qué es, qué se come,
       cuándo abre y dónde queda. */
    kicker: 'Restaurante · Parrilla · Florida',
    title: 'Parrilla, pastas y sobremesa larga',
    subtitle: 'Carnes a la leña, pastas caseras y pizza en un salón cálido de Florida. Para compartir acá o pedir a casa.',
    tagline: 'Más que un plato, creamos experiencias únicas.',
    /* Pedir lidera, reservar acompaña — el mismo orden en toda la página. */
    primaryCta: { label: 'Pedir ahora', href: '#menu' },
    secondaryCta: { label: 'Reservar mesa', href: '#reservas' },
    metaLeft: 'Martes a domingo · 20:00 – 00:30',
    metaRight: 'Florida · Uruguay',
    photo: real.milanesa,
    photoCaption: 'Recién salida de la cocina',
    secondaryPhoto: real.trago,
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
    photos: [real.parrillero, real.asado],
    photoCaption: 'La parrilla, a la leña',
  },

  film: {
    kicker: 'Desde adentro',
    title: 'Un día en La Toscana',
    body: 'El fuego encendido, la parrilla cargada, los tragos saliendo de la barra y el salón lleno. Así se ve una noche en Florida.',
    caption: 'Parrilla a leña · asado de tira · tragos · salón',
    description:
      'Video sin sonido: copas frente al fuego, el parrillero trabajando la leña, asado de tira en la parrilla, tragos frutales, el salón con clientes, un brasero frente al cartel de La Toscana y platos de la casa.',
    sources: [
      { src: '/media/video/un-dia-en-la-toscana-720.webm', type: 'video/webm; codecs="vp9"' },
      { src: '/media/video/un-dia-en-la-toscana-720.mp4', type: 'video/mp4; codecs="avc1.640028"' },
    ],
    ambientSources: [
      { src: '/media/video/un-dia-en-la-toscana-ambient.webm', type: 'video/webm; codecs="vp9"' },
      { src: '/media/video/un-dia-en-la-toscana-ambient.mp4', type: 'video/mp4; codecs="avc1.4d400c"' },
    ],
    poster: '/media/video/un-dia-en-la-toscana-poster.jpg',
    ambientPoster: '/media/video/un-dia-en-la-toscana-ambient.jpg',
    width: 720,
    height: 1280,
    cta: { label: 'Reservar mesa', href: '#reservas' },
  },

  dishes: {
    title: 'Platos de la casa',
    menuLinkLabel: 'Ver toda la carta',
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
    kicker: 'La carta',
    title: 'Qué hay para comer',
    body: 'Tocá un plato para verlo, elegir opciones y sumarlo a tu pedido. Todo se cocina en el día, con productos de la zona.',
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
    kicker: 'Cómo pedir',
    title: 'La Toscana en tu mesa',
    ways: [
      {
        id: 'delivery',
        index: '01',
        name: 'Delivery',
        description: 'Llevamos La Toscana hasta tu casa, en Florida y alrededores.',
        cta: 'Pedir delivery',
        href: '#menu',
      },
      {
        id: 'retiro',
        index: '02',
        name: 'Retiro',
        description: 'Pedí y pasá a buscarlo caliente por el restaurante, sin espera.',
        cta: 'Pedir para retirar',
        href: '#menu',
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
    kicker: 'Promos de la semana',
    title: 'Tres noches, tres promos',
    body: 'Todas llevan un refresco de 1 litro de regalo y son sólo por delivery. Pedilas por WhatsApp.',
    items: [
      {
        id: 'martes',
        day: 'Martes',
        weekday: 2,
        name: 'Gramajo para 2',
        description: 'Gramajo para compartir con refresco de 1 L de regalo.',
        condition: 'Sólo delivery',
        flyer: real.promoMartes,
        cta: {
          label: 'Pedir la promo',
          href: whatsapp('¡Hola La Toscana! Quiero la Promo Martes: gramajo para 2 con refresco de regalo.'),
        },
      },
      {
        id: 'miercoles',
        day: 'Miércoles',
        weekday: 3,
        name: 'Rueda de muzza',
        description: 'Una rueda de muzzarella con refresco de 1 L de regalo.',
        condition: 'Sólo delivery',
        flyer: real.promoMiercoles,
        cta: {
          label: 'Pedir la promo',
          href: whatsapp('¡Hola La Toscana! Quiero la Promo Miércoles: rueda de muzza con refresco de regalo.'),
        },
      },
      {
        id: 'jueves',
        day: 'Jueves',
        weekday: 4,
        name: 'Brasero con guarnición',
        description: 'Brasero de carnes con guarnición y refresco de 1 L de regalo.',
        condition: 'Sólo delivery',
        flyer: real.promoJueves,
        cta: {
          label: 'Pedir la promo',
          href: whatsapp('¡Hola La Toscana! Quiero la Promo Jueves: brasero con guarnición y refresco de regalo.'),
        },
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
    photo: real.salon,
  },

  events: {
    kicker: 'Eventos y celebraciones',
    title: 'Festejá como te gusta',
    body: 'Cumpleaños, despedidas y cenas de empresa en un salón íntimo: brindis, menú a medida y atención personalizada. Vos traé a tu gente; del resto nos encargamos.',
    types: [
      { name: 'Cumpleaños', detail: 'Brindis y menú especial' },
      { name: 'Despedidas', detail: 'Todo listo para festejar' },
      { name: 'Cenas de empresa', detail: 'Menú a medida' },
      { name: 'Salón íntimo', detail: 'Atención personalizada' },
    ],
    cta: {
      label: 'Reservá tu fecha',
      href: whatsapp('¡Hola! Quiero consultar por un evento en La Toscana.'),
    },
    photo: real.flyerEventos,
  },

  gallery: {
    kicker: 'Así se vive',
    title: 'Estar en La Toscana',
    linkLabel: '@latoscanaflorida',
    linkHref: 'https://www.instagram.com/latoscanaflorida',
    items: [
      { photo: real.ensalada, caption: 'Ensalada con pollo crocante' },
      { photo: real.fuegoCopas, caption: 'Copas frente al fuego' },
      { photo: real.sandwich, caption: 'Sándwich en pan casero' },
      { photo: real.brasero, caption: 'Brasero frente al cartel' },
      { photo: real.tragosBarra, caption: 'Tragos de la barra' },
    ],
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
    title: 'Te esperamos en Florida',
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
    photo: real.cartel,
    mapHref: 'https://www.google.com/maps/search/?api=1&query=La+Toscana+Florida+Uruguay',
    mapLinkLabel: 'Ver en Google Maps',
  },

  finalCta: {
    kicker: '¿Cenamos?',
    title: 'Esta noche, La Toscana',
    primaryCta: { label: 'Pedir ahora', href: '#menu' },
    secondaryCta: { label: 'Reservar mesa', href: '#reservas' },
  },

  footer: {
    navHeading: 'Navegación',
    contactHeading: 'Contacto',
    hoursHeading: 'Horarios',
    legal: '© 2026 La Toscana · Florida, Uruguay',
    colophon: 'Cocina italiana, hecha en casa',
    adminLabel: 'Acceso restaurante',
  },
}

# La Toscana

Sitio web de **La Toscana**, restaurante gastronómico en Florida, Uruguay.

Una web gastronómica contemporánea, pensada desde el celular: fotografía
protagonista, tipografía con carácter y tres acciones claras — **pedir**,
**reservar** y **contactar**. No es una plantilla de restaurante ni una app
de delivery: es un storefront con identidad propia y un e-commerce completo.

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript · CSS Modules
**Deploy:** Vercel · página estática (`○ prerendered as static content`)

---

## Empezar

Requiere Node 20 o superior.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de producción
npm run typecheck  # tsc --noEmit
```

---

## Qué hay en la página

Una sola homepage, en este orden: header · hero · platos de la casa · la carta ·
cómo pedir · la experiencia · promos de la semana · reservas · eventos ·
galería · reseñas · ubicación · cierre · footer.

El orden no es decorativo: primero el impacto, después lo que se come y cómo
pedirlo (quien llega desde Instagram o Maps casi siempre viene a comer), luego
la historia y las razones para volver, y al final las pruebas y los datos
prácticos.

Fuera de la home: `/checkout` (finalizar pedido y confirmación) y
`/pedido/[token]` (seguimiento), con su propio marco mínimo (`ShopShell`).

---

## Estructura

| Carpeta | Qué hay |
| --- | --- |
| `app/` | `layout.tsx` (fuentes, metadata + JSON-LD), `page.tsx` (la homepage), `globals.css` (primitivas), rutas de checkout, pedido y admin |
| `components/` | Una sección por archivo, cada una con su CSS Module al lado |
| `components/shop/` | Tarjeta y hoja de producto, carrito, marco de las pantallas de compra, iconos |
| `content/` | **Todo el texto, los precios y los datos de contacto** |
| `styles/tokens.css` | El design system: todos los tokens |
| `public/fotos/` | Donde van las fotos reales |

---

## Editar el contenido

**Ningún componente tiene texto adentro.** Todo sale de `content/site.ts`, tipado
en `content/types.ts`. Para los cambios del día a día no hace falta tocar nada más:

| Quiero cambiar… | Dónde |
| --- | --- |
| Un precio, un horario, el teléfono | `content/site.ts` |
| Agregar un plato destacado | Un objeto más en `dishes.items` |
| Agregar un plato a la carta | Un objeto más en la categoría de `menu.categories` |
| La promo destacada del hero | `promoBar.text` (o `enabled: false` para apagarla) |
| Los mensajes de WhatsApp | La función `whatsapp()` arriba de `content/site.ts` |

El botón **"cargar más platos"** se ajusta solo: muestra `dishes.initialCount` y
revela de a `dishes.step`. Si mañana hay 30 platos, sigue funcionando igual.

### Cuando el contenido pase a un CMS

`content/index.ts` es el único punto de lectura. Ya es `async` y ya se llama desde
un Server Component, así que migrar a un CMS o a una API es cambiar una función y
nada más:

```ts
export async function getSiteContent(): Promise<SiteContent> {
  const res = await fetch(`${process.env.CMS_URL}/homepage`, {
    next: { revalidate: 300 },
  })
  return toSiteContent(await res.json())
}
```

---

## Las fotos

> **Las fotos actuales son provisorias.** Son imágenes libres de Unsplash puestas
> para poder ver la página terminada. La fotografía es el activo más importante de
> este sitio: conviene reemplazarlas por fotos reales del salón, la cocina y los
> platos antes de publicar.

`content/photos.ts` es el único archivo con imágenes. Para reemplazarlas:

1. Poné los archivos en `public/fotos/`.
2. Cambiá el `src` a `/fotos/sorrentinos.jpg`.

No hay que tocar ningún componente. `<Photo>` acepta tanto una URL de CDN como una
ruta local.

Cada foto declara además:

- **`alt`** — texto real en español; es un sitio público, importa.
- **`tone`** — un lavado cálido que se ve mientras la imagen carga y que queda en
  su lugar si el archivo falta, para que un hueco nunca se vea como una imagen rota.
- **`focal`** *(opcional)* — el `object-position` del recorte. En el celular los
  marcos son verticales y en escritorio apaisados; esto mantiene el plato en cuadro
  en los dos.

---

## Diseño

La dirección visual es **restaurante contemporáneo premium**: marfil cálido de
base, espresso como tinta, y acentos tomados de la cocina —terracota, oliva,
vino, bronce— usados con moderación. Fotografía a sangre y con radio, sin
marcos ni filetes; superficies con profundidad apenas perceptible.

### Tipografía

- **Fraunces** (serif) sólo para la marca, los titulares y las frases
  editoriales.
- **DM Sans** para toda la interfaz: navegación, precios, botones, formularios,
  chips, carrito y checkout.

Las dos se sirven desde el propio dominio con `next/font` (sin pedido a un
tercero, sin salto de layout). La escala es fluida pero contenida: el display
más grande no pasa de 72px.

### Tokens

`styles/tokens.css` es la única fuente de verdad: color, tipografía,
espaciado, radios, sombras, foco y movimiento. `app/globals.css` construye
encima las primitivas compartidas —`.btn` y sus variantes, `.chip`, `.badge`,
`.input`, `.card`, `.frame`, `.notice`, `.rail`, `.kicker`, `.title`, `.lede`—
y cada sección tiene su CSS Module sólo para su composición. Ningún componente
escribe un color o un radio a mano.

El panel de administración conserva su propio sistema
(`components/admin/admin.module.css`) y sólo comparte la serif de marca.

### Mobile-first

Las reglas base son las de 360–430px y los breakpoints **agregan**. Patrones
propios del teléfono: rieles con scroll-snap (platos, promos, galería,
reseñas), chips de categoría pegajosos en la carta, hoja inferior para el
detalle de producto y para el carrito, y una barra flotante con el subtotal.
Desde escritorio: header fijo con navegación, modal a dos columnas para el
producto, panel lateral para el carrito, y resumen pegajoso en el checkout.

Verificado a 360 / 390 / 430 / 768 / 1024 / 1280 / 1440 / 1920: sin scroll
horizontal y ningún control por debajo de 44px.

### Accesibilidad

HTML semántico, un solo `h1`, `alt` en todas las fotos, skip link, foco
visible con el mismo anillo en toda la web, diálogos con `role="dialog"`,
foco atrapado y devuelto, `Escape` que cierra sólo la capa superior, y
`prefers-reduced-motion` que apaga toda animación.

### Performance

Sin librerías de animación ni de carrusel. Las animaciones usan sólo
`transform` y `opacity`. Todo `:hover` está detrás de `@media (hover: hover)`.
Las imágenes van por `next/image` con `sizes` real y marcos con
`aspect-ratio`; sólo el hero es `priority`.

## Deploy

El proyecto está en la raíz del repo, así que Vercel lo detecta solo:

1. [vercel.com/new](https://vercel.com/new) → **Import Git Repository** → `Fran-Nu10/La-toscana`
2. Framework **Next.js**, Root Directory `./`, el resto por defecto
3. **Deploy** — no hace falta ninguna variable de entorno para que levante

| Variable | Para qué |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | El dominio de producción. Sin ella el sitio funciona igual, pero las URLs absolutas de Open Graph no resuelven. |

Cada push a `main` dispara un deploy nuevo.

---

## Estado

La landing conserva su diseño editorial y suma un e-commerce local completo para validar la experiencia antes de conectar infraestructura:

- carta comprable con variantes, cantidades y observaciones;
- carrito persistente y checkout con delivery o retiro;
- confirmación y seguimiento de estados;
- panel en `/admin` para pedidos, catálogo, categorías y configuración (PIN demo: `2026`);
  usa su propio sistema visual (`components/admin/admin.module.css`): misma paleta
  y serif de marca que la web, pero sans de interfaz, escala tipográfica fija y
  densidad de herramienta en vez de la escala editorial de la landing;
- datos de demostración persistidos en `localStorage`.

Esta persistencia es deliberadamente local: sirve para pruebas en un único navegador y no para producción ni datos personales reales. La separación `data/`, `repositories/` y `services/` permite conectar Supabase en la fase siguiente sin reescribir la UI. Ver `ARCHITECTURE.md`.

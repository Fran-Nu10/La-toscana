# La Toscana — sitio web

Homepage de **La Toscana**, restaurante gastronómico en Florida, Uruguay.
Implementación en Next.js del diseño exportado desde Claude Design
(`../project/La Toscana Web.dc.html`), sobre el design system **Classical**.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de producción
npm run typecheck  # tsc --noEmit
```

## Cómo está armado

| Carpeta | Qué hay |
| --- | --- |
| `app/` | `layout.tsx` (metadata, JSON-LD del restaurante), `page.tsx` (la homepage), `globals.css` |
| `components/` | Una sección por archivo, cada una con su CSS Module |
| `content/` | **Todo el texto, precios y datos de contacto** |
| `styles/classical.css` | El design system, copiado tal cual desde el bundle |

La página es estática (`○ prerendered as static content`): se sirve desde CDN y
sólo hidrata las tres piezas interactivas — el header móvil, el selector de
categorías de la carta y "cargar más platos".

### El contenido vive en un solo lugar

Ningún componente tiene texto adentro. Todo sale de `content/site.ts`, tipado en
`content/types.ts` y leído a través de `getSiteContent()`:

- cambiar un precio, un horario o el teléfono → `content/site.ts`
- agregar un plato → un objeto más en `dishes.items` (el botón "cargar más" se
  ajusta solo: muestra `initialCount` y revela de a `step`)
- agregar una categoría a la carta → un objeto más en `menu.categories`

Cuando el contenido pase a un CMS o a una API, el único archivo que cambia es
`content/index.ts` — la función ya es `async` y ya se llama desde un Server
Component, así que nada río abajo se entera:

```ts
export async function getSiteContent(): Promise<SiteContent> {
  const res = await fetch(`${process.env.CMS_URL}/homepage`, { next: { revalidate: 300 } })
  return toSiteContent(await res.json())
}
```

### Las fotos

`content/photos.ts` es el único archivo con imágenes. Hoy apunta a fotos libres
de Unsplash **como provisorio**: el diseño está hecho para que la fotografía sea
la protagonista, así que conviene reemplazarlas por fotos reales del salón, la
cocina y los platos antes de publicar.

Para reemplazarlas: poné los archivos en `public/fotos/` y cambiá `src` a
`/fotos/sorrentinos.jpg`. No hay que tocar ningún componente — `<Photo>` acepta
tanto una URL del CDN (a la que le arma el `srcset`) como una ruta local.

Cada foto declara un `tone`: un lavado cálido que se ve mientras la imagen carga
y que queda en su lugar si el archivo falta, para que un hueco nunca se vea como
una imagen rota.

> **Nota:** las URLs de Unsplash se escribieron sin poder abrirlas (el entorno
> donde se implementó tiene bloqueado el acceso a CDNs de imágenes), así que
> conviene revisar de una pasada que las 18 carguen. Si alguna no existe, se ve
> el lavado cálido en lugar de la foto y se arregla cambiando esa línea.

## Lo que quedó como diseño, no como función

El diseño es la vista comercial completa; estas piezas están listas visualmente
pero todavía no tienen backend:

- **Reservas** — los CTA abren WhatsApp con el mensaje escrito. No hay
  disponibilidad ni confirmación automática todavía.
- **Pedidos** (delivery / retiro / WhatsApp) — los tres caminos abren WhatsApp.
  No hay carrito ni pasarela de pago.
- **"Descargar menú completo"** — apunta a `#menu` hasta que exista el PDF;
  cambiá `menu.downloadHref` cuando esté.
- **Ubicación** — hay foto + link a Google Maps. Para embeber el mapa hace falta
  la dirección exacta; el link ya está en `location.mapHref`.
- **Promo bar** — se apaga con `promoBar.enabled: false` en `content/site.ts`.

## Sistema responsive (mobile-first)

El sitio está escrito desde el teléfono hacia afuera: las reglas base son las de
360–430px y los breakpoints agregan, nunca corrigen.

**Tokens** (`app/globals.css`). Nada de márgenes sueltos ni tamaños arbitrarios:

| Token | Para qué |
| --- | --- |
| `--gutter` | Margen lateral de página: `clamp(20px, 5.2vw, 32px)` |
| `--section-y` / `--section-y-lg` | Los dos únicos ritmos verticales de sección |
| `--block-gap` | Del título al contenido |
| `--card-gap` | Entre tarjetas |
| `--tap` | 48px — alto mínimo de un control |
| `--fs-display … --fs-micro` | Escala tipográfica fluida, toda en `clamp()` |

**Breakpoints**, puestos donde el contenido los pide y no por dispositivo:

- **600px** — entra una segunda columna (platos, promos, footer)
- **900px** — se abren los spreads editoriales a dos columnas y entra la
  navegación de escritorio; el panel de menú se retira
- **1200px** — la grilla de platos pasa a cuatro y se usa la medida completa

Hay tres ajustes puntuales fuera de esa escala (480px para que los botones del
hero entren en fila, 620–899px para la fila horizontal de "Pedí como quieras",
700px para la grilla de galería). Cada uno está comentado en su archivo.

**Patrones móviles**

- **Rieles con scroll-snap** en Platos y Galería: la foto se mantiene grande y
  la próxima tarjeta asoma. Es CSS nativo — sin librería de carrusel, sin JS.
- **Chips horizontales** para las categorías de la carta: seis filas apiladas
  empujaban la carta fuera de pantalla.
- **Agenda** en Promos: el día como ancla en su columna, la semana se lee de
  un saque.
- **Fila horizontal** en Pedí como quieras entre 620 y 899px, donde una tarjeta
  a ancho completo dejaba media fila vacía.

**Jerarquía de CTA.** Pedir es la acción primaria en toda la página (en la barra
sticky, en el hero, en el menú); Reservar acompaña. La barra sticky lleva el
CTA — no hay navegación inferior ni chrome de app.

**Verificado** a 360 / 390 / 430 / 600 / 768 / 1024 / 1280 / 1440 / 1920: sin
scroll horizontal, sin elementos fuera de viewport, ningún control de menos de
40px de alto, ningún texto funcional bajo 11px.

## Detalles de implementación

- **Tokens.** Ningún color, tipografía ni radio está hardcodeado: todo sale de
  `var(--*)` de `styles/classical.css`. Para actualizar el design system,
  volvé a copiar ese archivo desde el bundle.
- **Tipografías.** Cormorant Garamond y Lora se cargan por `@import` de Google
  Fonts dentro del stylesheet del design system.
- **Imágenes.** Todas pasan por `next/image` con `fill` y un `sizes` real, sobre
  un marco con `aspect-ratio` fijo: el espacio queda reservado antes de que
  llegue el archivo, así que no hay layout shift. Sólo el hero es `priority`;
  el resto es lazy. Cada foto puede declarar un `focal` (`object-position`) para
  sobrevivir al recorte vertical del celular.
- **Performance.** La página es estática y sólo hidratan tres piezas (header,
  carta, cargar más). Los rieles son scroll-snap de CSS, las animaciones son
  sólo `transform`/`opacity`, y no hay ninguna librería de animación ni de
  carrusel. Primer load: ~113 kB de JS, casi todo el runtime de Next.
- **Micro-interacciones.** Las secciones aparecen con un fade-up al entrar en
  pantalla (`components/Reveal.tsx`). El efecto está detrás de una clase `.js`
  que se pone antes del primer pintado, así que sin JavaScript nada queda
  invisible, y se desactiva entero con `prefers-reduced-motion`. Todo `:hover`
  está detrás de `@media (hover: hover)` para que no quede pegado tras un toque;
  los estados táctiles usan `:active`.
- **Accesibilidad.** La carta es un `tablist` navegable con flechas, el menú
  móvil bloquea el scroll, mueve el foco, cierra con `Escape` y devuelve el foco
  al botón; cerrado queda `inert` (fuera del orden de tabulación). Hay skip link,
  jerarquía de encabezados sin saltos (un solo `h1`), `alt` en todas las fotos y
  el foco usa el anillo del design system.
- **SEO.** `metadata` en español rioplatense + JSON-LD `Restaurant` con horarios
  y teléfono. Definí `NEXT_PUBLIC_SITE_URL` cuando haya dominio para que las
  URLs absolutas de Open Graph se resuelvan.

# La Toscana

Sitio web de **La Toscana**, restaurante gastronómico en Florida, Uruguay.

Una homepage editorial de scroll largo, pensada desde el celular: fotografía
grande, tipografía con carácter y dos acciones claras — **pedir** y **reservar**.
No es una app metida en una pantalla de teléfono ni una plantilla de restaurante:
es una web responsive con identidad propia.

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

Una sola homepage, en este orden: barra de promo · header · hero · la
experiencia · platos de la casa · la carta · formas de pedir · promos de la
semana · reservas · eventos y celebraciones · galería · testimonios · ubicación ·
cierre · footer.

El orden no es decorativo: primero el impacto, después la historia, después las
dos cosas que la persona vino a hacer (pedir, reservar), y recién al final las
pruebas y los datos prácticos.

---

## Estructura

| Carpeta | Qué hay |
| --- | --- |
| `app/` | `layout.tsx` (metadata + JSON-LD del restaurante), `page.tsx` (la homepage), `globals.css` (tokens y primitivas), `icon.svg` |
| `components/` | Una sección por archivo, cada una con su CSS Module al lado |
| `content/` | **Todo el texto, los precios y los datos de contacto** |
| `styles/classical.css` | El design system, copiado tal cual desde su bundle |
| `public/fotos/` | Donde van las fotos reales |

Sólo hidratan tres piezas en el cliente: el menú del header, el selector de
categorías de la carta y el botón "cargar más platos". Todo lo demás es HTML
estático.

---

## Editar el contenido

**Ningún componente tiene texto adentro.** Todo sale de `content/site.ts`, tipado
en `content/types.ts`. Para los cambios del día a día no hace falta tocar nada más:

| Quiero cambiar… | Dónde |
| --- | --- |
| Un precio, un horario, el teléfono | `content/site.ts` |
| Agregar un plato destacado | Un objeto más en `dishes.items` |
| Agregar un plato a la carta | Un objeto más en la categoría de `menu.categories` |
| La promo de la barra superior | `promoBar.text` (o `enabled: false` para apagarla) |
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

El sistema visual es **Classical** (`styles/classical.css`): fondo claro casi
neutro, Cormorant Garamond sobre Lora, filetes de 1px, botones delineados y fotos
montadas como láminas (`.plate`). Ningún color, tipografía ni radio está escrito a
mano — todo sale de `var(--*)`. Para actualizar el sistema, se vuelve a copiar ese
archivo.

### Mobile-first

Las reglas base son las de 360–430px y los breakpoints **agregan**, no corrigen.
Espaciado y tipografía son tokens fluidos (`clamp()`) definidos en `app/globals.css`:
`--gutter`, `--section-y`, `--block-gap`, `--card-gap`, `--tap` (48px) y la escala
`--fs-display … --fs-micro`.

Los breakpoints están donde el contenido los pide, no por dispositivo:

- **600px** — entra una segunda columna
- **900px** — se abren los spreads a dos columnas y aparece la navegación de escritorio
- **1200px** — la grilla de platos pasa a cuatro

Patrones propios del celular: rieles con **scroll-snap** en platos y galería (CSS
nativo, sin librería de carrusel), **chips horizontales** para las categorías de la
carta, y una **agenda** para las promos de la semana.

Verificado a 360 / 390 / 430 / 600 / 768 / 1024 / 1280 / 1440 / 1920: sin scroll
horizontal, sin elementos fuera del viewport, ningún control de menos de 40px de
alto y ningún texto funcional por debajo de 11px.

### Accesibilidad

HTML semántico, un solo `h1` y jerarquía de encabezados sin saltos, `alt` en todas
las fotos, skip link, y el anillo de foco del design system. La carta es un
`tablist` navegable con flechas; el menú móvil bloquea el scroll, mueve el foco,
cierra con `Escape`, lo devuelve al botón y queda `inert` mientras está cerrado.

### Performance

Sin librerías de animación ni de carrusel. Las animaciones usan sólo `transform` y
`opacity`, y se apagan enteras con `prefers-reduced-motion`. Todo `:hover` está
detrás de `@media (hover: hover)` para que no quede pegado después de un toque.
Las imágenes van por `next/image` con `sizes` real y un marco con `aspect-ratio`
fijo, así que el espacio queda reservado y no hay layout shift; sólo el hero es
`priority`. Primer load: **~113 kB** de JavaScript, casi todo el runtime de Next.

---

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

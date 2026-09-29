# Material real de La Toscana

Esta carpeta guarda los **originales** tal como llegaron (no se publican).
Lo que usa la web vive en `public/media/`, ya procesado.

## Estructura publicada

| Carpeta | Qué hay |
| --- | --- |
| `public/media/food/` | Platos y tragos reales (fotos de Instagram y cuadros del reel) |
| `public/media/restaurant/` | El parrillero, el fuego, el salón, el cartel y el flyer de eventos |
| `public/media/promos/` | Los flyers oficiales de las promos de martes, miércoles y jueves |
| `public/media/brand/` | El logo script de La Toscana como máscara transparente |
| `public/media/video/` | El reel "Un día en La Toscana" en versiones web, póster y capa ambiente |

## De dónde sale cada archivo

| Archivo publicado | Origen |
| --- | --- |
| `food/milanesa-gratinada-cartel.jpg` | `imgi_34_…jpg` (1080×1920) |
| `food/ensalada-pollo-crocante.jpg` | `imgi_22_…jpg` (1440×1800) |
| `food/trago-frutilla.jpg` | `imgi_70_…jpg` (1440×1477) |
| `food/muzzarella-a-la-piedra.jpg` | Recorte sin texto de `promomiercoles.jpg` (460×575) |
| `food/asado-de-tira-parrilla.jpg` | Cuadro del reel, segundo 8,6 |
| `food/sandwich-casero.jpg` | Cuadro del reel, segundo 17,4 |
| `food/tragos-de-la-barra.jpg` | Cuadro del reel, segundo 10,6 |
| `food/brasero-cartel.jpg` | Cuadro del reel, segundo 20,2 |
| `restaurant/parrillero-fuego.jpg` | Cuadro del reel, segundo 6,3 |
| `restaurant/fuego-copas.jpg` | Cuadro del reel, segundo 3,3 |
| `restaurant/salon-lleno.jpg` | Cuadro del reel, segundo 24,6 |
| `restaurant/cartel-salon.jpg` | Cuadro del reel, segundo 0,1 (antes del texto sobreimpreso) |
| `restaurant/flyer-cumples-despedidas.jpg` | `imgi_13_…jpg` (1351×1689) |
| `promos/promo-*.jpg` | `promomartes.jpg`, `promomiercoles.jpg`, `promojueves.jpg` |
| `brand/logo-la-toscana.png` | `imgi_71_…jpg`, logo recortado y convertido en máscara |
| `video/un-dia-en-la-toscana-*` | `3 Instagram.mp4` (ver abajo) |

## El video

El original es un reel vertical de 1080×1920, 37,7 s, VP9 con audio, 7,9 MB.
La versión web recorta del segundo 3,12 al 28,2: deja afuera la placa inicial
con el texto "Un día en la toscana" y el cierre con el texto de la despedida
de fin de año y la publicidad de cerveza. No lleva audio.

| Archivo | Uso |
| --- | --- |
| `un-dia-en-la-toscana-720.webm` | VP9 720×1280, ~2,2 MB. Chrome, Firefox, Edge |
| `un-dia-en-la-toscana-720.mp4` | H.264 High 720×1280, ~2,7 MB, `faststart`. Safari e iOS |
| `un-dia-en-la-toscana-ambient.*` | 144×256 difuminado, ~100 KB. Capa de fondo en pantallas apaisadas |
| `un-dia-en-la-toscana-poster.jpg` | Primer cuadro, 720×1280 |
| `un-dia-en-la-toscana-ambient.jpg` | Primer cuadro difuminado, 2 KB |

## Descartados o en espera

- `descartado-flyer-eventos.jpg` — pieza de eventos con copa de mojito. Se
  prefirió el flyer de "Cumples y despedidas", que es más cálido y legible.
- `descartado-panaderia-pessano.jpg` — flyer de Panadería Pessano, otro
  comercio. No corresponde a La Toscana.
- `en-espera-tiramisu-mostrador.jpg` — tiramisú con café para llevar, en un
  mostrador de confitería. No hay evidencia de que sea el tiramisú de la carta;
  queda guardado hasta confirmarlo.
- `descartado-miniatura-*-150.jpg` — miniaturas de 150×150: resolución
  insuficiente. Muestran logo, brasero, hamburguesa y muzza, que ya están
  cubiertos con material de mejor calidad.
- `logo-la-toscana-fondo-negro.jpg` — el original del logo; la web usa la
  máscara derivada.

## Reemplazar o sumar fotos

1. Guardá el archivo en la carpeta de `public/media/` que corresponda.
2. Registralo en `content/photos.ts` dentro de `real`, con `alt`, `tone`,
   dimensiones y, si hace falta, `focal`.
3. Para un plato del catálogo, apuntá el producto en `content/productPhotos.ts`.
   Esa es la única fuente de la foto en tarjeta, detalle y carrito.

Primeras fotos a conseguir: la muzzarella en buena resolución (la actual sale
del flyer y se ve blanda en pantallas retina) y los platos que todavía usan
stock (pastas, entrecot, pollo, picada, tabla de mar, postres y vinos).

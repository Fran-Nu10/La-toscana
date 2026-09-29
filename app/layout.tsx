import type { Metadata, Viewport } from 'next'
import { DM_Sans, Fraunces } from 'next/font/google'
import type { ReactNode } from 'react'
import { getSiteContent, type SiteContent } from '@/content'
import './globals.css'
import { CartProvider } from '@/components/CartProvider'
import { Cart } from '@/components/Cart'
import { CommerceProvider } from '@/components/CommerceProvider'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

/* Fraunces (marca y titulares) + DM Sans (toda la interfaz). next/font las
   descarga en el build y las sirve desde el propio dominio: sin pedido a un
   tercero, sin salto de layout, con `font-display: swap`. */
const serif = Fraunces({
  subsets: ['latin'],
  axes: ['opsz', 'SOFT'],
  /* Sin cursiva: ninguna pieza de la web la usa y costaba ~150 KB de precarga. */
  style: ['normal'],
  display: 'swap',
  variable: '--font-fraunces',
})
const sans = DM_Sans({
  subsets: ['latin'],
  axes: ['opsz'],
  display: 'swap',
  variable: '--font-dm-sans',
})

export const viewport: Viewport = {
  themeColor: '#f5efe4',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteContent()

  return {
    ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
    title: {
      default: `${site.brand.name} · Restaurante gastronómico en Florida, Uruguay`,
      template: `%s · ${site.brand.name}`,
    },
    description: site.brand.description,
    keywords: [
      'restaurante Florida Uruguay',
      'La Toscana Florida',
      'pastas caseras',
      'pizza a la piedra',
      'delivery Florida',
      'reservas restaurante',
    ],
    openGraph: {
      type: 'website',
      locale: 'es_UY',
      siteName: site.brand.name,
      title: `${site.brand.name} · Restaurante gastronómico en Florida, Uruguay`,
      description: site.brand.tagline,
    },
    robots: { index: true, follow: true },
  }
}

/** Structured data — this is a real restaurant page; give search the facts. */
function restaurantJsonLd(site: SiteContent) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: site.brand.name,
    description: site.brand.description,
    servesCuisine: ['Italiana', 'Parrilla', 'Pizza'],
    priceRange: '$$',
    telephone: site.brand.phone.tel.replace('tel:', ''),
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Florida',
      addressCountry: 'UY',
    },
    sameAs: [site.brand.instagram.href],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '20:00',
        closes: '00:30',
      },
    ],
    acceptsReservations: true,
  }
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const site = await getSiteContent()

  return (
    <html lang="es-UY" className={`${serif.variable} ${sans.variable}`}>
      <body>
        {/* Gates the reveal animation on scripting so the page is never hidden
            when JS is off or still loading. Runs before the body paints. */}
        <script
          dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }}
        />
        <CommerceProvider>
          <CartProvider>
            {children}
            <Cart />
          </CartProvider>
        </CommerceProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd(site)) }}
        />
      </body>
    </html>
  )
}

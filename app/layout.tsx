import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { getSiteContent, type SiteContent } from '@/content'
import './globals.css'
import { CartProvider } from '@/components/CartProvider'
import { Cart } from '@/components/Cart'
import { CommerceProvider } from '@/components/CommerceProvider'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

export const viewport: Viewport = {
  themeColor: '#2d2b2b',
  width: 'device-width',
  initialScale: 1,
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
    <html lang="es-UY">
      <body>
        <CommerceProvider><CartProvider>
        {/* Gates the reveal animation on scripting so the page is never hidden
            when JS is off or still loading. Runs before the body paints. */}
        <script
          dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }}
        />
        {children}
        <Cart />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd(site)) }}
        />
        </CartProvider></CommerceProvider>
      </body>
    </html>
  )
}

import { getSiteContent } from '@/content'
import { Dishes } from '@/components/Dishes'
import { Events } from '@/components/Events'
import { Experience } from '@/components/Experience'
import { FinalCta } from '@/components/FinalCta'
import { Footer } from '@/components/Footer'
import { Gallery } from '@/components/Gallery'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { Location } from '@/components/Location'
import { Menu } from '@/components/Menu'
import { Order } from '@/components/Order'
import { Promos } from '@/components/Promos'
import { Reservations } from '@/components/Reservations'
import { Reviews } from '@/components/Reviews'

/**
 * La home: un solo recorrido del hero al footer.
 *
 * Orden: impacto (hero) → qué se come (platos, carta) → cómo pedir → por qué
 * volver (experiencia, promos) → reservar → celebrar → ambiente → prueba
 * social → datos prácticos → cierre. Lo comercial va antes que la historia
 * porque quien llega desde Instagram o Maps viene, casi siempre, a comer.
 */
export default async function HomePage() {
  const site = await getSiteContent()

  return (
    <>
      <a href="#inicio" className="skipLink">
        Saltar al contenido
      </a>

      <Header
        brand={site.brand.name}
        nav={site.nav}
        order={{ label: 'Pedir', href: '#menu' }}
        reserve={{ label: 'Reservar', href: '#reservas' }}
        contact={{
          hours: site.brand.hours,
          closed: site.brand.closed,
          whatsappHref: site.brand.whatsapp.href,
          whatsappLabel: site.brand.whatsapp.display,
          instagramHref: site.brand.instagram.href,
          instagramHandle: site.brand.instagram.handle,
        }}
      />

      <main>
        <Hero hero={site.hero} promo={site.promoBar.enabled ? site.promoBar.text : undefined} />
        <Dishes dishes={site.dishes} />
        <Menu menu={site.menu} />
        <Order order={site.order} />
        <Experience experience={site.experience} />
        <Promos promos={site.promos} />
        <Reservations reservations={site.reservations} />
        <Events events={site.events} />
        <Gallery gallery={site.gallery} />
        <Reviews reviews={site.reviews} />
        <Location location={site.location} />
        <FinalCta finalCta={site.finalCta} />
      </main>

      <Footer site={site} />
    </>
  )
}

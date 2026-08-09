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
import { PromoBar } from '@/components/PromoBar'
import { Promos } from '@/components/Promos'
import { Reservations } from '@/components/Reservations'
import { Reviews } from '@/components/Reviews'

/**
 * The homepage: one editorial scroll from the hero to the footer. Sections are
 * ordered as the design lays them out — impact, then story, then the two things
 * a guest came to do (pedir, reservar), then proof and practicalities.
 */
export default async function HomePage() {
  const site = await getSiteContent()

  return (
    <>
      <a href="#inicio" className="skipLink">
        Saltar al contenido
      </a>

      {site.promoBar.enabled && <PromoBar text={site.promoBar.text} />}

      <Header
        brand={site.brand.name}
        nav={site.nav}
        order={{ label: 'Pedir', href: '#pedir' }}
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
        <Hero hero={site.hero} />
        <Experience experience={site.experience} />

        <div className="hr pageRule" />

        <Dishes dishes={site.dishes} />
        <Menu menu={site.menu} />
        <Order order={site.order} />
        <Promos promos={site.promos} />
        <Reservations reservations={site.reservations} />
        <Events events={site.events} />
        <Gallery gallery={site.gallery} />

        <div className="hr pageRule" />

        <Reviews reviews={site.reviews} />
        <Location location={site.location} />
        <FinalCta finalCta={site.finalCta} />
      </main>

      <Footer site={site} />
    </>
  )
}

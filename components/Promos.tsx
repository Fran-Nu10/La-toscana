'use client'

import { useEffect, useRef, useState } from 'react'
import type { SiteContent } from '@/content'
import { Photo } from './Photo'
import { ShopIcons } from './shop/icons'
import styles from './Promos.module.css'

/**
 * Promos de la semana, con los flyers oficiales.
 *
 * Los flyers son verticales como una historia de Instagram, así que se
 * muestran completos, sin recortar ni una letra, en tarjetas con su propia
 * proporción. Debajo, el mismo contenido en HTML (día, promo, condición) para
 * que nada dependa del texto incrustado en la imagen, y un CTA directo a
 * WhatsApp con el mensaje escrito.
 *
 * La noche de hoy se marca con "Hoy" y, en teléfono, el riel arranca en ella.
 */
export function Promos({ promos }: { promos: SiteContent['promos'] }) {
  const [today, setToday] = useState<number | null>(null)
  const railRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const day = new Date().getDay()
    setToday(day)
    const rail = railRef.current
    const card = rail?.querySelector<HTMLElement>(`[data-weekday="${day}"]`)
    // Sólo mueve el riel horizontal (nunca la página) y sólo si desborda.
    if (rail && card && rail.scrollWidth > rail.clientWidth) {
      rail.scrollLeft = card.offsetLeft - rail.offsetLeft - parseFloat(getComputedStyle(rail).paddingLeft)
    }
  }, [])

  return (
    <section id="promos" className={`section ${styles.section}`}>
      <div className="container">
        <div className={styles.head}>
          <div className="sectionHead">
            <p className="kicker">{promos.kicker}</p>
            <h2 className="title">{promos.title}</h2>
            <p className="lede">{promos.body}</p>
          </div>
          <p className={styles.note}>
            {ShopIcons.delivery}
            Sólo delivery · martes a jueves
          </p>
        </div>

        <ul className={`rail ${styles.rail}`} ref={railRef}>
          {promos.items.map((promo) => {
            const isToday = today === promo.weekday
            return (
              <li
                key={promo.id}
                className={`${styles.card} ${isToday ? styles.today : ''}`}
                data-weekday={promo.weekday}
              >
                <article className={styles.article} aria-labelledby={`promo-${promo.id}`}>
                  <div
                    className={styles.flyer}
                    style={{
                      aspectRatio: `${promo.flyer.width ?? 9} / ${promo.flyer.height ?? 16}`,
                    }}
                  >
                    <Photo
                      photo={promo.flyer}
                      sizes="(min-width: 1100px) 340px, (min-width: 720px) 30vw, 74vw"
                    />
                  </div>

                  <div className={styles.body}>
                    <div className={styles.dayRow}>
                      <span className={styles.day}>{promo.day}</span>
                      {isToday && <span className="badge badge--accent">Hoy</span>}
                    </div>
                    <h3 className={styles.name} id={`promo-${promo.id}`}>
                      {promo.name}
                    </h3>
                    <p className={styles.description}>{promo.description}</p>
                    <p className={styles.condition}>{promo.condition}</p>
                    <a
                      href={promo.cta.href}
                      className={`btn ${isToday ? 'btn--primary' : 'btn--secondary'} ${styles.cta}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${promo.cta.label}: ${promo.day}, ${promo.name}, por WhatsApp`}
                    >
                      {ShopIcons.whatsapp}
                      {promo.cta.label}
                    </a>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

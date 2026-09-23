import type { SiteContent } from '@/content'
import { Photo } from './Photo'
import { ShopIcons } from './shop/icons'
import styles from './Reservations.module.css'

/**
 * Reservas: una tarjeta fotográfica grande, con radio, dentro del ancho de
 * página. Convive con "Pedir" sin competirle: las acciones son claras pero la
 * paleta es la de la noche, no la del botón principal.
 */
export function Reservations({ reservations }: { reservations: SiteContent['reservations'] }) {
  return (
    <section id="reservas" className={`section ${styles.section}`}>
      <div className="container">
        <div className={styles.card}>
          <div className={styles.photo}>
            <Photo photo={reservations.photo} sizes="(min-width: 1280px) 1200px, 100vw" />
          </div>
          <div className={styles.scrim} aria-hidden="true" />

          <div className={styles.content}>
            <p className="kicker kicker--dark">{reservations.kicker}</p>
            <h2 className={styles.title}>{reservations.title}</h2>
            <p className={styles.body}>{reservations.body}</p>
            <div className={styles.actions}>
              <a
                href={reservations.whatsappCta.href}
                className="btn btn--light btn--lg"
                target="_blank"
                rel="noopener noreferrer"
              >
                {ShopIcons.whatsapp}
                {reservations.whatsappCta.label}
              </a>
              <a href={reservations.phoneCta.href} className="btn btn--lightGhost btn--lg">
                {ShopIcons.phone}
                {reservations.phoneCta.label}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

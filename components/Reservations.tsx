import type { SiteContent } from '@/content'
import { Photo } from './Photo'
import styles from './Reservations.module.css'

export function Reservations({ reservations }: { reservations: SiteContent['reservations'] }) {
  return (
    <section id="reservas" className={styles.section}>
      <div className={styles.photo}>
        <Photo photo={reservations.photo} sizes="100vw" />

      </div>
      <div className={styles.scrim} aria-hidden="true" />

      <div className={styles.content}>
        <p className="kicker kicker--hero">{reservations.kicker}</p>
        <h2 className={styles.title}>{reservations.title}</h2>
        <p className={styles.body}>{reservations.body}</p>
        <div className={styles.actions}>
          <a
            href={reservations.whatsappCta.href}
            className={`btn btnDarkAccent ${styles.action}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {reservations.whatsappCta.label}
          </a>
          <a href={reservations.phoneCta.href} className={`btn btnDark ${styles.action}`}>
            {reservations.phoneCta.label}
          </a>
        </div>
      </div>
    </section>
  )
}

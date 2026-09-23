import type { SiteContent } from '@/content'
import { Photo } from './Photo'
import { ShopIcons } from './shop/icons'
import styles from './Hero.module.css'

type Props = {
  hero: SiteContent['hero']
  /** La promo de la semana, como un chip discreto sobre el titular. */
  promo?: string
}

/**
 * La primera pantalla vende la comida y la experiencia. Fotografía a sangre,
 * el titular abajo a la izquierda donde el degradé es más profundo, y las dos
 * acciones en el orden de toda la web: pedir primero, reservar después.
 * Desde escritorio, un panel con horario y ciudad ocupa el vacío de la derecha.
 */
export function Hero({ hero, promo }: Props) {
  return (
    <section id="inicio" className={styles.hero}>
      <div className={styles.photo}>
        <Photo photo={hero.photo} sizes="100vw" priority />
      </div>
      <div className={styles.scrim} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.content}>
          {promo && (
            <p className={styles.promo}>
              <span className={styles.promoDot} aria-hidden="true" />
              {promo}
            </p>
          )}
          <p className={`kicker kicker--plain ${styles.kicker}`}>{hero.kicker}</p>
          <h1 className={styles.title}>{hero.title}</h1>
          <p className={styles.subtitle}>{hero.subtitle}</p>

          <div className={styles.actions}>
            <a href={hero.primaryCta.href} className={`btn btn--light btn--lg ${styles.action}`}>
              {hero.primaryCta.label}
              {ShopIcons.arrow}
            </a>
            <a href={hero.secondaryCta.href} className={`btn btn--lightGhost btn--lg ${styles.action}`}>
              {hero.secondaryCta.label}
            </a>
          </div>

          <ul className={styles.meta}>
            <li className={styles.metaItem}>
              {ShopIcons.clock}
              <span className="tnum">{hero.metaLeft}</span>
            </li>
            <li className={styles.metaItem}>
              {ShopIcons.pin}
              <span>{hero.metaRight}</span>
            </li>
          </ul>
        </div>

        <p className={styles.tagline}>
          <span className={styles.taglineMark} aria-hidden="true">
            “
          </span>
          {hero.tagline}
        </p>
      </div>
    </section>
  )
}

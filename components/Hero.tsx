import type { SiteContent } from '@/content'
import { Photo } from './Photo'
import styles from './Hero.module.css'

/**
 * The first screen. On a phone the composition is bottom-anchored so the
 * photograph keeps the upper half and the type sits on the darkest part of the
 * frame; from 900px up it centres, as the desktop design does.
 */
export function Hero({ hero }: { hero: SiteContent['hero'] }) {
  return (
    <section id="inicio" className={styles.hero}>
      <div className={styles.photo}>
        {/* The one image that blocks the fold: eager, high priority, and sized
            so a 390px phone never downloads a desktop file. */}
        <Photo photo={hero.photo} sizes="100vw" priority />
      </div>
      <div className={styles.scrim} aria-hidden="true" />

      <div className={styles.content}>
        <p className={`kicker kicker--hero ${styles.kicker}`}>{hero.kicker}</p>
        <h1 className={styles.title}>{hero.title}</h1>
        <p className={styles.subtitle}>{hero.subtitle}</p>
        <p className={styles.tagline}>{hero.tagline}</p>

        <div className={styles.actions}>
          <a href={hero.primaryCta.href} className={`btn btnDarkAccent ${styles.action}`}>
            {hero.primaryCta.label}
          </a>
          <a href={hero.secondaryCta.href} className={`btn btnDark ${styles.action}`}>
            {hero.secondaryCta.label}
          </a>
        </div>

        <p className={styles.meta}>
          <span className="tnum">{hero.metaLeft}</span>
          <span className={styles.metaDot} aria-hidden="true" />
          <span>{hero.metaRight}</span>
        </p>
      </div>
    </section>
  )
}

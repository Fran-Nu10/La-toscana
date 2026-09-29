import type { Promo, SiteContent } from '@/content'
import { Photo } from './Photo'
import { TodayPromo } from './TodayPromo'
import { ShopIcons } from './shop/icons'
import styles from './Hero.module.css'

type Props = {
  hero: SiteContent['hero']
  promos: Promo[]
  /** Texto del chip cuando hoy no hay promo. */
  promoFallback?: string
}

/**
 * La primera pantalla vende La Toscana real: una milanesa recién servida
 * frente al cartel dorado del salón.
 *
 * Teléfono: la foto vertical a sangre ocupa la parte alta y el texto se apoya
 * sobre la noche, debajo del plato — nunca encima. Escritorio: composición
 * dividida, texto a la izquierda y la foto vertical enmarcada a la derecha,
 * con un trago de la barra superpuesto.
 */
export function Hero({ hero, promos, promoFallback }: Props) {
  return (
    <section id="inicio" className={styles.hero}>
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.media}>
          <div className={styles.mainPhoto}>
            {/* LCP: la única imagen priority de la página. */}
            <Photo photo={hero.photo} sizes="(min-width: 960px) 42vw, 100vw" priority />
            <span className={`badge badge--glass ${styles.caption}`}>{hero.photoCaption}</span>
          </div>
          <div className={styles.secondPhoto} aria-hidden="true">
            <Photo photo={hero.secondaryPhoto} sizes="240px" />
          </div>
        </div>

        <div className={styles.content}>
          {promoFallback && (
            <TodayPromo
              promos={promos}
              fallback={promoFallback}
              className={styles.promo}
              dotClassName={styles.promoDot}
            />
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
      </div>
    </section>
  )
}

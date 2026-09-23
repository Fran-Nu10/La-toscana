import type { SiteContent } from '@/content'
import { Reveal } from './Reveal'
import styles from './Promos.module.css'

/**
 * La semana: una tarjeta por noche, con el día en serif y el plato en sans.
 * Nada de banners con estrellas ni "-20%": la promo se lee como parte de la
 * carta, no como un aviso pegado encima.
 */
export function Promos({ promos }: { promos: SiteContent['promos'] }) {
  return (
    <Reveal as="section" id="promos" className={`section ${styles.section}`}>
      <div className="container">
        <div className="sectionHead">
          <p className="kicker">{promos.subtitle}</p>
          <h2 className="title">{promos.title}</h2>
        </div>

        <ul className={`rail ${styles.grid}`}>
          {promos.items.map((promo, index) => (
            <li key={promo.id} className={styles.card} data-index={index}>
              <span className={styles.day}>{promo.day}</span>
              <h3 className={styles.name}>{promo.name}</h3>
              <p className={styles.description}>{promo.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  )
}

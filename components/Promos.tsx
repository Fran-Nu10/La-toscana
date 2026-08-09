import type { SiteContent } from '@/content'
import { Reveal } from './Reveal'
import styles from './Promos.module.css'

export function Promos({ promos }: { promos: SiteContent['promos'] }) {
  return (
    <section id="promos" className={styles.section}>
      <Reveal className={styles.inner}>
        <div className={styles.head}>
          <h2 className="sectionTitle sectionTitle--sm sectionTitle--flush">{promos.title}</h2>
          <p className={styles.subtitle}>{promos.subtitle}</p>
        </div>

        <ul className={styles.grid}>
          {promos.items.map((promo) => (
            <li key={promo.id} className={styles.card}>
              <span className={styles.day}>{promo.day}</span>
              <h3 className={styles.name}>{promo.name}</h3>
              <p className={styles.description}>{promo.description}</p>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  )
}

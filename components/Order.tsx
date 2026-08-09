import type { SiteContent } from '@/content'
import { Reveal } from './Reveal'
import styles from './Order.module.css'

/**
 * "Pedí como quieras" — the three ways to buy.
 *
 * Each way ends in a real button rather than an underlined link: this is the
 * page's commercial centre, and on a phone the action has to be unmissable and
 * comfortably tappable.
 */
export function Order({ order }: { order: SiteContent['order'] }) {
  return (
    <Reveal as="section" id="pedir" className={styles.section}>
      <div className={styles.head}>
        <p className="kicker">{order.kicker}</p>
        <h2 className="sectionTitle">{order.title}</h2>
      </div>

      <ul className={styles.ways}>
        {order.ways.map((way) => (
          <li key={way.id} className={styles.way}>
            <span className={`${styles.index} tnum`} aria-hidden="true">
              {way.index}
            </span>
            <div className={styles.text}>
              <h3 className={styles.name}>{way.name}</h3>
              <p className={styles.description}>{way.description}</p>
            </div>
            <a
              href={way.href}
              className={`btn btn-primary ${styles.cta}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {way.cta}
            </a>
          </li>
        ))}
      </ul>
    </Reveal>
  )
}

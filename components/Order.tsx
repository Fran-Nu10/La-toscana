import type { SiteContent } from '@/content'
import { Reveal } from './Reveal'
import { ShopIcons } from './shop/icons'
import styles from './Order.module.css'

const ICONS: Record<string, React.ReactNode> = {
  delivery: ShopIcons.delivery,
  retiro: ShopIcons.store,
  whatsapp: ShopIcons.whatsapp,
}

/**
 * "Cómo pedir": tres caminos, tres tarjetas. Delivery y retiro llevan a la
 * carta; WhatsApp abre la conversación. Es una banda corta, no una sección
 * larga: la decisión se toma en un vistazo.
 */
export function Order({ order }: { order: SiteContent['order'] }) {
  return (
    <Reveal as="section" id="pedir" className={`section ${styles.section}`}>
      <div className="container">
        <div className={styles.grid}>
          <div className={`sectionHead ${styles.head}`}>
            <p className="kicker">{order.kicker}</p>
            <h2 className="title">{order.title}</h2>
          </div>

          <ul className={styles.ways}>
            {order.ways.map((way) => (
              <li key={way.id}>
                <a
                  href={way.href}
                  className={styles.way}
                  {...(way.href.startsWith('http')
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                >
                  <span className={styles.icon}>{ICONS[way.id] ?? ShopIcons.bag}</span>
                  <span className={styles.text}>
                    <span className={styles.name}>{way.name}</span>
                    <span className={styles.description}>{way.description}</span>
                  </span>
                  <span className={styles.cta}>
                    {way.cta}
                    {ShopIcons.arrow}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Reveal>
  )
}

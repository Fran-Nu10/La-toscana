import type { SiteContent } from '@/content'
import { Photo } from './Photo'
import { Reveal } from './Reveal'
import { ShopIcons } from './shop/icons'
import styles from './Events.module.css'

const TYPE_ICONS = [ShopIcons.cake, ShopIcons.glass, ShopIcons.users, ShopIcons.store]

/**
 * Eventos: el flyer real de "Cumples y despedidas" a un lado, completo, y del
 * otro los tipos de celebración como fichas con icono. Un solo CTA, a WhatsApp.
 */
export function Events({ events }: { events: SiteContent['events'] }) {
  return (
    <Reveal as="section" id="eventos" className="section">
      <div className={`container ${styles.grid}`}>
        {/* El flyer oficial se muestra completo: su texto es contenido real y
            no se recorta. El mismo texto vive en el alt y en la columna. */}
        <div
          className={`frame ${styles.photo}`}
          style={{ aspectRatio: `${events.photo.width ?? 4} / ${events.photo.height ?? 5}` }}
        >
          <Photo photo={events.photo} sizes="(min-width: 960px) 520px, 100vw" />
        </div>

        <div className={styles.text}>
          <p className="kicker">{events.kicker}</p>
          <h2 className="title">{events.title}</h2>
          <p className="lede">{events.body}</p>

          <ul className={styles.types}>
            {events.types.map((type, index) => (
              <li key={type.name} className={styles.type}>
                <span className={styles.typeIcon}>{TYPE_ICONS[index % TYPE_ICONS.length]}</span>
                <span className={styles.typeText}>
                  <span className={styles.typeName}>{type.name}</span>
                  <span className={styles.typeDetail}>{type.detail}</span>
                </span>
              </li>
            ))}
          </ul>

          <div className={styles.cta}>
            <a
              href={events.cta.href}
              className="btn btn--primary btn--lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              {ShopIcons.whatsapp}
              {events.cta.label}
            </a>
          </div>
        </div>
      </div>
    </Reveal>
  )
}

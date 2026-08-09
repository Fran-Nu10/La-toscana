import type { SiteContent } from '@/content'
import { Photo } from './Photo'
import { Reveal } from './Reveal'
import styles from './Events.module.css'

export function Events({ events }: { events: SiteContent['events'] }) {
  return (
    <Reveal as="section" id="eventos" className={styles.section}>
      <div className={styles.grid}>
        <div className={`plate ${styles.plate}`}>
          <Photo photo={events.photo} sizes="(min-width: 900px) 600px, 100vw" />
        </div>

        <div>
          <p className="kicker">{events.kicker}</p>
          <h2 className="sectionTitle">{events.title}</h2>
          <p className={styles.body}>{events.body}</p>

          <ul className={styles.types}>
            {events.types.map((type) => (
              <li key={type.name} className={styles.type}>
                <span className={styles.typeName}>{type.name}</span>
                <span className={styles.typeDetail}>{type.detail}</span>
              </li>
            ))}
          </ul>

          <div className={styles.cta}>
            <a
              href={events.cta.href}
              className={`btn btn-primary ${styles.ctaButton}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {events.cta.label}
            </a>
          </div>
        </div>
      </div>
    </Reveal>
  )
}

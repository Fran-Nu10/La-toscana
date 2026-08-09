import type { SiteContent } from '@/content'
import { Photo } from './Photo'
import styles from './Location.module.css'

/**
 * "Visitanos" — the practical answers: where, when, and how to reach them.
 * Every row that can be acted on is a link with a full-width tap area.
 */
export function Location({ location }: { location: SiteContent['location'] }) {
  return (
    <section id="ubicacion" className={styles.section}>
      <div className={styles.inner}>
        <div>
          <p className="kicker">{location.kicker}</p>
          <h2 className="sectionTitle sectionTitle--sm">{location.title}</h2>

          <dl className={styles.rows}>
            {location.rows.map((row) => (
              <div key={row.label} className={styles.row}>
                <dt className={styles.label}>{row.label}</dt>
                <dd className={styles.value}>
                  {row.href ? (
                    <a
                      href={row.href}
                      className={styles.valueLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {row.value}
                    </a>
                  ) : (
                    row.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className={styles.figure}>
          <div className={`plate ${styles.plate}`}>
            <Photo photo={location.photo} sizes="(min-width: 900px) 600px, 100vw" />
          </div>
          {/* Stands in for the embedded map until the exact address is
              confirmed — swap this frame for the iframe and keep the link. */}
          <a
            href={location.mapHref}
            className={`btn btn-secondary ${styles.mapLink}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {location.mapLinkLabel}
          </a>
        </div>
      </div>
    </section>
  )
}

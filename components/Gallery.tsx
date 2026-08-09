import type { SiteContent } from '@/content'
import { Photo } from './Photo'
import styles from './Gallery.module.css'

/** From 700px the 1st and 3rd frames run two rows tall, so the grid reads as a
 *  spread rather than a row of equal tiles. On a phone it is a swipe rail. */
const TALL_INDEXES = new Set([0, 2])

export function Gallery({ gallery }: { gallery: SiteContent['gallery'] }) {
  return (
    <section id="galeria" className={styles.section}>
      <div className={styles.head}>
        <h2 className="sectionTitle sectionTitle--sm sectionTitle--flush">{gallery.title}</h2>
        <a href={gallery.linkHref} className="ruleLink" target="_blank" rel="noopener noreferrer">
          {gallery.linkLabel}
        </a>
      </div>

      <ul className={styles.grid}>
        {gallery.photos.map((photo, index) => (
          <li
            key={`${photo.src}-${index}`}
            className={`plate ${styles.frame} ${TALL_INDEXES.has(index) ? styles.tall : ''}`}
          >
            <Photo photo={photo} sizes="(min-width: 700px) 25vw, 82vw" />
          </li>
        ))}
      </ul>
    </section>
  )
}

import type { SiteContent } from '@/content'
import { Reveal } from './Reveal'
import styles from './Reviews.module.css'

export function Reviews({ reviews }: { reviews: SiteContent['reviews'] }) {
  return (
    <Reveal as="section" id="testimonios" className={styles.section}>
      <div className={styles.head}>
        <p className="kicker">{reviews.kicker}</p>
      </div>

      <ul className={styles.grid}>
        {reviews.items.map((review) => (
          <li key={review.id} className={styles.cell}>
            <figure className={styles.card}>
              <div className={styles.stars} aria-label="5 de 5 estrellas">
                <span aria-hidden="true">★★★★★</span>
              </div>
              <blockquote className={styles.quote}>“{review.text}”</blockquote>
              <figcaption className={styles.meta}>
                <span>{review.name}</span>
                <span>{review.source}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </Reveal>
  )
}

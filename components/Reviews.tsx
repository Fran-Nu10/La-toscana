import type { SiteContent } from '@/content'
import { Reveal } from './Reveal'
import { ShopIcons } from './shop/icons'
import styles from './Reviews.module.css'

export function Reviews({ reviews }: { reviews: SiteContent['reviews'] }) {
  return (
    <Reveal as="section" id="testimonios" className={`section ${styles.section}`}>
      <div className="container">
        <div className={styles.head}>
          <p className="kicker">{reviews.kicker}</p>
          <div className={styles.rating} aria-label="5 de 5 estrellas">
            {[0, 1, 2, 3, 4].map((star) => (
              <span key={star} className={styles.star}>
                {ShopIcons.star}
              </span>
            ))}
          </div>
        </div>

        <ul className={`rail ${styles.grid}`}>
          {reviews.items.map((review) => (
            <li key={review.id} className={styles.card}>
              <figure className={styles.figure}>
                <span className={styles.quoteMark} aria-hidden="true">
                  {ShopIcons.quote}
                </span>
                <blockquote className={styles.quote}>{review.text}</blockquote>
                <figcaption className={styles.meta}>
                  <span className={styles.avatar} aria-hidden="true">
                    {review.name.charAt(0)}
                  </span>
                  <span className={styles.metaText}>
                    <span className={styles.name}>{review.name}</span>
                    <span className={styles.source}>vía {review.source}</span>
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  )
}

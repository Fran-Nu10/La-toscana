'use client'

import { useState } from 'react'
import type { SiteContent } from '@/content'
import { Photo } from './Photo'
import styles from './Dishes.module.css'

/**
 * "Platos de la casa".
 *
 * On a phone the dishes run as a swipeable rail with the next card peeking, so
 * the photography stays large enough to want — eight stacked full-width cards
 * would be a very long scroll for the same information. From 600px up it
 * becomes a grid: two across, then four at the full measure.
 *
 * The rail is native scroll-snap. No carousel library, no JavaScript.
 */
export function Dishes({ dishes }: { dishes: SiteContent['dishes'] }) {
  const [shown, setShown] = useState(dishes.initialCount)

  const visible = dishes.items.slice(0, shown)
  const hasMore = shown < dishes.items.length

  return (
    <section id="platos" className={styles.section}>
      <div className={styles.head}>
        <h2 className="sectionTitle sectionTitle--flush">{dishes.title}</h2>
        <a href="#menu" className="ruleLink">
          {dishes.menuLinkLabel}
        </a>
      </div>

      <ul className={styles.cards}>
        {visible.map((dish, index) => (
          <li
            key={dish.id}
            className={styles.card}
            /* Cards revealed by the button rise in one after the other. */
            data-fresh={index >= dishes.initialCount ? '' : undefined}
            style={
              index >= dishes.initialCount
                ? { animationDelay: `${((index - dishes.initialCount) % dishes.step) * 80}ms` }
                : undefined
            }
          >
            <div className={`plate ${styles.plate}`}>
              <Photo
                photo={dish.photo}
                sizes="(min-width: 1200px) 300px, (min-width: 600px) 45vw, 78vw"
              />
            </div>
            <div className={styles.text}>
              <div className={styles.nameRow}>
                <h3 className={styles.name}>{dish.name}</h3>
                <span className={`${styles.price} tnum`}>{dish.price}</span>
              </div>
              <p className={styles.description}>{dish.description}</p>
            </div>
          </li>
        ))}
      </ul>

      {hasMore && (
        <div className={styles.more}>
          <button
            type="button"
            className={`btn btn-secondary ${styles.moreButton}`}
            onClick={() => setShown((value) => Math.min(dishes.items.length, value + dishes.step))}
          >
            {dishes.loadMoreLabel}
          </button>
        </div>
      )}
    </section>
  )
}

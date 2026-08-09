'use client'

import { useRef, useState } from 'react'
import type { SiteContent } from '@/content'
import styles from './Menu.module.css'

/** Arrow keys move between tabs and Home/End jump to the ends, as a tablist
 *  is expected to behave — only the selected tab is in the tab order. */
function nextIndex(key: string, current: number, total: number): number | null {
  switch (key) {
    case 'ArrowDown':
    case 'ArrowRight':
      return (current + 1) % total
    case 'ArrowUp':
    case 'ArrowLeft':
      return (current - 1 + total) % total
    case 'Home':
      return 0
    case 'End':
      return total - 1
    default:
      return null
  }
}

/**
 * The carta — categories on the left, the chosen one set as a printed page on
 * the right. Built as a tablist so it works from the keyboard, not just a click.
 */
export function Menu({ menu }: { menu: SiteContent['menu'] }) {
  const [activeId, setActiveId] = useState(menu.categories[0]?.id)
  const active = menu.categories.find((category) => category.id === activeId) ?? menu.categories[0]
  const tabsRef = useRef<HTMLDivElement>(null)

  function onKeyDown(event: React.KeyboardEvent, index: number) {
    const target = nextIndex(event.key, index, menu.categories.length)
    if (target === null) return
    event.preventDefault()
    const category = menu.categories[target]
    setActiveId(category.id)
    tabsRef.current?.querySelector<HTMLButtonElement>(`#cat-${category.id}`)?.focus()
  }

  return (
    <section id="menu" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.head}>
          <p className="kicker kicker--dark">{menu.kicker}</p>
          <h2 className="sectionTitle sectionTitle--dark">{menu.title}</h2>
          <p className={styles.body}>{menu.body}</p>

          <div
            className={styles.categories}
            role="tablist"
            aria-label="Categorías de la carta"
            ref={tabsRef}
          >
            {menu.categories.map((category, index) => {
              const isActive = category.id === active.id
              return (
                <button
                  key={category.id}
                  type="button"
                  role="tab"
                  id={`cat-${category.id}`}
                  aria-selected={isActive}
                  aria-controls="carta"
                  tabIndex={isActive ? 0 : -1}
                  className={`${styles.category} ${isActive ? styles.categoryActive : ''}`}
                  onClick={() => setActiveId(category.id)}
                  onKeyDown={(event) => onKeyDown(event, index)}
                >
                  <span className={styles.categoryName}>{category.name}</span>
                  <span className={`${styles.categoryCount} tnum`}>
                    {String(category.items.length).padStart(2, '0')}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div className={styles.card} id="carta" role="tabpanel" aria-labelledby={`cat-${active.id}`}>
          <div className={styles.cardHead}>
            <span className={styles.cardTitle}>{active.name}</span>
            <span className={styles.cardMark}>La Toscana</span>
          </div>

          <div>
            {active.items.map((item) => (
              <div key={item.name} className={styles.item}>
                <div className={styles.itemRow}>
                  <span className={styles.itemName}>{item.name}</span>
                  <span className={styles.leader} aria-hidden="true" />
                  <span className={`${styles.itemPrice} tnum`}>{item.price}</span>
                </div>
                <div className={styles.itemDescription}>{item.description}</div>
              </div>
            ))}
          </div>

          <div className={styles.cardFoot}>
            <a href={menu.downloadHref} className={`btn ${styles.download}`}>
              {menu.downloadLabel}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

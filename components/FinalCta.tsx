import type { SiteContent } from '@/content'
import { ShopIcons } from './shop/icons'
import styles from './FinalCta.module.css'

export function FinalCta({ finalCta }: { finalCta: SiteContent['finalCta'] }) {
  return (
    <section className={styles.section}>
      <div className={`container ${styles.inner}`}>
        <p className="kicker kicker--dark">{finalCta.kicker}</p>
        <h2 className={styles.title}>{finalCta.title}</h2>
        <div className={styles.actions}>
          <a href={finalCta.primaryCta.href} className="btn btn--light btn--lg">
            {finalCta.primaryCta.label}
            {ShopIcons.arrow}
          </a>
          <a href={finalCta.secondaryCta.href} className="btn btn--lightGhost btn--lg">
            {finalCta.secondaryCta.label}
          </a>
        </div>
      </div>
    </section>
  )
}

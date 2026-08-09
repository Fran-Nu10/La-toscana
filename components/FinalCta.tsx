import type { SiteContent } from '@/content'
import styles from './FinalCta.module.css'

export function FinalCta({ finalCta }: { finalCta: SiteContent['finalCta'] }) {
  return (
    <section className={styles.section}>
      <p className={styles.kicker}>{finalCta.kicker}</p>
      <h2 className={styles.title}>{finalCta.title}</h2>
      <div className={styles.actions}>
        <a href={finalCta.primaryCta.href} className={`btn btnDarkAccent ${styles.action}`}>
          {finalCta.primaryCta.label}
        </a>
        <a href={finalCta.secondaryCta.href} className={`btn btnDark ${styles.action}`}>
          {finalCta.secondaryCta.label}
        </a>
      </div>
    </section>
  )
}

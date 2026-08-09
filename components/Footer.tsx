import type { SiteContent } from '@/content'
import styles from './Footer.module.css'

export function Footer({ site }: { site: SiteContent }) {
  const { brand, nav, footer } = site

  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div>
          <div className={styles.brand}>{brand.name}</div>
          <p className={styles.about}>{brand.description}</p>
        </div>

        <div>
          <div className={styles.heading}>{footer.navHeading}</div>
          <div className={styles.column}>
            {nav.map((link) => (
              <a key={link.href} href={link.href} className={styles.link}>
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <div className={styles.heading}>{footer.contactHeading}</div>
          <div className={styles.column}>
            <a href={brand.whatsapp.href} className={styles.link} target="_blank" rel="noopener noreferrer">
              WhatsApp · {brand.whatsapp.display}
            </a>
            <a href={brand.instagram.href} className={styles.link} target="_blank" rel="noopener noreferrer">
              Instagram · {brand.instagram.handle}
            </a>
            <span className={styles.text}>{brand.address}</span>
          </div>
        </div>

        <div>
          <div className={styles.heading}>{footer.hoursHeading}</div>
          <div className={`${styles.column} tnum`}>
            <span className={styles.text}>{brand.hours}</span>
            <span className={styles.text}>{brand.closed}</span>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <span>{footer.legal}</span>
        <span>{footer.colophon}</span>
      </div>
    </footer>
  )
}

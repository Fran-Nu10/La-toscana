import Link from 'next/link'
import type { SiteContent } from '@/content'
import { ShopIcons } from './shop/icons'
import styles from './Footer.module.css'

export function Footer({ site }: { site: SiteContent }) {
  const { brand, nav, footer } = site

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brandCol}>
          <span className={styles.brand}>{brand.name}</span>
          <p className={styles.about}>{brand.description}</p>
          <div className={styles.social}>
            <a
              href={brand.instagram.href}
              className={styles.socialBtn}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Instagram ${brand.instagram.handle}`}
            >
              {ShopIcons.instagram}
            </a>
            <a
              href={brand.whatsapp.href}
              className={styles.socialBtn}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`WhatsApp ${brand.whatsapp.display}`}
            >
              {ShopIcons.whatsapp}
            </a>
            <a href={brand.phone.tel} className={styles.socialBtn} aria-label={`Llamar al ${brand.phone.display}`}>
              {ShopIcons.phone}
            </a>
          </div>
        </div>

        <nav className={styles.col} aria-label="Navegación del pie">
          <span className={styles.heading}>{footer.navHeading}</span>
          <ul className={styles.list}>
            {nav.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={styles.link}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.col}>
          <span className={styles.heading}>{footer.contactHeading}</span>
          <ul className={styles.list}>
            <li>
              <a href={brand.whatsapp.href} className={styles.link} target="_blank" rel="noopener noreferrer">
                WhatsApp · <span className="tnum">{brand.whatsapp.display}</span>
              </a>
            </li>
            <li>
              <a href={brand.phone.tel} className={styles.link}>
                Teléfono · <span className="tnum">{brand.phone.display}</span>
              </a>
            </li>
            <li>
              <a href={brand.instagram.href} className={styles.link} target="_blank" rel="noopener noreferrer">
                {brand.instagram.handle}
              </a>
            </li>
            <li>
              <a href={brand.mapsHref} className={styles.link} target="_blank" rel="noopener noreferrer">
                {brand.address}
              </a>
            </li>
          </ul>
        </div>

        <div className={styles.col}>
          <span className={styles.heading}>{footer.hoursHeading}</span>
          <ul className={`${styles.list} tnum`}>
            <li className={styles.text}>{brand.hours}</li>
            <li className={styles.textMuted}>{brand.closed}</li>
          </ul>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <span>{footer.legal}</span>
        <span className={styles.colophon}>{footer.colophon}</span>
        <Link href="/admin" className={styles.admin}>
          {footer.adminLabel}
        </Link>
      </div>
    </footer>
  )
}

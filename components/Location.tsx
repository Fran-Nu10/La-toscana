import type { SiteContent } from '@/content'
import { Photo } from './Photo'
import { ShopIcons } from './shop/icons'
import styles from './Location.module.css'

const ROW_ICONS: Record<string, React.ReactNode> = {
  Dirección: ShopIcons.pin,
  Horarios: ShopIcons.clock,
  WhatsApp: ShopIcons.whatsapp,
  Instagram: ShopIcons.instagram,
}

/**
 * Ubicación: los datos prácticos en una tarjeta, cada fila con su icono y
 * un área de toque completa, y la foto del frente al lado. Dos acciones:
 * abrir Maps y escribir por WhatsApp.
 */
export function Location({ location }: { location: SiteContent['location'] }) {
  const whatsapp = location.rows.find((row) => row.label === 'WhatsApp')
  return (
    <section id="ubicacion" className={`section ${styles.section}`}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.text}>
          <p className="kicker">{location.kicker}</p>
          <h2 className="title">{location.title}</h2>

          <dl className={styles.rows}>
            {location.rows.map((row) => {
              const inner = (
                <>
                  <span className={styles.rowIcon}>{ROW_ICONS[row.label] ?? ShopIcons.pin}</span>
                  <span className={styles.rowText}>
                    <dt className={styles.label}>{row.label}</dt>
                    <dd className={`${styles.value} tnum`}>{row.value}</dd>
                  </span>
                  {row.href && <span className={styles.rowGo}>{ShopIcons.arrowUpRight}</span>}
                </>
              )
              return row.href ? (
                <a
                  key={row.label}
                  href={row.href}
                  className={`${styles.row} ${styles.rowLink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {inner}
                </a>
              ) : (
                <div key={row.label} className={styles.row}>
                  {inner}
                </div>
              )
            })}
          </dl>

          <div className={styles.actions}>
            <a href={location.mapHref} className="btn btn--primary btn--lg" target="_blank" rel="noopener noreferrer">
              {ShopIcons.pin}
              {location.mapLinkLabel}
            </a>
            {whatsapp?.href && (
              <a href={whatsapp.href} className="btn btn--secondary btn--lg" target="_blank" rel="noopener noreferrer">
                {ShopIcons.whatsapp}
                WhatsApp
              </a>
            )}
          </div>
        </div>

        <div className={`frame ${styles.photo}`}>
          <Photo photo={location.photo} sizes="(min-width: 960px) 560px, 100vw" />
        </div>
      </div>
    </section>
  )
}

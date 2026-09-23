import type { SiteContent } from '@/content'
import { Photo } from './Photo'
import { ShopIcons } from './shop/icons'
import styles from './Gallery.module.css'

/**
 * Galería editorial: en escritorio, una grilla asimétrica de seis cuadros con
 * dos protagonistas a doble altura; en teléfono, un riel a sangre con marcos
 * de distinto ancho, para que el ojo no lea una tira de miniaturas iguales.
 */
export function Gallery({ gallery }: { gallery: SiteContent['gallery'] }) {
  return (
    <section id="galeria" className={`section ${styles.section}`}>
      <div className="container">
        <div className="sectionHead sectionHead--split">
          <div className={styles.headText}>
            <p className="kicker">Ambiente</p>
            <h2 className="title">{gallery.title}</h2>
          </div>
          <a href={gallery.linkHref} className="textLink" target="_blank" rel="noopener noreferrer">
            {ShopIcons.instagram}
            {gallery.linkLabel}
          </a>
        </div>
      </div>

      <div className={`container ${styles.gridWrap}`}>
        <ul className={`rail ${styles.grid}`}>
          {gallery.photos.map((photo, index) => (
            <li key={`${photo.src}-${index}`} className={`frame ${styles.cell}`} data-cell={index}>
              <Photo photo={photo} sizes="(min-width: 960px) 33vw, (min-width: 640px) 50vw, 76vw" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

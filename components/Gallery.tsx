import type { SiteContent } from '@/content'
import { Photo } from './Photo'
import { ShopIcons } from './shop/icons'
import styles from './Gallery.module.css'

/**
 * Galería con material real, sobre la noche.
 *
 * Teléfono y tablet: un riel a sangre donde cada foto conserva su proporción
 * original a una altura común, así una foto 4:5 y una vertical de reel conviven
 * sin recortarse. Escritorio: grilla editorial asimétrica — la foto 4:5 como
 * protagonista a doble altura, una vertical completa a su lado y dos cuadros
 * menores apilados, cada uno con su punto focal.
 */
export function Gallery({ gallery }: { gallery: SiteContent['gallery'] }) {
  return (
    <section id="galeria" className={`section ${styles.section}`}>
      <div className="container">
        <div className="sectionHead sectionHead--split">
          <div className={styles.headText}>
            <p className="kicker kicker--dark">{gallery.kicker}</p>
            <h2 className="title title--dark">{gallery.title}</h2>
          </div>
          <a href={gallery.linkHref} className="textLink textLink--dark" target="_blank" rel="noopener noreferrer">
            {ShopIcons.instagram}
            {gallery.linkLabel}
          </a>
        </div>
      </div>

      <div className={`container ${styles.gridWrap}`}>
        <ul className={`rail ${styles.grid}`}>
          {gallery.items.map((item, index) => (
            <li
              key={item.photo.src}
              className={styles.cell}
              data-cell={index}
              style={{ ['--ratio' as string]: `${item.photo.width ?? 4} / ${item.photo.height ?? 5}` }}
            >
              <figure className={styles.figure}>
                <Photo
                  photo={item.photo}
                  sizes={index === 0 ? '(min-width: 960px) 50vw, 80vw' : '(min-width: 960px) 25vw, 60vw'}
                />
                <figcaption className={styles.caption}>{item.caption}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

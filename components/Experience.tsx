import type { SiteContent } from '@/content'
import { Photo } from './Photo'
import { Reveal } from './Reveal'
import styles from './Experience.module.css'

/**
 * La historia, en una composición asimétrica: dos fotografías superpuestas a
 * un lado, el texto y los números al otro. Sin marcos ni filetes — las fotos
 * se apilan con radio y una sombra apenas perceptible.
 */
export function Experience({ experience }: { experience: SiteContent['experience'] }) {
  const [roomPhoto, kitchenPhoto] = experience.photos

  return (
    <Reveal as="section" id="experiencia" className="section">
      <div className={`container ${styles.grid}`}>
        <div className={styles.photos}>
          <div className={`frame ${styles.photoMain}`}>
            <Photo photo={roomPhoto} sizes="(min-width: 960px) 520px, 88vw" />
          </div>
          <div className={`frame ${styles.photoSmall}`}>
            <Photo photo={kitchenPhoto} sizes="(min-width: 960px) 260px, 44vw" />
          </div>
        </div>

        <div className={styles.text}>
          <p className="kicker">{experience.kicker}</p>
          <h2 className="title">{experience.title}</h2>
          <p className={`lede ${styles.body}`}>{experience.body}</p>

          <dl className={styles.stats}>
            {experience.stats.map((stat) => (
              <div key={stat.label} className={styles.stat}>
                <dd className={`${styles.statValue} tnum`}>{stat.value}</dd>
                <dt className={styles.statLabel}>{stat.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Reveal>
  )
}

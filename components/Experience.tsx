import type { SiteContent } from '@/content'
import { Photo } from './Photo'
import { Reveal } from './Reveal'
import styles from './Experience.module.css'

export function Experience({ experience }: { experience: SiteContent['experience'] }) {
  const [roomPhoto, kitchenPhoto] = experience.photos

  return (
    <Reveal as="section" id="experiencia" className={styles.section}>
      <div className={styles.grid}>
        <div>
          <p className="kicker">{experience.kicker}</p>
          <h2 className="sectionTitle">{experience.title}</h2>
          <p className={styles.body}>{experience.body}</p>


          <div className={styles.stats}>
            {experience.stats.map((stat) => (
              <div key={stat.label} className={styles.stat}>
                <span className={`${styles.statValue} tnum`}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.photos}>
          <div className={`plate ${styles.plate} ${styles.plateOffset}`}>
            <Photo photo={roomPhoto} sizes="(min-width: 900px) 300px, 46vw" />
          </div>
          <div className={`plate ${styles.plate}`}>
            <Photo photo={kitchenPhoto} sizes="(min-width: 900px) 300px, 46vw" />
          </div>
        </div>
      </div>
    </Reveal>
  )
}

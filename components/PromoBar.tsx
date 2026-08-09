import styles from './PromoBar.module.css'

export function PromoBar({ text }: { text: string }) {
  return <div className={styles.bar}>{text}</div>
}

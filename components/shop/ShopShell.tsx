import Link from 'next/link'
import type { ReactNode } from 'react'
import { ShopIcons } from './icons'
import styles from './ShopShell.module.css'

type Props = {
  children: ReactNode
  /** Enlace de vuelta, en la barra: a la carta o al inicio. */
  back: { label: string; href: string }
  /** Ancho del contenido: el checkout necesita más que el seguimiento. */
  width?: 'narrow' | 'wide'
}

/**
 * Marco de las pantallas de compra fuera de la home (checkout, seguimiento):
 * barra mínima con la marca y una vuelta atrás, y el fondo marfil de la web.
 */
export function ShopShell({ children, back, width = 'narrow' }: Props) {
  return (
    <div className={styles.shell}>
      <header className={styles.bar}>
        <div className={`container ${styles.barInner}`}>
          <Link href={back.href} className={styles.back}>
            <span className={styles.backIcon}>{ShopIcons.arrow}</span>
            {back.label}
          </Link>
          <Link href="/" className={styles.brand} aria-label="La Toscana, inicio">
            <span className="brandMark" aria-hidden="true" />
          </Link>
        </div>
      </header>
      <main className={`container ${styles.main} ${width === 'wide' ? styles.wide : ''}`}>{children}</main>
    </div>
  )
}

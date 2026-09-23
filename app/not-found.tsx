import Link from 'next/link'
import { ShopShell } from '@/components/shop/ShopShell'

export default function NotFound() {
  return (
    <ShopShell back={{ label: 'Inicio', href: '/' }}>
      <div className="card" style={{ padding: 'clamp(32px, 6vw, 56px) 24px', textAlign: 'center' }}>
        <p className="kicker kicker--plain">404</p>
        <h1 className="title" style={{ marginTop: 12 }}>
          Esta página no está en la carta
        </h1>
        <p className="lede" style={{ margin: '12px auto 24px' }}>
          El enlace no existe o ya no está disponible.
        </p>
        <Link href="/" className="btn btn--primary">
          Volver al inicio
        </Link>
      </div>
    </ShopShell>
  )
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useCart } from './CartProvider'
import { useCommerce } from './CommerceProvider'
import { formatUyu, lineTotal } from '@/lib/order'
import { productPhoto } from '@/content/productPhotos'
import { Photo } from './Photo'
import { ShopIcons } from './shop/icons'
import { ProductSheet } from './shop/ProductSheet'
import { useDialog } from './shop/useDialog'
import styles from './shop/shop.module.css'

export function Cart() {
  const cart = useCart()
  const commerce = useCommerce()
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const drawerRef = useRef<HTMLElement>(null)

  // El carrito se monta en el layout raíz, así que también caía sobre el panel:
  // el dueño no compra desde el admin y el botón flotante tapaba los controles.
  // Fuera del panel y del checkout: en el admin el dueño no compra, y en el
  // checkout el botón flotante tapaba el formulario y ya no lleva a ningún lado.
  const pathname = usePathname()
  const hidden = Boolean(pathname?.startsWith('/admin') || pathname?.startsWith('/checkout'))

  const editingLine = cart.lines.find((line) => line.key === editingKey)
  const editingProduct = commerce.products.find((product) => product.id === editingLine?.productId)

  return (
    <>
      {!hidden && <CartFab />}
      {!hidden && cart.open && (
        <CartDrawer
          ref={drawerRef}
          onEdit={setEditingKey}
        />
      )}
      {!hidden && <CartToast />}

      {/* Editar reabre exactamente el mismo detalle, con la configuración
          cargada: no hay una segunda interfaz para lo mismo. */}
      {editingLine && editingProduct && (
        <ProductSheet
          product={editingProduct}
          line={editingLine}
          orderingOpen={commerce.settings.orderingOpen}
          onClose={() => setEditingKey(null)}
          onConfirm={(selections, quantity, notes) =>
            cart.update(editingLine.key, editingProduct, selections, quantity, notes)
          }
        />
      )}
    </>
  )
}

/** Botón flotante con el contador; late cada vez que entra algo al pedido. */
function CartFab() {
  const cart = useCart()
  const [bump, setBump] = useState(false)

  useEffect(() => {
    if (!cart.count) return
    setBump(true)
    const timer = window.setTimeout(() => setBump(false), 450)
    return () => window.clearTimeout(timer)
  }, [cart.count])

  if (!cart.count) return null

  return (
    <button
      type="button"
      className={`${styles.scope} ${styles.fab} ${bump ? styles.fabBump : ''}`}
      onClick={() => cart.setOpen(true)}
      aria-label={`Abrir el pedido, ${cart.count} ${cart.count === 1 ? 'producto' : 'productos'}`}
    >
      {ShopIcons.bag}
      Ver pedido
      <span className={styles.fabCount}>{cart.count}</span>
    </button>
  )
}

function CartDrawer({
  ref,
  onEdit,
}: {
  ref: React.RefObject<HTMLElement | null>
  onEdit(key: string): void
}) {
  const cart = useCart()
  const commerce = useCommerce()
  const close = () => cart.setOpen(false)
  useDialog(ref, close)

  const settings = commerce.settings
  const belowMinimum =
    settings.deliveryEnabled && cart.total > 0 && cart.total < settings.deliveryMinimumCents
  const missingAmount = settings.deliveryMinimumCents - cart.total

  return (
    <>
      <div className={styles.drawerBackdrop} onClick={close} role="presentation" />
      <aside
        ref={ref}
        className={`${styles.scope} ${styles.drawer}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="carrito-titulo"
        tabIndex={-1}
      >
        <header className={styles.drawerHead}>
          <div>
            <h2 className={styles.drawerTitle} id="carrito-titulo">
              Tu pedido
            </h2>
            <p className={styles.drawerCount}>
              {cart.count === 0
                ? 'Sin productos'
                : `${cart.count} ${cart.count === 1 ? 'producto' : 'productos'}`}
            </p>
          </div>
          <button
            type="button"
            className={styles.drawerClose}
            onClick={close}
            aria-label="Cerrar el pedido"
          >
            {ShopIcons.close}
          </button>
        </header>

        {cart.lines.length === 0 ? (
          <div className={styles.lines}>
            <div className={styles.emptyCart}>
              <span className={styles.emptyMark}>{ShopIcons.bag}</span>
              <span className={styles.emptyTitle}>Todavía no elegiste nada</span>
              <p className={styles.emptyText}>
                Mirá la carta y tocá cualquier plato para verlo y agregarlo a tu pedido.
              </p>
              <a href="#platos" className={styles.lineBtn} onClick={close} style={{ marginTop: 8 }}>
                Ver los platos
              </a>
            </div>
          </div>
        ) : (
          <div className={styles.lines}>
            {!settings.orderingOpen && (
              <p className={`${styles.notice} ${styles.noticeWarn}`}>
                {ShopIcons.alert}
                Ahora no estamos tomando pedidos. Podés dejarlo armado y enviarlo cuando abramos.
              </p>
            )}

            {cart.lines.map((line) => {
              const photo = productPhoto(line.productId)
              const stillAvailable = commerce.products.some(
                (product) => product.id === line.productId && product.available,
              )
              return (
                <article className={styles.line} key={line.key}>
                  <div className={styles.lineMedia}>
                    {photo ? (
                      <Photo photo={photo} sizes="72px" />
                    ) : (
                      <div className={styles.mediaFallback} aria-hidden="true">
                        {ShopIcons.plate}
                      </div>
                    )}
                  </div>

                  <div className={styles.lineBody}>
                    <div className={styles.lineTop}>
                      <span className={styles.lineName}>{line.name}</span>
                      <span className={styles.linePrice}>{formatUyu(lineTotal(line))}</span>
                    </div>

                    {line.selections.length > 0 && (
                      <ul className={styles.lineVariants}>
                        {line.selections.map((choice) => (
                          <li key={`${choice.optionId}-${choice.choiceId}`}>
                            {choice.name}
                            {choice.priceCents ? ` · +${formatUyu(choice.priceCents)}` : ''}
                          </li>
                        ))}
                      </ul>
                    )}

                    {line.notes && <p className={styles.lineNotes}>“{line.notes}”</p>}

                    {!stillAvailable && (
                      <p className={`${styles.notice} ${styles.noticeWarn}`}>
                        {ShopIcons.alert}
                        Este plato ya no está disponible.
                      </p>
                    )}

                    <div className={styles.lineActions}>
                      <div className={styles.lineStepper}>
                        <button
                          type="button"
                          className={styles.lineStepperBtn}
                          onClick={() => cart.quantity(line.key, line.quantity - 1)}
                          aria-label={`Quitar uno de ${line.name}`}
                        >
                          {ShopIcons.minus}
                        </button>
                        <span className={styles.lineQty}>{line.quantity}</span>
                        <button
                          type="button"
                          className={styles.lineStepperBtn}
                          onClick={() => cart.quantity(line.key, line.quantity + 1)}
                          aria-label={`Agregar uno de ${line.name}`}
                        >
                          {ShopIcons.plus}
                        </button>
                      </div>

                      <button
                        type="button"
                        className={styles.lineBtn}
                        onClick={() => onEdit(line.key)}
                      >
                        {ShopIcons.edit}
                        Editar
                      </button>

                      <button
                        type="button"
                        className={`${styles.lineBtn} ${styles.lineRemove}`}
                        onClick={() => cart.remove(line.key)}
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}

        {cart.lines.length > 0 && (
          <footer className={styles.drawerFoot}>
            {belowMinimum && (
              <p className={`${styles.notice} ${styles.noticeInfo}`}>
                {ShopIcons.alert}
                Te faltan {formatUyu(missingAmount)} para llegar al mínimo de delivery. También
                podés pasar a retirarlo.
              </p>
            )}
            <div className={`${styles.totalRow} ${styles.totalGrand}`}>
              <span>Subtotal</span>
              <strong>{formatUyu(cart.total)}</strong>
            </div>
            <p className={styles.ctaNote}>El costo de envío se calcula en el checkout.</p>
            <Link href="/checkout" className={styles.cta} onClick={close}>
              Continuar al checkout
            </Link>
          </footer>
        )}
      </aside>
    </>
  )
}

/** Aviso breve tras agregar o actualizar. */
function CartToast() {
  const cart = useCart()
  const { flash, dismissFlash } = cart

  useEffect(() => {
    if (!flash) return
    const timer = window.setTimeout(dismissFlash, 2000)
    return () => window.clearTimeout(timer)
  }, [flash, dismissFlash])

  // Con el panel abierto el cambio ya se ve en la lista; el toast sólo taparía
  // el subtotal.
  if (!flash || cart.open) return null

  return (
    <output className={`${styles.scope} ${styles.toast}`} key={flash.id}>
      <span className={styles.toastMark}>{ShopIcons.check}</span>
      {flash.text}
    </output>
  )
}

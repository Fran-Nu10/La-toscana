'use client'

import { useEffect, useState } from 'react'
import { useCommerce } from './CommerceProvider'
import { AdminLogin } from './admin/AdminLogin'
import { CategoriesPanel } from './admin/CategoriesPanel'
import { OrdersPanel } from './admin/OrdersPanel'
import { ProductsPanel } from './admin/ProductsPanel'
import { SettingsPanel } from './admin/SettingsPanel'
import { Icons } from './admin/ui'
import styles from './admin/admin.module.css'

type Tab = 'orders' | 'products' | 'categories' | 'settings'

const TABS: [Tab, string][] = [
  ['orders', 'Pedidos'],
  ['products', 'Productos'],
  ['categories', 'Categorías'],
  ['settings', 'Negocio'],
]

export function Admin() {
  const commerce = useCommerce()
  const [tab, setTab] = useState<Tab>('orders')
  const [toast, setToast] = useState('')

  /* La sesión se lee después de montar, no durante el render: leerla en el
     primer render daba distinto en el servidor que en el cliente y rompía la
     hidratación (React #418). `checked` evita además el parpadeo del login. */
  const [authenticated, setAuthenticated] = useState(false)
  const [checked, setChecked] = useState(false)
  useEffect(() => {
    setAuthenticated(sessionStorage.getItem('lt-admin-demo') === 'ok')
    setChecked(true)
  }, [])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 2200)
    return () => window.clearTimeout(timer)
  }, [toast])

  if (!checked) return <div className={styles.root} />
  if (!authenticated) return <AdminLogin onEnter={() => setAuthenticated(true)} />

  const pending = commerce.orders.filter((order) => order.status === 'pending').length

  return (
    <div className={styles.root}>
      <header className={styles.topbar}>
        <div className={styles.topbarInner}>
          <div className={styles.brand}>
            <span className={styles.brandMark}>La Toscana</span>
            <span className={styles.brandTag}>Panel</span>
          </div>
          <div className={styles.topbarActions}>
            <a className={`${styles.btn} ${styles.btnQuiet} ${styles.btnSmall}`} href="/">
              Ver el sitio
            </a>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnSmall}`}
              onClick={() => {
                sessionStorage.removeItem('lt-admin-demo')
                setAuthenticated(false)
              }}
            >
              Salir
            </button>
          </div>
        </div>

        <nav className={styles.tabs} aria-label="Secciones del panel">
          <div className={styles.tabsInner}>
            {TABS.map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={`${styles.tab} ${tab === value ? styles.tabActive : ''}`}
                aria-current={tab === value ? 'page' : undefined}
                onClick={() => setTab(value)}
              >
                {label}
                {value === 'orders' && pending > 0 && (
                  <span className={styles.tabCount}>{pending}</span>
                )}
              </button>
            ))}
          </div>
        </nav>
      </header>

      <main className={styles.main}>
        {tab === 'orders' && <OrdersPanel />}
        {tab === 'products' && <ProductsPanel onSaved={setToast} />}
        {tab === 'categories' && <CategoriesPanel onSaved={setToast} />}
        {tab === 'settings' && <SettingsPanel onSaved={setToast} />}
      </main>

      {/* El panel anterior no daba ninguna señal al guardar. */}
      {toast && (
        <output className={styles.toast}>
          {Icons.check}
          {toast}
        </output>
      )}
    </div>
  )
}

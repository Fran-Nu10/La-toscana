'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { useCommerce } from './CommerceProvider'
import type { Category, Product, ProductOption, Order, OrderStatus } from '@/data/types'
import { formatUyu } from '@/lib/order'
import { adminSession } from '@/lib/admin-session'
import styles from './Admin.module.css'

const statuses: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'delivering', 'completed', 'cancelled']
const statusLabels: Record<OrderStatus, string> = { pending: 'Nuevo', confirmed: 'Confirmado', preparing: 'Preparando', ready: 'Listo', delivering: 'En camino', completed: 'Finalizado', cancelled: 'Cancelado' }
type Tab = 'orders' | 'products' | 'categories' | 'settings'
type OrderFilter = 'all' | 'pending' | 'confirmed' | 'preparing' | 'ready' | 'finished'
const tabs: { id: Tab; label: string; hint: string }[] = [
  { id: 'orders', label: 'Pedidos', hint: 'Seguimiento de la cocina' },
  { id: 'products', label: 'Productos', hint: 'Carta y disponibilidad' },
  { id: 'categories', label: 'Categorías', hint: 'Orden de la carta' },
  { id: 'settings', label: 'Negocio', hint: 'Horarios y entregas' },
]
const slug = (value: string) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export function Admin() {
  const commerce = useCommerce()
  const [authenticated, setAuthenticated] = useState(false)
  useEffect(() => setAuthenticated(adminSession.hasSession()), [])
  const [tab, setTab] = useState<Tab>('orders')
  const [editing, setEditing] = useState<Product | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [orderFilter, setOrderFilter] = useState<OrderFilter>('all')

  function enterDemo() {
    adminSession.signInDemo()
    setAuthenticated(true)
  }

  function signOut() {
    adminSession.signOut()
    setAuthenticated(false)
    setTab('orders')
  }

  if (!authenticated) {
    return <main className={styles.login}>
      <section className={styles.loginCard} aria-labelledby="admin-login-title">
        <a className={styles.backLink} href="/">← Volver al restaurante</a>
        <p className="kicker">Gestión de La Toscana</p>
        <h1 id="admin-login-title">Tu restaurante,<br />en un solo lugar.</h1>
        <p className={styles.loginIntro}>Revisá pedidos y mantené la carta al día desde un panel simple, pensado para el ritmo del local.</p>
        <div className={styles.demoNotice}>
          <strong>Modo demostración</strong>
          <span>Los cambios se guardan únicamente en este navegador. No se solicitan credenciales.</span>
        </div>
        <button type="button" className={`btn btnPrimary ${styles.loginButton}`} onClick={enterDemo}>Entrar al panel demo</button>
        <small className={styles.futureAuth}>El acceso seguro del restaurante se habilitará en una próxima etapa.</small>
      </section>
      <aside className={styles.loginAside} aria-hidden="true"><span>La Toscana</span><p>Administración clara.<br />Servicio más simple.</p></aside>
    </main>
  }

  const draft = editing ?? { id: '', categoryId: commerce.categories[0]?.id ?? '', name: '', description: '', priceCents: 0, available: true, options: [] }
  const filteredOrders = commerce.orders.filter(order => orderFilter === 'all' || order.status === orderFilter || (orderFilter === 'finished' && ['completed', 'cancelled'].includes(order.status)))

  function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    commerce.saveProduct({ ...draft, id: draft.id || `${slug(String(form.get('name')))}-${Date.now()}`, categoryId: String(form.get('categoryId')), name: String(form.get('name')).trim(), description: String(form.get('description')).trim(), priceCents: Math.round(Number(form.get('price')) * 100), available: form.get('available') === 'on' })
    setEditing(null)
  }
  function addOption() { setEditing({ ...draft, options: [...draft.options, { id: `option-${Date.now()}`, name: 'Nueva opción', required: false, choices: [] }] }) }
  function updateOption(index: number, option: ProductOption) { setEditing({ ...draft, options: draft.options.map((item, i) => i === index ? option : item) }) }

  return <main className={styles.shell}>
    <header className={styles.header}>
      <div className={styles.identity}><span className={styles.wordmark}>La Toscana</span><span className={styles.headerDivider} /><div><p>Panel del restaurante</p><span className={styles.demoPill}>Modo demo</span></div></div>
      <button className={styles.signOut} onClick={signOut}>Salir</button>
    </header>
    <nav className={styles.nav} aria-label="Secciones del panel">
      {tabs.map(item => <button className={tab === item.id ? styles.active : ''} aria-current={tab === item.id ? 'page' : undefined} onClick={() => { setTab(item.id); setEditing(null) }} key={item.id}><strong>{item.label}</strong><span>{item.hint}</span></button>)}
    </nav>
    <div className={styles.workspace}>
      {tab === 'orders' && <section><SectionHeading eyebrow="Operación de hoy" title="Pedidos" description="Revisá lo que entra y actualizá cada pedido a medida que avanza." action={<span className={styles.count}>{commerce.orders.filter(order => order.status === 'pending').length} nuevos</span>} />
        <div className={styles.filters}>{([['all', 'Todos'], ['pending', 'Nuevos'], ['confirmed', 'Confirmados'], ['preparing', 'Preparando'], ['ready', 'Listos'], ['finished', 'Finalizados']] as [OrderFilter, string][]).map(([value, label]) => <button type="button" className={orderFilter === value ? styles.filterActive : ''} onClick={() => setOrderFilter(value)} key={value}>{label}</button>)}</div>
        {!filteredOrders.length && <EmptyState title={commerce.orders.length ? 'No hay pedidos en este estado' : 'La bandeja está lista'} text={commerce.orders.length ? 'Elegí otro filtro para ver el resto de los pedidos.' : 'Cuando llegue un pedido desde la carta, va a aparecer acá para empezar a prepararlo.'} />}
        <div className={styles.list}>{filteredOrders.map(order => <article className={`${styles.card} ${order.status === 'pending' ? styles.newOrder : ''}`} key={order.id}><div><strong>#{order.number} · {order.customer.name} {order.status === 'pending' && <span className={styles.newBadge}>Nuevo</span>}</strong><p>{order.customer.phone} · {order.fulfillment === 'delivery' ? 'Delivery' : 'Retiro'} · {formatUyu(order.totalCents)}</p><small>{new Date(order.createdAt).toLocaleString('es-UY')}</small></div><div className={styles.cardActions}><button type="button" onClick={() => setSelectedOrder(order)}>Ver detalle</button><label>Estado<select value={order.status} aria-label={`Estado del pedido ${order.number}`} onChange={event => commerce.updateOrderStatus(order.id, event.target.value as OrderStatus)}>{statuses.map(status => <option key={status} value={status}>{statusLabels[status]}</option>)}</select></label></div></article>)}</div>
        {selectedOrder && <OrderDetail order={commerce.orders.find(order => order.id === selectedOrder.id) ?? selectedOrder} close={() => setSelectedOrder(null)} />}
      </section>}

      {tab === 'products' && <section><SectionHeading eyebrow="Tu carta" title="Productos" description="Editá precios, opciones y disponibilidad sin interrumpir el servicio." action={!editing ? <button className="btn btnPrimary" onClick={() => setEditing(draft)}>Nuevo producto</button> : undefined} />
        {editing ? <form className={styles.editor} onSubmit={saveProduct}><h3>{draft.id ? `Editar ${draft.name}` : 'Nuevo producto'}</h3><label>Nombre<input name="name" defaultValue={draft.name} required /></label><label>Descripción<textarea name="description" defaultValue={draft.description} /></label><div className={styles.formGrid}><label>Categoría<select name="categoryId" defaultValue={draft.categoryId}>{commerce.categories.map(category => <option value={category.id} key={category.id}>{category.name}</option>)}</select></label><label>Precio ($U)<input name="price" type="number" min="0" step="1" defaultValue={draft.priceCents / 100} required /></label></div><label className={styles.check}><input name="available" type="checkbox" defaultChecked={draft.available} /> Disponible para pedir</label><h3>Opciones y variantes</h3>{draft.options.map((option, index) => <div className={styles.optionEditor} key={option.id}><input aria-label="Nombre de opción" value={option.name} onChange={event => updateOption(index, { ...option, name: event.target.value })} /><label className={styles.check}><input type="checkbox" checked={option.required} onChange={event => updateOption(index, { ...option, required: event.target.checked })} /> Obligatoria</label>{option.choices.map((choice, choiceIndex) => <div className={styles.choice} key={choice.id}><input aria-label="Nombre de variante" value={choice.name} onChange={event => updateOption(index, { ...option, choices: option.choices.map((item, i) => i === choiceIndex ? { ...item, name: event.target.value } : item) })} /><input aria-label="Adicional en pesos" type="number" value={choice.priceDeltaCents / 100} onChange={event => updateOption(index, { ...option, choices: option.choices.map((item, i) => i === choiceIndex ? { ...item, priceDeltaCents: Number(event.target.value) * 100 } : item) })} /><button type="button" onClick={() => updateOption(index, { ...option, choices: option.choices.filter((_, i) => i !== choiceIndex) })}>Quitar</button></div>)}<button type="button" onClick={() => updateOption(index, { ...option, choices: [...option.choices, { id: `choice-${Date.now()}`, name: 'Nueva variante', priceDeltaCents: 0, available: true }] })}>+ Agregar variante</button></div>)}<button type="button" onClick={addOption}>+ Agregar opción</button><div className={styles.actions}><button type="button" onClick={() => setEditing(null)}>Cancelar</button><button className="btn btnPrimary">Guardar producto</button></div></form> : commerce.products.length ? <div className={styles.list}>{commerce.products.map(product => <article className={styles.card} key={product.id}><div><strong>{product.name}</strong><p>{formatUyu(product.priceCents)} · {product.available ? 'Disponible' : 'Oculto'} · {product.options.length} opciones</p></div><div className={styles.cardActions}><button onClick={() => setEditing(product)}>Editar</button><button className={styles.danger} onClick={() => confirm(`¿Eliminar ${product.name}?`) && commerce.deleteProduct(product.id)}>Eliminar</button></div></article>)}</div> : <EmptyState title="Tu carta todavía está vacía" text="Agregá el primer producto para empezar a armar la propuesta de La Toscana." />}
      </section>}

      {tab === 'categories' && <section><SectionHeading eyebrow="Organización de la carta" title="Categorías" description="Agrupá los productos para que tus clientes encuentren todo más rápido." />{commerce.categories.length ? commerce.categories.map(category => <CategoryRow key={category.id} category={category} save={commerce.saveCategory} remove={() => confirm(`¿Eliminar ${category.name} y sus productos?`) && commerce.deleteCategory(category.id)} />) : <EmptyState title="Creá la primera categoría" text="Por ejemplo: Entradas, Pastas, Platos principales o Postres." />}<div className={styles.addCategory}><h3>Agregar categoría</h3><CategoryRow save={commerce.saveCategory} /></div></section>}

      {tab === 'settings' && <section><SectionHeading eyebrow="Información operativa" title="Negocio" description="Mantené actualizados los datos que organizan la atención y las entregas." /><form className={styles.editor} onSubmit={event => { event.preventDefault(); const form = new FormData(event.currentTarget); commerce.saveSettings({ name: String(form.get('name')), phone: String(form.get('phone')), address: String(form.get('address')), orderHours: String(form.get('hours')), orderingOpen: form.get('open') === 'on', deliveryEnabled: form.get('delivery') === 'on', pickupEnabled: form.get('pickup') === 'on', deliveryFeeCents: Number(form.get('fee')) * 100, deliveryMinimumCents: Number(form.get('minimum')) * 100 }) }}><h3>Datos del restaurante</h3><label>Nombre<input name="name" defaultValue={commerce.settings.name} /></label><label>Teléfono<input name="phone" defaultValue={commerce.settings.phone} /></label><label>Dirección<input name="address" defaultValue={commerce.settings.address} /></label><label>Horario de pedidos<input name="hours" defaultValue={commerce.settings.orderHours} /></label><div className={styles.switches}><label className={styles.check}><input name="open" type="checkbox" defaultChecked={commerce.settings.orderingOpen} /> Pedidos abiertos</label><label className={styles.check}><input name="delivery" type="checkbox" defaultChecked={commerce.settings.deliveryEnabled} /> Delivery habilitado</label><label className={styles.check}><input name="pickup" type="checkbox" defaultChecked={commerce.settings.pickupEnabled} /> Retiro habilitado</label></div><div className={styles.formGrid}><label>Costo delivery ($U)<input name="fee" type="number" defaultValue={commerce.settings.deliveryFeeCents / 100} /></label><label>Mínimo delivery ($U)<input name="minimum" type="number" defaultValue={commerce.settings.deliveryMinimumCents / 100} /></label></div><button className="btn btnPrimary">Guardar configuración</button></form><button className={styles.reset} onClick={() => confirm('¿Restaurar todos los datos demo?') && commerce.resetDemo()}>Restaurar datos de demostración</button></section>}
    </div>
  </main>
}

function SectionHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) { return <div className={styles.sectionHead}><div><p className="kicker">{eyebrow}</p><h1>{title}</h1><p>{description}</p></div>{action}</div> }
function EmptyState({ title, text }: { title: string; text: string }) { return <div className={styles.empty}><span aria-hidden="true">LT</span><h3>{title}</h3><p>{text}</p></div> }
function CategoryRow({ category, save, remove }: { category?: Category; save: (category: Category) => void; remove?: () => void }) { const [name, setName] = useState(category?.name ?? ''); return <div className={styles.categoryRow}><input aria-label="Nombre de categoría" placeholder="Nombre de la categoría" value={name} onChange={event => setName(event.target.value)} />{category && <label className={styles.check}><input type="checkbox" checked={category.available} onChange={event => save({ ...category, available: event.target.checked })} /> Visible</label>}<button disabled={!name.trim()} onClick={() => { save({ id: category?.id ?? `${slug(name)}-${Date.now()}`, name: name.trim(), available: category?.available ?? true }); if (!category) setName('') }}>{category ? 'Guardar' : 'Agregar'}</button>{remove && <button className={styles.danger} onClick={remove}>Eliminar</button>}</div> }
function OrderDetail({ order, close }: { order: Order; close: () => void }) { return <div className={styles.detailBackdrop} role="presentation" onClick={close}><section className={styles.detail} role="dialog" aria-modal="true" aria-labelledby="order-detail-title" onClick={event => event.stopPropagation()}><button type="button" className={styles.detailClose} onClick={close} aria-label="Cerrar detalle">×</button><p className="kicker">Detalle del pedido</p><h2 id="order-detail-title">Pedido #{order.number}</h2><p><strong>Estado:</strong> {statusLabels[order.status]}</p><p><strong>Cliente:</strong> {order.customer.name} · {order.customer.phone}</p><p><strong>Entrega:</strong> {order.fulfillment === 'delivery' ? 'Delivery' : 'Retiro en el local'}</p>{order.fulfillment === 'delivery' && <p><strong>Dirección:</strong> {order.address}</p>}<h3>Productos</h3>{order.items.map((item, index) => <article className={styles.detailItem} key={`${item.productId}-${index}`}><strong>{item.quantity} × {item.productName}</strong>{item.choices.length > 0 && <ul>{item.choices.map(choice => <li key={`${choice.optionId}-${choice.choiceId}`}>{choice.optionName}: {choice.choiceName}{choice.priceDeltaCents ? ` (+${formatUyu(choice.priceDeltaCents)})` : ''}</li>)}</ul>}<p><strong>Observaciones:</strong> {item.notes || 'Sin observaciones'}</p><span>{formatUyu(item.lineTotalCents)}</span></article>)}<p><strong>Observaciones generales:</strong> {order.notes || 'Sin observaciones'}</p><dl className={styles.totals}><div><dt>Subtotal</dt><dd>{formatUyu(order.subtotalCents)}</dd></div><div><dt>Costo de delivery</dt><dd>{formatUyu(order.deliveryFeeCents)}</dd></div><div><dt>Total</dt><dd><strong>{formatUyu(order.totalCents)}</strong></dd></div></dl></section></div> }

'use client'

import { useState, type FormEvent } from 'react'
import { useCommerce } from '../CommerceProvider'
import { Field, MoneyInput, Switch, TextInput } from './ui'
import styles from './admin.module.css'

/**
 * Configuración del local, agrupada como se piensa: los datos del lugar, si se
 * está tomando pedidos, y cómo se entrega. Los interruptores viven en estado
 * para que el texto de ayuda responda al instante; el resto va por FormData.
 */
export function SettingsPanel({ onSaved }: { onSaved: (message: string) => void }) {
  const commerce = useCommerce()
  const settings = commerce.settings

  const [orderingOpen, setOrderingOpen] = useState(settings.orderingOpen)
  const [deliveryEnabled, setDeliveryEnabled] = useState(settings.deliveryEnabled)
  const [pickupEnabled, setPickupEnabled] = useState(settings.pickupEnabled)

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    commerce.saveSettings({
      name: String(form.get('name')),
      phone: String(form.get('phone')),
      address: String(form.get('address')),
      orderHours: String(form.get('hours')),
      orderingOpen,
      deliveryEnabled,
      pickupEnabled,
      deliveryFeeCents: Number(form.get('fee')) * 100,
      deliveryMinimumCents: Number(form.get('minimum')) * 100,
    })
    onSaved('Configuración guardada')
  }

  return (
    <form onSubmit={submit}>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>Negocio</h1>
          <p className={styles.pageSubtitle}>
            Los datos y las reglas con las que el local toma pedidos.
          </p>
        </div>
      </div>

      <div className={styles.stack}>
        <section className={styles.card}>
          <div className={styles.cardHead}>
            <h2 className={styles.cardTitle}>Datos del local</h2>
          </div>
          <div className={`${styles.cardPad} ${styles.stack}`}>
            <Field label="Nombre">
              <TextInput name="name" defaultValue={settings.name} />
            </Field>
            <div className={styles.grid2}>
              <Field label="Teléfono">
                <TextInput name="phone" type="tel" defaultValue={settings.phone} />
              </Field>
              <Field label="Dirección">
                <TextInput name="address" defaultValue={settings.address} />
              </Field>
            </div>
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.cardHead}>
            <div>
              <h2 className={styles.cardTitle}>Pedidos</h2>
              <p className={styles.cardNote}>Controla si la carta acepta pedidos ahora mismo.</p>
            </div>
          </div>
          <div className={`${styles.cardPad} ${styles.stack}`}>
            <Switch
              label="Pedidos abiertos"
              hint={
                orderingOpen
                  ? 'La carta está tomando pedidos.'
                  : 'Los clientes ven la carta pero no pueden comprar.'
              }
              checked={orderingOpen}
              onChange={setOrderingOpen}
            />
            <Field label="Horario de pedidos" hint="Se muestra al cliente antes de comprar.">
              <TextInput name="hours" defaultValue={settings.orderHours} />
            </Field>
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.cardHead}>
            <div>
              <h2 className={styles.cardTitle}>Entrega</h2>
              <p className={styles.cardNote}>Formas disponibles y condiciones del delivery.</p>
            </div>
          </div>
          <div className={`${styles.cardPad} ${styles.stack}`}>
            <Switch
              label="Delivery"
              hint="Llevamos el pedido a domicilio."
              checked={deliveryEnabled}
              onChange={setDeliveryEnabled}
            />
            <Switch
              label="Retiro en el local"
              hint="El cliente pasa a buscarlo."
              checked={pickupEnabled}
              onChange={setPickupEnabled}
            />
            {!deliveryEnabled && !pickupEnabled && (
              <p className={styles.error}>
                Sin delivery ni retiro no hay forma de completar un pedido.
              </p>
            )}
            <div className={styles.grid2}>
              <Field label="Costo de delivery">
                <MoneyInput name="fee" defaultValue={settings.deliveryFeeCents / 100} />
              </Field>
              <Field label="Mínimo de delivery" hint="Compra mínima para pedir a domicilio.">
                <MoneyInput name="minimum" defaultValue={settings.deliveryMinimumCents / 100} />
              </Field>
            </div>
          </div>
        </section>

        <section className={`${styles.card} ${styles.danger}`}>
          <div className={styles.cardHead}>
            <div>
              <h2 className={styles.cardTitle}>Restaurar datos demo</h2>
              <p className={styles.cardNote}>
                Vuelve al catálogo original y borra pedidos, cambios y configuración.
              </p>
            </div>
          </div>
          <div className={styles.cardPad}>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnDanger}`}
              onClick={() => {
                if (confirm('¿Restaurar todos los datos demo? Se pierden los pedidos y los cambios.')) {
                  commerce.resetDemo()
                  onSaved('Datos demo restaurados')
                }
              }}
            >
              Restaurar datos demo
            </button>
          </div>
        </section>
      </div>

      <div className={styles.saveBar}>
        <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
          Guardar cambios
        </button>
      </div>
    </form>
  )
}

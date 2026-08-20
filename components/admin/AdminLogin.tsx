'use client'

import { useState, type FormEvent } from 'react'
import { Field, TextInput } from './ui'
import styles from './admin.module.css'

/**
 * Acceso al panel demo. El PIN se muestra a propósito —es una demostración, no
 * una barrera de seguridad— pero como nota discreta, no como cartel.
 */
export function AdminLogin({ onEnter }: { onEnter: () => void }) {
  const [error, setError] = useState('')

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const pin = String(new FormData(event.currentTarget).get('pin'))
    if (pin !== '2026') {
      setError('Ese PIN no es correcto.')
      return
    }
    sessionStorage.setItem('lt-admin-demo', 'ok')
    onEnter()
  }

  return (
    <main className={`${styles.root} ${styles.login}`}>
      <div className={styles.loginCard}>
        <div className={styles.loginBrand}>
          <span className={styles.loginMark}>La Toscana</span>
          <h1 className={styles.loginTitle}>Panel del restaurante</h1>
        </div>

        <form className={styles.loginForm} onSubmit={submit}>
          <Field label="PIN de acceso">
            <TextInput
              name="pin"
              type="password"
              inputMode="numeric"
              autoComplete="off"
              autoFocus
              required
              aria-describedby={error ? 'pin-error' : undefined}
            />
          </Field>
          {error && (
            <p className={styles.error} id="pin-error" role="alert">
              {error}
            </p>
          )}
          <button type="submit" className={`${styles.btn} ${styles.btnPrimary} ${styles.btnBlock}`}>
            Entrar al panel
          </button>
        </form>

        <p className={styles.loginDemo}>
          Demostración local · PIN <b>2026</b>
        </p>

        <a className={styles.back} href="/">
          Volver al sitio
        </a>
      </div>
    </main>
  )
}

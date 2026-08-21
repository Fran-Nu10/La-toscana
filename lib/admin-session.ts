const DEMO_SESSION_KEY = 'lt-admin-demo'

/**
 * Small client-side boundary for the temporary demo access. The panel only
 * depends on this contract, so a future Supabase Auth adapter can replace it
 * without changing the administration screens.
 */
export const adminSession = {
  hasSession(): boolean {
    return typeof window !== 'undefined' && window.sessionStorage.getItem(DEMO_SESSION_KEY) === 'ok'
  },
  signInDemo(): void {
    window.sessionStorage.setItem(DEMO_SESSION_KEY, 'ok')
  },
  signOut(): void {
    window.sessionStorage.removeItem(DEMO_SESSION_KEY)
  },
}

import 'server-only'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export function configured() { return Boolean(url && anonKey) }

export async function supabaseFetch(path: string, init: RequestInit = {}, accessToken?: string) {
  if (!url || !anonKey) throw new Error('Supabase no está configurado')
  return fetch(`${url}${path}`, { ...init, headers: { apikey: anonKey, Authorization: `Bearer ${accessToken ?? anonKey}`, 'Content-Type': 'application/json', ...init.headers }, cache: 'no-store' })
}

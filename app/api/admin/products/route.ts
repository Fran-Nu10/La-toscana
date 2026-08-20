import { NextResponse } from 'next/server'
import { supabaseFetch } from '@/lib/supabase-rest'
const access = (request: Request) => request.headers.get('authorization')?.replace(/^Bearer /, '')
export async function GET(request: Request) {
  const token = access(request); if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const response = await supabaseFetch('/rest/v1/products?select=id,name,description,price_cents,available&order=sort_order', {}, token)
  return NextResponse.json(await response.json(), { status: response.status })
}
export async function PATCH(request: Request) {
  const token = access(request); if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const { id, name, description, priceCents, available } = await request.json()
  if (typeof id !== 'string' || typeof name !== 'string' || name.trim().length < 2 || !Number.isInteger(priceCents) || priceCents < 0 || typeof available !== 'boolean') return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  const response = await supabaseFetch(`/rest/v1/products?id=eq.${encodeURIComponent(id)}`, { method: 'PATCH', headers: { Prefer: 'return=representation' }, body: JSON.stringify({ name: name.trim(), description: String(description ?? '').slice(0, 500), price_cents: priceCents, available, updated_at: new Date().toISOString() }) }, token)
  return NextResponse.json(await response.json(), { status: response.status })
}

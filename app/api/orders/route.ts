import { NextResponse } from 'next/server'
import { validCheckout } from '@/lib/order'
import { configured, supabaseFetch } from '@/lib/supabase-rest'

export async function POST(request: Request) {
  if (!configured()) return NextResponse.json({ error: 'Los pedidos todavía no están habilitados.' }, { status: 503 })
  let body: unknown
  try { body = await request.json() } catch { return NextResponse.json({ error: 'Solicitud inválida.' }, { status: 400 }) }
  if (!validCheckout(body)) return NextResponse.json({ error: 'Revisá los datos y el pedido.' }, { status: 400 })
  const response = await supabaseFetch('/rest/v1/rpc/create_public_order', { method: 'POST', body: JSON.stringify({ payload: body }) })
  const result = await response.json().catch(() => null)
  if (!response.ok) return NextResponse.json({ error: 'No pudimos crear el pedido. Intentá nuevamente.' }, { status: response.status })
  return NextResponse.json(result, { status: 201 })
}

import { NextResponse } from 'next/server'
import { supabaseFetch } from '@/lib/supabase-rest'
export async function GET(_: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  if (!/^[0-9a-f-]{36}$/.test(token)) return NextResponse.json({ error: 'Pedido inválido' }, { status: 400 })
  const response = await supabaseFetch('/rest/v1/rpc/get_public_order', { method: 'POST', body: JSON.stringify({ lookup_token: token }) })
  return NextResponse.json(await response.json(), { status: response.status })
}

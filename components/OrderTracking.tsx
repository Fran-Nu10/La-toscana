'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { OrderStatus } from '@/lib/order'
const labels: Record<OrderStatus, string> = { pending:'Recibido', confirmed:'Confirmado', preparing:'En preparación', ready:'Listo', delivering:'En camino', completed:'Entregado', cancelled:'Cancelado' }
export function OrderTracking({ token }: { token: string }) { const [order,setOrder]=useState<{number:string;status:OrderStatus;fulfillment:string;total_cents:number}|null>(null); useEffect(()=>{ fetch(`/api/orders/${token}`).then(r=>r.ok?r.json():null).then(setOrder) },[token]); return <main className="section"> <p className="kicker">Estado del pedido</p><h1 className="sectionTitle">{order ? `Pedido #${order.number}` : 'Buscando pedido…'}</h1>{order && <><p style={{fontSize:'1.4rem'}}>{labels[order.status]}</p><p>{order.fulfillment === 'delivery' ? 'Delivery' : 'Retiro en el local'}</p></>}<Link href="/" className="ruleLink">Volver al inicio</Link></main> }

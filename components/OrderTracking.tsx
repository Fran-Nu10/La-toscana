'use client'
 codex/auditar-repositorio-y-proponer-arquitectura-backend-v5kzc4
import Link from 'next/link'
import { useCommerce } from './CommerceProvider'
import type { OrderStatus } from '@/data/types'
import { formatUyu } from '@/lib/order'
import styles from './OrderTracking.module.css'
const flow: OrderStatus[]=['pending','confirmed','preparing','ready','delivering','completed']; const labels:Record<OrderStatus,string>={pending:'Recibido',confirmed:'Confirmado',preparing:'En preparación',ready:'Listo',delivering:'En camino',completed:'Entregado',cancelled:'Cancelado'}
export function OrderTracking({token}:{token:string}){const {orders,ready}=useCommerce();const order=orders.find(item=>item.trackingToken===token);if(!ready)return <main className="section"><p>Cargando pedido…</p></main>;if(!order)return <main className="section"><h1>Pedido no encontrado</h1><p>Revisá el enlace o volvé al inicio.</p><Link href="/" className="ruleLink">Volver al inicio</Link></main>;const current=flow.indexOf(order.status);return <main className={styles.shell}><p className="kicker">Seguimiento</p><h1>Pedido #{order.number}</h1><p className={styles.current}>{labels[order.status]}</p>{order.status==='cancelled'?<p className={styles.cancelled}>Este pedido fue cancelado. Comunicate con el restaurante si necesitás ayuda.</p>:<ol className={styles.timeline}>{flow.filter(status=>order.fulfillment==='delivery'||status!=='delivering').map(status=>{const index=flow.indexOf(status);return <li className={index<=current?styles.done:''} key={status}><span/>{labels[status]}</li>})}</ol>}<section><h2>Resumen</h2>{order.items.map(item=><p key={`${item.productId}-${item.notes}`}>{item.quantity} × {item.productName} — {formatUyu(item.lineTotalCents)}</p>)}<strong>Total: {formatUyu(order.totalCents)}</strong><p>{order.fulfillment==='delivery'?`Delivery a ${order.address}`:`Retiro en ${'el local'}`}</p></section><Link href="/" className="ruleLink">Volver al inicio</Link></main>}

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { OrderStatus } from '@/lib/order'
const labels: Record<OrderStatus, string> = { pending:'Recibido', confirmed:'Confirmado', preparing:'En preparación', ready:'Listo', delivering:'En camino', completed:'Entregado', cancelled:'Cancelado' }
export function OrderTracking({ token }: { token: string }) { const [order,setOrder]=useState<{number:string;status:OrderStatus;fulfillment:string;total_cents:number}|null>(null); useEffect(()=>{ fetch(`/api/orders/${token}`).then(r=>r.ok?r.json():null).then(setOrder) },[token]); return <main className="section"> <p className="kicker">Estado del pedido</p><h1 className="sectionTitle">{order ? `Pedido #${order.number}` : 'Buscando pedido…'}</h1>{order && <><p style={{fontSize:'1.4rem'}}>{labels[order.status]}</p><p>{order.fulfillment === 'delivery' ? 'Delivery' : 'Retiro en el local'}</p></>}<Link href="/" className="ruleLink">Volver al inicio</Link></main> }
 main

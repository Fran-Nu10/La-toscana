import { OrderTracking } from '@/components/OrderTracking'
export default async function OrderPage({ params }: { params: Promise<{ token: string }> }) { return <OrderTracking token={(await params).token} /> }

import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { validarWebhookSignature } from '@/lib/mercadopago'
import type { PlanSuscripcion } from '@/types'

const PLAN_BY_AMOUNT: Record<number, PlanSuscripcion> = {
  4999: 'starter',
  8999: 'growth',
  14999: 'pro',
  49999: 'starter',
  89999: 'growth',
  149999: 'pro',
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('x-signature') || ''
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET!

  if (!validarWebhookSignature(body, signature, secret)) {
    return NextResponse.json({ error: 'Firma inválida' }, { status: 401 })
  }

  const event = JSON.parse(body)
  const { type, data } = event

  if (type !== 'subscription_preapproval') {
    return NextResponse.json({ ok: true })
  }

  const supabase = await createServiceClient()

  const { id: subscriptionId, status, payer_id, auto_recurring } = data

  // Buscar usuario por mp_subscription_id
  const { data: suscripcion } = await supabase
    .from('suscripciones')
    .select('user_id, plan')
    .eq('mp_subscription_id', subscriptionId)
    .single()

  if (!suscripcion) {
    return NextResponse.json({ error: 'Suscripción no encontrada' }, { status: 404 })
  }

  const estadoMap: Record<string, string> = {
    authorized: 'activa',
    paused: 'cancelada',
    cancelled: 'cancelada',
    pending: 'trial',
  }

  const nuevoEstado = estadoMap[status] || 'vencida'
  const monto = auto_recurring?.transaction_amount * 100

  await supabase.from('suscripciones').update({
    estado: nuevoEstado,
    mp_customer_id: String(payer_id),
    plan: PLAN_BY_AMOUNT[monto] ?? suscripcion.plan,
    proxima_renovacion: auto_recurring?.end_date || null,
    updated_at: new Date().toISOString(),
  }).eq('user_id', suscripcion.user_id)

  return NextResponse.json({ ok: true })
}

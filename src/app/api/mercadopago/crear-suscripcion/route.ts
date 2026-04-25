import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { crearSuscripcion } from '@/lib/mercadopago'
import type { PlanSuscripcion, PeriodoSuscripcion } from '@/types'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { plan, periodo } = await request.json() as { plan: PlanSuscripcion; periodo: PeriodoSuscripcion }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const backUrl = `${appUrl}/suscripcion?resultado=ok`

  const { init_point, id } = await crearSuscripcion(
    plan,
    periodo,
    user.email!,
    backUrl
  )

  // Guardar el ID de suscripción MP temporalmente
  await supabase.from('suscripciones').update({
    mp_subscription_id: id,
  }).eq('user_id', user.id)

  return NextResponse.json({ init_point })
}

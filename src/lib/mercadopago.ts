import { MercadoPagoConfig, PreApproval, PreApprovalPlan } from 'mercadopago'
import type { PlanSuscripcion, PeriodoSuscripcion } from '@/types'

const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN!

export function getMpClient() {
  return new MercadoPagoConfig({ accessToken })
}

const PLAN_IDS: Record<string, string> = {
  // Estos IDs se crean en MP y se guardan acá
  // Por ahora son placeholders — se completan al crear los planes en MP
  'starter-mensual': process.env.MP_PLAN_STARTER_MENSUAL || '',
  'starter-anual': process.env.MP_PLAN_STARTER_ANUAL || '',
  'growth-mensual': process.env.MP_PLAN_GROWTH_MENSUAL || '',
  'growth-anual': process.env.MP_PLAN_GROWTH_ANUAL || '',
  'pro-mensual': process.env.MP_PLAN_PRO_MENSUAL || '',
  'pro-anual': process.env.MP_PLAN_PRO_ANUAL || '',
}

export async function crearSuscripcion(
  plan: PlanSuscripcion,
  periodo: PeriodoSuscripcion,
  userEmail: string,
  backUrl: string
): Promise<{ init_point: string; id: string }> {
  const client = getMpClient()
  const preApproval = new PreApproval(client)

  const planKey = `${plan}-${periodo}`
  const planId = PLAN_IDS[planKey]

  const PRECIOS: Record<string, number> = {
    'starter-mensual': Number(process.env.PRICE_STARTER_MONTHLY || 4999),
    'starter-anual': Number(process.env.PRICE_STARTER_ANNUAL || 49999),
    'growth-mensual': Number(process.env.PRICE_GROWTH_MONTHLY || 8999),
    'growth-anual': Number(process.env.PRICE_GROWTH_ANNUAL || 89999),
    'pro-mensual': Number(process.env.PRICE_PRO_MONTHLY || 14999),
    'pro-anual': Number(process.env.PRICE_PRO_ANNUAL || 149999),
  }

  const resultado = await preApproval.create({
    body: {
      reason: `ContentPilot ${plan} ${periodo}`,
      auto_recurring: {
        frequency: periodo === 'mensual' ? 1 : 12,
        frequency_type: 'months',
        transaction_amount: PRECIOS[planKey] / 100,
        currency_id: 'ARS',
      },
      payer_email: userEmail,
      back_url: backUrl,
      status: 'pending',
    },
  })

  return {
    init_point: resultado.init_point!,
    id: resultado.id!,
  }
}

export function validarWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const crypto = require('crypto')
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')
  return expected === signature
}

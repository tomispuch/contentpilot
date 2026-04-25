'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import TopBar from '@/components/layout/TopBar'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import type { Suscripcion, PlanSuscripcion } from '@/types'
import { PLAN_LIMITS } from '@/types'
import { diasRestantes, formatFecha } from '@/lib/utils'
import { Check, Zap, Lock } from 'lucide-react'

const PLANES: { id: PlanSuscripcion; nombre: string; features: string[] }[] = [
  {
    id: 'starter',
    nombre: 'Starter',
    features: ['3 publicaciones/semana', 'Modo manual', 'Biblioteca de fotos', 'Edición de captions'],
  },
  {
    id: 'growth',
    nombre: 'Growth',
    features: ['5 publicaciones/semana', 'Todo lo de Starter', 'Generación automática semanal', 'Notificaciones prioritarias'],
  },
  {
    id: 'pro',
    nombre: 'Pro',
    features: ['7 publicaciones/semana', 'Todo lo de Growth', 'Imagen IA (próximamente)', 'Soporte prioritario'],
  },
]

export default function SuscripcionPage() {
  const [suscripcion, setSuscripcion] = useState<Suscripcion | null>(null)
  const [periodo, setPeriodo] = useState<'mensual' | 'anual'>('mensual')
  const [loading, setLoading] = useState<PlanSuscripcion | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase.from('suscripciones').select('*').single()
      setSuscripcion(data)
    }
    load()
  }, [])

  async function handleUpgrade(plan: PlanSuscripcion) {
    setLoading(plan)
    const res = await fetch('/api/mercadopago/crear-suscripcion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan, periodo }),
    })

    if (res.ok) {
      const { init_point } = await res.json()
      window.location.href = init_point
    } else {
      setLoading(null)
      alert('Error al procesar el pago. Intentá de nuevo.')
    }
  }

  const diasTrial = suscripcion?.estado === 'trial' && suscripcion.trial_expira_at
    ? diasRestantes(suscripcion.trial_expira_at)
    : 0

  const descuentoAnual = 17

  return (
    <>
      <TopBar title="Suscripción" />
      <main className="p-4 md:p-6 max-w-2xl mx-auto space-y-5">

        {/* Estado actual */}
        <div className="bg-[#070708] rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute right-3 bottom-0 font-display font-black text-white/[0.05] leading-none text-8xl select-none" aria-hidden>
            PLAN
          </div>
          <h2 className="text-xs font-black uppercase tracking-widest text-white/40 mb-3">Tu plan actual</h2>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={suscripcion?.plan ?? 'starter'} />
                <Badge variant={suscripcion?.estado ?? 'trial'} />
              </div>
              {suscripcion?.estado === 'trial' && (
                <p className="text-sm text-amber-400 font-semibold">
                  Tu prueba gratuita vence en {diasTrial} día{diasTrial !== 1 ? 's' : ''}
                </p>
              )}
              {suscripcion?.proxima_renovacion && suscripcion.estado === 'activa' && (
                <p className="text-xs text-white/30 mt-1">
                  Próxima renovación: {formatFecha(suscripcion.proxima_renovacion)}
                </p>
              )}
            </div>
            <div className="text-right">
              <div className="font-display font-black text-3xl text-white">
                {suscripcion?.publicaciones_semanales ?? 3}
              </div>
              <div className="text-xs text-white/30 uppercase tracking-wide">posts/semana</div>
            </div>
          </div>
        </div>

        {/* Toggle mensual/anual */}
        <div className="flex items-center justify-center gap-4 py-1">
          <button
            onClick={() => setPeriodo('mensual')}
            className={`text-sm font-semibold transition-colors ${periodo === 'mensual' ? 'text-[#070708]' : 'text-[#070708]/35'}`}
          >
            Mensual
          </button>
          <button
            onClick={() => setPeriodo(p => p === 'mensual' ? 'anual' : 'mensual')}
            className={`relative w-12 h-6 rounded-full transition-colors ${periodo === 'anual' ? 'bg-[#fa133a]' : 'bg-[#070708]/20'}`}
          >
            <span className={`absolute top-0.5 left-0.5 h-5 w-5 bg-white rounded-full shadow transition-transform ${periodo === 'anual' ? 'translate-x-6' : ''}`} />
          </button>
          <button
            onClick={() => setPeriodo('anual')}
            className={`text-sm font-semibold transition-colors ${periodo === 'anual' ? 'text-[#070708]' : 'text-[#070708]/35'}`}
          >
            Anual
            <span className="ml-1.5 text-xs font-black text-green-700 bg-green-100 px-1.5 py-0.5 rounded-full">
              -{descuentoAnual}%
            </span>
          </button>
        </div>

        {/* Planes */}
        <div className="space-y-3">
          {PLANES.map(({ id, nombre, features }) => {
            const limites = PLAN_LIMITS[id]
            const precio = periodo === 'mensual' ? limites.precio_mensual : Math.round(limites.precio_anual / 12)
            const esPlanActual = suscripcion?.plan === id && suscripcion?.estado === 'activa'
            const esPro = id === 'pro'
            const esGrowth = id === 'growth'

            return (
              <div
                key={id}
                className={`rounded-2xl p-5 border-2 transition-all ${
                  esPlanActual
                    ? 'border-green-400 bg-green-50'
                    : esPro
                      ? 'border-[#fa133a] bg-[#070708] text-white'
                      : 'border-[#070708]/8 bg-white'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`text-base font-display font-black ${esPro ? 'text-white' : 'text-[#070708]'}`}>
                        {nombre}
                      </h3>
                      {esPro && <Zap className="h-4 w-4 text-[#fa133a]" />}
                      {esPlanActual && <Check className="h-4 w-4 text-green-600" />}
                      {esGrowth && !esPlanActual && (
                        <span className="text-[10px] font-black bg-[#fa133a]/10 text-[#fa133a] px-2 py-0.5 rounded-full uppercase tracking-wide">
                          Popular
                        </span>
                      )}
                    </div>
                    <div>
                      <span className={`text-2xl font-display font-black ${esPro ? 'text-white' : 'text-[#070708]'}`}>
                        ${precio.toLocaleString('es-AR')}
                      </span>
                      <span className={`text-sm ml-1 ${esPro ? 'text-white/40' : 'text-[#070708]/40'}`}>/mes</span>
                    </div>
                    {periodo === 'anual' && (
                      <p className="text-xs text-green-500 mt-0.5 font-semibold">
                        ${limites.precio_anual.toLocaleString('es-AR')}/año
                      </p>
                    )}
                  </div>
                </div>

                <ul className="space-y-2 mb-4">
                  {features.map(f => (
                    <li key={f} className={`flex items-center gap-2 text-xs ${esPro ? 'text-white/70' : 'text-[#070708]/60'}`}>
                      <Check className={`h-3.5 w-3.5 shrink-0 ${esPro ? 'text-[#fa133a]' : 'text-green-500'}`} />
                      {f}
                    </li>
                  ))}
                  {limites.imagenIA && (
                    <li className={`flex items-center gap-2 text-xs ${esPro ? 'text-white/30' : 'text-[#070708]/25'}`}>
                      <Lock className="h-3.5 w-3.5 shrink-0" />
                      Imagen IA — próximamente
                    </li>
                  )}
                </ul>

                {esPlanActual ? (
                  <Button variant="secondary" className="w-full" disabled>
                    Plan actual
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    variant={esPro ? 'primary' : 'outline'}
                    onClick={() => handleUpgrade(id)}
                    loading={loading === id}
                  >
                    {suscripcion?.estado === 'trial' ? 'Suscribirme' :
                      suscripcion?.plan === 'pro' && id !== 'pro' ? 'Cambiar plan' : 'Actualizar plan'}
                  </Button>
                )}
              </div>
            )
          })}
        </div>

        <p className="text-center text-xs text-[#070708]/30">
          Podés cancelar en cualquier momento. Sin compromisos.
        </p>
      </main>
    </>
  )
}

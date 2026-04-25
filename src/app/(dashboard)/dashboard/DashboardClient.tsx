'use client'

import Link from 'next/link'
import { PlusSquare, CheckCircle2, Clock, AlertTriangle, ArrowRight } from 'lucide-react'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import type { Negocio, Suscripcion, Publicacion } from '@/types'
import { diasRestantes, formatFecha } from '@/lib/utils'

interface Props {
  negocio: Negocio | null
  suscripcion: Suscripcion | null
  publicaciones: Publicacion[]
}

export default function DashboardClient({ negocio, suscripcion, publicaciones }: Props) {
  const pendientes = publicaciones.filter(p => p.estado === 'pendiente')
  const aprobadas  = publicaciones.filter(p => p.estado === 'aprobada')

  const diasTrial = suscripcion?.estado === 'trial' && suscripcion.trial_expira_at
    ? diasRestantes(suscripcion.trial_expira_at)
    : 0

  return (
    <main className="p-4 md:p-6 space-y-5 max-w-3xl mx-auto">

      {/* Aviso trial */}
      {suscripcion?.estado === 'trial' && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-800">
              Tu período de prueba vence en {diasTrial} día{diasTrial !== 1 ? 's' : ''}
            </p>
            <p className="text-xs text-amber-600 mt-0.5">
              Suscribite para no perder el acceso a tu contenido
            </p>
          </div>
          <Link href="/suscripcion">
            <Button size="sm">Ver planes</Button>
          </Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#070708] rounded-2xl p-4 relative overflow-hidden">
          <div className="absolute right-2 bottom-0 font-display font-black text-white/[0.06] leading-none select-none text-7xl"
            aria-hidden>{pendientes.length}</div>
          <div className="flex items-center gap-2 mb-3 relative z-10">
            <Clock className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-semibold text-white/50 uppercase tracking-wide">Para aprobar</span>
          </div>
          <div className="font-display font-black text-4xl text-white relative z-10">{pendientes.length}</div>
          <p className="text-xs text-white/30 mt-0.5 relative z-10">publicacion{pendientes.length !== 1 ? 'es' : ''}</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#070708]/8 relative overflow-hidden">
          <div className="absolute right-2 bottom-0 font-display font-black text-[#070708]/[0.05] leading-none select-none text-7xl"
            aria-hidden>{aprobadas.length}</div>
          <div className="flex items-center gap-2 mb-3 relative z-10">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span className="text-xs font-semibold text-[#070708]/40 uppercase tracking-wide">Aprobadas</span>
          </div>
          <div className="font-display font-black text-4xl text-[#070708] relative z-10">{aprobadas.length}</div>
          <p className="text-xs text-[#070708]/30 mt-0.5 relative z-10">esta semana</p>
        </div>
      </div>

      {/* CTA crear */}
      <div className="bg-[#fa133a] rounded-2xl p-4 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white">Creá una publicación ahora</h3>
          <p className="text-xs text-white/70 mt-0.5">Subí una foto y generamos el caption al instante</p>
        </div>
        <Link href="/crear" className="shrink-0">
          <button className="inline-flex items-center gap-1.5 bg-white text-[#fa133a] text-xs font-black px-3 py-2 rounded-xl hover:bg-white/90 transition-colors">
            <PlusSquare className="h-3.5 w-3.5" />
            Crear
          </button>
        </Link>
      </div>

      {/* Publicaciones pendientes */}
      {pendientes.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-[#070708]">Para aprobar</h2>
            <Link href="/publicaciones" className="text-xs text-[#fa133a] font-semibold hover:underline flex items-center gap-1">
              Ver todas <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {pendientes.slice(0, 5).map(pub => (
              <Card key={pub.id} className="p-4">
                <div className="flex gap-3 items-start">
                  {pub.imagen_procesada_url ? (
                    <img
                      src={pub.imagen_procesada_url}
                      alt="Preview"
                      className="h-14 w-14 rounded-xl object-cover shrink-0"
                    />
                  ) : (
                    <div className="h-14 w-14 rounded-xl bg-[#d6d7d7] shrink-0 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-[#070708]/20" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="pendiente" />
                      <span className="text-xs text-[#070708]/30">{formatFecha(pub.created_at)}</span>
                    </div>
                    <p className="text-xs text-[#070708]/70 line-clamp-2">{pub.caption}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {pendientes.length === 0 && publicaciones.length === 0 && (
        <Card className="p-8 text-center">
          <div className="text-4xl mb-3">✨</div>
          <h3 className="text-sm font-bold text-[#070708] mb-1">Todo listo para empezar</h3>
          <p className="text-xs text-[#070708]/40 mb-4">
            N8N generará tu contenido automáticamente. También podés crear una publicación manualmente ahora mismo.
          </p>
          <Link href="/crear">
            <Button>Crear mi primera publicación</Button>
          </Link>
        </Card>
      )}
    </main>
  )
}

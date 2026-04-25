'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import TopBar from '@/components/layout/TopBar'
import PublicacionCard from '@/components/publicaciones/PublicacionCard'
import type { Publicacion, EstadoPublicacion } from '@/types'
import { cn } from '@/lib/utils'

const TABS: { label: string; estado: EstadoPublicacion | 'historial' }[] = [
  { label: 'Pendientes', estado: 'pendiente' },
  { label: 'Aprobadas',  estado: 'aprobada' },
  { label: 'Historial',  estado: 'historial' },
]

export default function PublicacionesPage() {
  const [tab, setTab] = useState<EstadoPublicacion | 'historial'>('pendiente')
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPublicaciones()

    const supabase = createClient()
    const channel = supabase
      .channel('publicaciones-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'publicaciones' }, () => loadPublicaciones())
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  async function loadPublicaciones() {
    const supabase = createClient()
    const { data } = await supabase
      .from('publicaciones')
      .select('*')
      .order('created_at', { ascending: false })
    setPublicaciones(data ?? [])
    setLoading(false)
  }

  function handleUpdate(id: string, changes: Partial<Publicacion>) {
    setPublicaciones(prev => prev.map(p => p.id === id ? { ...p, ...changes } : p))
  }

  const filtradas = publicaciones.filter(p => {
    if (tab === 'historial') return p.estado === 'rechazada' || p.estado === 'editada'
    return p.estado === tab
  })

  return (
    <>
      <TopBar title="Publicaciones" />
      <main className="p-4 md:p-6 max-w-3xl mx-auto">

        {/* Tabs */}
        <div className="flex gap-1 bg-[#070708] rounded-xl p-1 mb-5">
          {TABS.map(({ label, estado }) => {
            const count = publicaciones.filter(p =>
              estado === 'historial'
                ? p.estado === 'rechazada' || p.estado === 'editada'
                : p.estado === estado
            ).length
            const active = tab === estado
            return (
              <button
                key={estado}
                onClick={() => setTab(estado)}
                className={cn(
                  'flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all',
                  active
                    ? 'bg-[#fa133a] text-white shadow-sm'
                    : 'text-white/40 hover:text-white/70'
                )}
              >
                {label}
                {count > 0 && (
                  <span className={cn(
                    'ml-1.5 text-[10px] font-black rounded-full px-1.5 py-0.5',
                    active ? 'bg-white/20 text-white' : 'bg-white/10 text-white/50'
                  )}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-[#070708]/8 overflow-hidden animate-pulse">
                <div className="aspect-square bg-[#d6d7d7]" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-[#d6d7d7] rounded-full w-3/4" />
                  <div className="h-3 bg-[#d6d7d7] rounded-full w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtradas.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">
              {tab === 'pendiente' ? '🎉' : tab === 'aprobada' ? '✅' : '📁'}
            </div>
            <p className="text-sm font-semibold text-[#070708]">
              {tab === 'pendiente' ? '¡Estás al día! No hay publicaciones pendientes.' :
               tab === 'aprobada' ? 'Todavía no aprobaste ninguna publicación' :
               'No hay publicaciones en el historial'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtradas.map(pub => (
              <PublicacionCard key={pub.id} publicacion={pub} onUpdate={handleUpdate} />
            ))}
          </div>
        )}
      </main>
    </>
  )
}

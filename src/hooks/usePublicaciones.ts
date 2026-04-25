'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Publicacion, EstadoPublicacion } from '@/types'

export function usePublicaciones(filtroEstado?: EstadoPublicacion) {
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const supabase = createClient()
    let query = supabase
      .from('publicaciones')
      .select('*')
      .order('created_at', { ascending: false })

    if (filtroEstado) {
      query = query.eq('estado', filtroEstado)
    }

    const { data } = await query
    setPublicaciones(data ?? [])
    setLoading(false)
  }, [filtroEstado])

  useEffect(() => {
    load()

    const supabase = createClient()
    const channel = supabase
      .channel('publicaciones-hook')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'publicaciones' }, load)
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [load])

  function updatePublicacion(id: string, changes: Partial<Publicacion>) {
    setPublicaciones(prev => prev.map(p => p.id === id ? { ...p, ...changes } : p))
  }

  return { publicaciones, loading, reload: load, updatePublicacion }
}

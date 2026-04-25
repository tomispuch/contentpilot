'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Suscripcion } from '@/types'

export function useSuscripcion() {
  const [suscripcion, setSuscripcion] = useState<Suscripcion | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase.from('suscripciones').select('*').single()
      setSuscripcion(data)
      setLoading(false)
    }
    load()
  }, [])

  const enTrial = suscripcion?.estado === 'trial'
  const activa = suscripcion?.estado === 'activa'
  const puedeGenerar = enTrial || activa

  return { suscripcion, loading, enTrial, activa, puedeGenerar }
}

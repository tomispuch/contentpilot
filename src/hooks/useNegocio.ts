'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Negocio } from '@/types'

export function useNegocio() {
  const [negocio, setNegocio] = useState<Negocio | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase.from('negocios').select('*').single()
      setNegocio(data)
      setLoading(false)
    }
    load()
  }, [])

  return { negocio, loading }
}

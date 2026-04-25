'use client'

import { Bell } from 'lucide-react'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface TopBarProps {
  title: string
}

export default function TopBar({ title }: TopBarProps) {
  const [notifCount, setNotifCount] = useState(0)

  useEffect(() => {
    const supabase = createClient()

    async function loadNotifs() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { count } = await supabase
        .from('notificaciones')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('leida', false)
      setNotifCount(count ?? 0)
    }

    loadNotifs()
  }, [])

  return (
    <header className="h-14 bg-white border-b border-[#070708]/8 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
      <h1 className="text-base font-display font-black text-[#070708] tracking-tight">{title}</h1>
      <button className="relative p-2 rounded-xl hover:bg-[#d6d7d7] text-[#070708]/40 hover:text-[#070708] transition-colors">
        <Bell className="h-5 w-5" />
        {notifCount > 0 && (
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#fa133a]" />
        )}
      </button>
    </header>
  )
}

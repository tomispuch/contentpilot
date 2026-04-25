'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, FileImage, PlusSquare, Store, CreditCard, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

const NAV_ITEMS = [
  { href: '/dashboard',       label: 'Inicio',         icon: LayoutDashboard },
  { href: '/publicaciones',   label: 'Publicaciones',  icon: FileImage },
  { href: '/crear',           label: 'Crear',          icon: PlusSquare },
  { href: '/perfil-negocio',  label: 'Mi negocio',     icon: Store },
  { href: '/suscripcion',     label: 'Suscripción',    icon: CreditCard },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="hidden md:flex w-56 flex-col bg-[#070708] fixed inset-y-0 left-0 z-40">
      <div className="p-3 border-b border-white/10 flex justify-center">
        <div className="bg-[#d6d7d7] rounded-xl px-3 py-2 w-fit">
          <Image
            src="/logo-contentpilot.png"
            alt="ContentPilot"
            width={120}
            height={48}
            className="h-10 w-auto object-contain"
          />
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                active
                  ? 'bg-[#fa133a] text-white'
                  : 'text-white/50 hover:bg-white/10 hover:text-white'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-white/10 space-y-3">
        <div className="px-3 py-2">
          <p className="text-white/20 text-[10px] mb-1.5">Desarrollado por</p>
          <Image
            src="/icon-trs.png"
            alt="TRS"
            width={48}
            height={24}
            className="h-5 w-auto object-contain opacity-40"
          />
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:bg-red-500/10 hover:text-[#fa133a] transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}

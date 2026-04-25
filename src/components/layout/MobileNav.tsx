'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FileImage, PlusSquare, Store, CreditCard } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/dashboard',      label: 'Inicio',    icon: LayoutDashboard },
  { href: '/publicaciones',  label: 'Posts',     icon: FileImage },
  { href: '/crear',          label: 'Crear',     icon: PlusSquare },
  { href: '/perfil-negocio', label: 'Negocio',   icon: Store },
  { href: '/suscripcion',    label: 'Plan',      icon: CreditCard },
]

export default function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#070708] border-t border-white/10 safe-area-inset-bottom">
      <div className="flex items-center justify-around px-1 py-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          const isCrear = href === '/crear'
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all min-w-[52px]',
                isCrear
                  ? active
                    ? 'text-white bg-[#fa133a] rounded-xl'
                    : 'text-white bg-[#fa133a]/80 rounded-xl'
                  : active
                    ? 'text-[#fa133a]'
                    : 'text-white/35 hover:text-white/60'
              )}
            >
              <Icon className={cn('h-5 w-5', isCrear && 'h-5 w-5')} />
              <span className="text-[10px] font-semibold">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

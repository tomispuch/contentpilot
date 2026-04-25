'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Email o contraseña incorrectos')
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex bg-[#070708]">

      {/* Panel izquierdo — marca (solo desktop) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden">
        {/* Ghost number */}
        <div
          className="absolute right-0 bottom-0 font-display font-black text-white/[0.04] leading-none select-none pointer-events-none"
          style={{ fontSize: '28rem' }}
          aria-hidden
        >
          15
        </div>
        {/* Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#fa133a]/8 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10">
          <div className="bg-[#d6d7d7] rounded-xl px-4 py-2 w-fit">
            <Image src="/logo-contentpilot.png" alt="ContentPilot" width={140} height={36} className="h-8 w-auto object-contain" />
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#fa133a]">
            Para dueños de negocios
          </p>
          <h2
            className="font-display font-black text-white leading-[1.1]"
            style={{ fontSize: 'clamp(36px, 4vw, 52px)' }}
          >
            Tu negocio en Instagram,<br />
            <span className="text-[#fa133a]">sin el dolor de cabeza.</span>
          </h2>
          <p className="text-white/40 text-base leading-relaxed max-w-sm">
            ContentPilot genera tus publicaciones automáticamente. Solo aprobás, copiás y pegás.
          </p>

          <div className="flex items-center divide-x divide-white/10">
            {[['15 min', 'por semana'], ['3', 'opciones/post'], ['0', 'tecnicismos']].map(([v, l], i) => (
              <div key={l} className={i === 0 ? 'pr-6' : 'px-6'}>
                <div className="font-display font-black text-2xl text-[#fa133a]">{v}</div>
                <div className="text-[11px] text-white/30 uppercase tracking-wide mt-0.5">{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <div className="bg-[#d6d7d7] rounded-xl px-4 py-2 w-fit opacity-40">
            <Image src="/logo-trs.png" alt="TRS Automatizaciones" width={100} height={26} className="h-5 w-auto object-contain" />
          </div>
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-[#d6d7d7]">
        {/* Logo mobile */}
        <div className="lg:hidden mb-8">
          <div className="bg-white rounded-xl px-4 py-2 shadow-sm">
            <Image src="/logo-contentpilot.png" alt="ContentPilot" width={148} height={36} className="h-9 w-auto object-contain" />
          </div>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="font-display font-black text-[#070708] text-3xl mb-1">Bienvenido de vuelta</h1>
            <p className="text-[#070708]/50 text-sm">Ingresá a tu cuenta de ContentPilot</p>
          </div>

          <div className="bg-white rounded-2xl border border-[#070708]/8 shadow-sm p-6 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              <Input
                label="Contraseña"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />

              {error && (
                <div className="bg-[#fa133a]/8 border border-[#fa133a]/20 rounded-xl px-4 py-2.5">
                  <p className="text-sm text-[#fa133a] font-medium">{error}</p>
                </div>
              )}

              <Button type="submit" className="w-full" size="lg" loading={loading}>
                Ingresar
                {!loading && <ArrowRight className="h-4 w-4" />}
              </Button>
            </form>
          </div>

          <p className="text-center text-sm text-[#070708]/50 mt-5">
            ¿No tenés cuenta?{' '}
            <Link href="/register" className="text-[#fa133a] font-semibold hover:underline">
              Registrate gratis
            </Link>
          </p>

          <div className="text-center mt-3">
            <Link href="/" className="text-xs text-[#070708]/30 hover:text-[#070708]/60 transition-colors">
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

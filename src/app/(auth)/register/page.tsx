'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError('Las contraseñas no coinciden')
      return
    }
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setError(error.message === 'User already registered'
        ? 'Ya existe una cuenta con ese email'
        : 'Error al crear la cuenta. Intentá de nuevo.')
      setLoading(false)
      return
    }

    router.push('/onboarding')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex bg-[#070708]">

      {/* Panel izquierdo — marca (solo desktop) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden">
        <div
          className="absolute right-0 bottom-0 font-display font-black text-white/[0.04] leading-none select-none pointer-events-none"
          style={{ fontSize: '28rem' }}
          aria-hidden
        >
          7
        </div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#fa133a]/8 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10">
          <div className="bg-[#d6d7d7] rounded-xl px-4 py-2 w-fit">
            <Image src="/logo-contentpilot.png" alt="ContentPilot" width={140} height={36} className="h-8 w-auto object-contain" />
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#fa133a]">
            Empezá hoy
          </p>
          <h2
            className="font-display font-black text-white leading-[1.1]"
            style={{ fontSize: 'clamp(36px, 4vw, 52px)' }}
          >
            7 días gratis,<br />
            <span className="text-[#fa133a]">sin tarjeta.</span>
          </h2>

          <div className="space-y-3">
            {[
              'Contenido generado automáticamente cada semana',
              'Aprobás desde el celular en minutos',
              'Cancelás cuando querés, sin compromisos',
            ].map(item => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-[#fa133a] shrink-0 mt-0.5" />
                <p className="text-white/60 text-sm">{item}</p>
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
            <h1 className="font-display font-black text-[#070708] text-3xl mb-1">Creá tu cuenta</h1>
            <p className="text-[#070708]/50 text-sm">7 días gratis · Sin tarjeta de crédito</p>
          </div>

          <div className="bg-white rounded-2xl border border-[#070708]/8 shadow-sm p-6">
            {/* Garantías */}
            <div className="flex gap-4 mb-5 p-3 bg-[#fa133a]/5 border border-[#fa133a]/10 rounded-xl">
              {['Sin tarjeta', 'Cancelás cuando querés'].map(item => (
                <div key={item} className="flex items-center gap-1.5 text-xs text-[#fa133a] font-semibold">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  {item}
                </div>
              ))}
            </div>

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
                placeholder="Mínimo 8 caracteres"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
              <Input
                label="Confirmar contraseña"
                type="password"
                placeholder="Repetí tu contraseña"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
                autoComplete="new-password"
              />

              {error && (
                <div className="bg-[#fa133a]/8 border border-[#fa133a]/20 rounded-xl px-4 py-2.5">
                  <p className="text-sm text-[#fa133a] font-medium">{error}</p>
                </div>
              )}

              <Button type="submit" className="w-full" size="lg" loading={loading}>
                Crear cuenta gratis
                {!loading && <ArrowRight className="h-4 w-4" />}
              </Button>
            </form>
          </div>

          <p className="text-center text-sm text-[#070708]/50 mt-5">
            ¿Ya tenés cuenta?{' '}
            <Link href="/login" className="text-[#fa133a] font-semibold hover:underline">
              Ingresá
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

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import { RUBROS, TONOS } from '@/types'
import { Check, ChevronRight, ChevronLeft, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'

const STEPS = ['Tu negocio', 'Comunicación', 'Identidad visual', 'Preferencias']

function buildPromptBase(data: OnboardingData): string {
  return `Sos el community manager de ${data.nombre}, un negocio de ${data.rubro}. El tono debe ser ${data.tono}. El público objetivo es: ${data.publico_objetivo || 'clientes generales'}. Nunca menciones: ${data.que_no_comunicar || 'nada en particular'}. Referencias de estilo: ${data.competidores || 'ninguna específica'}. Generá contenido auténtico, específico para este negocio, evitando frases genéricas o clichés de redes sociales.`
}

interface OnboardingData {
  nombre: string
  rubro: string
  otro_rubro: string
  antiguedad: string
  tono: string
  publico_objetivo: string
  que_no_comunicar: string
  logo_url: string
  colores_marca: string[]
  competidores: string
  frecuencia_semanal: number
  dia_preferido: string
  fotos_subidas: string[]
}

const INITIAL: OnboardingData = {
  nombre: '',
  rubro: '',
  otro_rubro: '',
  antiguedad: '',
  tono: 'cercano',
  publico_objetivo: '',
  que_no_comunicar: '',
  logo_url: '',
  colores_marca: ['#fa133a'],
  competidores: '',
  frecuencia_semanal: 3,
  dia_preferido: 'lunes',
  fotos_subidas: [],
}

const SELECT_CLASS = 'w-full rounded-xl border border-[#070708]/15 bg-white px-4 py-2.5 text-sm text-[#070708] focus:border-[#fa133a] focus:outline-none focus:ring-2 focus:ring-[#fa133a]/15 transition-colors'

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [data, setData] = useState<OnboardingData>(INITIAL)
  const [saving, setSaving] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingFotos, setUploadingFotos] = useState(false)
  const [error, setError] = useState('')

  const set = (key: keyof OnboardingData, value: unknown) =>
    setData(prev => ({ ...prev, [key]: value }))

  async function uploadToCloudinary(file: File, preset: string): Promise<string> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', preset)
    formData.append('folder', preset === 'contentpilot_logos' ? 'contentpilot/logos' : 'contentpilot/fotos')

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: 'POST', body: formData }
    )
    if (!res.ok) throw new Error('Error al subir imagen')
    const json = await res.json()
    return json.secure_url
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingLogo(true)
    try {
      const url = await uploadToCloudinary(file, 'contentpilot_logos')
      set('logo_url', url)
    } catch {
      setError('Error al subir el logo')
    } finally {
      setUploadingLogo(false)
    }
  }

  async function handleFotosUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploadingFotos(true)
    try {
      const urls = await Promise.all(
        files.map(f => uploadToCloudinary(f, 'contentpilot_fotos'))
      )
      set('fotos_subidas', [...data.fotos_subidas, ...urls])
    } catch {
      setError('Error al subir las fotos')
    } finally {
      setUploadingFotos(false)
    }
  }

  function canAdvance(): boolean {
    if (step === 0) return !!data.nombre && !!data.rubro && !!data.antiguedad
    if (step === 1) return !!data.tono
    if (step === 2) return data.fotos_subidas.length > 0
    return true
  }

  async function handleFinish() {
    if (saving) return
    setSaving(true)
    setError('')

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No autenticado')

      const rubroFinal = data.rubro === 'Otro' ? data.otro_rubro : data.rubro
      const promptBase = buildPromptBase({ ...data, rubro: rubroFinal })

      const { error: negocioError } = await supabase
        .from('negocios')
        .update({
          nombre: data.nombre,
          rubro: rubroFinal,
          antiguedad: data.antiguedad,
          tono: data.tono,
          publico_objetivo: data.publico_objetivo,
          que_no_comunicar: data.que_no_comunicar,
          logo_url: data.logo_url,
          colores_marca: data.colores_marca,
          competidores: data.competidores,
          frecuencia_semanal: data.frecuencia_semanal,
          dia_preferido: data.dia_preferido,
          prompt_base: promptBase,
          onboarding_completado: true,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)

      if (negocioError) throw negocioError

      if (data.fotos_subidas.length > 0) {
        await supabase.from('fotos_biblioteca').insert(
          data.fotos_subidas.map(url => ({
            user_id: user.id,
            url_original: url,
            nombre: 'Foto inicial',
          }))
        )
      }

      router.push('/dashboard')
    } catch {
      setError('Error al guardar. Intentá de nuevo.')
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#d6d7d7] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-white rounded-xl px-4 py-2 shadow-sm mb-4">
            <Image src="/logo-contentpilot.png" alt="ContentPilot" width={140} height={36} className="h-8 w-auto object-contain" />
          </div>
          <p className="text-[#070708]/50 text-sm">Configurá tu negocio en 2 minutos</p>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={cn(
                'flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all',
                i < step
                  ? 'bg-[#fa133a] text-white'
                  : i === step
                    ? 'bg-[#fa133a] text-white ring-4 ring-[#fa133a]/20'
                    : 'bg-white text-[#070708]/30 border border-[#070708]/10'
              )}>
                {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={cn('h-0.5 w-8 rounded-full transition-colors', i < step ? 'bg-[#fa133a]' : 'bg-[#070708]/15')} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-[#070708]/8 shadow-sm p-6">
          <h2 className="font-display font-black text-[#070708] text-lg mb-5">
            Paso {step + 1}: {STEPS[step]}
          </h2>

          {/* PASO 1 */}
          {step === 0 && (
            <div className="space-y-4">
              <Input
                label="Nombre del negocio"
                placeholder="Ej: Café del Centro"
                value={data.nombre}
                onChange={e => set('nombre', e.target.value)}
                required
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#070708]">Rubro</label>
                <select value={data.rubro} onChange={e => set('rubro', e.target.value)} className={SELECT_CLASS}>
                  <option value="">Seleccioná tu rubro</option>
                  {RUBROS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              {data.rubro === 'Otro' && (
                <Input
                  label="¿Cuál es tu rubro?"
                  placeholder="Describe tu rubro"
                  value={data.otro_rubro}
                  onChange={e => set('otro_rubro', e.target.value)}
                />
              )}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#070708]">¿Hace cuánto tenés el negocio?</label>
                <select value={data.antiguedad} onChange={e => set('antiguedad', e.target.value)} className={SELECT_CLASS}>
                  <option value="">Seleccioná</option>
                  <option value="menos_1_anio">Menos de 1 año</option>
                  <option value="1_3_anios">1 a 3 años</option>
                  <option value="mas_3_anios">Más de 3 años</option>
                </select>
              </div>
            </div>
          )}

          {/* PASO 2 */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[#070708]">Tono de comunicación</label>
                <div className="grid grid-cols-2 gap-2">
                  {TONOS.map(({ value, label, ejemplo }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => set('tono', value)}
                      className={cn(
                        'text-left p-3 rounded-xl border-2 transition-all',
                        data.tono === value
                          ? 'border-[#fa133a] bg-[#fa133a]/5 text-[#070708]'
                          : 'border-[#070708]/10 hover:border-[#fa133a]/40 text-[#070708]/70'
                      )}
                    >
                      <div className="font-semibold text-sm">{label}</div>
                      <div className="text-xs text-[#070708]/40 mt-1 line-clamp-2">{ejemplo}</div>
                    </button>
                  ))}
                </div>
              </div>
              <Textarea
                label="¿Quién es tu cliente ideal?"
                placeholder="Ej: Mujeres de 25-40 años que buscan tratamientos de belleza accesibles."
                rows={3}
                value={data.publico_objetivo}
                onChange={e => set('publico_objetivo', e.target.value)}
              />
              <Textarea
                label="¿Qué NO querés comunicar nunca?"
                placeholder="Ej: No quiero parecer agresivo con las ventas, no quiero mencionar precios."
                rows={3}
                value={data.que_no_comunicar}
                onChange={e => set('que_no_comunicar', e.target.value)}
              />
            </div>
          )}

          {/* PASO 3 */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#070708]">Logo (opcional)</label>
                <label className={cn(
                  'flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-6 cursor-pointer transition-colors',
                  data.logo_url ? 'border-[#fa133a]/40 bg-[#fa133a]/5' : 'border-[#070708]/15 hover:border-[#fa133a]/40'
                )}>
                  {data.logo_url ? (
                    <img src={data.logo_url} alt="Logo" className="h-16 w-16 object-contain" />
                  ) : (
                    <>
                      <Upload className="h-6 w-6 text-[#070708]/30" />
                      <span className="text-sm text-[#070708]/50">
                        {uploadingLogo ? 'Subiendo...' : 'Subir logo'}
                      </span>
                    </>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={uploadingLogo} />
                </label>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#070708]">Colores de marca (hasta 3)</label>
                <div className="flex gap-3">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <input
                        type="color"
                        value={data.colores_marca[i] || '#fa133a'}
                        onChange={e => {
                          const arr = [...data.colores_marca]
                          arr[i] = e.target.value
                          set('colores_marca', arr)
                        }}
                        className="h-10 w-10 rounded-lg cursor-pointer border border-[#070708]/15"
                      />
                      <span className="text-xs text-[#070708]/40">Color {i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#070708]">
                  Fotos de tu negocio <span className="text-[#fa133a]">*</span>
                </label>
                <p className="text-xs text-[#070708]/40">Subí al menos 1 foto para que podamos crear tu contenido</p>
                <label className={cn(
                  'flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-6 cursor-pointer transition-colors',
                  data.fotos_subidas.length > 0 ? 'border-green-400 bg-green-50' : 'border-[#070708]/15 hover:border-[#fa133a]/40'
                )}>
                  <Upload className="h-6 w-6 text-[#070708]/30" />
                  <span className="text-sm text-[#070708]/50">
                    {uploadingFotos ? 'Subiendo...' :
                      data.fotos_subidas.length > 0 ? `${data.fotos_subidas.length} foto(s) subida(s) ✓` :
                      'Seleccionar fotos'}
                  </span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleFotosUpload} disabled={uploadingFotos} />
                </label>
                {data.fotos_subidas.length > 0 && (
                  <div className="flex gap-2 flex-wrap mt-1">
                    {data.fotos_subidas.map((url, i) => (
                      <img key={i} src={url} alt={`Foto ${i+1}`} className="h-16 w-16 rounded-xl object-cover border border-[#070708]/10" />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PASO 4 */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[#070708]">
                  ¿Cuántas publicaciones por semana?
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => set('frecuencia_semanal', n)}
                      className={cn(
                        'flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all',
                        data.frecuencia_semanal === n
                          ? 'border-[#fa133a] bg-[#fa133a]/5 text-[#fa133a]'
                          : 'border-[#070708]/10 text-[#070708]/50 hover:border-[#fa133a]/30'
                      )}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-[#070708]/40">Plan Starter incluye hasta 3/semana</p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#070708]">Día preferido para recibir el contenido</label>
                <select value={data.dia_preferido} onChange={e => set('dia_preferido', e.target.value)} className={SELECT_CLASS}>
                  {['lunes','martes','miércoles','jueves','viernes'].map(d => (
                    <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
                  ))}
                </select>
              </div>

              <Textarea
                label="Competidores o referencias (opcional)"
                placeholder="Ej: Me gusta cómo comunica Café Martínez, o el estilo de @nombreInstagram"
                rows={3}
                value={data.competidores}
                onChange={e => set('competidores', e.target.value)}
              />
            </div>
          )}

          {error && (
            <div className="bg-[#fa133a]/8 border border-[#fa133a]/20 rounded-xl px-4 py-2.5 mt-4">
              <p className="text-sm text-[#fa133a] font-medium">{error}</p>
            </div>
          )}

          {/* Navegación */}
          <div className="flex justify-between mt-6 pt-4 border-t border-[#070708]/8">
            <Button
              variant="ghost"
              onClick={() => setStep(s => s - 1)}
              disabled={step === 0}
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>

            {step < STEPS.length - 1 ? (
              <Button onClick={() => setStep(s => s + 1)} disabled={!canAdvance()}>
                Siguiente
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleFinish} loading={saving}>
                Empezar a crear contenido
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

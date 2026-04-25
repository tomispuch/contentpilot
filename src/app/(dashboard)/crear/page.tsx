'use client'

import { useState } from 'react'
import { Upload, Sparkles, Check, ChevronRight, Library } from 'lucide-react'
import TopBar from '@/components/layout/TopBar'
import Button from '@/components/ui/Button'
import Textarea from '@/components/ui/Textarea'
import Card from '@/components/ui/Card'
import Modal from '@/components/ui/Modal'
import { createClient } from '@/lib/supabase/client'
import type { FotoBiblioteca } from '@/types'
import { cn } from '@/lib/utils'

type Step = 'upload' | 'loading' | 'variantes' | 'done'

interface Variante {
  caption: string
  hashtags: string[]
  imagen_procesada_url: string
}

export default function CrearPage() {
  const [step, setStep] = useState<Step>('upload')
  const [fotoUrl, setFotoUrl] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [variantes, setVariantes] = useState<Variante[]>([])
  const [varianteSeleccionada, setVarianteSeleccionada] = useState(0)
  const [captionEditado, setCaptionEditado] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [bibliotecaOpen, setBibliotecaOpen] = useState(false)
  const [fotos, setFotos] = useState<FotoBiblioteca[]>([])
  const [publicacionId, setPublicacionId] = useState('')

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_FOTOS!)
      formData.append('folder', 'contentpilot/fotos')

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      )
      const json = await res.json()
      setFotoUrl(json.secure_url)

      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('fotos_biblioteca').insert({
          user_id: user.id,
          url_original: json.secure_url,
          cloudinary_public_id: json.public_id,
          nombre: file.name,
        })
      }
    } catch {
      setError('Error al subir la imagen. Intentá de nuevo.')
    } finally {
      setUploading(false)
    }
  }

  async function loadBiblioteca() {
    const supabase = createClient()
    const { data } = await supabase
      .from('fotos_biblioteca')
      .select('*')
      .order('created_at', { ascending: false })
    setFotos(data ?? [])
    setBibliotecaOpen(true)
  }

  async function handleGenerar() {
    if (!fotoUrl || !descripcion.trim()) return
    setStep('loading')
    setError('')

    try {
      const res = await fetch('/api/manual-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ foto_url: fotoUrl, descripcion }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error al generar')
      }

      const data = await res.json()
      setVariantes(data.variantes)
      setPublicacionId(data.publicacion_id)
      setCaptionEditado(data.variantes[0]?.caption ?? '')
      setStep('variantes')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error al generar. Intentá de nuevo.')
      setStep('upload')
    }
  }

  async function handleConfirmar() {
    const supabase = createClient()
    await supabase.from('publicaciones').update({
      variante_seleccionada: varianteSeleccionada,
      caption: captionEditado,
      estado: 'pendiente',
      updated_at: new Date().toISOString(),
    }).eq('id', publicacionId)
    setStep('done')
  }

  return (
    <>
      <TopBar title="Crear publicación" />
      <main className="p-4 md:p-6 max-w-2xl mx-auto">

        {/* STEP: Upload */}
        {step === 'upload' && (
          <div className="space-y-4">
            <Card className="p-5 space-y-4">
              <h2 className="text-sm font-bold text-[#070708]">1. Elegí una foto</h2>

              {fotoUrl ? (
                <div className="relative">
                  <img src={fotoUrl} alt="Foto seleccionada" className="w-full rounded-xl object-cover max-h-64" />
                  <button
                    onClick={() => setFotoUrl('')}
                    className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow text-[#070708]/50 hover:text-[#fa133a] transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-[#070708]/15 rounded-xl p-8 cursor-pointer hover:border-[#fa133a]/40 transition-colors">
                    <Upload className="h-7 w-7 text-[#070708]/25" />
                    <div className="text-center">
                      <span className="text-sm text-[#070708]/60 font-semibold">
                        {uploading ? 'Subiendo...' : 'Subir foto'}
                      </span>
                      <p className="text-xs text-[#070708]/30 mt-1">JPG, PNG hasta 10MB</p>
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                  </label>

                  <button
                    onClick={loadBiblioteca}
                    className="flex items-center justify-center gap-2 w-full py-2.5 text-sm text-[#fa133a] font-semibold hover:bg-[#fa133a]/5 rounded-xl transition-colors border border-[#fa133a]/20"
                  >
                    <Library className="h-4 w-4" />
                    Elegir de mi biblioteca
                  </button>
                </div>
              )}
            </Card>

            <Card className="p-5">
              <Textarea
                label="2. ¿Qué querés comunicar con esta foto?"
                placeholder="Ej: Hoy inauguramos nuestra nueva sección de postres artesanales. Quiero que la gente venga a probarlos este fin de semana."
                rows={4}
                value={descripcion}
                onChange={e => setDescripcion(e.target.value)}
                maxLength={300}
                currentLength={descripcion.length}
              />
            </Card>

            {error && (
              <div className="bg-[#fa133a]/8 border border-[#fa133a]/20 rounded-xl px-4 py-3">
                <p className="text-sm text-[#fa133a] font-medium">{error}</p>
              </div>
            )}

            <Button className="w-full" size="lg" onClick={handleGenerar} disabled={!fotoUrl || !descripcion.trim()}>
              <Sparkles className="h-4 w-4" />
              Generar publicaciones
            </Button>
          </div>
        )}

        {/* STEP: Loading */}
        {step === 'loading' && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-4 border-[#d6d7d7] border-t-[#fa133a] animate-spin" />
              <Sparkles className="h-6 w-6 text-[#fa133a] absolute inset-0 m-auto" />
            </div>
            <div className="text-center">
              <p className="text-base font-bold text-[#070708]">Creando tu contenido...</p>
              <p className="text-sm text-[#070708]/40 mt-1">Estamos diseñando 3 opciones únicas para tu negocio</p>
            </div>
            <div className="flex gap-1.5 mt-4">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="h-1.5 w-8 rounded-full bg-[#fa133a]/20 animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        )}

        {/* STEP: Variantes */}
        {step === 'variantes' && (
          <div className="space-y-4">
            <p className="text-sm font-bold text-[#070708]">3 opciones generadas — elegí la que más te guste</p>

            {variantes.map((v, i) => (
              <button
                key={i}
                onClick={() => { setVarianteSeleccionada(i); setCaptionEditado(v.caption) }}
                className={cn(
                  'w-full text-left rounded-2xl border-2 overflow-hidden transition-all',
                  varianteSeleccionada === i
                    ? 'border-[#fa133a] shadow-md shadow-[#fa133a]/10'
                    : 'border-[#070708]/10 hover:border-[#fa133a]/30'
                )}
              >
                <div className="flex gap-3 p-4">
                  {v.imagen_procesada_url && (
                    <img src={v.imagen_procesada_url} alt={`Opción ${i+1}`} className="h-20 w-20 rounded-xl object-cover shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn(
                        'text-xs font-black px-2 py-0.5 rounded-full uppercase tracking-wide',
                        varianteSeleccionada === i
                          ? 'bg-[#fa133a] text-white'
                          : 'bg-[#d6d7d7] text-[#070708]/60'
                      )}>
                        Opción {i + 1}
                      </span>
                      {varianteSeleccionada === i && <Check className="h-3.5 w-3.5 text-[#fa133a]" />}
                    </div>
                    <p className="text-xs text-[#070708]/70 line-clamp-3">{v.caption}</p>
                    <p className="text-xs text-[#fa133a]/60 mt-1 line-clamp-1">{v.hashtags.join(' ')}</p>
                  </div>
                </div>
              </button>
            ))}

            <Card className="p-4">
              <Textarea
                label="Editá el caption si querés"
                value={captionEditado}
                onChange={e => setCaptionEditado(e.target.value)}
                rows={4}
                maxLength={2200}
                currentLength={captionEditado.length}
              />
            </Card>

            <Button className="w-full" size="lg" onClick={handleConfirmar}>
              Confirmar publicación
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* STEP: Done */}
        {step === 'done' && (
          <div className="flex flex-col items-center justify-center py-16 space-y-4 text-center">
            <div className="h-16 w-16 rounded-full bg-[#fa133a]/10 border-2 border-[#fa133a]/20 flex items-center justify-center">
              <Check className="h-8 w-8 text-[#fa133a]" />
            </div>
            <h2 className="text-lg font-bold text-[#070708]">Publicación guardada</h2>
            <p className="text-sm text-[#070708]/45">Podés verla en la sección de publicaciones y aprobarla cuando estés listo.</p>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => { setStep('upload'); setFotoUrl(''); setDescripcion('') }}>
                Crear otra
              </Button>
              <Button onClick={() => window.location.href = '/publicaciones'}>
                Ver publicaciones
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Biblioteca modal */}
      <Modal open={bibliotecaOpen} onClose={() => setBibliotecaOpen(false)} title="Mi biblioteca de fotos" size="lg">
        {fotos.length === 0 ? (
          <p className="text-sm text-[#070708]/40 text-center py-8">No tenés fotos en tu biblioteca todavía.</p>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {fotos.map(foto => (
              <button
                key={foto.id}
                onClick={() => { setFotoUrl(foto.url_original); setBibliotecaOpen(false) }}
                className="aspect-square rounded-xl overflow-hidden hover:ring-2 hover:ring-[#fa133a] transition-all"
              >
                <img src={foto.url_original} alt={foto.nombre || 'Foto'} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </Modal>
    </>
  )
}

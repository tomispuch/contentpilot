'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import TopBar from '@/components/layout/TopBar'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Card from '@/components/ui/Card'
import type { Negocio, FotoBiblioteca } from '@/types'
import { RUBROS, TONOS } from '@/types'
import { Upload, Trash2, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

function buildPromptBase(data: Partial<Negocio>): string {
  return `Sos el community manager de ${data.nombre}, un negocio de ${data.rubro}. El tono debe ser ${data.tono}. El público objetivo es: ${data.publico_objetivo || 'clientes generales'}. Nunca menciones: ${data.que_no_comunicar || 'nada en particular'}. Referencias de estilo: ${data.competidores || 'ninguna específica'}. Generá contenido auténtico, específico para este negocio, evitando frases genéricas o clichés de redes sociales.`
}

export default function PerfilNegocioPage() {
  const [negocio, setNegocio] = useState<Negocio | null>(null)
  const [fotos, setFotos] = useState<FotoBiblioteca[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingFoto, setUploadingFoto] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const [{ data: neg }, { data: fots }] = await Promise.all([
      supabase.from('negocios').select('*').eq('user_id', user.id).single(),
      supabase.from('fotos_biblioteca').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    ])
    if (neg) setNegocio(neg)
    setFotos(fots ?? [])
  }

  function set(key: keyof Negocio, value: unknown) {
    setNegocio(prev => prev ? { ...prev, [key]: value } : prev)
  }

  async function uploadToCloudinary(file: File, preset: string): Promise<{ url: string; public_id: string }> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', preset)
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: 'POST', body: formData }
    )
    const json = await res.json()
    return { url: json.secure_url, public_id: json.public_id }
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingLogo(true)
    const { url } = await uploadToCloudinary(file, 'contentpilot_logos')
    set('logo_url', url)
    setUploadingLogo(false)
  }

  async function handleFotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploadingFoto(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    for (const file of files) {
      const { url, public_id } = await uploadToCloudinary(file, 'contentpilot_fotos')
      await supabase.from('fotos_biblioteca').insert({
        user_id: user.id,
        url_original: url,
        cloudinary_public_id: public_id,
        nombre: file.name,
      })
    }
    await loadData()
    setUploadingFoto(false)
  }

  async function handleDeleteFoto(id: string) {
    const supabase = createClient()
    await supabase.from('fotos_biblioteca').delete().eq('id', id)
    setFotos(prev => prev.filter(f => f.id !== id))
  }

  async function handleSave() {
    if (!negocio) return
    setSaving(true)
    const supabase = createClient()
    const promptBase = buildPromptBase(negocio)

    await supabase.from('negocios').update({
      nombre: negocio.nombre,
      rubro: negocio.rubro,
      tono: negocio.tono,
      publico_objetivo: negocio.publico_objetivo,
      que_no_comunicar: negocio.que_no_comunicar,
      logo_url: negocio.logo_url,
      colores_marca: negocio.colores_marca,
      competidores: negocio.competidores,
      frecuencia_semanal: negocio.frecuencia_semanal,
      dia_preferido: negocio.dia_preferido,
      prompt_base: promptBase,
      updated_at: new Date().toISOString(),
    }).eq('id', negocio.id)

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (!negocio) return (
    <>
      <TopBar title="Mi negocio" />
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    </>
  )

  return (
    <>
      <TopBar title="Mi negocio" />
      <main className="p-4 md:p-6 max-w-2xl mx-auto space-y-5">

        {/* Datos básicos */}
        <Card className="p-5 space-y-4">
          <h2 className="text-sm font-semibold text-gray-900">Datos del negocio</h2>
          <Input
            label="Nombre"
            value={negocio.nombre}
            onChange={e => set('nombre', e.target.value)}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Rubro</label>
            <select
              value={negocio.rubro}
              onChange={e => set('rubro', e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            >
              {RUBROS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </Card>

        {/* Comunicación */}
        <Card className="p-5 space-y-4">
          <h2 className="text-sm font-semibold text-gray-900">Comunicación</h2>
          <div className="grid grid-cols-2 gap-2">
            {TONOS.map(({ value, label, ejemplo }) => (
              <button
                key={value}
                type="button"
                onClick={() => set('tono', value)}
                className={cn(
                  'text-left p-3 rounded-xl border transition-all',
                  negocio.tono === value ? 'border-violet-500 bg-violet-50' : 'border-gray-200 hover:border-violet-300'
                )}
              >
                <div className="text-sm font-medium">{label}</div>
                <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">{ejemplo}</div>
              </button>
            ))}
          </div>
          <Textarea
            label="Público objetivo"
            value={negocio.publico_objetivo || ''}
            onChange={e => set('publico_objetivo', e.target.value)}
            rows={3}
          />
          <Textarea
            label="¿Qué NO comunicar nunca?"
            value={negocio.que_no_comunicar || ''}
            onChange={e => set('que_no_comunicar', e.target.value)}
            rows={2}
          />
          <Textarea
            label="Referencias / competidores"
            value={negocio.competidores || ''}
            onChange={e => set('competidores', e.target.value)}
            rows={2}
          />
        </Card>

        {/* Identidad visual */}
        <Card className="p-5 space-y-4">
          <h2 className="text-sm font-semibold text-gray-900">Identidad visual</h2>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Logo</label>
            <div className="flex items-center gap-3">
              {negocio.logo_url && (
                <img src={negocio.logo_url} alt="Logo" className="h-14 w-14 rounded-xl object-contain border border-gray-200" />
              )}
              <label className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 cursor-pointer hover:bg-gray-50 text-sm text-gray-600 transition-colors">
                <Upload className="h-4 w-4" />
                {uploadingLogo ? 'Subiendo...' : negocio.logo_url ? 'Cambiar logo' : 'Subir logo'}
                <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={uploadingLogo} />
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Colores de marca</label>
            <div className="flex gap-3">
              {[0, 1, 2].map(i => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <input
                    type="color"
                    value={negocio.colores_marca?.[i] || '#7C3AED'}
                    onChange={e => {
                      const arr = [...(negocio.colores_marca || [])]
                      arr[i] = e.target.value
                      set('colores_marca', arr)
                    }}
                    className="h-10 w-10 rounded-lg cursor-pointer border border-gray-300"
                  />
                  <span className="text-xs text-gray-400">#{i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Preferencias */}
        <Card className="p-5 space-y-4">
          <h2 className="text-sm font-semibold text-gray-900">Preferencias de contenido</h2>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Publicaciones por semana</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  onClick={() => set('frecuencia_semanal', n)}
                  className={cn(
                    'flex-1 py-2 rounded-xl text-sm font-medium border transition-all',
                    negocio.frecuencia_semanal === n ? 'border-violet-500 bg-violet-50 text-violet-700' : 'border-gray-200 text-gray-600'
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Día preferido</label>
            <select
              value={negocio.dia_preferido}
              onChange={e => set('dia_preferido', e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            >
              {['lunes', 'martes', 'miércoles', 'jueves', 'viernes'].map(d => (
                <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
              ))}
            </select>
          </div>
        </Card>

        <Button className="w-full" size="lg" onClick={handleSave} loading={saving}>
          {saved ? <><Check className="h-4 w-4" /> Guardado</> : 'Guardar cambios'}
        </Button>

        {/* Biblioteca de fotos */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Biblioteca de fotos</h2>
            <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-50 text-violet-700 text-xs font-medium cursor-pointer hover:bg-violet-100 transition-colors">
              <Upload className="h-3.5 w-3.5" />
              {uploadingFoto ? 'Subiendo...' : 'Agregar fotos'}
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleFotoUpload} disabled={uploadingFoto} />
            </label>
          </div>
          {fotos.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No hay fotos en la biblioteca</p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {fotos.map(foto => (
                <div key={foto.id} className="relative group aspect-square rounded-xl overflow-hidden">
                  <img src={foto.url_original} alt={foto.nombre || 'Foto'} className="w-full h-full object-cover" />
                  <button
                    onClick={() => handleDeleteFoto(foto.id)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </main>
    </>
  )
}

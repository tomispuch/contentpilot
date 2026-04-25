'use client'

import { useState } from 'react'
import { Copy, Check, ThumbsUp, ThumbsDown, Edit2, Clock, Image } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Textarea from '@/components/ui/Textarea'
import type { Publicacion, EstadoPublicacion } from '@/types'
import { formatFecha } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

interface Props {
  publicacion: Publicacion
  onUpdate: (id: string, changes: Partial<Publicacion>) => void
}

export default function PublicacionCard({ publicacion: pub, onUpdate }: Props) {
  const [editOpen, setEditOpen] = useState(false)
  const [editCaption, setEditCaption] = useState(pub.caption)
  const [saving, setSaving] = useState(false)
  const [copiedText, setCopiedText] = useState(false)
  const [variante, setVariante] = useState(pub.variante_seleccionada ?? 0)

  const imagenUrl = pub.variantes?.[variante]?.imagen_procesada_url ?? pub.imagen_procesada_url
  const captionMostrado = pub.variantes?.[variante]?.caption ?? pub.caption
  const hashtagsMostrados = pub.variantes?.[variante]?.hashtags ?? pub.hashtags

  async function cambiarEstado(estado: EstadoPublicacion) {
    const supabase = createClient()
    await supabase.from('publicaciones').update({
      estado,
      ...(estado === 'aprobada' ? { aprobado_at: new Date().toISOString() } : {}),
      updated_at: new Date().toISOString(),
    }).eq('id', pub.id)
    onUpdate(pub.id, { estado })
  }

  async function guardarEdicion() {
    setSaving(true)
    const supabase = createClient()
    await supabase.from('publicaciones').update({
      caption: editCaption,
      estado: 'editada',
      ...(pub.variantes ? { variante_seleccionada: variante } : {}),
      updated_at: new Date().toISOString(),
    }).eq('id', pub.id)
    onUpdate(pub.id, { caption: editCaption, estado: 'editada', variante_seleccionada: variante })
    setSaving(false)
    setEditOpen(false)
  }

  async function copyText() {
    const texto = `${captionMostrado}\n\n${hashtagsMostrados.join(' ')}`
    await navigator.clipboard.writeText(texto)
    setCopiedText(true)
    setTimeout(() => setCopiedText(false), 2000)
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Selector de variantes si es manual */}
        {pub.variantes && pub.variantes.length > 1 && (
          <div className="flex border-b border-gray-100 px-1 pt-1">
            {pub.variantes.map((_, i) => (
              <button
                key={i}
                onClick={() => setVariante(i)}
                className={`flex-1 py-1.5 text-xs font-medium rounded-t-lg transition-colors ${
                  variante === i ? 'bg-violet-50 text-violet-700' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                Opción {i + 1}
              </button>
            ))}
          </div>
        )}

        {/* Imagen */}
        <div className="aspect-square bg-gray-100 relative">
          {imagenUrl ? (
            <img src={imagenUrl} alt="Publicación" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-300">
              <Image className="h-8 w-8" />
              <span className="text-xs">Procesando imagen...</span>
            </div>
          )}
          <div className="absolute top-2 left-2">
            <Badge variant={pub.estado} />
          </div>
        </div>

        {/* Contenido */}
        <div className="p-4 space-y-3">
          <p className="text-sm text-gray-800 leading-relaxed line-clamp-3">{captionMostrado}</p>

          {hashtagsMostrados.length > 0 && (
            <p className="text-xs text-violet-500 line-clamp-2">
              {hashtagsMostrados.join(' ')}
            </p>
          )}

          <p className="text-xs text-gray-400">{formatFecha(pub.created_at)}</p>

          {/* Acciones según estado */}
          {pub.estado === 'pendiente' && (
            <div className="flex gap-2 pt-1">
              <Button variant="ghost" size="sm" className="flex-1 text-green-600 hover:bg-green-50" onClick={() => cambiarEstado('aprobada')}>
                <ThumbsUp className="h-3.5 w-3.5" />
                Aprobar
              </Button>
              <Button variant="ghost" size="sm" className="flex-1" onClick={() => setEditOpen(true)}>
                <Edit2 className="h-3.5 w-3.5" />
                Editar
              </Button>
              <Button variant="ghost" size="sm" className="flex-1 text-red-500 hover:bg-red-50" onClick={() => cambiarEstado('rechazada')}>
                <ThumbsDown className="h-3.5 w-3.5" />
                Rechazar
              </Button>
            </div>
          )}

          {(pub.estado === 'aprobada' || pub.estado === 'editada') && (
            <div className="flex gap-2 pt-1">
              {imagenUrl && (
                <a href={imagenUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button variant="secondary" size="sm" className="w-full">
                    <Image className="h-3.5 w-3.5" />
                    Ver imagen
                  </Button>
                </a>
              )}
              <Button variant="primary" size="sm" className="flex-1" onClick={copyText}>
                {copiedText ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedText ? 'Copiado!' : 'Copiar texto'}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Modal de edición */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Editar publicación" size="lg">
        <div className="space-y-4">
          {imagenUrl && (
            <img src={imagenUrl} alt="Preview" className="w-full rounded-xl object-cover max-h-48" />
          )}
          <Textarea
            label="Caption"
            value={editCaption}
            onChange={e => setEditCaption(e.target.value)}
            rows={5}
            maxLength={2200}
            currentLength={editCaption.length}
          />
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={() => setEditOpen(false)}>Cancelar</Button>
            <Button onClick={guardarEdicion} loading={saving}>Guardar cambios</Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

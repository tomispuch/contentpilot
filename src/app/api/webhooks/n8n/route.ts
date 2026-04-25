import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  // Validar secreto
  const secret = request.headers.get('x-n8n-secret')
  if (secret !== process.env.N8N_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await request.json()
  const { type, user_id, publicacion_id } = body

  if (!type || !user_id) {
    return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
  }

  const supabase = await createServiceClient()

  switch (type) {
    case 'manual_variantes': {
      const { variantes } = body
      if (!publicacion_id || !variantes?.length) {
        return NextResponse.json({ error: 'Faltan variantes o publicacion_id' }, { status: 400 })
      }

      await supabase.from('publicaciones').update({
        variantes,
        imagen_procesada_url: variantes[0]?.imagen_procesada_url,
        caption: variantes[0]?.caption,
        hashtags: variantes[0]?.hashtags,
        variante_seleccionada: 0,
        updated_at: new Date().toISOString(),
      }).eq('id', publicacion_id).eq('user_id', user_id)

      await supabase.from('notificaciones').insert({
        user_id,
        tipo: 'publicaciones_listas',
        payload: { publicacion_id, count: variantes.length },
      })
      break
    }

    case 'automatico_listo': {
      const { publicaciones_ids } = body
      await supabase.from('notificaciones').insert({
        user_id,
        tipo: 'publicaciones_listas',
        payload: { publicaciones_ids, count: publicaciones_ids?.length ?? 0 },
      })
      break
    }

    case 'imagen_regenerada': {
      const { nueva_imagen_url } = body
      if (!publicacion_id) {
        return NextResponse.json({ error: 'Falta publicacion_id' }, { status: 400 })
      }
      await supabase.from('publicaciones').update({
        imagen_procesada_url: nueva_imagen_url,
        updated_at: new Date().toISOString(),
      }).eq('id', publicacion_id).eq('user_id', user_id)
      break
    }

    default:
      return NextResponse.json({ error: `Tipo desconocido: ${type}` }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}

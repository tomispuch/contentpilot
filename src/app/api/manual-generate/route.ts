import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generarVariantesManual } from '@/lib/groq'
import { buildImageUrl } from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    // Rate limiting: máximo 3 generaciones manuales por día
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    const { count } = await supabase
      .from('publicaciones')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('origen', 'manual')
      .gte('created_at', hoy.toISOString())

    if ((count ?? 0) >= 3) {
      return NextResponse.json(
        { error: 'Límite de 3 generaciones manuales por día alcanzado. Intentá mañana.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { foto_url, descripcion } = body

    if (!foto_url || !descripcion?.trim()) {
      return NextResponse.json({ error: 'Faltan foto_url o descripcion' }, { status: 400 })
    }

    // Obtener datos del negocio
    const { data: negocio } = await supabase
      .from('negocios')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!negocio?.prompt_base) {
      return NextResponse.json({ error: 'Completá el onboarding primero' }, { status: 400 })
    }

    // Generar variantes con Groq
    const { variantes: variantesTexto } = await generarVariantesManual(
      negocio.prompt_base,
      descripcion,
      negocio.rubro
    )

    // Extraer public_id de la URL de Cloudinary
    // URL formato: https://res.cloudinary.com/CLOUD/image/upload/v1234/folder/filename.jpg
    const urlParts = foto_url.split('/upload/')
    const publicIdConVersion = urlParts[1] || ''
    const publicId = publicIdConVersion.replace(/^v\d+\//, '') // quitar versión si existe

    // Construir imágenes procesadas para cada variante con Cloudinary URL API
    const variantes = variantesTexto.map(v => ({
      caption: v.caption,
      hashtags: v.hashtags,
      imagen_procesada_url: buildImageUrl(publicId, {
        caption: v.caption,
        logoPublicId: negocio.logo_url ? extraerPublicId(negocio.logo_url) : undefined,
        coloresMarca: negocio.colores_marca,
      }),
    }))

    // Guardar publicación en Supabase
    const { data: publicacion, error: pubError } = await supabase
      .from('publicaciones')
      .insert({
        user_id: user.id,
        estado: 'pendiente',
        origen: 'manual',
        imagen_original_url: foto_url,
        imagen_procesada_url: variantes[0].imagen_procesada_url,
        caption: variantes[0].caption,
        hashtags: variantes[0].hashtags,
        variantes,
        variante_seleccionada: 0,
        generado_por_n8n: false,
      })
      .select()
      .single()

    if (pubError) throw pubError

    return NextResponse.json({
      publicacion_id: publicacion.id,
      variantes,
    })
  } catch (error) {
    console.error('Error en manual-generate:', error)
    return NextResponse.json(
      { error: 'Error al generar el contenido. Intentá de nuevo.' },
      { status: 500 }
    )
  }
}

function extraerPublicId(cloudinaryUrl: string): string {
  const parts = cloudinaryUrl.split('/upload/')
  if (parts.length < 2) return ''
  return parts[1].replace(/^v\d+\//, '')
}

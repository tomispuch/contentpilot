const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

export function buildImageUrl(
  publicId: string,
  options: {
    caption?: string
    logoPublicId?: string
    coloresMarca?: string[]
    width?: number
    height?: number
  } = {}
): string {
  const { caption, logoPublicId, coloresMarca, width = 1080, height = 1080 } = options

  const transformations: string[] = []

  // Redimensionar a cuadrado Instagram
  transformations.push(`c_fill,w_${width},h_${height}`)

  // Overlay de color de marca sutil
  if (coloresMarca && coloresMarca.length > 0) {
    const colorHex = coloresMarca[0].replace('#', '')
    transformations.push(`co_rgb:${colorHex},e_colorize:15`)
  }

  // Overlay de texto con las primeras 10 palabras del caption
  if (caption) {
    const palabras = caption.split(' ').slice(0, 10).join(' ')
    const textoEncoded = encodeURIComponent(palabras)
      .replace(/\(/g, '%28')
      .replace(/\)/g, '%29')
      .replace(/,/g, '%2C')
    transformations.push(
      `l_text:Arial_36_bold:${textoEncoded},co_white,g_south,y_40,w_900,c_fit`
    )
  }

  // Overlay de logo en esquina inferior derecha
  if (logoPublicId) {
    const logoId = logoPublicId.replace(/\//g, ':')
    transformations.push(`l_${logoId},g_south_east,w_180,x_20,y_20`)
  }

  const transformString = transformations.join('/')
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformString}/${publicId}`
}

export function buildRawUrl(publicId: string): string {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${publicId}`
}

// Sube una imagen desde una URL a Cloudinary via fetch (server-side)
export async function uploadFromUrl(
  imageUrl: string,
  folder: string = 'contentpilot/fotos'
): Promise<{ public_id: string; secure_url: string }> {
  const formData = new FormData()
  formData.append('file', imageUrl)
  formData.append('upload_preset', 'contentpilot_fotos')
  formData.append('folder', folder)

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  )

  if (!response.ok) {
    throw new Error(`Cloudinary upload failed: ${response.statusText}`)
  }

  return response.json()
}

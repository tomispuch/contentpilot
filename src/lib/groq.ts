import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const MODEL = 'llama-3.3-70b-versatile'

export interface VarianteGenerada {
  caption: string
  hashtags: string[]
}

export interface GeneracionManualResult {
  variantes: VarianteGenerada[]
}

export async function generarVariantesManual(
  promptBase: string,
  descripcion: string,
  rubro: string
): Promise<GeneracionManualResult> {
  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: 'system',
        content: promptBase,
      },
      {
        role: 'user',
        content: `Generá 3 variantes de publicación para Instagram para un negocio de ${rubro}.
El usuario quiere comunicar: "${descripcion}"

Reglas:
- Cada caption debe ser auténtico, específico y evitar clichés
- Los captions deben ser diferentes entre sí en tono y estructura
- Entre 3 y 8 hashtags por variante, relevantes y en español/inglés mixto
- Devolvé SOLO un JSON válido con esta estructura exacta:

{
  "variantes": [
    { "caption": "texto del caption 1", "hashtags": ["#tag1", "#tag2"] },
    { "caption": "texto del caption 2", "hashtags": ["#tag1", "#tag2"] },
    { "caption": "texto del caption 3", "hashtags": ["#tag1", "#tag2"] }
  ]
}`,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.85,
    max_tokens: 1500,
  })

  const content = completion.choices[0]?.message?.content
  if (!content) throw new Error('Groq no devolvió contenido')

  return JSON.parse(content) as GeneracionManualResult
}

export async function generarPublicacionesAutomaticas(
  promptBase: string,
  rubro: string,
  cantidad: number
): Promise<VarianteGenerada[]> {
  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: 'system',
        content: promptBase,
      },
      {
        role: 'user',
        content: `Generá ${cantidad} publicaciones para Instagram para esta semana.
El negocio es de ${rubro}.

Reglas:
- Cada publicación debe tener un tema diferente (producto destacado, tip, historia, promoción, etc.)
- Auténticas, específicas, sin clichés
- Entre 3 y 8 hashtags por publicación
- Devolvé SOLO un JSON válido:

{
  "publicaciones": [
    { "caption": "texto", "hashtags": ["#tag1"] }
  ]
}`,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.85,
    max_tokens: 2000,
  })

  const content = completion.choices[0]?.message?.content
  if (!content) throw new Error('Groq no devolvió contenido')

  const parsed = JSON.parse(content) as { publicaciones: VarianteGenerada[] }
  return parsed.publicaciones
}

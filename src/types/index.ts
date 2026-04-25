export type Tono = 'profesional' | 'cercano' | 'humoristico' | 'inspirador'
export type EstadoPublicacion = 'pendiente' | 'aprobada' | 'rechazada' | 'editada'
export type OrigenPublicacion = 'automatico' | 'manual'
export type PlanSuscripcion = 'starter' | 'growth' | 'pro'
export type EstadoSuscripcion = 'trial' | 'activa' | 'cancelada' | 'vencida'
export type PeriodoSuscripcion = 'mensual' | 'anual'
export type TipoNotificacion = 'publicaciones_listas' | 'suscripcion_vence' | 'trial_vence'

export interface Negocio {
  id: string
  user_id: string
  nombre: string
  rubro: string
  antiguedad?: string
  tono: Tono
  publico_objetivo?: string
  colores_marca: string[]
  logo_url?: string
  competidores?: string
  que_no_comunicar?: string
  frecuencia_semanal: number
  dia_preferido: string
  prompt_base?: string
  onboarding_completado: boolean
  created_at: string
  updated_at: string
}

export interface FotoBiblioteca {
  id: string
  user_id: string
  url_original: string
  cloudinary_public_id?: string
  nombre?: string
  tags: string[]
  created_at: string
}

export interface VariantePublicacion {
  caption: string
  hashtags: string[]
  imagen_procesada_url: string
}

export interface Publicacion {
  id: string
  user_id: string
  estado: EstadoPublicacion
  origen: OrigenPublicacion
  imagen_original_url?: string
  imagen_procesada_url?: string
  caption: string
  hashtags: string[]
  variantes?: VariantePublicacion[]
  variante_seleccionada?: number
  semana_generacion?: string
  instrucciones_imagen?: string
  generado_por_n8n: boolean
  aprobado_at?: string
  created_at: string
  updated_at: string
}

export interface Suscripcion {
  id: string
  user_id: string
  plan: PlanSuscripcion
  estado: EstadoSuscripcion
  trial_expira_at?: string
  periodo: PeriodoSuscripcion
  mp_subscription_id?: string
  mp_customer_id?: string
  publicaciones_semanales: number
  imagen_ia_habilitada: boolean
  proxima_renovacion?: string
  created_at: string
  updated_at: string
}

export interface Notificacion {
  id: string
  user_id: string
  tipo: TipoNotificacion
  leida: boolean
  payload?: Record<string, unknown>
  created_at: string
}

export const PLAN_LIMITS: Record<PlanSuscripcion, { publicaciones: number; imagenIA: boolean; precio_mensual: number; precio_anual: number }> = {
  starter: { publicaciones: 3, imagenIA: false, precio_mensual: 4999, precio_anual: 49999 },
  growth:  { publicaciones: 5, imagenIA: false, precio_mensual: 8999, precio_anual: 89999 },
  pro:     { publicaciones: 7, imagenIA: true,  precio_mensual: 14999, precio_anual: 149999 },
}

export const RUBROS = [
  'Restaurante / Bar / Café',
  'Peluquería / Barbería',
  'Tienda de ropa / Indumentaria',
  'Consultora / Servicios profesionales',
  'Clínica / Estética / Salud',
  'Otro',
] as const

export const TONOS: { value: Tono; label: string; ejemplo: string }[] = [
  { value: 'profesional', label: 'Profesional', ejemplo: 'Ofrecemos soluciones de calidad para su negocio.' },
  { value: 'cercano',     label: 'Cercano',      ejemplo: 'Hola! Hoy tenemos algo especial para vos.' },
  { value: 'humoristico', label: 'Humorístico',  ejemplo: 'Lunes sin café = error 404. Nosotros lo solucionamos.' },
  { value: 'inspirador',  label: 'Inspirador',   ejemplo: 'Cada día es una nueva oportunidad para brillar.' },
]

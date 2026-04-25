import { cn } from '@/lib/utils'

type BadgeVariant = 'pendiente' | 'aprobada' | 'rechazada' | 'editada' | 'trial' | 'activa' | 'cancelada' | 'vencida' | 'starter' | 'growth' | 'pro' | 'default'

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  pendiente:  'bg-amber-100 text-amber-700 border border-amber-200',
  aprobada:   'bg-green-100 text-green-700 border border-green-200',
  rechazada:  'bg-[#fa133a]/10 text-[#fa133a] border border-[#fa133a]/20',
  editada:    'bg-[#070708]/8 text-[#070708] border border-[#070708]/15',
  trial:      'bg-amber-100 text-amber-700 border border-amber-200',
  activa:     'bg-green-100 text-green-700 border border-green-200',
  cancelada:  'bg-[#fa133a]/10 text-[#fa133a] border border-[#fa133a]/20',
  vencida:    'bg-[#070708]/8 text-[#070708]/50 border border-[#070708]/10',
  starter:    'bg-[#070708]/8 text-[#070708] border border-[#070708]/15',
  growth:     'bg-[#fa133a]/10 text-[#fa133a] border border-[#fa133a]/20',
  pro:        'bg-amber-100 text-amber-700 border border-amber-200',
  default:    'bg-[#d6d7d7] text-[#070708]/60 border border-[#070708]/10',
}

const LABELS: Record<BadgeVariant, string> = {
  pendiente:  'Pendiente',
  aprobada:   'Aprobada',
  rechazada:  'Rechazada',
  editada:    'Editada',
  trial:      'Prueba gratuita',
  activa:     'Activa',
  cancelada:  'Cancelada',
  vencida:    'Vencida',
  starter:    'Starter',
  growth:     'Growth',
  pro:        'Pro',
  default:    '',
}

interface BadgeProps {
  variant: BadgeVariant
  className?: string
  label?: string
}

export default function Badge({ variant, className, label }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
      VARIANT_STYLES[variant],
      className
    )}>
      {label ?? LABELS[variant]}
    </span>
  )
}

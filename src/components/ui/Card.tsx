import { cn } from '@/lib/utils'

interface CardProps {
  className?: string
  children: React.ReactNode
  onClick?: () => void
}

export default function Card({ className, children, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white rounded-2xl border border-[#070708]/8 shadow-sm',
        onClick && 'cursor-pointer hover:border-[#fa133a]/30 hover:shadow-md transition-all',
        className
      )}
    >
      {children}
    </div>
  )
}

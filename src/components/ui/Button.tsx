'use client'

import { cn } from '@/lib/utils'
import { type ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fa133a]/50 disabled:opacity-50 disabled:cursor-not-allowed',
          {
            'bg-[#fa133a] text-white hover:bg-[#d40d2e] active:bg-[#b00a25] shadow-sm': variant === 'primary',
            'bg-[#d6d7d7] text-[#070708] hover:bg-[#c4c5c5] active:bg-[#b8b9b9]': variant === 'secondary',
            'text-[#070708]/60 hover:bg-[#d6d7d7] hover:text-[#070708] active:bg-[#c4c5c5]': variant === 'ghost',
            'bg-[#fa133a]/10 text-[#fa133a] hover:bg-[#fa133a]/20 active:bg-[#fa133a]/30 border border-[#fa133a]/20': variant === 'danger',
            'border border-[#070708]/20 text-[#070708] hover:bg-[#070708] hover:text-white active:bg-[#070708]/90': variant === 'outline',
            'px-3 py-1.5 text-xs': size === 'sm',
            'px-4 py-2.5 text-sm': size === 'md',
            'px-6 py-3 text-base': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {loading && (
          <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
export default Button

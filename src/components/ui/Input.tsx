import { cn } from '@/lib/utils'
import { type InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s/g, '-')
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-semibold text-[#070708]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full rounded-xl border border-[#070708]/15 bg-white px-4 py-2.5 text-sm text-[#070708] placeholder:text-[#070708]/30 focus:border-[#fa133a] focus:outline-none focus:ring-2 focus:ring-[#fa133a]/15 transition-colors disabled:bg-[#d6d7d7]/50 disabled:cursor-not-allowed',
            error && 'border-[#fa133a] focus:border-[#fa133a] focus:ring-[#fa133a]/20',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-[#fa133a] font-medium">{error}</p>}
        {hint && !error && <p className="text-xs text-[#070708]/40">{hint}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
export default Input

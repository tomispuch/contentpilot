import { cn } from '@/lib/utils'
import { type TextareaHTMLAttributes, forwardRef } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
  maxLength?: number
  currentLength?: number
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, maxLength, currentLength, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s/g, '-')
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          maxLength={maxLength}
          className={cn(
            'w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-colors resize-none disabled:bg-gray-50',
            error && 'border-red-400 focus:border-red-400 focus:ring-red-400/20',
            className
          )}
          {...props}
        />
        <div className="flex justify-between">
          <span>{error && <p className="text-xs text-red-500">{error}</p>}
          {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}</span>
          {maxLength && (
            <span className="text-xs text-gray-400">
              {currentLength ?? 0}/{maxLength}
            </span>
          )}
        </div>
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
export default Textarea

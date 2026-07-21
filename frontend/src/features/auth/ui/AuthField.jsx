import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'

const AuthField = ({ label, name, type = 'text', value, onChange, placeholder, icon: Icon, autoComplete, inputMode, className }) => {
  const [showPassword, setShowPassword] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className={cn('space-y-[var(--spacing-xs)]', className)}>
      <label
        htmlFor={name}
        className={cn(
          'text-[13px] font-[var(--font-weight-480)] tracking-[var(--tracking-body-sm)] transition-colors duration-200',
          isFocused ? 'text-ink' : 'text-ink-muted',
        )}
      >
        {label}
      </label>

      <div className="relative">
        {Icon && (
          <span
            className={cn(
              'pointer-events-none absolute left-[var(--spacing-sm)] top-1/2 z-10 -translate-y-1/2 transition-colors duration-200',
              isFocused ? 'text-ink' : 'text-ink-muted',
            )}
          >
            <Icon className="size-[15px]" strokeWidth={1.5} />
          </span>
        )}

        <Input
          id={name}
          name={name}
          type={type === 'password' && showPassword ? 'text' : type}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          className={cn(
            'h-12 bg-canvas text-[var(--text-body-sm)] font-[var(--font-weight-330)] tracking-[var(--tracking-body-sm)] text-ink',
            'border-hairline placeholder:text-ink-muted placeholder:font-[var(--font-weight-330)]',
            Icon ? 'pl-[var(--spacing-xl)]' : 'pl-[var(--spacing-md)]',
            'pr-[var(--spacing-sm)]',
            'focus-visible:border-ink/50 focus-visible:ring-2 focus-visible:ring-ink/10',
          )}
        />

        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className={cn(
              'absolute right-[var(--spacing-xxs)] top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-[var(--radius-sm)] transition-all duration-150',
              'text-ink-muted hover:bg-surface-soft hover:text-ink focus-visible:ring-2 focus-visible:ring-ink/20',
            )}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="size-[15px]" strokeWidth={1.5} /> : <Eye className="size-[15px]" strokeWidth={1.5} />}
          </button>
        )}
      </div>
    </div>
  )
}

export default AuthField

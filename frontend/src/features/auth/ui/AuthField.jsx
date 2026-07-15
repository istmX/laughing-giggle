import { useEffect, useRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'

const AuthField = ({ label, name, type = 'text', value, onChange, placeholder, icon: Icon, autoComplete, inputMode, className }) => {
  const prefersReducedMotion = useReducedMotion()
  const typingRef = useRef(null)
  const [isTyping, setIsTyping] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => () => { if (typingRef.current) clearTimeout(typingRef.current) }, [])

  const triggerPulse = () => {
    if (prefersReducedMotion) return
    setIsTyping(true)
    if (typingRef.current) clearTimeout(typingRef.current)
    typingRef.current = setTimeout(() => setIsTyping(false), 180)
  }

  return (
    <div className={cn('space-y-[var(--spacing-xs)]', className)}>
      <label
        className={cn(
          'text-[13px] font-[var(--font-weight-330)] tracking-[var(--tracking-body-sm)] transition-colors duration-200',
          isFocused ? 'text-ink/70' : 'text-ink/50',
        )}
        htmlFor={name}
      >
        {label}
      </label>

      <motion.div
        animate={prefersReducedMotion ? undefined : isTyping ? { scale: 1.005, y: -0.5 } : { scale: 1, y: 0 }}
        transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        <span
          className={cn(
            'pointer-events-none absolute left-[var(--spacing-sm)] top-1/2 z-10 -translate-y-1/2 transition-all duration-250',
            isFocused ? 'text-ink' : 'text-ink/20',
          )}
        >
          {Icon && <Icon className="size-[15px]" strokeWidth={1.5} />}
        </span>

        <Input
          id={name}
          name={name}
          type={type === 'password' && showPassword ? 'text' : type}
          value={value}
          onChange={(e) => { onChange(e); triggerPulse() }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          className={cn(
            'h-[var(--spacing-xl)] bg-canvas px-0 py-0',
            'pl-[var(--spacing-md)] pr-[var(--spacing-sm)]',
            'text-[var(--text-body-sm)] font-[var(--font-weight-320)] tracking-[var(--tracking-body-sm)] text-ink',
            'placeholder:text-ink/20 placeholder:font-[var(--font-weight-320)]',
            'transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]',
            'border-hairline',
            'hover:border-ink/20 hover:shadow-[0_0_0_3px_rgba(0,0,0,0.02)]',
            'focus-visible:border-ink focus-visible:shadow-[0_0_0_4px_rgba(0,0,0,0.06)] focus-visible:ring-0',
            'autofill:bg-canvas autofill:shadow-[0_0_0_100px_canvas_inset]',
          )}
        />

        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className={cn(
              'absolute right-[var(--spacing-xs)] top-1/2 -translate-y-1/2 rounded-[var(--radius-sm)] p-[var(--spacing-xxs)] transition-all duration-150',
              'text-ink/20 hover:text-ink/50 hover:bg-surface-soft',
            )}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="size-[15px]" strokeWidth={1.5} /> : <Eye className="size-[15px]" strokeWidth={1.5} />}
          </button>
        )}
      </motion.div>
    </div>
  )
}

export default AuthField

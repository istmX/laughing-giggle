import { useEffect, useRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const AuthField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  icon: Icon,
  autoComplete,
  inputMode,
  className,
}) => {
  const prefersReducedMotion = useReducedMotion()
  const typingTimeoutRef = useRef(null)
  const [isTyping, setIsTyping] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        window.clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [])

  const triggerTypingPulse = () => {
    if (prefersReducedMotion) {
      return
    }

    setIsTyping(true)

    if (typingTimeoutRef.current) {
      window.clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = window.setTimeout(() => {
      setIsTyping(false)
    }, 170)
  }

  const inputType = type === 'password' && showPassword ? 'text' : type

  return (
    <div className={cn('space-y-3', className)}>
      <label className="text-body-sm font-medium text-foreground" htmlFor={name}>
        {label}
      </label>

      <motion.div
        animate={
          prefersReducedMotion
            ? undefined
            : isTyping
              ? { scale: 1.008, y: -1 }
              : { scale: 1, y: 0 }
        }
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        {Icon ? (
          <span
            className={cn(
              'pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-ink-soft transition-colors duration-200',
              isTyping && 'text-foreground',
            )}
          >
            <Icon className="size-4" />
          </span>
        ) : null}

        <Input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={(event) => {
            onChange(event)
            triggerTypingPulse()
          }}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          className={cn(
            'h-14 rounded-md border-border bg-background pl-11 pr-11 text-body-sm text-foreground shadow-none',
            'placeholder:text-ink-soft focus-visible:border-primary focus-visible:bg-background focus-visible:ring-0',
            'transition-[border-color,background-color,transform] duration-200',
          )}
        />

        {type === 'password' ? (
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-ink-soft transition-colors hover:text-foreground"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
          </button>
        ) : null}
      </motion.div>
    </div>
  )
}

export default AuthField

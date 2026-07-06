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
      <label className="text-[0.95rem] font-medium text-white" htmlFor={name}>
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
        <span
          className={cn(
            'pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-white/42 transition-colors duration-200',
            isTyping && 'text-white/75',
          )}
        >
          <Icon className="size-4" />
        </span>

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
            'h-14 rounded-[16px] border-white/12 bg-white/[0.03] pl-11 pr-11 text-[15px] text-white shadow-none',
            'placeholder:text-white/34 focus-visible:border-white/60 focus-visible:bg-white/[0.05] focus-visible:ring-0',
            'transition-[border-color,background-color,transform] duration-200',
          )}
        />

        {type === 'password' ? (
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-white/42 transition-colors hover:text-white"
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

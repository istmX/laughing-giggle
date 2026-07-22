import { useState, useRef, useCallback, useEffect } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export function useScramble({ enterTarget, leaveTarget, initial, preserve = (ch) => false }) {
  const [display, setDisplay] = useState(initial)
  const intervalRef = useRef(null)

  const scramble = useCallback((target, onDone) => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    let iter = 0

    const interval = setInterval(() => {
      iter += 1
      if (iter >= target.length) {
        setDisplay(target)
        clearInterval(interval)
        intervalRef.current = null
        if (onDone) onDone()
        return
      }
      setDisplay(
        target
          .split('')
          .map((char, index) => {
            if (preserve(char)) return char
            if (index < iter) return target[index]
            return CHARS[Math.floor(Math.random() * CHARS.length)]
          })
          .join('')
      )
    }, 15)
    intervalRef.current = interval
  }, [preserve])

  const handleEnter = useCallback(() => scramble(enterTarget), [scramble, enterTarget])
  const handleLeave = useCallback(() => scramble(leaveTarget), [scramble, leaveTarget])

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return { display, handleEnter, handleLeave }
}

import { createContext, useContext, useRef, useState, useEffect, useLayoutEffect } from 'react'
import { ArrowDown } from 'lucide-react'

// --- Contexts ---
const MessageScrollerContext = createContext(null)
const MessageScrollerVisibilityContext = createContext(null)
const MessageScrollerScrollableContext = createContext(null)

export function MessageScrollerProvider({
  children,
  autoScroll = true,
  scrollPreviousItemPeek = 64,
  defaultScrollPosition = 'last-anchor',
  preserveScrollOnPrepend = true,
}) {
  const viewportRef = useRef(null)
  const contentRef = useRef(null)
  const itemsRef = useRef(new Map())
  const [currentAnchorId, setCurrentAnchorId] = useState(null)
  const [visibleMessageIds, setVisibleMessageIds] = useState([])
  const [scrollable, setScrollable] = useState({ start: false, end: false })
  const [isFollowing, setIsFollowing] = useState(true)

  // Track scrollable state
  const updateScrollState = () => {
    const el = viewportRef.current
    if (!el) return
    const start = el.scrollTop > 1
    const end = el.scrollHeight - el.scrollTop - el.clientHeight > 5
    setScrollable({ start, end })

    // If user scrolls to the absolute end, re-engage following
    if (!end && autoScroll) {
      setIsFollowing(true)
    }
  }

  // Handle user scroll (detects if user scrolls away from edge to pause follow)
  const handleScroll = () => {
    updateScrollState()
    const el = viewportRef.current
    if (!el) return

    const isAtEnd = el.scrollHeight - el.scrollTop - el.clientHeight <= 10
    if (!isAtEnd && isFollowing) {
      setIsFollowing(false)
    }
  }

  // Scroll methods
  const scrollToEnd = (behavior = 'smooth') => {
    const el = viewportRef.current
    if (!el) return
    setIsFollowing(true)
    el.scrollTo({
      top: el.scrollHeight,
      behavior,
    })
  }

  const scrollToStart = (behavior = 'smooth') => {
    const el = viewportRef.current
    if (!el) return
    setIsFollowing(false)
    el.scrollTo({
      top: 0,
      behavior,
    })
  }

  const scrollToMessage = (messageId, behavior = 'smooth') => {
    const item = itemsRef.current.get(messageId)
    if (!item || !viewportRef.current) return false

    setIsFollowing(false)
    const viewTop = viewportRef.current.getBoundingClientRect().top
    const itemTop = item.getBoundingClientRect().top
    const offset = itemTop - viewTop + viewportRef.current.scrollTop - scrollPreviousItemPeek

    viewportRef.current.scrollTo({
      top: Math.max(0, offset),
      behavior,
    })
    return true
  }

  const observerRef = useRef(null)

  // Set up visibility observer
  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute('data-message-id')
          if (!id) return

          if (entry.isIntersecting) {
            setVisibleMessageIds((prev) => {
              if (prev.includes(id)) return prev
              const all = Array.from(itemsRef.current.keys())
              return all.filter((k) => k === id || prev.includes(k))
            })
            // If it is an anchor, update current anchor
            if (entry.target.getAttribute('data-scroll-anchor') === 'true') {
              setCurrentAnchorId(id)
            }
          } else {
            setVisibleMessageIds((prev) => prev.filter((x) => x !== id))
          }
        });
      },
      {
        root: viewport,
        threshold: 0.1,
      }
    )

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  const registerItem = (id, element) => {
    if (element) {
      itemsRef.current.set(id, element)
      if (observerRef.current) {
        observerRef.current.observe(element)
      }
    } else {
      const prevEl = itemsRef.current.get(id)
      if (prevEl && observerRef.current) {
        observerRef.current.unobserve(prevEl)
      }
      itemsRef.current.delete(id)
    }
  }

  // Track prepended items (Preserve Scroll Position on Prepend)
  const prevCountRef = useRef(0)
  const prevHeightRef = useRef(0)
  const prevScrollTopRef = useRef(0)

  useLayoutEffect(() => {
    const el = viewportRef.current
    if (!el || !preserveScrollOnPrepend) return

    const currentHeight = el.scrollHeight
    const itemsCount = itemsRef.current.size

    // If prepended items
    if (itemsCount > prevCountRef.current && prevCountRef.current > 0 && el.scrollTop > 0) {
      const heightDiff = currentHeight - prevHeightRef.current
      el.scrollTop = prevScrollTopRef.current + heightDiff
    }

    prevCountRef.current = itemsCount
    prevHeightRef.current = currentHeight
    prevScrollTopRef.current = el.scrollTop
  })

  // Auto-scroll logic on new messages
  useEffect(() => {
    const el = viewportRef.current
    if (!el || !isFollowing || !autoScroll) return
    el.scrollTop = el.scrollHeight
  }, [isFollowing, autoScroll])

  // Initial scroll position
  useEffect(() => {
    const el = viewportRef.current
    if (!el) return

    const initPosition = () => {
      if (defaultScrollPosition === 'start') {
        el.scrollTop = 0
      } else if (defaultScrollPosition === 'end') {
        el.scrollTop = el.scrollHeight
      } else if (defaultScrollPosition === 'last-anchor') {
        // Find last anchored item
        const items = Array.from(itemsRef.current.values())
        const lastAnchor = items.reverse().find((item) => item.getAttribute('data-scroll-anchor') === 'true')
        if (lastAnchor) {
          const viewTop = el.getBoundingClientRect().top
          const itemTop = lastAnchor.getBoundingClientRect().top
          const offset = itemTop - viewTop + el.scrollTop - scrollPreviousItemPeek
          el.scrollTop = Math.max(0, offset)
        } else {
          el.scrollTop = el.scrollHeight
        }
      }
      updateScrollState()
    }

    // Small delay to allow elements to measure correctly
    const timer = setTimeout(initPosition, 50)
    return () => clearTimeout(timer)
  }, [defaultScrollPosition])

  return (
    <MessageScrollerContext.Provider
      value={{
        viewportRef,
        contentRef,
        registerItem,
        scrollToEnd,
        scrollToStart,
        scrollToMessage,
        isFollowing,
        setIsFollowing,
        handleScroll,
      }}
    >
      <MessageScrollerVisibilityContext.Provider value={{ currentAnchorId, visibleMessageIds }}>
        <MessageScrollerScrollableContext.Provider value={scrollable}>
          {children}
        </MessageScrollerScrollableContext.Provider>
      </MessageScrollerVisibilityContext.Provider>
    </MessageScrollerContext.Provider>
  )
}

// --- Hooks ---
export function useMessageScroller() {
  const context = useContext(MessageScrollerContext)
  if (!context) throw new Error('useMessageScroller must be used within MessageScrollerProvider')
  return {
    scrollToEnd: context.scrollToEnd,
    scrollToStart: context.scrollToStart,
    scrollToMessage: context.scrollToMessage,
  }
}

export function useMessageScrollerVisibility() {
  const context = useContext(MessageScrollerVisibilityContext)
  if (!context) throw new Error('useMessageScrollerVisibility must be used within MessageScrollerProvider')
  return context
}

export function useMessageScrollerScrollable() {
  const context = useContext(MessageScrollerScrollableContext)
  if (!context) throw new Error('useMessageScrollerScrollable must be used within MessageScrollerProvider')
  return context
}

// --- UI Components ---
export function MessageScroller({ children, className = '' }) {
  const { isFollowing } = useContext(MessageScrollerContext)
  return (
    <div
      data-autoscrolling={isFollowing ? 'true' : 'false'}
      className={`relative w-full h-full flex flex-col ${className}`}
    >
      {children}
    </div>
  )
}

export function MessageScrollerViewport({ children, className = '' }) {
  const { viewportRef, handleScroll } = useContext(MessageScrollerContext)
  return (
    <div
      ref={viewportRef}
      onScroll={handleScroll}
      role="region"
      aria-label="Messages"
      tabIndex={0}
      className={`w-full flex-1 overflow-y-auto outline-none scroll-smooth ${className}`}
    >
      {children}
    </div>
  )
}

export function MessageScrollerContent({ children, className = '', ...props }) {
  const { contentRef } = useContext(MessageScrollerContext)
  return (
    <div
      ref={contentRef}
      role="log"
      aria-relevant="additions"
      className={`w-full flex flex-col ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export function MessageScrollerItem({
  children,
  messageId,
  scrollAnchor = false,
  className = '',
}) {
  const { registerItem } = useContext(MessageScrollerContext)
  const itemRef = useRef(null)

  useEffect(() => {
    if (messageId) {
      registerItem(messageId, itemRef.current)
    }
    return () => {
      if (messageId) {
        registerItem(messageId, null)
      }
    }
  }, [messageId, scrollAnchor])

  return (
    <div
      ref={itemRef}
      data-message-id={messageId}
      data-scroll-anchor={scrollAnchor ? 'true' : 'false'}
      className={`w-full content-visibility-auto contain-intrinsic-size-[86px] ${className}`}
    >
      {children}
    </div>
  )
}

export function MessageScrollerButton({ className = '' }) {
  const { scrollToEnd } = useContext(MessageScrollerContext)
  const { end } = useMessageScrollerScrollable()

  if (!end) return null

  return (
    <button
      onClick={() => scrollToEnd('smooth')}
      className={`absolute bottom-4 right-4 bg-ink text-canvas p-3 rounded-full shadow-lg border border-hairline hover:opacity-90 transition-opacity z-20 flex items-center justify-center ${className}`}
      aria-label="Scroll to latest reply"
    >
      <ArrowDown className="h-4 w-4" />
    </button>
  )
}

import { useState, useRef, useEffect } from 'react'
import { ArrowRight, Sparkles, LayoutDashboard, ShoppingBag, Database, ArrowUpRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { TextShimmerWave } from '@/components/ui/text-shimmer-wave'

const PROJECT_STARTERS = [
  {
    id: 'saas',
    icon: LayoutDashboard,
    title: 'SaaS Dashboard',
    prompt: 'I want to build a B2B SaaS dashboard for marketing analytics. Key features include a main overview with MRR charts, a user management table with role-based access, and a settings page for API integrations. Users are marketing managers who need quick insights. Preferred stack: React and Node.js.'
  },
  {
    id: 'ecommerce',
    icon: ShoppingBag,
    title: 'E-commerce Store',
    prompt: 'I want to build a modern e-commerce storefront for artisan coffee. It needs a product catalog with filtering, a sliding cart drawer, and a secure checkout flow. Target audience is coffee enthusiasts. Focus on high-quality imagery and minimal design. Preferred stack: Next.js and Stripe.'
  },
  {
    id: 'admin',
    icon: Database,
    title: 'Internal Admin Tool',
    prompt: 'I want to build an internal admin tool for processing customer refunds. It should have a data table showing pending requests, a detail view for reviewing tickets, and approval/rejection workflows with internal notes.'
  }
]

export function PromptInput({ onSubmit, isLoading, initialValue = '' }) {
  const [val, setVal] = useState(initialValue)
  const textareaRef = useRef(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
      if (!initialValue) {
        textareaRef.current.focus()
      }
    }
  }, [initialValue])

  const handleInput = (e) => {
    setVal(e.target.value)
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (val.trim() && !isLoading) onSubmit(val.trim())
    }
  }

  const handleStarterSelect = (starter) => {
    setVal(starter.prompt)
    if (textareaRef.current) {
      textareaRef.current.focus()
      setTimeout(() => {
        textareaRef.current.style.height = 'auto'
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
      }, 50)
    }
  }

  return (
    <div className="w-full flex flex-col xl:flex-row gap-12 lg:gap-16 animate-fade-in relative z-10 justify-center">
      <div className="flex-1 flex flex-col w-full max-w-[800px] xl:max-w-[720px] transition-all">
        <div className="mb-10 pl-2">
          <h1 className="text-display-lg tracking-display-lg font-[340] text-ink mb-4 leading-tight">
            What are you building?
          </h1>
          <p className="text-body-lg tracking-body-lg text-ink-muted font-[400] max-w-[600px] leading-relaxed">
            Describe your project in detail. Zenix will structure the architecture and clarify any missing requirements.
          </p>
        </div>

        <div className="relative group">
          <div className="absolute -inset-[1px] bg-gradient-to-b from-brand-indigo/15 to-transparent rounded-[32px] opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <textarea
            ref={textareaRef}
            value={val}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="I want to build a..."
            className="relative w-full min-h-[260px] resize-none rounded-[32px] border border-hairline bg-surface-elevated p-8 sm:p-10 text-body-lg tracking-body-lg font-[400] text-ink placeholder:text-ink-faint focus:border-brand-indigo/30 focus:outline-none focus:ring-[4px] focus:ring-brand-indigo/10 transition-all shadow-md disabled:opacity-50 !leading-[1.7]"
          />
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={() => { if (val.trim() && !isLoading) onSubmit(val.trim()) }}
            disabled={!val.trim() || isLoading}
            className="inline-flex items-center justify-center gap-3 rounded-[40px] bg-ink px-10 py-[18px] text-[17px] tracking-tight font-[540] text-canvas hover:opacity-90 hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <TextShimmerWave 
                className="font-[540] [--base-color:rgba(255,255,255,0.4)] [--base-gradient-color:#ffffff]"
                duration={1.2}
              >
                Analyzing...
              </TextShimmerWave>
            ) : (
              <>
                Start building
                <ArrowRight className="h-[18px] w-[18px]" strokeWidth={2.5} />
              </>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {!val && (
          <motion.div 
            initial={{ opacity: 0, filter: 'blur(8px)', x: 10 }}
            animate={{ opacity: 1, filter: 'blur(0px)', x: 0 }}
            exit={{ opacity: 0, filter: 'blur(8px)', x: 10 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full xl:w-[320px] shrink-0 pt-2 xl:pt-[156px] flex flex-col gap-10"
          >
            {/* Guidance Section */}
            <div className="flex flex-col gap-5 px-2">
              <h3 className="text-[11px] font-mono tracking-[0.1em] text-ink-muted/80 uppercase">Writing Guide</h3>
              <div className="space-y-5">
                <div className="flex gap-3.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-indigo/40 mt-2 shrink-0" />
                  <p className="text-[14.5px] font-[480] text-ink-muted leading-[1.6]">
                    <span className="text-ink font-[540]">Who is it for?</span> Defines your target audience and user roles.
                  </p>
                </div>
                <div className="flex gap-3.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-indigo/40 mt-2 shrink-0" />
                  <p className="text-[14.5px] font-[480] text-ink-muted leading-[1.6]">
                    <span className="text-ink font-[540]">Core problem?</span> Explains the main value proposition of the app.
                  </p>
                </div>
                <div className="flex gap-3.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-indigo/40 mt-2 shrink-0" />
                  <p className="text-[14.5px] font-[480] text-ink-muted leading-[1.6]">
                    <span className="text-ink font-[540]">Key features?</span> The essential functional requirements.
                  </p>
                </div>
                <div className="flex gap-3.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-indigo/40 mt-2 shrink-0" />
                  <p className="text-[14.5px] font-[480] text-ink-muted leading-[1.6]">
                    <span className="text-ink font-[540]">Tech stack?</span> Preferred frameworks, database, and libraries.
                  </p>
                </div>
              </div>
            </div>

            {/* Starters Section */}
            <div className="flex flex-col gap-4 pt-8 border-t border-hairline/60 mx-2">
              <h3 className="text-[11px] font-mono tracking-[0.1em] text-ink-muted/80 uppercase mb-1">Starter Templates</h3>
              <div className="flex flex-col gap-3">
                {PROJECT_STARTERS.map((starter) => (
                  <button
                    key={starter.id}
                    onClick={() => handleStarterSelect(starter)}
                    className="group flex items-center justify-between p-4 rounded-[16px] border border-transparent hover:border-hairline bg-transparent hover:bg-surface-elevated hover:shadow-sm transition-all text-left"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="h-8 w-8 rounded-full bg-surface-soft border border-hairline/50 flex items-center justify-center text-ink-muted group-hover:text-brand-indigo group-hover:bg-brand-indigo/5 group-hover:border-brand-indigo/20 transition-colors">
                        <starter.icon className="h-4 w-4" />
                      </div>
                      <span className="text-[14.5px] font-[540] text-ink group-hover:text-brand-indigo transition-colors">
                        {starter.title}
                      </span>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-ink-faint group-hover:text-brand-indigo transition-all duration-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

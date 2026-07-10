import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 w-full max-w-[672px] flex flex-col items-center"
      >
        <div className="space-y-2 flex flex-col items-center">
          <h1 className="text-[100px] leading-none font-340 tracking-display-xl text-ink">404</h1>
          <p className="text-headline font-340 text-ink-muted tracking-subhead">
            We couldn't find the page you're looking for.
          </p>
        </div>
        
        <div className="pt-4">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-button font-480 px-8 py-4 rounded-full hover:scale-105 transition-transform"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default NotFound

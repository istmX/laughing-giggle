import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8 max-w-lg"
      >
        <div className="space-y-2">
          <h1 className="text-display-xl font-340 tracking-display-xl text-ink">404</h1>
          <p className="text-headline font-340 text-ink-muted tracking-subhead">
            We couldn't find the page you're looking for.
          </p>
        </div>
        
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-button font-480 px-8 py-4 rounded-full hover:scale-105 transition-transform"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Home
        </Link>
      </motion.div>
    </div>
  )
}

export default NotFound

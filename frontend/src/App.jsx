import AppRoutes from './Routes/AppRoutes'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from '@/features/preferences/ui/ThemeProvider'

const App = () => {
  return (
    <ThemeProvider>
      <Toaster 
        position="top-center" 
        toastOptions={{
          className: 'border border-hairline bg-surface-elevated text-ink font-sans text-body-sm shadow-md rounded-lg',
          duration: 3000,
        }} 
      />
      <AppRoutes />
    </ThemeProvider>
  )
}

export default App

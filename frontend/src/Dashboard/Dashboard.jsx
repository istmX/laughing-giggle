import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'

export default function DashboardShell() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="flex h-dvh w-full bg-background overflow-hidden text-foreground font-sans">
      <Sidebar 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Header setIsMobileMenuOpen={setIsMobileMenuOpen} />
        <Outlet />
      </main>
    </div>
  )
}

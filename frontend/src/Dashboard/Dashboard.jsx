import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'

export default function DashboardShell() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="flex h-dvh w-full bg-background dashboard-bg overflow-hidden text-foreground font-sans" data-lenis-prevent="true">
      <Sidebar 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <main className="flex-1 flex flex-col  h-full overflow-hidden">
        <Header setIsMobileMenuOpen={setIsMobileMenuOpen} />
        <Outlet />
      </main>
    </div>
  )
}

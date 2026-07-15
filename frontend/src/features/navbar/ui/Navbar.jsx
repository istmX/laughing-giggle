import { Link, useLocation } from 'react-router-dom'
import { NAV_ITEMS } from '../constants/navLinks.jsx'

export function Navbar() {
  const location = useLocation()
  const hiddenRoutes = ['/login', '/signup']

  if (hiddenRoutes.includes(location.pathname)) return null

  return (
    <div className="fixed top-10 left-1/2 z-[5000] flex -translate-x-1/2 items-center gap-1 rounded-full border border-hairline bg-ink px-2 py-1.5 shadow-lg backdrop-blur-xl">
      <div className="flex items-center gap-1">
        {NAV_ITEMS.map((navItem, idx) => (
          <Link
            key={`link-${idx}`}
            to={navItem.link}
            className="rounded-full px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:text-white"
          >
            {navItem.name}
          </Link>
        ))}
      </div>

      <div className="h-5 w-px bg-white/20" />

      <Link
        to="/login"
        className="rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:text-white"
      >
        Log in
      </Link>
      <Link
        to="/signup"
        className="rounded-full bg-white px-4 py-2 text-sm font-medium text-ink transition-all hover:bg-white/90"
      >
        Get Started
      </Link>
    </div>
  )
}

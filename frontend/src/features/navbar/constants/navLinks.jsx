import { Home, FileText, Info, Heart } from 'lucide-react'

export const NAV_ITEMS = [
  { name: 'Home', link: '/', icon: <Home className="h-4 w-4" /> },
  { name: 'Docs', link: '/docs', icon: <FileText className="h-4 w-4" /> },
  { name: 'About', link: '/about', icon: <Info className="h-4 w-4" /> },
  { name: 'Sponsor', link: '/sponsor', icon: <Heart className="h-4 w-4" /> },
]

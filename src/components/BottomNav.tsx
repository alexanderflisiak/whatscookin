'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Plus, ShoppingCart } from 'lucide-react'

export function BottomNav() {
  const pathname = usePathname()

  // Hide BottomNav in Cook Mode (we'll use a specific route or query param, or just detect fullscreen later)
  // For now, assume it's always shown unless we're exactly in Cook Mode. We can hide it with CSS in Cook Mode overlay.

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-surface border-t border-border flex items-center justify-around px-2 z-40 safe-area-pb">
      <NavItem href="/" icon={<Home className="w-6 h-6" />} label="Home" active={pathname === '/'} />
      <NavItem href="/search" icon={<Search className="w-6 h-6" />} label="Search" active={pathname === '/search'} />
      
      {/* FAB (Add) */}
      <div className="relative -top-5">
        <Link href="/recipes/new" className="flex items-center justify-center w-14 h-14 bg-primary text-white border border-border hover:bg-stone-800 rounded-full shadow-lg ring-4 ring-background hover:bg-stone-500 transition-colors">
          <Plus className="w-8 h-8" />
          <span className="sr-only">Add Recipe</span>
        </Link>
      </div>

      <NavItem href="/shopping-list" icon={<ShoppingCart className="w-6 h-6" />} label="List" active={pathname === '/shopping-list'} />
      <NavItem href="/profile" icon={<div className="w-6 h-6 rounded-full bg-stone-200" />} label="Profile" active={pathname === '/profile'} />
    </nav>
  )
}

function NavItem({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <Link href={href} className={`flex flex-col items-center justify-center w-16 h-full gap-1 ${active ? 'text-text-hi' : 'text-text-lo hover:text-text-hi'}`}>
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  )
}

'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, MapPin, MessageSquare, Settings, LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

const NAV_ITEMS = [
  { icon: LayoutDashboard, href: '/dashboard',   label: 'Dashboard' },
  { icon: MapPin,          href: '/pontos',       label: 'Pontos' },
  { icon: MessageSquare,   href: '/comentarios',  label: 'Comentários' },
  { icon: Settings,        href: '/conta',        label: 'Conta' },
] as const

export function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { signOut } = useAuth()

  async function handleSignOut() {
    await signOut()
    router.push('/login')
  }

  return (
    <nav
      aria-label="Navegação mobile"
      className="lg:hidden fixed bottom-0 inset-x-0 h-16 glass-panel border-t border-white/70 dark:border-white/[0.08] z-40 pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="flex h-full">
        {NAV_ITEMS.map(({ icon: Icon, href, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')

          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={[
                  'flex flex-col items-center justify-center h-full gap-0.5 text-[10px] font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 relative',
                  isActive ? 'text-blue-800 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200',
                ]
                  .filter(Boolean)
                  .join(' ')}
                aria-current={isActive ? 'page' : undefined}
              >
                {/* Active indicator dot */}
                {isActive && (
                  <span
                    className="absolute top-2 w-1 h-1 rounded-full bg-blue-800"
                    aria-hidden="true"
                  />
                )}
                <Icon size={20} aria-hidden="true" />
                {label}
              </Link>
            </li>
          )
        })}

        {/* Logout */}
        <li className="flex-1">
          <button
            onClick={handleSignOut}
            className="flex flex-col items-center justify-center h-full w-full gap-0.5 text-[10px] font-medium text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            <LogOut size={20} aria-hidden="true" />
            Sair
          </button>
        </li>
      </ul>
    </nav>
  )
}

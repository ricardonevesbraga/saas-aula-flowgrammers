'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { LucideProps } from 'lucide-react'
import {
  LayoutDashboard,
  MapPin,
  MessageSquare,
  Bell,
  Download,
  Settings,
  LogOut,
} from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

interface SidebarProps {
  unreadAlerts?: number
}

type NavItem = {
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>>
  href: string
  label: string
  hasAlert?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { icon: LayoutDashboard, href: '/dashboard',    label: 'Dashboard' },
  { icon: MapPin,          href: '/pontos',        label: 'Meus Pontos' },
  { icon: MessageSquare,   href: '/comentarios',   label: 'Comentários' },
  { icon: Bell,            href: '/notificacoes',  label: 'Notificações', hasAlert: true },
  { icon: Download,        href: '/exportar',      label: 'Exportar' },
  { icon: Settings,        href: '/conta',         label: 'Minha Conta' },
]

export function Sidebar({ unreadAlerts = 0 }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { signOut } = useAuth()

  async function handleSignOut() {
    await signOut()
    router.push('/login')
  }

  return (
    <aside className="hidden lg:flex flex-col w-60 shrink-0 h-screen glass-panel border-r border-white/70 dark:border-white/[0.08]">
      {/* Logo */}
      <div className="flex items-center px-5 py-5 border-b border-white/60 dark:border-white/[0.06]">
        <Image
          src="/logo.png"
          alt="Avalie Meu Atendimento"
          width={1024}
          height={1024}
          className="h-24 w-auto"
        />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5" aria-label="Navegação principal">
        {NAV_ITEMS.map(({ icon: Icon, href, label, hasAlert }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          const showBadge = hasAlert && unreadAlerts > 0

          return (
            <Link
              key={href}
              href={href}
              className={[
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800',
                isActive
                  ? 'bg-blue-50 dark:bg-slate-800 text-blue-900 dark:text-blue-300 border-l-[3px] border-blue-800 dark:border-blue-400 font-medium rounded-l-none pl-[calc(0.75rem-3px)]'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100',
              ]
                .filter(Boolean)
                .join(' ')}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={18} aria-hidden="true" />
              <span className="flex-1">{label}</span>
              {showBadge && (
                <Badge variant="danger" count={unreadAlerts} pulse />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-3 border-t border-white/60 dark:border-white/[0.06]">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
        >
          <LogOut size={18} aria-hidden="true" />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  )
}

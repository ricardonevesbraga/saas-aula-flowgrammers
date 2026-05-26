'use client'

import React from 'react'
import Image from 'next/image'
import { NotificationBell } from './NotificationBell'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

interface AlertItem {
  id: string
  rating: number
  comment: string | null
  pointName: string
  createdAt: string
}

interface HeaderProps {
  businessName?: string
  unreadAlerts?: number
  alerts?: AlertItem[]
  userInitials?: string
}

export function Header({
  businessName,
  unreadAlerts = 0,
  alerts = [],
  userInitials = '?',
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 h-14 glass-panel border-b border-white/70 dark:border-white/[0.08]">
      <div className="flex items-center h-full px-4 gap-4">
        {/* Logo — visible on mobile (sidebar hidden) */}
        <div className="lg:hidden flex items-center">
          <Image
            src="/logo.png"
            alt="Avalie Meu Atendimento"
            width={1024}
            height={1024}
            priority
            className="h-10 w-auto"
          />
        </div>

        {/* Business name — centre, desktop only */}
        {businessName && (
          <div className="hidden sm:flex flex-1 justify-center">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300 truncate max-w-xs">
              {businessName}
            </span>
          </div>
        )}

        {/* Spacer when no business name */}
        {!businessName && <div className="flex-1" />}

        {/* Right actions */}
        <div className="flex items-center gap-2 ml-auto">
          <ThemeToggle />
          <NotificationBell count={unreadAlerts} alerts={alerts} />

          {/* User avatar */}
          <div
            className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-800 text-white text-xs font-bold select-none"
            aria-label={`Usuário: ${userInitials}`}
          >
            {userInitials.slice(0, 2).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  )
}

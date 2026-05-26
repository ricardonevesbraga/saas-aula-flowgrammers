'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Bell } from 'lucide-react'
import { RatingBadge } from '@/components/ui/RatingBadge'

interface AlertItem {
  id: string
  rating: number
  comment: string | null
  pointName: string
  createdAt: string
}

interface NotificationBellProps {
  count: number
  alerts?: AlertItem[]
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'agora'
  if (mins < 60) return `há ${mins}min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `há ${hours}h`
  return `há ${Math.floor(hours / 24)}d`
}

export function NotificationBell({ count, alerts = [] }: NotificationBellProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const hasAlerts = count > 0

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={`Notificações${hasAlerts ? ` — ${count} não lidas` : ''}`}
        aria-expanded={open}
        className="relative flex items-center justify-center w-10 h-10 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800"
      >
        <Bell size={20} />
        {hasAlerts && (
          <span
            className={[
              'absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-[10px] font-bold bg-red-500 text-white rounded-full',
              'animate-pulse',
            ].join(' ')}
            aria-hidden="true"
          >
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-80 glass-dropdown rounded-2xl overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-white/60 dark:border-white/[0.06]">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Notificações</p>
          </div>

          {alerts.length === 0 ? (
            <p className="px-4 py-6 text-sm text-slate-500 dark:text-slate-400 text-center">
              Nenhuma notificação
            </p>
          ) : (
            <ul className="divide-y divide-white/50 dark:divide-white/[0.05] max-h-72 overflow-y-auto">
              {alerts.slice(0, 5).map((alert) => (
                <li key={alert.id} className="px-4 py-3 hover:bg-white/40 dark:hover:bg-white/[0.04] transition-colors">
                  <div className="flex items-start gap-2">
                    <RatingBadge rating={alert.rating} variant="compact" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-700 truncate">
                        {alert.pointName}
                      </p>
                      {alert.comment && (
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                          {alert.comment.slice(0, 60)}
                          {alert.comment.length > 60 ? '…' : ''}
                        </p>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {timeAgo(alert.createdAt)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="px-4 py-3 border-t border-white/60 dark:border-white/[0.06]">
            <a
              href="/notificacoes"
              className="text-xs font-medium text-blue-800 hover:text-blue-900 hover:underline"
            >
              Ver todas →
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

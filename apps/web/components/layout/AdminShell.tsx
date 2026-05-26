'use client'

import React from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { BottomNav } from './BottomNav'

interface AlertItem {
  id: string
  rating: number
  comment: string | null
  pointName: string
  createdAt: string
}

interface AdminShellProps {
  children: React.ReactNode
  unreadAlerts?: number
  alerts?: AlertItem[]
  businessName?: string
  userInitials?: string
}

export function AdminShell({
  children,
  unreadAlerts = 0,
  alerts = [],
  businessName,
  userInitials = '?',
}: AdminShellProps) {
  return (
    <div className="flex h-screen overflow-hidden app-bg">
      {/* Desktop sidebar */}
      <Sidebar unreadAlerts={unreadAlerts} />

      {/* Main content column */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header
          businessName={businessName}
          unreadAlerts={unreadAlerts}
          alerts={alerts}
          userInitials={userInitials}
        />

        {/* Scrollable page content */}
        <main className="flex-1 overflow-y-auto px-4 py-6 lg:px-8 pb-24 lg:pb-6">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <BottomNav />
    </div>
  )
}

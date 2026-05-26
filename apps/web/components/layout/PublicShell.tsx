import React from 'react'
import Image from 'next/image'

interface PublicShellProps {
  children: React.ReactNode
  businessLogoUrl?: string | null
  businessName?: string
}

export function PublicShell({ children, businessLogoUrl, businessName }: PublicShellProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Minimal header */}
      <header className="flex items-center justify-center pt-6 pb-2 px-4">
        {businessLogoUrl ? (
          <Image
            src={businessLogoUrl}
            alt={businessName ?? 'Logo'}
            width={120}
            height={40}
            className="object-contain h-10 w-auto"
            priority
          />
        ) : businessName ? (
          <span className="text-base font-semibold text-slate-700">{businessName}</span>
        ) : (
          <span className="text-sm font-bold text-slate-900 leading-tight">
            Avalie <span className="text-green-600">Meu</span> Atendimento
          </span>
        )}
      </header>

      {/* Page content */}
      <main className="flex-1 w-full max-w-[480px] mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}

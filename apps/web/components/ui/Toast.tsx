'use client'

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type ToastVariant = 'success' | 'error' | 'warning' | 'info'

interface ToastItem {
  id: string
  variant: ToastVariant
  title: string
  description?: string
}

interface ToastContextValue {
  toast: (opts: Omit<ToastItem, 'id'>) => void
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <Toaster>')
  return ctx
}

// ─── Individual Toast ─────────────────────────────────────────────────────────

const variantStyles: Record<ToastVariant, { bar: string; icon: string }> = {
  success: { bar: 'bg-green-500',  icon: '✓' },
  error:   { bar: 'bg-red-500',    icon: '✕' },
  warning: { bar: 'bg-yellow-500', icon: '!' },
  info:    { bar: 'bg-blue-800',   icon: 'i' },
}

interface SingleToastProps extends ToastItem {
  onDismiss: (id: string) => void
}

function SingleToast({ id, variant, title, description, onDismiss }: SingleToastProps) {
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // Slight delay to trigger CSS transition
    const enterTimer = setTimeout(() => setVisible(true), 10)
    timerRef.current = setTimeout(() => handleClose(), 4000)
    return () => {
      clearTimeout(enterTimer)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleClose() {
    setVisible(false)
    setTimeout(() => onDismiss(id), 300)
  }

  const { bar, icon } = variantStyles[variant]

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={[
        'flex items-start gap-3 w-full max-w-sm bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden transition-all duration-300',
        visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8',
      ].join(' ')}
    >
      {/* Color bar */}
      <div className={`w-1 self-stretch shrink-0 ${bar}`} aria-hidden="true" />

      {/* Icon */}
      <div
        className={`flex items-center justify-center w-6 h-6 rounded-full text-white text-xs font-bold mt-3 shrink-0 ${bar}`}
        aria-hidden="true"
      >
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1 py-3 pr-2">
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        {description && (
          <p className="text-xs text-slate-500 mt-0.5">{description}</p>
        )}
      </div>

      {/* Close */}
      <button
        type="button"
        onClick={handleClose}
        aria-label="Fechar notificação"
        className="flex items-center justify-center w-8 h-8 mt-1.5 mr-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors duration-150 shrink-0"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M9 3L3 9M3 3l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}

// ─── Toaster Provider ─────────────────────────────────────────────────────────

export function Toaster({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const toast = useCallback((opts: Omit<ToastItem, 'id'>) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { ...opts, id }])
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Toast portal area */}
      <div
        aria-label="Notificações"
        className="fixed top-4 right-4 z-[100] flex flex-col gap-2 items-end pointer-events-none"
      >
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto w-full max-w-sm">
            <SingleToast {...t} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

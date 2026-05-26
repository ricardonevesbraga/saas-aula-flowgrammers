import React from 'react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'white' | 'muted'
}

const sizeClasses: Record<NonNullable<LoadingSpinnerProps['size']>, string> = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-10 h-10',
}

const colorClasses: Record<NonNullable<LoadingSpinnerProps['color']>, string> = {
  primary: 'border-blue-800 border-t-transparent',
  white: 'border-white border-t-transparent',
  muted: 'border-slate-400 border-t-transparent',
}

export function LoadingSpinner({ size = 'md', color = 'primary' }: LoadingSpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Carregando"
      className={[
        'inline-block border-2 rounded-full animate-spin',
        sizeClasses[size],
        colorClasses[color],
      ].join(' ')}
    />
  )
}

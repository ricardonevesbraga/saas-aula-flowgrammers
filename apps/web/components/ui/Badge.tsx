import React from 'react'

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'navy'
  size?: 'sm' | 'md'
  count?: number
  pulse?: boolean
  children?: React.ReactNode
}

const variantClasses: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-slate-100 text-slate-700',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  danger: 'bg-red-100 text-red-700',
  navy: 'bg-blue-100 text-blue-900',
}

const sizeClasses: Record<NonNullable<BadgeProps['size']>, string> = {
  sm: 'text-xs px-2 py-0.5 rounded-md',
  md: 'text-sm px-2.5 py-1 rounded-lg',
}

export function Badge({
  variant = 'default',
  size = 'sm',
  count,
  pulse = false,
  children,
}: BadgeProps) {
  const content = count !== undefined ? (count > 9 ? '9+' : String(count)) : children

  return (
    <span
      className={[
        'inline-flex items-center justify-center font-medium',
        variantClasses[variant],
        sizeClasses[size],
        pulse ? 'animate-pulse' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {content}
    </span>
  )
}

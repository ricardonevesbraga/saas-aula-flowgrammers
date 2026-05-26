'use client'

import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'success' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  loading?: boolean
  children: React.ReactNode
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-blue-800 hover:bg-blue-900 text-white font-semibold',
  accent:
    'bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold',
  success:
    'bg-green-600 hover:bg-green-700 text-white font-semibold',
  outline:
    'border-2 border-blue-800 text-blue-800 hover:bg-blue-50 bg-transparent font-semibold dark:border-blue-400 dark:text-blue-300 dark:hover:bg-blue-950/40',
  ghost:
    'bg-transparent hover:bg-slate-100 text-slate-700 font-medium dark:text-slate-200 dark:hover:bg-slate-800',
  destructive:
    'bg-red-600 hover:bg-red-700 text-white font-semibold',
}

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'h-10 px-4 text-sm rounded-lg',
  md: 'h-12 px-5 text-base rounded-xl',
  lg: 'h-14 px-7 text-lg rounded-xl',
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading

  return (
    <button
      disabled={isDisabled}
      className={[
        'inline-flex items-center justify-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 focus-visible:ring-offset-2 cursor-pointer select-none',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {loading && (
        <span
          className="border-2 border-current border-t-transparent animate-spin w-4 h-4 rounded-full inline-block mr-2 shrink-0"
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  )
}

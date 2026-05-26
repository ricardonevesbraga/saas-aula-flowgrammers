'use client'

import React, { useRef } from 'react'

interface EmojiRatingProps {
  value?: number | null
  onChange: (rating: number) => void
  size?: 'md' | 'lg'
  disabled?: boolean
}

const RATINGS = [
  { value: 1, emoji: '😡', label: 'Muito ruim', color: '#DC2626', bg: 'rgba(220,38,38,0.1)' },
  { value: 2, emoji: '😕', label: 'Ruim',       color: '#F97316', bg: 'rgba(249,115,22,0.1)' },
  { value: 3, emoji: '😐', label: 'Regular',    color: '#EAB308', bg: 'rgba(234,179,8,0.1)' },
  { value: 4, emoji: '🙂', label: 'Bom',        color: '#84CC16', bg: 'rgba(132,204,22,0.1)' },
  { value: 5, emoji: '😍', label: 'Excelente',  color: '#16A34A', bg: 'rgba(22,163,74,0.1)' },
]

export function EmojiRating({ value, onChange, size = 'md', disabled = false }: EmojiRatingProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const buttonSize = size === 'lg' ? 'w-[88px] h-[88px]' : 'w-[72px] h-[72px]'
  const emojiSize  = size === 'lg' ? 'text-6xl' : 'text-5xl'
  const gap        = size === 'lg' ? 'gap-4' : 'gap-3'

  function handleKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    if (disabled) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onChange(RATINGS[index].value)
      return
    }
    const buttons = containerRef.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]')
    if (!buttons) return
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      buttons[Math.min(index + 1, buttons.length - 1)]?.focus()
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      buttons[Math.max(index - 1, 0)]?.focus()
    }
  }

  return (
    <div
      ref={containerRef}
      role="radiogroup"
      aria-label="Avaliação com emojis"
      className={`flex justify-center items-center ${gap}`}
    >
      {RATINGS.map((rating, index) => {
        const isSelected = value === rating.value

        const selectedStyle: React.CSSProperties = isSelected
          ? {
              border: `3px solid ${rating.color}`,
              background: rating.bg,
              transform: 'scale(1.25)',
            }
          : {}

        return (
          <button
            key={rating.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={rating.label}
            disabled={disabled}
            onClick={() => !disabled && onChange(rating.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            style={{
              transition: 'all 200ms cubic-bezier(0.34, 1.56, 0.64, 1)',
              ...selectedStyle,
            }}
            className={[
              `${buttonSize} rounded-full flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 focus-visible:ring-offset-2`,
              disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
              !isSelected && !disabled ? 'hover:bg-slate-100 hover:scale-110' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <span className={emojiSize} role="img" aria-hidden="true">
              {rating.emoji}
            </span>
          </button>
        )
      })}
    </div>
  )
}

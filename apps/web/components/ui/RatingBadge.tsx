import React from 'react'

interface RatingBadgeProps {
  rating: number
  variant?: 'compact' | 'full'
}

const RATING_META: Record<number, { emoji: string; label: string; color: string; bg: string }> = {
  1: { emoji: '😡', label: 'Muito ruim', color: '#DC2626', bg: '#FEF2F2' },
  2: { emoji: '😕', label: 'Ruim',       color: '#F97316', bg: '#FFF7ED' },
  3: { emoji: '😐', label: 'Regular',    color: '#EAB308', bg: '#FEFCE8' },
  4: { emoji: '🙂', label: 'Bom',        color: '#84CC16', bg: '#F7FEE7' },
  5: { emoji: '😍', label: 'Excelente',  color: '#16A34A', bg: '#F0FDF4' },
}

export function RatingBadge({ rating, variant = 'compact' }: RatingBadgeProps) {
  const meta = RATING_META[rating]
  if (!meta) return null

  if (variant === 'compact') {
    return (
      <span
        className="inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold"
        style={{ color: meta.color, background: meta.bg }}
        aria-label={`Nota ${rating}: ${meta.label}`}
      >
        {rating}
      </span>
    )
  }

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm font-medium"
      style={{ color: meta.color, background: meta.bg }}
      aria-label={`Nota ${rating}: ${meta.label}`}
    >
      <span role="img" aria-hidden="true">{meta.emoji}</span>
      {meta.label}
    </span>
  )
}

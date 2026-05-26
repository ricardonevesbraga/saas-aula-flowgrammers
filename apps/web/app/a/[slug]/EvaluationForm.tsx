'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { EmojiRating } from '@/components/ui/EmojiRating'

interface Props {
  pointId: string
  pointSlug: string
  thankYouMessage: string
}

export function EvaluationForm({ pointId, pointSlug, thankYouMessage }: Props) {
  const [rating, setRating] = useState<number | null>(null)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async () => {
    if (!rating) return
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          evaluation_point_id: pointId,
          rating,
          comment: comment.trim() || null,
        }),
      })

      if (!res.ok) {
        const { error: msg } = await res.json()
        throw new Error(msg ?? 'Erro ao enviar avaliação')
      }

      router.push(`/a/${pointSlug}/obrigado?msg=${encodeURIComponent(thankYouMessage)}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar')
      setSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto text-center">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">
        Como foi seu atendimento?
      </h1>
      <p className="text-slate-500 mb-8 text-sm">Toque em um emoji para avaliar</p>

      <EmojiRating value={rating} onChange={setRating} size="lg" />

      {rating !== null && (
        <div className="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value.slice(0, 500))}
            placeholder="Quer nos contar mais? (opcional)"
            className="w-full min-h-[80px] p-3 border border-slate-200 rounded-xl text-base resize-none focus:outline-none focus:ring-2 focus:ring-blue-800"
            maxLength={500}
          />
          <p className="text-right text-xs text-slate-400 mt-1">{comment.length}/500</p>
        </div>
      )}

      {error && (
        <p className="mt-3 text-sm text-red-600">{error}</p>
      )}

      <div className="mt-6 sticky bottom-4">
        <button
          onClick={handleSubmit}
          disabled={!rating || submitting}
          className={`w-full h-14 rounded-xl text-base font-semibold transition-all duration-200 ${
            rating && !submitting
              ? 'bg-yellow-500 hover:bg-yellow-400 text-slate-900 shadow-lg shadow-yellow-200'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-slate-600 border-t-transparent rounded-full animate-spin" />
              Enviando...
            </span>
          ) : 'Enviar avaliação'}
        </button>
      </div>
    </div>
  )
}

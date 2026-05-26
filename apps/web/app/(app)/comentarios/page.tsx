'use client'
import { useState } from 'react'
import { format } from 'date-fns'
import { useAuth } from '@/hooks/useAuth'
import { useBusiness } from '@/hooks/useBusiness'
import { useFeedbacks } from '@/hooks/useFeedbacks'
import { RatingBadge } from '@/components/ui/RatingBadge'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

const RATINGS = [1, 2, 3, 4, 5]

export default function ComentariosPage() {
  const { user } = useAuth()
  const { business } = useBusiness(user?.id)

  const [selectedPoint, setSelectedPoint] = useState<string>('')
  const [selectedRating, setSelectedRating] = useState<number | undefined>()
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  const { feedbacks, isLoading, markAsRead, markAsResolved } = useFeedbacks({
    businessId: business?.id,
    pointId: selectedPoint || undefined,
    rating: selectedRating,
    from: fromDate || undefined,
    to: toDate || undefined,
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Comentários</h1>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Nota</label>
            <div className="flex gap-1">
              {RATINGS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setSelectedRating(selectedRating === r ? undefined : r)}
                  className={[
                    'w-8 h-8 rounded-lg text-sm font-semibold transition-colors',
                    selectedRating === r
                      ? 'bg-blue-800 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600',
                  ].join(' ')}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">De</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 px-3 py-1.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-800"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Até</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 px-3 py-1.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-800"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              setSelectedRating(undefined)
              setSelectedPoint('')
              setFromDate('')
              setToDate('')
            }}
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 px-2 py-1.5"
          >
            Limpar filtros
          </button>
        </div>
      </Card>

      {isLoading ? (
        <div className="flex justify-center py-12"><LoadingSpinner /></div>
      ) : feedbacks.length === 0 ? (
        <EmptyState
          title="Nenhum comentário encontrado"
          description="Tente ajustar os filtros ou aguarde novas avaliações."
        />
      ) : (
        <div className="space-y-3">
          {feedbacks.map((f) => (
            <Card key={f.id} className={['p-4', !f.is_read ? 'border-l-4 border-l-blue-800' : ''].join(' ')}>
              <div className="flex items-start gap-3">
                <RatingBadge rating={f.rating} />
                <div className="flex-1 min-w-0">
                  {f.comment ? (
                    <p className="text-sm text-slate-800 dark:text-slate-200">{f.comment}</p>
                  ) : (
                    <p className="text-sm text-slate-400 dark:text-slate-500 italic">Sem comentário</p>
                  )}
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {f.evaluation_points && (
                      <span className="text-xs text-slate-400 dark:text-slate-500">{f.evaluation_points.name}</span>
                    )}
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      {f.created_at ? format(new Date(f.created_at), 'dd/MM/yyyy HH:mm') : '—'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  {!f.is_read && (
                    <button
                      type="button"
                      onClick={() => markAsRead.mutate(f.id)}
                      className="text-xs text-blue-700 dark:text-blue-400 hover:underline"
                    >
                      Marcar lido
                    </button>
                  )}
                  {!f.is_resolved && (
                    <button
                      type="button"
                      onClick={() => markAsResolved.mutate(f.id)}
                      className="text-xs text-green-700 dark:text-green-400 hover:underline"
                    >
                      Resolver
                    </button>
                  )}
                  {f.is_resolved && (
                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">Resolvido</span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

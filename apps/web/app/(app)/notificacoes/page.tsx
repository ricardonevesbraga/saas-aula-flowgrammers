'use client'
import { format } from 'date-fns'
import { useAuth } from '@/hooks/useAuth'
import { useBusiness } from '@/hooks/useBusiness'
import { useFeedbacks } from '@/hooks/useFeedbacks'
import { useRealtime } from '@/hooks/useRealtime'
import { RatingBadge } from '@/components/ui/RatingBadge'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function NotificacoesPage() {
  const { user } = useAuth()
  const { business } = useBusiness(user?.id)

  useRealtime(business?.id)

  const { feedbacks, isLoading, markAsRead } = useFeedbacks({
    businessId: business?.id,
    onlyAlerts: true,
  })

  const unreadCount = feedbacks.filter((f) => !f.is_read).length

  const markAllAsRead = () => {
    feedbacks
      .filter((f) => !f.is_read)
      .forEach((f) => markAsRead.mutate(f.id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Notificações</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-slate-500 dark:text-slate-400">{unreadCount} não lida{unreadCount > 1 ? 's' : ''}</p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllAsRead}
            className="text-sm text-blue-700 dark:text-blue-400 hover:underline font-medium"
          >
            Marcar todas como lidas
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><LoadingSpinner /></div>
      ) : feedbacks.length === 0 ? (
        <EmptyState
          title="Nenhuma nota baixa por aqui!"
          description="Seu atendimento está indo bem. Continue assim!"
        />
      ) : (
        <div className="space-y-3">
          {feedbacks.map((f) => (
            <Card key={f.id} className={['p-4', !f.is_read ? 'border-l-4 border-l-red-500' : 'opacity-70'].join(' ')}>
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
                      <span className="text-xs bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md">
                        {f.evaluation_points.name}
                      </span>
                    )}
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      {f.created_at ? format(new Date(f.created_at), 'dd/MM/yyyy HH:mm') : '—'}
                    </span>
                  </div>
                </div>
                {!f.is_read && (
                  <button
                    type="button"
                    onClick={() => markAsRead.mutate(f.id)}
                    className="text-xs text-blue-700 dark:text-blue-400 hover:underline shrink-0"
                  >
                    Marcar como lido
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

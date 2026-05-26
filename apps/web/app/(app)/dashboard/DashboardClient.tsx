'use client'
import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts'
import { format, subDays, isAfter, startOfDay } from 'date-fns'
import { useRealtime } from '@/hooks/useRealtime'
import { useFeedbacks } from '@/hooks/useFeedbacks'
import { RatingBadge } from '@/components/ui/RatingBadge'
import { Card } from '@/components/ui/Card'

interface FeedbackRow {
  rating: number
  created_at: string | null
  comment: string | null
  is_alert: boolean | null
  is_read: boolean | null
  evaluation_point_id: string
}

interface Props {
  businessId: string
  initialFeedbacks: FeedbackRow[]
  initialAvg: string | null
  totalFeedbacks: number
}

function filterByPeriod(feedbacks: FeedbackRow[], days: number) {
  const cutoff = startOfDay(subDays(new Date(), days - 1))
  return feedbacks.filter((f) => f.created_at && isAfter(new Date(f.created_at), cutoff))
}

function calcAvg(feedbacks: FeedbackRow[]) {
  if (!feedbacks.length) return null
  return (feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(1)
}

export function DashboardClient({ businessId, initialFeedbacks, initialAvg, totalFeedbacks }: Props) {
  useRealtime(businessId)

  const { feedbacks: liveFeedbacks } = useFeedbacks({ businessId })

  const feedbacks = liveFeedbacks.length > 0
    ? (liveFeedbacks as unknown as FeedbackRow[])
    : initialFeedbacks

  const currentAvg = calcAvg(feedbacks) ?? initialAvg

  const todayFeedbacks = useMemo(() => filterByPeriod(feedbacks, 1), [feedbacks])
  const weekFeedbacks = useMemo(() => filterByPeriod(feedbacks, 7), [feedbacks])
  const monthFeedbacks = useMemo(() => filterByPeriod(feedbacks, 30), [feedbacks])

  const distribution = useMemo(() => {
    const dist = [1, 2, 3, 4, 5].map((r) => ({
      rating: String(r),
      count: feedbacks.filter((f) => f.rating === r).length,
    }))
    return dist
  }, [feedbacks])

  const last30Days = useMemo(() => {
    const days: { date: string; avg: number | null }[] = []
    for (let i = 29; i >= 0; i--) {
      const day = subDays(new Date(), i)
      const dayStr = format(day, 'dd/MM')
      const dayFeedbacks = feedbacks.filter(
        (f) => f.created_at && format(new Date(f.created_at), 'dd/MM/yyyy') === format(day, 'dd/MM/yyyy')
      )
      days.push({
        date: dayStr,
        avg: dayFeedbacks.length > 0
          ? parseFloat((dayFeedbacks.reduce((s, f) => s + f.rating, 0) / dayFeedbacks.length).toFixed(1))
          : null,
      })
    }
    return days
  }, [feedbacks])

  const recentComments = useMemo(
    () => feedbacks.filter((f) => f.comment).slice(0, 5),
    [feedbacks]
  )

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Dashboard</h1>

      {/* Hero card */}
      <div className="p-6 flex flex-col items-center justify-center text-center bg-gradient-to-br from-blue-900 to-blue-700 text-white rounded-2xl shadow-lg">
        <p className="text-sm font-medium opacity-80 mb-1">Nota média geral</p>
        <p className="text-6xl font-black leading-none mb-1">
          {currentAvg ?? '—'}
        </p>
        <p className="text-sm opacity-70">{totalFeedbacks} avaliações no total</p>
      </div>

      {/* Mini cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Hoje', feedbacks: todayFeedbacks },
          { label: 'Esta semana', feedbacks: weekFeedbacks },
          { label: 'Este mês', feedbacks: monthFeedbacks },
        ].map(({ label, feedbacks: f }) => (
          <Card key={label} className="p-4 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{label}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{calcAvg(f) ?? '—'}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">{f.length} aval.</p>
          </Card>
        ))}
      </div>

      {/* Distribution bar chart */}
      <Card className="p-4">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Distribuição de notas</h2>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={distribution} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <XAxis dataKey="rating" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="count" fill="#1e3a8a" radius={[4, 4, 0, 0]} name="Avaliações" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* 30-day trend line chart */}
      <Card className="p-4">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Evolução — últimos 30 dias</h2>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={last30Days} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={6} />
            <YAxis domain={[1, 5]} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="avg"
              stroke="#16a34a"
              strokeWidth={2}
              dot={false}
              name="Média"
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Recent comments */}
      {recentComments.length > 0 && (
        <Card className="p-4">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Últimos comentários</h2>
          <ul className="space-y-3">
            {recentComments.map((f, i) => (
              <li key={i} className="flex items-start gap-3 pb-3 border-b border-slate-100 dark:border-slate-700 last:border-0 last:pb-0">
                <RatingBadge rating={f.rating} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2">{f.comment}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                    {f.created_at ? format(new Date(f.created_at), 'dd/MM/yyyy HH:mm') : '—'}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database.types'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'

type BusinessRow = Database['public']['Tables']['businesses']['Row']
type PointRow = Database['public']['Tables']['evaluation_points']['Row']
type UserRow = Database['public']['Tables']['users']['Row']

export default async function PontosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: businessRaw } = await supabase
    .from('businesses')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!businessRaw) redirect('/onboarding')

  const business = businessRaw as Pick<BusinessRow, 'id'>

  // plan_type lives on the users table
  const { data: userProfileRaw } = await supabase
    .from('users')
    .select('plan_type')
    .eq('id', user.id)
    .maybeSingle()

  const planType = (userProfileRaw as Pick<UserRow, 'plan_type'> | null)?.plan_type ?? 'free'

  const { data: pointsRaw } = await supabase
    .from('evaluation_points')
    .select('*')
    .eq('business_id', business.id)
    .order('created_at', { ascending: false })

  const list = (pointsRaw ?? []) as PointRow[]
  const isFreeLimit = planType === 'free' && list.length >= 1

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Meus Pontos</h1>
        <div title={isFreeLimit ? 'Plano gratuito permite apenas 1 ponto' : undefined}>
          <Link
            href={isFreeLimit ? '#' : '/pontos/novo'}
            aria-disabled={isFreeLimit}
            className={[
              'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors',
              isFreeLimit
                ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed pointer-events-none'
                : 'bg-blue-800 text-white hover:bg-blue-900',
            ].join(' ')}
          >
            + Novo Ponto
          </Link>
        </div>
      </div>

      {list.length === 0 ? (
        <EmptyState
          title="Nenhum ponto criado"
          description="Crie seu primeiro ponto de avaliação para gerar um QR Code."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {list.map((point) => (
            <Card key={point.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{point.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {point.total_feedbacks} aval. · Média:{' '}
                    {(point.current_average ?? 0) > 0 ? (point.current_average ?? 0).toFixed(1) : '—'}
                  </p>
                </div>
                <Badge variant={point.is_active ? 'success' : 'default'}>
                  {point.is_active ? 'Ativo' : 'Pausado'}
                </Badge>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  href={`/pontos/${point.id}`}
                  className="text-xs px-3 py-1.5 rounded-lg bg-blue-50 text-blue-800 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900 font-medium transition-colors"
                >
                  Ver QR Code
                </Link>
                <form action={`/api/pontos/${point.id}/toggle`} method="POST">
                  <button
                    type="submit"
                    className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 font-medium transition-colors"
                  >
                    {point.is_active ? 'Pausar' : 'Ativar'}
                  </button>
                </form>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

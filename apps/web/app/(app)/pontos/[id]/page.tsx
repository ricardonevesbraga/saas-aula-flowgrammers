import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database.types'
import { Card } from '@/components/ui/Card'
import { CopyButton } from './CopyButton'

type PointRow = Database['public']['Tables']['evaluation_points']['Row']

interface Props {
  params: Promise<{ id: string }>
}

export default async function PontoDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: pointRaw } = await supabase
    .from('evaluation_points')
    .select('*, businesses!inner(user_id)')
    .eq('id', id)
    .maybeSingle()

  if (!pointRaw) notFound()

  const point = pointRaw as unknown as PointRow & { businesses: { user_id: string } }
  if (point.businesses.user_id !== user.id) notFound()

  const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? ''}/a/${point.public_slug}`
  const qrPng = `/api/qr/${point.public_slug}?format=png`
  const qrSvg = `/api/qr/${point.public_slug}?format=svg`
  const qrPdf = `/api/qr/${point.public_slug}?format=pdf`

  return (
    <div className="space-y-6 max-w-lg">
      <div className="flex items-center gap-3">
        <Link href="/pontos" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">← Pontos</Link>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">{point.name}</h1>
      </div>

      <Card className="p-6 flex flex-col items-center gap-4">
        <img
          src={qrPng}
          alt={`QR Code de ${point.name}`}
          className="w-64 h-64 border border-slate-200 dark:border-slate-700 rounded-xl bg-white"
        />

        <div className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 flex items-center gap-2">
          <span className="text-xs text-slate-600 dark:text-slate-300 break-all flex-1">{publicUrl}</span>
          <CopyButton text={publicUrl} />
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          <a href={qrPng} download={`qr-${point.public_slug}.png`}>
            <button type="button" className="text-sm px-4 py-2 rounded-xl bg-blue-800 text-white hover:bg-blue-900 font-medium">
              Baixar PNG
            </button>
          </a>
          <a href={qrSvg} download={`qr-${point.public_slug}.svg`}>
            <button type="button" className="text-sm px-4 py-2 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 font-medium">
              Baixar SVG
            </button>
          </a>
          <a href={qrPdf} download={`qr-${point.public_slug}.pdf`}>
            <button type="button" className="text-sm px-4 py-2 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 font-medium">
              Baixar PDF A6
            </button>
          </a>
        </div>
      </Card>

      <Card className="p-4">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">Métricas deste ponto</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{point.total_feedbacks}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Total de avaliações</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {(point.current_average ?? 0) > 0 ? (point.current_average ?? 0).toFixed(1) : '—'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Nota média</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

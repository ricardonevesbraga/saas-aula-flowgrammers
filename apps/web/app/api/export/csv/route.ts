import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stringify } from 'csv-stringify/sync'

interface FeedbackRow {
  created_at: string
  rating: number
  comment: string | null
  is_read: boolean
  is_resolved: boolean
  evaluation_points: { name: string; business_id: string } | { name: string; business_id: string }[]
}

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { searchParams } = request.nextUrl
  const from = searchParams.get('from')
  const to = searchParams.get('to')
  const pointId = searchParams.get('point')

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle() as { data: { id: string } | null; error: unknown }

  if (!business) return NextResponse.json({ error: 'Negócio não encontrado' }, { status: 404 })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query: any = supabase
    .from('feedbacks')
    .select(
      `
      created_at,
      rating,
      comment,
      is_read,
      is_resolved,
      evaluation_points!inner(name, business_id)
    `
    )
    .eq('evaluation_points.business_id', business.id)
    .order('created_at', { ascending: false })

  if (from) query = query.gte('created_at', from)
  if (to) query = query.lte('created_at', to + 'T23:59:59Z')
  if (pointId) query = query.eq('evaluation_point_id', pointId)

  const { data: feedbacks, error } = (await query) as {
    data: FeedbackRow[] | null
    error: { message: string } | null
  }

  if (error) return NextResponse.json({ error: 'Erro ao buscar dados' }, { status: 500 })

  const EMOJI_MAP: Record<number, string> = {
    1: '😡',
    2: '😕',
    3: '😐',
    4: '🙂',
    5: '😍',
  }

  const rows = (feedbacks ?? []).map((f) => {
    const point = Array.isArray(f.evaluation_points)
      ? f.evaluation_points[0]
      : f.evaluation_points
    return {
      'Data/Hora': new Date(f.created_at).toLocaleString('pt-BR'),
      Ponto: point?.name ?? '',
      Nota: f.rating,
      Emoji: EMOJI_MAP[f.rating] ?? '',
      Comentário: f.comment ?? '',
      Lido: f.is_read ? 'Sim' : 'Não',
      Resolvido: f.is_resolved ? 'Sim' : 'Não',
    }
  })

  const csv = stringify(rows, { header: true, bom: true })

  await supabase.from('exports_history').insert({
    user_id: user.id,
    period_start: from ?? '2000-01-01',
    period_end: to ?? new Date().toISOString().split('T')[0],
    total_records: rows.length,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any)

  const filename = `avaliacoes-${new Date().toISOString().split('T')[0]}.csv`

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}

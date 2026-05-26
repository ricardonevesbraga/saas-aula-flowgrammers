import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { createHash } from 'crypto'

const feedbackSchema = z.object({
  evaluation_point_id: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(500).nullable().optional(),
})

function sanitize(text: string): string {
  return text.replace(/<[^>]*>/g, '').trim()
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = feedbackSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { evaluation_point_id, rating, comment } = parsed.data

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0] ??
      request.headers.get('x-real-ip') ??
      'unknown'
    const salt = process.env.IP_HASH_SALT
    if (!salt) {
      console.error('[feedback] IP_HASH_SALT not set — refusing to store unhashed IP data')
      return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
    }
    const ipHash = createHash('sha256').update(ip + salt).digest('hex')

    const userAgent = request.headers.get('user-agent') ?? null

    const supabase = await createClient()

    const insertData = {
      evaluation_point_id,
      rating,
      comment: comment ? sanitize(comment) : null,
      ip_hash: ipHash,
      user_agent: userAgent,
      is_read: false,
      is_resolved: false,
    }

    const { error } = await supabase
      .from('feedbacks')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .insert(insertData as any)

    if (error) {
      console.error('[feedback] insert error:', error.message)
      if (error.message.includes('violates row-level security')) {
        return NextResponse.json(
          { error: 'Ponto de avaliação não encontrado ou inativo' },
          { status: 404 }
        )
      }
      return NextResponse.json({ error: 'Erro ao registrar avaliação' }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

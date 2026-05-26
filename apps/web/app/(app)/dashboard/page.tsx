import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database.types'
import { DashboardClient } from './DashboardClient'

type BusinessRow = Database['public']['Tables']['businesses']['Row']
type FeedbackRow = Database['public']['Tables']['feedbacks']['Row']

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: businessRaw } = await supabase
    .from('businesses')
    .select('id, name')
    .eq('user_id', user.id)
    .maybeSingle()

  const business = businessRaw as Pick<BusinessRow, 'id' | 'name'> | null

  if (!business) redirect('/onboarding')

  const { data: feedbacksRaw } = await supabase
    .from('feedbacks')
    .select('rating, created_at, comment, is_alert, is_read, evaluation_point_id')
    .order('created_at', { ascending: false })
    .limit(100)

  const feedbacks = (feedbacksRaw ?? []) as Pick<
    FeedbackRow,
    'rating' | 'created_at' | 'comment' | 'is_alert' | 'is_read' | 'evaluation_point_id'
  >[]

  const totalFeedbacks = feedbacks.length
  const avgRating =
    feedbacks.length > 0
      ? (feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(1)
      : null

  return (
    <DashboardClient
      businessId={business.id}
      initialFeedbacks={feedbacks}
      initialAvg={avgRating}
      totalFeedbacks={totalFeedbacks}
    />
  )
}

'use client'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export function useUnreadAlerts(businessId?: string) {
  const supabase = createClient()

  const { data: count = 0 } = useQuery({
    queryKey: ['unread-alerts', businessId],
    queryFn: async () => {
      if (!businessId) return 0
      const { count, error } = await supabase
        .from('feedbacks')
        .select('id', { count: 'exact', head: true })
        .eq('is_alert', true)
        .eq('is_read', false)
        .in(
          'evaluation_point_id',
          supabase.from('evaluation_points').select('id').eq('business_id', businessId) as unknown as string[]
        )
      if (error) return 0
      return count ?? 0
    },
    enabled: !!businessId,
    refetchInterval: 30_000,
  })

  return count
}

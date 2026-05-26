'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database.types'

type FeedbackRow = Database['public']['Tables']['feedbacks']['Row']
type FeedbackUpdate = Database['public']['Tables']['feedbacks']['Update']

export type FeedbackWithPoint = FeedbackRow & {
  evaluation_points?: {
    id: string
    name: string
    business_id: string
  }
}

interface FeedbackFilters {
  businessId?: string
  pointId?: string
  rating?: number
  onlyAlerts?: boolean
  from?: string
  to?: string
}

export function useFeedbacks(filters: FeedbackFilters = {}) {
  const supabase = createClient()
  const queryClient = useQueryClient()

  const queryKey = ['feedbacks', filters]

  const { data: feedbacks = [], isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!filters.businessId) return [] as FeedbackWithPoint[]

      let query = supabase
        .from('feedbacks')
        .select(`
          *,
          evaluation_points!inner(id, name, business_id)
        `)
        .eq('evaluation_points.business_id', filters.businessId)
        .order('created_at', { ascending: false })

      if (filters.pointId) query = query.eq('evaluation_point_id', filters.pointId)
      if (filters.rating) query = query.eq('rating', filters.rating)
      if (filters.onlyAlerts) query = query.eq('is_alert', true)
      if (filters.from) query = query.gte('created_at', filters.from)
      if (filters.to) query = query.lte('created_at', filters.to)

      const { data, error } = await query
      if (error) throw error
      return (data ?? []) as unknown as FeedbackWithPoint[]
    },
    enabled: !!filters.businessId,
  })

  const markAsRead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('feedbacks')
        .update({ is_read: true } as never)
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  })

  const markAsResolved = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('feedbacks')
        .update({ is_resolved: true, is_read: true } as never)
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  })

  return { feedbacks, isLoading, markAsRead, markAsResolved }
}

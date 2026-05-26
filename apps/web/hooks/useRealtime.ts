'use client'
import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export function useRealtime(businessId?: string) {
  const queryClient = useQueryClient()
  const supabase = createClient()

  useEffect(() => {
    if (!businessId) return

    const channel = supabase
      .channel(`business-${businessId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'feedbacks' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['feedbacks'] })
          queryClient.invalidateQueries({ queryKey: ['unread-alerts', businessId] })
          queryClient.invalidateQueries({ queryKey: ['dashboard-stats', businessId] })
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [businessId, queryClient, supabase])
}

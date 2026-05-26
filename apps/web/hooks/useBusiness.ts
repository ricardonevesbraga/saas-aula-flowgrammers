'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database.types'
import type { BusinessFormData } from '@/lib/schemas/business.schema'

type BusinessRow = Database['public']['Tables']['businesses']['Row']
type BusinessInsert = Database['public']['Tables']['businesses']['Insert']

export function useBusiness(userId?: string) {
  const supabase = createClient()
  const queryClient = useQueryClient()

  const { data: business, isLoading } = useQuery({
    queryKey: ['business', userId],
    queryFn: async () => {
      if (!userId) return null
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle()
      if (error) throw error
      return data as BusinessRow | null
    },
    enabled: !!userId,
  })

  const createBusiness = useMutation({
    mutationFn: async (data: BusinessFormData & { user_id: string }) => {
      const { data: result, error } = await supabase
        .from('businesses')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .insert(data as any)
        .select()
        .single()
      if (error) throw error
      return result as BusinessRow
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['business', userId] }),
  })

  return { business, isLoading, createBusiness }
}

'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database.types'
import type { PointFormData } from '@/lib/schemas/point.schema'

type PointRow = Database['public']['Tables']['evaluation_points']['Row']
type PointInsert = Database['public']['Tables']['evaluation_points']['Insert']
type PointUpdate = Database['public']['Tables']['evaluation_points']['Update']

export function useEvaluationPoints(businessId?: string) {
  const supabase = createClient()
  const queryClient = useQueryClient()

  const { data: points = [], isLoading } = useQuery({
    queryKey: ['points', businessId],
    queryFn: async () => {
      if (!businessId) return [] as PointRow[]
      const { data, error } = await supabase
        .from('evaluation_points')
        .select('*')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false })
      if (error) throw error
      return (data ?? []) as PointRow[]
    },
    enabled: !!businessId,
  })

  const createPoint = useMutation({
    mutationFn: async (data: PointFormData & { business_id: string }) => {
      const { data: result, error } = await supabase
        .from('evaluation_points')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .insert(data as any)
        .select()
        .single()
      if (error) throw error
      return result as PointRow
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['points', businessId] }),
  })

  const togglePoint = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('evaluation_points')
        .update({ is_active } as never)
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['points', businessId] }),
  })

  return { points, isLoading, createPoint, togglePoint }
}

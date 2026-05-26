import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminShell } from '@/components/layout'
import type { Database } from '@/types/database.types'

type BusinessRow = Database['public']['Tables']['businesses']['Row']

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: businessRaw } = await supabase
    .from('businesses')
    .select('id, name')
    .eq('user_id', user.id)
    .maybeSingle()

  const business = businessRaw as Pick<BusinessRow, 'id' | 'name'> | null

  let unreadAlerts = 0
  if (business) {
    const { count } = await supabase
      .from('feedbacks')
      .select('id', { count: 'exact', head: true })
      .eq('is_alert', true)
      .eq('is_read', false)
    unreadAlerts = count ?? 0
  }

  return (
    <AdminShell
      businessName={business?.name}
      unreadAlerts={unreadAlerts}
      userInitials={user.email?.substring(0, 2).toUpperCase() ?? '?'}
    >
      {children}
    </AdminShell>
  )
}

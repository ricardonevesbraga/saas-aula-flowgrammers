'use client'
import { useState } from 'react'
import { format } from 'date-fns'
import { useAuth } from '@/hooks/useAuth'
import { useBusiness } from '@/hooks/useBusiness'
import { createClient } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import type { Database } from '@/types/database.types'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

type ExportRow = Database['public']['Tables']['exports_history']['Row']

export default function ExportarPage() {
  const { user } = useAuth()
  const { business } = useBusiness(user?.id)
  const supabase = createClient()

  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [isExporting, setIsExporting] = useState(false)

  const { data: history = [], isLoading: isLoadingHistory } = useQuery({
    queryKey: ['exports-history', user?.id],
    queryFn: async () => {
      if (!user) return [] as ExportRow[]
      const { data, error } = await supabase
        .from('exports_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)
      if (error) throw error
      return (data ?? []) as ExportRow[]
    },
    enabled: !!user,
  })

  const handleExport = async () => {
    if (!fromDate || !toDate) return
    setIsExporting(true)
    try {
      const params = new URLSearchParams({ from: fromDate, to: toDate })
      const response = await fetch(`/api/export/csv?${params}`)
      if (!response.ok) throw new Error('Erro ao exportar')
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `avaliacoes-${fromDate}-${toDate}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-lg">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Exportar dados</h1>

      <Card className="p-6 space-y-4">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Selecione o período</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Data início</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Data fim</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
            />
          </div>
        </div>

        <Button
          onClick={handleExport}
          disabled={!fromDate || !toDate || isExporting || !business}
          className="w-full"
        >
          {isExporting ? 'Exportando...' : 'Baixar CSV'}
        </Button>
      </Card>

      <div>
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">Histórico de exportações</h2>
        {isLoadingHistory ? (
          <div className="flex justify-center py-6"><LoadingSpinner /></div>
        ) : history.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">Nenhuma exportação realizada ainda.</p>
        ) : (
          <div className="space-y-2">
            {history.map((item) => (
              <Card key={item.id} className="p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    {format(new Date(item.period_start), 'dd/MM/yyyy')} →{' '}
                    {format(new Date(item.period_end), 'dd/MM/yyyy')}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {item.total_records} registros · {item.created_at ? format(new Date(item.created_at), 'dd/MM/yyyy HH:mm') : '—'}
                  </p>
                </div>
                {item.file_url && (
                  <a href={item.file_url} download className="text-xs text-blue-700 dark:text-blue-400 hover:underline">
                    Baixar
                  </a>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

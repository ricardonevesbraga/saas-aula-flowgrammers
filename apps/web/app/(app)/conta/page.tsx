'use client'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { useBusiness } from '@/hooks/useBusiness'
import type { Database } from '@/types/database.types'
import { BUSINESS_CATEGORIES } from '@/lib/schemas/business.schema'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Card } from '@/components/ui/Card'
import { Toggle } from '@/components/ui/Toggle'

type BusinessUpdate = Database['public']['Tables']['businesses']['Update']
type AlertRow = Database['public']['Tables']['alert_configs']['Row']
type AlertInsert = Database['public']['Tables']['alert_configs']['Insert']

const businessUpdateSchema = z.object({
  name: z.string().min(2, 'Nome muito curto').max(150),
  category: z.enum(BUSINESS_CATEGORIES),
  thank_you_message: z.string().max(200).optional(),
  address: z.string().max(300).optional(),
})

type BusinessUpdateData = z.infer<typeof businessUpdateSchema>

export default function ContaPage() {
  const router = useRouter()
  const { user, signOut } = useAuth()
  const { business } = useBusiness(user?.id)
  const supabase = createClient()

  const [bizSaved, setBizSaved] = useState(false)
  const [alertSaved, setAlertSaved] = useState(false)
  const [dangerOpen, setDangerOpen] = useState(false)
  const [deletingAccount, setDeletingAccount] = useState(false)
  const [alertEnabled, setAlertEnabled] = useState(true)
  const [threshold, setThreshold] = useState(3)

  const bizForm = useForm<BusinessUpdateData>({
    resolver: zodResolver(businessUpdateSchema),
  })

  useEffect(() => {
    if (business) {
      bizForm.reset({
        name: business.name,
        category: business.category as typeof BUSINESS_CATEGORIES[number],
        thank_you_message: business.thank_you_message ?? '',
        address: business.address ?? '',
      })
    }
  }, [business, bizForm])

  useEffect(() => {
    if (!user) return
    supabase
      .from('alert_configs')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        const row = data as AlertRow | null
        if (row) {
          setAlertEnabled(row.enabled ?? true)
          setThreshold(row.threshold_rating ?? 2)
        }
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  const onSaveBusiness = async (data: BusinessUpdateData) => {
    if (!user) return
    await supabase
      .from('businesses')
      .update(data as never)
      .eq('user_id', user.id)
    setBizSaved(true)
    setTimeout(() => setBizSaved(false), 2000)
  }

  const onSaveAlert = async () => {
    if (!user) return
    await supabase
      .from('alert_configs')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .upsert({
        user_id: user.id,
        threshold_rating: threshold,
        enabled: alertEnabled,
      } as any)
    setAlertSaved(true)
    setTimeout(() => setAlertSaved(false), 2000)
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Tem certeza? Esta ação é irreversível.')) return
    setDeletingAccount(true)
    await supabase.rpc('delete_user' as never)
    await signOut()
    router.push('/login')
  }

  return (
    <div className="space-y-6 max-w-lg">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Minha Conta</h1>

      {/* Profile */}
      <Card className="p-6 space-y-3">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Perfil</h2>
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Email</label>
          <Input value={user?.email ?? ''} disabled readOnly className="opacity-60" />
        </div>
      </Card>

      {/* Business */}
      <Card className="p-6">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Meu Negócio</h2>
        <form onSubmit={bizForm.handleSubmit(onSaveBusiness)} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Nome</label>
            <Input {...bizForm.register('name')} />
            {bizForm.formState.errors.name && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">{bizForm.formState.errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Categoria</label>
            <select
              className="w-full rounded-xl border border-slate-200 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
              {...bizForm.register('category')}
            >
              {BUSINESS_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
              Mensagem de agradecimento
            </label>
            <Textarea
              placeholder="Ex: Obrigado pela sua avaliação! 😊"
              maxLength={200}
              {...bizForm.register('thank_you_message')}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Endereço</label>
            <Input placeholder="Rua, número, cidade" {...bizForm.register('address')} />
          </div>
          <Button type="submit" disabled={bizForm.formState.isSubmitting}>
            {bizSaved ? 'Salvo!' : 'Salvar negócio'}
          </Button>
        </form>
      </Card>

      {/* Alert config */}
      <Card className="p-6 space-y-4">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Configurações de Alerta</h2>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-700 dark:text-slate-300">Alertas ativos</span>
          <Toggle checked={alertEnabled} onChange={setAlertEnabled} />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-2">
            Alerta quando nota for menor ou igual a: <strong>{threshold}</strong>
          </label>
          <input
            type="range"
            min={1}
            max={5}
            step={1}
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="w-full accent-blue-800"
          />
          <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500 mt-1">
            {[1, 2, 3, 4, 5].map((n) => <span key={n}>{n}</span>)}
          </div>
        </div>
        <Button type="button" onClick={onSaveAlert} variant="outline">
          {alertSaved ? 'Salvo!' : 'Salvar alertas'}
        </Button>
      </Card>

      {/* Danger zone */}
      <Card className="p-6 border-red-200 dark:border-red-900">
        <button
          type="button"
          onClick={() => setDangerOpen((v) => !v)}
          className="flex items-center justify-between w-full text-sm font-semibold text-red-700 dark:text-red-400"
        >
          <span>Zona de perigo</span>
          <span>{dangerOpen ? '▲' : '▼'}</span>
        </button>
        {dangerOpen && (
          <div className="mt-4 space-y-3">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Excluir sua conta removerá permanentemente todos os seus dados. Esta ação não pode ser desfeita.
            </p>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={deletingAccount}
            >
              {deletingAccount ? 'Excluindo...' : 'Excluir minha conta'}
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}

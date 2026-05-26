'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { businessSchema, BUSINESS_CATEGORIES, type BusinessFormData } from '@/lib/schemas/business.schema'
import { pointSchema, type PointFormData } from '@/lib/schemas/point.schema'
import type { Database } from '@/types/database.types'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'

type BusinessInsert = Database['public']['Tables']['businesses']['Insert']
type BusinessRow = Database['public']['Tables']['businesses']['Row']
type PointInsert = Database['public']['Tables']['evaluation_points']['Insert']
type PointRow = Database['public']['Tables']['evaluation_points']['Row']

type Step = 1 | 2 | 3

interface CreatedData {
  businessId: string
  pointSlug: string
  businessName: string
}

function ProgressBar({ step }: { step: Step }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={[
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors',
                s <= step ? 'bg-blue-800 text-white' : 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400',
              ].join(' ')}
            >
              {s}
            </div>
            {s < 3 && (
              <div
                className={[
                  'h-1 w-16 sm:w-24 mx-1 rounded transition-colors',
                  s < step ? 'bg-blue-800' : 'bg-slate-200 dark:bg-slate-700',
                ].join(' ')}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>Seu negócio</span>
        <span>Primeiro ponto</span>
        <span>QR Code pronto!</span>
      </div>
    </div>
  )
}

function Step1({ onNext }: { onNext: (data: BusinessFormData) => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<BusinessFormData>({
    resolver: zodResolver(businessSchema),
  })

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Conte sobre seu negócio</h2>
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nome do negócio *</label>
        <Input placeholder="Ex: Padaria do João" {...register('name')} />
        {errors.name && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.name.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Categoria *</label>
        <select
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-800"
          {...register('category')}
        >
          <option value="">Selecione uma categoria</option>
          {BUSINESS_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        {errors.category && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.category.message}</p>}
      </div>
      <Button type="submit" className="w-full">Próximo</Button>
    </form>
  )
}

function Step2({
  onNext,
  isLoading,
}: {
  onNext: (data: PointFormData) => void
  isLoading: boolean
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<PointFormData>({
    resolver: zodResolver(pointSchema),
  })

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Crie seu primeiro ponto de avaliação</h2>
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Um ponto de avaliação representa um local ou serviço onde os clientes vão avaliar. Ex: &quot;Caixa&quot;, &quot;Atendimento&quot;, &quot;Mesa 1&quot;.
      </p>
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nome do ponto *</label>
        <Input placeholder="Ex: Atendimento Geral" {...register('name')} />
        {errors.name && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.name.message}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Criando...' : 'Criar ponto de avaliação'}
      </Button>
    </form>
  )
}

function Step3({ data, onFinish }: { data: CreatedData; onFinish: () => void }) {
  const qrUrl = `/api/qr/${data.pointSlug}?format=png`
  const publicUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/a/${data.pointSlug}`

  return (
    <div className="text-center space-y-6">
      <div className="text-5xl animate-bounce">🎉</div>
      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Seu QR Code está pronto!</h2>
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Imprima e coloque no seu negócio para começar a receber avaliações.
      </p>

      <div className="flex justify-center">
        <img
          src={qrUrl}
          alt="QR Code de avaliação"
          className="w-48 h-48 border border-slate-200 dark:border-slate-700 rounded-xl bg-white"
        />
      </div>

      <div className="bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 text-xs text-slate-600 dark:text-slate-300 break-all">
        {publicUrl}
      </div>

      <div className="flex flex-col gap-2">
        <a
          href={qrUrl}
          download={`qr-${data.pointSlug}.png`}
          className="block w-full"
        >
          <Button variant="outline" className="w-full">Baixar QR Code (PNG)</Button>
        </a>
        <a
          href={`/api/qr/${data.pointSlug}?format=pdf`}
          download={`qr-${data.pointSlug}.pdf`}
          className="block w-full"
        >
          <Button variant="outline" className="w-full">Baixar PDF A6 para impressão</Button>
        </a>
        <Button className="w-full" onClick={onFinish}>
          Ir para o Dashboard
        </Button>
      </div>
    </div>
  )
}

export default function OnboardingPage() {
  const router = useRouter()
  const { user } = useAuth()
  const supabase = createClient()
  const [step, setStep] = useState<Step>(1)
  const [businessData, setBusinessData] = useState<BusinessFormData | null>(null)
  const [createdData, setCreatedData] = useState<CreatedData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleStep1 = (data: BusinessFormData) => {
    setBusinessData(data)
    setStep(2)
  }

  const handleStep2 = async (pointData: PointFormData) => {
    if (!user || !businessData) return
    setIsLoading(true)
    setError(null)

    try {
      const { data: businessRaw, error: bizError } = await supabase
        .from('businesses')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .insert({ ...businessData, user_id: user.id } as any)
        .select()
        .single()
      if (bizError) throw bizError
      const business = businessRaw as BusinessRow

      const { data: pointRaw, error: pointError } = await supabase
        .from('evaluation_points')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .insert({ name: pointData.name, business_id: business.id } as any)
        .select()
        .single()
      if (pointError) throw pointError
      const point = pointRaw as PointRow

      setCreatedData({
        businessId: business.id,
        pointSlug: point.public_slug,
        businessName: business.name,
      })
      setStep(3)
    } catch {
      setError('Erro ao criar negócio. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto py-8 px-4">
      <ProgressBar step={step} />
      <Card className="p-6">
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 dark:bg-red-950 dark:border-red-900 px-3 py-2 text-sm text-red-700 dark:text-red-300">
            {error}
          </div>
        )}
        {step === 1 && <Step1 onNext={handleStep1} />}
        {step === 2 && <Step2 onNext={handleStep2} isLoading={isLoading} />}
        {step === 3 && createdData && (
          <Step3 data={createdData} onFinish={() => router.push('/dashboard')} />
        )}
      </Card>
    </div>
  )
}

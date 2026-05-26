import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { EvaluationForm } from './EvaluationForm'

interface Props {
  params: Promise<{ slug: string }>
}

interface BusinessData {
  name: string
  logo_url: string | null
  thank_you_message: string | null
}

interface PointWithBusiness {
  id: string
  name: string
  is_active: boolean
  businesses: BusinessData | BusinessData[]
}

export default async function EvaluatePage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: point } = await supabase
    .from('evaluation_points')
    .select(`
      id,
      name,
      is_active,
      businesses!inner(name, logo_url, thank_you_message)
    `)
    .eq('public_slug', slug)
    .eq('is_active', true)
    .maybeSingle() as { data: PointWithBusiness | null; error: unknown }

  if (!point) notFound()

  const business = Array.isArray(point.businesses) ? point.businesses[0] : point.businesses

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="pt-8 pb-4 px-4 text-center">
        {business?.logo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={business.logo_url}
            alt={business.name}
            className="h-10 mx-auto mb-2 object-contain"
          />
        ) : (
          <div className="text-lg font-bold text-blue-900">{business?.name}</div>
        )}
        <p className="text-slate-500 text-sm">{point.name}</p>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
        <EvaluationForm
          pointId={point.id}
          pointSlug={slug}
          thankYouMessage={business?.thank_you_message ?? 'Obrigado pela sua avaliação! Volte sempre 💛'}
        />
      </main>
    </div>
  )
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  return {
    title: 'Avalie nosso atendimento',
    robots: 'noindex',
  }
}

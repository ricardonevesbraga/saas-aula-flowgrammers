import { AutoClose } from './AutoClose'

interface Props {
  searchParams: Promise<{ msg?: string }>
}

export default async function ThankYouPage({ searchParams }: Props) {
  const { msg } = await searchParams
  const message = msg ? decodeURIComponent(msg) : 'Obrigado pela sua avaliação! Volte sempre 💛'

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <div className="text-8xl mb-6 animate-bounce">🌟</div>

      <h1 className="text-2xl font-bold text-slate-800 mb-3">
        Avaliação recebida!
      </h1>

      <p className="text-slate-600 max-w-xs text-lg leading-relaxed">
        {message}
      </p>

      <AutoClose delayMs={8000} />
    </div>
  )
}

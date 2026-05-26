import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <div className="text-8xl mb-6">🔍</div>

      <h1 className="text-2xl font-bold text-slate-800 mb-3">
        QR Code não encontrado
      </h1>

      <p className="text-slate-500 max-w-xs text-base leading-relaxed mb-8">
        Este link de avaliação não existe ou foi desativado. Verifique o QR Code e tente novamente.
      </p>

      <Link
        href="/"
        className="text-blue-900 underline underline-offset-2 text-sm hover:text-blue-700"
      >
        Voltar ao início
      </Link>
    </div>
  )
}

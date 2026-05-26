export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <nav className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-b border-slate-100 dark:border-slate-700 px-4 h-16 flex items-center justify-between max-w-6xl mx-auto">
        <div className="font-bold text-blue-900 dark:text-blue-300">
          Avalie Meu <span className="text-green-600 dark:text-green-400">Atendimento</span>
        </div>
        <div className="flex items-center gap-3">
          <a href="/login" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-sm">
            Entrar
          </a>
          <a
            href="/signup"
            className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
          >
            Criar conta grátis
          </a>
        </div>
      </nav>
      {children}
    </div>
  )
}

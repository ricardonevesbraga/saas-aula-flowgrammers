import { Lock } from 'lucide-react'

type LinkItem = {
  label: string
  href: string
}

const PRODUTO: LinkItem[] = [
  { label: 'Como funciona', href: '/#como-funciona' },
  { label: 'Funcionalidades', href: '/#funcionalidades' },
  { label: 'Preços', href: '/#precos' },
  { label: 'FAQ', href: '/#faq' },
]

const CONTA: LinkItem[] = [
  { label: 'Criar conta grátis', href: '/signup' },
  { label: 'Entrar', href: '/login' },
]

const LEGAL: LinkItem[] = [
  { label: 'Privacidade', href: '/privacidade' },
  { label: 'Termos de uso', href: '/termos' },
]

type ColumnProps = {
  title: string
  items: LinkItem[]
}

function Column({ title, items }: ColumnProps) {
  return (
    <div>
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
        {title}
      </h3>
      <ul className="flex flex-col gap-2.5">
        {items.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="text-sm text-slate-300 transition-colors duration-150 hover:text-white"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function FooterMarketing() {
  return (
    <footer className="bg-slate-900 px-4 pt-16 pb-8 text-slate-300">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <span className="text-xl font-bold">
              <span className="text-[#1E3A8A] dark:text-blue-300">Avalie</span>{' '}
              <span className="text-[#16A34A]">Meu</span>{' '}
              <span className="text-[#1E3A8A] dark:text-blue-300">Atendimento</span>
            </span>
            <p className="mt-3 max-w-sm text-sm text-slate-400">
              Satisfação do cliente, simplificada.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-7">
            <Column title="Produto" items={PRODUTO} />
            <Column title="Conta" items={CONTA} />
            <Column title="Legal" items={LEGAL} />
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-slate-700/50 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-slate-400">
            © 2026 Avalie Meu Atendimento. Feito com{' '}
            <span aria-label="amor" role="img">
              ❤️
            </span>{' '}
            para pequenos negócios brasileiros.
          </p>

          <span className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-800/60 px-3 py-1.5 text-xs font-medium text-slate-300">
            <Lock size={12} strokeWidth={2.5} aria-hidden />
            Dados protegidos · LGPD
          </span>
        </div>
      </div>
    </footer>
  )
}

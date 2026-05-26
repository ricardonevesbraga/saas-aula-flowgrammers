'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Lock } from 'lucide-react'

type PlanItem = {
  text: string
  comingSoon?: boolean
}

const FREE_ITEMS: PlanItem[] = [
  { text: '1 ponto de avaliação' },
  { text: 'Avaliações ilimitadas' },
  { text: 'Dashboard completo' },
  { text: 'Alertas in-app' },
  { text: 'QR Code (PNG, SVG, PDF)' },
  { text: 'Exportação CSV' },
  { text: 'Suporte por email' },
]

const PRO_ITEMS: PlanItem[] = [
  { text: 'Tudo do Grátis' },
  { text: 'Pontos ilimitados' },
  { text: 'Múltiplos locais' },
  { text: 'Comparar pontos' },
  { text: 'Prioridade no suporte' },
  { text: 'Análise de sentimento (IA)', comingSoon: true },
  { text: 'Integração Google Reviews', comingSoon: true },
]

function CheckMark({ comingSoon }: { comingSoon?: boolean }) {
  if (comingSoon) {
    return (
      <span
        aria-hidden
        className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center text-base"
      >
        🔜
      </span>
    )
  }
  return (
    <span
      aria-hidden
      className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#16A34A]/15 text-[#16A34A]"
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path
          d="M2.5 6.5L5 9L9.5 3.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

type PricingSectionProps = {
  id?: string
}

export function PricingSection({ id = 'pricing' }: PricingSectionProps = {}) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.disconnect()
            break
          }
        }
      },
      { threshold: 0.15 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const baseTransition: React.CSSProperties = {
    transition: 'transform 0.4s ease, opacity 0.6s ease, box-shadow 0.4s ease',
  }

  return (
    <section
      ref={sectionRef}
      id={id}
      className="relative bg-white py-20 dark:bg-slate-900 sm:py-28"
    >
      <style jsx>{`
        @keyframes pulse-ring {
          0% {
            box-shadow:
              0 0 0 0px rgba(30, 58, 138, 0.3),
              0 8px 32px rgba(30, 58, 138, 0.12);
          }
          70% {
            box-shadow:
              0 0 0 8px rgba(30, 58, 138, 0),
              0 8px 32px rgba(30, 58, 138, 0.12);
          }
          100% {
            box-shadow:
              0 0 0 0px rgba(30, 58, 138, 0),
              0 8px 32px rgba(30, 58, 138, 0.12);
          }
        }
        .plan-free {
          animation: pulse-ring 2.4s ease-out infinite;
        }
        .plan-free:hover {
          transform: perspective(800px) rotateY(-4deg) translateY(-6px) scale(1.02);
          box-shadow:
            0 0 0 0 rgba(30, 58, 138, 0),
            0 24px 48px rgba(30, 58, 138, 0.22);
        }
        .plan-pro:hover {
          transform: perspective(800px) rotateY(2deg) translateY(-2px);
        }
      `}</style>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <span aria-hidden>💰</span>
            Preço justo
          </span>

          <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl md:text-5xl">
            Comece grátis.
            <br />
            <span className="text-[#1E3A8A] dark:text-blue-300">Cresça quando precisar.</span>
          </h2>

          <p className="mt-4 text-base text-slate-600 dark:text-slate-300 sm:text-lg">
            Sem cartão de crédito. Sem pegadinha.
            <br />
            Upgrade quando quiser múltiplos pontos.
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl grid-cols-1 items-stretch gap-6 md:grid-cols-2 md:gap-8">
          <div
            style={{
              ...baseTransition,
              transformStyle: 'preserve-3d',
              opacity: visible ? 1 : 0,
              translate: visible ? '0 0' : '0 24px',
              transitionDelay: '0ms',
            }}
            className="plan-free relative flex scale-[1.02] flex-col rounded-2xl border-2 border-[#1E3A8A] p-8 will-change-transform dark:border-blue-400 [background:linear-gradient(135deg,#EFF6FF_0%,#FFFFFF_100%)] dark:[background:linear-gradient(135deg,#1E293B_0%,#0F172A_100%)]"
          >
            <div className="absolute left-1/2 top-0 -translate-x-1/2">
              <span
                className="inline-flex items-center gap-1 bg-[#1E3A8A] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-sm"
                style={{ borderRadius: '0 0 8px 8px' }}
              >
                <span aria-hidden>⭐</span>
                Mais popular
              </span>
            </div>

            <div className="mt-3">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                Grátis
              </h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                  R$ 0
                </span>
                <span className="text-base text-slate-500 dark:text-slate-400">
                  /mês
                </span>
              </div>
              <p className="mt-1 text-sm font-medium text-[#1E3A8A] dark:text-blue-300">
                Para sempre
              </p>
            </div>

            <ul className="mt-6 flex-1 space-y-3">
              {FREE_ITEMS.map((item) => (
                <li
                  key={item.text}
                  className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-200"
                >
                  <CheckMark />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/signup"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-[#F59E0B] px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition-all hover:bg-[#D97706] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:ring-offset-2"
            >
              Criar conta grátis
              <ArrowRight size={16} strokeWidth={2.5} aria-hidden />
            </Link>
          </div>

          <div
            style={{
              ...baseTransition,
              transformStyle: 'preserve-3d',
              opacity: visible ? 1 : 0,
              translate: visible ? '0 0' : '0 24px',
              transitionDelay: '200ms',
            }}
            className="plan-pro relative flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-8 will-change-transform dark:border-slate-700 dark:bg-slate-800"
          >
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                Pro
              </h3>
              <div className="relative mt-4 inline-flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight text-slate-700 dark:text-slate-200">
                  Em breve
                </span>
                <span
                  aria-hidden
                  className="ml-3 inline-flex items-center gap-1 rounded-full bg-slate-900/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white dark:bg-slate-100/90 dark:text-slate-900"
                >
                  <Lock size={11} strokeWidth={2.5} />
                  Em breve
                </span>
              </div>
              <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                Notifique-me
              </p>
            </div>

            <ul className="mt-6 flex-1 space-y-3">
              {PRO_ITEMS.map((item) => (
                <li
                  key={item.text}
                  className="flex items-start gap-2.5 text-sm text-slate-600 opacity-80 blur-[0.3px] dark:text-slate-300"
                >
                  <CheckMark comingSoon={item.comingSoon} />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              disabled
              aria-disabled="true"
              className="mt-8 inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-400"
            >
              Avisem-me quando sair
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

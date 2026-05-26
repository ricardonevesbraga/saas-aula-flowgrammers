'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ArrowDown, CheckCircle2 } from 'lucide-react'

export function HeroSection() {
  const leftRef = useRef<HTMLDivElement | null>(null)
  const rightRef = useRef<HTMLDivElement | null>(null)
  const [leftVisible, setLeftVisible] = useState<boolean>(false)
  const [rightVisible, setRightVisible] = useState<boolean>(false)

  useEffect(() => {
    const targets: Array<{
      el: HTMLDivElement | null
      setter: (v: boolean) => void
    }> = [
      { el: leftRef.current, setter: setLeftVisible },
      { el: rightRef.current, setter: setRightVisible },
    ]

    const observers: IntersectionObserver[] = []

    targets.forEach(({ el, setter }) => {
      if (!el) return
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setter(true)
              io.disconnect()
            }
          })
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
      )
      io.observe(el)
      observers.push(io)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  return (
    <section
      className="relative overflow-hidden bg-white dark:bg-slate-900 pt-20 pb-24 sm:pt-28 sm:pb-32"
      aria-label="Hero"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.04] dark:opacity-[0.08]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #0F172A 1px, transparent 1px), linear-gradient(to bottom, #0F172A 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage:
            'radial-gradient(ellipse at center, black 30%, transparent 75%)',
          WebkitMaskImage:
            'radial-gradient(ellipse at center, black 30%, transparent 75%)',
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 800px 600px at 70% 50%, rgba(30,58,138,0.10) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div
          ref={leftRef}
          className="text-center lg:text-left"
          style={{
            opacity: leftVisible ? 1 : 0,
            transform: leftVisible ? 'translateY(0)' : 'translateY(20px)',
            transition:
              'opacity 700ms ease-out, transform 700ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700 sm:text-sm dark:border-green-900/40 dark:bg-green-950/40 dark:text-green-300">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
            Grátis para começar · Sem cartão de crédito
          </span>

          <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white">
            Seus clientes saem sem falar nada —
            <br />
            <span className="text-[#1E3A8A] dark:text-blue-300">
              mas eles têm opinião.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-300 lg:mx-0 mx-auto">
            Coloque um QR Code no balcão. O cliente avalia em 5 segundos com um
            emoji. Você recebe tudo em tempo real no painel — e é avisado
            quando a nota é baixa.
          </p>

          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start">
            <Link
              href="/signup"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#F59E0B] px-6 py-3.5 text-base font-semibold text-slate-900 shadow-[0_8px_24px_-8px_rgba(245,158,11,0.6)] transition-all duration-200 hover:bg-[#EA8A06] hover:shadow-[0_12px_32px_-8px_rgba(245,158,11,0.7)] hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:ring-offset-2 dark:focus:ring-offset-slate-900"
            >
              Criar minha conta grátis
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>

            <Link
              href="#como-funciona"
              className="group inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-slate-700 transition-all duration-200 hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Ver como funciona
              <ArrowDown
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>

          <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-slate-200 pt-6 dark:border-slate-800 lg:max-w-md">
            <div>
              <dt className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Setup
              </dt>
              <dd className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                2 min
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Avaliação
              </dt>
              <dd className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                5 seg
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Alertas
              </dt>
              <dd className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                Tempo real
              </dd>
            </div>
          </dl>
        </div>

        <div
          ref={rightRef}
          className="relative mx-auto w-full max-w-md lg:max-w-none"
          style={{
            opacity: rightVisible ? 1 : 0,
            transform: rightVisible ? 'translateX(0)' : 'translateX(30px)',
            transition:
              'opacity 800ms ease-out 300ms, transform 800ms cubic-bezier(0.16, 1, 0.3, 1) 300ms',
          }}
        >
          <div
            className="relative mx-auto"
            style={{ perspective: '1200px' }}
          >
            <div
              className="relative rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-800 dark:shadow-black/40"
              style={{
                animation: 'avalie-float 6s ease-in-out infinite',
                transformStyle: 'preserve-3d',
              }}
            >
              <div className="flex items-center justify-between rounded-t-3xl border-b border-slate-200 bg-slate-50 px-5 py-3 dark:border-slate-700 dark:bg-slate-900/60">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                </div>
                <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                  avaliemeu.app/a/cafe-central
                </span>
              </div>

              <div className="px-6 pt-8 pb-6 sm:px-8 sm:pt-10">
                <p className="text-center text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Café Central
                </p>
                <h3 className="mt-2 text-center text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">
                  Como foi seu atendimento?
                </h3>

                <div className="mt-7 flex items-end justify-between gap-2 sm:gap-3">
                  {[
                    { emoji: '😡', label: 'Muito ruim', color: '#DC2626' },
                    { emoji: '😕', label: 'Ruim', color: '#F97316' },
                    { emoji: '😐', label: 'Regular', color: '#EAB308' },
                    { emoji: '🙂', label: 'Bom', color: '#84CC16' },
                    { emoji: '😍', label: 'Excelente', color: '#16A34A' },
                  ].map((item, i) => (
                    <div
                      key={item.label}
                      className="flex flex-1 flex-col items-center gap-1.5"
                    >
                      <button
                        type="button"
                        aria-label={item.label}
                        tabIndex={-1}
                        className="text-3xl transition-transform duration-200 hover:scale-125 sm:text-4xl"
                        style={{
                          filter: i === 4 ? 'drop-shadow(0 4px 10px rgba(22,163,74,0.4))' : 'none',
                          transform: i === 4 ? 'scale(1.15)' : 'none',
                        }}
                      >
                        {item.emoji}
                      </button>
                      <span
                        className="text-[9px] font-medium uppercase tracking-wide sm:text-[10px]"
                        style={{ color: item.color }}
                      >
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="mt-7 text-center text-xs text-slate-400 dark:text-slate-500">
                  Anônimo · Sem app · 100% gratuito para o cliente
                </p>
              </div>

              <div className="h-1 overflow-hidden rounded-b-3xl bg-slate-100 dark:bg-slate-900">
                <div
                  className="h-full w-2/3 rounded-r-full"
                  style={{
                    background:
                      'linear-gradient(90deg, #1E3A8A 0%, #3B82F6 100%)',
                  }}
                />
              </div>
            </div>

            <div
              className="absolute -left-4 -top-4 z-10 flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3.5 py-2 text-sm font-semibold text-green-700 shadow-lg sm:-left-8 sm:-top-6 dark:border-green-800/60 dark:bg-green-950/80 dark:text-green-300"
              style={{
                animation: 'avalie-badge-float 5s ease-in-out infinite',
                animationDelay: '1s',
              }}
            >
              <span aria-hidden="true">😍</span>
              <span>Excelente!</span>
            </div>

            <div
              className="absolute -bottom-4 -right-2 z-10 flex items-center gap-2 rounded-full bg-[#1E3A8A] px-3.5 py-2 text-sm font-semibold text-white shadow-xl shadow-blue-900/30 sm:-bottom-6 sm:-right-6"
              style={{
                animation: 'avalie-badge-float-alt 5.5s ease-in-out infinite',
                animationDelay: '2s',
              }}
            >
              <span aria-hidden="true">📊</span>
              <span>+23 hoje</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes avalie-float {
          0%, 100% { transform: translateY(0px) rotateY(-12deg) rotateX(6deg); }
          50% { transform: translateY(-12px) rotateY(-12deg) rotateX(6deg); }
        }
        @keyframes avalie-fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes avalie-badge-float {
          0%, 100% { transform: translateY(0px) rotate(-3deg); }
          50% { transform: translateY(-6px) rotate(-3deg); }
        }
        @keyframes avalie-badge-float-alt {
          0%, 100% { transform: translateY(0px) rotate(2deg); }
          50% { transform: translateY(-8px) rotate(2deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="avalie-float"],
          [style*="avalie-badge-float"],
          [style*="avalie-badge-float-alt"] {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  )
}

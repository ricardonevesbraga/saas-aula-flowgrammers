'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Rocket, ChevronRight } from 'lucide-react'

type Step = {
  number: string
  icon: string
  title: string
  desc: string
}

const STEPS: Step[] = [
  {
    number: '01',
    icon: '🖨️',
    title: 'Gere o QR Code',
    desc: 'Cadastre seu negócio, nomeie o ponto de avaliação e baixe o QR Code. Em 2 minutos. PNG, SVG ou PDF tamanho A6 para imprimir.',
  },
  {
    number: '02',
    icon: '😍',
    title: 'Cliente avalia em 5 segundos',
    desc: 'Escaneia o QR Code, toca num emoji, pode deixar um comentário. Sem baixar app, sem criar conta, sem fricção nenhuma.',
  },
  {
    number: '03',
    icon: '📊',
    title: 'Você vê na hora',
    desc: 'Dashboard atualiza em tempo real. Nota baixa? O sino te avisa imediatamente, enquanto o cliente ainda está no estabelecimento.',
  },
]

export function HowItWorks(): React.ReactElement {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState<boolean>(false)

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.2 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="como-funciona"
      ref={sectionRef}
      className="py-20 px-4 bg-white dark:bg-slate-900"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-navy-900 dark:text-blue-300 text-sm font-medium mb-5">
            <Rocket className="w-4 h-4" aria-hidden="true" />
            Configuração em 2 minutos
          </span>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-50 leading-tight mb-4 max-w-2xl mx-auto">
            Três passos. Nenhuma complicação.
          </h2>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            Do cadastro ao QR Code na parede em menos de 2 minutos.
          </p>
        </div>

        <div className="relative">
          {/* Connector line — desktop only */}
          <div
            className="hidden sm:block absolute left-0 right-0 top-[88px] z-0 pointer-events-none px-12"
            aria-hidden="true"
          >
            <div className="relative h-0.5 border-t-2 border-dashed border-blue-200 dark:border-slate-600">
              <ChevronRight
                className="absolute -left-3 -top-[14px] w-6 h-6 text-blue-300 dark:text-slate-500"
                strokeWidth={2.5}
              />
              <ChevronRight
                className="absolute -right-3 -top-[14px] w-6 h-6 text-blue-300 dark:text-slate-500"
                strokeWidth={2.5}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 relative z-10">
            {STEPS.map((step, index) => (
              <article
                key={step.number}
                className="how-card soft-card"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible
                    ? 'translateY(0) perspective(800px) rotateX(8deg) rotateY(-4deg)'
                    : 'translateY(24px) perspective(800px) rotateX(8deg) rotateY(-4deg)',
                  transition: `opacity 0.6s ease ${
                    index * 150
                  }ms, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${
                    index * 150
                  }ms`,
                  transformStyle: 'preserve-3d',
                  willChange: 'transform, opacity',
                }}
              >
                <div className="flex flex-col items-start gap-4">
                  <div className="flex items-baseline justify-between w-full">
                    <span className="how-number" aria-hidden="true">
                      {step.number}
                    </span>
                    <span
                      className="text-4xl sm:text-5xl leading-none"
                      role="img"
                      aria-hidden="true"
                    >
                      {step.icon}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-50">
                    {step.title}
                  </h3>

                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(24px) perspective(800px) rotateX(8deg) rotateY(-4deg);
          }
          to {
            opacity: 1;
            transform: translateY(0) perspective(800px) rotateX(8deg) rotateY(-4deg);
          }
        }
        .how-card {
          transform-origin: center center;
        }
        .how-card:hover {
          transform: perspective(800px) rotateX(0deg) rotateY(0deg) scale(1.04) !important;
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
          box-shadow: 0 20px 40px -12px rgba(30, 58, 138, 0.18);
        }
        .how-number {
          font-size: clamp(56px, 7vw, 80px);
          font-weight: 900;
          line-height: 0.9;
          letter-spacing: -0.04em;
          background: linear-gradient(135deg, #1E3A8A 0%, #1E40AF 60%, #3B82F6 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          text-shadow: 4px 4px 8px rgba(30, 58, 138, 0.2);
          display: inline-block;
          transform: translateZ(20px);
        }
        :global(.dark) .how-number {
          background: linear-gradient(135deg, #93C5FD 0%, #60A5FA 60%, #3B82F6 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 4px 4px 12px rgba(59, 130, 246, 0.3);
        }
        @media (prefers-reduced-motion: reduce) {
          .how-card {
            transform: none !important;
            opacity: 1 !important;
            transition: none !important;
          }
        }
      `}</style>
    </section>
  )
}

'use client'

import React, { useEffect, useRef, useState } from 'react'
import { X, Check, ArrowRight } from 'lucide-react'

type PainPoint = {
  id: number
  pain: string
  solution: string
}

const PAIN_POINTS: PainPoint[] = [
  {
    id: 1,
    pain: 'O cliente saiu e eu nem sei se foi mal atendido',
    solution: 'Agora você sabe, em tempo real, antes de perder o cliente',
  },
  {
    id: 2,
    pain: 'Recebo reclamação no Google, mas nunca soube antes',
    solution:
      'Você é avisado quando a nota é baixa — ainda dentro do estabelecimento',
  },
  {
    id: 3,
    pain: 'Não tenho como pedir opinião sem constranger o cliente',
    solution:
      'QR Code na mesa. O cliente avalia sozinho, anonimamente, em 5 segundos',
  },
]

export function PainSection(): React.ReactElement {
  const sectionRef = useRef<HTMLDivElement | null>(null)
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
      { threshold: 0.3 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-20 px-4 bg-slate-50 dark:bg-slate-900"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-sm font-medium mb-5">
            <span aria-hidden="true">😓</span> Parece familiar?
          </span>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-50 leading-tight mb-4 max-w-2xl mx-auto">
            Você sabe o que seus clientes{' '}
            <span className="text-navy-900 dark:text-blue-300">
              realmente
            </span>{' '}
            pensam de você?
          </h2>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            A maioria dos clientes vai embora sem falar nada. Mas eles têm
            opinião — e você não está ouvindo.
          </p>
        </div>

        <div
          className="grid grid-cols-1 gap-6"
          style={{ perspective: '1000px' }}
        >
          {PAIN_POINTS.map((item, index) => (
            <article
              key={item.id}
              className="soft-card pain-card group"
              style={{
                transformStyle: 'preserve-3d',
                transform: visible
                  ? 'rotateY(0deg)'
                  : 'rotateY(90deg)',
                opacity: visible ? 1 : 0,
                transition: `transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${
                  index * 200
                }ms, opacity 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${
                  index * 200
                }ms`,
                willChange: 'transform, opacity',
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-5 sm:gap-6">
                {/* Pain side */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-red-50/70 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50">
                  <span
                    className="flex items-center justify-center shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/60 text-red-600 dark:text-red-300"
                    aria-hidden="true"
                  >
                    <X className="w-5 h-5" strokeWidth={2.5} />
                  </span>
                  <p className="text-sm sm:text-base font-medium text-slate-800 dark:text-slate-200 leading-snug">
                    “{item.pain}”
                  </p>
                </div>

                {/* Arrow */}
                <div
                  className="flex items-center justify-center text-navy-900 dark:text-blue-400"
                  aria-hidden="true"
                >
                  <ArrowRight
                    className="w-6 h-6 sm:w-7 sm:h-7 rotate-90 sm:rotate-0 pain-arrow"
                    strokeWidth={2.5}
                  />
                </div>

                {/* Solution side */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-green-50/70 dark:bg-green-950/30 border border-green-100 dark:border-green-900/50">
                  <span
                    className="flex items-center justify-center shrink-0 w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300"
                    aria-hidden="true"
                  >
                    <Check className="w-5 h-5" strokeWidth={2.5} />
                  </span>
                  <p className="text-sm sm:text-base font-medium text-slate-800 dark:text-slate-200 leading-snug">
                    {item.solution}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <style>{`
        .pain-card {
          transform-origin: center center;
          transition-property: transform, box-shadow, opacity;
        }
        .pain-card:hover {
          transform: rotateY(3deg) translateY(-2px) !important;
          transition: transform 0.4s ease, box-shadow 0.4s ease !important;
        }
        @keyframes painArrowPulse {
          0%, 100% {
            transform: translateX(0);
            opacity: 0.8;
          }
          50% {
            transform: translateX(4px);
            opacity: 1;
          }
        }
        .pain-arrow {
          animation: painArrowPulse 1.8s ease-in-out infinite;
        }
        @media (max-width: 640px) {
          @keyframes painArrowPulseMobile {
            0%, 100% {
              transform: translateY(0) rotate(90deg);
              opacity: 0.8;
            }
            50% {
              transform: translateY(4px) rotate(90deg);
              opacity: 1;
            }
          }
          .pain-arrow {
            animation: painArrowPulseMobile 1.8s ease-in-out infinite;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .pain-card {
            transform: none !important;
            opacity: 1 !important;
            transition: none !important;
          }
          .pain-arrow {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  )
}

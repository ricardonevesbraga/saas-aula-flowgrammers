'use client'

import { useEffect, useRef, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  BarChart3,
  Bell,
  QrCode,
  MessageSquare,
  Download,
  Smartphone,
} from 'lucide-react'

type Feature = {
  icon: LucideIcon
  iconColor: string
  iconBg: string
  title: string
  description: string
}

const FEATURES: Feature[] = [
  {
    icon: BarChart3,
    iconColor: '#1E3A8A',
    iconBg: 'rgba(30, 58, 138, 0.10)',
    title: 'Dashboard em tempo real',
    description:
      'Veja cada avaliação aparecer na hora. Médias, distribuição de notas, evolução — tudo em um painel limpo.',
  },
  {
    icon: Bell,
    iconColor: '#DC2626',
    iconBg: 'rgba(220, 38, 38, 0.10)',
    title: 'Alerta de nota baixa',
    description:
      'Receba notificação imediata quando um cliente der nota baixa. Resolva antes que ele reclame no Google.',
  },
  {
    icon: QrCode,
    iconColor: '#16A34A',
    iconBg: 'rgba(22, 163, 74, 0.10)',
    title: 'QR Code para imprimir',
    description:
      'Baixe em PNG, SVG ou PDF tamanho A6. Cola no balcão, mesa, caixa ou porta. Pronto.',
  },
  {
    icon: MessageSquare,
    iconColor: '#7C3AED',
    iconBg: 'rgba(124, 58, 237, 0.10)',
    title: 'Comentários dos clientes',
    description:
      'Leia o que eles escreveram, filtre por nota, marque como lido. Nada se perde.',
  },
  {
    icon: Download,
    iconColor: '#F59E0B',
    iconBg: 'rgba(245, 158, 11, 0.10)',
    title: 'Exportação em CSV',
    description:
      'Baixe todos os dados por período, ponto ou nota. Para relatórios, reuniões ou arquivos.',
  },
  {
    icon: Smartphone,
    iconColor: '#475569',
    iconBg: 'rgba(71, 85, 105, 0.10)',
    title: 'Funciona em qualquer celular',
    description:
      'Sem app para instalar. O cliente escaneia o QR Code e já avalia. iOS, Android, qualquer navegador.',
  },
]

type FeatureCardProps = {
  feature: Feature
  index: number
  visible: boolean
}

function FeatureCard({ feature, index, visible }: FeatureCardProps) {
  const Icon = feature.icon
  const delayMs = index * 75

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    e.currentTarget.style.transform = `perspective(600px) rotateY(${x * 16}deg) rotateX(${-y * 16}deg) scale(1.02)`
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = ''
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
        transition: 'transform 0.15s ease, opacity 0.6s ease',
        transitionDelay: `${delayMs}ms`,
        opacity: visible ? 1 : 0,
        translate: visible ? '0 0' : '0 24px',
      }}
      className="soft-card group relative cursor-default p-6 will-change-transform"
    >
      <div
        style={{
          backgroundColor: feature.iconBg,
          boxShadow: '4px 4px 0px rgba(0,0,0,0.08)',
          transform: 'perspective(200px) rotateX(10deg) rotateY(-10deg) translateZ(20px)',
        }}
        className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl"
      >
        <Icon size={22} strokeWidth={2.25} color={feature.iconColor} aria-hidden />
      </div>

      <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-50">
        {feature.title}
      </h3>
      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        {feature.description}
      </p>
    </div>
  )
}

type FeaturesSectionProps = {
  id?: string
}

export function FeaturesSection({ id = 'features' }: FeaturesSectionProps = {}) {
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

  return (
    <section
      ref={sectionRef}
      id={id}
      className="bg-slate-50 py-20 dark:bg-slate-900 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <span aria-hidden>⚡</span>
            Tudo que você precisa
          </span>

          <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl md:text-5xl">
            Simples para o cliente.
            <br />
            <span className="text-[#1E3A8A] dark:text-blue-300">Poderoso para você.</span>
          </h2>

          <p className="mt-4 text-base text-slate-600 dark:text-slate-300 sm:text-lg">
            Sem configuração complicada. Em 2 minutos você está coletando avaliações.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              feature={feature}
              index={index}
              visible={visible}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

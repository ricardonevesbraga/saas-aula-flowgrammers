'use client'

import { useEffect, useRef, useState } from 'react'

type FaqItem = {
  q: string
  a: string
}

const FAQS: FaqItem[] = [
  {
    q: 'É gratuito mesmo? Sem pegadinha?',
    a: 'Sim. O plano básico é 100% gratuito com 1 ponto de avaliação, avaliações ilimitadas e todas as funcionalidades principais. Sem cartão de crédito, sem período de teste — é grátis de verdade.',
  },
  {
    q: 'O cliente precisa baixar algum app?',
    a: 'Não. O cliente escaneia o QR Code com a câmera do celular e a tela de avaliação abre direto no navegador. Funciona no iOS, Android, qualquer smartphone. Zero instalação.',
  },
  {
    q: 'O cliente precisa se cadastrar ou fazer login?',
    a: 'Não. A avaliação é completamente anônima. O cliente não precisa nem informar o nome. Quanto menos fricção, mais avaliações você recebe.',
  },
  {
    q: 'Como recebo alertas de nota baixa?',
    a: 'Dentro do próprio painel, um sino no canto da tela te avisa em tempo real quando uma avaliação com nota baixa chega. Você configura o limite (padrão: notas 1 ou 2).',
  },
  {
    q: 'Posso ter mais de um ponto de avaliação?',
    a: 'No plano gratuito, 1 ponto. Planos pagos (em breve) liberam pontos ilimitados — ideal para quem tem vários balcões, mesas ou filiais.',
  },
  {
    q: 'Como coloco o QR Code no balcão?',
    a: 'Após criar o ponto, você baixa o QR Code em PNG, SVG ou PDF formato A6 (tamanho cartão postal) direto do painel. Imprime, plastifica se quiser, e coloca onde o cliente vai ver.',
  },
  {
    q: 'Os dados são meus? Posso exportar?',
    a: 'Sim. Você pode exportar todas as avaliações em CSV a qualquer momento, com filtro por data e ponto. Seus dados, sua posse.',
  },
  {
    q: 'Funciona para qual tipo de negócio?',
    a: 'Qualquer negócio com atendimento presencial: restaurantes, lanchonetes, barbearias, salões de beleza, petshops, farmácias, consultórios, lojas. Se tem cliente na frente, funciona.',
  },
]

type FaqRowProps = {
  item: FaqItem
  index: number
  isOpen: boolean
  visible: boolean
  onToggle: (index: number) => void
}

function FaqRow({ item, index, isOpen, visible, onToggle }: FaqRowProps) {
  const answerRef = useRef<HTMLDivElement | null>(null)
  const [maxHeight, setMaxHeight] = useState<number>(0)

  useEffect(() => {
    if (!answerRef.current) return
    if (isOpen) {
      setMaxHeight(answerRef.current.scrollHeight)
    } else {
      setMaxHeight(0)
    }
  }, [isOpen, item.a])

  const delayMs = index * 80

  return (
    <div
      style={{
        transition:
          'opacity 0.5s ease, transform 0.5s ease, border-color 0.3s ease, background-color 0.3s ease',
        transitionDelay: `${delayMs}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
      }}
      className={[
        'soft-card overflow-hidden border-l-4',
        isOpen
          ? 'border-l-[#1E3A8A] bg-blue-50/50 dark:border-l-blue-400 dark:bg-slate-800/50'
          : 'border-l-transparent bg-white dark:bg-slate-800',
      ].join(' ')}
    >
      <button
        type="button"
        onClick={() => onToggle(index)}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${index}`}
        className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-5 text-left transition-colors duration-200 hover:bg-slate-50/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1E3A8A] dark:hover:bg-slate-700/40"
      >
        <span className="text-base font-semibold text-slate-900 dark:text-slate-50 sm:text-lg">
          {item.q}
        </span>
        <span
          aria-hidden="true"
          style={{
            transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease, background-color 0.3s ease, color 0.3s ease',
          }}
          className={[
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xl font-light leading-none',
            isOpen
              ? 'bg-[#1E3A8A] text-white dark:bg-blue-500'
              : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
          ].join(' ')}
        >
          +
        </span>
      </button>

      <div
        id={`faq-answer-${index}`}
        role="region"
        style={{
          maxHeight: `${maxHeight}px`,
          transition: 'max-height 0.35s ease',
          overflow: 'hidden',
        }}
      >
        <div ref={answerRef} className="px-5 pb-5">
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
            {item.a}
          </p>
        </div>
      </div>
    </div>
  )
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef<HTMLElement | null>(null)

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
      { threshold: 0.12 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  function toggle(index: number) {
    setOpenIndex((prev) => (prev === index ? null : index))
  }

  return (
    <section
      ref={sectionRef}
      id="faq"
      className="bg-slate-50 px-4 py-20 dark:bg-slate-900 sm:py-28"
    >
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <span aria-hidden>❓</span>
            Tire suas dúvidas
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl md:text-5xl">
            Perguntas frequentes
          </h2>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-300 sm:text-lg">
            Respostas rápidas para as dúvidas mais comuns.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {FAQS.map((item, index) => (
            <FaqRow
              key={item.q}
              item={item}
              index={index}
              isOpen={openIndex === index}
              visible={visible}
              onToggle={toggle}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

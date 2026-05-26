import type { JSX } from 'react'

const TRUST_ITEMS: ReadonlyArray<string> = [
  '📱 Sem app',
  '👤 Sem cadastro',
  '⏱️ 5 segundos por avaliação',
  '🔔 Alertas em tempo real',
  '📊 Dashboard completo',
  '🆓 Grátis para começar',
  '📄 QR Code imprimível',
  '🔒 100% anônimo',
  '💬 Comentários dos clientes',
  '📥 Exportação CSV',
  '✅ Sem complicação',
]

export function TrustBar(): JSX.Element {
  const loop = [...TRUST_ITEMS, ...TRUST_ITEMS]

  return (
    <section
      aria-label="Benefícios do produto"
      className="relative overflow-hidden border-y border-white/10 bg-[#1E3A8A] py-3"
      style={{
        WebkitMaskImage:
          'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
        maskImage:
          'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
      }}
    >
      <div
        className="flex w-max items-center gap-10 whitespace-nowrap text-sm font-medium text-white/75"
        style={{
          animation: 'avalie-marquee 25s linear infinite',
        }}
        aria-hidden="true"
      >
        {loop.map((item, i) => (
          <div key={`${item}-${i}`} className="flex items-center gap-10">
            <span className="tracking-wide">{item}</span>
            <span className="text-white/30" aria-hidden="true">
              •
            </span>
          </div>
        ))}
      </div>

      <span className="sr-only">
        {TRUST_ITEMS.join(', ')}
      </span>

      <style>{`
        @keyframes avalie-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="avalie-marquee"] {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  )
}

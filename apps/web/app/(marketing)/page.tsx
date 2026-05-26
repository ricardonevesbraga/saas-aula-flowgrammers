import {
  HeroSection,
  TrustBar,
  PainSection,
  HowItWorks,
  FeaturesSection,
  PricingSection,
  FAQ,
  FooterMarketing,
} from '@/components/marketing'

export const revalidate = 3600

export default function LandingPage() {
  return (
    <main>
      <HeroSection />
      <TrustBar />
      <PainSection />
      <div id="como-funciona">
        <HowItWorks />
      </div>
      <FeaturesSection id="funcionalidades" />
      <PricingSection id="precos" />
      <FAQ />

      <section className="relative overflow-hidden bg-[#1E3A8A] px-4 py-20 text-center sm:py-28">
        <style>{`
          @keyframes cta-pulse-ring {
            0% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.55), 0 12px 32px rgba(0,0,0,0.25); }
            70% { box-shadow: 0 0 0 18px rgba(245, 158, 11, 0), 0 12px 32px rgba(0,0,0,0.25); }
            100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0), 0 12px 32px rgba(0,0,0,0.25); }
          }
          .cta-pulse {
            animation: cta-pulse-ring 2.2s ease-out infinite;
          }
        `}</style>

        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Comece hoje. É grátis.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-blue-100/90 sm:text-lg">
            Em 2 minutos você tem o QR Code na mão. Sem cartão de crédito, sem burocracia.
          </p>

          <div className="mt-10 flex justify-center">
            <a
              href="/signup"
              className="cta-pulse inline-flex items-center justify-center rounded-xl bg-yellow-500 px-8 py-4 text-base font-bold text-slate-900 transition-all duration-200 hover:bg-yellow-400 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 focus:ring-offset-[#1E3A8A] sm:text-lg"
            >
              Criar minha conta agora →
            </a>
          </div>
        </div>
      </section>

      <FooterMarketing />
    </main>
  )
}

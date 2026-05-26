import Image from 'next/image'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

export const dynamic = 'force-dynamic'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen auth-bg flex items-center justify-center p-4">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Image
            src="/logo.png"
            alt="Avalie Meu Atendimento"
            width={1024}
            height={1024}
            priority
            className="h-40 w-auto"
          />
        </div>
        {children}
      </div>
    </div>
  )
}

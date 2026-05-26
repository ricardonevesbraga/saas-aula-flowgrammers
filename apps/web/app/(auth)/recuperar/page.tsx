'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'

const recuperarSchema = z.object({
  email: z.string().email('Email inválido'),
})

type RecuperarFormData = z.infer<typeof recuperarSchema>

export default function RecuperarPage() {
  const supabase = createClient()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RecuperarFormData>({
    resolver: zodResolver(recuperarSchema),
  })

  const onSubmit = async (data: RecuperarFormData) => {
    setError(null)
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/conta`,
    })
    if (error) {
      setError('Não foi possível enviar o link. Tente novamente em alguns minutos.')
      return
    }
    setSuccess(true)
  }

  if (success) {
    return (
      <Card className="p-6 text-center">
        <div className="text-4xl mb-4">✉️</div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Email enviado!</h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
          Se este email estiver cadastrado, você receberá um link para redefinir sua senha.
        </p>
        <Link href="/login" className="text-blue-700 dark:text-blue-400 hover:underline text-sm font-medium">
          Voltar para o login
        </Link>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Recuperar senha</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
        Digite seu email e enviaremos um link para redefinir sua senha.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            autoComplete="email"
            {...register('email')}
          />
          {errors.email && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.email.message}</p>}
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:border-red-900 dark:text-red-300">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Enviando...' : 'Enviar link de recuperação'}
        </Button>
      </form>

      <div className="mt-4 text-center">
        <Link href="/login" className="text-sm text-blue-700 dark:text-blue-400 hover:underline">
          Voltar para o login
        </Link>
      </div>
    </Card>
  )
}

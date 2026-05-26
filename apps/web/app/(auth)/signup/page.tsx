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

const signupSchema = z
  .object({
    name: z.string().min(2, 'Nome muito curto'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
    confirmPassword: z.string().min(6, 'Confirme sua senha'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

type SignupFormData = z.infer<typeof signupSchema>

export default function SignupPage() {
  const supabase = createClient()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (data: SignupFormData) => {
    setError(null)
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { name: data.name },
      },
    })
    if (error) {
      setError('Não foi possível criar a conta. Verifique os dados e tente novamente.')
      return
    }
    setSuccess(true)
  }

  if (success) {
    return (
      <Card className="p-6 text-center">
        <div className="text-4xl mb-4">📧</div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Verifique seu email</h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
          Enviamos um link de confirmação para o seu email. Clique no link para ativar sua conta.
        </p>
        <Link href="/login" className="text-blue-700 dark:text-blue-400 hover:underline text-sm font-medium">
          Voltar para o login
        </Link>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">Criar conta</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Nome
          </label>
          <Input id="name" type="text" placeholder="Seu nome" autoComplete="name" {...register('name')} />
          {errors.name && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Email
          </label>
          <Input id="email" type="email" placeholder="seu@email.com" autoComplete="email" {...register('email')} />
          {errors.email && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Senha
          </label>
          <Input id="password" type="password" placeholder="••••••••" autoComplete="new-password" {...register('password')} />
          {errors.password && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.password.message}</p>}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Confirmar senha
          </label>
          <Input id="confirmPassword" type="password" placeholder="••••••••" autoComplete="new-password" {...register('confirmPassword')} />
          {errors.confirmPassword && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.confirmPassword.message}</p>}
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:border-red-900 dark:text-red-300">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Criando conta...' : 'Criar conta'}
        </Button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Já tem conta?{' '}
          <Link href="/login" className="text-blue-700 dark:text-blue-400 hover:underline font-medium">
            Entrar
          </Link>
        </p>
      </div>
    </Card>
  )
}

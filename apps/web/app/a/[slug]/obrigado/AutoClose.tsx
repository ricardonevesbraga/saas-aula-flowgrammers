'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface Props {
  delayMs: number
}

export function AutoClose({ delayMs }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const [seconds, setSeconds] = useState(Math.round(delayMs / 1000))

  useEffect(() => {
    // Extract slug from /a/[slug]/obrigado
    const slug = pathname.split('/')[2]
    const target = slug ? `/a/${slug}` : '/'

    const interval = setInterval(() => {
      setSeconds((s) => Math.max(0, s - 1))
    }, 1000)

    const timer = setTimeout(() => {
      router.replace(target)
    }, delayMs)

    return () => {
      clearInterval(interval)
      clearTimeout(timer)
    }
  }, [delayMs, pathname, router])

  return (
    <p className="mt-2 text-xs text-slate-400">
      Redirecionando em {seconds}s...
    </p>
  )
}

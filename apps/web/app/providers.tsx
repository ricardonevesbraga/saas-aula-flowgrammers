'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider, type ThemeProviderProps } from 'next-themes'
import React, { useState } from 'react'

// next-themes ThemeProvider types conflict with React 19 JSX — use explicit cast
const TP = ThemeProvider as React.ComponentType<ThemeProviderProps & { children?: React.ReactNode }>

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 60_000, retry: 1 },
        },
      })
  )

  return (
    <TP attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </TP>
  )
}

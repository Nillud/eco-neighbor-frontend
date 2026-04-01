'use client'

import { PropsWithChildren } from 'react'

import { AuthProvider } from './auth-provider'
import QueryProvider from './query-provider'

export default function MainProvider({ children }: PropsWithChildren) {
  return (
    <QueryProvider>
      <AuthProvider>{children}</AuthProvider>
    </QueryProvider>
  )
}

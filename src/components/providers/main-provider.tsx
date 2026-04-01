'use client'

import { PropsWithChildren } from 'react'

import QueryProvider from './query-provider'

export default function MainProvider({ children }: PropsWithChildren) {
  return <QueryProvider>{children}</QueryProvider>
}

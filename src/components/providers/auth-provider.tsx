'use client'

import { useUser } from '@/store/user.store'
import { PropsWithChildren, useEffect } from 'react'

export function AuthProvider({ children }: PropsWithChildren) {
  const checkAuth = useUser(state => state.checkAuth)

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return <>{children}</>
}

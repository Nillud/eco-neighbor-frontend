'use client'

import { useUser } from '@/store/user.store'
import { PropsWithChildren, useEffect } from 'react'

export function AuthProvider({ children }: PropsWithChildren) {
  const checkAuth = useUser(state => state.checkAuth)

  useEffect(() => {
    const isMaybeAuth = localStorage
      .getItem('user-storage')
      ?.includes('"isAuth":true')
      
    if (isMaybeAuth) checkAuth()
  }, [checkAuth])

  return <>{children}</>
}

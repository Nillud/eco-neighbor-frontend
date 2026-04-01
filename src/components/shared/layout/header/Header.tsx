/* eslint-disable react-hooks/set-state-in-effect */
import { useUser } from '@/store/user.store'
import { useEffect, useState } from 'react'

import { Logo } from './Logo'
import { UserPanel } from './UserPanel'
import { Navigation } from './navigation/Navigation'
import { MobileNav } from './navigation/MobileNav'

export function Header() {
  const { user, isAuth } = useUser()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <header className="h-24" />

  return (
    <header className="mb-4 flex items-center justify-between border-b py-4 md:border-none md:py-8">
      <div className="flex items-center gap-2 md:gap-8">
        {/* Мобильный бургер появляется только на экранах < md */}
        <div className="md:hidden">
          <MobileNav isAuth={isAuth} />
        </div>

        <Logo />

        {/* Десктопная навигация скрыта на мобилках */}
        <div className="hidden md:block">
          <Navigation isAuth={isAuth} />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <UserPanel user={user} />
      </div>
    </header>
  )
}

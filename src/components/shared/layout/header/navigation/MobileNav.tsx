'use client'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { useUser } from '@/store/user.store'
import { LogOut, Menu } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import { Logo } from '../Logo'
// bun add lucide-react
import { PUBLIC_NAVIGATION, USER_NAVIGATION } from './navigation.data'

interface Props {
  isAuth: boolean
}

export function MobileNav({ isAuth }: Props) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const logout = useUser(state => state.logout)

  const items = isAuth
    ? [...PUBLIC_NAVIGATION, ...USER_NAVIGATION]
    : PUBLIC_NAVIGATION

  const handleLogout = () => {
    logout()
    setOpen(false)
  }

  return (
    <Sheet
      open={open}
      onOpenChange={setOpen}
    >
      <SheetTrigger asChild>
        <button className="-ml-2 p-2 text-slate-600">
          <Menu size={24} />
        </button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-75 sm:w-100"
      >
        <SheetHeader>
          <SheetTitle className="text-left font-bold text-green-600">
            <Logo />
          </SheetTitle>
        </SheetHeader>
        <nav className="mt-8 flex flex-col gap-4">
          {items.map(item => (
            <Link
              key={item.link}
              href={item.link}
              onClick={() => setOpen(false)} // Закрываем при клике
              className={`border-b border-slate-50 px-4 py-2 text-lg font-medium ${
                pathname === item.link ? 'text-green-600' : 'text-slate-900'
              }`}
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {isAuth && (
          <div className="mt-auto border-t border-slate-100 pt-4 pb-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 font-semibold text-red-600 transition-colors active:bg-red-50"
            >
              <LogOut size={20} />
              Выйти из системы
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
